import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logoImg from '../../assets/loginImg.png';
import { login } from '../../API/api.js';
import { UserContext } from '../../contexts/UserContext'; // Import UserContext

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
  const navigate = useNavigate(); // Initialize navigate
  const { handleLogin } = useContext(UserContext); // Get handleLogin from UserContext

  const handleLoginClick = async () => {
    console.log('Email:', email, 'Password:', password);
    try {
      const response = await login(email, password); // Wait for the API call
      console.log('Login successful:', response);

      // Assume `response.user` contains user data
      if (response.user) {
        handleLogin(response.user); // Update user in context
        navigate('/'); // Navigate to the feed page
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show a message to the user)
    }
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
          marginLeft: 3,
          borderRadius: 4,
          overflow: 'hidden',
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
        <Box sx={{ width: { xs: '100%', sm: 350 } }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" sx={{ fontFamily: 'sans-serif', mb: 2 }}>
              ClimbHub
            </Typography>

            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              variant="outlined"
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginClick} // Use the updated function
            >
              Log In
            </Button>

            <Box sx={{ mt: 2 }}>
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>
          </Paper>

          <Paper
            elevation={3}
            sx={{
              mt: 2,
              p: 2,
              textAlign: 'center',
              borderRadius: 4,
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
