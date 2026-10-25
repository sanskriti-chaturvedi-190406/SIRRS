
import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import IncidentForm from "./components/IncidentForm";
import Incidents from "./components/Incidents";
import ActivityLogs from "./components/ActivityLogs";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");

  return (

<div className="app">
  <Sidebar
    activePage={activePage}
    onNavigate={setActivePage}
    onReportClick={() => setShowForm(true)}
  />

  <main className="main">
    {showForm && (
      <IncidentForm
        onCancel={() => setShowForm(false)}
       onSubmit={(newIncident) => {
  setIncidents((previous) => [newIncident, ...previous]);

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

  setShowForm(false);
}}
      />
    )}

    {activePage === "dashboard" && (
      <Dashboard incidents={incidents} />
    )}

    {activePage === "incidents" && (
      <Incidents incidents={incidents} />
    )}

 {activePage === "activity" && (
  <ActivityLogs activities={activities} />
)}
  </main>
</div>

  );
}

export default App;
