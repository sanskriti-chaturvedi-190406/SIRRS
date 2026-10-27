import { useState } from "react";
import { readEvidence } from "../lib/evidenceStore";

function Incidents({ incidents = [], profile, users = [], onDelete, onAssign, onUpdate }) {
  const [drafts, setDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [severityFilter, setSeverityFilter] = useState("All severities");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [evidenceError, setEvidenceError] = useState("");
  const admin = profile.role === "Admin";
  const analyst = profile.role === "Analyst";
  const visible = admin ? incidents : analyst ? incidents.filter((incident) => incident.assignedTo === profile.id) : incidents.filter((incident) => incident.reporterId === profile.id);
  const filtered = visible.filter((incident) => {
    const query = search.toLowerCase();
    const matchesSearch = [incident.id, incident.title, incident.category, incident.reporter].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (statusFilter === "All statuses" || incident.status === statusFilter) && (severityFilter === "All severities" || incident.severity === severityFilter) && (typeFilter === "All types" || incident.category === typeFilter);
  });
  const statuses = ["Submitted", "Assigned", "In Progress", "Waiting on Reporter", "Resolved", "Closed", "Duplicate"];
  const categories = [...new Set(visible.map((incident) => incident.category))];
  const severities = ["Critical", "High", "Medium", "Low"];

  const downloadEvidence = async (file) => {
    try {
      const blob = await readEvidence(file.key);
      if (!blob) throw new Error("Evidence file not found in this browser.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setEvidenceError("");
    } catch (error) {
      setEvidenceError(error.message);
    }
  };

  const updateDraft = (id, key, value) => setDrafts((previous) => ({ ...previous, [id]: { ...previous[id], [key]: value } }));
  const saveStatus = (incident, status) => onUpdate(incident, { status }, `Status changed to ${status}`);
  const savePublicUpdate = (incident) => {
    const update = drafts[incident.id]?.publicUpdate?.trim();
    if (!update) return;
    onUpdate(incident, { publicUpdate: update }, "Reporter update added");
    updateDraft(incident.id, "publicUpdate", "");
  };
  const addInternalNote = (incident) => {
    const body = drafts[incident.id]?.note?.trim();
    if (!body) return;
    const note = { id: `${Date.now()}`, author: profile.name, body, time: new Date().toLocaleString() };
    onUpdate(incident, { internalNotes: [...(incident.internalNotes || []), note] }, "Internal investigation note added");
    updateDraft(incident.id, "note", "");
  };

  const title = admin ? "All incident reports" : analyst ? "Assigned investigations" : "My incident reports";
  return <section className="page-content">
    <header className="topbar"><h2>Incidents</h2></header>
    <section className="welcome"><p>{admin ? "OPERATIONS" : analyst ? "INVESTIGATIONS" : "YOUR REPORTS"}</p><h1>{title}</h1><span>{admin ? "Review new reports, set priority, and route work to the right analyst." : analyst ? "Move your assigned cases forward and keep reporters informed." : "Check the progress and latest updates for your reports."}</span></section>

    <section className="queue-toolbar" aria-label="Filter incident reports">
      <input type="search" aria-label="Search reports" placeholder="Search by title, ID, category, or reporter" value={search} onChange={(event) => setSearch(event.target.value)} />
      <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
      <select aria-label="Filter by severity" value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}><option>All severities</option>{severities.map((severity) => <option key={severity}>{severity}</option>)}</select>
      <select aria-label="Filter by type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>All types</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
      <span className="queue-result-count"><strong>{filtered.length}</strong> of {visible.length} reports</span>
    </section>
    {evidenceError && <p className="form-error" role="alert">{evidenceError}</p>}

    {filtered.length ? <section className="report-list" aria-label="Incident reports">
      {filtered.map((incident) => {
        const assigned = users.find((user) => user.id === incident.assignedTo);
        return <article className="report-card" key={incident.id}>
          <div className="report-card-top">
            <div className="report-card-title"><div className="report-card-kicker"><span>{incident.id}</span><span>·</span><span>Reported by {incident.reporter}</span></div><h3>{incident.title}</h3></div>
            <span className={`status-pill status-${incident.status.toLowerCase().replaceAll(" ", "-")}`}>{incident.status}</span>
          </div>
          <div className="report-card-meta"><span className="category-label">{incident.category}</span><span className={`severity-pill severity-${incident.severity.toLowerCase()}`}>{incident.severity} priority</span>{incident.occurredAt && <time>{new Date(incident.occurredAt).toLocaleDateString()}</time>}</div>
          <details className="incident-details"><summary>Report details and evidence</summary><p>{incident.description}</p>{incident.occurredAt && <p><strong>Occurred:</strong> {new Date(incident.occurredAt).toLocaleString()}</p>}{(incident.evidence || []).length > 0 && <ul>{incident.evidence.map((file) => <li key={file.key}><button className="evidence-download" onClick={() => downloadEvidence(file)}>{file.name}</button> · {(file.size / 1024).toFixed(0)} KB</li>)}</ul>}</details>

          {admin && <div className="report-actions-grid">
            <label>Severity<select className="table-select" aria-label={`Set severity for ${incident.title}`} value={incident.severity} onChange={(event) => onUpdate(incident, { severity: event.target.value }, `Severity changed to ${event.target.value}`)}>{["Low", "Medium", "High", "Critical"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Status<select className="table-select" aria-label={`Set status for ${incident.title}`} value={incident.status} onChange={(event) => saveStatus(incident, event.target.value)}>{statuses.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Assigned analyst<select className="table-select" value={incident.assignedTo || ""} aria-label={`Assign ${incident.title}`} onChange={(event) => onAssign(incident, event.target.value)}><option value="">Unassigned</option>{users.filter((user) => user.role === "Analyst").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          </div>}

          {analyst && <div className="report-analyst-actions">
            <label className="report-status-control">Update status<select className="table-select" value={incident.status} aria-label={`Update status for ${incident.title}`} onChange={(event) => saveStatus(incident, event.target.value)}>{["Assigned", "In Progress", "Waiting on Reporter", "Resolved"].map((value) => <option key={value}>{value}</option>)}</select></label>
            {incident.publicUpdate && <p className="public-update"><strong>Latest reporter update</strong><span>{incident.publicUpdate}</span></p>}
            <details className="case-workspace"><summary>Investigation workspace{assigned ? ` · ${assigned.name}` : ""}</summary>
              <label className="compact-label" htmlFor={`status-update-${incident.id}`}>Progress update for reporter</label><textarea id={`status-update-${incident.id}`} value={drafts[incident.id]?.publicUpdate || ""} onChange={(event) => updateDraft(incident.id, "publicUpdate", event.target.value)} placeholder="Share a safe, non-sensitive status update…" /><button className="small-action" onClick={() => savePublicUpdate(incident)}>Post update</button>
              <label className="compact-label" htmlFor={`note-${incident.id}`}>Internal investigation note</label><textarea id={`note-${incident.id}`} value={drafts[incident.id]?.note || ""} onChange={(event) => updateDraft(incident.id, "note", event.target.value)} placeholder="Analyst-only notes…" /><button className="small-action" onClick={() => addInternalNote(incident)}>Add internal note</button>
              {(incident.internalNotes || []).length > 0 && <div className="internal-notes"><strong>Internal notes</strong>{incident.internalNotes.map((note) => <p key={note.id}>{note.body}<small>{note.author} · {note.time}</small></p>)}</div>}
            </details>
          </div>}

          {admin && <details className="case-workspace admin-workspace"><summary>Case notes{assigned ? ` · assigned to ${assigned.name}` : ""}</summary>{incident.publicUpdate && <p className="public-update"><strong>Reporter update</strong><span>{incident.publicUpdate}</span></p>}{(incident.internalNotes || []).length > 0 && <div className="internal-notes"><strong>Internal notes</strong>{incident.internalNotes.map((note) => <p key={note.id}>{note.body}<small>{note.author} · {note.time}</small></p>)}</div>}<p className="field-help">Use the controls above to triage, assign, and update this report.</p></details>}

          {!admin && !analyst && <div className="reporter-update-row"><div><span className="reporter-update-label">Latest update</span><p>{incident.publicUpdate || "The response team has not posted an update yet."}</p></div>{!(["Resolved", "Closed"].includes(incident.status)) && <button className="delete-button" onClick={() => onDelete(incident)}>Mark resolved &amp; delete</button>}</div>}
        </article>;
      })}
    </section> : <section className="empty-panel"><span className="empty-panel-mark">—</span><h3>No matching reports</h3><p>Try another search or clear one of the filters.</p></section>}
  </section>;
}

export default Incidents;
