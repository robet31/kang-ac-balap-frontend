import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { LandingPage } from "./components/LandingPage";
import { LinktreePage } from "./components/LinktreePage";

// Views: landing = main site, links = linktree page
type View = "landing" | "links";

function AppContent() {
  const [currentView, setCurrentView] = useState<View>("landing");

  // Simple hash-based routing for /links
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#links" || window.location.pathname === "/links") {
        setCurrentView("links");
      } else {
        setCurrentView("landing");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      {currentView === "links" ? (
        <LinktreePage />
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}