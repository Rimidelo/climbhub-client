// src/components/Preferences/Preferences.jsx

import React, { useState, useEffect, useContext } from 'react';
import { getGyms, createProfile } from '../../API/api'; // Adjust the path if necessary
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
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';

const Preferences = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [skillLevel, setSkillLevel] = useState('');
  const [selectedGyms, setSelectedGyms] = useState([]); // Array of gym objects
  const [gymsList, setGymsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Handle gym selection via Autocomplete
  const handleGymChange = (event, value) => {
    setSelectedGyms(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate user presence
    if (!user || !user._id) {
      setError('User not found. Please login again.');
      return;
    }

    // Prepare profile data
    const profileData = {
      user: user._id,
      skillLevel,
      gyms: selectedGyms.map((gym) => gym._id), // Extract gym IDs
    };

    try {
      setSubmitting(true);
      await createProfile(profileData);
      setSubmitting(false);
      setSuccess('Preferences saved successfully!');
      // Navigate to home after a short delay to show success message
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.response?.data?.message || 'Failed to create profile.');
      setSubmitting(false);
    }
  };

  if (loading) {
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
          Set Your Preferences
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Skill Level Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="skill-level-label">Skill Level</InputLabel>
                <Select
                  labelId="skill-level-label"
                  id="skillLevel"
                  value={skillLevel}
                  label="Skill Level"
                  onChange={(e) => setSkillLevel(e.target.value)}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Gyms Selection with Autocomplete */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Select Your Preferred Gyms
              </Typography>
              <Autocomplete
                multiple
                id="gyms-autocomplete"
                options={gymsList}
                getOptionLabel={(option) => `${option.name} - ${option.location}`}
                value={selectedGyms}
                onChange={handleGymChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={`${option.name} - ${option.location}`}
                      {...getTagProps({ index })}
                      key={option._id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select Gyms"
                  />
                )}
              />
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
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save Preferences'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Preferences;
