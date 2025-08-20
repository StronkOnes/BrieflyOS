
import React from 'react';
import { Box, Typography, Paper, FormControlLabel, Switch, Button, List, ListItem, ListItemText, Grid, Card, CardContent, TextField } from '@mui/material';

const Automation = ({ automations, setAutomations, logs, clearLogs }) => {
  const handleToggleAutomation = (key) => {
    setAutomations(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const handleChange = (key, field, value) => {
    setAutomations(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const AutomationCard = ({ aKey, title, description, children }) => (
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{ backgroundColor: '#1e293b', height: '100%' }}>
        <CardContent>
          <FormControlLabel
            control={<Switch checked={automations[aKey].enabled} onChange={() => handleToggleAutomation(aKey)} />}
            label={<Typography variant="h6" sx={{ color: 'white' }}>{title}</Typography>}
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
            {description}
          </Typography>
          {automations[aKey].enabled && children}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Automation Workflows</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <AutomationCard
          aKey="sheet"
          title="Google Sheet Integration"
          description="Automatically send new leads to a Google Sheet."
        >
          <TextField
            label="Google Sheet URL"
            variant="outlined"
            fullWidth
            size="small"
            value={automations.sheet.url}
            onChange={(e) => handleChange('sheet', 'url', e.target.value)}
          />
        </AutomationCard>

        <AutomationCard
          aKey="article"
          title="Team Notification"
          description="Notify your team via email when a new article is generated."
        >
          <TextField
            label="Recipient Email"
            variant="outlined"
            fullWidth
            size="small"
            value={automations.article.recipient}
            onChange={(e) => handleChange('article', 'recipient', e.target.value)}
          />
        </AutomationCard>

        <AutomationCard
          aKey="kpi"
          title="Slack KPI Analysis"
          description="Post KPI analysis summaries to a Slack channel via webhook."
        >
          <TextField
            label="Slack Webhook URL"
            variant="outlined"
            fullWidth
            size="small"
            value={automations.kpi.url}
            onChange={(e) => handleChange('kpi', 'url', e.target.value)}
          />
        </AutomationCard>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, backgroundColor: '#1e293b' }}>
        <Typography variant="h5" gutterBottom>Automation Logs</Typography>
        <Button variant="outlined" onClick={clearLogs} sx={{ mb: 2 }}>Clear Logs</Button>
        <List sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #334155', borderRadius: '4px' }}>
          {logs.length === 0 ? (
            <ListItem>
              <ListItemText primary="No automation logs yet." sx={{ color: 'text.secondary' }} />
            </ListItem>
          ) : (
            logs.map((log, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={log} sx={{ color: '#f1f5f9' }} />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Automation;
