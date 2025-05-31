import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SurveyForm from './pages/SurveyForm';
import SurveyResults from './pages/SurveyResults';

function App() {
  return (
    <Router>
      <nav className="nav">
        <Link to="/">Fill Out Survey</Link>
        <Link to="/results">View Survey Results</Link>
      </nav>
      <Routes>
        <Route path="/" element={<SurveyForm />} />
        <Route path="/results" element={<SurveyResults />} />
      </Routes>
    </Router>
  );
}

export default App;
