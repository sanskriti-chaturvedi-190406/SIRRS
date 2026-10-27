import { useState } from "react";

function ActivityLogs({ activities = [] }) {
  const [actionFilter, setActionFilter] = useState("All actions");
  const actions = [...new Set(activities.map((activity) => activity.message))];
  const filtered = activities.filter((activity) => actionFilter === "All actions" || activity.message === actionFilter);
  return <section className="page-content">
    <header className="topbar"><h2>Audit Log</h2></header>
    <section className="welcome"><p>ACTIVITY HISTORY</p><h1>Audit log</h1><span>Review changes made to reports and user accounts.</span></section>
    <section className="filter-panel"><label htmlFor="audit-action-filter">Filter by action</label><select id="audit-action-filter" value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}><option>All actions</option>{actions.map((action) => <option key={action}>{action}</option>)}</select><span>{filtered.length} entries</span></section>
    <section className="incidents activity-card"><h3>Recent activity</h3><p className="subtitle">{filtered.length} matching entries</p>
      {filtered.length === 0 ? <p className="empty-state">No activity matches this filter.</p> : <div className="table-scroll"><table><thead><tr><th>ACTION</th><th>INCIDENT / RECORD</th><th>STATUS</th><th>TIME</th><th>BY</th></tr></thead><tbody>
      {filtered.map((activity) => <tr key={activity.id}><td>{activity.message}</td><td>{activity.incidentTitle}<small>{activity.incidentId}</small></td><td>{activity.status}</td><td>{activity.time}</td><td>{activity.actor}<small>{activity.actorEmail}</small></td></tr>)}
      </tbody></table></div>}
    </section>
  </section>;
}
export default ActivityLogs;
