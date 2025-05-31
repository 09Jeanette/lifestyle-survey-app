import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SurveyForm from './pages/SurveyForm';
import SurveyResults from './pages/SurveyResults';
import './App.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <nav className="nav">
        <div className="nav-left">
          <span className="survey-title">Surveys</span>
          <button 
            className="hamburger" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
        <div className={`nav-right ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>FILL OUT SURVEY</NavLink>
          <NavLink to="/results" onClick={() => setMenuOpen(false)}>VIEW SURVEY RESULTS</NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/results" element={<SurveyResults />} />
      </Routes>
    </Router>
  );
}

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`nav-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default App;