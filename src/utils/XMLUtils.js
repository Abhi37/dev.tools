// xmlUtils.js

export const parseXmlWithErrors = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const errorNode = xmlDoc.querySelector('parsererror');
  
    if (errorNode) {
      // Extract the error message from the <parsererror> node
      const errorText = errorNode.textContent;
  
      // Attempt to locate the line number and column of the error
      const errorLocation = findXmlErrorLocation(xmlString, errorText);
      
      return {
        valid: false,
        message: `Syntax Error: ${errorText.trim()}`,
        location: errorLocation,
      };
    }
  
    return { valid: true, xmlDoc };
  };
  
  const findXmlErrorLocation = (xmlString, errorText) => {
    // Try to identify common error markers in the XML content
    const commonErrors = [
      { pattern: /&lt;|&gt;|&amp;/, message: "Invalid character reference, use `&lt;` for `<`, `&gt;` for `>`, and `&amp;` for `&`." },
      { pattern: /<\/?[^>]+>/g, message: "Check for mismatched or unclosed tags." },
    ];
  
    for (const { pattern, message } of commonErrors) {
      if (pattern.test(xmlString)) {
        return `Suggestion: ${message} (Error detected around here)`;
      }
    }
    
    return "Unknown location";
  };
  
  // Exporting a handler function to simplify usage
  export const handleXmlInput = (xmlString) => {
    const result = parseXmlWithErrors(xmlString);
  
    if (!result.valid) {
      console.error(result.message);
      //alert(`${result.message}\nLocation: ${result.location}`);
      return null;
    }
    
    return result.xmlDoc;
  };
  
  export const validateXML = (xmlData) => {
    try {
      const parser = new DOMParser();
      const parsedXml = parser.parseFromString(xmlData, 'application/xml');
      const errorNode = parsedXml.querySelector('parsererror');
      
      if (errorNode) {
        return { isValid: false, errorMessage: errorNode.textContent };
      }
      
      return { isValid: true, errorMessage: null };
    } catch (error) {
      return { isValid: false, errorMessage: "An unexpected error occurred during XML validation." };
    }
  };

  export const prettifyXML = (data) => {
    try {
      const xmlDoc = new DOMParser().parseFromString(data.trim(), 'application/xml');
      const errorNode = xmlDoc.querySelector("parsererror");
  
      if (errorNode) {
        throw new Error("Invalid XML");
      }
  
      const formatNode = (node, level = 0) => {
        let result = '';
        const indentation = ' '.repeat(level * 2); // Two spaces per level
  
        node.childNodes.forEach((child, index) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent.trim();
            if (text) {
              result += `${text}`; // Keep text inline with the tags
            }
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const openingTag = `${indentation}<${child.nodeName}>`;
            const closingTag = `</${child.nodeName}>`;
  
            // Recursively format child nodes
            const childContent = formatNode(child, level + 1).trim();
  
            if (childContent) {
              // No extra newline if content fits inline
              result += `${openingTag}${childContent}${closingTag}`;
            } else {
              result += `\n${openingTag}\n${indentation}${closingTag}`;
            }
          }
  
          // Add a newline only if it's not the last child
          if (index < node.childNodes.length - 1) {
            result += '\n';
          }
        });
  
        return result;
      };
  
      const root = xmlDoc.documentElement;
      return `<${root.nodeName}>\n${formatNode(root, 1)}\n</${root.nodeName}>`;
  
    } catch (error) {
      console.error("Error prettifying XML:", error.message);
      return data; // Return original data if there's an error
    }
  };

  export const filterJsonBySearchTerm = (data, term) => {
    if (!term || typeof data !== 'object' || data === null || term.length < 2) return data;
  
    const isMatchFound = (filteredData) => {
      return filteredData && Object.keys(filteredData).length > 0;
    };
  
    if (Array.isArray(data)) {
      const filteredArray = data
        .map((item) => filterJsonBySearchTerm(item, term))
        .filter((item) => item !== null && item !== undefined);
      
      return filteredArray.length > 0 ? filteredArray : null;
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
  
      return isMatchFound(filtered) ? filtered : {"message":"No match found!"};
    }
  };
  