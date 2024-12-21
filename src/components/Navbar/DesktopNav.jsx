import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
// import other icons as needed

const drawerWidth = 240; // Adjust width to taste

function DesktopNav() {
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
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          {/* Add more nav items... */}
        </List>

        {/* Possibly place user info or other items at bottom */}
        <Box sx={{ marginTop: 'auto', mb: 2 }}>
          <Typography variant="body2" align="center">
            © 2024 ClimbHub
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export default DesktopNav;
