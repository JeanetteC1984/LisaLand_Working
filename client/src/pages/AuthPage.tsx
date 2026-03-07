import { useState } from "react";

interface AuthPageProps {
  onAuth: (user: { id: string; username: string }) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }
      onAuth(data);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" data-testid="auth-page">
      <div className="auth-card" data-testid="auth-card">
        <div className="auth-logo">Glow Up</div>
        <div className="auth-subtitle">Your Digital Journal</div>
        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === "login" ? " active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
            data-testid="tab-login"
          >
            Sign In
          </button>
          <button
            className={`auth-tab${mode === "register" ? " active" : ""}`}
            onClick={() => { setMode("register"); setError(""); }}
            data-testid="tab-register"
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="auth-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            data-testid="input-username"
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            data-testid="input-password"
          />
          {error && <div className="auth-error" data-testid="auth-error">{error}</div>}
          <button
            className="auth-submit"
            type="submit"
            disabled={loading || !username || !password}
            data-testid="btn-submit"
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="auth-footer">
          {mode === "login" ? (
            <span>Don't have an account? <button className="auth-link" onClick={() => { setMode("register"); setError(""); }} data-testid="link-register">Sign up</button></span>
          ) : (
            <span>Already have an account? <button className="auth-link" onClick={() => { setMode("login"); setError(""); }} data-testid="link-login">Sign in</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
