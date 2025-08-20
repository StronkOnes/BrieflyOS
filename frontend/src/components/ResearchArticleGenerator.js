
import React, { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress 
} from '@mui/material';

function ResearchArticleGenerator() {
  const [topic, setTopic] = useState('');
  const [researchSummary, setResearchSummary] = useState('');
  const [articleDraft, setArticleDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    setLoading(true);
    setError('');
    setResearchSummary('');
    setArticleDraft('');
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/generate-article`, 
        { topic },
        { timeout: 120000 } // 2 minute timeout
      );
      setResearchSummary(response.data.researchSummary);
      setArticleDraft(response.data.articleDraft);
      setError('');
    } catch (error) {
      console.error('Error generating article:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again with a shorter topic.');
      } else if (error.response) {
        setError(`Server error: ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to generate article. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Research & Article Generator
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TextField
          label="Enter a topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          fullWidth
          sx={{ mr: 2 }}
        />
        <Button onClick={handleGenerate} disabled={loading} variant="contained">
          {loading ? <CircularProgress size={24} /> : 'Generate'}
        </Button>
      </Box>
      
      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Research Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {researchSummary}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Article Draft
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {articleDraft}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ResearchArticleGenerator;
