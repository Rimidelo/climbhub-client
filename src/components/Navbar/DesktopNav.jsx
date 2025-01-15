import React, { useState } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/climbhublogo.png';
import SearchOverlay from '../SearchOverlay/SearchOverlay';

const drawerWidth = 240;

function DesktopNav() {
  const navigate = useNavigate();

  // Replacing the boolean state with anchorEl for Popover2
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenSearch = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSearch = () => {
    setAnchorEl(null);
  };

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
        display: { xs: 'none', md: 'block' },
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
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img
            src={logo}
            alt="ClimbHub Logo"
            style={{
              width: 50,
              height: 50,
              marginRight: '8px',
              objectFit: 'contain',
            }}
          />
          <Typography variant="h6">ClimbHub</Typography>
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

          {/* Gyms */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/gyms-with-videos')}>
              <ListItemIcon>
                <FitnessCenterIcon />
              </ListItemIcon>
              <ListItemText primary="Gyms" />
            </ListItemButton>
          </ListItem>

          {/* Profile */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
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

          {/* Search - now a ListItem, aligned with others */}
          <ListItem disablePadding>
            <ListItemButton onClick={(e) => handleOpenSearch(e)}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="Search" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Footer */}
        <Box sx={{ marginTop: 'auto', mb: 2 }}>
          <Typography variant="body2" align="center">
            © 2025 ClimbHub
          </Typography>
        </Box>
      </Box>

      {/* Popover-based Search Overlay */}
      <SearchOverlay
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseSearch}
      />
    </Drawer>
  );
}

export default DesktopNav;
