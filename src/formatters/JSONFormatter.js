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

  // const filterJsonBySearchTerm = (data, term) => {
  //   if (!term || typeof data !== 'object' || data === null || term.length < 2) return data;

  //   if (Array.isArray(data)) {
  //     return data
  //       .map((item) => filterJsonBySearchTerm(item, term))
  //       .filter((item) => item !== null && item !== undefined);
  //   } else {
  //     const filtered = {};
  //     Object.keys(data).forEach((key) => {
  //       if (
  //         key.toLowerCase().includes(term.toLowerCase()) ||
  //         (typeof data[key] === 'string' &&
  //           data[key].toLowerCase().includes(term.toLowerCase()))
  //       ) {
  //         filtered[key] = data[key];
  //       } else if (typeof data[key] === 'object') {
  //         const child = filterJsonBySearchTerm(data[key], term);
  //         if (child && Object.keys(child).length > 0) {
  //           filtered[key] = child;
  //         }
  //       }
  //     });
  //     return Object.keys(filtered).length > 0 ? filtered : null;
  //   }
  // };

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



// import React, { useState } from 'react';
// import FormatterContainer from '../mainComponents/FormatterContainer';
// import MainComponent from '../mainComponents/MainComponent';
// import MinimizeIcon from '@mui/icons-material/Minimize';
// import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import SearchIcon from '@mui/icons-material/Search';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import { TextField, Select, MenuItem } from '@mui/material';

// const JSONFormatterPage = () => {
//   const [data, setData] = useState('{"message": "input data here!"}');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredData, setFilteredData] = useState(null);
//   const [selectedNode, setSelectedNode] = useState('');
//   const [nodeOptions, setNodeOptions] = useState([]);

//   const headerConfig = {
//     title: 'JSON Formatter',
//     navigationItems: [
//       { name: 'Home', path: '/' },
//       { name: 'JSON Formatter', path: '/json-formatter' },
//     ],
//   };

//   const footerConfig = {
//     navigationItems: [
//       { name: 'Privacy Policy', path: '/privacy' },
//       { name: 'Terms of Service', path: '/terms' },
//     ],
//   };

//   // Function to safely parse JSON input
//   const safeParseJSON = (input) => {
//     try {
//       return JSON.parse(input);
//     } catch {
//       console.warn("Invalid JSON input detected");
//       return {}; // Return an empty object if parsing fails
//     }
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     if (term.length >= 3) {
//       const parsedData = safeParseJSON(data);
//       const filtered = filterJsonBySearchTerm(parsedData, term);
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(null);
//     }
//   };

//   // Function to filter JSON by search term
//   const filterJsonBySearchTerm = (data, term) => {
//     if (!term || typeof data !== 'object' || data === null) return data;

//     if (Array.isArray(data)) {
//       return data
//         .map((item) => filterJsonBySearchTerm(item, term))
//         .filter((item) => item !== null && item !== undefined);
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
//           if (child && Object.keys(child).length > 0) {
//             filtered[key] = child;
//           }
//         }
//       });
//       return Object.keys(filtered).length > 0 ? filtered : null;
//     }
//   };

//   const jsonConfig = {
//     format: 'json',
//     viewerComponent: 'ReactJsonViewer',
//     tools: {
//       input: {
//         minify: {
//           enabled: true,
//           icon: <MinimizeIcon />,
//           tooltip: 'Minify JSON',
//           type: 'button',
//         },
//         prettify: {
//           enabled: true,
//           icon: <FormatAlignLeftIcon />,
//           tooltip: 'Prettify JSON',
//           type: 'button',
//         },
//         validate: {
//           enabled: true,
//           icon: <CheckCircleOutlineIcon />,
//           tooltip: 'Validate JSON',
//           type: 'button',
//         },
//       },
//       output: {
//         copy: {
//           enabled: true,
//           icon: <ContentCopyIcon />,
//           tooltip: 'Copy JSON',
//           type: 'button',
//           action: () => navigator.clipboard.writeText(data).then(() => alert('Copied to clipboard!')),
//         },
//         search: {
//           enabled: true,
//           icon: <SearchIcon />,
//           tooltip: 'Search JSON',
//           type: 'component',
//           component: (
//             <TextField
//               placeholder="Search..."
//               size="small"
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           ),
//         },
//         filter: {
//           enabled: true,
//           icon: <FilterListIcon />,
//           tooltip: 'Filter Node',
//           type: 'component',
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
//       },
//     },
//     onMinify: () => setData(JSON.stringify(safeParseJSON(data))),
//     onPrettify: () => setData(JSON.stringify(safeParseJSON(data), null, 2)),
//     onValidate: () => {
//       try {
//         JSON.parse(data);
//         alert('Valid JSON');
//       } catch {
//         alert('Invalid JSON');
//       }
//     },
//   };

//   return (
//     <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
//       <FormatterContainer
//         config={jsonConfig}
//         data={filteredData || data} // Use filteredData if it exists, otherwise fall back to original data
//         onDataChange={(value) => setData(value)} // Directly update data with setData
//       />
//     </MainComponent>
//   );
// };

// export default JSONFormatterPage;

// JSONFormatterPage.js