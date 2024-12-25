import React, { useState } from 'react';
import logoImg from '../../assets/loginImg.png';
import { login } from '../../API/api.js';

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
} from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email, 'Password:', password);
    try {
      const response = login(email, password);
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
  };
};

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens, side-by-side on medium+
      }}
    >
      {/* LEFT SIDE: Logo */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' }, // Hide on small screens
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${logoImg})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          marginLeft: 3, // Add margin on the left
          borderRadius: 4, // Curved corners for the image container
          overflow: 'hidden', // Ensures the image respects the border radius
        }}
      />

      {/* RIGHT SIDE: The login form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
        }}
      >
        {/* Container that holds both the login card and the "Don't have an account?" card */}
        <Box sx={{ width: { xs: '100%', sm: 350 } }}>
          {/* Main login box */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4, // Add curved corners to the form box
            }}
          >
            {/* Logo text or small logo for mobile screens (optional) */}
            <Typography variant="h4" sx={{ fontFamily: 'sans-serif', mb: 2 }}>
              ClimbHub
            </Typography>

            {/* Email Field */}
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Field */}
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
              Log In
            </Button>

            {/* (Optional) Forgot Password Link */}
            <Box sx={{ mt: 2 }}>
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>
          </Paper>

          {/* "Don’t have an account? Sign up" box */}
          <Paper
            elevation={3}
            sx={{
              mt: 2,
              p: 2,
              textAlign: 'center',
              borderRadius: 4, // Add curved corners to the "Don’t have an account?" box
            }}
          >
            <Typography variant="body1">
              Don’t have an account?{' '}
              <Link href="/register" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
