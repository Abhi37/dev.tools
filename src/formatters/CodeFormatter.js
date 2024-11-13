import React, { useState, useEffect } from 'react';
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
import { TextField, Select, MenuItem } from '@mui/material';
import { useTheme } from '../mainComponents/ThemeContext';
import xml2js from 'xml2js'; 
import { prettifyXML, filterJsonBySearchTerm } from '../utils/XMLUtils';
import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
// import { xml } from '@codemirror/lang-xml';
// import { html } from '@codemirror/lang-html';

const CodeFormatter = () => {
  const { theme } = useTheme();
  const [data, setData] = useState('<root><message>Input XML here!</message></root>');
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [tabCounter, setTabCounter] = useState(1);
  const [tabs, setTabs] = useState([
    { id: 1, name: 'CODE-1', data: '<root><message>Input XML here!</message></root>', searchTerm: '', selectedNode: '', isOutputExpanded: false }
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [codeData, setCodeData] = useState({language:"javascript", indentation:2})
  const [language, setLanguage] = useState('javascript');
  const [indentation, setIndentation] = useState(2);

  const activeTabData = tabs[activeTab];

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
    setCodeData((prevData) => ({
      ...prevData,
      language: e.target.value,
    }));
  };
  
  const handleIndentationChange = (e) => {
    setCodeData((prevData) => ({
      ...prevData,
      indentation: Number(e.target.value),
    }));
  };

  const headerConfig = {
    title: 'Code Formatter',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'JSON Formatter', path: '/json-formatter' },
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
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  const supportedLanguage = [{key:"javascript",value:"Java Script"}, {key:"html",value:"HTML"}]
  const indentType = [{key:2,value:"2 Spaces"}, {key:4,value:"4 Spaces"},{key:8,value:"8 Spaces"}]


  const codeConfig = {
    format: 'code',
    viewerComponent: 'CodeMirror',
    tools: {
      input: {
        minify: {
          enabled: false,
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

              const minifiedXML = new XMLSerializer()
                .serializeToString(xmlDoc)
                .replace(/>\s+</g, "><");

              setData(minifiedXML);
            } catch (error) {
              console.error("Error minifying XML:", error.message);
              setData(data);
            }
          },
        },
        prettify: {
          enabled: false,
          beforeIcon: <FormatAlignLeftIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: 'Prettify XML',
          action: (data, setData) => { setData(prettifyXML(data)) },
        },
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
        },
        languageType:{
            enabled: true,
            beforeIcon: <FilterListIcon />,
            afterIcon: null,
            tooltip: 'Select Language',
            component: (
                <Select
                    value={language}
                    onChange={handleLanguageChange}
                    displayEmpty
                    size="small"
                    style={{ width: '150px' }}
                >
            {supportedLanguage.map((obj) => (
                  <MenuItem value={obj.key}>{obj.value}</MenuItem>
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
                    value={language}
                    onChange={handleIndentationChange}
                    displayEmpty
                    size="small"
                    style={{ width: '100px' }}
                >
            {indentType.map((obj) => (
                  <MenuItem value={obj.key}>{obj.value}</MenuItem>
                ))}
            </Select>
            ),
        },
      },
      output: {
        copy: {
          enabled: true,
          beforeIcon: <ContentCopyIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: 'Copy JSON',
          action: () => {
            const outputToCopy = jsonData ? JSON.stringify(jsonData, null, indentation) : "Error: Invalid JSON format.";
            navigator.clipboard.writeText(outputToCopy).then(() => console.log('Copied to clipboard!'));
          },
        },
        search: {
          enabled: true,
          component: (
            <TextField
              type="text"
              placeholder="Filter JSON..."
              value={activeTabData.searchTerm}
              size="small"
              onChange={(e) => updateTabData(activeTab, { searchTerm: e.target.value })}
            />
          ),
          tooltip: 'Search JSON',
        },
        languageType:{
            enabled: true,
            beforeIcon: <FilterListIcon />,
            afterIcon: null,
            tooltip: 'Select Language',
            component: (
                <Select
                    value={language}
                    onChange={handleLanguageChange}
                    displayEmpty
                    size="small"
                    style={{ width: '150px' }}
                >
            {supportedLanguage.map((obj) => (
                  <MenuItem value={obj.key}>{obj.value}</MenuItem>
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
                    value={language}
                    onChange={handleIndentationChange}
                    displayEmpty
                    size="small"
                    style={{ width: '100px' }}
                >
            {indentType.map((obj) => (
                  <MenuItem value={obj.key}>{obj.value}</MenuItem>
                ))}
            </Select>
            ),
        },
        expandCollapse: {
          enabled: true,
          beforeIcon: <OpenInFullIcon />,
          afterIcon: <CloseFullscreenIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: activeTabData.isOutputExpanded ? 'Collapse Output' : 'Expand Output',
          action: () => updateTabData(activeTab, { isOutputExpanded: !activeTabData.isOutputExpanded }),
        },
      },
    },
  };

  const filteredData = filterJsonBySearchTerm(jsonData, activeTabData.searchTerm);

  return (
    <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
      
      <FormatterContainer
        config={codeConfig}
        data={activeTabData.data}
        filteredData={filteredData}
        error={error}
        onDataChange={(value) => updateTabData(activeTab, { data: value })}
        isOutputExpanded={activeTabData.isOutputExpanded}
        codeData={codeData}
      />
    </MainComponent>
  );
};

export default CodeFormatter;
