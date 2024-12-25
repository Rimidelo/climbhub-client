// Preferences.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// If using React Router for navigation
import { useNavigate } from 'react-router-dom';

const Preferences = ({ user }) => {
  const navigate = useNavigate(); // For navigation after submission

  const [skillLevel, setSkillLevel] = useState('');
  const [preferredStyles, setPreferredStyles] = useState('');
  const [selectedGyms, setSelectedGyms] = useState([]);
  const [gymsList, setGymsList] = useState([]); // To populate gym options
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch available gyms from the server (assuming you have a /api/gyms endpoint)
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await axios.get('/api/gyms'); // Adjust the endpoint as necessary
        setGymsList(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gyms:', err);
        setError('Failed to load gyms.');
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Prepare data
    const profileData = {
      user: user._id, // Ensure user ID is available
      skillLevel,
      preferredStyles: preferredStyles.split(',').map(style => style.trim()), // Convert comma-separated string to array
      gyms: selectedGyms, // Array of gym IDs
    };

    try {
      const response = await axios.post('/profile', profileData); // Adjust the endpoint if necessary
      console.log('Profile created:', response.data);
      // Navigate to dashboard or another page
      navigate('/dashboard'); // Adjust the path as needed
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.response?.data?.error || 'Failed to create profile.');
    }
  };

  const handleGymSelection = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedGyms(prev => [...prev, value]);
    } else {
      setSelectedGyms(prev => prev.filter(gymId => gymId !== value));
    }
  };

  if (loading) return <p>Loading gyms...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Set Your Preferences</h2>
      <form onSubmit={handleSubmit}>
        {/* Skill Level */}
        <div>
          <label htmlFor="skillLevel">Skill Level:</label>
          <select
            id="skillLevel"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            required
          >
            <option value="">-- Select Skill Level --</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Preferred Styles */}
        <div>
          <label htmlFor="preferredStyles">Preferred Styles (comma-separated):</label>
          <input
            type="text"
            id="preferredStyles"
            value={preferredStyles}
            onChange={(e) => setPreferredStyles(e.target.value)}
            placeholder="e.g., Boxing, Muay Thai"
            required
          />
        </div>

        {/* Gyms */}
        <div>
          <label>Gyms:</label>
          <div>
            {gymsList.map(gym => (
              <div key={gym._id}>
                <input
                  type="checkbox"
                  id={`gym-${gym._id}`}
                  value={gym._id}
                  onChange={handleGymSelection}
                />
                <label htmlFor={`gym-${gym._id}`}>{gym.name} - {gym.location}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Save Preferences</button>

        {/* Error Message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Preferences;
