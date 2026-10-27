import Icon from "./Icon";

function Analytics({ incidents = [] }) {
  const count = (predicate) => incidents.filter(predicate).length;
  const summary = [
    ["Total", incidents.length, "neutral"],
    ["Open", count((item) => !["Resolved", "Closed", "Duplicate"].includes(item.status)), "blue"],
    ["In Progress", count((item) => item.status === "In Progress"), "orange"],
    ["Resolved", count((item) => item.status === "Resolved"), "green"],
    ["Closed", count((item) => item.status === "Closed"), "neutral"],
  ];
  const severities = ["Critical", "High", "Medium", "Low"].map((name) => ({ name, count: count((item) => item.severity === name) }));
  const categories = [...new Set(incidents.map((item) => item.category))].map((name) => ({ name, count: count((item) => item.category === name) }));
  const maxSeverity = Math.max(1, ...severities.map((item) => item.count));
  const maxCategory = Math.max(1, ...categories.map((item) => item.count));
  return <section className="page-content">
    <header className="topbar"><h2>Analytics</h2></header>
    <section className="welcome"><p>INCIDENT TRENDS</p><h1>Response metrics</h1><span>Live counts from incident records in this browser.</span></section>
    <section className="analytics-summary">{summary.map(([label, value, tone]) => <article className="analytics-stat" key={label}><span className={`stat-icon ${tone}`}><Icon name={label === "Total" ? "stack" : label === "Open" ? "alert" : label === "In Progress" ? "clock" : label === "Resolved" ? "check" : "incidents"} size={20} /></span><div><strong>{value}</strong><span>{label}</span></div></article>)}</section>
    <section className="analytics-grid">
      <article className="analytics-card"><h3>By severity</h3><p className="subtitle">Current triage distribution</p>{severities.map((item) => <div className="chart-row" key={item.name}><span>{item.name}</span><div className="chart-track"><i className={`chart-fill severity-${item.name.toLowerCase()}`} style={{ width: `${(item.count / maxSeverity) * 100}%` }} /></div><strong>{item.count}</strong></div>)}</article>
      <article className="analytics-card"><h3>By incident type</h3><p className="subtitle">Reported categories</p>{categories.length ? categories.map((item) => <div className="chart-row" key={item.name}><span>{item.name}</span><div className="chart-track"><i className="chart-fill category-fill" style={{ width: `${(item.count / maxCategory) * 100}%` }} /></div><strong>{item.count}</strong></div>) : <p className="empty-state">No categories to chart yet.</p>}</article>
    </section>
    <p className="analytics-footnote">Counts update when reports are submitted, assigned, resolved, or closed.</p>
  </section>;
}
export default Analytics;

