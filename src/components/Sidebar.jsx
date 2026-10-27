function Sidebar({ activePage, onNavigate, onReportClick }) {
  return (
    <aside className="sidebar">
      <h2>🛡️ SIRRS</h2>
      <p className="subtitle">SECURITY CENTER</p>

      <p className="menu-title">WORKSPACE</p>

      <button
        className={`nav ${activePage === "dashboard" ? "active" : ""}`}
        onClick={() => onNavigate("dashboard")}
      >
        ▦ Dashboard
      </button>

      <button
        className={`nav ${activePage === "incidents" ? "active" : ""}`}
        onClick={() => onNavigate("incidents")}
      >
        ◈ Incidents
      </button>

      <button className="nav" onClick={onReportClick}>
        ＋ Report Incident
      </button>

      <button
        className={`nav ${activePage === "activity" ? "active" : ""}`}
        onClick={() => onNavigate("activity")}
      >
        ◷ Activity Logs
      </button>

      <p className="menu-title">TOOLS</p>

      <button
        className={`nav ${activePage === "triage-test" ? "active" : ""}`}
        onClick={() => onNavigate("triage-test")}
      >
        ◉ Triage Test
      </button>

      <div className="profile">
        <div className="avatar">SP</div>
        <div>
          <strong>Security Team</strong>
          <p>Analyst Account</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;