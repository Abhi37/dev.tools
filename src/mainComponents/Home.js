// HomePage.js
import React from 'react';
import MainComponent from '../mainComponents/MainComponent';

const HomePage = () => {
  const headerConfig = {
    title: 'Home',
    navigationItems: [
      { name: 'Home', path: '/' },
      { name: 'JSON Formatter', path: '/json-formatter' },
      { name: 'XML Formatter', path: '/xml-formatter' },
      { name: 'XML to JSON Formatter', path: '/xmltojson-formatter' },
      { name: 'XML to JSON Convertor', path: '/xmltojson-formatter' },
      { name: 'Code Formatter', path: '/code-formatter' }
    ],
  };

  const footerConfig = {
    navigationItems: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  };

  return (
    <MainComponent headerConfig={headerConfig} footerConfig={footerConfig}>
      <h1>Welcome to the Home Page!</h1>
      <p>This is some introductory content.</p>
    </MainComponent>
  );
};

export default HomePage;
