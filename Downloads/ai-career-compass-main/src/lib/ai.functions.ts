import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

async function callAI(messages: any[], tools?: any[], tool_choice?: any) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, ...(tools ? { tools, tool_choice } : {}) }),
  });

  if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
  if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
  if (!res.ok) {
    const t = await res.text();
    console.error("AI gateway error:", res.status, t);
    throw new Error("AI service is unavailable right now.");
  }
  return res.json();
}

const ResumeSchema = z.object({ resumeText: z.string().min(50).max(60_000) });

export const extractResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ResumeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const tools = [
      {
        type: "function",
        function: {
          name: "store_resume",
          description: "Store the structured resume profile",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "2-sentence professional summary" },
              skills: { type: "array", items: { type: "string" }, description: "All technical & soft skills" },
              projects: {
                type: "array",
                items: {
                  type: "object",
                  properties: { name: { type: "string" }, description: { type: "string" }, tech: { type: "array", items: { type: "string" } } },
                  required: ["name", "description"],
                  additionalProperties: false,
                },
              },
              education: {
                type: "array",
                items: {
                  type: "object",
                  properties: { degree: { type: "string" }, institution: { type: "string" }, year: { type: "string" } },
                  required: ["degree", "institution"],
                  additionalProperties: false,
                },
              },
              experience: {
                type: "array",
                items: {
                  type: "object",
                  properties: { role: { type: "string" }, company: { type: "string" }, duration: { type: "string" }, highlights: { type: "array", items: { type: "string" } } },
                  required: ["role", "company"],
                  additionalProperties: false,
                },
              },
              interests: { type: "array", items: { type: "string" } },
              career_suggestions: {
                type: "array",
                description: "3-5 career paths matching this profile, each with reasoning and next steps",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    why: { type: "string" },
                    next_steps: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "why", "next_steps"],
                  additionalProperties: false,
                },
              },
            },
            required: ["summary", "skills", "projects", "education", "experience", "interests", "career_suggestions"],
            additionalProperties: false,
          },
        },
      },
    ];

    const result = await callAI(
      [
        { role: "system", content: "You are an expert resume parser and career advisor for students. Extract structured info and suggest career paths. Always call store_resume." },
        { role: "user", content: `Parse this resume and store the structured profile:\n\n${data.resumeText}` },
      ],
      tools,
      { type: "function", function: { name: "store_resume" } },
    );

    const call = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI did not return structured data. Try again.");
    const parsed = JSON.parse(call.function.arguments);

    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("resumes")
      .insert({
        user_id: userId,
        raw_text: data.resumeText.slice(0, 50_000),
        summary: parsed.summary,
        skills: parsed.skills,
        projects: parsed.projects,
        education: parsed.education,
        experience: parsed.experience,
        interests: parsed.interests,
        career_suggestions: parsed.career_suggestions,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

const MatchSchema = z.object({
  resumeId: z.string().uuid(),
  internships: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        company: z.string(),
        requiredSkills: z.array(z.string()),
        niceToHave: z.array(z.string()),
        description: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .max(20),
});

export const matchInternships = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => MatchSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: resume, error } = await supabase
      .from("resumes")
      .select("skills, projects, interests, summary, experience")
      .eq("id", data.resumeId)
      .single();
    if (error || !resume) throw new Error("Resume not found");

    const tools = [
      {
        type: "function",
        function: {
          name: "store_matches",
          description: "Return ranked internship matches",
          parameters: {
            type: "object",
            properties: {
              matches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    match_score: { type: "number", description: "0-100 match percentage" },
                    eligibility: { type: "string", enum: ["strong", "moderate", "stretch"] },
                    selection_chance: { type: "string", enum: ["high", "medium", "low"] },
                    explanation: { type: "string", description: "1-2 sentence why this fits" },
                    matched_skills: { type: "array", items: { type: "string" } },
                    missing_skills: { type: "array", items: { type: "string" }, description: "Required skills the candidate is missing" },
                    nearly_qualified: { type: "boolean", description: "True if missing only 1-2 skills" },
                  },
                  required: ["id", "match_score", "eligibility", "selection_chance", "explanation", "matched_skills", "missing_skills", "nearly_qualified"],
                  additionalProperties: false,
                },
              },
            },
            required: ["matches"],
            additionalProperties: false,
          },
        },
      },
    ];

    const profile = {
      skills: resume.skills,
      projects: resume.projects,
      interests: resume.interests,
      summary: resume.summary,
      experience: resume.experience,
    };

    const result = await callAI(
      [
        {
          role: "system",
          content:
            "You are an internship matching engine. For each internship, score 0-100 based on skill overlap, project relevance, and interest alignment. Be honest. Flag nearly-qualified candidates (missing only 1-2 skills) — these are the 'almost-there' opportunities students should focus on. Always call store_matches with a result for EVERY internship provided.",
        },
        {
          role: "user",
          content: `Candidate profile:\n${JSON.stringify(profile)}\n\nInternships:\n${JSON.stringify(data.internships)}`,
        },
      ],
      tools,
      { type: "function", function: { name: "store_matches" } },
    );

    const call = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI did not return matches. Try again.");
    const parsed = JSON.parse(call.function.arguments);
    return parsed.matches as Array<{
      id: string;
      match_score: number;
      eligibility: "strong" | "moderate" | "stretch";
      selection_chance: "high" | "medium" | "low";
      explanation: string;
      matched_skills: string[];
      missing_skills: string[];
      nearly_qualified: boolean;
    }>;
  });

export const getLatestResume = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const SaveSchema = z.object({
  internship_id: z.string(),
  internship_data: z.any(),
  match_score: z.number().nullable().optional(),
});

export const saveInternship = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => SaveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("saved_internships").upsert(
      {
        user_id: userId,
        internship_id: data.internship_id,
        internship_data: data.internship_data,
        match_score: data.match_score ?? null,
      },
      { onConflict: "user_id,internship_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const UnsaveSchema = z.object({ internship_id: z.string() });
export const unsaveInternship = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => UnsaveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("saved_internships").delete().eq("user_id", userId).eq("internship_id", data.internship_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listSaved = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("saved_internships")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
