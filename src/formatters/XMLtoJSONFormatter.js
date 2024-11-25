import React, { useState, useEffect } from 'react';
import FormatterContainer from '../mainComponents/FormatterContainer';
import MainComponent from '../mainComponents/MainComponent';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { TextField } from '@mui/material';
import { useTheme } from '../mainComponents/ThemeContext';
import xml2js from 'xml2js'; 
import { Helmet } from 'react-helmet';
import { prettifyXML, filterJsonBySearchTerm } from '../utils/XMLUtils';
import CodeIcon from '@mui/icons-material/Code';
import JsonIcon from '@mui/icons-material/Description'; 
import CompareIcon from '@mui/icons-material/CompareArrows';
import XmlIcon from '@mui/icons-material/Schema'

const XMLToJSONFormatterPage = () => {
  const { theme } = useTheme();
  const [data, setData] = useState('<root><message>Input XML here!</message></root>');
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [tabCounter, setTabCounter] = useState(1);
  const [tabs, setTabs] = useState([
    { id: 1, name: 'XML-2-JSON-1', data: '<root><message>Input XML here!</message></root>', searchTerm: '', selectedNode: '', isOutputExpanded: false }
  ]);
  const [activeTab, setActiveTab] = useState(0);

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
        setError({"message": err.message});
        setJsonData({"message": err.message});
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

  const headerConfig = {
    title: 'XML to JSON Converter',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'More Tools', path: '/json-formatter', child: [
        { name: 'JSON Formatter', icon: <JsonIcon />, path: '/json-formatter' },
        { name: 'XML Formatter', icon: <XmlIcon />, path: '/xml-formatter' },
        { name: 'XML to JSON', icon: <XmlIcon />, path: '/xmltojson-formatter' },
        { name: 'Code Formatter', icon: <CodeIcon />, path: '/code-formatter' },
        { name: 'Diff Checker', icon: <CompareIcon />, path: '/diff-checker' },
    ]  },
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
    format: 'xml2json',
    viewerComponent: 'ReactJsonViewer',
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
          enabled: true,
          beforeIcon: <FormatAlignLeftIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: 'Prettify XML',
          action: (data, setData) => { setData(prettifyXML(data)) },
        },
        validate: {
          enabled: true,
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
      },
      output: {
        copy: {
          enabled: true,
          beforeIcon: <ContentCopyIcon />,
          successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
          tooltip: 'Copy JSON',
          action: () => {
            const outputToCopy = jsonData ? JSON.stringify(jsonData, null, 2) : "Error: Invalid JSON format.";
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
      <Helmet>
        <title>XML to JSON Converter & Formatter | Dev.Tools</title>
        <link rel="icon" type="image/x-icon" href='/logo192.png' />
        <meta
          name="description"
          content="Easily convert XML to JSON with our free online XML to JSON Converter. Validate and prettify XML data to JSON format for seamless data transformation."
        />
        <meta
          name="keywords"
          content="XML to JSON Converter, XML to JSON Formatter, Free XML to JSON Tool, Online XML Converter, JSON Formatter, Prettify JSON"
        />
        <meta name="author" content="Dev.Tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="XML to JSON Converter & Formatter | Dev.Tools" />
        <meta
          property="og:description"
          content="Simplify your XML to JSON conversion tasks with our free online tool. Validate, format, and transform XML data to JSON effortlessly."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/xmltojson-formatter" />
        <meta property="og:image" content="https://yourwebsite.com/images/xml-to-json-preview.png" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Dev.Tools" />
      </Helmet>
      <FormatterContainer
        config={jsonConfig}
        data={activeTabData.data}
        filteredData={filteredData}
        error={error}
        onDataChange={(value) => updateTabData(activeTab, { data: value })}
        isOutputExpanded={activeTabData.isOutputExpanded}
      />
    </MainComponent>
  );
};

export default XMLToJSONFormatterPage;






// // XMLToJSONFormatterPage.js
// import React, { useState } from 'react';
// import FormatterContainer from '../mainComponents/FormatterContainer';
// import MainComponent from '../mainComponents/MainComponent';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import OpenInFullIcon from '@mui/icons-material/OpenInFull';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
// import { TextField, Select, MenuItem } from '@mui/material';
// import { useTheme } from '../mainComponents/ThemeContext';
// import xml2js from 'xml2js';
// import { handleXmlInput, validateXML, prettifyXML } from '../utils/XMLUtils';



// const XMLToJSONFormatterPage = () => {
//   const [data, setData] = useState('<root><message>Input XML here!</message></root>');
//   const { theme, themeStyles } = useTheme();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState(null);
//   const [jsonData, setJsonData] = useState(null);
//   const [selectedNode, setSelectedNode] = useState('');
//   const [nodeOptions, setNodeOptions] = useState([]);
//   const [isOutputExpanded, setIsOutputExpanded] = useState(false); 
//   const [tabCounter, setTabCounter] = useState(1);
//   // State for managing tabs
//   const [tabs, setTabs] = useState([
//     { id: 1, name: 'XML-2-JSON', data: '<root><message>Input XML here!</message></root>', searchTerm: '', selectedNode: '', isOutputExpanded: false }
//   ]);
//   const [activeTab, setActiveTab] = useState(0);

//   // Add a new tab
//   const handleAddTab = () => {
//     setTabCounter(tabCounter + 1);
//     const newTab = {
//       id: tabCounter + 1,
//       name: `XML-2-JSON ${tabCounter + 1}`,
//       data: '<root><message>Input XML here!</message></root>',
//       searchTerm: '',
//       selectedNode: '',
//       isOutputExpanded: false
//     };
//     setTabs([...tabs, newTab]);
//     setActiveTab(tabs.length);
//   };

//   // Remove a tab
//   const handleRemoveTab = (index) => {
//     if (tabs.length === 1) return;
//     const newTabs = tabs.filter((_, i) => i !== index);
//     setTabs(newTabs);
//     setActiveTab(index > 0 ? index - 1 : 0);
//   };

//   // Update a specific tab’s data
//   const updateTabData = (index, newData) => {
//     const updatedTabs = tabs.map((tab, i) => (i === index ? { ...tab, ...newData } : tab));
//     setTabs(updatedTabs);
//   };

//   const activeTabData = tabs[activeTab];

//   const convertXMLToJSON = async (xml) => {
//     const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
//     try {
//       const result = await parser.parseStringPromise(xml);
//       setJsonData(result);
//       setError(null);
//       return result;
//     } catch (err) {
//       setError('Invalid XML');
//       setJsonData(null);
      
//     }
//   };

//   const convertJSONToXML = (json) => {
//     const builder = new xml2js.Builder({ pretty: true });
//     try {
//       return builder.buildObject(json);
//     } catch (err) {
//       setError('Error converting JSON to XML');
//       return null;
//     }
//   };

//   const headerConfig = {
//     title: 'XML to JSON Convertor',
//     navigationItems: [
//       { name: 'Home', path: '/' },
//       { name: 'JSON Formatter', path: '/json-formatter' },
//     ],
//     tabs: {
//       enabled: true,
//       maxTabs: 4,
//       activeTabIndex: activeTab,
//       tabs,
//       onAddTab: handleAddTab,
//       onRemoveTab: handleRemoveTab,
//       onTabChange: (index) => setActiveTab(index),
//     },
//   };

//   const footerConfig = {
//     navigationItems: [
//       { name: 'Privacy Policy', path: '/privacy' },
//       { name: 'Terms of Service', path: '/terms' },
//     ],
//   };

//   const jsonConfig = {
//     format: 'xml2json',
//     viewerComponent: 'ReactJsonViewer',
//     tools: {
//         input: {
//             minify: {
//                 enabled: true,
//                 beforeIcon: <MinimizeIcon />,
//                 successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
//                 tooltip: 'Minify XML',
//                 action: (data, setData) => {
//                   try {
//                     const xmlDoc = new DOMParser().parseFromString(data, 'application/xml');
//                     const errorNode = xmlDoc.querySelector("parsererror");
              
//                     if (errorNode) {
//                       throw new Error("Invalid XML");
//                     }
              
//                     // Minify by serializing without adding extra whitespace
//                     const minifiedXML = new XMLSerializer()
//                       .serializeToString(xmlDoc)
//                       .replace(/>\s+</g, "><"); // Remove whitespace between tags
                    
//                     setData(minifiedXML);
//                   } catch (error) {
//                     console.error("Error minifying XML:", error.message);
//                     setData(data); // Revert to original data if there's an error
//                   }
//                 },
//               },
//             prettify: {
//                 enabled: true,
//                 beforeIcon: <FormatAlignLeftIcon />,
//                 successIcon: <CheckCircleIcon style={{ color: 'green' }} />,
//                 tooltip: 'Prettify XML',
//                 action: (data, setData) => {setData(prettifyXML(data))},
//               },
//             validate: {
//               enabled: true,
//               beforeIcon: <CheckCircleOutlineIcon />,
//               tooltip: 'Validate XML',
//               action: (data) => {
//                 try {
//                   new DOMParser().parseFromString(data, "application/xml");
//                   alert('Valid XML');
//                 } catch {
//                   alert('Invalid XML');
//                 }
//               },
//             },
//           },
//       output: {
//         copy: {
//           enabled: true,
//           beforeIcon: <ContentCopyIcon />,
//           afterIcon: null,
//           tooltip: 'Copy JSON',
//           action: (data) => navigator.clipboard.writeText(data).then(() => alert('Copied to clipboard!')),
//         },
//         search: {
//           enabled: true,
//           component: (
//             <TextField
//               type="text"
//               placeholder="Filter JSON..."
//               value={activeTabData.searchTerm}
//               size="small"
//               onChange={(e) =>  updateTabData(activeTab, { searchTerm: e.target.value })}
//               sx={{
//                 height: '40px', // Adjust height as needed
//                 fontSize: '0.8em', // Adjust font size to match toolbar icons
//                 width: '120px', // Adjust width if needed
//                 margin: '-5px 5px', // Adjust margin for spacing
//                 padding: '5px 10px', // Adjust padding for a more compact look
//                 borderColor: 'white 1px',
//                 fontWeight: 'bold',
//                 color: theme === 'dark' ? '#fff' : '#000', // Light text color for dark theme
//                 '& .MuiOutlinedInput-notchedOutline': {
//           borderColor: theme === 'dark' ? '#fff' : '#333', // White border for dark theme, grey for light theme
//         },
//         '& .MuiInputBase-input': {
//           color: theme === 'dark' ? '#fff' : '#000', // Text color in the input
//           '::placeholder': {
//             color: theme === 'dark' ? '#bbb' : '#666', // Placeholder color
//             opacity: 1,
//           },
//         },
//         '&:hover .MuiOutlinedInput-notchedOutline': {
//           borderColor: theme === 'dark' ? '#fff' : '#000', // White border on hover for dark theme
//         },
//         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//           borderColor: theme === 'dark' ? '#fff' : '#000', // White border when focused for dark theme
//         },
//               }}
              
//             />
//           ),
//           tooltip: 'Search JSON',
//         },
//         filter: {
//           enabled: false,
//           beforeIcon: <FilterListIcon />,
//           afterIcon: null,
//           tooltip: 'Filter Node',
//           component: (
//             <Select
//               value={selectedNode}
//               onChange={(e) => setSelectedNode(e.target.value)}
//               displayEmpty
//               size="small"
//             >
//               <MenuItem value="">Select Node</MenuItem>
//               {nodeOptions.map((option, index) => (
//                 <MenuItem key={index} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </Select>
//           ),
//         },
//         expandCollapse: {
//           enabled: true,
//           beforeIcon: <OpenInFullIcon />,
//           afterIcon: <CloseFullscreenIcon />,
//           tooltip: activeTabData.isOutputExpanded ? 'Collapse Output' : 'Expand Output',
//           action: () => updateTabData(activeTab, { isOutputExpanded: !activeTabData.isOutputExpanded }),
//         },
//       },
//     },
//     onMinify: (data) => setData(JSON.stringify(JSON.parse(data))),
//     onPrettify: (data) => setData(JSON.stringify(JSON.parse(data), null, 2)),
//     onValidate: (data) => {
//       try {
//         JSON.parse(data);
//         alert('Valid JSON');
//       } catch {
//         alert('Invalid JSON');
//       }
//     },
//   };

//   const filterJsonBySearchTerm = (data, term) => {
//     if (!term || typeof data !== 'object' || data === null || term.length < 2) return data;
  
//     const isMatchFound = (filteredData) => {
//       return filteredData && Object.keys(filteredData).length > 0;
//     };
  
//     if (Array.isArray(data)) {
//       const filteredArray = data
//         .map((item) => filterJsonBySearchTerm(item, term))
//         .filter((item) => item !== null && item !== undefined);
      
//       return filteredArray.length > 0 ? filteredArray : { "No matches found": "" };
//     } else {
//       const filtered = {};
//       Object.keys(data).forEach((key) => {
//         if (
//           key.toLowerCase().includes(term.toLowerCase()) ||
//           (typeof data[key] === 'string' &&
//             data[key].toLowerCase().includes(term.toLowerCase()))
//         ) {
//           filtered[key] = data[key];
//         } else if (typeof data[key] === 'object') {
//           const child = filterJsonBySearchTerm(data[key], term);
//           if (isMatchFound(child)) {
//             filtered[key] = child;
//           }
//         }
//       });
  
//       return isMatchFound(filtered) ? filtered : { "No matches found": "" };
//     }
//   };
  

//   // Parse and filter the JSON data based on the search term
//   let parsedData;
//   try {
//     parsedData = convertXMLToJSON(activeTabData.data);
//   } catch(e) {
//     parsedData = {"Error": e.message}; // If JSON parsing fails, set it to an empty object
//   }

//   const filteredData = filterJsonBySearchTerm(parsedData, activeTabData.searchTerm);

//   return (
//     <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
//       <FormatterContainer
//         config={jsonConfig}
//         data={activeTabData.data}
//         filteredData={filteredData} // Pass filtered data to FormatterContainer
//         onDataChange={(value) => updateTabData(activeTab, { data: value })}
//         isOutputExpanded={activeTabData.isOutputExpanded}
//       />
//     </MainComponent>
//   );
// };

// export default XMLToJSONFormatterPage;