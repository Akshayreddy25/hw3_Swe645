import { useEffect, useState } from "react";
import {
  fetchSurveys,
  updateSurvey,
  deleteSurvey,
} from "../api/surveys.js";
import SurveyTable from "../components/surveys/SurveyTable.jsx";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  async function load() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetchSurveys();
      setSurveys(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load surveys.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate(id, updates) {
    try {
      const res = await updateSurvey(id, updates);
      setSurveys((prev) =>
        prev.map((s) => (s.id === id ? res.data : s))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update survey.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this survey permanently?")) return;
    try {
      await deleteSurvey(id);
      setSurveys((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete survey.");
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <h2>Submitted Surveys</h2>
        <p>View, update, or delete any recorded survey.</p>
      </div>

      {errorMsg && <div className="alert-error">{errorMsg}</div>}

      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <SurveyTable
          surveys={surveys}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}
