import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  component: () => (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-aurora opacity-30" />
      <Navbar />
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6"><Outlet /></main>
    </div>
  ),
});
