// XMLFormatterPage.js

import React, { useState } from 'react';
import FormatterContainer from '../mainComponents/FormatterContainer';
import Notification from '../mainComponents/NotificationPopUp';
import MainComponent from '../mainComponents/MainComponent';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TextField, Select, MenuItem } from '@mui/material';
import { useTheme } from '../mainComponents/ThemeContext';
import XMLViewer from 'react-xml-viewer';
import { Helmet } from 'react-helmet';
import { handleXmlInput, validateXML, prettifyXML } from '../utils/XMLUtils';
import CodeIcon from '@mui/icons-material/Code';
import JsonIcon from '@mui/icons-material/Description'; 
import CompareIcon from '@mui/icons-material/CompareArrows';
import XmlIcon from '@mui/icons-material/Schema'

const XMLFormatterPage = () => {
  const { theme, themeStyles } = useTheme();
  const [tabCounter, setTabCounter] = useState(1);
  const [tabs, setTabs] = useState([
    { id: 1, name: 'XML 1', data: '<root><message>Input XML here!</message></root>', searchTerm: '', selectedNode: '', isOutputExpanded: false }
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState("null");

  const activeTabData = tabs[activeTab];

  const handleAddTab = () => {
    setTabCounter(tabCounter + 1);
    const newTab = {
      id: tabCounter + 1,
      name: `XML ${tabCounter + 1}`,
      data: '<root><message>Input XML here!</message></root>',
      searchTerm: '',
      selectedNode: '',
      isOutputExpanded: false
    };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
  };

  const handleRemoveTab = (index) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    setActiveTab(index > 0 ? index - 1 : 0);
  };

  const updateTabData = (index, newData) => {
    
    const updatedTabs = tabs.map((tab, i) => (i === index ? { ...tab, ...newData } : tab));
    setTabs(updatedTabs);
    //handleDataChange(newData);

    const validatedXml = onXmlSubmit(newData.data || newData.filteredData);
  
    if (validatedXml) {
      setError(null)
      //setError("<root><errorMessage>Invalid XML</errorMessage></root>");
    } else {
      // Clear error if XML is valid
      
    }
  };

  const escapeSpecialChars = (xml) => {
    if (typeof xml !== 'string') {
      console.error("Input data is not a string:", xml);
      return { escapedXml: xml, hasSpecialChars: false }; // Return as-is if not a string
    }
  
    let hasSpecialChars = false;
    const escapedXml = xml.replace(/[&<>"']/g, (char) => {
      hasSpecialChars = true;
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&apos;';
        default:
          return char;
      }
    });
  
    return { escapedXml, hasSpecialChars };
  };
  

  const handleDataChange = (value) => {
    const { escapedXml, hasSpecialChars } = escapeSpecialChars(value);
    //updateTabData(activeTab, { data: escapedXml });

    // Show notification if special characters were replaced
    if (hasSpecialChars) {
      setShowNotification(true);
    }
  };  

  const headerConfig = {
    title: 'XML Formatter',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'More Tools', path: '/xml-formatter', child: [
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


  const xmlConfig = {
    format: 'xml',
    viewerComponent: XMLViewer,
    tools: {
      input: {
        minify: {
            enabled: true,
            beforeIcon: <MinimizeIcon />,
            successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
            tooltip: 'Minify XML',
            action: (data, setData) => {
              try {
                const xmlDoc = new DOMParser().parseFromString(data, 'application/xml');
                const errorNode = xmlDoc.querySelector("parsererror");
          
                if (errorNode) {
                  throw new Error("Invalid XML");
                }
          
                // Minify by serializing without adding extra whitespace
                const minifiedXML = new XMLSerializer()
                  .serializeToString(xmlDoc)
                  .replace(/>\s+</g, "><"); // Remove whitespace between tags
                
                setData(minifiedXML);
              } catch (error) {
                console.error("Error minifying XML:", error.message);
                setData(data); // Revert to original data if there's an error
              }
            },
          },
        prettify: {
            enabled: true,
            beforeIcon: <FormatAlignLeftIcon />,
            successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
            tooltip: 'Prettify XML',
            action: (data, setData) => {setData(prettifyXML(data))},
          }
          ,
      },
      output: {
        copy: {
          enabled: true,
          beforeIcon: <ContentCopyIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: 'Copy XML',
          action: (data) => navigator.clipboard.writeText(data).then(() => console.log("copy")),
        },
        search: {
          enabled: true,
          component: (
            <TextField
              type="text"
              placeholder="Filter XML..."
              value={activeTabData.searchTerm}
              size="small"
              onChange={(e) => {
                const filteredXml = filterXmlBySearchTerm(activeTabData.data, e.target.value);
                updateTabData(activeTab, { searchTerm: e.target.value, filteredData: filteredXml});
              }}
              sx={{
                height: '40px',
                fontSize: '0.8em',
                width: '120px',
                margin: '-5px 5px',
                padding: '5px 10px',
                borderColor: theme === 'dark' ? 'white' : 'black',
                fontWeight: 'bold',
                color: theme === 'dark' ? '#fff' : '#000',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#fff' : '#333',
                },
              }}
            />
          ),
          tooltip: 'Search XML',
        },
        expandCollapse: {
          enabled: true,
          beforeIcon: <OpenInFullIcon />,
          afterIcon: <CloseFullscreenIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: activeTabData.isOutputExpanded ? 'Collapse Output' : 'Expand Output',
          action: () => updateTabData(activeTab, { isOutputExpanded: !activeTabData.isOutputExpanded, data: activeTabData.data }),
        },
      },
    },
  };

  const onXmlSubmit = (xmlData) => {
    const { isValid, errorMessage } = validateXML(xmlData);
    console.log(isValid);
    
    if (!isValid) {
      setError("<root><errorMessage>" +errorMessage+ "</errorMessage></root>"); // Set the error message if XML is invalid
      return null;
    }
    
    setError(null); // Clear the error if XML is valid
    return xmlData; // Return valid XML data
  };
  


  const filterXmlBySearchTerm = (xmlString, searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return xmlString; // Return original XML if no search term is provided
  
    // Parse XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const errorNode = xmlDoc.querySelector("parsererror");
  
    if (errorNode) {
      console.error("Invalid XML:", errorNode.textContent);
      return xmlString; // Return original XML if parsing fails
    }
  
    // Recursive function to search XML nodes
    const searchNodes = (node, term) => {
      const termLower = term.toLowerCase();
      let hasMatch = false;
  
      // Check if node name or any text content matches the search term
      if (
        node.nodeName.toLowerCase().includes(termLower) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.toLowerCase().includes(termLower))
      ) {
        hasMatch = true;
      }
  
      // Check if any attribute name or value matches the search term
      for (let attr of node.attributes || []) {
        if (attr.name.toLowerCase().includes(termLower) || attr.value.toLowerCase().includes(termLower)) {
          hasMatch = true;
          break;
        }
      }
  
      // If the current node itself is a match, keep the entire subtree
      if (hasMatch) {
        return node.cloneNode(true); // Deep clone to keep the entire subtree
      }
  
      // Otherwise, search recursively in child nodes
      const children = [...node.childNodes];
      const matchedChildren = children
        .map((child) => searchNodes(child, term))
        .filter((child) => child !== null);
  
      if (matchedChildren.length > 0) {
        // Clone the node structure and include matched children only
        const newNode = node.cloneNode(false);
        matchedChildren.forEach((child) => newNode.appendChild(child));
        return newNode;
      } else {
        return null; // Exclude this node if it and its children do not match
      }
    };
  
    // Start the search from the root node
    const filteredNode = searchNodes(xmlDoc.documentElement, searchTerm);
  
    // Serialize the filtered XML back to string
    if (filteredNode) {
      const serializer = new XMLSerializer();
      return serializer.serializeToString(filteredNode);
    }
  
    // Return a message if nothing matches
    return "<filteredXML>No matches found</filteredXML>";
  };


  const filteredData = filterXmlBySearchTerm(activeTabData.data , activeTabData.searchTerm);
  

  return (
    <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
      <Helmet>
        <title>Free Online XML Formatter & Validator | Dev.Tools</title>
        <link rel="icon" type="image/x-icon" href='/logo192.png' />
        <meta
          name="description"
          content="Use our free online XML Formatter to prettify, validate, and minify XML data. Simplify your XML formatting tasks with our easy-to-use tool."
        />
        <meta
          name="keywords"
          content="XML Formatter, XML Validator, Free XML Tool, Online XML Formatter, XML Prettifier, XML Beautifier"
        />
        <meta name="author" content="Dev.Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Free Online XML Formatter & Validator | Dev.Tools" />
        <meta
          property="og:description"
          content="Simplify your XML formatting tasks with our free online XML Formatter. Validate, prettify, and minify your XML data easily."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/xml-formatter" />
        <meta property="og:image" content="https://yourwebsite.com/images/xml-formatter-preview.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Dev.Tools" />
      </Helmet>
      <FormatterContainer
        config={xmlConfig}
        data={activeTabData.data}
        filteredData={filteredData}
        error={error}
        onDataChange={(value) => updateTabData(activeTab, { data: value })}
        isOutputExpanded={activeTabData.isOutputExpanded}
      />
      {/* Notification for Special Character Replacement */}
      <Notification
        open={showNotification}
        onClose={() => setShowNotification(false)}
        message="Special characters detected in XML. They have been automatically escaped."
        severity="info"
      />
    </MainComponent>
  );
};

export default XMLFormatterPage;
