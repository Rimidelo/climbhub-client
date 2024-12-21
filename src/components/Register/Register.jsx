import React, { useState } from 'react';
import logoImg from '../../assets/loginImg.png';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Stack,
  Link,
  Alert,
  AlertTitle,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

function validatePassword(password) {
  return {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  const passwordChecks = validatePassword(password);

  const handleRegister = () => {
    console.log('Name:', name, 'Email:', email, 'Password:', password);
    // TODO: call your signup API
  };

  const handleGoogleRegister = () => {
    console.log('Google register triggered');
    // TODO: call your Google OAuth flow
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

      {/* RIGHT SIDE: Registration Form */}
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
        {/* Container for the Register form */}
        <Box sx={{ width: { xs: '100%', sm: 350 } }}>
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
            <Typography variant="h4" sx={{ fontFamily: 'sans-serif', mb: 2 }}>
              ClimbHub
            </Typography>

            {/* Name Field */}
            <TextField
              variant="outlined"
              label="Full Name"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email Field */}
            <TextField
              variant="outlined"
              label="Email"
              type="email"
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
              onBlur={() => setPasswordTouched(true)}
            />

            {/* Password Strength Checker */}
            {passwordTouched && (
              <Box sx={{ mb: 2, width: '100%' }}>
                <Alert severity="info">
                  <AlertTitle>Password Requirements</AlertTitle>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    <li style={{ color: passwordChecks.length ? 'green' : 'inherit' }}>
                      At least 8 characters
                    </li>
                    <li style={{ color: passwordChecks.hasNumber ? 'green' : 'inherit' }}>
                      At least one number
                    </li>
                    <li style={{ color: passwordChecks.hasUpper ? 'green' : 'inherit' }}>
                      At least one uppercase letter
                    </li>
                    <li style={{ color: passwordChecks.hasLower ? 'green' : 'inherit' }}>
                      At least one lowercase letter
                    </li>
                    <li style={{ color: passwordChecks.hasSymbol ? 'green' : 'inherit' }}>
                      At least one symbol (e.g., !@#$%)
                    </li>
                  </ul>
                </Alert>
              </Box>
            )}

            <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
              Sign Up
            </Button>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', my: 2 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Stack>

            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={handleGoogleRegister}
            >
              Sign up with Google
            </Button>
          </Paper>

          {/* "Already have an account? Log In" box */}
          <Paper
            elevation={3}
            sx={{
              mt: 2,
              p: 2,
              textAlign: 'center',
              borderRadius: 4, // Add curved corners to the "Already have an account?" box
            }}
          >
            <Typography variant="body1">
              Already have an account?{' '}
              <Link href="/login" underline="hover">
                Log In
              </Link>
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterPage;
