import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CustomCursor } from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import ScrollNav from "@/components/ScrollNav";
import AudioToggle from "@/components/AudioToggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TerminalLoader from "@/components/TerminalLoader";

const queryClient = new QueryClient();

const App = () => {
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("sparsh_loaded");
    }
    return true;
  });

  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (typeof window !== "undefined") {
        (window as any).__sparsh_loader_complete = true;
        window.dispatchEvent(new Event("loaderComplete"));
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {showLoader && (
            <TerminalLoader onComplete={() => setShowLoader(false)} />
          )}
          <Toaster />
          <CustomCursor />
          <CommandPalette />
          <ScrollNav />
          <AudioToggle />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
