
import React, { useState } from 'react';
import { Box, Container, Typography, Button, AppBar, Toolbar, IconButton, Menu, MenuItem, List, ListItem, ListItemIcon, ListItemText, Grid, Card } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import { TabKey } from '../types';
import EtherealCanvas from './EtherealCanvas';

// Helper function to convert Tailwind colors to MUI theme colors or hex values
// This is a simplified example, a full implementation would involve mapping all Tailwind colors
const getMuiColor = (tailwindClass) => {
  switch (tailwindClass) {
    case 'bg-slate-950': return '#080e1a'; // A darker slate
    case 'bg-slate-900': return '#0f172a';
    case 'bg-slate-800': return '#1e293b';
    case 'bg-slate-700': return '#334155';
    case 'bg-violet-600': return '#7c3aed';
    case 'bg-violet-700': return '#6d28d9';
    case 'text-white': return '#ffffff';
    case 'text-slate-100': return '#f1f5f9';
    case 'text-slate-300': return '#cbd5e1';
    case 'text-slate-400': return '#94a3b8';
    case 'text-violet-400': return '#a78bfa';
    case 'text-green-500': return '#22c55e';
    case 'shadow-violet-600/20': return 'rgba(124, 58, 237, 0.2)';
    case 'border-slate-800': return '#1e293b';
    case 'border-slate-700': return '#334155';
    case 'border-violet-500': return '#8b5cf6';
    case 'bg-green-900/50': return 'rgba(22, 101, 52, 0.5)';
    case 'border-green-700': return '#047857';
    case 'text-green-300': return '#86efac';
    default: return 'inherit';
  }
};

const ProductDetailCard = ({ id, title, description, features, icon, onSignUpClick, reverse }) => (
  <Box
    id={id}
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' },
      alignItems: 'center',
      gap: { xs: 4, md: 6 },
      py: { xs: 6, md: 12 },
      borderBottom: '1px solid',
      borderColor: getMuiColor('border-slate-800'),
      '&:last-child': { borderBottom: 'none' }, // Remove border for the last item
    }}
  >
    <Box
      sx={{
        width: { xs: '100%', md: '50%' },
        display: 'flex',
        justifyContent: 'center',
        p: { xs: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          width: 192, // w-48
          height: 192, // h-48
          backgroundColor: getMuiColor('bg-slate-800'),
          border: '1px solid',
          borderColor: getMuiColor('border-slate-700'),
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: getMuiColor('text-violet-400'),
        }}
      >
        {icon}
      </Box>
    </Box>
    <Box
      sx={{
        width: { xs: '100%', md: '50%' },
        textAlign: { xs: 'center', md: 'left' },
      }}
    >
      <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', color: getMuiColor('text-white'), mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: getMuiColor('text-slate-300'), lineHeight: '1.75', mb: 3 }}>
        {description}
      </Typography>
      <List sx={{ spaceY: 1.5, mb: 4, textAlign: 'left' }}>
        {features.map((feature) => (
          <ListItem key={feature} disablePadding sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              <CheckIcon sx={{ width: 20, height: 20, color: getMuiColor('text-green-500'), flexShrink: 0 }} />
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{ color: getMuiColor('text-slate-300') }}>{feature}</Typography>} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        sx={{
          backgroundColor: getMuiColor('bg-violet-600'),
          '&:hover': { backgroundColor: getMuiColor('bg-violet-700') },
          color: getMuiColor('text-white'),
          fontWeight: 'bold',
          py: 1.5,
          px: 4,
          borderRadius: '8px',
          boxShadow: `0 10px 15px -3px ${getMuiColor('shadow-violet-600/20')}, 0 4px 6px -2px ${getMuiColor('shadow-violet-600/20')}`,
          transition: 'all 0.3s ease-in-out',
          transform: 'scale(1)',
          '&:hover': { transform: 'scale(1.05)' },
        }}
        onClick={onSignUpClick}
      >
        Sign Up Now
      </Button>
    </Box>
  </Box>
);

const TestimonialCard = ({ quote, name, title }) => (
  <Card
    sx={{
      backgroundColor: getMuiColor('bg-slate-900'),
      p: 3,
      borderRadius: '8px',
      border: '1px solid',
      borderColor: getMuiColor('border-slate-800'),
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <Typography variant="body1" sx={{ color: getMuiColor('text-slate-300'), fontStyle: 'italic', flexGrow: 1 }}>
      "{quote}"
    </Typography>
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ color: getMuiColor('text-white'), fontWeight: 'semibold' }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: getMuiColor('text-violet-400'), fontSize: '0.875rem' }}>
        {title}
      </Typography>
    </Box>
  </Card>
);

const PricingCard = ({ plan, price, description, features, popular }) => (
  <Card
    sx={{
      position: 'relative',
      backgroundColor: getMuiColor('bg-slate-800'),
      p: 4,
      borderRadius: '8px',
      border: '1px solid',
      borderColor: popular ? getMuiColor('border-violet-500') : getMuiColor('border-slate-700'),
    }}
  >
    {popular && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          transform: 'translateY(-50%) translateX(-50%)',
          left: '50%',
          backgroundColor: getMuiColor('bg-violet-600'),
          color: getMuiColor('text-white'),
          fontSize: '0.75rem',
          fontWeight: 'bold',
          px: 1.5,
          py: 0.5,
          borderRadius: '9999px', // full rounded
          textTransform: 'uppercase',
        }}
      >
        Most Popular
      </Box>
    )}
    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', textAlign: 'center', color: getMuiColor('text-white') }}>
      {plan}
    </Typography>
    <Typography variant="h3" sx={{ fontWeight: 'extrabold', textAlign: 'center', my: 2, color: getMuiColor('text-white') }}>
      {price}
      <Typography component="span" sx={{ fontSize: '1rem', fontWeight: 'normal', color: getMuiColor('text-slate-400') }}>
        /mo
      </Typography>
    </Typography>
    <Typography variant="body2" sx={{ color: getMuiColor('text-slate-400'), textAlign: 'center', mb: 3 }}>
      {description}
    </Typography>
    <List sx={{ spaceY: 1.5, mb: 4 }}>
      {features.map((feature) => (
        <ListItem key={feature} disablePadding sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 'auto' }}>
            <CheckIcon sx={{ width: 20, height: 20, color: getMuiColor('text-green-500'), flexShrink: 0 }} />
          </ListItemIcon>
          <ListItemText primary={<Typography sx={{ color: getMuiColor('text-slate-300') }}>{feature}</Typography>} />
        </ListItem>
      ))}
    </List>
    <Button
      variant="contained"
      sx={{
        width: '100%',
        fontWeight: 'bold',
        py: 1.5,
        px: 3,
        borderRadius: '8px',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: popular ? getMuiColor('bg-violet-600') : getMuiColor('bg-slate-700'),
        '&:hover': {
          backgroundColor: popular ? getMuiColor('bg-violet-700') : getMuiColor('bg-slate-600'),
        },
        color: getMuiColor('text-white'),
      }}
    >
      Get Started
    </Button>
  </Card>
);


const LandingPage = ({ onEnter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For desktop product dropdown
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const productLinks = [
    { id: 'product-script-writer', name: 'AI Script Writer & Teleprompter' },
    { id: 'product-blog-wizard', name: 'Blog Post Wizard' },
    { id: 'product-crm-automation', name: 'CRM & Automation' },
    { id: 'product-contact-scraper', name: 'AI Contact Scraper' },
  ];

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu on click
    setAnchorEl(null); // Close desktop dropdown
  };

  const scrollToPricing = (e) => {
    handleSmoothScroll(e, 'pricing');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('sent');
    }, 1500);
  };

  const handleProductDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProductDropdownClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ backgroundColor: getMuiColor('bg-slate-950'), color: getMuiColor('text-white'), minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <EtherealCanvas />
      </Box>

      <Box id="home" sx={{ position: 'relative', zIndex: 10 }}>
        <AppBar position="sticky" sx={{ top: 0, zIndex: 50, backgroundColor: 'rgba(8, 14, 26, 0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid', borderColor: 'rgba(30, 41, 59, 0.5)' }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textTransform: 'none', color: 'inherit' }}>
                  <Box sx={{ backgroundColor: getMuiColor('bg-violet-600'), p: 1, borderRadius: '8px' }}>
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </Box>
                  <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    BrieflyAI
                  </Typography>
                </Button>
              </Box>

              {/* Desktop Nav */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Box
                  onMouseEnter={handleProductDropdownOpen}
                  onMouseLeave={handleProductDropdownClose}
                  sx={{ position: 'relative' }}
                >
                  <Button
                    onClick={(e) => handleSmoothScroll(e, 'products')}
                    sx={{ color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none', display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    Products
                    <KeyboardArrowDownIcon sx={{ transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProductDropdownClose}
                    MenuListProps={{ onMouseLeave: handleProductDropdownClose }}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: getMuiColor('bg-slate-900'),
                        border: '1px solid',
                        borderColor: getMuiColor('border-slate-700'),
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                        mt: 0.5,
                        width: 256, // w-64
                      },
                    }}
                  >
                    {productLinks.map((link) => (
                      <MenuItem
                        key={link.id}
                        onClick={(e) => handleSmoothScroll(e, link.id)}
                        sx={{ color: getMuiColor('text-slate-300'), '&:hover': { backgroundColor: getMuiColor('bg-slate-800'), color: getMuiColor('text-white') }, py: 1, px: 2, fontSize: '0.875rem' }}
                      >
                        {link.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <Button href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} sx={{ color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}>Pricing</Button>
                <Button href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} sx={{ color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}>About</Button>
                <Button href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} sx={{ color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}>Contact Us</Button>
              </Box>

              {/* Right side buttons */}
              <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
                <Button onClick={() => onEnter()} sx={{ backgroundColor: getMuiColor('bg-slate-800'), '&:hover': { backgroundColor: getMuiColor('bg-slate-700') }, color: getMuiColor('text-white'), fontWeight: 'semibold', py: 1, px: 2.5, borderRadius: '8px', transition: 'background-color 0.2s' }}>
                  Sign In
                </Button>
              </Box>

              {/* Mobile Menu Button */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                <IconButton
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  sx={{ p: 1, borderRadius: '8px', color: getMuiColor('text-slate-400'), '&:hover': { color: getMuiColor('text-white'), backgroundColor: getMuiColor('bg-slate-700') }, focus: { outline: 'none', ring: 2, ringInset: true, ringColor: 'white' } }}
                >
                  {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <List sx={{ px: 2, pt: 2, pb: 3, '& > *': { mb: 1 } }}>
                <Box>
                  <Button onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}>
                    <span>Products</span>
                    <KeyboardArrowDownIcon sx={{ transform: isMobileProductsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </Button>
                  {isMobileProductsOpen && (
                    <List sx={{ pl: 2, mt: 0.5, '& > *': { mb: 0.5 } }}>
                      {productLinks.map((link) => (
                        <ListItem key={link.id} disablePadding>
                          <Button
                            href={`#${link.id}`}
                            onClick={(e) => handleSmoothScroll(e, link.id)}
                            sx={{ width: '100%', textAlign: 'left', display: 'block', color: getMuiColor('text-slate-400'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}
                          >
                            {link.name}
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
                <Button href="#pricing" onClick={(e) => handleSmoothScroll(e, 'pricing')} sx={{ width: '100%', textAlign: 'left', display: 'block', color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}>Pricing</Button>
                <Button href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} sx={{ width: '100%', textAlign: 'left', display: 'block', color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}>About</Button>
                <Button href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} sx={{ width: '100%', textAlign: 'left', display: 'block', color: getMuiColor('text-slate-300'), '&:hover': { color: getMuiColor('text-white') }, transition: 'color 0.2s', py: 1, px: 1.5, borderRadius: '6px', textTransform: 'none' }}>Contact Us</Button>
                <Button onClick={() => onEnter()} sx={{ width: '100%', textAlign: 'left', backgroundColor: getMuiColor('bg-violet-600'), '&:hover': { backgroundColor: getMuiColor('bg-violet-700') }, color: getMuiColor('text-white'), fontWeight: 'semibold', mt: 1, py: 1, px: 1.5, borderRadius: '6px', transition: 'background-color 0.2s' }}>
                  Sign In
                </Button>
              </List>
            </Box>
          )}
        </AppBar>

        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 }, pt: { xs: 10, md: 16 }, pb: { xs: 5, md: 10 }, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: '2.25rem', md: '3.75rem' }, // text-4xl md:text-6xl
              fontWeight: 'extrabold',
              letterSpacing: '-0.025em', // tracking-tight
              background: 'linear-gradient(to right, #a78bfa, #8b5cf6)', // from-violet-300 to-violet-500
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            Your Complete Business Automation OS
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 768, mx: 'auto', fontSize: { xs: '1.125rem', md: '1.25rem' }, color: getMuiColor('text-slate-300'), mb: 5 }}>
            Briefly is your all-in-one AI assistant for research, content creation, lead tracking, and sales reporting. Automate your workflow and manage your funnel from start to finish.
          </Typography>
          <Button
            variant="contained"
            onClick={() => onEnter(TabKey.RESEARCH_ARTICLE)}
            sx={{
              backgroundColor: getMuiColor('bg-violet-600'),
              '&:hover': { backgroundColor: getMuiColor('bg-violet-700') },
              color: getMuiColor('text-white'),
              fontWeight: 'bold',
              fontSize: '1.125rem',
              py: 2,
              px: 5,
              borderRadius: '8px',
              boxShadow: `0 10px 15px -3px ${getMuiColor('shadow-violet-600/20')}, 0 4px 6px -2px ${getMuiColor('shadow-violet-600/20')}`,
              transition: 'all 0.3s ease-in-out',
              transform: 'scale(1)',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            Generate a Script Now
          </Button>
        </Container>

        <Box id="products" sx={{ py: { xs: 10, md: 20 }, backgroundColor: 'rgba(8, 14, 26, 0.6)', backdropFilter: 'blur(16px)' }}>
          <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Explore Our Powerful Tools
            </Typography>
            <Typography variant="body1" sx={{ color: getMuiColor('text-slate-400'), textAlign: 'center', maxWidth: 768, mx: 'auto', mb: 8 }}>
              From a single idea to a full campaign, Briefly has the tools to bring your vision to life.
            </Typography>
            <Box sx={{ '& > div:not(:last-child)': { borderBottom: '1px solid', borderColor: getMuiColor('border-slate-800') } }}>
              <ProductDetailCard
                id="product-script-writer"
                title="AI Script Writer & Teleprompter"
                description="Transform your ideas into polished scripts in moments. Whether for YouTube, a podcast, or a business presentation, our AI researches your topic and drafts compelling content. Then, deliver a flawless performance with our integrated, fully-customizable teleprompter."
                features={[
                  "Generate articles, video scripts, and social posts.",
                  "AI-powered research using Google Search.",
                  "Integrated teleprompter with speed & font control.",
                  "Directly use your camera for recording."
                ]}
                icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>}
                onSignUpClick={scrollToPricing}
              />
              <ProductDetailCard
                id="product-blog-wizard"
                title="Blog Post Wizard"
                description="Go from a simple title to a fully-formatted, SEO-friendly blog post ready for publishing. Our step-by-step wizard guides you through content generation, AI-powered image creation, and adding metadata, taking the hassle out of content marketing."
                features={[
                  "AI-assisted article completion.",
                  "Generate unique featured images from a text prompt.",
                  "Manage SEO tags and categories easily.",
                  "Publish directly to internal blog or other platforms."
                ]}
                icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                onSignUpClick={scrollToPricing}
                reverse={true}
              />
              <ProductDetailCard
                id="product-crm-automation"
                title="CRM & Automation"
                description="The engine for your business growth. Track leads through customizable sales funnels, generate insightful KPI reports with AI analysis, and automate repetitive tasks. Connect Briefly to your favorite tools like Slack and Google Sheets to create a seamless workflow."
                features={[
                  "Manage leads and opportunities in a visual funnel.",
                  "AI-powered KPI dashboard and analysis.",
                  "Automate workflows between tools.",
                  "Generate email templates and campaign plans."
                ]}
                icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                onSignUpClick={scrollToPricing}
              />
              <ProductDetailCard
                id="product-contact-scraper"
                title="AI Contact Scraper"
                description="Stop spending hours on manual research. Simply describe who you're looking for, and our AI Scraper will search the web to find key contacts from directories, grant databases, and company websites. Export your results to CSV and start building relationships."
                features={[
                  "Find contacts based on natural language queries.",
                  "Extracts names, titles, organizations, and contact info.",
                  "Provides source URLs for verification.",
                  "Export all data to a CSV file with one click."
                ]}
                icon={<svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM21 21l-4.35-4.35M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>}
                onSignUpClick={scrollToPricing}
                reverse={true}
              />
            </Box>
          </Container>
        </Box>

        <Box id="pricing" sx={{ py: { xs: 10, md: 20 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="body1" sx={{ color: getMuiColor('text-slate-400'), textAlign: 'center', maxWidth: 768, mx: 'auto', mb: 6 }}>
              Choose the plan that's right for you. No hidden fees.
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1024, mx: 'auto' }}>
              <Grid item xs={12} md={6} lg={4}>
                <PricingCard
                  plan="Starter"
                  price="$0"
                  description="For individuals and hobbyists starting out."
                  features={['Up to 5 Scripts/mo', 'Basic AI Tools', 'Teleprompter Access', 'Community Support']}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <PricingCard
                  plan="Pro"
                  price="$49"
                  description="For creators and professionals who need more power."
                  features={['Unlimited Scripts', 'Advanced AI Tools', 'Blog Post Wizard', 'CRM & Automation', 'Priority Support']}
                  popular={true}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <PricingCard
                  plan="Business"
                  price="$99"
                  description="For teams and agencies managing multiple projects."
                  features={['Everything in Pro', 'Team Collaboration', 'Advanced Analytics', 'Dedicated Account Manager']}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box id="about" sx={{ py: { xs: 10, md: 20 }, backgroundColor: 'rgba(8, 14, 26, 0.6)', backdropFilter: 'blur(16px)' }}>
          <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 3 }, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              About BrieflyAI
            </Typography>
            <Typography variant="body1" sx={{ color: getMuiColor('text-slate-400'), fontSize: '1.125rem', lineHeight: '1.75' }}>
              We believe that great ideas deserve to be heard. In today's fast-paced digital world, content is king, but creating high-quality content consistently is a challenge. BrieflyAI was born from a desire to empower creators, marketers, and businesses by automating the tedious parts of content creation, so you can focus on what truly matters: your message. Our mission is to provide an intelligent, all-in-one platform that streamlines your workflow from initial idea to final publication, making it easier than ever to build your brand and grow your audience.
            </Typography>
          </Container>
        </Box>

        <Box id="testimonials" sx={{ py: { xs: 10, md: 20 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
              Loved by creators and businesses
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6} lg={4}>
                <TestimonialCard quote="BrieflyAI has completely transformed our content workflow. What used to take days now takes minutes." name="Alex Johnson" title="Content Lead, TechCorp" />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TestimonialCard quote="The script writer and teleprompter combo is a game-changer for my YouTube channel." name="Maria Garcia" title="YouTube Creator" />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TestimonialCard quote="We've automated our entire lead management process with Briefly. It's incredibly powerful and easy to use." name="David Chen" title="Founder, Startup Solutions" />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box id="contact" sx={{ py: { xs: 10, md: 20 }, backgroundColor: 'rgba(8, 14, 26, 0.6)', backdropFilter: 'blur(16px)' }}>
          <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Get In Touch
            </Typography>
            <Typography variant="body1" sx={{ color: getMuiColor('text-slate-400'), textAlign: 'center', mb: 4 }}>
              Have questions? We'd love to hear from you.
            </Typography>
            {formStatus === 'sent' ? (
              <Box sx={{ textAlign: 'center', backgroundColor: getMuiColor('bg-green-900/50'), border: '1px solid', borderColor: getMuiColor('border-green-700'), color: getMuiColor('text-green-300'), p: 3, borderRadius: '8px' }}>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>Thank you!</Typography>
                <Typography>Your message has been sent. We'll get back to you shortly.</Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleContactSubmit} sx={{ '& > div': { mb: 3 } }}>
                <Box>
                  <Typography component="label" htmlFor="name" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: getMuiColor('text-slate-300'), mb: 1 }}>Full Name</Typography>
                  <input type="text" id="name" name="name" required style={{ width: '100%', backgroundColor: getMuiColor('bg-slate-800'), padding: '12px', borderRadius: '8px', border: `1px solid ${getMuiColor('border-slate-700')}`, outline: 'none', color: getMuiColor('text-white'), transition: 'border-color 0.2s, box-shadow 0.2s', '&:focus': { borderColor: getMuiColor('border-violet-500'), boxShadow: `0 0 0 2px ${getMuiColor('border-violet-500')}` } }} placeholder="Your Name" />
                </Box>
                <Box>
                  <Typography component="label" htmlFor="email" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: getMuiColor('text-slate-300'), mb: 1 }}>Email Address</Typography>
                  <input type="email" id="email" name="email" required style={{ width: '100%', backgroundColor: getMuiColor('bg-slate-800'), padding: '12px', borderRadius: '8px', border: `1px solid ${getMuiColor('border-slate-700')}`, outline: 'none', color: getMuiColor('text-white'), transition: 'border-color 0.2s, box-shadow 0.2s', '&:focus': { borderColor: getMuiColor('border-violet-500'), boxShadow: `0 0 0 2px ${getMuiColor('border-violet-500')}` } }} placeholder="you@example.com" />
                </Box>
                <Box>
                  <Typography component="label" htmlFor="message" sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 'medium', color: getMuiColor('text-slate-300'), mb: 1 }}>Message</Typography>
                  <textarea id="message" name="message" rows={4} required style={{ width: '100%', backgroundColor: getMuiColor('bg-slate-800'), padding: '12px', borderRadius: '8px', border: `1px solid ${getMuiColor('border-slate-700')}`, outline: 'none', color: getMuiColor('text-white'), resize: 'vertical', transition: 'border-color 0.2s, box-shadow 0.2s', '&:focus': { borderColor: getMuiColor('border-violet-500'), boxShadow: `0 0 0 2px ${getMuiColor('border-violet-500')}` } }} placeholder="How can we help?"></textarea>
                </Box>
                <Box>
                  <Button
                    type="submit"
                    disabled={formStatus === 'sending'}
                    variant="contained"
                    sx={{
                      width: '100%',
                      backgroundColor: getMuiColor('bg-violet-600'),
                      '&:hover': { backgroundColor: getMuiColor('bg-violet-700') },
                      color: getMuiColor('text-white'),
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 3,
                      borderRadius: '8px',
                      boxShadow: `0 10px 15px -3px ${getMuiColor('shadow-violet-600/20')}, 0 4px 6px -2px ${getMuiColor('shadow-violet-600/20')}`,
                      transition: 'all 0.3s ease-in-out',
                      '&:disabled': { opacity: 0.5, cursor: 'wait' },
                    }}
                  >
                    {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  </Button>
                </Box>
              </Box>
            )}
          </Container>
        </Box>

        <Box component="footer" sx={{ borderTop: '1px solid', borderColor: getMuiColor('border-slate-800'), mt: { xs: 10, md: 20 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 4, color: getMuiColor('text-slate-400'), fontSize: '0.875rem' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography>&copy; {new Date().getFullYear()} BrieflyAI. All rights reserved.</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button href="#privacy" onClick={(e) => handleSmoothScroll(e, 'home')} sx={{ color: 'inherit', '&:hover': { color: getMuiColor('text-white') }, textTransform: 'none' }}>Privacy Policy</Button>
                <Button href="#terms" onClick={(e) => handleSmoothScroll(e, 'home')} sx={{ color: 'inherit', '&:hover': { color: getMuiColor('text-white') }, textTransform: 'none' }}>Terms of Service</Button>
                <Button href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} sx={{ color: 'inherit', '&:hover': { color: getMuiColor('text-white') }, textTransform: 'none' }}>Contact</Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
