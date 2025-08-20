
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box 
} from '@mui/material';

function LeadsCapture() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('New Lead');
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/leads`, { name, email, stage });
      setName('');
      setEmail('');
      setStage('New Lead');
      fetchLeads(); // Refresh leads after adding a new one
    } catch (error) {
      console.error('Error submitting lead:', error);
    }
  };

  const handleExportCsv = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/api/leads/export-csv`, '_blank');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lead Capture
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Stage</InputLabel>
          <Select value={stage} label="Stage" onChange={(e) => setStage(e.target.value)}>
            <MenuItem value="New Lead">New Lead</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Qualified">Qualified</MenuItem>
            <MenuItem value="Opportunity">Opportunity</MenuItem>
            <MenuItem value="Closed Won">Closed Won</MenuItem>
            <MenuItem value="Closed Lost">Closed Lost</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>Add Lead</Button>
        <Button variant="outlined" onClick={handleExportCsv}>Export to CSV</Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Current Leads
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.id}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.stage}</TableCell>
                <TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default LeadsCapture;
