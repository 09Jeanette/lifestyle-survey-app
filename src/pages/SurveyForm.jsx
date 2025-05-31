import { useState } from 'react';
import axios from 'axios';
import './form.css';

const foods = ['Pizza', 'Pasta', 'Pap and Wors'];

export default function SurveyForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
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

  const handleFoodChange = (food) => {
    setForm((prev) => {
      const current = prev.favoriteFood.includes(food)
        ? prev.favoriteFood.filter(f => f !== food)
        : [...prev.favoriteFood, food];
      return { ...prev, favoriteFood: current };
    });
  };

  const handleRatingChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [field]: value
      }
    }));
  };

  const validate = () => {
    const { fullName, email, dateOfBirth, favoriteFood, ratings } = form;
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (!fullName || !email || !dateOfBirth) return 'All personal fields are required.';
    if (age < 5 || age > 120) return 'Age must be between 5 and 120.';
    if (favoriteFood.length === 0) return 'Please select at least one favorite food.';
    for (let key in ratings) {
      if (!ratings[key]) return `Please rate ${key}.`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      await axios.post('https://lifestyle-survey-app-api.onrender.com/api/survey', form);
      alert('Survey submitted!');
      setForm({
        fullName: '',
        email: '',
        dateOfBirth: '',
        favoriteFood: [],
        ratings: { eatOut: '', watchMovies: '', watchTV: '', listenToRadio: '' }
      });
    } catch (err) {
      setError('Submission failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Fill Out Survey</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />

        <fieldset>
          <legend>Favorite Food</legend>
          {foods.map(food => (
            <label key={food}>
              <input type="checkbox" checked={form.favoriteFood.includes(food)} onChange={() => handleFoodChange(food)} />
              {food}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Rate the following (1-5)</legend>
          {Object.keys(form.ratings).map(key => (
            <div key={key}>
              <label>{key}</label>
              {[1, 2, 3, 4, 5].map(val => (
                <label key={val}>
                  <input type="radio" name={key} value={val} checked={form.ratings[key] === val.toString()} onChange={() => handleRatingChange(key, val.toString())} />
                  {val}
                </label>
              ))}
            </div>
          ))}
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
