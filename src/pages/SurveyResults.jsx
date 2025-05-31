import { useEffect, useState } from 'react';
import axios from 'axios';
import './results.css';

export default function SurveyResults() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching survey results...');
    axios.get('https://lifestyle-survey-app-api.onrender.com/api/surveys/results')
      .then(res => {
        console.log('Received data:', res.data);
        setData(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to load survey results');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading survey results...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">No data available</div>;

  return (
    <div className="results-container">
      <h2>Survey Results</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Surveys</h3>
          <p>{data.totalSurveys}</p>
        </div>
        <div className="stat-card">
          <h3>Average Age</h3>
          <p>{data.averageAge}</p>
        </div>
        <div className="stat-card">
          <h3>Oldest Age</h3>
          <p>{data.oldestPersonAge}</p>
        </div>
        <div className="stat-card">
          <h3>Youngest Age</h3>
          <p>{data.youngestPersonAge}</p>
        </div>
      </div>

      <h3>Food Preferences</h3>
      <div className="table-container">
        <table className="food-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pizza</td>
              <td>{data.foodPreferences.pizza}%</td>
            </tr>
            <tr>
              <td>Pasta</td>
              <td>{data.foodPreferences.pasta}%</td>
            </tr>
            <tr>
              <td>Pap and Wors</td>
              <td>{data.foodPreferences.papAndWors}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Lifestyle Ratings</h3>
      <div className="table-container">
        <table className="ratings-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Average Rating (1-5)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Eating Out</td>
              <td>{data.lifestyleAverages.eatOut}</td>
            </tr>
            <tr>
              <td>Watching Movies</td>
              <td>{data.lifestyleAverages.watchMovies}</td>
            </tr>
            <tr>
              <td>Watching TV</td>
              <td>{data.lifestyleAverages.watchTV}</td>
            </tr>
            <tr>
              <td>Listening to Radio</td>
              <td>{data.lifestyleAverages.listenToRadio}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}