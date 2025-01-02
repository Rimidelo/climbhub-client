import React from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // <--- NEW ICON
import { useNavigate } from 'react-router-dom';

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
                {/* Logo or brand name */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                    ClimbHub
                </Typography>

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
