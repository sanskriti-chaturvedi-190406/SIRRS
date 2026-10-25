
import { useState } from "react";
function determineSeverity(category, description) {
  const text = `${category} ${description}`.toLowerCase();

  if (
    text.includes("ransomware") ||
    text.includes("data breach") ||
    text.includes("data stolen")
  ) {
    return "Critical";
  }

  if (
    text.includes("malware") ||
    text.includes("unauthorized access") ||
    text.includes("account compromised")
  ) {
    return "High";
  }

  if (
    text.includes("phishing") ||
    text.includes("suspicious login")
  ) {
    return "Medium";
  }

  return "Low";
}
function IncidentForm({ onCancel, onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const newIncident = {
  id: `INC-${Date.now()}`,
  title,
  category,
  severity: determineSeverity(category, description),
  description,
  status: "Reported",
};

    onSubmit(newIncident);
  }

  return (
    <form className="incident-form" onSubmit={handleSubmit}>
      <h2>Report a New Incident</h2>

      <label>Incident Title</label>
      <input
        type="text"
        placeholder="Enter incident title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <label>Category</label>
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        required
      >
        <option value="">Select category</option>
        <option>Phishing</option>
        <option>Unauthorized Access</option>
        <option>Malware</option>
        <option>Network Security</option>
        <option>Other</option>
      </select>

     
      <label>Description</label>
      <textarea
        placeholder="Describe what happened..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
      />

      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Submit Incident</button>
      </div>
    </form>
  );
}

export default IncidentForm;
