function UserManagement({ users = [], onRoleChange }) {
  return <section className="page-content">
    <header className="topbar"><h2>User Management</h2></header>
    <section className="welcome"><p>ACCESS MANAGEMENT</p><h1>Users</h1><span>Registered users start as reporters. Grant analyst access to investigators.</span></section>
    <section className="incidents"><h3>Registered accounts</h3><p className="subtitle">{users.length} accounts</p>
      <div className="table-scroll"><table className="user-table"><thead><tr><th>USER</th><th>EMAIL LOGIN</th><th>ROLE</th><th>ACCESS</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td><span className={`role-chip role-${user.role.toLowerCase()}`}>{user.role}</span></td><td>{user.role === "Admin" ? <span className="muted-text">Administrator</span> : <select className="table-select" aria-label={`Set role for ${user.email}`} value={user.role} onChange={(event) => onRoleChange(user.id, event.target.value)}><option>Reporter</option><option>Analyst</option></select>}</td></tr>)}</tbody></table></div>
    </section>
  </section>;
}
export default UserManagement;
