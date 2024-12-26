// src/components/UploadVideo/UploadVideo.jsx

import React, { useState, useEffect, useContext } from 'react';
import { getGyms, uploadVideo, getUserProfile } from '../../API/api'; // Import getUserProfile
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  TextField,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Using MUI icon

const UploadVideo = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [gyms, setGyms] = useState([]);
  const [description, setDescription] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [gymId, setGymId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [loadingGyms, setLoadingGyms] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch gyms once on component mount
  useEffect(() => {
    const fetchGymsData = async () => {
      try {
        const data = await getGyms();
        setGyms(data);
        setLoadingGyms(false);
      } catch (error) {
        console.error('Error fetching gyms:', error);
        setError('Failed to load gyms.');
        setLoadingGyms(false);
      }
    };

    fetchGymsData();
  }, []);

  // Fetch user profile once on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user._id) {
        setError('User not found. Please login again.');
        setLoadingProfile(false);
        return;
      }

      try {
        console.log(user._id);
        
        const profile = await getUserProfile(user._id);
        if (profile && profile._id) {
          setProfileId(profile._id);
        } else {
          setError('Profile not found. Please set up your preferences.');
          navigate('/preferences');
        }
        setLoadingProfile(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile.');
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  // Handle file selection
  const handleVideoChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!videoFile) {
      setError('Please select a video file.');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }

    if (!difficultyLevel) {
      setError('Please select a difficulty level.');
      return;
    }

    if (!gymId) {
      setError('Please select a gym.');
      return;
    }

    if (!profileId) {
      setError('Profile ID is missing.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Use FormData to handle file and other fields
      const formData = new FormData();
      formData.append('description', description);
      formData.append('difficultyLevel', difficultyLevel);
      formData.append('gym', gymId);
      formData.append('profile', profileId);
      formData.append('videoFile', videoFile); // must match the backend field

      // Call the uploadVideo API function
      const responseData = await uploadVideo(formData);

      setSuccess('Video uploaded successfully!');
      console.log('Response data:', responseData);

      // Optionally reset the form
      setDescription('');
      setDifficultyLevel('');
      setGymId('');
      setVideoFile(null);

      // Navigate to home after a short delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.response?.data?.message || 'Failed to upload video.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGyms || loadingProfile) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '80vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 600,
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Upload Video
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={3}>
            {/* Description Field */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </FormControl>
            </Grid>

            {/* Difficulty Level Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="difficulty-level-label">Difficulty Level</InputLabel>
                <Select
                  labelId="difficulty-level-label"
                  id="difficultyLevel"
                  value={difficultyLevel}
                  label="Difficulty Level"
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  required
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Gym Selection Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="gym-label">Gym</InputLabel>
                <Select
                  labelId="gym-label"
                  id="gymId"
                  value={gymId}
                  label="Gym"
                  onChange={(e) => setGymId(e.target.value)}
                  required
                >
                  <MenuItem value="">
                    <em>Select Gym</em>
                  </MenuItem>
                  {gyms.map((gym) => (
                    <MenuItem key={gym._id} value={gym._id}>
                      {gym.name} - {gym.location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Video File Input */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Select Video File
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleVideoChange}
                    required
                  />
                </Button>
                {videoFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected File: {videoFile.name}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UploadVideo;
