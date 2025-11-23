import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="page page-center">
      <div className="landing-card card">
        <h1 className="landing-title">Capture campus vibes in 2 minutes.</h1>
        <p className="landing-subtitle">
          The AKR Survey Hub helps us understand how visitors experience the
          university — from atmosphere and housing to academics and student
          life.
        </p>

        <div className="landing-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/survey/new")}
          >
            Start Survey
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/surveys")}
          >
            Explore Responses
          </button>
        </div>

        <div className="landing-grid">
          <div className="info-card">
            <h3>Light & Modern</h3>
            <p>
              Clean, responsive design that works on laptops, tablets, and
              phones.
            </p>
          </div>
          <div className="info-card">
            <h3>Real-time Insights</h3>
            <p>
              Submitted data is instantly stored in MySQL and visible in the
              dashboard.
            </p>
          </div>
          <div className="info-card">
            <h3>CI/CD Ready</h3>
            <p>
              Changes from GitHub flow through Jenkins into Kubernetes
              automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
