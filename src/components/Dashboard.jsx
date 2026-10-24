import { useState } from "react";
function Dashboard({ incidents }) {
    const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <header className="topbar">
        <div>
          <p className="subtitle">Workspace / Dashboard</p>
          <h2>Dashboard</h2>
        </div>
        <span className="system-status">● System Operational</span>
      </header>

      <section className="welcome">
        <p>SECURITY OVERVIEW</p>
        <h1>Incident Response Dashboard</h1>
        <span>
          Monitor, investigate, and resolve security incidents
          from one place.
        </span>
      </section>

     
<section className="stats">
  <div className="card">
    <p>Total Incidents</p>
    <h2>{24 + incidents.length}</h2>
  </div>

  <div className="card">
    <p>Open Incidents</p>
    <h2>
      {12 + incidents.filter(
        (incident) => incident.status !== "Resolved" &&
                      incident.status !== "Closed"
      ).length}
    </h2>
  </div>

  <div className="card">
    <p>Critical Incidents</p>
    <h2 className="red">
      {String(
        3 + incidents.filter(
          (incident) => incident.severity === "Critical"
        ).length
      ).padStart(2, "0")}
    </h2>
  </div>

  <div className="card">
    <p>Resolved</p>
    <h2 className="green">
      {12 + incidents.filter(
        (incident) => incident.status === "Resolved"
      ).length}
    </h2>
  </div>
</section>


      <section className="incidents">
      
<div className="incident-heading">
  <div>
    <h3>Recent Incidents</h3>
    <p className="subtitle">
      Review the latest reported security events.
    </p>
  </div>

  <input
    className="incident-search"
    type="text"
    placeholder="Search incidents..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />
</div>


        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>INCIDENT</th>
                <th>CATEGORY</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
              </tr>
            </thead>
           
<tbody>
  {[
    ...incidents.map((incident) => ({
      ...incident,
      title: incident.title,
      id: incident.id,
    })),
    {
      id: "INC-001",
      title: "Suspicious login attempt",
      category: "Unauthorized Access",
      severity: "Critical",
      status: "In Progress",
    },
    {
      id: "INC-002",
      title: "Phishing email reported",
      category: "Phishing",
      severity: "High",
      status: "Reported",
    },
    {
      id: "INC-003",
      title: "Malware detected on laptop",
      category: "Malware",
      severity: "High",
      status: "Assigned",
    },
    {
      id: "INC-004",
      title: "Unusual network activity",
      category: "Network Security",
      severity: "Medium",
      status: "Resolved",
    },
  ]  .filter((incident) => {
      const query = searchTerm.toLowerCase();

      return (
        incident.title.toLowerCase().includes(query) ||
        incident.id.toLowerCase().includes(query) ||
        incident.category.toLowerCase().includes(query)
      );
    }).map((incident) => (
    <tr key={incident.id}>
      <td>
        {incident.title}
        <small>{incident.id}</small>
      </td>
      <td>{incident.category}</td>
      <td
        className={
          incident.severity === "Critical"
            ? "red"
            : incident.severity === "High"
            ? "orange"
            : incident.severity === "Medium"
            ? "yellow"
            : "green"
        }
      >
        {incident.severity}
      </td>
      <td>{incident.status}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </section>

      <footer>
        SIRRS — Secure Incident Reporting and Response System
      </footer>
    </>
  );
}

export default Dashboard;
