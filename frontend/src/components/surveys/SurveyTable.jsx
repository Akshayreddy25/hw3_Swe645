import { useState } from "react";
import SurveyForm from "./SurveyForm.jsx";

export default function SurveyTable({ surveys, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (!surveys || surveys.length === 0) {
    return <div className="card">No surveys submitted yet.</div>;
  }

  const editingSurvey = surveys.find((s) => s.id === editingId);

  return (
    <>
      {editingSurvey && (
        <div className="edit-panel card">
          <div className="edit-header">
            <h3>Edit Survey #{editingSurvey.id}</h3>
            <button
              className="btn btn-secondary"
              onClick={() => setEditingId(null)}
            >
              Close
            </button>
          </div>
          <SurveyForm
            initialValues={editingSurvey}
            onSubmit={async (payload) => {
              await onUpdate(editingSurvey.id, payload);
              setEditingId(null);
              return true;
            }}
          />
        </div>
      )}

      <div className="card table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Date</th>
                <th>Liked Most</th>
                <th>Interested</th>
                <th>Likelihood</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    {s.first_name} {s.last_name}
                    <div className="subtext">{s.email}</div>
                  </td>
                  <td>
                    {s.date_of_survey
                      ? new Date(s.date_of_survey).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{s.liked_most || "-"}</td>
                  <td>{s.how_interested || "-"}</td>
                  <td>{s.likelihood}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn tiny"
                        onClick={() => setEditingId(s.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn tiny danger"
                        onClick={() => onDelete(s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
