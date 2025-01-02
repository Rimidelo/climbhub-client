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
        <Box sx={{ padding: 2, maxWidth: '800px', margin: '0 auto' }}>
            {/* Profile Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <Avatar
                    src={profile.profilePicture} // Placeholder for profile picture
                    alt={profile.name}
                    sx={{ width: 80, height: 80, marginRight: 4 }}
                />
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {profile.user.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {profile.user.email}
                    </Typography>
                    <Button variant="outlined" sx={{ marginTop: 2 }}>
                        Edit Profile
                    </Button>
                </Box>
            </Box>

            {/* Stats */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '400px',
                    margin: '0 auto 16px',
                }}
            >
                <Box>
                    <Typography variant="h6" align="center">
                        {videos.length}
                    </Typography>
                    <Typography variant="body2" align="center">
                        Videos
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6" align="center">
                        {profile.followersCount || 0}
                    </Typography>
                    <Typography variant="body2" align="center">
                        Followers
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6" align="center">
                        {profile.followingCount || 0}
                    </Typography>
                    <Typography variant="body2" align="center">
                        Following
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ marginBottom: 4 }} />

            {/* Video Grid */}
            <Grid container spacing={2}>
                {videos.map((video) => (
                    <Grid item xs={6} sm={4} key={video._id}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '0',
                                paddingTop: '100%', // Maintain square aspect ratio
                                position: 'relative',
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
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Profile;
