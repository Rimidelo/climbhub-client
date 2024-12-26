// UploadVideo.js
import React, { useState, useEffect } from 'react';
import { getGyms, uploadVideo } from '../../API/api'; // import the new uploadVideo

function UploadVideo() {
  const [gyms, setGyms] = useState([]);
  const [description, setDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [gymId, setGymId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  // 1) Fetch gyms once on component mount
  useEffect(() => {
    const fetchGymsData = async () => {
      try {
        const data = await getGyms();
        setGyms(data);
      } catch (error) {
        console.error('Error fetching gyms:', error);
      }
    };

    fetchGymsData();
  }, []);

  // 2) Handle file selection
  const handleVideoChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  // 3) Submit form data to the server
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      alert('Please select a video file first.');
      return;
    }

    try {
      // We use FormData to handle file + other fields
      const formData = new FormData();
      formData.append('description', description);
      formData.append('difficultyLevel', difficultyLevel);
      formData.append('gym', gymId);
      formData.append('profile', profileId);
      formData.append('videoFile', videoFile); // must match the backend field

      // Call our new fetch-based function instead of axios.post
      const responseData = await uploadVideo(formData);

      alert('Video uploaded successfully!');
      console.log('Response data:', responseData);

      // Optionally reset the form
      setDescription('');
      setDifficultyLevel('');
      setGymId('');
      setProfileId('');
      setVideoFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        <label style={styles.label}>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Difficulty Level:
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            style={styles.input}
          >
            <option value="">Select difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </label>

        {/* Gym selection dropdown */}
        <label style={styles.label}>
          Gym:
          <select
            value={gymId}
            onChange={(e) => setGymId(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Gym</option>
            {gyms.map((gym) => (
              <option key={gym._id} value={gym._id}>
                {gym.name}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Profile ID:
          <input
            type="text"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Video File:
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            style={styles.input}
            required
          />
        </label>

        <button type="submit" style={styles.button}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadVideo;

// Simple inline styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    marginTop: '0.25rem',
  },
  button: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
