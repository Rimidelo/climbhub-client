// src/components/Profile/Profile.jsx
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
  Tabs,
  Tab,
} from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import VideoPopup from '../VideoPopup/VideoPopup';
import EditIcon from '@mui/icons-material/Edit';
import gymImages from '../../assets/data/gymImages';
import EditProfile from '../EditProfile/EditProfile';

// Icons for the tabs
import GridOnIcon from '@mui/icons-material/GridOn'; // For "My Videos"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // For "Saved Videos"

const Profile = () => {
  const { id: routeId } = useParams(); // If present, this is the user id to display
  const { user, handleLogout } = useContext(UserContext);
  
  // Determine if we are viewing our own profile.
  const isOwnProfile = !routeId || routeId === user._id;
  // If no route parameter is provided, use current user ID.
  const profileUserId = isOwnProfile ? user._id : routeId;

  // Component state
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchProfileData = useCallback(async () => {
    try {
      const profileData = await getUserProfile(profileUserId);
      const userVideos = (await getVideosByProfile(profileData._id)) || [];
      setProfile(profileData);
      setVideos(userVideos);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  }, [profileUserId]);

  useEffect(() => {
    if (profileUserId) {
      fetchProfileData();
    }
  }, [profileUserId, fetchProfileData]);

  // Handle profile image upload (only allowed for own profile)
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">User not found</Typography>
      </Box>
    );
  }

  // Render a grid of videos
  const renderVideoGrid = (videoList) => {
    if (!videoList || videoList.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body1">No videos yet.</Typography>
        </Box>
      );
    }
    return (
      <Grid container spacing={1} mb={3}>
        {videoList.map((videoItem) => (
          <Grid item xs={4} key={videoItem._id}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '100%', // Square ratio
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
      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
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
            {/* Show the edit overlay only for your own profile */}
            {isOwnProfile && hovered && (
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
        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'space-around', sm: 'flex-start' }, width: '100%', mb: 1 }}>
            <Box sx={{ textAlign: 'center', mr: { xs: 2, sm: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{videos.length}</Typography>
              <Typography variant="body2">Posts</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', mr: { xs: 2, sm: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.savedVideos.length}</Typography>
              <Typography variant="body2">Saved Videos</Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* User Info & Actions */}
        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, justifyContent: 'center', textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {profile?.user?.name || 'Anonymous User'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isOwnProfile && (
              <Button variant="outlined" sx={{ mr: 1 }} endIcon={<EditIcon />} onClick={handleEditProfileOpen}>
                Edit Profile
              </Button>
            )}
            {isOwnProfile && (
              <IconButton onClick={handleMenuOpen}>
                <SettingsIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Settings Menu (only for own profile) */}
      {isOwnProfile && (
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
      )}

      <Divider sx={{ my: 2 }} />

      {/* Additional Profile Details */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 4,
          }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Skill Level</Typography>
              <AnimatedChip label={profile.skillLevel || 'N/A'} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Favorite Gyms</Typography>
              {profile.gyms && profile.gyms.length > 0 ? (
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {profile.gyms.map((gym) => {
                    const gymData = gymImages[gym.name];
                    const gradientBorder = `linear-gradient(45deg, ${gymData?.neon || '#fff'}, #ff00ff, #00ffff)`;
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
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
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

      {/* Instagram-like Tab Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          centered
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: '#000' } }}
        >
          <Tab icon={<GridOnIcon />} />           {/* My Videos */}
          <Tab icon={<BookmarkBorderIcon />} />   {/* Saved Videos */}
        </Tabs>
      </Box>

      {activeTab === 0 && renderVideoGrid(videos)}
      {activeTab === 1 && renderVideoGrid(profile.savedVideos)}

      <VideoPopup
        open={!!selectedVideo}
        onClose={async () => {
          setSelectedVideo(null);
          try {
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

      <EditProfile
        open={editProfileOpen}
        handleClose={handleEditProfileClose}
        currentProfile={profile}
      />
    </Box>
  );
};

export default Profile;
