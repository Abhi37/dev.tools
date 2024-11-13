// FormatterContainer.js
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import CodeMirror from '@uiw/react-codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultHighlightStyle } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { linter, lintGutter } from '@codemirror/lint';
import { history, historyKeymap } from '@codemirror/commands';
import ReactJsonViewer from '@uiw/react-json-view';
import XMLViewer from 'react-xml-viewer';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import Tooltip from '@mui/material/Tooltip'; // Import Material UI Tooltip
import IconButton from '@mui/material/IconButton';
import './FormatterContainer.css';
import packageJson from '../../package.json';
//import eslint from 'eslint';

// Compartment setup
const languageCompartment = new Compartment();
const indentationCompartment = new Compartment();

// linterJS.js

export const lintJavaScript = (text) => {
  // Ensure `text` is a valid string
  if (typeof text !== 'string' || !text.trim()) return [];

  try {
    // `new Function` will throw an error if `text` contains invalid JavaScript
    new Function(text);
    return []; // No errors
  } catch (error) {
    // Get the error position and return a marker for CodeMirror to display
    const from = error.position || 0;
    const to = from + 1;

    return [
      {
        from,
        to,
        severity: 'error',
        message: error.message,
      },
    ];
  }
};



const FormatterContainer = ({ config, data, onDataChange, filteredData, isOutputExpanded, error, codeData  }) => {
  const { theme ,themeStyles } = useTheme();
  const showAdGlobal = packageJson.customSettings.showAds;
  const [formatterLineNumbers, setLineNumbers] = useState([1]);
  const [iconStates, setIconStates] = useState({});
  const xml2js = require('xml2js');
  const [value, setValue] = useState('');
  const editor = useRef(null);
  const [view, setView] = useState(null);

  console.log(codeData)

  // Adjust height based on ad visibility
  const boxHeight = showAdGlobal ? '68vh' : '78vh';
  //https://github.com/j3lte/react-xml-view/

  useEffect(() => {
    const fetchLineNumbers = async () => {
      const lines = await getLineNumbers(data, config.format);
      setLineNumbers(lines);
    };

    fetchLineNumbers();
  }, [data, config.format]);

  // Styling for main box container with independent scroll
  const boxStyle = {
    backgroundColor: themeStyles.backgroundColor,
    color: themeStyles.fontColor,
    flex: 1,
    height: boxHeight, // Dynamically set based on ad visibility
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${themeStyles.borderColor}`,
    borderRadius: '5px',
    overflow: 'hidden', // Prevents the toolbar from being pushed out
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto', // Enables vertical scroll within the content area
    display: 'flex'
  };

  const toolbarStyle = {
    backgroundColor: themeStyles.borderColor,
    color: themeStyles.fontColor,
    padding: '0.2em 0.5em',  // Reduce padding for compactness
    fontWeight: 'bold',
    position: 'sticky',  // Keeps the toolbar at the top
    top: 0,
    zIndex: 1,
    display: 'flex',
    gap: '0.3em',  // Reduce gap between icons
    alignItems: 'center',  // Align icons vertically
    fontSize: '0.9em',  // Slightly smaller font size
    height: '40px'
  };

  const iconButtonStyle = {
    padding: '0.2em',  // Compact padding for icon buttons
    fontSize: '1.1em', // Smaller icon size
};

const setToolIcon = (toolKey, state) => {
  const tool = config.tools.input[toolKey] || config.tools.output[toolKey];

  if (!tool) return;

  let newIcon = tool.beforeIcon;
  if (state === 'success') {
    newIcon = tool.successIcon;
  } else if (state === 'after' && tool.afterIcon) {
    newIcon = tool.afterIcon;
  }

  setIconStates((prev) => ({ ...prev, [toolKey]: newIcon }));

  if (state === 'success') {
    setTimeout(() => {
      setIconStates((prev) => ({
        ...prev,
        [toolKey]: tool.afterIcon || tool.beforeIcon,
      }));
    }, 300);
  }
};

const renderToolbar = (tools, section) => (
  <div className="toolbar" style={toolbarStyle}>
    {section === 'input' ? 'Input' : 'Output'}
    {Object.keys(tools).map((toolKey) => {
      const tool = tools[toolKey];
      if (tool.enabled) {
        // Check if a component exists; if so, render it directly
        if (tool.component) {
          return (
            <div key={toolKey} style={{ marginRight: '10px' }}>
              {tool.component}
            </div>
          );
        } else {
          const currentIcon = iconStates[toolKey] || tool.beforeIcon;
          // Otherwise, render the icon button with tooltip
          return (
            <Tooltip title={tool.tooltip} key={toolKey}>
              { !tool.afterIcon && (
                <IconButton
                onClick={() => {
                  tool.action(data, onDataChange, setToolIcon(toolKey, 'success'));
                }}
                style={{ ...iconButtonStyle, color: themeStyles.fontColor }}
              >
                {currentIcon}
              </IconButton>
              )}
              { tool.afterIcon && (
                <IconButton
                onClick={() => tool.action(data, onDataChange, () => setToolIcon(toolKey, 'success'))}
                style={{ ...iconButtonStyle, color: themeStyles.fontColor }}
              >
                {!isOutputExpanded ? tool.beforeIcon : tool.afterIcon}
              </IconButton>
              )}
            </Tooltip>
          );
        }
      }
      return null;
    })}
  </div>
);
  

  //Parse data only for JSON viewing
  const parseData = () => {
    try {
      const parsedData = JSON.parse(data)
      console.log('Parsed Data:', parsedData);
      return parsedData;
      
    } catch (error) {
      console.log('Error Data:', error);
      return {"Error": error}; // Fallback if data is not valid JSON
    }
  };

  const getEditorContent = (editorView) => {
    if (editorView instanceof EditorView) {
      return editorView.state.doc.toString();
    }
    return editorView;
  };
  

  const lintJSON = (text) => {
    const jsonString = getEditorContent(text); // Extract the JSON content
  
    if (typeof jsonString !== 'string') return []; // Ensure it’s a string
  
    try {
      JSON.parse(jsonString); // Check if it’s valid JSON
      return [];
    } catch (error) {
      const message = error.message;
      const position = error.position || 0;
  
      let line = 0, col = 0;
      if (position >= 0) {
        const lines = jsonString.slice(0, position).split("\n");
        line = lines.length - 1;
        col = lines[lines.length - 1].length;
      }
  
      return [
        {
          from: position,
          to: position + 1,
          severity: 'error',
          message: message,
        },
      ];
    }
  };
  const lintXML = (view) => {
    return [];
    const diagnostics = [];
    const content = view.state.doc.toString();
  
    try {
      // Parse XML and catch any syntax errors
      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(content, "application/xml");
      const errorNode = parsedDoc.querySelector("parsererror");
  
      if (errorNode) {
        // If there's an error, add it to diagnostics
        diagnostics.push({
          from: 0,
          to: content.length,
          message: errorNode.textContent || "Invalid XML",
          severity: "error",
        });
      }
    } catch (e) {
      // If any other error occurs, add it to diagnostics
      diagnostics.push({
        from: 0,
        to: content.length,
        message: e.message || "Invalid XML",
        severity: "error",
      });
    }
  
    return diagnostics;
  };

  const xmlToJson = (xmlString) => {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
      
      parser.parseString(xmlString, (err, result) => {
        if (err) {
          // Return an error message JSON if there's an error in parsing
          resolve(`{"message": "${err.message}"}`);
        } else {
          resolve(JSON.stringify(result)); // Convert to JSON string
        }
      });
    });
  };

  const getLanguageExtension = (language) => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'html':
        return html();
      case 'json':
        return json();
      case 'xml':
        return xml();
      default:
        return null;
    }
  };

  
  const getLinterExtension = (language) => {
    switch (language) {
      case 'json':
        return linter(lintJSON);
      case 'xml':
        return linter(lintXML);
      case 'javascript':
        return linter(lintJavaScript);
      case 'html':
        return linter("lintHTML");
      default:
        return null;
    }
  };

  const ViewerComponent = config.viewerComponent === 'ReactJsonViewer' ? ReactJsonViewer : XMLViewer;

  
  const getLineNumbers = async (data, format) => {
    if (format === 'json' || format=== 'xml2json') {
      try {
        let tempJson = data;
          if (format === 'xml2json') {
            tempJson = await xmlToJson(data); // Await the resolved JSON string from xmlToJson
          }
        // For JSON, format it with indentation and split by newline
        return JSON.stringify(JSON.parse(tempJson), null, 2).split('\n').map((_, index) => index + 1);
      } catch (error) {
        console.error("Error parsing JSON for line numbers:", error);
        return [1]; // Return a single line if JSON is invalid
      }
    } else if (format === 'xml') {
      try {
        //return data.split('\n').map((_, index) => index + 1);
        // Parse XML and format it to generate line numbers
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const errorNode = xmlDoc.querySelector('parsererror');
        
        if (errorNode) {
          console.error("Error parsing XML for line numbers:", errorNode.textContent);
          return [1]; // Return a single line if XML is invalid
        }
  
        // Function to format XML nodes with indentation for line counting
        const formatNode = (node, level = 0) => {
          let result = '';
          const indentation = ' '.repeat(level * 2); // Two spaces per level
          
          node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              const text = child.textContent.trim();
              if (text) result += `${text}`; // Inline text
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              const openingTag = `${indentation}<${child.nodeName}>`;
              const closingTag = `</${child.nodeName}>`;
              const childContent = formatNode(child, level + 1).trim();
              
              result += `\n${openingTag}${childContent ? ' ' + childContent : ''}${closingTag}`;
            }
          });
          
          return result;
        };
  
        // Format the root node and split by newlines to count lines
        const root = xmlDoc.documentElement;
        const formattedXML = `<${root.nodeName}>${formatNode(root, 1)}\n</${root.nodeName}>`;
        return formattedXML.split('\n').map((_, index) => index + 1);
      } catch (error) {
        console.error("Error processing XML for line numbers:", error);
        return [1]; // Return a single line if there's an error
      }
    } else {
      return [1]; // Default to a single line if format is unknown
    }
  };
  

  return (
    <div className="formatter-container" style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.fontColor }}>
      <div className="horizontal-layout" style={{ display: 'flex', gap: '1em', width: '100%' }}>

        
      {config.format === 'code' ? (
      <div className="formatter-box" style={{ ...boxStyle, flex: isOutputExpanded ? 0 : 1 }}>
          {renderToolbar(config.tools.input, 'input')}
          <div style={contentStyle}>
          <EditorView
      state={EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          defaultHighlightStyle,
          history(),
          keymap.of(historyKeymap),
          languageCompartment.of(getLanguageExtension(codeData.language)),
          indentationCompartment.of(EditorState.tabSize.of(codeData.indentation)),
          lintGutter(),
          linter((view) => {
            // Sample linter logic here
            const text = view.state.doc.toString();
            if (text.includes('error')) {
              return [{
                from: 0,
                to: text.length,
                severity: 'error',
                message: 'This is a custom lint error'
              }];
            }
            return [];
          })
        ].filter(Boolean)
      })}
      onChange={(value) => {
        setValue(value);
        onDataChange(value);
      }}
    />
          </div>
        </div>
  ) : (
    <>
      {/* Input Box with Toolbar */}
      {!isOutputExpanded && (
        <div className="formatter-box" style={{ ...boxStyle, flex: isOutputExpanded ? 0 : 1 }}>
          {renderToolbar(config.tools.input, 'input')}
          <div style={contentStyle}>
            <CodeMirror
              className="codemirror-editor"
              value={data}
              height="100%"
              extensions={[
                config.format === "json" ? json() : xml(),
                config.format === "json" ? linter(lintJSON) : linter(lintXML),
                lintGutter()
              ]}
              onChange={(editorView) => {
                const content = getEditorContent(editorView);
                onDataChange(content); // Pass the extracted content
              }}
              theme={themeStyles.fontColor === '#333' ? 'light' : 'dark'}
              style={{
                backgroundColor: themeStyles.backgroundColor,
                color: themeStyles.fontColor,
                borderRadius: '5px'
              }}
            />
          </div>
        </div>
      )}

      {/* Conditionally Render Ad Placeholder based on global setting */}
      {showAdGlobal && (
        <div
          className="ad-placeholder"
          style={{
            backgroundColor: themeStyles.borderColor,
            color: themeStyles.fontColor,
            height: '90px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '5px',
            boxShadow: `0px 2px 4px ${themeStyles.borderColor}`,
            marginBottom: '20px'
          }}
        >
          <p style={{ margin: 0 }}>Ad Space (Small) - Replace with Google Ad Code</p>
        </div>
      )}

      {/* Output Box with Conditional Viewer Component */}
      <div className="formatter-box" style={{ ...boxStyle, flex: !isOutputExpanded ? 1 : 2 }}>
        {renderToolbar(config.tools.output, 'output')}
        <div style={contentStyle} className="output-box">
          {/* Line Numbers Column */}
          <div className="line-number-column">
            {formatterLineNumbers.map((line) => (
              <div key={line} style={{ height: '1.5em', lineHeight: '1.5em' }}>
                {line}
              </div>
            ))}
          </div>

          {/* ReactJsonViewer */}
          {(config.format === 'json' || config.format === 'xml2json') ? (
            ViewerComponent && (
              <ViewerComponent
                value={filteredData || data}
                theme={theme !== 'dark' ? lightTheme : darkTheme}
                displayDataTypes={false}
                displayObjectSize={false}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.935em',
                  lineHeight: '1.6em', // Match this with line-number-column
                }}
              />
            )
          ) : config.format === 'xml' ? (
            !error ? (
              <ViewerComponent
                xml={filteredData || data}
                theme={theme !== 'dark' ? lightTheme : darkTheme}
                collapsible
                invalidXMLRenderer
                cleanEmptyTextNodes
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.935em',
                  lineHeight: '1.6em',
                }}
              />
            ) : (
              <ViewerComponent
                xml={error}
                theme={theme !== 'dark' ? lightTheme : darkTheme}
                collapsible
                invalidXMLRenderer
                cleanEmptyTextNodes
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.935em',
                  lineHeight: '1.6em',
                }}
              />
            )
          ) : (
            <p>Unsupported format</p>
          )}
        </div>
      </div>
    </>
  )
}

      </div>
    </div>
  );
};

export default FormatterContainer;
