import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { TabKey } from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const CrmSummaryGenerator = ({ addToHistory }) => {
  const [crmData, setCrmData] = useState('');
  const [crmSummary, setCrmSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateCrmSummary = async () => {
    if (!crmData) {
      setError('Please enter CRM data to summarize.');
      return;
    }
    setError('');
    setLoading(true);
    setCrmSummary('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/crm-summary`, { crmData });
      setCrmSummary(response.data.summary);
      
      if (addToHistory) {
        addToHistory({
          type: TabKey.CRM_SUMMARY,
          topic: 'CRM Summary',
          content: 'Generated CRM summary.',
        });
      }

    } catch (err) {
      console.error('Error generating CRM summary:', err);
      setError('Failed to generate CRM summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>CRM Summary Generator</Typography>
      <TextField
        label="Enter CRM Data (e.g., recent interactions, customer notes)"
        variant="outlined"
        fullWidth
        multiline
        rows={8}
        value={crmData}
        onChange={(e) => setCrmData(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateCrmSummary}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate CRM Summary'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {crmSummary && (
        <Paper elevation={2} sx={{ p: 3, backgroundColor: '#1e293b' }}>
          <Typography variant="h6" gutterBottom>Generated Summary</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{crmSummary}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CrmSummaryGenerator;