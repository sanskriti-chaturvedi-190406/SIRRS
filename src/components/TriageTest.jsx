import { useState } from "react";

function TriageTest() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stillHappening, setStillHappening] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    const incidentData = {
      title,
      category,
      description,
      stillHappening,
    };

    console.log("[SIRRS] SUBMIT");
    console.log("[SIRRS] Incident data:", incidentData);

    const webhookUrl = import.meta.env.VITE_N8N_TRIAGE_WEBHOOK_URL;

    console.log("[SIRRS] Webhook URL:", webhookUrl);

    if (!webhookUrl) {
      console.error("[SIRRS] ERROR: Webhook URL is missing.");

      setError("n8n webhook URL is not configured.");
      setLoading(false);

      return;
    }

    try {
      console.log("[SIRRS] Sending request to n8n...");

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incidentData),
      });

      console.log("[SIRRS] Response status:", response.status);

      if (!response.ok) {
        console.error(
          "[SIRRS] ERROR: Request failed with status",
          response.status
        );

        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      console.log("[SIRRS] Response received:");
      console.log(data);

      setResult(data);

      console.log("[SIRRS] SUCCESS: React → n8n → React completed.");
    } catch (err) {
      console.error("[SIRRS] ERROR:", err);

      setError(
        err.message || "Something went wrong while running the triage."
      );
    } finally {
      setLoading(false);

      console.log("[SIRRS] Request finished.");
    }
  }

  function getPriorityClass(priority) {
    if (!priority) return "";

    return priority.toLowerCase();
  }

  function getFactorClass(score) {
    if (score <= 1) return "factor-low";
    if (score === 2) return "factor-medium";
    if (score === 3) return "factor-moderate";
    if (score === 4) return "factor-high";
    return "factor-critical";
  }

  function getFactorWidth(score) {
    return `${(score / 5) * 100}%`;
  }

  const factors = result
    ? [
        {
          label: "Impact",
          value: result.factors?.impact,
        },
        {
          label: "Threat Severity",
          value: result.factors?.threatSeverity,
        },
        {
          label: "Scope",
          value: result.factors?.scope,
        },
        {
          label: "Urgency",
          value: result.factors?.urgency,
        },
        {
          label: "Evidence",
          value: result.factors?.evidence,
        },
      ]
    : [];

  return (
    <div className="triage-test">
      <div className="triage-header">
        <div>
          <p className="triage-eyebrow">AUTOMATED INCIDENT ASSESSMENT</p>
          <h1>Triage Test</h1>
          <p className="triage-description">
            Submit a (sample currently) security incident to test the automated triage
            system.
          </p>
        </div>
      </div>

      <div className="triage-layout">
        <section className="triage-form-card">
          <div className="section-heading">
            <h2>Report Incident</h2>
            <p>Provide the details of the reported security event.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="triage-field">
              <label htmlFor="triage-title">Incident Title</label>
              <input
                id="triage-title"
                type="text"
                placeholder="Enter incident title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="triage-field">
              <label htmlFor="triage-category">Category</label>
              <select
                id="triage-category"
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
            </div>

            <div className="triage-field">
              <label htmlFor="triage-description">Description</label>
              <textarea
                id="triage-description"
                placeholder="Describe what happened..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="triage-field">
              <label>Is this still happening?</label>

              <div className="triage-radio-group">
                <label className="triage-radio">
                  <input
                    type="radio"
                    name="stillHappening"
                    value="yes"
                    checked={stillHappening === "yes"}
                    onChange={(event) =>
                      setStillHappening(event.target.value)
                    }
                    required
                  />
                  <span>Yes</span>
                </label>

                <label className="triage-radio">
                  <input
                    type="radio"
                    name="stillHappening"
                    value="no"
                    checked={stillHappening === "no"}
                    onChange={(event) =>
                      setStillHappening(event.target.value)
                    }
                  />
                  <span>No</span>
                </label>

                <label className="triage-radio">
                  <input
                    type="radio"
                    name="stillHappening"
                    value="not_sure"
                    checked={stillHappening === "not_sure"}
                    onChange={(event) =>
                      setStillHappening(event.target.value)
                    }
                  />
                  <span>Not sure</span>
                </label>
              </div>
            </div>

            <button
              className="triage-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Running Triage..." : "Run Triage"}
            </button>
          </form>

          {error && (
            <div className="triage-error">
              <strong>Triage request failed</strong>
              <p>{error}</p>
            </div>
          )}
        </section>

        {result && (
          <section
            className={`triage-result-card ${getPriorityClass(
              result.priority
            )}`}
          >
            <div className="triage-result-header">
              <div>
                <p className="result-label">TRIAGE ASSESSMENT</p>
                <h2>
                    <span className={`priority-text ${getPriorityClass(result.priority)}`}>
                        {result.priority}
                    </span>{" "}
                </h2>
              </div>

              <div className="triage-score">
                <strong>{result.score}</strong>
                <span>/100</span>
              </div>
            </div>

            {result.factors && (
              <div className="factor-section">
                <div className="factor-grid">
                  {factors.map((factor) => (
                    <div className="factor-item" key={factor.label}>
                      <div className="factor-top">
                        <span>{factor.label}</span>
                        <strong>{factor.value}/5</strong>
                      </div>

                      <div className="factor-bar">
                        <div
                          className={`factor-fill ${getFactorClass(
                            factor.value
                          )}`}
                          style={{
                            width: getFactorWidth(factor.value),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.reasoning && (
              <div className="reasoning-section">
                <h3>Why this assessment?</h3>

                <div className="reasoning-list">
                  <div>
                    <strong>Impact</strong>
                    <p>{result.reasoning.impact}</p>
                  </div>

                  <div>
                    <strong>Threat Severity</strong>
                    <p>{result.reasoning.threatSeverity}</p>
                  </div>

                  <div>
                    <strong>Scope</strong>
                    <p>{result.reasoning.scope}</p>
                  </div>

                  <div>
                    <strong>Urgency</strong>
                    <p>{result.reasoning.urgency}</p>
                  </div>

                  <div>
                    <strong>Evidence</strong>
                    <p>{result.reasoning.evidence}</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default TriageTest;