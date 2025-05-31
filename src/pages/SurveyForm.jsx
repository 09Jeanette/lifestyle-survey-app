// SurveyForm.jsx
import { useState } from 'react';
import axios from 'axios';
import './form.css'; // We'll create this CSS file

const foods = ['Pizza', 'Pasta', 'Pap and Wors'];
const ratingLabels = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];

export default function SurveyForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    dateOfBirth: '',
    favoriteFood: [],
    ratings: {
      eatOut: '',
      watchMovies: '',
      watchTV: '',
      listenToRadio: ''
    }
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFoodChange = (food) => {
    setForm(prev => ({
      ...prev,
      favoriteFood: prev.favoriteFood.includes(food)
        ? prev.favoriteFood.filter(f => f !== food)
        : [...prev.favoriteFood, food]
    }));
  };

  const handleRatingChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [field]: value }
    }));
  };

  const validate = () => {
    const { fullName, email, contactNumber, dateOfBirth, ratings, favoriteFood } = form;
    const age = dateOfBirth ? new Date().getFullYear() - new Date(dateOfBirth).getFullYear() : 0;

    if (!fullName || !email || !contactNumber || !dateOfBirth) return 'Please fill all personal details.';
    if (!/^\d{10}$/.test(contactNumber)) return 'Contact number must be 10 digits.';
    if (age < 5 || age > 120) return 'Age must be between 5 and 120.';
    if (favoriteFood.length < 1) return 'Select at least one favorite food.';
    for (let key in ratings) if (!ratings[key]) return `Please rate: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setIsSubmitting(true);
    try {
      await axios.post('https://lifestyle-survey-app-api.onrender.com/api/surveys/', form);
      alert('Survey submitted successfully!');
      setForm({
        fullName: '', email: '', contactNumber: '', dateOfBirth: '', favoriteFood: [],
        ratings: { eatOut: '', watchMovies: '', watchTV: '', listenToRadio: '' }
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-card">
        <h2 className="survey-title">Lifestyle Survey</h2>
        <p className="survey-subtitle">Help us understand your preferences</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  value={form.fullName} 
                  onChange={e => setForm({ ...form, fullName: e.target.value })} 
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input 
                  type="tel" 
                  value={form.contactNumber} 
                  onChange={e => setForm({ ...form, contactNumber: e.target.value })} 
                  placeholder="1234567890"
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input 
                  type="date" 
                  value={form.dateOfBirth} 
                  onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Favorite Foods (Select at least one)</h3>
            <div className="food-options">
              {foods.map(food => (
                <label key={food} className="food-option">
                  <input
                    type="checkbox"
                    checked={form.favoriteFood.includes(food)}
                    onChange={() => handleFoodChange(food)}
                    className="hidden-checkbox"
                  />
                  <span className="custom-checkbox"></span>
                  {food}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Lifestyle Ratings</h3>
            <div className="ratings-table">
              <table>
                <thead>
                  <tr>
                    <th>Activity</th>
                    {ratingLabels.map((label, index) => (
                      <th key={index}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'eatOut', label: 'I like Eating Out' },
                    { key: 'watchMovies', label: 'I like Watching Movies' },
                    { key: 'watchTV', label: 'I like Watching TV' },
                    { key: 'listenToRadio', label: 'I like  Listening to Radio' }
                  ].map(({ key, label }) => (
                    <tr key={key}>
                      <td>{label}</td>
                      {[1, 2, 3, 4, 5].map(value => (
                        <td key={value}>
                          <label className="rating-option">
                            <input
                              type="radio"
                              name={key}
                              value={value}
                              checked={form.ratings[key] === value.toString()}
                              onChange={() => handleRatingChange(key, value.toString())}
                              className="hidden-radio"
                            />
                            <span className="custom-radio"></span>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </form>
      </div>
    </div>
  );
}