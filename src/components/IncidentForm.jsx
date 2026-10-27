import { useState } from "react";

function determineSeverity(category, description) {
  const text = `${category} ${description}`.toLowerCase();
  if (["ransomware", "data breach", "data stolen"].some((term) => text.includes(term))) return "Critical";
  if (["malware", "unauthorized access", "account compromised"].some((term) => text.includes(term))) return "High";
  if (["phishing", "suspicious login"].some((term) => text.includes(term))) return "Medium";
  return "Low";
}
const localDateTime = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const supported = (file) => {
  const extension = file.name.split(".").pop().toLowerCase();
  const typeAllowed = ["application/pdf", "image/png", "image/jpeg"].includes(file.type) || (file.type === "" && ["pdf", "png", "jpg", "jpeg"].includes(extension));
  return typeAllowed && file.size <= 10 * 1024 * 1024;
};

function IncidentForm({ onCancel, onSubmit }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [occurredAt, setOccurredAt] = useState(localDateTime);
  const [evidence, setEvidence] = useState([]);
  const [evidenceError, setEvidenceError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const finalCategory = category === "Other" ? customCategory.trim() : category;
    if ((category === "Other" && !finalCategory) || evidenceError || submitting) return;
    setSubmitting(true); setSubmitError("");
    try {
      await onSubmit({ title: title.trim(), category: finalCategory, severity: determineSeverity(finalCategory, description), description: description.trim(), occurredAt: new Date(occurredAt).toISOString(), evidence });
    } catch (error) {
      setSubmitError(error.message || "The report could not be saved. Please try again.");
      setSubmitting(false);
    }
  }

  function handleEvidenceChange(event) {
    const files = Array.from(event.target.files || []);
    const accepted = files.filter(supported);
    const totalBytes = accepted.reduce((sum, file) => sum + file.size, 0);
    const withinTotal = totalBytes <= 20 * 1024 * 1024;
    setEvidence(withinTotal ? accepted : []);
    setEvidenceError(accepted.length !== files.length ? "Use PDF, PNG, or JPG evidence, up to 10 MB per file." : !withinTotal ? "Evidence must total 20 MB or less." : "");
  }

  return <div className="report-layout"><form className="incident-form" onSubmit={handleSubmit}>
    <div className="form-intro"><p className="eyebrow">SECURITY OPERATIONS</p><h1>Report an incident</h1><p>Share what happened so the team can investigate.</p></div>
    <label htmlFor="incident-title">Incident title</label><input id="incident-title" type="text" maxLength="140" placeholder="A short summary" value={title} onChange={(event) => setTitle(event.target.value)} required />
    <label htmlFor="incident-category">Category</label><select id="incident-category" value={category} onChange={(event) => setCategory(event.target.value)} required><option value="">Select a category</option><option>Phishing</option><option>Unauthorized Access</option><option>Malware</option><option>Network Security</option><option>Lost Device</option><option>Other</option></select>
    {category === "Other" && <><label htmlFor="custom-category">Your category</label><input id="custom-category" type="text" maxLength="80" placeholder="Enter a category" value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} required /></>}
    <label htmlFor="incident-occurred-at">When did it happen?</label><input id="incident-occurred-at" type="datetime-local" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} required />
    <label htmlFor="incident-description">Description</label><textarea id="incident-description" maxLength="5000" placeholder="Describe what happened, when, and what may be affected…" value={description} onChange={(event) => setDescription(event.target.value)} required />
    <label htmlFor="incident-evidence">Evidence <span className="optional-label">Optional</span></label><input id="incident-evidence" type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" multiple onChange={handleEvidenceChange} />
    <p className="field-help">PDF, PNG, or JPG files, up to 10 MB each (20 MB total). Evidence stays in this browser.</p>
    {evidenceError && <p className="form-error" role="alert">{evidenceError}</p>}{submitError && <p className="form-error" role="alert">{submitError}</p>}
    {evidence.length > 0 && <ul className="evidence-list">{evidence.map((file) => <li key={`${file.name}-${file.size}`}>{file.name} · {(file.size / 1024).toFixed(0)} KB</li>)}</ul>}
    <div className="form-actions"><button className="button-secondary" type="button" onClick={onCancel} disabled={submitting}>Cancel</button><button className="button-primary" type="submit" disabled={submitting}>{submitting ? "Saving report…" : "Submit incident"}</button></div>
  </form></div>;
}
export default IncidentForm;
