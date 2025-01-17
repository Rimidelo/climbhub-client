// DefaultLayout.js
import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const drawerWidth = 240; // match the DesktopNav drawerWidth

function DefaultLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* The permanent drawer (left sidebar) + mobile nav inside Navbar */}
      <Navbar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default DefaultLayout;
