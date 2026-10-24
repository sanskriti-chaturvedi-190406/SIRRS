
import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import IncidentForm from "./components/IncidentForm";
import Incidents from "./components/Incidents";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [incidents, setIncidents] = useState([]);
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
          setIncidents((previous) => [
            newIncident,
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
      <section className="welcome">
        <p>SECURITY OPERATIONS</p>
        <h1>Activity Logs</h1>
        <span>
          Activity history will be available here soon.
        </span>
      </section>
    )}
  </main>
</div>

  );
}

export default App;
