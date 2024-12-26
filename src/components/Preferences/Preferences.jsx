import React, { useState, useEffect, useContext } from 'react';
import { getGyms, createProfile } from '../../API/api'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext'; // Ensure you have a UserContext set up

const Preferences = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [skillLevel, setSkillLevel] = useState('');
  const [selectedGyms, setSelectedGyms] = useState([]);
  const [gymsList, setGymsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch gyms when component mounts
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const gyms = await getGyms();
        setGymsList(gyms);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gyms:', err);
        setError('Failed to load gyms.');
        setLoading(false);
      }
    };
    fetchGyms();
  }, []);

  const handleGymSelection = (gymId) => {
    setSelectedGyms((prev) => {
      if (prev.includes(gymId)) {
        return prev.filter((id) => id !== gymId);
      } else {
        return [...prev, gymId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user presence
    if (!user || !user._id) {
      setError('User not found. Please login again.');
      return;
    }

    // Prepare profile data
    const profileData = {
      user: user._id,
      skillLevel,
      gyms: selectedGyms,
    };

    try {
      await createProfile(profileData);
      // Navigate to home (/) upon success
      navigate('/');
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.response?.data?.error || 'Failed to create profile.');
    }
  };

  if (loading) {
    return <div>Loading gyms...</div>;
  }

  return (
    <div>
      <h2>Set Your Preferences</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Skill Level Selection */}
        <div>
          <label htmlFor="skillLevel">Skill Level:</label>
          <select
            id="skillLevel"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            required
          >
            <option value="">Select your level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Gyms Selection */}
        <div>
          <label>Gyms:</label>
          <div>
            {gymsList.map((gym) => (
              <div key={gym._id}>
                <input
                  type="checkbox"
                  id={`gym-${gym._id}`}
                  value={gym._id}
                  onChange={() => handleGymSelection(gym._id)}
                  checked={selectedGyms.includes(gym._id)}
                />
                <label htmlFor={`gym-${gym._id}`}>
                  {gym.name} - {gym.location}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default Preferences;
