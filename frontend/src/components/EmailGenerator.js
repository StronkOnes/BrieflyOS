import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { TabKey } from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const EmailGenerator = ({ addToHistory }) => {
  const [emailContext, setEmailContext] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateEmail = async () => {
    if (!emailContext) {
      setError('Please enter context for the email.');
      return;
    }
    setError('');
    setLoading(true);
    setGeneratedEmail('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/generate-email`, { context: emailContext });
      setGeneratedEmail(response.data.emailContent);
      
      if (addToHistory) {
        addToHistory({
          type: TabKey.EMAIL_GENERATOR,
          topic: 'Email Generation',
          content: 'Generated email content.',
        });
      }

    } catch (err) {
      console.error('Error generating email:', err);
      setError('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Email Generator</Typography>
      <TextField
        label="Enter Email Context (e.g., purpose, recipient, key points)"
        variant="outlined"
        fullWidth
        multiline
        rows={8}
        value={emailContext}
        onChange={(e) => setEmailContext(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateEmail}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Email'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {generatedEmail && (
        <Paper elevation={2} sx={{ p: 3, backgroundColor: '#1e293b' }}>
          <Typography variant="h6" gutterBottom>Generated Email</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{generatedEmail}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default EmailGenerator;