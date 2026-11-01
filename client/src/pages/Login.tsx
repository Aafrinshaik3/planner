import { ArrowLeft, Check, Github, Globe2, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Login() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const displayName = user?.name || user?.email || "your account";

  return (
    <main className="auth-page">
      <div className="auth-orbit auth-orbit-one" />
      <div className="auth-orbit auth-orbit-two" />
      <div className="auth-panel">
        <Link href="/" className="auth-back"><ArrowLeft size={15} /> Back to Celebrate</Link>
        <div className="auth-brand"><span className="brand-seal"><span>✦</span></span><span className="brand-wordmark">celebrate</span></div>
        <span className="idea-orb auth-orb"><Sparkles size={19} /></span>
        <span className="eyebrow">Your planning companion</span>
        <h1>Keep the good<br /><em>stuff close.</em></h1>
        {isAuthenticated ? (
          <div className="auth-signed-in">
            <div className="auth-check"><Check size={17} /></div>
            <strong>You’re signed in as {displayName}.</strong>
            <p>Your saved event plans, budgets, ideas, and vendor notes are ready whenever you are.</p>
            <div className="auth-actions"><Link href="/" className="primary-button">Open my workspace</Link><button className="quiet-action" onClick={() => void logout()}>Sign out</button></div>
          </div>
        ) : (
          <>
            <p className="auth-intro">Sign in to keep your event plans synced and pick up right where you left off.</p>
            <button className="auth-login-button" onClick={() => startLogin()} disabled={loading}><LockKeyhole size={17} /> {loading ? "Checking your session…" : "Continue with Manus"}</button>
            <div className="auth-divider"><span>or choose a provider</span></div>
            <div className="provider-grid"><button className="provider-button" onClick={() => startLogin()} disabled={loading}><span className="provider-mark provider-google">G</span> Google</button><button className="provider-button" onClick={() => startLogin()} disabled={loading}><Github size={17} /> GitHub</button><button className="provider-button provider-button-wide" onClick={() => startLogin()} disabled={loading}><Globe2 size={17} /> Other sign-in options</button></div>
            <p className="auth-note">Provider choices continue through the secure Manus sign-in portal. Celebrate never stores your password.</p>
          </>
        )}
        <div className="auth-perks"><span><Check size={13} /> Saved plans</span><span><Check size={13} /> Smart ideas</span><span><Check size={13} /> Gentle reminders</span></div>
      </div>
    </main>
  );
}
