import React from 'react';
import { Box } from '@mui/material';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

function Navbar() {
  return (
    <Box>
      {/* Desktop Navigation (Left Drawer) */}
      <DesktopNav />
      {/* Mobile Navigation (Bottom) */}
      <MobileNav />
    </Box>
  );
}

export default Navbar;
