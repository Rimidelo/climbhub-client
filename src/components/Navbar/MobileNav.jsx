import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import VideoCallIcon from '@mui/icons-material/VideoCall';  // <-- For upload icon
import { useNavigate } from 'react-router-dom';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function MobileNav() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' }, // Show only on mobile
        zIndex: 1300,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case 0:
              navigate('/');
              break;
            case 1:
              navigate('/reels');
              break;
            case 2:
              navigate('/video-upload');
              break;
            case 3:
              navigate('/gyms-with-videos');
              break;
            case 4:
              navigate('/profile');
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Reels" icon={<SlideshowIcon />} />
        <BottomNavigationAction label="Upload" icon={<VideoCallIcon />} />
        <BottomNavigationAction label="Gyms" icon={<FitnessCenterIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default MobileNav;
