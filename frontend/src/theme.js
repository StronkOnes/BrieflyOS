
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed', // Violet-600
    },
    secondary: {
      main: '#a78bfa', // Violet-400
    },
    error: {
      main: '#ef4444', // Red-500
    },
    background: {
      default: '#080e1a', // Slate-950
      paper: '#0f172a', // Slate-900
    },
    text: {
      primary: '#f1f5f9', // Slate-100
      secondary: '#cbd5e1', // Slate-300
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    h1: {
      fontSize: '3.75rem',
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.12)', // Light border for dark theme
          boxShadow: 'none',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
});

export default theme;
