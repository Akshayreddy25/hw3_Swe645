import { useState } from "react";
import SurveyForm from "../components/surveys/SurveyForm.jsx";
import { createSurvey } from "../api/surveys.js";

export default function NewSurveyPage() {
  const [status, setStatus] = useState(null);

  async function handleSubmit(payload) {
    setStatus(null);
    try {
      await createSurvey(payload);
      setStatus("success");
      return true;
    } catch (err) {
      console.error(err);
      setStatus("error");
      return false;
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>Student Campus Visit Survey</h2>
        <p>All fields are required unless marked optional.</p>
      </div>

      {status === "success" && (
        <div className="alert-success">
          Thank you! Your survey was submitted.
        </div>
      )}
      {status === "error" && (
        <div className="alert-error">
          Something went wrong while submitting. Please try again.
        </div>
      )}

      <div className="card">
        <SurveyForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
