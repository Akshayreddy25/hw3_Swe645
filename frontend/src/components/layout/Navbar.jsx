import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="nav-root">
      <div className="nav-inner">
        <Link to="/" className="logo">
          AKR Survey Hub
        </Link>
        <nav className="nav-links">
          <Link className={linkClass("/")} to="/">
            Overview
          </Link>
          <Link className={linkClass("/survey/new")} to="/survey/new">
            Submit Survey
          </Link>
          <Link className={linkClass("/surveys")} to="/surveys">
            View Surveys
          </Link>
        </nav>
      </div>
    </header>
  );
}
