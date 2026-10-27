import { useState } from "react";
import Icon from "./Icon";

function Sidebar({ activePage, onNavigate, onReportClick, profile }) {
  const [collapsed, setCollapsed] = useState(true);
  const links = [
    ["dashboard", "dashboard", "Dashboard"],
    ["incidents", "incidents", profile.role === "Reporter" ? "My Incidents" : "Incident Queue"],
    ...(profile.role === "Reporter" ? [["report", "report", "Report Incident"]] : []),
    ...(profile.role !== "Reporter" ? [["analytics", "analytics", "Analytics"]] : []),
    ["activity", "activity", profile.role === "Admin" ? "Audit Log" : "Activity"],
    ...(profile.role === "Admin" ? [["users", "users", "User Management"]] : []),
  ];
  return <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`} onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)} onFocus={() => setCollapsed(false)}>
    <div className="brand-row"><h2><span className="brand-shield"><Icon name="shield" size={24} /></span><span className="sidebar-label">SIRRS</span></h2>
      <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}><Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={17} /></button>
    </div>
    <nav className="nav-list" aria-label="Main navigation">
      {links.map(([page, icon, label]) => <button key={page} title={collapsed ? label : undefined} className={`nav ${activePage === page ? "active" : ""}`} onClick={() => { page === "report" ? onReportClick() : onNavigate(page); }}>
        <span className="nav-icon"><Icon name={icon} size={18} /></span><span className="sidebar-label">{label}</span>
      </button>)}
    </nav>
    <button className={`profile profile-link ${activePage === "profile" ? "active" : ""}`} onClick={() => onNavigate("profile")} title={collapsed ? "Profile" : undefined}>
      <span className="avatar">{profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
      <span className="profile-copy sidebar-label"><strong>{profile.name}</strong><span>{profile.email}</span></span>
    </button>
  </aside>;
}
export default Sidebar;
