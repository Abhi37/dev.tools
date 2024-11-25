// FormatterContainer.js
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { css } from '@codemirror/lang-css';
import { xml } from '@codemirror/lang-xml';
import { linter, lintGutter } from '@codemirror/lint';
import ReactJsonViewer from '@uiw/react-json-view';
import XMLViewer from 'react-xml-viewer';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import Tooltip from '@mui/material/Tooltip'; // Import Material UI Tooltip
import IconButton from '@mui/material/IconButton';
import './FormatterContainer.css';
import * as acorn from 'acorn';
import packageJson from '../../package.json';



const FormatterContainer = ({ config, data, onDataChange, filteredData, isOutputExpanded, error, codeData  }) => {
  const { theme ,themeStyles } = useTheme();
  const showAdGlobal = packageJson.customSettings.showAds;
  const [formatterLineNumbers, setLineNumbers] = useState([1]);
  const [iconStates, setIconStates] = useState({});
  const xml2js = require('xml2js');
  const [value, setValue] = useState('');
  const editor = useRef(null);
  const [view, setView] = useState(null);


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


  const lintHTML = (view) => {
    const text = view.state.doc.toString();
    const errors = [];
    const lines = text.split('\n');
    let currentPos = 0; // Tracks the current position in the document

  try {
    // Parse HTML using DOMParser to find any high-level parsing errors
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const errorNode = doc.querySelector('parsererror');

    if (errorNode) {
      // If there is a general parse error, add it to the errors array
      errors.push({
        from: 0,
        to: text.length,
        severity: 'error',
        message: errorNode.textContent.trim(),
      });
    }

    // Manual checks for common HTML mistakes line-by-line
    lines.forEach((line, index) => {
      const lineStartPos = currentPos; // Start position of the line in the document
      const lineNum = index + 1;

      // Check for unclosed <div> tags
      if (line.includes('<div') && !line.includes('</div>') && !line.includes('/>')) {
        errors.push({
          from: lineStartPos + line.indexOf('<div'),
          to: lineStartPos + line.length,
          severity: 'error',
          message: `Line ${lineNum}: Possible unclosed <div> tag.`,
        });
      }

      // Check for unclosed <p> tags
      if (line.includes('<p') && !line.includes('</p>') && !line.includes('/>')) {
        errors.push({
          from: lineStartPos + line.indexOf('<p'),
          to: lineStartPos + line.length,
          severity: 'error',
          message: `Line ${lineNum}: Possible unclosed <p> tag.`,
        });
      }

      // Check for unclosed quotes in attributes
      const quoteMatches = line.match(/=["'][^"']*$/); // Matches an opening quote without a closing quote
      if (quoteMatches) {
        errors.push({
          from: lineStartPos + line.indexOf(quoteMatches[0]),
          to: lineStartPos + line.length,
          severity: 'error',
          message: `Line ${lineNum}: Missing closing quote for attribute.`,
        });
      }

      // Move to the next line's start position
      currentPos += line.length + 1; // +1 for the newline character
    });

    return errors;
  } catch (error) {
    // Catch any unexpected errors in parsing
    return [
      {
        from: 0,
        to: Math.max(1, text.length),
        severity: 'error',
        message: 'Invalid HTML format',
      },
    ];
  }
  };
  
  
  const lintJavaScript = (view) => {
    const text = view.state.doc.toString();
    try {
      // Parse JavaScript using Acorn to detect syntax errors
      acorn.parse(text, { ecmaVersion: 'latest' });
      return []; // Return an empty array if no errors are found
    } catch (error) {
      const from = error.pos || 0; // Starting position of the error
      const to = error.pos + 1; // Ending position of the error, at least 1 character after `from`
      const line = error.loc.line; // Line number of the error
      const column = error.loc.column; // Column number of the error
  
      console.log({
        from,
        to,
        line,
        column,
        severity: 'error',
        message: `Syntax Error: ${error.message}`,
      });
  
      return [
        {
          from,
          to,
          severity: 'error',
          message: `Syntax Error on line ${line}, column ${column}: ${error.message}`,
        },
      ];
    }
  };
  
  
  const lintJSON = (view) => {
    const text = view.state.doc.toString();
    try {
      JSON.parse(text);
      return [];
    } catch (error) {
      const from = error.position || 0;
      const to = Math.max(from + 1, text.length); // Ensure the range is non-zero
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
  
  const lintXML = (view) => {
    const text = view.state.doc.toString();
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'application/xml');
      const errorNode = doc.querySelector('parsererror');
      if (!errorNode) return [];
      return [
        {
          from: 0,
          to: Math.max(1, text.length), // Ensure the range is non-zero
          severity: 'error',
          message: 'Invalid XML format',
        },
      ];
    } catch (error) {
      return [
        {
          from: 0,
          to: Math.max(1, text.length), // Ensure the range is non-zero
          severity: 'error',
          message: error.message,
        },
      ];
    }
  };

const lintCSS = (view) => {
  const code = view.state.doc.toString();
  const diagnostics = [];
  const selectorPattern = /^[a-zA-Z0-9\-_:#.\s,>*+~[\]=()]+$/; // Basic selector validation
  const propertyPattern = /^[a-zA-Z-]+$/; // Valid CSS property names
  const valuePattern = /^[a-zA-Z0-9\s%#.,()]+$/; // Basic CSS value validation

  // Track current character position in the entire document
  let currentPos = 0;
  const lines = code.split('\n');

  lines.forEach((line, lineNumber) => {
    const trimmedLine = line.trim();

    // Skip comment lines
    if (trimmedLine.startsWith("/*") || trimmedLine.endsWith("*/")) {
      currentPos += line.length + 1; // +1 for newline character
      return;
    }

    // Basic check for rules with selectors and property-value pairs
    if (trimmedLine.includes(':')) {
      const [property, value] = trimmedLine.split(':').map(part => part.trim().replace(';', ''));
      
      if (property && !propertyPattern.test(property)) {
        diagnostics.push({
          from: currentPos,
          to: currentPos + property.length,
          severity: 'error',
          message: `Invalid property name: "${property}"`,
        });
      }

      if (value && !valuePattern.test(value)) {
        diagnostics.push({
          from: currentPos + property.length + 1, // Start after property
          to: currentPos + property.length + 1 + value.length,
          severity: 'error',
          message: `Invalid value for "${property}": "${value}"`,
        });
      }
    } else if (trimmedLine.includes('{') || trimmedLine.includes('}')) {
      const selector = trimmedLine.replace('{', '').replace('}', '').trim();

      if (!selectorPattern.test(selector) && selector.length > 0) {
        diagnostics.push({
          from: currentPos,
          to: currentPos + selector.length,
          severity: 'error',
          message: `Invalid selector syntax: "${selector}"`,
        });
      }
    }

    currentPos += line.length + 1; // Update position (including newline character)
  });
  console.log(diagnostics);
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


  // Dynamic language extension selector
const getLanguageExtension = (format) => {
  if(format !== 'code'){
    switch (format) {
      case 'json':
        return json();
      case 'xml':
        return xml();
      case 'javascript':
        return javascript();
      default:
        return json(); // Defaulting to JSON if no format is specified
    }
  }
  else{
    switch (codeData.language) {
      case 'javascript':
        return javascript();
      case 'html':
        return html();
      case 'css':
        return css();
      default:
        return json(); // Defaulting to JSON if no format is specified
    }
  }
  
};

// Dynamic linter extension selector
const getLinterExtension = (format) => {
  const noopLinter = () => [];
  if(format !== 'code'){
    switch (format) {
      case 'json':
        return linter(lintJSON);
      case 'xml':
        return linter(lintXML);      
      default:
        return linter(noopLinter); // Defaulting to JSON linter if no format is specified
    }
  }
  else{
    switch (codeData.language) {
      case 'javascript':
        return linter(lintJavaScript);
      case 'html':
         return linter(lintHTML);
      case 'css':
        return linter(lintCSS);
      default:
        return linter(noopLinter);
    }
  }
  
};
  

  return (
    <div className="formatter-container" style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.fontColor }}>
      <div className="horizontal-layout" style={{ display: 'flex', gap: '1em', width: '100%' }}>

        
      {config.format === 'code' ? (
      <div className="formatter-box" style={{ ...boxStyle, flex: isOutputExpanded ? 0 : 1 }}>
          {renderToolbar(config.tools.input, 'input')}
          <div style={contentStyle}>
          <CodeMirror
              className="codemirror-editor"
              value={data}
              height="100%"
              extensions={[
                getLanguageExtension(config.format),       // Language extension based on format
                getLinterExtension(config.format),         // Linter based on format
                lintGutter()                               // Common lint gutter
              ]}
              onChange={(editorView) => {
                const content = getEditorContent(editorView);  // Extract content from editor
                onDataChange(content);                         // Pass the content to onDataChange
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
  ) : (
    <>
      {/* Input Box with Toolbar */}
      {!isOutputExpanded && (
        <div className="formatter-box" style={{ ...boxStyle, flex: isOutputExpanded ? 0 : 1 }}>
          {renderToolbar(config.tools.input, 'input')}
          <div style={contentStyle}>
            {/* <CodeMirror
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
            /> */}

<CodeMirror
      className="codemirror-editor"
      value={data}
      height="100%"
      extensions={[
        getLanguageExtension(config.format),       // Language extension based on format
        getLinterExtension(config.format),         // Linter based on format
        lintGutter()                               // Common lint gutter
      ]}
      onChange={(editorView) => {
        const content = getEditorContent(editorView);  // Extract content from editor
        onDataChange(content);                         // Pass the content to onDataChange
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
