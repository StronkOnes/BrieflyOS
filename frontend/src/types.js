
/**
 * @typedef {'RESEARCH_ARTICLE' | 'BLOG_WIZARD' | 'INTERNAL_BLOG' | 'CONTACT_SCRAPER' | 'CRM' | 'KPI_DASHBOARD' | 'CRM_SUMMARY' | 'CAMPAIGN_PLANNER' | 'EMAIL_GENERATOR' | 'CONTENT_HISTORY' | 'AUTOMATION'} TabKey
 */

/**
 * @typedef {object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'New' | 'Contacted' | 'Qualified' | 'Lost'} stage
 */

/**
 * @typedef {object} Opportunity
 * @property {string} id
 * @property {string} leadId
 * @property {string} leadName
 * @property {number} amount
 * @property {'Prospecting' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'} stage
 * @property {number} probability
 */

/**
 * @typedef {object} Contact
 * @property {string} name
 * @property {string} title
 * @property {string} organization
 * @property {string} contactInfo
 * @property {string} sourceUrl
 */

/**
 * @typedef {object} HistoryItem
 * @property {string} id
 * @property {TabKey} type
 * @property {string} topic
 * @property {string} content
 * @property {Date} timestamp
 */

/**
 * @typedef {object} BlogPost
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} featuredImage // base64 string
 * @property {string} tags
 * @property {string} categories
 * @property {string} timestamp
 */

export const TabKey = {
  RESEARCH_ARTICLE: 'RESEARCH_ARTICLE',
  BLOG_WIZARD: 'BLOG_WIZARD',
  INTERNAL_BLOG: 'INTERNAL_BLOG',
  CONTACT_SCRAPER: 'CONTACT_SCRAPER',
  CRM: 'CRM',
  KPI_DASHBOARD: 'KPI_DASHBOARD',
  CRM_SUMMARY: 'CRM_SUMMARY',
  CAMPAIGN_PLANNER: 'CAMPAIGN_PLANNER',
  EMAIL_GENERATOR: 'EMAIL_GENERATOR',
  CONTENT_HISTORY: 'CONTENT_HISTORY',
  AUTOMATION: 'AUTOMATION',
};
