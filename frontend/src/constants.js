
import React from 'react';
import { TabKey } from './types';

// Import Material-UI Icons
import ArticleIcon from '@mui/icons-material/Article';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookIcon from '@mui/icons-material/Book';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CampaignIcon from '@mui/icons-material/Campaign';
import EmailIcon from '@mui/icons-material/Email';
// import HistoryIcon from '@mui/icons-material/History'; // No longer needed
import AutomationIcon from '@mui/icons-material/AutoAwesome';

export const TABS = [
  { key: TabKey.RESEARCH_ARTICLE, name: 'Research & Articles', icon: <ArticleIcon /> },
  { key: TabKey.BLOG_WIZARD, name: 'Blog Post Wizard', icon: <AutoStoriesIcon /> },
  { key: TabKey.INTERNAL_BLOG, name: 'Saved Content', icon: <BookIcon /> },
  { key: TabKey.CONTACT_SCRAPER, name: 'Contact Scraper', icon: <ContactMailIcon /> },
  { key: TabKey.CRM, name: 'CRM Funnels', icon: <BusinessCenterIcon /> },
  { key: TabKey.KPI_DASHBOARD, name: 'KPI Dashboard', icon: <DashboardIcon /> },
  { key: TabKey.CRM_SUMMARY, name: 'CRM Summary', icon: <SummarizeIcon /> },
  { key: TabKey.CAMPAIGN_PLANNER, name: 'Campaign Planner', icon: <CampaignIcon /> },
  { key: TabKey.EMAIL_GENERATOR, name: 'Email Generator', icon: <EmailIcon /> },
  // { key: TabKey.CONTENT_HISTORY, name: 'Content History', icon: <HistoryIcon /> }, // Removed
  { key: TabKey.AUTOMATION, name: 'Automation', icon: <AutomationIcon /> },
];
