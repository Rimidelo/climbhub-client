// src/components/Profile/Profile.jsx

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '../../contexts/UserContext';
import {
  getUserProfile,
  getVideosByProfile,
  toggleLike,
  uploadProfileImage,
} from '../../API/api';
import AnimatedChip from '../AnimatedChip/AnimatedChip';
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
  Stack,
  Tabs,            // <-- NEW
  Tab,             // <-- NEW
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import VideoPopup from '../VideoPopup/VideoPopup';
import EditIcon from '@mui/icons-material/Edit';
import gymImages from '../../assets/data/gymImages';
import EditProfile from '../EditProfile/EditProfile';

// Icons for the tabs
import GridOnIcon from '@mui/icons-material/GridOn';           // <-- For "My Videos"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // <-- For "Saved Videos"

const Profile = () => {
  const { user, handleLogout } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);       // "My Videos" (uploaded)
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // NEW: Keep track of which tab is active: 0 => My Videos, 1 => Saved Videos
  const [activeTab, setActiveTab] = useState(0);

  const fetchProfileData = useCallback(async () => {
    try {
      const profileData = await getUserProfile(user._id);
      // The server populates "savedVideos," so profileData.savedVideos is available
      const userVideos = (await getVideosByProfile(profileData._id)) || [];
      setProfile(profileData);
      setVideos(userVideos);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchProfileData();
  }, [user, fetchProfileData]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await uploadProfileImage(user._id, file);
      await fetchProfileData();
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const handleLike = async (videoId) => {
    try {
      await toggleLike(videoId, user._id);
      // Re-fetch or optimistically update
      const updatedVideos = await getVideosByProfile(profile._id);
      setVideos(updatedVideos);
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

  const handleEditProfileOpen = () => {
    setEditProfileOpen(true);
  };
  const handleEditProfileClose = (updated) => {
    setEditProfileOpen(false);
    if (updated) {
      fetchProfileData();
    }
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

  // Renders a grid of videos (shared by "My Videos" and "Saved")
  const renderVideoGrid = (videoList) => {
    if (!videoList || videoList.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body1">No videos yet.</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={1}>
        {videoList.map((videoItem) => (
          <Grid item xs={4} sm={4} md={4} key={videoItem._id}>
            <Box
              sx={{
                width: '100%',
                position: 'relative',
                paddingTop: '100%', // square ratio
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#000',
              }}
              onClick={() => setSelectedVideo(videoItem)}
            >
              <video
                src={videoItem.videoUrl}
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
    );
  };

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
        {/* Avatar */}
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

        {/* Stats */}
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
            {/* # of My Videos (posts) */}
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

        {/* User Info & Actions */}
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
            <Button
              variant="outlined"
              sx={{ mr: 1 }}
              endIcon={<EditIcon />}
              onClick={handleEditProfileOpen}
            >
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
              <AnimatedChip label={profile.skillLevel || 'N/A'} />
            </Box>

            {/* Favorite Gyms */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Favorite Gyms
              </Typography>
              {profile.gyms && profile.gyms.length > 0 ? (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {profile.gyms.map((gym) => {
                    const gymData = gymImages[gym.name];
                    const gradientBorder = `linear-gradient(45deg, ${
                      gymData?.neon || '#fff'
                    }, #ff00ff, #00ffff)`;
                    return gymData?.image ? (
                      <Box
                        key={gym._id}
                        sx={{
                          width: 65,
                          height: 65,
                          borderRadius: '20%',
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          background: gradientBorder,
                        }}
                      >
                        <Box
                          component="img"
                          src={gymData.image}
                          alt={gym.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '20%',
                            objectFit: 'fit',
                          }}
                          onError={(e) => {
                            console.error(`Error loading image for ${gym.name}:`, e);
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        key={gym._id}
                        sx={{
                          width: 65,
                          height: 65,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '20%',
                          background: gradientBorder,
                          padding: '5px',
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '20%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#333',
                              fontWeight: 'bold',
                              fontSize: 10,
                              textAlign: 'center',
                            }}
                          >
                            {gym.name}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body2">No gyms specified.</Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* 
        3) Instagram-like tab bar using MUI's <Tabs> and <Tab> with icons only
      */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          centered
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: '#000' } }} // black bar indicator
        >
          <Tab icon={<GridOnIcon />} />           {/* 0 => My Videos */}
          <Tab icon={<BookmarkBorderIcon />} />   {/* 1 => Saved Videos */}
        </Tabs>
      </Box>

      {/* 4) Conditionally show "My Videos" or "Saved Videos" based on activeTab */}
      {activeTab === 0 && renderVideoGrid(videos)}
      {activeTab === 1 && renderVideoGrid(profile.savedVideos)}

      {/* Video Popup */}
      <VideoPopup
        open={!!selectedVideo}
        onClose={async () => {
          setSelectedVideo(null);
          try {
            // If you want to refresh the "My Videos" list after closing the popup
            const userVideos = await getVideosByProfile(profile._id);
            setVideos(userVideos);
          } catch (error) {
            console.error('Error refreshing videos:', error);
          }
        }}
        video={selectedVideo}
        handleLike={handleLike}
        setError={setError}
        user={user}
      />

      {/* Edit Profile Modal */}
      <EditProfile
        open={editProfileOpen}
        handleClose={handleEditProfileClose}
        currentProfile={profile}
      />
    </Box>
  );
};

export default Profile;
