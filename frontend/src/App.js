
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, CssBaseline, useMediaQuery, useTheme, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

import LandingPage from './components/LandingPage';
import Automation from './components/Automation';
import BlogPostWizard from './components/BlogPostWizard';
import CampaignPlanner from './components/CampaignPlanner';
import ContactScraper from './components/ContactScraper';
import CrmSummaryGenerator from './components/CrmSummaryGenerator';
import EmailGenerator from './components/EmailGenerator';
import HistoryViewer from './components/HistoryViewer';
import SavedContentViewer from './components/SavedContentViewer';

import KpiDashboard from './components/KpiDashboard';
import LeadAndOpportunityTracker from './components/LeadAndOpportunityTracker';
import ResearchAndArticle from './components/ResearchAndArticle';

import { TabKey } from './types';
import { TABS } from './constants';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [showApp, setShowApp] = useState(false); // State to control view
  const [activeTab, setActiveTab] = useState(TabKey.RESEARCH_ARTICLE);
  const [leads, setLeads] = useState([
    { id: '1', name: 'John Doe', email: 'john.d@example.com', stage: 'Contacted' },
    { id: '2', name: 'Jane Smith', email: 'jane.s@example.com', stage: 'Qualified' },
    { id: '3', name: 'Peter Jones', email: 'peter.j@example.com', stage: 'New' },
    { id: '4', name: 'Sam Wilson', email: 'sam.w@example.com', stage: 'Lost' },
  ]);
  const [opportunities, setOpportunities] = useState([
      { id: 'o1', leadId: '2', leadName: 'Jane Smith', amount: 5000, stage: 'Won', probability: 100 },
      { id: 'o2', leadId: '1', leadName: 'John Doe', amount: 12000, stage: 'Proposal', probability: 60 },
      { id: 'o3', leadId: '2', leadName: 'Jane Smith', amount: 2500, stage: 'Lost', probability: 0 },
  ]);
  
  const [history, setHistory] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  // Fetch history from backend on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      console.log('Attempting to fetch history...');
      try {
        const response = await axios.get(`${BACKEND_URL}/api/history`);
        console.log('History fetched successfully:', response.data);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error.response ? error.response.data : error.message);
      }
    };
    fetchHistory();
  }, []);

  // Blog posts still loaded from local storage for now, as per previous implementation
  useEffect(() => {
    const savedPosts = localStorage.getItem('internalBlogPosts');
    if (savedPosts) {
      try {
        setBlogPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error("Failed to parse blog posts from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('internalBlogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);
  
  const addToHistory = async (item) => {
    console.log('Attempting to add item to history:', item);
    try {
      // Backend now generates ID and timestamp
      const response = await axios.post(`${BACKEND_URL}/api/history`, { type: item.type, topic: item.topic, content: item.content });
      console.log('Item added to history successfully:', response.data);
      setHistory(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error adding to history:', error.response ? error.response.data : error.message);
    }
  };

  const deleteHistoryItem = async (id) => {
    console.log('Attempting to delete history item with ID:', id);
    try {
      await axios.delete(`${BACKEND_URL}/api/history/${id}`);
      console.log('History item deleted successfully from backend.', id);
      setHistory(prev => prev.filter(item => item.id != id));
    } catch (error) {
      console.error('Error deleting history item:', error.response ? error.response.data : error.message);
    }
  };

  const handlePublishInternal = (postData) => {
      const newPost = {
          ...postData,
          id: `post-${Date.now()}`,
          timestamp: new Date().toISOString(),
      };
      setBlogPosts(prev => [newPost, ...prev]);
      return newPost.id;
  };

  const [automations, setAutomations] = useState({
    sheet: { enabled: true, url: 'https://docs.google.com/spreadsheets/d/example123' },
    article: { enabled: true, recipient: 'team-content@example.com' },
    kpi: { enabled: true, url: 'https://hooks.slack.com/services/T0000/B0000/XXXXXXXX' }
  });
  const [automationLogs, setAutomationLogs] = useState([]);
  
  const addLog = (message) => {
    setAutomationLogs(prev => [...prev, message]);
  }

  const handleLeadAdded = (lead) => {
    if (automations.sheet.enabled) {
      addLog(`[SHEETS] New lead '${lead.name}' sent to ${automations.sheet.url}`);
    }
  };

  const handleArticleGenerated = (data) => {
    if (automations.article.enabled) {
      addLog(`[TEAM] Article on '${data.topic}' sent to ${automations.article.recipient}`);
    }
  };

  const handleKpiAnalyzed = (analysis) => {
    if (automations.kpi.enabled && analysis) {
       addLog(`[SLACK] KPI summary posted to webhook.`);
    }
  };
  
  const handleEnterApp = (tab) => {
    if (tab) {
        setActiveTab(tab);
    }
    setShowApp(true);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabKey.RESEARCH_ARTICLE:
        return <ResearchAndArticle onArticleGenerated={handleArticleGenerated} addToHistory={addToHistory} />;
      case TabKey.BLOG_WIZARD:
        return <BlogPostWizard addToHistory={addToHistory} onPublishInternal={handlePublishInternal} />;
      case TabKey.INTERNAL_BLOG:
        return <SavedContentViewer posts={blogPosts} />;
      case TabKey.CONTACT_SCRAPER:
        return <ContactScraper />;
      case TabKey.CRM:
        return <LeadAndOpportunityTracker leads={leads} setLeads={setLeads} opportunities={opportunities} setOpportunities={setOpportunities} onLeadAdded={handleLeadAdded} />;
      case TabKey.KPI_DASHBOARD:
        return <KpiDashboard leads={leads} opportunities={opportunities} onKpiAnalyzed={handleKpiAnalyzed} addToHistory={addToHistory} />;
      case TabKey.CRM_SUMMARY:
        return <CrmSummaryGenerator addToHistory={addToHistory} />;
      case TabKey.CAMPAIGN_PLANNER:
        return <CampaignPlanner addToHistory={addToHistory} />;
      case TabKey.EMAIL_GENERATOR:
        return <EmailGenerator addToHistory={addToHistory} />;
       case TabKey.CONTENT_HISTORY:
        return <HistoryViewer history={history} deleteHistoryItem={deleteHistoryItem} />;
      case TabKey.AUTOMATION:
        return <Automation automations={automations} setAutomations={setAutomations} logs={automationLogs} clearLogs={() => setAutomationLogs([])} />;
      default:
        return <Box sx={{ p: 4 }}>Select a module from the left.</Box>;
    }
  };

  if (!showApp) {
      return <LandingPage onEnter={handleEnterApp} />;
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Button
        onClick={() => setShowApp(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          width: '100%',
          justifyContent: 'center',
          textTransform: 'none',
          color: 'white',
          opacity: 0.9,
          '&:hover': { opacity: 0.7 },
          borderRadius: '8px',
          p: 1,
        }}
      >
        <Box sx={{ backgroundColor: '#7c3aed', p: 1, borderRadius: '8px', mr: 1.5 }}>
          <HomeIcon sx={{ color: 'white' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>BrieflyAI</Typography>
      </Button>
      <List>
        {TABS.map((tab) => (
          <ListItem key={tab.key} disablePadding>
            <Button
              onClick={() => setActiveTab(tab.key)}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                px: 2,
                py: 1.5,
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                textTransform: 'none',
                color: activeTab === tab.key ? 'white' : '#94a3b8',
                backgroundColor: activeTab === tab.key ? '#7c3aed' : 'transparent',
                boxShadow: activeTab === tab.key ? '0 4px 6px rgba(124, 58, 237, 0.1)' : 'none',
                '&:hover': {
                  backgroundColor: activeTab === tab.key ? '#6d28d9' : '#1e293b',
                  color: 'white',
                },
              }}
            >
              {tab.icon}
              {tab.name}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#080e1a', color: '#f1f5f9', fontFamily: 'sans-serif' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - 240px)` },
            ml: { md: `240px` },
            display: { xs: 'block', md: 'none' }, // Only show app bar on mobile
            backgroundColor: '#0f172a',
            borderBottom: '1px solid #334155',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              BrieflyAI
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of NavLinks. */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, backgroundColor: '#0f172a', color: '#f1f5f9', borderRight: '1px solid #334155' },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, backgroundColor: '#0f172a', color: '#f1f5f9', borderRight: '1px solid #334155' },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            mt: { xs: '64px', md: '0' }, // Adjust for AppBar height on mobile
            overflowY: 'auto',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Router>
  );
}

export default App;
