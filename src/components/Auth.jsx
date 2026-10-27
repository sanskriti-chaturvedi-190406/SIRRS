import { useState } from "react";

function Auth({ onLogin, onRegister, error }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (mode === "register") await onRegister({ name: name.trim(), email: email.trim().toLowerCase(), password });
    else await onLogin(email.trim().toLowerCase(), password);
  };
  return <main className="auth-screen"><form className="auth-card" onSubmit={submit}>
    <div className="auth-brand"><span>🛡️</span><strong>SIRRS</strong></div>
    <p className="eyebrow">SECURE INCIDENT RESPONSE</p><h1>{mode === "login" ? "Welcome back" : "Create a reporter account"}</h1>
    <p className="auth-copy">{mode === "login" ? "Sign in to report or investigate security incidents." : "Register with your email to submit and track reports."}</p>
    {mode === "register" && <><label htmlFor="auth-name">Full name</label><input id="auth-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></>}
    <label htmlFor="auth-email">Email address</label><input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    <label htmlFor="auth-password">Password</label><input id="auth-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required />
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="button-primary auth-submit" type="submit">{mode === "login" ? "Sign in" : "Create account"}</button>
    <p className="auth-switch">{mode === "login" ? "New here?" : "Already registered?"} <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create an account" : "Sign in"}</button></p>
    <details className="demo-credentials"><summary>Demo account access</summary><p>Admin: admin@sirrs.demo / SIRRSAdmin!2026</p><p>Reporter: riley@sirrs.demo / Reporter!2026</p><p>Reporter: jordan.reporter@sirrs.demo / JordanReport!2026</p><p>Reporter: taylor.reporter@sirrs.demo / TaylorReport!2026</p><p>Reporter: jamie.rivera@sirrs.demo / JamieReport!2026</p><p>Reporter: noah.williams@sirrs.demo / NoahReport!2026</p><p>Reporter: priya.shah@sirrs.demo / PriyaReport!2026</p><p>Analyst: alex@sirrs.demo / Analyst!2026</p><p>Analyst: casey.analyst@sirrs.demo / CaseyAnalyze!2026</p><p>Analyst: avery.analyst@sirrs.demo / AveryAnalyze!2026</p><p>Analyst: sam.okafor@sirrs.demo / SamAnalyze!2026</p><p>Analyst: mina.park@sirrs.demo / MinaAnalyze!2026</p><p>Analyst: leo.fischer@sirrs.demo / LeoAnalyze!2026</p></details>
    <p className="prototype-note">Frontend prototype: account data is stored in this browser. Email ownership is not verified.</p>
  </form></main>;
}
export default Auth;

