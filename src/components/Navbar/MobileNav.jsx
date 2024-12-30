import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import VideoCallIcon from '@mui/icons-material/VideoCall';  // <-- For upload icon
import { useNavigate } from 'react-router-dom';

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
              navigate('/video-uplode');
              break;
            case 2:
              // Add your own profile route or logic here
              navigate('/profile');
              break;
            default:
              break;
          }
        }}
      >
        {/* Home */}
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />

        {/* Upload Video (replacing Search) */}
        <BottomNavigationAction label="Upload" icon={<VideoCallIcon />} />

        {/* Profile */}
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default MobileNav;
