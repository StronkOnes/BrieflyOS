import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const ContactScraper = () => {
  const [query, setQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rawOutput, setRawOutput] = useState('');

  const handleScrapeContacts = async () => {
    if (!query) {
      setError('Please enter a query.');
      return;
    }
    setError('');
    setRawOutput('');
    setLoading(true);
    setContacts([]);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/contact-scrape`, { query });
      if (response.data.contacts && Array.isArray(response.data.contacts)) {
        setContacts(response.data.contacts);
      } else {
        setError('The AI failed to return valid contact information. Please try a different query.');
        if (response.data.rawOutput) {
          setRawOutput(response.data.rawOutput);
        }
      }
    } catch (err) {
      console.error('Error scraping contacts:', err);
      setError(err.response?.data?.error || 'Failed to scrape contacts. Please try again.');
      if (err.response?.data?.rawOutput) {
        setRawOutput(err.response.data.rawOutput);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportToCsv = () => {
    if (contacts.length === 0) {
      return;
    }

    const headers = ['Name', 'Title', 'Organization', 'Email', 'Contact Number', 'Source URL'];
    const csvRows = [
      headers.join(','),
      ...contacts.map(contact => {
        const values = [
          contact.name,
          contact.title,
          contact.organization,
          contact.email,
          contact.contactNumber,
          contact.sourceUrl
        ];
        return values.map(value => `"${(value || '').toString().replace(/"/g, '""')}"`).join(',');
      })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>AI Contact Scraper</Typography>
      <TextField
        label="Enter Query (e.g., 'Marketing managers in tech companies in California')"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleScrapeContacts}
        disabled={loading}
        sx={{ mb: 3, mr: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Scrape Contacts'}
      </Button>
      <Button
        variant="outlined"
        onClick={handleExportToCsv}
        disabled={contacts.length === 0}
        sx={{ mb: 3 }}
      >
        Export to CSV
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          {rawOutput && (
            <Paper sx={{ p: 2, mt: 2, backgroundColor: '#333', color: 'white', maxHeight: 200, overflowY: 'auto' }}>
              <Typography variant="caption">Raw AI Output:</Typography>
              <pre><code>{rawOutput}</code></pre>
            </Paper>
          )}
        </Alert>
      )}

      {contacts.length > 0 && (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Title</TableCell>
                <TableCell sx={{ color: 'white' }}>Organization</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Contact Number</TableCell>
                <TableCell sx={{ color: 'white' }}>Source URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: '#f1f5f9' }}>{contact.name}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{contact.title}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{contact.organization}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{contact.email}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}>{contact.contactNumber}</TableCell>
                  <TableCell sx={{ color: '#f1f5f9' }}><a href={contact.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>{contact.sourceUrl}</a></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ContactScraper;
