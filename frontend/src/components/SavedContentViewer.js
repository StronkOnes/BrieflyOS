
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, CardMedia, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const SavedContentViewer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedContent, setSavedContent] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchSavedContent = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/blog-posts`);
      setSavedContent(response.data);
    } catch (err) {
      console.error('Error fetching saved content:', err);
      setError('Failed to load saved content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, []);

  const handleClickOpenViewDialog = (post) => {
    setSelectedPost(post);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedPost(null);
  };

  const handleConfirmDelete = (post) => {
    setPostToDelete(post);
    setOpenConfirmDeleteDialog(true);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
    setPostToDelete(null);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/blog-posts/${postToDelete.id}`);
      setSavedContent(prev => prev.filter(post => post.id !== postToDelete.id));
      handleCloseConfirmDeleteDialog();
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post.');
      handleCloseConfirmDeleteDialog();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (savedContent.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No saved content available yet.</Typography>
        <Typography variant="body1" color="text.secondary">Generate content in the Research & Content Generator and save it to see it here.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>My Saved Content</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {savedContent.map((post) => (
          <Card 
            key={post.id} 
            sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1e293b', position: 'relative' }}
          >
            {post.featuredImage && (
              <CardMedia
                component="img"
                height="140"
                image={post.featuredImage}
                alt={post.title}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleClickOpenViewDialog(post)}>
              <Typography variant="h6" component="div" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {new Date(post.timestamp).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {/* Display a truncated version on the card, full in dialog */}
                {post.content.substring(0, 150)}...
              </Typography>
              <Box sx={{ mb: 1 }}>
                {post.tags && post.tags.split(',').map((tag) => (
                  <Chip key={tag.trim()} label={tag.trim()} size="small" sx={{ mr: 0.5, mb: 0.5, backgroundColor: '#7c3aed', color: 'white' }} />
                ))}
              </Box>
              <Box>
                {post.categories && post.categories.split(',').map((category) => (
                  <Chip key={category.trim()} label={category.trim()} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5, borderColor: '#a78bfa', color: '#a78bfa' }} />
                ))}
              </Box>
            </CardContent>
            <Tooltip title="Delete Content">
              <IconButton 
                sx={{ position: 'absolute', top: 8, right: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
                onClick={() => handleConfirmDelete(post)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Card>
        ))}
      </Box>

      {selectedPost && (
        <Dialog
          open={openViewDialog}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { backgroundColor: '#0f172a', color: '#f1f5f9' } // Dark background for dialog
          }}
        >
          <DialogTitle>{selectedPost.title}</DialogTitle>
          <DialogContent dividers>
            {selectedPost.featuredImage && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img src={selectedPost.featuredImage} alt={selectedPost.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Published: {new Date(selectedPost.timestamp).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {selectedPost.content}
            </Typography>
            <Box sx={{ mt: 3 }}>
              {selectedPost.tags && selectedPost.tags.split(',').map((tag) => (
                <Chip key={tag.trim()} label={tag.trim()} size="small" sx={{ mr: 0.5, mb: 0.5, backgroundColor: '#7c3aed', color: 'white' }} />
              ))}
            </Box>
            <Box sx={{ mt: 1 }}>
              {selectedPost.categories && selectedPost.categories.split(',').map((category) => (
                <Chip key={category.trim()} label={category.trim()} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5, borderColor: '#a78bfa', color: '#a78bfa' }} />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={openConfirmDeleteDialog}
        onClose={handleCloseConfirmDeleteDialog}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
        PaperProps={{
          sx: { backgroundColor: '#0f172a', color: '#f1f5f9' } // Dark background for dialog
        }}
      >
        <DialogTitle id="confirm-delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description" sx={{ color: '#cbd5e1' }}>
            Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeletePost} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedContentViewer;
