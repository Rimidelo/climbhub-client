import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Link,
  Stack,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email, 'Password:', password);
    // TODO: call your login API
  };

  const handleGoogleLogin = () => {
    console.log('Google login triggered');
    // TODO: call your Google OAuth flow
  };

  return (
    <Box
      sx={{
        // Take up the entire viewport and hide overflow (no scrolling)
        height: '100vh', 
        bgcolor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Container that holds both the login card and the "Don't have an account?" card */}
      <Box sx={{ width: { xs: '90%', sm: 350 }}}>
        {/* Main login box */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo area */}
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

          {/* Divider or "OR" text */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', my: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          {/* Google Login Button */}
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            onClick={handleGoogleLogin}
          >
            Log in with Google
          </Button>

          {/* (Optional) Forgot Password Link */}
          <Box sx={{ mt: 2 }}>
            <Link href="#" variant="body2" underline="hover">
              Forgot password?
            </Link>
          </Box>
        </Paper>

        {/* "Don’t have an account? Sign up" box (same width) */}
        <Paper
          elevation={3}
          sx={{
            mt: 2,
            p: 2,
            textAlign: 'center',
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
  );
}

export default LoginPage;
