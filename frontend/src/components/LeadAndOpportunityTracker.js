import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper, Select, MenuItem, FormControl, InputLabel, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Card, CardContent, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const LeadAndOpportunityTracker = ({ leads, setLeads, opportunities, setOpportunities, onLeadAdded }) => {
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadStage, setNewLeadStage] = useState('New');
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [errorLeads, setErrorLeads] = useState('');
  const [errorOpportunities, setErrorOpportunities] = useState('');

  const [newOppLeadId, setNewOppLeadId] = useState('');
  const [newOppAmount, setNewOppAmount] = useState('');
  const [newOppStage, setNewOppStage] = useState('Prospecting');
  const [newOppProbability, setNewOppProbability] = useState('');

  const [editingOpp, setEditingOpp] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [oppToDelete, setOppToDelete] = useState(null);

  const leadStages = ['New', 'Contacted', 'Qualified', 'Lost'];
  const opportunityStages = ['Prospecting', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/leads`);
        setLeads(response.data);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setErrorLeads('Failed to load leads.');
      } finally {
        setLoadingLeads(false);
      }
    };

    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/opportunities`);
        setOpportunities(response.data);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setErrorOpportunities('Failed to load opportunities.');
      } finally {
        setLoadingOpportunities(false);
      }
    };

    fetchLeads();
    fetchOpportunities();
  }, [setLeads, setOpportunities]);

  const handleAddLead = async () => {
    if (!newLeadName || !newLeadEmail) {
      setErrorLeads('Name and Email are required for a new lead.');
      return;
    }
    setErrorLeads('');
    try {
      const response = await axios.post(`${BACKEND_URL}/api/leads`, {
        name: newLeadName,
        email: newLeadEmail,
        stage: newLeadStage,
      });
      setLeads((prevLeads) => [...prevLeads, response.data]);
      if (onLeadAdded) {
        onLeadAdded(response.data);
      }
      setNewLeadName('');
      setNewLeadEmail('');
      setNewLeadStage('New');
    } catch (err) {
      console.error('Error adding lead:', err);
      setErrorLeads('Failed to add lead.');
    }
  };

  const handleAddOpportunity = async () => {
    if (!newOppLeadId || !newOppAmount || !newOppStage || newOppProbability === '') {
      setErrorOpportunities('All opportunity fields are required.');
      return;
    }
    setErrorOpportunities('');
    try {
      const lead = leads.find(l => l.id == newOppLeadId);
      const response = await axios.post(`${BACKEND_URL}/api/opportunities`, {
        leadId: newOppLeadId,
        leadName: lead ? lead.name : 'Unknown',
        amount: parseFloat(newOppAmount),
        stage: newOppStage,
        probability: parseInt(newOppProbability),
      });
      setOpportunities((prevOpps) => [...prevOpps, response.data]);
      setNewOppLeadId('');
      setNewOppAmount('');
      setNewOppStage('Prospecting');
      setNewOppProbability('');
    } catch (err) {
      console.error('Error adding opportunity:', err);
      setErrorOpportunities('Failed to add opportunity.');
    }
  };

  const handleEditOpportunity = (opportunity) => {
    setEditingOpp(opportunity);
    setNewOppLeadId(opportunity.leadId);
    setNewOppAmount(opportunity.amount);
    setNewOppStage(opportunity.stage);
    setNewOppProbability(opportunity.probability);
  };

  const handleUpdateOpportunity = async () => {
    if (!editingOpp || !newOppLeadId || !newOppAmount || !newOppStage || newOppProbability === '') {
      setErrorOpportunities('All opportunity fields are required for update.');
      return;
    }
    setErrorOpportunities('');
    try {
      const lead = leads.find(l => l.id == newOppLeadId);
      const response = await axios.put(`${BACKEND_URL}/api/opportunities/${editingOpp.id}`, {
        leadId: newOppLeadId,
        leadName: lead ? lead.name : 'Unknown',
        amount: parseFloat(newOppAmount),
        stage: newOppStage,
        probability: parseInt(newOppProbability),
      });
      setOpportunities((prevOpps) =>
        prevOpps.map((opp) => (opp.id === editingOpp.id ? response.data : opp))
      );
      setEditingOpp(null);
      setNewOppLeadId('');
      setNewOppAmount('');
      setNewOppStage('Prospecting');
      setNewOppProbability('');
    } catch (err) {
      console.error('Error updating opportunity:', err);
      setErrorOpportunities('Failed to update opportunity.');
    }
  };

  const handleDeleteOpportunity = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/opportunities/${oppToDelete.id}`);
      setOpportunities((prevOpps) => prevOpps.filter((opp) => opp.id !== oppToDelete.id));
      setOpenDeleteDialog(false);
      setOppToDelete(null);
    } catch (err) {
      console.error('Error deleting opportunity:', err);
      setErrorOpportunities('Failed to delete opportunity.');
    }
  };

  const confirmDelete = (opportunity) => {
    setOppToDelete(opportunity);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setOppToDelete(null);
  };

  const renderKanbanColumn = (title, items, renderCard) => (
    <Grid item xs={12} md={6} lg={3} key={title}>
      <Paper elevation={2} sx={{ p: 2, backgroundColor: '#1e293b', height: '100%' }}>
        <Typography variant="h6" gutterBottom align="center">{title}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: '70vh' }}>
          {items.map(renderCard)}
        </Box>
      </Paper>
    </Grid>
  );

  const renderLeadCard = (lead) => (
    <Card key={lead.id} sx={{ backgroundColor: '#334155' }}>
      <CardContent>
        <Typography variant="h6">{lead.name}</Typography>
        <Typography variant="body2">{lead.email}</Typography>
        <Typography variant="caption">{new Date(lead.createdAt).toLocaleDateString()}</Typography>
      </CardContent>
    </Card>
  );

  const renderOpportunityCard = (opp) => (
    <Card key={opp.id} sx={{ backgroundColor: '#334155' }}>
      <CardContent>
        <Typography variant="h6">{opp.leadName}</Typography>
        <Typography variant="body1">${opp.amount ? opp.amount.toFixed(2) : '0.00'}</Typography>
        <Typography variant="body2">Probability: {opp.probability}%</Typography>
        <Typography variant="caption">{new Date(opp.createdAt).toLocaleDateString()}</Typography>
      </CardContent>
      <CardActions>
        <IconButton color="primary" onClick={() => handleEditOpportunity(opp)} size="small">
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => confirmDelete(opp)} size="small">
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>CRM Funnels</Typography>

      {/* Leads Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#1e293b' }}>
        <Typography variant="h5" gutterBottom>Add New Lead</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField label="Lead Name" variant="outlined" value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} size="small" />
          <TextField label="Lead Email" variant="outlined" value={newLeadEmail} onChange={(e) => setNewLeadEmail(e.target.value)} size="small" />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Stage</InputLabel>
            <Select value={newLeadStage} label="Stage" onChange={(e) => setNewLeadStage(e.target.value)}>
              {leadStages.map(stage => <MenuItem key={stage} value={stage}>{stage}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddLead}>Add Lead</Button>
        </Box>
        {errorLeads && <Typography color="error" sx={{ mb: 2 }}>{errorLeads}</Typography>}
      </Paper>

      <Typography variant="h5" gutterBottom>Leads Funnel</Typography>
      {loadingLeads ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {leadStages.map(stage => renderKanbanColumn(stage, leads.filter(lead => lead.stage === stage), renderLeadCard))}
        </Grid>
      )}

      {/* Opportunities Section */}
      <Paper elevation={2} sx={{ p: 3, my: 4, backgroundColor: '#1e293b' }}>
        <Typography variant="h5" gutterBottom>{editingOpp ? 'Edit Opportunity' : 'Add New Opportunity'}</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Select Lead</InputLabel>
            <Select value={newOppLeadId} label="Select Lead" onChange={(e) => setNewOppLeadId(e.target.value)}>
              {leads.map((lead) => <MenuItem key={lead.id} value={lead.id}>{lead.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Amount" variant="outlined" type="number" value={newOppAmount} onChange={(e) => setNewOppAmount(e.target.value)} size="small" />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Stage</InputLabel>
            <Select value={newOppStage} label="Stage" onChange={(e) => setNewOppStage(e.target.value)}>
              {opportunityStages.map(stage => <MenuItem key={stage} value={stage}>{stage}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Probability (%)" variant="outlined" type="number" value={newOppProbability} onChange={(e) => setNewOppProbability(e.target.value)} size="small" inputProps={{ min: 0, max: 100 }} />
          {editingOpp ? (
            <Button variant="contained" onClick={handleUpdateOpportunity}>Update Opportunity</Button>
          ) : (
            <Button variant="contained" onClick={handleAddOpportunity}>Add Opportunity</Button>
          )}
          {editingOpp && <Button variant="outlined" onClick={() => setEditingOpp(null)}>Cancel Edit</Button>}
        </Box>
        {errorOpportunities && <Typography color="error" sx={{ mb: 2 }}>{errorOpportunities}</Typography>}
      </Paper>

      <Typography variant="h5" gutterBottom>Opportunities Funnel</Typography>
      {loadingOpportunities ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {opportunityStages.map(stage => renderKanbanColumn(stage, opportunities.filter(opp => opp.stage === stage), renderOpportunityCard))}
        </Grid>
      )}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the opportunity for {oppToDelete?.leadName} with amount ${oppToDelete?.amount.toFixed(2)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteOpportunity} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadAndOpportunityTracker;
