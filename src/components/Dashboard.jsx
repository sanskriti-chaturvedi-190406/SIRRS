import { useState } from "react";
import Icon from "./Icon";

function Dashboard({ incidents, profile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const analyst = profile.role === "Analyst";
  const admin = profile.role === "Admin";
  const visible = admin ? incidents : analyst
    ? incidents.filter((incident) => incident.assignedTo === profile.id)
    : incidents.filter((incident) => incident.reporterId === profile.id && incident.reporterRole !== "Analyst");
  const query = searchTerm.toLowerCase();
  const filtered = visible.filter((incident) => [incident.title, incident.id, incident.category].some((value) => value?.toLowerCase().includes(query)));
  const open = visible.filter((incident) => !["Resolved", "Closed", "Duplicate"].includes(incident.status)).length;
  const inProgress = visible.filter((incident) => incident.status === "In Progress").length;
  const resolved = visible.filter((incident) => incident.status === "Resolved").length;
  const title = admin ? "Recent incidents" : analyst ? "My incident queue" : "My incidents";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = profile.name.trim().split(/\s+/)[0];
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
  const stats = [[admin ? "Total incidents" : analyst ? "Assigned" : "My reports", visible.length, "neutral", "stack"], ["Open", open, "blue", "alert"], ["In Progress", inProgress, "orange", "clock"], ["Resolved", resolved, "green", "check"]];
  return <section className="page-content">
    <header className="topbar dashboard-topbar"><h2>Dashboard</h2><time dateTime={new Date().toISOString()}>{dateLabel}</time></header>
    <section className="welcome dashboard-welcome"><h1>{greeting}, {firstName}</h1><span>{admin ? "Here’s what is happening across your incident queue." : analyst ? "Here are the cases assigned to you and their latest status." : "Here’s the latest on the incidents you’ve reported."}</span></section>
    <section className="stats">{stats.map(([label, value, tone, icon]) => <article className="card overview-stat" key={label}><span className={`stat-icon ${tone}`}><Icon name={icon} size={20} /></span><div><p>{label}</p><h2>{value}</h2></div></article>)}</section>
    {admin && <section className="overview-shortcut"><span><strong>Incident queue</strong><small>Review, triage, assign, and update reports.</small></span><span className="queue-total">{incidents.length} reports</span></section>}
    <section className="incidents overview-incidents"><div className="incident-heading"><div><h3>{title}</h3><p className="subtitle">{admin ? "All incidents across the system" : analyst ? "Reports assigned to your account" : "Your submitted reports and their current status"}</p></div><input className="incident-search" type="search" placeholder="Search incidents…" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div>
      {filtered.length ? <div className="incident-list">{filtered.map((incident) => <article className="incident-list-item" key={incident.id}><div className="incident-list-copy"><div className="incident-list-title"><strong>{incident.title}</strong><small>{incident.id}</small></div><p>{incident.category} <span>·</span> {incident.occurredAt ? new Date(incident.occurredAt).toLocaleDateString() : "Sample report"}</p></div><div className="incident-pills"><span className={`status-pill status-${incident.status.toLowerCase().replaceAll(" ", "-")}`}>{incident.status}</span><span className={`severity-pill severity-${incident.severity.toLowerCase()}`}>{incident.severity}</span></div></article>)}</div> : <p className="empty-state">No incidents match your search.</p>}
    </section>
  </section>;
}
export default Dashboard;
