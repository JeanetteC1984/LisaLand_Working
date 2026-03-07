import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CyberLog from "@/pages/CyberLog";
import AuthPage from "@/pages/AuthPage";

function App() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => {
        if (r.ok) return r.json();
        throw new Error("not authed");
      })
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0418", color: "#e040fb", fontFamily: "'Comfortaa', sans-serif", fontSize: 18 }}>
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {user ? (
          <CyberLog user={user} onLogout={() => setUser(null)} />
        ) : (
          <AuthPage onAuth={(u) => setUser(u)} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
