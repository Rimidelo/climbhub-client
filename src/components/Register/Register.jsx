// RegisterPage.js
import React, { useState, useContext } from 'react';
import { register } from '../../API/api.js';
import { UserContext } from '../../contexts/UserContext';
import logoImg from '../../assets/loginImg.png';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Link,
  Alert,
  AlertTitle,
} from '@mui/material';

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
  const { setUser } = useContext(UserContext); 
  // You could also use handleLogin if you prefer that style.

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = validatePassword(password);

  const handleRegister = async () => {
    try {
      const response = await register(name, email, password);

      if (response.newUser) {
        // Save the user in context
        setUser(response.newUser);
        console.log('Registration successful. User context updated:', response.newUser);
        navigate('/preferences');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Possibly show an error message to the user
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* LEFT SIDE: Logo */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
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
              label="Full Name"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              variant="outlined"
              label="Email"
              type="email"
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
                      At least one symbol
                    </li>
                  </ul>
                </Alert>
              </Box>
            )}

            <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
              Sign Up
            </Button>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', my: 2 }}>
            </Stack>
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
