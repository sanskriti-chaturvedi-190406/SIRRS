function ActivityLogs({ activities = [] }) {
  return (
    <section className="incidents-page">
      <header className="topbar">
        <div>
          <p className="subtitle">Workspace / Activity Logs</p>
          <h2>Activity Logs</h2>
        </div>

        <span className="system-status">
          ● System Operational
        </span>
      </header>

      <section className="welcome">
        <p>SECURITY OPERATIONS</p>
        <h1>Activity History</h1>
        <span>Track actions performed in the incident response system.</span>
      </section>

      <section className="incidents">
        <h3>Recent Activities</h3>
        <p className="subtitle">
          Total activities: {activities.length}
        </p>

        {activities.length === 0 ? (
          <p>No activities recorded yet. Report an incident to get started.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ACTIVITY</th>
                  <th>INCIDENT</th>
                  <th>STATUS</th>
                  <th>TIME</th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.message}</td>
                    <td>
                      {activity.incidentTitle}
                      <small>{activity.incidentId}</small>
                    </td>
                    <td>{activity.status}</td>
                    <td>{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

export default ActivityLogs;