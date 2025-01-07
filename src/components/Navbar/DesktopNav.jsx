import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // <--- NEW ICON
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/climbhublogo.png';

const drawerWidth = 240; // Adjust width to taste

function DesktopNav() {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                display: { xs: 'none', md: 'block' }, // Hide on mobile, show on md+ screens
            }}
        >
            <Box
                sx={{
                    overflow: 'auto',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: 2,
                }}


            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <img
                        src={logo} // Replace with your logo file path
                        alt="ClimbHub Logo"
                        style={{
                            width: 50,
                            height: 50,
                            marginRight: '8px', // Add margin to the right of the logo
                            objectFit: 'contain', // Ensures the image retains its aspect ratio
                        }}
                    />
                    {/* Logo or brand name */}
                    <Typography variant="h6">
                        ClimbHub
                    </Typography>
                </Box>

                {/* Navigation Items */}
                <List sx={{ width: '100%' }}>
                    {/* Home */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/')}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>

                    {/* Reels */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/reels')}>
                            <ListItemIcon>
                                <SlideshowIcon />
                            </ListItemIcon>
                            <ListItemText primary="Reels" />
                        </ListItemButton>
                    </ListItem>

                    {/* Upload Video */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/video-upload')}>
                            <ListItemIcon>
                                <VideoCallIcon />
                            </ListItemIcon>
                            <ListItemText primary="Upload Video" />
                        </ListItemButton>
                    </ListItem>

                    {/* Profile */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate('/profile')}>
                            <ListItemIcon>
                                <AccountCircleIcon /> {/* Use Profile Icon */}
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                </List>

                {/* Possibly place user info or other items at bottom */}
                <Box sx={{ marginTop: 'auto', mb: 2 }}>
                    <Typography variant="body2" align="center">
                        © 2025 ClimbHub
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
}

export default DesktopNav;
