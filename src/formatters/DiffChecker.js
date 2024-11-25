import React, { useState } from 'react';
import DiffViewer from 'react-diff-viewer-continued';
import { TextField } from '@mui/material';
import FormatterContainer from '../mainComponents/FormatterContainer';
import MainComponent from '../mainComponents/MainComponent';
import { useTheme } from '../mainComponents/ThemeContext';
import CodeIcon from '@mui/icons-material/Code';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import './DiffChecker.css';
import packageJson from '../../package.json';
import { Helmet } from 'react-helmet';
import JsonIcon from '@mui/icons-material/Description'; 
import CompareIcon from '@mui/icons-material/CompareArrows';
import XmlIcon from '@mui/icons-material/Schema'

const DiffChecker = () => {
  const { theme, themeStyles } = useTheme();
  const showAdGlobal = packageJson.customSettings.showAds;

  // State management
  const [originalData, setOriginalData] = useState('{"message": "original data here!"}');
  const [modifiedData, setModifiedData] = useState('{"message": "modified data here!"}');
  const [activeView, setActiveView] = useState('diff'); // Switch between 'diff' and 'format'

  // View Toggle Function
  const handleViewChange = (view) => setActiveView(view);

  const headerConfig = {
    title: 'Diff Checker',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'Compare', path: '/diff-checker' , child:[{name: 'Code',icon:<CodeIcon />, path: '/code-compare'},
        {name: 'Text',icon:<TextSnippetIcon />, path: '/text-compare'},]},{ name: 'More Tools', path: '/json-formatter', child: [
          { name: 'JSON Formatter', icon: <JsonIcon />, path: '/json-formatter' },
          { name: 'XML Formatter', icon: <XmlIcon />, path: '/xml-formatter' },
          { name: 'XML to JSON', icon: <XmlIcon />, path: '/xmltojson-formatter' },
          { name: 'Code Formatter', icon: <CodeIcon />, path: '/code-formatter' },
          { name: 'Diff Checker', icon: <CompareIcon />, path: '/diff-checker' },
      ]  },
    ],
  };

  const footerConfig = {
    navigationItems: [
        { name: 'Developed With ❤️', path: '/' },
        { name: 'Happy Coding 😍', path: '/' },
    ],
  };

  // Diff Checker Configuration
  const diffConfig = {
    format: 'diff',
    tools: {
      input: {
        toggleView: {
          enabled: false,
          component: (
            <div className="view-selector">
              <button
                className={`view-button ${activeView === 'diff' ? 'active' : ''}`}
                onClick={() => handleViewChange('diff')}
              >
                Diff Checker
              </button>
            </div>
          ),
        },
      },
      diffViewer: {
        oldValue: originalData,
        newValue: modifiedData,
        splitView: true,
        hideLineNumbers: false,
        styles: {
          variables: {
            light: {
              diffViewerBackground: '#f7f7f7',
              addedBackground: '#e6ffe6',
              removedBackground: '#ffe6e6',
              addedColor: '#008000',
              removedColor: '#ff0000',
            },
            dark: {
              diffViewerBackground: '#2e2e2e',
              addedBackground: '#004d00',
              removedBackground: '#4d0000',
              addedColor: '#00ff00',
              removedColor: '#ff6666',
            },
          },
        },
        showDiffOnly: false,
      },
    },
  };

  return (
    <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
      <Helmet>
        <title>Diff Checker: Compare Code & Text | Dev.Tools</title>
        <link rel="icon" type="image/x-icon" href='/logo192.png' />
        <meta
          name="description"
          content="Compare text, JSON, or code files side-by-side with our free Diff Checker. Identify changes easily with syntax highlighting and precise version control."
        />
        <meta
          name="keywords"
          content="Diff Checker, Code Compare, Text Compare, JSON Compare, Free Diff Tool, Online Diff Checker"
        />
        <meta name="author" content="Dev.Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Diff Checker: Compare Code & Text | Dev.Tools" />
        <meta
          property="og:description"
          content="Quickly identify differences between two text, JSON, or code files with our online Diff Checker. Perfect for developers and analysts."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/diff-checker" />
        <meta property="og:image" content="https://yourwebsite.com/images/diff-checker-preview.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Dev.Tools" />
      </Helmet>
  {/* View Selector */}
  {diffConfig.tools.input.toggleView.enabled && diffConfig.tools.input.toggleView.component}
   {/* <h3 style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Diff Checker</h3> */}
  {/* Diff Checker View */}
  <div style={{
    display: 'flex',
    gap: '16px',
    overflow: 'hidden', // Prevent vertical overflow
    height: '100%',    // Constrain the height
    boxSizing: 'border-box', // Include padding and borders in height/width calculations
  }}>
  {activeView === 'diff' && (
    <div className={`diff-viewer-container ${theme === 'dark' ? 'dark' : 'light'}`}>
      <div className="diff-inputs">
        {/* Original Data Input */}
        <TextField
          multiline
          rows={8}
          label="Input Original Data"
          variant="outlined"
          value={originalData}
          onChange={(e) => setOriginalData(e.target.value)}
          className="fixed-width-input"
          style={{
            
            marginBottom: '16px',
            backgroundColor: themeStyles.inputBackground,
          }}
          slotProps={{
            input: {
              style: {
                color: themeStyles.fontColor, // Text color
              },
            },
            notchedOutline: {
              style: {
                borderColor: themeStyles.boxBorder, // Border color from theme
              },
            },
            inputLabel:{
                style:{
                    color: themeStyles.fontColor
                }
            }
          }}
        />

        {/* Modified Data Input */}
        <TextField
          multiline
          rows={8}
          label="Input Modified Data"
          variant="outlined"
          value={modifiedData}
          onChange={(e) => setModifiedData(e.target.value)}
           className="fixed-width-input"
          style={{
            
            marginBottom: '16px',
            backgroundColor: themeStyles.inputBackground,
          }}
          slotProps={{
            input: {
              style: {
                color: themeStyles.fontColor, // Text color
              },
            },
            notchedOutline: {
              style: {
                borderColor: themeStyles.fontColor, // Border color from theme
              },
            },
            
            inputLabel:{
                style:{
                    color: themeStyles.fontColor
                }
            }
          }}
          
        />
      </div>

      

      {/* Diff Viewer */}
      <DiffViewer
        oldValue={originalData}
        newValue={modifiedData}
        splitView={true}
        showDiffOnly={diffConfig.tools.diffViewer.styles.variables.showDiffOnly}
        useDarkTheme={theme === 'dark'} // Dynamically apply dark theme
        styles={diffConfig.tools.diffViewer.styles.variables[theme]} // Apply styles based on the theme
      />
    </div>
    
  )}
   {/* Vertical Google Ad */}
   {showAdGlobal && (
   <div
          className="google-ad-vertical"
          style={{
            width: '160px',
            height: '600px',
            backgroundColor: theme === 'dark' ? '#444' : '#f5f5f5', // Adapt to theme
            border: `1px solid ${themeStyles.boxBorder}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            color: themeStyles.fontColor,
          }}
        >
          {/* Replace this placeholder with your Google AdSense script */}
          <p>Google Ad Placeholder</p>
        </div>
   )}
</div>
  
</MainComponent>

  );
};

export default DiffChecker;
