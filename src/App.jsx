import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import IncidentForm from "./components/IncidentForm";
import Incidents from "./components/Incidents";
import ActivityLogs from "./components/ActivityLogs";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");

  // Handle new incident submission
  const handleIncidentSubmit = (newIncident) => {
    // Add the incident to the incidents list
    setIncidents((previous) => [newIncident, ...previous]);

    // Record the activity
    setActivities((previous) => [
      {
        id: Date.now(),
        message: "New incident reported",
        incidentTitle: newIncident.title,
        incidentId: newIncident.id,
        status: newIncident.status,
        time: new Date().toLocaleString(),
      },
      ...previous,
    ]);

    // Navigate to the Incidents page after submission
    setActivePage("incidents");
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onReportClick={() => setActivePage("report")}
      />

      <main className="main">
        {/* Dashboard Page */}
        {activePage === "dashboard" && (
          <Dashboard incidents={incidents} />
        )}

        {/* Incidents Page */}
        {activePage === "incidents" && (
          <Incidents incidents={incidents} />
        )}

        {/* Activity Logs Page */}
        {activePage === "activity" && (
          <ActivityLogs activities={activities} />
        )}

        {/* Report Incident Page */}
        {activePage === "report" && (
          <IncidentForm
            onCancel={() => setActivePage("dashboard")}
            onSubmit={handleIncidentSubmit}
          />
        )}
      </main>
    </div>
  );
}

export default App;