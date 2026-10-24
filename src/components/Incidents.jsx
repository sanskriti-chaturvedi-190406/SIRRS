
function Incidents({ incidents = [] }) {
  const demoIncidents = [
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
  ];

  const allIncidents = [...incidents, ...demoIncidents];

  return (
    <section className="incidents-page">
      <header className="topbar">
        <div>
          <p className="subtitle">Workspace / Incidents</p>
          <h2>Incident Management</h2>
        </div>
        <span className="system-status">
          ● System Operational
        </span>
      </header>

      <section className="welcome">
        <p>SECURITY OPERATIONS</p>
        <h1>All Incidents</h1>
        <span>
          Review and track reported security incidents.
        </span>
      </section>

      <section className="incidents">
        <h3>Incident Records</h3>
        <p className="subtitle">
          Total records: {allIncidents.length}
        </p>

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
              {allIncidents.map((incident) => (
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
    </section>
  );
}

export default Incidents;
