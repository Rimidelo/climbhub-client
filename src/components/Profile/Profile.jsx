import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import {
  getUserProfile,
  getVideosByProfile,
  toggleLike,
  uploadProfileImage,
} from '../../API/api';

import {
  Box,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import VideoPopup from '../VideoPopup/VideoPopup';
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
  const { user, handleLogout } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // State for settings menu
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await getUserProfile(user._id);
        const userVideos = await getVideosByProfile(profileData._id) || []; // <-- Ensure an array
        setProfile(profileData);
        setVideos(userVideos); // even if no videos, this will be []
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfileData();
  }, [user]);


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await uploadProfileImage(user._id, file); // Upload the image
      const updatedProfile = await getUserProfile(user._id); // Fetch the updated profile
      setProfile(updatedProfile); // Update the profile state with the latest data
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const handleLike = async (videoId) => {
    try {
      await toggleLike(videoId, user._id);
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? { ...video, likesCount: video.likesCount + 1 }
            : video
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to toggle like.');
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 2, py: 4 }}>
      {/* Profile Header */}
      <Grid
        container
        spacing={2}
        sx={{ marginBottom: 2 }}
        alignItems="center"
        justifyContent="center"
      >
        {/* Avatar Column */}
        <Grid
          item
          xs={12}
          sm={4}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box
            position="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar
              src={`${profile?.user?.image || '/default-avatar.png'}?t=${Date.now()}`}
              alt={profile?.user?.name || 'Default User'}
              sx={{
                width: { xs: 100, sm: 130, md: 150 },
                height: { xs: 100, sm: 130, md: 150 },
              }}
            />
            {hovered && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: { xs: 100, sm: 130, md: 150 },
                  height: { xs: 100, sm: 130, md: 150 },
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              >
                <IconButton component="label" sx={{ color: '#fff' }}>
                  <EditIcon />
                  <input type="file" hidden onChange={handleImageUpload} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Stats Column */}
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'space-around', sm: 'flex-start' },
              width: '100%',
              mb: 1,
            }}
          >
            {/* Posts */}
            <Box sx={{ textAlign: 'center', mr: { xs: 2, sm: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {videos.length}
              </Typography>
              <Typography variant="body2">Posts</Typography>
            </Box>
            {/* Followers */}
            <Box sx={{ textAlign: 'center', mr: { xs: 2, sm: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {profile.followersCount || 0}
              </Typography>
              <Typography variant="body2">Followers</Typography>
            </Box>
            {/* Following */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {profile.followingCount || 0}
              </Typography>
              <Typography variant="body2">Following</Typography>
            </Box>
          </Box>
        </Grid>

        {/* User Info & Actions Column */}
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'center',
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {profile?.user?.name || 'Anonymous User'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="outlined" sx={{ mr: 1 }}>
              Edit Profile
            </Button>
            <IconButton onClick={handleMenuOpen}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Settings Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleLogout();
            handleMenuClose();
          }}
          sx={{ color: 'red' }}
        >
          Logout
        </MenuItem>
      </Menu>

      <Divider sx={{ my: 2 }} />

      {/* Additional Profile Details (Skill Level & Favorite Gyms) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 4,
            }}
          >
            {/* Skill Level */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Skill Level
              </Typography>
              <Chip
                label={profile.skillLevel || 'N/A'}
                variant="outlined"
                color="primary"
                sx={{ fontSize: '0.9rem' }}
              />
            </Box>

            {/* Favorite Gyms */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Favorite Gyms
              </Typography>
              {profile.gyms && profile.gyms.length > 0 ? (
                <Stack direction="row" spacing={1}>
                  {profile.gyms.map((gym) => (
                    <Chip key={gym._id} label={gym.name} variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2">No gyms specified.</Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Video Grid */}
      {videos.length > 0 ? (
        <Grid container spacing={1}>
          {videos.map((video) => (
            <Grid item xs={4} sm={4} md={4} key={video._id}>
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '100%', // square ratio
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: '#000',
                }}
                onClick={() => setSelectedVideo(video)} // Open popup
              >
                <video
                  src={video.videoUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  muted
                  playsInline
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body1">
            No videos yet.
          </Typography>
        </Box>
      )}

      {/* Video Popup */}
      <VideoPopup
        open={!!selectedVideo}
        onClose={async () => {
          setSelectedVideo(null); // Close the popup
          try {
            const userVideos = await getVideosByProfile(profile._id); // Fetch updated videos
            setVideos(userVideos); // Update the video list
          } catch (error) {
            console.error('Error refreshing videos:', error);
          }
        }}
        video={selectedVideo}
        handleLike={handleLike}
        setError={setError}
        user={user}
      />
    </Box>
  );
};

export default Profile;
