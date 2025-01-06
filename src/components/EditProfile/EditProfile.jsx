// src/components/EditProfile/EditProfile.jsx

import React, { useState, useEffect, useContext } from 'react';
import { getGyms, updateProfile } from '../../API/api'; // Ensure correct import paths
import { UserContext } from '../../contexts/UserContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Chip,
  Alert,
} from '@mui/material';

const EditProfile = ({ open, handleClose, currentProfile }) => {
  const { user } = useContext(UserContext);

  const [skillLevel, setSkillLevel] = useState('');
  const [selectedGyms, setSelectedGyms] = useState([]);
  const [gymsList, setGymsList] = useState([]);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch gyms when component mounts
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const gyms = await getGyms();
        setGymsList(gyms);
        setLoadingGyms(false);
      } catch (err) {
        console.error('Error fetching gyms:', err);
        setError('Failed to load gyms.');
        setLoadingGyms(false);
      }
    };
    if (open) {
      fetchGyms();
    }
  }, [open]);

  // Initialize form fields with current profile data
  useEffect(() => {
    if (currentProfile) {
      setSkillLevel(currentProfile.skillLevel || '');
      setSelectedGyms(currentProfile.gyms || []);
    }
  }, [currentProfile]);

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

    // Prepare updated profile data
    const updatedData = {
      skillLevel,
      gyms: selectedGyms.map((gym) => gym._id), // Extract gym IDs
    };

    try {
      setSubmitting(true);
      await updateProfile(currentProfile._id, updatedData);
      setSubmitting(false);
      setSuccess('Profile updated successfully!');
      // Optionally, you can trigger a refresh in the parent component
      handleClose(true); // Pass true to indicate success
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
      setSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setError('');
    setSuccess('');
    handleClose(false); // Pass false to indicate no update
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
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
                <InputLabel id="edit-skill-level-label">Skill Level</InputLabel>
                <Select
                  labelId="edit-skill-level-label"
                  id="edit-skillLevel"
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
              <Autocomplete
                multiple
                id="edit-gyms-autocomplete"
                options={gymsList}
                getOptionLabel={(option) => `${option.name} - ${option.location}`}
                value={selectedGyms}
                onChange={handleGymChange}
                loading={loadingGyms}
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
                    label="Select Gyms"
                    placeholder="Choose your preferred gyms"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingGyms ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="secondary" disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;
