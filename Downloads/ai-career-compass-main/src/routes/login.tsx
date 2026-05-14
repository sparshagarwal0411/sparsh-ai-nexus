import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) return toast.error(result.error.message ?? "Google sign-in failed");
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to see your matches.">
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2"><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="space-y-2"><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">{loading ? "Signing in…" : "Sign in"}</Button>
    </form>
    <Divider />
    <Button variant="outline" className="w-full" onClick={onGoogle}>Continue with Google</Button>
    <p className="mt-6 text-center text-sm text-muted-foreground">No account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: any) {
  return (
    <div className="relative grid min-h-screen place-items-center bg-background bg-aurora px-4">
      <Link to="/" className="absolute left-6 top-6 flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-xl bg-gradient-primary shadow-glow"><Sparkles className="size-4 text-primary-foreground" /></div>
        <span className="font-display text-lg font-bold">Internly</span>
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl shadow-elegant">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}

function Divider() {
  return <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>;
}
