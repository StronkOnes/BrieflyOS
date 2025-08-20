
import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { TabKey } from '../types';

const HistoryViewer = ({ history, deleteHistoryItem }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setSnackbarMessage('Content copied to clipboard!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleDelete = (id) => {
    deleteHistoryItem(id);
    setSnackbarMessage('History item deleted.');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (!history || history.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No history available yet.</Typography>
        <Typography variant="body1" color="text.secondary">Generate some content or perform actions to see them here.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Content History</Typography>
      <Paper elevation={2} sx={{ backgroundColor: '#1e293b' }}>
        <List>
          {history.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start" secondaryAction={
                <Box>
                  <Tooltip title="Copy Content">
                    <IconButton edge="end" aria-label="copy" onClick={() => handleCopy(item.content)} sx={{ color: '#a78bfa' }}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Item">
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="h6"
                      color="text.primary"
                    >
                      {item.topic}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        Type: {item.type}
                      </Typography>
                      {/* Display content based on type for better readability */}
                      {item.type === TabKey.RESEARCH_ARTICLE ? (
                        <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#0f172a', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                          <Typography variant="body2" color="text.primary">
                            {item.content}
                          </Typography>
                        </Paper>
                      ) : (
                        <Typography
                          sx={{ display: 'block' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {item.content}
                        </Typography>
                      )}
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        Timestamp: {new Date(item.timestamp).toLocaleString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < history.length - 1 && <Divider component="li" sx={{ borderColor: '#334155' }} />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HistoryViewer;
