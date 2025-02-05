// src/components/MobileNav/MobileNav.jsx

import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SearchIcon from '@mui/icons-material/Search';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import { useNavigate } from 'react-router-dom';

function MobileNav() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenSearch = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSearch = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'block', md: 'none' },
          zIndex: 1300,
        }}
        elevation={3}
      >
        <BottomNavigation
          sx={{
            "& .MuiBottomNavigationAction-root": {
              minWidth: 0, // Removes the default minimum width
              padding: "6px 8px", // Adjust padding as needed
            },
          }}
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
              case 5:
                handleOpenSearch(event);
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

          {/* 3) Add Search Nav Action */}
          <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        </BottomNavigation>
      </Paper>

      <SearchOverlay
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseSearch}
      />
    </>
  );
}

export default MobileNav;
