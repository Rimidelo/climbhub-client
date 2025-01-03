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
  const [gradingSystem, setGradingSystem] = useState(''); // New field for grading system
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [gymId, setGymId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [loadingGyms, setLoadingGyms] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isFormValid =
    description.trim() &&
    gradingSystem &&
    difficultyLevel &&
    gymId &&
    videoFile;


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

    if (!gradingSystem) {
      setError('Please select a grading system.');
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
      formData.append('gradingSystem', gradingSystem); // Include grading system
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
      setGradingSystem('');
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

  const difficultyOptions = {
    'V-Grading': ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'],
    'Japanese-Colored': [
      { value: 'Pink', color: '#FFC0CB' },
      { value: 'Green', color: '#008000' },
      { value: 'Yellow', color: '#FFFF00' },
      { value: 'Red', color: '#FF0000' },
      { value: 'Blue', color: '#0000FF' },
      { value: 'White', color: '#FFFFFF' },
      { value: 'Orange', color: '#FFA500' },
      { value: 'Light Green', color: '#90EE90' },
      { value: 'Black', color: '#000000' },
    ],
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

            {/* Grading System Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="grading-system-label">Grading System</InputLabel>
                <Select
                  labelId="grading-system-label"
                  id="gradingSystem"
                  value={gradingSystem}
                  label="Grading System"
                  onChange={(e) => {
                    setGradingSystem(e.target.value);
                    setDifficultyLevel(''); // Reset difficulty level on grading system change
                  }}
                  required
                >
                  <MenuItem value="V-Grading">V-Grading</MenuItem>
                  <MenuItem value="Japanese-Colored">Japanese-Colored</MenuItem>
                </Select>
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
                  {gradingSystem === 'V-Grading' &&
                    difficultyOptions['V-Grading'].map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  {gradingSystem === 'Japanese-Colored' &&
                    difficultyOptions['Japanese-Colored'].map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 20,
                              backgroundColor: level.color,
                            }}
                          />
                          {level.value}
                        </Box>
                      </MenuItem>
                    ))}
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
                {/* Video File Input */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
                  </Box>
                  {videoFile && (
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                      Selected File: {videoFile.name}
                    </Typography>
                  )}
                </Grid>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isFormValid || submitting}
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
