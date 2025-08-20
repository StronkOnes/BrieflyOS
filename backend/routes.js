const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const LEADS_FILE = path.join(__dirname, 'leads.json');
const OPPORTUNITIES_FILE = path.join(__dirname, 'opportunities.json');
const BLOGPOSTS_FILE = path.join(__dirname, 'blogposts.json');
const HISTORY_FILE = path.join(__dirname, 'history.json');

// Helper function to read leads from file
const readLeads = () => {
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads file:', error);
    return [];
  }
};

// Helper function to write leads to file
const writeLeads = (leads) => {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing leads file:', error);
  }
};

// Helper function to read opportunities from file
const readOpportunities = () => {
  try {
    const data = fs.readFileSync(OPPORTUNITIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading opportunities file:', error);
    return [];
  }
};

// Helper function to write opportunities to file
const writeOpportunities = (opportunities) => {
  try {
    fs.writeFileSync(OPPORTUNITIES_FILE, JSON.stringify(opportunities, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing opportunities file:', error);
  }
};

// Helper function to read blog posts from file
const readBlogPosts = () => {
  try {
    const data = fs.readFileSync(BLOGPOSTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blog posts file:', error);
    return [];
  }
};

// Helper function to write blog posts to file
const writeBlogPosts = (blogPosts) => {
  try {
    fs.writeFileSync(BLOGPOSTS_FILE, JSON.stringify(blogPosts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing blog posts file:', error);
  }
};

// Helper function to read history from file
const readHistory = () => {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    // Ensure it's always an array, even if file is empty or malformed
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    // If file doesn't exist or is malformed, return empty array
    if (error.code === 'ENOENT') {
      console.log('History file not found, returning empty array.');
      return [];
    }
    console.error('Error reading history file:', error);
    return [];
  }
};

// Helper function to write history to file
const writeHistory = (history) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
    console.log('History written to file successfully.');
  } catch (error) {
    console.error('Error writing history file:', error);
  }
};

// Helper function for OpenRouter API calls
const callOpenRouter = async (messages) => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'tngtech/deepseek-r1t2-chimera:free',
      messages: messages,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
};

router.post('/generate-article', async (req, res) => {
  const { topic } = req.body;

  try {
    const researchSummary = await callOpenRouter([
      {
        role: 'system',
        content: "You're an intelligent business assistant. Your tasks include researching trends, generating professional articles, managing leads, tracking sales pipelines, planning marketing campaigns, and producing reports for business owners.",
      },
      {
        role: 'user',
        content: `Research the topic '${topic}'. Provide a 3-point summary with insights, stats, and trends in bullet form.`,
      },
    ]);

    const articleDraft = await callOpenRouter([
      {
        role: 'system',
        content: "You're an intelligent business assistant. Your tasks include researching trends, generating professional articles, managing leads, tracking sales pipelines, planning marketing campaigns, and producing reports for business owners.",
      },
      {
        role: 'user',
        content: `Write a 500-word blog article based on this research: ${researchSummary}. Include a professional tone, subheadings, and a clear conclusion.`,
      },
    ]);

    res.json({ researchSummary, articleDraft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate article' });
  }
});

// Generate Short Script API
router.post('/generate-short-script', async (req, res) => {
  const { topic, researchSummary, articleDraft } = req.body;

  try {
    const script = await callOpenRouter([
      {
        role: 'system',
        content: "You're an intelligent content creator specialized in short-form video scripts. Create engaging, concise scripts for social media platforms like TikTok, Instagram Reels, and YouTube Shorts.",
      },
      {
        role: 'user',
        content: `Based on this topic: '${topic}' and research: ${researchSummary || 'No research provided'}, create a 30-60 second short video script. Include hook, main points, and call-to-action. Make it engaging and suitable for social media.`,
      },
    ]);

    res.json({ script });
  } catch (error) {
    console.error('Error generating short script:', error);
    res.status(500).json({ error: 'Failed to generate short script' });
  }
});

// Generate Podcast Script API
router.post('/generate-podcast-script', async (req, res) => {
  const { topic, researchSummary, articleDraft } = req.body;

  try {
    const script = await callOpenRouter([
      {
        role: 'system',
        content: "You're an intelligent podcast script writer. Create engaging, conversational podcast scripts with natural flow, interesting stories, and audience engagement elements.",
      },
      {
        role: 'user',
        content: `Based on this topic: '${topic}' and research: ${researchSummary || 'No research provided'}, create a 10-15 minute podcast script. Include introduction, main discussion points, examples or stories, and conclusion. Make it conversational and engaging.`,
      },
    ]);

    res.json({ script });
  } catch (error) {
    console.error('Error generating podcast script:', error);
    res.status(500).json({ error: 'Failed to generate podcast script' });
  }
});

// Generate YouTube Script API
router.post('/generate-youtube-script', async (req, res) => {
  const { topic, researchSummary, articleDraft } = req.body;

  try {
    const script = await callOpenRouter([
      {
        role: 'system',
        content: "You're an intelligent YouTube script writer. Create engaging, structured YouTube video scripts with hooks, clear segments, audience retention elements, and strong calls-to-action.",
      },
      {
        role: 'user',
        content: `Based on this topic: '${topic}' and research: ${researchSummary || 'No research provided'}, create a 5-10 minute YouTube video script. Include attention-grabbing intro, main content segments, engagement prompts, and strong outro with subscribe call-to-action.`,
      },
    ]);

    res.json({ script });
  } catch (error) {
    console.error('Error generating YouTube script:', error);
    res.status(500).json({ error: 'Failed to generate YouTube script' });
  }
});

// Leads API
router.post('/leads', (req, res) => {
  const { name, email, stage } = req.body;
  if (!name || !email || !stage) {
    return res.status(400).json({ error: 'Name, email, and stage are required' });
  }

  const leads = readLeads();
  const newLead = { id: Date.now(), name, email, stage, createdAt: new Date() };
  leads.push(newLead);
  writeLeads(leads);
  res.status(201).json(newLead);
});

router.get('/leads', (req, res) => {
  const leads = readLeads();
  res.json(leads);
});

router.get('/leads/export-csv', (req, res) => {
  const leads = readLeads();
  if (leads.length === 0) {
    return res.status(404).send('No leads to export');
  }

  const headers = Object.keys(leads[0]).join(',');
  const csvRows = leads.map(lead => Object.values(lead).map(value => `"${value}"`).join(','));
  const csv = [headers, ...csvRows].join('\n');

  res.header('Content-Type', 'text/csv');
  res.attachment('leads.csv');
  res.send(csv);
});

// Opportunities API
router.post('/opportunities', (req, res) => {
  const { leadId, leadName, amount, stage, probability } = req.body;
  if (!leadId || !leadName || !amount || !stage || probability === undefined) {
    return res.status(400).json({ error: 'Missing required opportunity fields' });
  }

  const opportunities = readOpportunities();
  const newOpportunity = { id: Date.now(), leadId, leadName, amount, stage, probability, createdAt: new Date() };
  opportunities.push(newOpportunity);
  writeOpportunities(opportunities);
  res.status(201).json(newOpportunity);
});

router.get('/opportunities', (req, res) => {
  const opportunities = readOpportunities();
  res.json(opportunities);
});

router.put('/opportunities/:id', (req, res) => {
  const { id } = req.params;
  const { leadId, leadName, amount, stage, probability } = req.body;
  let opportunities = readOpportunities();
  const index = opportunities.findIndex(opp => opp.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  opportunities[index] = { ...opportunities[index], leadId, leadName, amount, stage, probability };
  writeOpportunities(opportunities);
  res.json(opportunities[index]);
});

router.delete('/opportunities/:id', (req, res) => {
  const { id } = req.params;
  let opportunities = readOpportunities();
  const initialLength = opportunities.length;
  opportunities = opportunities.filter(opp => opp.id != id);

  if (opportunities.length === initialLength) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  writeOpportunities(opportunities);
  res.status(204).send(); // No Content
});

// KPI Analysis API
router.post('/kpi-analysis', async (req, res) => {
  const { leadsData, opportunitiesData } = req.body;
  try {
    const analysis = await callOpenRouter([
      {
        role: 'system',
        content: "You are an AI assistant specialized in business KPI analysis. Provide insightful analysis based on the provided lead and opportunity data.",
      },
      {
        role: 'user',
        content: `Analyze the following lead data: ${JSON.stringify(leadsData)}\nAnd opportunity data: ${JSON.stringify(opportunitiesData)}. Provide a summary of key performance indicators, trends, and actionable insights.`,
      },
    ]);
    res.json({ analysis });
  } catch (error) {
    console.error('Error generating KPI analysis:', error);
    res.status(500).json({ error: 'Failed to generate KPI analysis' });
  }
});

// CRM Summary Generation API
router.post('/crm-summary', async (req, res) => {
  const { crmData } = req.body;
  try {
    const summary = await callOpenRouter([
      {
        role: 'system',
        content: "You are an AI assistant specialized in summarizing CRM data. Provide a concise and insightful summary.",
      },
      {
        role: 'user',
        content: `Summarize the following CRM data: ${JSON.stringify(crmData)}. Highlight key interactions, customer sentiments, and next steps.`,
      },
    ]);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating CRM summary:', error);
    res.status(500).json({ error: 'Failed to generate CRM summary' });
  }
});

// Campaign Planning API
router.post('/campaign-plan', async (req, res) => {
  const { campaignDetails } = req.body;
  try {
    const plan = await callOpenRouter([
      {
        role: 'system',
        content: "You are an AI assistant specialized in marketing campaign planning. Generate a detailed campaign plan.",
      },
      {
        role: 'user',
        content: `Generate a marketing campaign plan based on these details: ${JSON.stringify(campaignDetails)}. Include target audience, channels, messaging, and KPIs.`,
      },
    ]);
    res.json({ plan });
  } catch (error) {
    console.error('Error generating campaign plan:', error);
    res.status(500).json({ error: 'Failed to generate campaign plan' });
  }
});

// Email Generation API
router.post('/generate-email', async (req, res) => {
  const { context } = req.body;
  try {
    const emailContent = await callOpenRouter([
      {
        role: 'system',
        content: "You are an AI assistant specialized in generating professional email content. Generate a well-structured and persuasive email.",
      },
      {
        role: 'user',
        content: `Generate an email based on the following context: ${JSON.stringify(context)}. Include a clear subject line, professional tone, and a call to action.`,
      },
    ]);
    res.json({ emailContent });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

// Contact Scraping API
router.post('/contact-scrape', async (req, res) => {
  const { query } = req.body;
  try {
    const scrapedContacts = await callOpenRouter([
      {
        role: 'system',
        content: "You are an AI-powered contact scraping assistant. Your task is to find real contact information from the web based on the user's query. You must return the data in a valid JSON format.",
      },
      {
        role: 'user',
        content: `Scrape contact information for: ${query}. Find as many contacts as you can. For each contact, provide their name, title, organization, email, contact number, and the source URL where you found the information. The output must be a JSON array of objects with the following fields: 'name', 'title', 'organization', 'email', 'contactNumber', 'sourceUrl'. A contact must have at least an email or a contact number to be included.`,
      },
    ]);

    let contacts;
    try {
      // Sometimes the AI returns the JSON wrapped in ```json ... ```, so we extract it.
      const jsonMatch = scrapedContacts.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : scrapedContacts;
      contacts = JSON.parse(jsonString);
      if (!Array.isArray(contacts)) {
        throw new Error("AI did not return a JSON array.");
      }
    } catch (parseError) {
      console.warn("AI-generated contacts not valid JSON, returning raw string:", scrapedContacts);
      return res.status(500).json({ error: "The AI failed to return valid contact information. Please try a different query.", rawOutput: scrapedContacts });
    }
    res.json({ contacts });
  } catch (error) {
    console.error('Error scraping contacts:', error);
    res.status(500).json({ error: 'Failed to scrape contacts' });
  }
});

// Blog Posts API
router.post('/blog-posts', (req, res) => {
  const { title, content, featuredImage, tags, categories } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const blogPosts = readBlogPosts();
  const newPost = { id: Date.now(), title, content, featuredImage, tags, categories, timestamp: new Date().toISOString() };
  blogPosts.push(newPost);
  writeBlogPosts(blogPosts);
  res.status(201).json(newPost);
});

router.get('/blog-posts', (req, res) => {
  const blogPosts = readBlogPosts();
  res.json(blogPosts);
});

router.put('/blog-posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, featuredImage, tags, categories } = req.body;
  let blogPosts = readBlogPosts();
  const index = blogPosts.findIndex(post => post.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  blogPosts[index] = { ...blogPosts[index], title, content, featuredImage, tags, categories, timestamp: new Date().toISOString() };
  writeBlogPosts(blogPosts);
  res.json(blogPosts[index]);
});

router.delete('/blog-posts/:id', (req, res) => {
  const { id } = req.params;
  let blogPosts = readBlogPosts();
  const initialLength = blogPosts.length;
  blogPosts = blogPosts.filter(post => post.id != id);

  if (blogPosts.length === initialLength) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  writeBlogPosts(blogPosts);
  res.status(204).send(); // No Content
});

// History API
router.get('/history', (req, res) => {
  const history = readHistory();
  res.json(history);
});

router.post('/history', (req, res) => {
  const { type, topic, content } = req.body;
  if (!type || !topic || !content) {
    return res.status(400).json({ error: 'Type, topic, and content are required' });
  }
  const history = readHistory();
  const newItem = { id: Date.now(), type, topic, content, timestamp: new Date().toISOString() };
  history.push(newItem);
  writeHistory(history);
  res.status(201).json(newItem);
});

module.exports = router;
