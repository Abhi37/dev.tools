// HomePage.js
import React, { useState, useEffect }  from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MainComponent from '../mainComponents/MainComponent';
import { useTheme } from '../mainComponents/ThemeContext';
import CodeIcon from '@mui/icons-material/Code';
import JsonIcon from '@mui/icons-material/Description'; 
import CompareIcon from '@mui/icons-material/CompareArrows';
import { Helmet } from 'react-helmet';
import Grid2 from '@mui/material/Grid2';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const HomePage = () => {
  const { theme, themeStyles } = useTheme();
  const [openPopup, setOpenPopup] = useState(false);
  const [showUpdatePreference, setShowUpdatePreference] = useState(false);

  const handleAcceptCookies = () => {
    setOpenPopup(false);
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.removeItem('cookiesDeclined');
    setShowUpdatePreference(false);
  };

  const handleDeclineCookies = () => {
    setOpenPopup(false);
    localStorage.setItem('cookiesDeclined', 'true');
    localStorage.removeItem('cookiesAccepted');
    setShowUpdatePreference(true);
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const cookiesDeclined = localStorage.getItem('cookiesDeclined');
    setShowUpdatePreference(!!cookiesDeclined); // Show "Update Preferences" if cookies were declined

    if (!cookiesAccepted && !cookiesDeclined) {
      setOpenPopup(true);
    }
  }, []);

  const headerConfig = {
    title: 'Home',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'JSON Formatter', path: '/json-formatter' },
      { name: 'XML Formatter', path: '/xml-formatter' },
      { name: 'XML to JSON Formatter', path: '/xmltojson-formatter' },
      { name: 'Code Formatter', path: '/code-formatter' },
      { name: 'Code Compare', path: '/code-compare' },
    ],
  };

  const footerConfig = {
    navigationItems: [
      { name: 'Developed With ❤️', path: '/' },
      { name: 'Happy Coding 😍', path: '/' },
      ...(showUpdatePreference
        ? [{ name: 'Update Cookie Preferences', onClick: handleOpenPopup }] // Conditionally add this item
        : []),
    ],
  };

  const articles = [
    {
      title: 'How to Use JSON Formatter Effectively',
      icon: <JsonIcon sx={{ fontSize: '3rem', color: themeStyles.primaryColor }} />,
      description: `JSON formatting is an essential skill for developers and data analysts. 
        Our JSON Formatter simplifies your workflow by making data readable, validating 
        it against standards, and providing the ability to minify JSON files to reduce file size. 
        Whether you are debugging or optimizing your API responses, this tool is indispensable.`,
      link: '/json-formatter',
    },
    {
      title: 'Convert XML to JSON with Ease',
      icon: <CodeIcon sx={{ fontSize: '3rem', color: themeStyles.primaryColor }} />,
      description: `XML and JSON are two widely used data formats in modern applications. 
        Converting XML to JSON has never been easier. With our XML to JSON Converter, you can
        seamlessly transform XML data into JSON while ensuring data integrity. Perfect for 
        developers integrating third-party services.`,
      link: '/xmltojson-formatter',
    },
    {
      title: 'Code Comparison Made Simple',
      icon: <CompareIcon sx={{ fontSize: '3rem', color: themeStyles.primaryColor }} />,
      description: `Collaboration and version control demand precision. Our Code Compare tool 
        allows developers to identify differences between two versions of a file efficiently. 
        With support for syntax highlighting and side-by-side views, you’ll save time resolving
        code conflicts.`,
      link: '/code-compare',
    },
  ];

  React.useEffect(() => {
    // Google AdSense script for anchor ads
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.setAttribute('data-ad-client', 'YOUR_AD_CLIENT_ID'); // Replace with your AdSense Client ID
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Dev.Tools - JSON, XML, Code Formatters & Comparers</title>
        <link rel="icon" type="image/x-icon" href='/logo192.png' />
        <meta
          name="description"
          content="Welcome to Dev.Tools - your all-in-one solution for formatting, converting, and comparing JSON, XML, and code files. Streamline your development process today!"
        />
        <meta
          name="keywords"
          content="Dev Tools, JSON Formatter, XML Formatter, Code Formatter, Code Comparer, Free Online Tools, Format Code, Minify JSON, Prettify JSON, Convert XML to JSON"
        />
        <meta name="author" content="Dev.Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Dev.Tools - JSON, XML, Code Formatters & Comparers" />
        <meta
          property="og:description"
          content="Explore Dev.Tools - the go-to platform for formatting, converting, and comparing JSON, XML, and code files. Simplify your coding tasks today!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta property="og:image" content="https://yourwebsite.com/images/devtools-preview.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Dev.Tools" />
      </Helmet>
      <Box
        sx={{
          backgroundColor: themeStyles.backgroundColor,
          color: themeStyles.fontColor,
          padding: '20px',
          minHeight: '100vh',
        }}
      >
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
        <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textAlign: 'center',
    marginBottom: '40px',
  }}
>
  <Typography
    variant="h3"
    sx={{
      fontWeight: 'bold',
      color: themeStyles.color,
      backgroundColor: themeStyles.primaryColor,
      borderRadius: '8px',
      padding: '10px 20px',
      marginBottom: '8px',
      display: 'inline-block',
    }}
  >
    Welcome to
  </Typography>
  <Typography
    variant="h3"
    sx={{
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#000',
      backgroundColor: theme === 'dark' ? '#444' : '#ddd',
      borderRadius: '8px',
      padding: '10px 20px',
      display: 'inline-block',
    }}
  >
    Dev.tools
  </Typography>
</Box>

          <Typography variant="body1" sx={{ fontSize: '1.2rem', color: themeStyles.fontColor }}>
            Your go-to platform for formatting, converting, and comparing JSON, XML, and code files.
          </Typography>
        </Box>

        {/* Featured Articles Section */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: themeStyles.fontColor, fontWeight: 'bold', marginBottom: '20px' }}
        >
          Featured Tools
        </Typography>
        <Grid2 container spacing={4} sx={{
    display: 'flex',
    flexWrap: 'wrap', // Ensure items wrap when needed
    justifyContent: 'space-between', // Adjust spacing between items in the row
  }}>
          {/* Articles */}
          {articles.map((article, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index} sx={{
              display: 'flex', // Ensure item content is flex-aligned
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Card
                sx={{
                  backgroundColor: themeStyles.cardBackground,
                  color: themeStyles.fontColor,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  height: '100%',
                  boxShadow: `0px 4px 8px ${theme === 'dark' ? '#000' : '#ddd'}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: `0px 6px 12px ${theme === 'dark' ? '#333' : '#aaa'}`,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                {article.icon}
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '16px', textAlign: 'center' }}>
                    {article.description}
                  </Typography>
                  <Button
                    href={article.link}
                    variant="contained"
                    sx={{
                      backgroundColor: themeStyles.primaryColor,
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: themeStyles.hoverColor,
                      },
                    }}
                  >
                    Try Now <ArrowForwardIcon sx={{ fontSize: '1rem', color: themeStyles.primaryColor }}/>
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        {/* Call-to-Action Section */}
        <Box sx={{ textAlign: 'center', marginTop: '80px' }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: themeStyles.primaryColor, fontWeight: 'bold' }}
          >
            Start Your Journey with Dev.tools
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: themeStyles.fontColor, marginBottom: '16px' }}
          >
            From formatting JSON to comparing code files, our tools are designed for developers,
            analysts, and learners of all skill levels.
          </Typography>
          <Button
            href="/json-formatter"
            variant="contained"
            sx={{
              backgroundColor: themeStyles.primaryColor,
              color: '#fff',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: themeStyles.hoverColor,
              },
            }}
          >
            Get Started
          </Button>
        </Box>
        <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        aria-labelledby="cookie-popup-title"
        aria-describedby="cookie-popup-description"
      >
        <DialogTitle id="cookie-popup-title">We Use Cookies</DialogTitle>
        <DialogContent>
          <Typography id="cookie-popup-description">
            We use cookies to enhance your browsing experience. By continuing to use our website, you consent to our
            use of cookies. No user data is stored on our servers.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAcceptCookies} variant="contained" color="primary">
            Accept
          </Button>
          <Button onClick={handleDeclineCookies} variant="outlined" color="secondary">
            Decline
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </MainComponent>
  );
};

export default HomePage;
