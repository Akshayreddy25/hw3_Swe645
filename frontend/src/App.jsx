import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NewSurveyPage from "./pages/NewSurveyPage.jsx";
import SurveysPage from "./pages/SurveysPage.jsx";

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/survey/new" element={<NewSurveyPage />} />
          <Route path="/surveys" element={<SurveysPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
