import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getUserProfile, getVideosByProfile, toggleLike } from '../../API/api';
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
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import VideoPopup from '../VideoPopup/VideoPopup';

const Profile = () => {
    const { user, handleLogout } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null); // State for settings menu

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileData = await getUserProfile(user._id); // Fetch profile data
                const userVideos = await getVideosByProfile(profileData._id); // Fetch user's videos
                setProfile(profileData);
                setVideos(userVideos);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProfileData();
    }, [user]);

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
        <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: '1200px', margin: '0 auto' }}>
            {/* Profile Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 4,
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
            >
                <Avatar
                    src={profile.profilePicture}
                    alt={profile.name}
                    sx={{ width: 120, height: 120, marginRight: { xs: 0, md: 4 }, marginBottom: { xs: 2, md: 0 } }}
                />
                <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        {profile.user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                        <Button variant="outlined" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                            Edit Profile
                        </Button>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ marginLeft: 2 }}
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* Settings Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        handleLogout();
                        handleMenuClose();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>

            {/* Stats */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    maxWidth: '600px',
                    margin: '0 auto 24px',
                }}
            >
                <Box>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                        {videos.length}
                    </Typography>
                    <Typography variant="body2" align="center">
                        Videos
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                        {profile.followersCount || 0}
                    </Typography>
                    <Typography variant="body2" align="center">
                        Followers
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                        {profile.followingCount || 0}
                    </Typography>
                    <Typography variant="body2" align="center">
                        Following
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ marginBottom: 4 }} />

            {/* Video Grid */}
            <Grid container spacing={2} sx={{ padding: { xs: 1, md: 2 } }}>
                {videos.map((video) => (
                    <Grid item xs={4} sm={4} md={4} key={video._id}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '0',
                                paddingTop: '100%', // Maintain square aspect ratio
                                position: 'relative',
                                borderRadius: 4,
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

            {/* Video Popup */}
            <VideoPopup
                open={!!selectedVideo}
                onClose={() => setSelectedVideo(null)} // Close the popup
                video={selectedVideo}
                handleLike={handleLike}
                setError={setError}
                user={user}
            />
        </Box>
    );
};

export default Profile;
