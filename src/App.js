// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './mainComponents/Home';
import JSONFormatterPage from './formatters/JSONFormatter';
import XMLFormatterPage from './formatters/XMLFormatter'
import XMLtoJSONFormatterPage from './formatters/XMLtoJSONFormatter'
import CodeFormatter from './formatters/CodeFormatter'
import DiffChecker from './formatters/DiffChecker'
import { ThemeProvider } from './mainComponents/ThemeContext';



function App() {
  return (
    <ThemeProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/json-formatter" element={<JSONFormatterPage />} />
            <Route path="/xml-formatter" element={<XMLFormatterPage />} />
            <Route path="/xmltojson-formatter" element={<XMLtoJSONFormatterPage />} />
            <Route path="/code-formatter" element={<CodeFormatter />} />
            <Route path="/code-formatter/:language" element={<CodeFormatter />} />
            <Route path="/code-compare" element={<DiffChecker />} />
            <Route path="/text-compare" element={<DiffChecker />} />
            <Route path="/diff-checker" element={<DiffChecker />} />
            {/* Fallback Route for unmatched paths */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
