import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getUserProfile, getVideosByProfile } from '../../API/api'; // Ensure correct API calls
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Button,
    Divider,
    CircularProgress,
} from '@mui/material';

const colorGradingMap = {
    Blue: '#0000FF',
    Red: '#FF0000',
    Yellow: '#FFFF00',
    Green: '#008000',
    Black: '#000000',
    White: '#FFFFFF',
    Orange: '#FFA500',
    'Light Green': '#90EE90',
};

const Profile = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileData = await getUserProfile(user._id); // Fetch profile data
                const userVideos = await getVideosByProfile(profileData._id); // Fetch videos uploaded by the user
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
                    src={profile.profilePicture} // Placeholder for profile picture
                    alt={profile.name}
                    sx={{ width: 120, height: 120, marginRight: { xs: 0, md: 4 }, marginBottom: { xs: 2, md: 0 } }}
                />
                <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        {profile.user.name}
                    </Typography>
                    <Button variant="outlined" sx={{ marginTop: 2, fontSize: { xs: '0.8rem', md: '1rem' } }}>
                        Edit Profile
                    </Button>
                </Box>
            </Box>

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
                            onClick={() => {
                                console.log(`Video clicked: ${video._id}`); // Handle click
                            }}
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
                            {/* Grading Display */}
                            {video.gradingSystem === 'Japanese-Colored' && colorGradingMap[video.difficultyLevel] ? (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        width: 15,
                                        height: 30,
                                        backgroundColor: colorGradingMap[video.difficultyLevel],
                                    }}
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: 2,
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {video.difficultyLevel}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Profile;
