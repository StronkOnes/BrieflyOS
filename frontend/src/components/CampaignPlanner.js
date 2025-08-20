import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { TabKey } from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const CampaignPlanner = ({ addToHistory }) => {
  const [campaignDetails, setCampaignDetails] = useState('');
  const [campaignPlan, setCampaignPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateCampaignPlan = async () => {
    if (!campaignDetails) {
      setError('Please enter campaign details.');
      return;
    }
    setError('');
    setLoading(true);
    setCampaignPlan('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/campaign-plan`, { campaignDetails });
      setCampaignPlan(response.data.plan);
      
      if (addToHistory) {
        addToHistory({
          type: TabKey.CAMPAIGN_PLANNER,
          topic: 'Campaign Plan',
          content: 'Generated campaign plan.',
        });
      }

    } catch (err) {
      console.error('Error generating campaign plan:', err);
      setError('Failed to generate campaign plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Campaign Planner</Typography>
      <TextField
        label="Enter Campaign Details (e.g., product, target audience, goals)"
        variant="outlined"
        fullWidth
        multiline
        rows={8}
        value={campaignDetails}
        onChange={(e) => setCampaignDetails(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateCampaignPlan}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Campaign Plan'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {campaignPlan && (
        <Paper elevation={2} sx={{ p: 3, backgroundColor: '#1e293b' }}>
          <Typography variant="h6" gutterBottom>Generated Campaign Plan</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{campaignPlan}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CampaignPlanner;