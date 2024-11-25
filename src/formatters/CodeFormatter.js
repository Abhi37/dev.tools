import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormatterContainer from '../mainComponents/FormatterContainer';
import MainComponent from '../mainComponents/MainComponent';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import { TextField, Select, MenuItem } from '@mui/material';
import { useTheme } from '../mainComponents/ThemeContext';
import xml2js from 'xml2js'; 
import { prettifyXML, filterJsonBySearchTerm } from '../utils/XMLUtils';
import CodeMirror from '@uiw/react-codemirror';
import { js_beautify, html as html_beautify , css as css_beautify} from 'js-beautify';
import CodeIcon from '@mui/icons-material/Code';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import { Helmet } from 'react-helmet';
import JsonIcon from '@mui/icons-material/Description'; 
import CompareIcon from '@mui/icons-material/CompareArrows';
import XmlIcon from '@mui/icons-material/Schema'


// import { javascript } from '@codemirror/lang-javascript';
// import { xml } from '@codemirror/lang-xml';
// import { html } from '@codemirror/lang-html';

// Default placeholder messages
const placeholders = {
    javascript: `// Paste your JavaScript code here`,
    html: `<!-- Paste your HTML code here -->
  <!DOCTYPE html>
  <html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
  </html>`,
    css: `/* Paste your CSS code here */
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
  }`,
  };

const CodeFormatter = () => {
  const { theme } = useTheme();
  const [data, setData] = useState('<root><message>Input XML here!</message></root>');
  const { language: routeLanguage } = useParams(); // Extract language from route
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [tabCounter, setTabCounter] = useState(1);
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);
  const [codeData, setCodeData] = useState({
    language: routeLanguage || '', // Default to route language or empty
    indentation: 2, // Default indentation
  });
  const placeholderText = placeholders[codeData.language] || '';
  const [tabs, setTabs] = useState([
    { id: 1, name: 'CODE-1', data: '', searchTerm: '', selectedNode: '', isOutputExpanded: false }
  ]);
  const [activeTab, setActiveTab] = useState(0);
  


  const activeTabData = tabs[activeTab];

  // Update language and indentation from route
  useEffect(() => {
    setCodeData((prev) => ({
      ...prev,
      language: routeLanguage || '',
    }));
  }, [routeLanguage]);

  // Convert XML to JSON whenever `activeTabData.data` changes
  useEffect(() => {
    const convertXMLToJSON = async (xml) => {
      const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
      try {
        const result = await parser.parseStringPromise(xml);
        setJsonData(result);
        setError(null);
      } catch (err) {
        setError({ "message": err.message });
        setJsonData({ "message": err.message });
      }
    };

    convertXMLToJSON(activeTabData.data);
  }, [activeTabData.data]); // Only run when `activeTabData.data` changes

  const handleAddTab = () => {
    setTabCounter(tabCounter + 1);
    const newTab = {
      id: tabCounter + 1,
      name: `XML-2-JSON ${tabCounter + 1}`,
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
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setCodeData((prevData) => ({
      ...prevData,
      language: selectedLanguage,
    }));
    setPlaceholderVisible(true);
    navigate(`/code-formatter/${selectedLanguage}`);
  };
  
  const handleIndentationChange = (e) => {
    setCodeData((prevData) => ({
      ...prevData,
      indentation: Number(e.target.value),
    }));
  };

  const supportedLanguage = [{key:"javascript",value:"Java Script"}, {key:"html",value:"HTML"}, {key:"css",value:"CSS"}]
  const indentType = [{key:2,value:"2 Spaces"}, {key:4,value:"4 Spaces"},{key:8,value:"8 Spaces"}]

  const codeConfig = {
    format: 'code',
    viewerComponent: 'CodeMirror',
    tools: {
      input: {
        validate: {
          enabled: false,
          beforeIcon: <CheckCircleOutlineIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: 'Validate XML',
          action: (data) => {
            try {
              new DOMParser().parseFromString(data, "application/xml");
              alert('Valid XML');
            } catch {
              alert('Invalid XML');
            }
          },
        },copy: {
            enabled: true,
            beforeIcon: <ContentCopyIcon />,
            successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
            tooltip: 'Copy JSON',
            action: () => {
              //const outputToCopy = jsonData ? JSON.stringify(jsonData, null, indentation) : "Error: Invalid JSON format.";
              //navigator.clipboard.writeText(outputToCopy).then(() => console.log('Copied to clipboard!'));
            },
          },
        languageType:{
            enabled: true,
            beforeIcon: <FilterListIcon />,
            afterIcon: null,
            tooltip: 'Select Language',
            component: (
                <Select
                    value={codeData.language}
                    onChange={handleLanguageChange}
                    displayEmpty
                    size="small"
                    style={{ width: '150px' }}
                >
                    <MenuItem key="0" value="">
                <em>Select Language</em>
              </MenuItem>
                {supportedLanguage.map((obj) => (
                  <MenuItem key={obj.key} value={obj.key}>{obj.value}</MenuItem>
                ))}
            </Select>
            ),
        },
        indentType:{
            enabled: true,
            beforeIcon: <FilterListIcon />,
            afterIcon: null,
            tooltip: 'Select Indent',
            component: (
                <Select
                    value={codeData.indentation}
                    onChange={handleIndentationChange}
                    displayEmpty
                    size="small"
                    style={{ width: '150px' }}
                >
            {indentType.map((obj) => (
                  <MenuItem key={obj.key} value={obj.key}>{obj.value}</MenuItem>
                ))}
            </Select>
            ),
        },
        formatButton:{
            enabled: true,
            beforeIcon: <CodeIcon />,
            successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
            afterIcon: null,
            tooltip: 'Format Code',
            action: () => {
                const formattedCode = formatCode(activeTabData.data, codeData.language, codeData.indentation);
                //setData(formattedCode);
                updateTabData(activeTab, { data: formattedCode });
                setPlaceholderVisible(false);
              },
        }
      },
      output: {
        
      },
    },
  };

  const headerConfig = {
    title: 'Code Formatter',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'Code', path: '/', 
        child:[{name: 'JavaScript',icon:<CodeIcon />, path: '/code-formatter/javascript'},
            {name: 'HTML',icon:<HtmlIcon />, path: '/code-formatter/html'},
            {name: 'CSS',icon:<CssIcon />, path: '/code-formatter/css'}
        ] },{ name: 'More Tools', path: '/json-formatter', child: [
          { name: 'JSON Formatter', icon: <JsonIcon />, path: '/json-formatter' },
          { name: 'XML Formatter', icon: <XmlIcon />, path: '/xml-formatter' },
          { name: 'XML to JSON', icon: <XmlIcon />, path: '/xmltojson-formatter' },
          { name: 'Code Formatter', icon: <CodeIcon />, path: '/code-formatter' },
          { name: 'Diff Checker', icon: <CompareIcon />, path: '/diff-checker' },
      ]  },
    ],
    tabs: {
      enabled: false,
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

  const formatCode = (data, language, indentation) => {
    switch (language) {
      case 'json':
        try {
          const jsonObject = JSON.parse(data);
          //return jsonBeautify(jsonObject, null, indentation);
        } catch (error) {
          console.error("Invalid JSON:", error);
          return data;
        }
      case 'xml':
        try {
          //return xmlBeautify(data, { indentation: ' '.repeat(indentation) });
        } catch (error) {
          console.error("Invalid XML:", error);
          return data;
        }
      case 'javascript':
        try {
            return js_beautify(data, { indent_size: indentation });
        } catch (error) {
            console.error("Invalid JavaScript:", error);
            return data;
        }
        case 'html':
            try {
                return html_beautify(data, { indent_size: indentation });
            } catch (error) {
                console.error("Invalid JavaScript:", error);
                return data;
            }
        case 'css':
                try {
                    return css_beautify(data, { indent_size: indentation });
                } catch (error) {
                    console.error("Invalid JavaScript:", error);
                    return data;
                }
      default:
        return data;
    }
  };

  const handleCodeChange = (value) => {
    setPlaceholderVisible(value.trim() === '');
    updateTabData(activeTab, { data: value });
  };


  const filteredData = filterJsonBySearchTerm(jsonData, activeTabData.searchTerm);

  return (
    <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
      <Helmet>
        <title>Online Code Formatter: Prettify & Minify Code | Dev.Tools</title>
        <link rel="icon" type="image/x-icon" href='/logo192.png' />
        <meta
          name="description"
          content="Use our online Code Formatter to prettify, minify, and optimize code for readability and performance. Supports multiple programming languages including JavaScript, Python, HTML, and more."
        />
        <meta
          name="keywords"
          content="Code Formatter, Online Code Prettifier, Minify Code, Code Beautifier, JavaScript Formatter, HTML Formatter, Python Formatter"
        />
        <meta name="author" content="Dev.Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Online Code Formatter: Prettify & Minify Code | Dev.Tools" />
        <meta
          property="og:description"
          content="Quickly format, prettify, and minify your code using our free online Code Formatter. Supports JavaScript, Python, HTML, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/code-formatter" />
        <meta property="og:image" content="https://yourwebsite.com/images/code-formatter-preview.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Dev.Tools" />
      </Helmet>
      <FormatterContainer
        config={codeConfig}
        data={isPlaceholderVisible ? placeholderText : activeTabData.data}
        filteredData={filteredData}
        error={error}
        onDataChange={handleCodeChange}
        isOutputExpanded={activeTabData.isOutputExpanded}
        codeData={codeData}
      />
    </MainComponent>
  );
};

export default CodeFormatter;
