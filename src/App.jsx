import { useEffect, useState } from "react";
import "./App.css";
import "./theme.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import IncidentForm from "./components/IncidentForm";
import Incidents from "./components/Incidents";
import ActivityLogs from "./components/ActivityLogs";
import Profile from "./components/Profile";
import Auth from "./components/Auth";
import { removeEvidence, saveEvidence } from "./lib/evidenceStore";
import Analytics from "./components/Analytics";
import UserManagement from "./components/UserManagement";

const DB_KEY = "sirrs.frontend.v1";
const demoUsers = [
  { id: "admin-1", name: "Ananya Sharma", email: "admin@sirrs.demo", role: "Admin", password: "SIRRSAdmin!2026" },
  { id: "reporter-1", name: "Aarav Mehta", email: "riley@sirrs.demo", role: "Reporter", password: "Reporter!2026" },
  { id: "analyst-1", name: "Riya Verma", email: "alex@sirrs.demo", role: "Analyst", password: "Analyst!2026" },
  { id: "reporter-2", name: "Kabir Singh", email: "jordan.reporter@sirrs.demo", role: "Reporter", password: "JordanReport!2026" },
  { id: "reporter-3", name: "Nisha Gupta", email: "taylor.reporter@sirrs.demo", role: "Reporter", password: "TaylorReport!2026" },
  { id: "analyst-2", name: "Arjun Patel", email: "casey.analyst@sirrs.demo", role: "Analyst", password: "CaseyAnalyze!2026" },
  { id: "analyst-3", name: "Isha Desai", email: "avery.analyst@sirrs.demo", role: "Analyst", password: "AveryAnalyze!2026" },
  { id: "reporter-4", name: "Meera Iyer", email: "jamie.rivera@sirrs.demo", role: "Reporter", password: "JamieReport!2026" },
  { id: "reporter-5", name: "Vivaan Rao", email: "noah.williams@sirrs.demo", role: "Reporter", password: "NoahReport!2026" },
  { id: "reporter-6", name: "Priya Shah", email: "priya.shah@sirrs.demo", role: "Reporter", password: "PriyaReport!2026" },
  { id: "analyst-4", name: "Dev Malhotra", email: "sam.okafor@sirrs.demo", role: "Analyst", password: "SamAnalyze!2026" },
  { id: "analyst-5", name: "Aditi Nair", email: "mina.park@sirrs.demo", role: "Analyst", password: "MinaAnalyze!2026" },
  { id: "analyst-6", name: "Ishaan Joshi", email: "leo.fischer@sirrs.demo", role: "Analyst", password: "LeoAnalyze!2026" },
];
const previousDemoNames = {
  "Morgan Admin": "Ananya Sharma",
  "Riley Reporter": "Aarav Mehta",
  "Alex Analyst": "Riya Verma",
  "Jordan Lee": "Kabir Singh",
  "Taylor Morgan": "Nisha Gupta",
  "Casey Patel": "Arjun Patel",
  "Avery Chen": "Isha Desai",
  "Jamie Rivera": "Meera Iyer",
  "Noah Williams": "Vivaan Rao",
  "Sam Okafor": "Dev Malhotra",
  "Mina Park": "Aditi Nair",
  "Leo Fischer": "Ishaan Joshi",
};
const demoIncidents = [
  { id: "INC-1001", title: "Suspicious login from a new location", category: "Unauthorized Access", severity: "High", status: "In Progress", reporter: "Aarav Mehta", reporterId: "reporter-1", reporterRole: "Reporter", assignedTo: "analyst-1", publicUpdate: "Investigation started. We are reviewing the sign-in history.", internalNotes: [{ id: "note-1", author: "Riya Verma", body: "Compare source IP against recent VPN exit nodes.", time: "2026-10-25 10:20" }] },
  { id: "INC-1002", title: "Phishing email reported by finance", category: "Phishing", severity: "Medium", status: "Assigned", reporter: "Aarav Mehta", reporterId: "reporter-1", reporterRole: "Reporter", assignedTo: "analyst-1", publicUpdate: "Your report is queued for review.", internalNotes: [] },
  { id: "INC-1003", title: "Unexpected outbound network traffic", category: "Network Security", severity: "Critical", status: "Submitted", reporter: "Aarav Mehta", reporterId: "reporter-1", reporterRole: "Reporter", assignedTo: "", publicUpdate: "", internalNotes: [] },
  { id: "INC-1004", title: "Malware detected on workstation", category: "Malware", severity: "High", status: "Resolved", reporter: "Aarav Mehta", reporterId: "reporter-1", reporterRole: "Reporter", assignedTo: "analyst-1", publicUpdate: "The affected device was isolated and cleaned.", internalNotes: [] },
  { id: "INC-1005", title: "Unusual access to shared files", category: "Unauthorized Access", severity: "Medium", status: "In Progress", reporter: "Kabir Singh", reporterId: "reporter-2", reporterRole: "Reporter", assignedTo: "analyst-2", publicUpdate: "The access history is being reviewed.", internalNotes: [] },
  { id: "INC-1006", title: "Suspicious attachment in vendor email", category: "Phishing", severity: "High", status: "Assigned", reporter: "Nisha Gupta", reporterId: "reporter-3", reporterRole: "Reporter", assignedTo: "analyst-3", publicUpdate: "The attachment has been isolated for analysis.", internalNotes: [] },
  { id: "INC-1007", title: "Unexpected sign-in prompt", category: "Account Security", severity: "Low", status: "Submitted", reporter: "Kabir Singh", reporterId: "reporter-2", reporterRole: "Reporter", assignedTo: "", publicUpdate: "", internalNotes: [] },
  { id: "INC-1008", title: "Possible data exposure in shared folder", category: "Data Exposure", severity: "Medium", status: "Submitted", reporter: "Nisha Gupta", reporterId: "reporter-3", reporterRole: "Reporter", assignedTo: "", publicUpdate: "", internalNotes: [] },
  { id: "INC-1009", title: "Repeated MFA prompts reported by staff", category: "Account Security", severity: "Medium", status: "In Progress", reporter: "Meera Iyer", reporterId: "reporter-4", reporterRole: "Reporter", assignedTo: "analyst-4", publicUpdate: "We are checking the authentication logs for unusual activity.", internalNotes: [] },
  { id: "INC-1010", title: "Unrecognized device on corporate Wi-Fi", category: "Network Security", severity: "Low", status: "Assigned", reporter: "Vivaan Rao", reporterId: "reporter-5", reporterRole: "Reporter", assignedTo: "analyst-5", publicUpdate: "The device is being identified by the network team.", internalNotes: [] },
  { id: "INC-1011", title: "Sensitive document shared externally", category: "Data Exposure", severity: "High", status: "Submitted", reporter: "Priya Shah", reporterId: "reporter-6", reporterRole: "Reporter", assignedTo: "", publicUpdate: "", internalNotes: [] },
  { id: "INC-1012", title: "Endpoint protection alert on design laptop", category: "Malware", severity: "Critical", status: "In Progress", reporter: "Meera Iyer", reporterId: "reporter-4", reporterRole: "Reporter", assignedTo: "analyst-6", publicUpdate: "The endpoint has been isolated while the alert is reviewed.", internalNotes: [] },
  { id: "INC-1013", title: "Suspicious password reset email", category: "Phishing", severity: "Medium", status: "Assigned", reporter: "Vivaan Rao", reporterId: "reporter-5", reporterRole: "Reporter", assignedTo: "analyst-4", publicUpdate: "The sender details are under review.", internalNotes: [] },
  { id: "INC-1014", title: "Unusual access to finance application", category: "Unauthorized Access", severity: "High", status: "Resolved", reporter: "Priya Shah", reporterId: "reporter-6", reporterRole: "Reporter", assignedTo: "analyst-5", publicUpdate: "Access was revoked and the account owner confirmed the activity was not theirs.", internalNotes: [] },
  { id: "INC-1015", title: "Possible data transfer to removable media", category: "Data Exposure", severity: "Medium", status: "Submitted", reporter: "Meera Iyer", reporterId: "reporter-4", reporterRole: "Reporter", assignedTo: "", publicUpdate: "", internalNotes: [] },
  { id: "INC-1016", title: "Unexpected DNS requests from lab workstation", category: "Network Security", severity: "Low", status: "Assigned", reporter: "Vivaan Rao", reporterId: "reporter-5", reporterRole: "Reporter", assignedTo: "analyst-6", publicUpdate: "The workstation activity is being compared with normal lab traffic.", internalNotes: [] },
];
const makeDemoActivities = () => {
  const ago = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toLocaleString();
  const events = [
    { incident: demoIncidents[0], message: "Investigation update added", hours: 1.5, actor: demoUsers[2] },
    { incident: demoIncidents[1], message: "Incident assigned to Riya Verma", hours: 2.4, actor: demoUsers[0] },
    { incident: demoIncidents[0], message: "Severity reviewed: High", hours: 3.2, actor: demoUsers[0] },
    { incident: demoIncidents[2], message: "Incident submitted", hours: 4.1, actor: demoUsers[1] },
    { incident: demoIncidents[3], message: "Incident resolved", hours: 5.3, actor: demoUsers[2] },
    { incident: demoIncidents[4], message: "Incident assigned to Arjun Patel", hours: 6.2, actor: demoUsers[0] },
    { incident: demoIncidents[5], message: "Incident assigned to Isha Desai", hours: 7.1, actor: demoUsers[0] },
    { incident: demoIncidents[6], message: "Incident submitted", hours: 8.4, actor: demoUsers[3] },
    { incident: demoIncidents[7], message: "Incident submitted", hours: 9.3, actor: demoUsers[4] },
    { incident: demoIncidents[8], message: "Investigation update added", hours: 10.2, actor: demoUsers[10] },
    { incident: demoIncidents[9], message: "Incident assigned to Aditi Nair", hours: 11.4, actor: demoUsers[0] },
    { incident: demoIncidents[10], message: "Incident submitted", hours: 12.1, actor: demoUsers[9] },
    { incident: demoIncidents[11], message: "Incident assigned to Ishaan Joshi", hours: 13.5, actor: demoUsers[0] },
    { incident: demoIncidents[12], message: "Incident submitted", hours: 15.2, actor: demoUsers[8] },
    { incident: demoIncidents[13], message: "Incident resolved", hours: 17.3, actor: demoUsers[11] },
    { incident: demoIncidents[14], message: "Incident submitted", hours: 19.1, actor: demoUsers[7] },
    { incident: demoIncidents[15], message: "Incident assigned to Ishaan Joshi", hours: 22.6, actor: demoUsers[0] },
  ];
  return events.map(({ incident, message, hours, actor }, index) => ({
    id: `demo-activity-${index + 1}`, message, incidentTitle: incident.title, incidentId: incident.id,
    reporterId: incident.reporterId, assignedTo: incident.assignedTo, status: incident.status,
    time: ago(hours), actor: actor.name, actorEmail: actor.email,
  }));
};
const toHex = (bytes) => Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
const hashPassword = async (password, storedSalt) => {
  const salt = storedSalt ? Uint8Array.from(storedSalt.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const digest = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" }, key, 256);
  return { salt: toHex(salt), hash: toHex(digest) };
};
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function readSavedData() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || "null"); } catch { return null; }
}
function App() {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem(`${DB_KEY}.session`) || "");
  const [authError, setAuthError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const profile = users.find((user) => user.id === currentUserId) || null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = readSavedData();
      if (saved?.users?.length) {
        const userNamesByEmail = new Map(demoUsers.map(({ email, name }) => [email, name]));
        const userNamesById = new Map(demoUsers.map(({ id, name }) => [id, name]));
        const savedUsers = saved.users.map((user) => userNamesByEmail.has(user.email) ? { ...user, name: userNamesByEmail.get(user.email) } : user);
        const savedIncidents = (saved.incidents || []).map((incident) => ({
          ...incident,
          reporter: userNamesById.get(incident.reporterId) || previousDemoNames[incident.reporter] || incident.reporter,
          internalNotes: (incident.internalNotes || []).map((note) => ({ ...note, author: previousDemoNames[note.author] || note.author })),
        }));
        const savedHistory = saved.activities?.length ? saved.activities : savedIncidents.some((incident) => incident.id === "INC-1001") ? makeDemoActivities() : [];
        const history = savedHistory.map((activity) => ({
          ...activity,
          actor: userNamesByEmail.get(activity.actorEmail) || previousDemoNames[activity.actor] || activity.actor,
          message: Object.entries(previousDemoNames).reduce((message, [oldName, newName]) => message.replaceAll(oldName, newName), activity.message || ""),
        }));
        const missingUsers = demoUsers.filter((demoUser) => !saved.users.some((user) => user.id === demoUser.id || user.email === demoUser.email));
        const newDemoUsers = await Promise.all(missingUsers.map(async ({ password, ...user }) => ({ ...user, ...await hashPassword(password) })));
        const additionalIncidents = demoIncidents.filter((demoIncident) => !savedIncidents.some((incident) => incident.id === demoIncident.id));
        const sampleActivities = makeDemoActivities();
        const additionalActivities = sampleActivities.filter((activity) => !history.some((savedActivity) => savedActivity.id === activity.id));
        if (mounted) { setUsers([...savedUsers, ...newDemoUsers]); setIncidents([...savedIncidents, ...additionalIncidents]); setActivities([...history, ...additionalActivities]); setReady(true); }
      } else {
        const seededUsers = await Promise.all(demoUsers.map(async ({ password, ...user }) => ({ ...user, ...await hashPassword(password) })));
        if (mounted) { setUsers(seededUsers); setIncidents(demoIncidents); setActivities(makeDemoActivities()); setReady(true); }
      }
    })();
    return () => { mounted = false; };
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(DB_KEY, JSON.stringify({ users, incidents, activities }));
  }, [ready, users, incidents, activities]);

  const authenticate = async (email, password) => {
    const user = users.find((item) => item.email === email);
    const credentials = user ? await hashPassword(password, user.salt) : null;
    const legacyDigest = user?.passwordHash ? toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password))) : "";
    if (!user || (user.hash !== credentials?.hash && user.passwordHash !== legacyDigest)) { setAuthError("Email or password is incorrect."); return; }
    if (!user.hash) setUsers((previous) => previous.map((item) => item.id === user.id ? { ...item, salt: credentials.salt, hash: credentials.hash, passwordHash: undefined } : item));
    localStorage.setItem(`${DB_KEY}.session`, user.id); setCurrentUserId(user.id); setAuthError(""); setActivePage("dashboard");
  };
  const register = async ({ name, email, password }) => {
    if (users.some((user) => user.email === email)) { setAuthError("An account with this email already exists."); return; }
    const credentials = await hashPassword(password);
    const user = { id: newId(), name, email, role: "Reporter", ...credentials };
    setUsers((previous) => [...previous, user]); localStorage.setItem(`${DB_KEY}.session`, user.id); setCurrentUserId(user.id); setAuthError("");
  };
  const signOut = () => { localStorage.removeItem(`${DB_KEY}.session`); setCurrentUserId(""); setActivePage("dashboard"); };
  const recordActivity = (message, incident) => setActivities((previous) => [{ id: newId(), message, incidentTitle: incident.title, incidentId: incident.id, reporterId: incident.reporterId, assignedTo: incident.assignedTo, status: incident.status, time: new Date().toLocaleString(), actor: profile.name, actorEmail: profile.email }, ...previous]);
  const handleIncidentSubmit = async (newIncident) => {
    const incidentId = `INC-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const uploaded = [];
    try {
      const evidence = await Promise.all(newIncident.evidence.map(async (file, index) => {
        const key = `${incidentId}:${index}`;
        await saveEvidence(key, file); uploaded.push(key);
        return { key, name: file.name, size: file.size, type: file.type };
      }));
      const incident = { ...newIncident, id: incidentId, evidence, reporter: profile.name, reporterId: profile.id, reporterRole: profile.role, assignedTo: "", status: "Submitted", publicUpdate: "", internalNotes: [] };
      setIncidents((previous) => [incident, ...previous]); recordActivity("Incident submitted", incident);
      setActivePage("incidents");
    } catch {
      await Promise.all(uploaded.map(removeEvidence));
      throw new Error("The report or evidence could not be saved in this browser. Check available storage and try again.");
    }
  };
  const updateIncident = (incident, changes, activity) => {
    const updated = { ...incident, ...changes };
    setIncidents((previous) => previous.map((item) => item.id === incident.id ? updated : item));
    recordActivity(activity, updated);
  };
  const handleAssign = (incident, analystId) => {
    const analyst = users.find((user) => user.id === analystId);
    updateIncident(incident, { assignedTo: analystId, status: analystId ? "Assigned" : "Submitted" }, analyst ? `Assigned to ${analyst.name}` : "Incident unassigned");
  };
  const handleDelete = async (incident) => {
    if (profile.role !== "Reporter" || incident.reporterId !== profile.id || ["Resolved", "Closed"].includes(incident.status)) return;
    await Promise.all((incident.evidence || []).map((file) => removeEvidence(file.key).catch(() => undefined)));
    setIncidents((previous) => previous.filter((item) => item.id !== incident.id));
    recordActivity("Reporter marked report resolved and deleted it", { ...incident, status: "Deleted" });
  };
  const changeRole = (userId, role) => {
    if (profile.role !== "Admin" || userId === profile.id) return;
    setUsers((previous) => previous.map((user) => user.id === userId ? { ...user, role } : user));
    const target = users.find((user) => user.id === userId);
    setActivities((previous) => [{ id: newId(), message: `Role changed to ${role} for ${target?.email}`, incidentTitle: "User account", incidentId: target?.id || userId, status: role, time: new Date().toLocaleString(), actor: profile.name, actorEmail: profile.email }, ...previous]);
  };

  if (!ready) return <main className="auth-screen"><p>Loading local workspace…</p></main>;
  if (!profile) return <Auth onLogin={authenticate} onRegister={register} error={authError} />;
  return <div className="app">
    <Sidebar activePage={activePage} onNavigate={setActivePage} onReportClick={() => setActivePage("report")} profile={profile} />
    <main className={`main ${activePage === "report" ? "main-report" : ""}`}>
      {activePage === "dashboard" && <Dashboard incidents={incidents} profile={profile} />}
      {activePage === "incidents" && <Incidents incidents={incidents} profile={profile} users={users} onDelete={handleDelete} onAssign={handleAssign} onUpdate={updateIncident} />}
      {activePage === "analytics" && profile.role !== "Reporter" && <Analytics incidents={incidents.filter((incident) => profile.role === "Admin" || incident.assignedTo === profile.id)} />}
      {activePage === "activity" && <ActivityLogs activities={activities.filter((activity) => profile.role === "Admin" || (profile.role === "Analyst" ? activity.assignedTo === profile.id : activity.reporterId === profile.id))} />}
      {activePage === "users" && profile.role === "Admin" && <UserManagement users={users} onRoleChange={changeRole} />}
      {activePage === "report" && <IncidentForm onCancel={() => setActivePage("dashboard")} onSubmit={handleIncidentSubmit} />}
      {activePage === "profile" && <Profile profile={profile} incidents={incidents} onReportClick={() => setActivePage("report")} onSignOut={signOut} />}
    </main>
  </div>;
}
export default App;










