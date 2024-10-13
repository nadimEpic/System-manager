import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTimesheet = ({ onAdd }) => {
  const [timesheet, setTimesheet] = useState({
    date: '',
    hours: '',
    description: '',
    category_id: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setTimesheet({
      ...timesheet,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3000/auth/timesheets', timesheet)
      .then((response) => {
        if (onAdd) {
          onAdd(response.data);
        }
        setTimesheet({
          date: '',
          hours: '',
          description: '',
          category_id: '',
        });
        setError('');
        setSuccess('Timesheet added successfully!');
        setTimeout(() => {
          navigate('/dashboard/timesheet'); // Redirect after 2 seconds
        }, 2000);
      })
      .catch((error) => {
        console.error('Error adding timesheet:', error.response?.data || error.message);
        setError('Error adding timesheet. Please try again.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Add Timesheet</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="date"
            name="date"
            value={timesheet.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="hours" className="form-label">Hours</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="hours"
            name="hours"
            value={timesheet.hours}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category_id" className="form-label">Category</label>
          <select
            name="category_id"
            id="category_id"
            className="form-select"
            value={timesheet.category_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {category.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={timesheet.description}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="alert">{success}</div>}
        <button type="submit" className="btn btn-primary">Add Timesheet</button>
      </form>
    </div>
  );
};

export default AddTimesheet;
