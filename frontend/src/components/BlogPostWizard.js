import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import axios from 'axios';
import { TabKey } from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const BlogPostWizard = ({ addToHistory, onPublishInternal }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleGenerateContent = async () => {
    if (!title) {
      setError('Please enter a title first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Mock API call for content generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const generatedContent = `This is an AI-generated blog post about "${title}".

It has multiple paragraphs and covers the topic in detail.`;
      setContent(generatedContent);
    } catch (err) {
      setError('Failed to generate content.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!title) {
      setError('Please enter a title first to generate an image.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Mock API call for image generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const imageUrl = `https://source.unsplash.com/1600x900/?${title.replace(/\s/g, '+')}`;
      setFeaturedImage(imageUrl);
    } catch (err) {
      setError('Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!content) {
      setError('Please generate content first to suggest tags.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Mock API call for tag suggestion
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTags('ai, content, generation, blog');
      setCategories('Technology, AI');
    } catch (err) {
      setError('Failed to suggest tags.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPost = async () => {
    if (!title || !content) {
      setError('Title and Content are required.');
      return;
    }
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/blog-posts`, {
        title,
        content,
        featuredImage,
        tags,
        categories,
      });
      
      if (onPublishInternal) {
        onPublishInternal(response.data);
      }
      if (addToHistory) {
        addToHistory({
          type: TabKey.BLOG_WIZARD,
          topic: title,
          content: `Published blog post: ${title}`,
        });
      }
      setSuccess(true);
      handleNext(); // Move to the final step
    } catch (err) {
      console.error('Error publishing blog post:', err);
      setError('Failed to publish blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: 'Title & Idea',
      content: (
        <TextField
          label="Blog Post Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 1 }}
        />
      ),
    },
    {
      label: 'AI-Generated Content',
      content: (
        <Box>
          <Button onClick={handleGenerateContent} disabled={loading} variant="contained" sx={{ mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Generate Content'}
          </Button>
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Box>
      ),
    },
    {
      label: 'AI-Generated Featured Image',
      content: (
        <Box>
          <Button onClick={handleGenerateImage} disabled={loading} variant="contained" sx={{ mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Generate Image'}
          </Button>
          {featuredImage && (
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
              <img src={featuredImage} alt="Featured" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </Paper>
          )}
          <TextField
            label="Featured Image URL"
            variant="outlined"
            fullWidth
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
      ),
    },
    {
      label: 'SEO & Metadata',
      content: (
        <Box>
          <Button onClick={handleSuggestTags} disabled={loading} variant="contained" sx={{ mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Suggest Tags & Categories'}
          </Button>
          <TextField
            label="Tags (comma-separated)"
            variant="outlined"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Categories (comma-separated)"
            variant="outlined"
            fullWidth
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />
        </Box>
      ),
    },
    {
      label: 'Review & Publish',
      content: (
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', my: 2 }}>{content}</Typography>
          {featuredImage && <img src={featuredImage} alt="Featured" style={{ maxWidth: '200px', borderRadius: '8px' }} />}
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>Tags: {tags}</Typography>
          <Typography variant="caption" display="block">Categories: {categories}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Blog Post Wizard</Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              {step.content}
              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={index === steps.length - 1 ? handlePublishPost : handleNext}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (index === steps.length - 1 ? 'Publish' : 'Next')}
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          {success && <Typography color="success">Blog post published successfully!</Typography>}
          <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
            Create Another Post
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default BlogPostWizard;
