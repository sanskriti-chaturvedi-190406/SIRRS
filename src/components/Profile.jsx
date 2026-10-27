function Profile({ profile, incidents, onReportClick, onSignOut }) {
  const myReports = incidents.filter((incident) => incident.reporterId === profile.id);
  return <section className="page-content">
    <header className="topbar"><h2>Profile</h2></header>
    <section className="welcome"><p>ACCOUNT SETTINGS</p><h1>Profile</h1><span>Roles are managed by an administrator and attached to your registered email.</span></section>
    <section className="profile-panel"><div className="profile-panel-avatar">{profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
      <div className="profile-fields"><label>Name</label><div className="account-identity"><strong>{profile.name}</strong></div><label>Email login</label><div className="account-identity"><span>{profile.email}</span></div><label>Role</label><div className="role-badge">{profile.role}</div></div>
      <div className="profile-buttons">{profile.role === "Analyst" && <button className="button-primary" onClick={onReportClick}>＋ Report incident</button>}<button className="button-secondary" onClick={onSignOut}>Sign out</button></div>
    </section>
    <section className="incidents profile-reports"><h3>My reports</h3><p className="subtitle">Reports submitted by this account.</p>
      {myReports.length ? <div className="table-scroll"><table><thead><tr><th>INCIDENT</th><th>CATEGORY</th><th>SEVERITY</th><th>STATUS</th></tr></thead><tbody>{myReports.map((incident) => <tr key={incident.id}><td>{incident.title}<small>{incident.id}</small></td><td>{incident.category}</td><td>{incident.severity}</td><td>{incident.status}</td></tr>)}</tbody></table></div> : <p className="empty-state">No reports from this profile yet.</p>}
    </section>
  </section>;
}
export default Profile;
