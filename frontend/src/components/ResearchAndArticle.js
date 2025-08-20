import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { TabKey } from '../types';
import Teleprompter from './Teleprompter'; // Import the Teleprompter component

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const ResearchAndArticle = ({ onArticleGenerated, addToHistory }) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('article'); // 'article', 'short', 'podcast', 'youtube'
  const [researchSummary, setResearchSummary] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [teleprompterOpen, setTeleprompterOpen] = useState(false); // State for Teleprompter modal

  const handleGenerateContent = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setError('');
    setLoading(true);

    let endpoint = '';
    let historyContentType = '';
    let requestBody = { topic };

    switch (contentType) {
      case 'article':
        endpoint = 'generate-article';
        historyContentType = 'Article';
        break;
      case 'short':
        endpoint = 'generate-short-script';
        historyContentType = 'Short Script';
        requestBody = { topic, researchSummary, articleDraft: generatedContent };
        break;
      case 'podcast':
        endpoint = 'generate-podcast-script';
        historyContentType = 'Podcast Script';
        requestBody = { topic, researchSummary, articleDraft: generatedContent };
        break;
      case 'youtube':
        endpoint = 'generate-youtube-script';
        historyContentType = 'YouTube Script';
        requestBody = { topic, researchSummary, articleDraft: generatedContent };
        break;
      default:
        setError('Invalid content type selected.');
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/${endpoint}`, requestBody, {
        timeout: 120000 // 2 minute timeout
      });
      
      let contentToSave = '';
      if (contentType === 'article') {
        setResearchSummary(response.data.researchSummary);
        setGeneratedContent(response.data.articleDraft);
        contentToSave = response.data.articleDraft;
      } else {
        setGeneratedContent(response.data.script);
        contentToSave = response.data.script;
      }
      
      if (onArticleGenerated) {
        onArticleGenerated({ topic, article: contentToSave });
      }

    } catch (err) {
      console.error(`Error generating ${contentType}:`, err);
      setError(`Failed to generate ${contentType}. Please try again.`);
      setResearchSummary('');
      setGeneratedContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToSavedContent = async () => {
    if (!generatedContent) {
      setSnackbarMessage('No content to save.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/blog-posts`, {
        title: `Generated ${contentType === 'article' ? 'Article' : contentType === 'short' ? 'Short Script' : contentType === 'podcast' ? 'Podcast Script' : 'YouTube Script'}: ${topic || 'Untitled'}`,
        content: generatedContent,
        featuredImage: '',
        tags: `generated, ${contentType}`,
        categories: 'AI, Content',
      });
      setSnackbarMessage('Content saved to Saved Content successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error saving content to Saved Content:', err);
      setSnackbarMessage('Failed to save content to Saved Content.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenTeleprompter = () => {
    if (generatedContent) {
      setTeleprompterOpen(true);
    } else {
      setSnackbarMessage('No content to display in teleprompter.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Research & Content Generator</Typography>
      <TextField
        label="Enter Topic"
        variant="outlined"
        fullWidth
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }} disabled={loading}>
        <InputLabel>Content Type</InputLabel>
        <Select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          label="Content Type"
        >
          <MenuItem value="article">Article</MenuItem>
          <MenuItem value="short">Short Script</MenuItem>
          <MenuItem value="podcast">Podcast Script</MenuItem>
          <MenuItem value="youtube">YouTube Script</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateContent}
        disabled={loading}
        sx={{ mb: 3, mr: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : `Generate ${contentType === 'article' ? 'Article' : 'Script'}`}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleSaveToSavedContent}
        disabled={!generatedContent || loading}
        sx={{ mb: 3, mr: 2 }}
      >
        Save to Saved Content
      </Button>
      <Button
        variant="outlined"
        color="success"
        onClick={handleOpenTeleprompter}
        disabled={!generatedContent || loading}
        sx={{ mb: 3 }}
      >
        Open Teleprompter
      </Button>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {researchSummary && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#1e293b' }}>
          <Typography variant="h6" gutterBottom>Research Summary</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{researchSummary}</Typography>
        </Paper>
      )}

      {generatedContent && (
        <Paper elevation={2} sx={{ p: 3, backgroundColor: '#1e293b' }}>
          <Typography variant="h6" gutterBottom>{contentType === 'article' ? 'Article Draft' : 'Generated Script'}</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{generatedContent}</Typography>
        </Paper>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Teleprompter
        script={generatedContent}
        open={teleprompterOpen}
        onClose={() => setTeleprompterOpen(false)}
      />
    </Box>
  );
};

export default ResearchAndArticle;
