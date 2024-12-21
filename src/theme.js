// theme.js (for example)
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff', // for text/icons if you want a bright contrast
    },
    background: {
      default: '#121212', // typical Material dark background
      paper: '#1D1D1D',   // cards, drawers, etc.
    },
    text: {
      primary: '#fff',
    },
    // You can tweak secondary, error, etc. as needed
  },
  // You can also override typography, components, spacing, etc. here
});

export default darkTheme;
