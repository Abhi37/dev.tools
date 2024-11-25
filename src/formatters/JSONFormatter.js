// // JSONFormatterPage.js

import React, { useState } from 'react';
import FormatterContainer from '../mainComponents/FormatterContainer';
import MainComponent from '../mainComponents/MainComponent';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { TextField, Select, MenuItem } from '@mui/material';
import { useTheme } from '../mainComponents/ThemeContext';
import { Helmet } from "react-helmet";
import CodeIcon from '@mui/icons-material/Code';
import JsonIcon from '@mui/icons-material/Description'; 
import CompareIcon from '@mui/icons-material/CompareArrows';
import XmlIcon from '@mui/icons-material/Schema'




const JSONFormatterPage = () => {
  const [data, setData] = useState('{"message": "input data here!"}');
  const { theme, themeStyles } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState('');
  const [nodeOptions, setNodeOptions] = useState([]);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false); 
  const [tabCounter, setTabCounter] = useState(1);
  // State for managing tabs
  const [tabs, setTabs] = useState([
    { id: 1, name: 'JSON 1', data: '{"message": "input data here!"}', searchTerm: '', selectedNode: '', isOutputExpanded: false }
  ]);
  const [activeTab, setActiveTab] = useState(0);

  // Add a new tab
  const handleAddTab = () => {
    setTabCounter(tabCounter + 1);
    const newTab = {
      id: tabCounter + 1,
      name: `JSON ${tabCounter + 1}`,
      data: '{"message": "input data here!"}',
      searchTerm: '',
      selectedNode: '',
      isOutputExpanded: false
    };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
  };

  // Remove a tab
  const handleRemoveTab = (index) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    setActiveTab(index > 0 ? index - 1 : 0);
  };

  // Update a specific tab’s data
  const updateTabData = (index, newData) => {
    const updatedTabs = tabs.map((tab, i) => (i === index ? { ...tab, ...newData } : tab));
    setTabs(updatedTabs);
  };

  const activeTabData = tabs[activeTab];

  const headerConfig = {
    title: 'JSON Formatter',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'More Tools', path: '/json-formatter', child: [
        { name: 'JSON Formatter', icon: <JsonIcon />, path: '/json-formatter' },
        { name: 'XML Formatter', icon: <XmlIcon />, path: '/xml-formatter' },
        { name: 'XML to JSON', icon: <XmlIcon />, path: '/xmltojson-formatter' },
        { name: 'Code Formatter', icon: <CodeIcon />, path: '/code-formatter' },
        { name: 'Diff Checker', icon: <CompareIcon />, path: '/diff-checker' },
    ] },
    ],
    tabs: {
      enabled: true,
      maxTabs: 4,
      activeTabIndex: activeTab,
      tabs,
      onAddTab: handleAddTab,
      onRemoveTab: handleRemoveTab,
      onTabChange: (index) => setActiveTab(index),
    },
  };

  const footerConfig = {
    navigationItems: [
      { name: 'Developed With ❤️', path: '/' },
      { name: 'Happy Coding 😍', path: '/' },
    ],
  };

  const jsonConfig = {
    format: 'json',
    viewerComponent: 'ReactJsonViewer',
    tools: {
      input: {
        minify: {
          enabled: true,
          beforeIcon: <MinimizeIcon />,
          afterIcon: null,
          tooltip: 'Minify JSON',
          action: (data, setData) => setData(JSON.stringify(JSON.parse(data))),
        },
        prettify: {
          enabled: true,
          beforeIcon: <FormatAlignLeftIcon />,
          afterIcon: null,
          tooltip: 'Prettify JSON',
          action: (data, setData) => setData(JSON.stringify(JSON.parse(data), null, 2)),
        },
        validate: {
          enabled: false,
          beforeIcon: <CheckCircleOutlineIcon />,
          afterIcon: null,
          tooltip: 'Validate JSON',
          action: (data) => {
            try {
              JSON.parse(data);
              alert('Valid JSON');
            } catch {
              alert('Invalid JSON');
            }
          },
        },
      },
      output: {
        copy: {
          enabled: true,
          beforeIcon: <ContentCopyIcon />,
          afterIcon: null,
          tooltip: 'Copy JSON',
          action: (data) => navigator.clipboard.writeText(data).then(() => alert('Copied to clipboard!')),
        },
        search: {
          enabled: true,
          component: (
            <TextField
              type="text"
              placeholder="Filter JSON..."
              value={activeTabData.searchTerm}
              size="small"
              onChange={(e) =>  updateTabData(activeTab, { searchTerm: e.target.value })}
              sx={{
                height: '40px', // Adjust height as needed
                fontSize: '0.8em', // Adjust font size to match toolbar icons
                width: '120px', // Adjust width if needed
                margin: '-5px 5px', // Adjust margin for spacing
                padding: '5px 10px', // Adjust padding for a more compact look
                borderColor: 'white 1px',
                fontWeight: 'bold',
                color: theme === 'dark' ? '#fff' : '#000', // Light text color for dark theme
                '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme === 'dark' ? '#fff' : '#333', // White border for dark theme, grey for light theme
        },
        '& .MuiInputBase-input': {
          color: theme === 'dark' ? '#fff' : '#000', // Text color in the input
          '::placeholder': {
            color: theme === 'dark' ? '#bbb' : '#666', // Placeholder color
            opacity: 1,
          },
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme === 'dark' ? '#fff' : '#000', // White border on hover for dark theme
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme === 'dark' ? '#fff' : '#000', // White border when focused for dark theme
        },
              }}
              
            />
          ),
          tooltip: 'Search JSON',
        },
        filter: {
          enabled: false,
          beforeIcon: <FilterListIcon />,
          afterIcon: null,
          tooltip: 'Filter Node',
          component: (
            <Select
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="">Select Node</MenuItem>
              {nodeOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          ),
        },
        expandCollapse: {
          enabled: true,
          beforeIcon: <OpenInFullIcon />,
          afterIcon: <CloseFullscreenIcon />,
          tooltip: activeTabData.isOutputExpanded ? 'Collapse Output' : 'Expand Output',
          action: () => updateTabData(activeTab, { isOutputExpanded: !activeTabData.isOutputExpanded }),
        },
      },
    },
    onMinify: (data) => setData(JSON.stringify(JSON.parse(data))),
    onPrettify: (data) => setData(JSON.stringify(JSON.parse(data), null, 2)),
    onValidate: (data) => {
      try {
        JSON.parse(data);
        alert('Valid JSON');
      } catch {
        alert('Invalid JSON');
      }
    },
  };

  const filterJsonBySearchTerm = (data, term) => {
    if (!term || typeof data !== 'object' || data === null || term.length < 2) return data;
  
    const isMatchFound = (filteredData) => {
      return filteredData && Object.keys(filteredData).length > 0;
    };
  
    if (Array.isArray(data)) {
      const filteredArray = data
        .map((item) => filterJsonBySearchTerm(item, term))
        .filter((item) => item !== null && item !== undefined);
      
      return filteredArray.length > 0 ? filteredArray : { "No matches found": "" };
    } else {
      const filtered = {};
      Object.keys(data).forEach((key) => {
        if (
          key.toLowerCase().includes(term.toLowerCase()) ||
          (typeof data[key] === 'string' &&
            data[key].toLowerCase().includes(term.toLowerCase()))
        ) {
          filtered[key] = data[key];
        } else if (typeof data[key] === 'object') {
          const child = filterJsonBySearchTerm(data[key], term);
          if (isMatchFound(child)) {
            filtered[key] = child;
          }
        }
      });
  
      return isMatchFound(filtered) ? filtered : { "No matches found": "" };
    }
  };
  

  // Parse and filter the JSON data based on the search term
  let parsedData;
  try {
    parsedData = JSON.parse(activeTabData.data);
  } catch(e) {
    parsedData = {"Error": e.message}; // If JSON parsing fails, set it to an empty object
  }

  const filteredData = filterJsonBySearchTerm(parsedData, activeTabData.searchTerm);

  return (
    <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
      <Helmet>
        {/* Title Tag */}
        <title>Free Online JSON Formatter & Validator | Dev.Tools</title>
        <link rel="icon" type="image/x-icon" href='/logo192.png' />
        
        {/* Meta Description */}
        <meta
          name="description"
          content="Use our free online JSON Formatter to prettify, validate, and minify JSON data effortlessly. Dev.Tools provides easy-to-use solutions for developers."
        />

        {/* Meta Keywords */}
        <meta
          name="keywords"
          content="JSON Formatter, Validate JSON, Minify JSON, Beautify JSON Online, Free JSON Beautifier, Dev.Tools JSON Formatter"
        />

        {/* Open Graph Metadata for Social Sharing */}
        <meta property="og:title" content="Free Online JSON Formatter & Validator | Dev.Tools" />
        <meta property="og:description" content="Beautify, validate, and minify JSON data online for free with Dev.Tools. A must-have tool for developers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/json-formatter" />
        <meta property="og:image" content="https://yourwebsite.com/assets/json-formatter-preview.png" />
      </Helmet>
      <FormatterContainer
        config={jsonConfig}
        data={activeTabData.data}
        filteredData={filteredData} // Pass filtered data to FormatterContainer
        onDataChange={(value) => updateTabData(activeTab, { data: value })}
        isOutputExpanded={activeTabData.isOutputExpanded}
      />
    </MainComponent>
  );
};

export default JSONFormatterPage;