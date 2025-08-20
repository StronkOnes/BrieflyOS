import React, { useState, useMemo } from 'react';
import { Box, Button, Typography, CircularProgress, Paper, Alert, Grid, Card, CardContent, LinearProgress } from '@mui/material';
import axios from 'axios';
import { TabKey } from '../types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const KpiDashboard = ({ leads, opportunities, onKpiAnalyzed, addToHistory }) => {
  const [kpiAnalysis, setKpiAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const kpiData = useMemo(() => {
    const totalLeads = leads.length;
    const totalOpportunities = opportunities.length;
    const conversionRate = totalLeads > 0 ? (totalOpportunities / totalLeads) * 100 : 0;
    const totalOppValue = opportunities.reduce((sum, opp) => sum + opp.amount, 0);
    const wonOpps = opportunities.filter(opp => opp.stage === 'Won');
    const winRate = totalOpportunities > 0 ? (wonOpps.length / totalOpportunities) * 100 : 0;
    const avgDealSize = wonOpps.length > 0 ? wonOpps.reduce((sum, opp) => sum + opp.amount, 0) / wonOpps.length : 0;

    const leadsByStage = leads.reduce((acc, lead) => {
      acc[lead.stage] = (acc[lead.stage] || 0) + 1;
      return acc;
    }, {});

    const oppsByStage = opportunities.reduce((acc, opp) => {
      acc[opp.stage] = (acc[opp.stage] || 0) + 1;
      return acc;
    }, {});

    return {
      totalLeads,
      totalOpportunities,
      conversionRate,
      totalOppValue,
      winRate,
      avgDealSize,
      leadsByStage,
      oppsByStage
    };
  }, [leads, opportunities]);

  const handleGenerateKpiAnalysis = async () => {
    setError('');
    setLoading(true);
    setKpiAnalysis('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/kpi-analysis`, {
        leadsData: leads,
        opportunitiesData: opportunities,
      });
      setKpiAnalysis(response.data.analysis);
      
      if (onKpiAnalyzed) {
        onKpiAnalyzed(response.data.analysis);
      }
      if (addToHistory) {
        addToHistory({
          type: TabKey.KPI_DASHBOARD,
          topic: 'KPI Analysis',
          content: 'Generated KPI analysis.',
        });
      }

    } catch (err) {
      console.error('Error generating KPI analysis:', err);
      setError('Failed to generate KPI analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const KpiCard = ({ title, value, format }) => (
    <Card sx={{ backgroundColor: '#1e293b', height: '100%' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14, color: '#94a3b8' }} gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" component="div" sx={{ color: 'white' }}>
          {format ? format(value) : value}
        </Typography>
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, data, total }) => (
    <Card sx={{ backgroundColor: '#1e293b', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>{title}</Typography>
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>{key} ({value})</Typography>
            <LinearProgress variant="determinate" value={(value / total) * 100} />
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>KPI Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}><KpiCard title="Total Leads" value={kpiData.totalLeads} /></Grid>
        <Grid item xs={12} sm={6} md={4}><KpiCard title="Total Opportunities" value={kpiData.totalOpportunities} /></Grid>
        <Grid item xs={12} sm={6} md={4}><KpiCard title="Conversion Rate" value={kpiData.conversionRate} format={v => `${v.toFixed(1)}%`} /></Grid>
        <Grid item xs={12} sm={6} md={4}><KpiCard title="Total Opportunity Value" value={kpiData.totalOppValue} format={v => `$${v.toLocaleString()}`} /></Grid>
        <Grid item xs={12} sm={6} md={4}><KpiCard title="Win Rate" value={kpiData.winRate} format={v => `${v.toFixed(1)}%`} /></Grid>
        <Grid item xs={12} sm={6} md={4}><KpiCard title="Average Deal Size" value={kpiData.avgDealSize} format={v => `$${v.toLocaleString()}`} /></Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}><ChartCard title="Leads by Stage" data={kpiData.leadsByStage} total={kpiData.totalLeads} /></Grid>
        <Grid item xs={12} md={6}><ChartCard title="Opportunities by Stage" data={kpiData.oppsByStage} total={kpiData.totalOpportunities} /></Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>AI-Powered Analysis</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Generate insightful KPI analysis based on your current leads and opportunities data.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateKpiAnalysis}
        disabled={loading || (leads.length === 0 && opportunities.length === 0)}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate KPI Analysis'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {kpiAnalysis && (
        <Paper elevation={2} sx={{ p: 3, backgroundColor: '#1e293b' }}>
          <Typography variant="h6" gutterBottom>Analysis Result</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{kpiAnalysis}</Typography>
        </Paper>
      )}

      {(leads.length === 0 && opportunities.length === 0) && !loading && !error && (
        <Alert severity="info">Add some leads and opportunities to generate KPI analysis.</Alert>
      )}
    </Box>
  );
};

export default KpiDashboard;
