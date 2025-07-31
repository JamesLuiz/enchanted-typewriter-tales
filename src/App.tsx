import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { Stories } from "./pages/Stories";
import { Create } from "./pages/Create";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleToggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="enchanted-tales-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BackgroundMusic isPlaying={isMusicPlaying} />
          <BrowserRouter>
            <Navigation 
              isMusicPlaying={isMusicPlaying} 
              onToggleMusic={handleToggleMusic} 
            />
            <Routes>
              <Route path="/" element={<Stories />} />
              <Route path="/create" element={<Create />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
