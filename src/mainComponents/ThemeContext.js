// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Define colors for each theme
  const themes = {
    light: {
      backgroundColor: '#f5f5f5',
      fontColor: '#333',
      hoverColor: '#e0e0e0',
      iconColor: '#555',
      borderColor: '#ddd',
    },
    dark: {
      backgroundColor: '#333',
      fontColor: '#f5f5f5',
      hoverColor: '#444',
      iconColor: '#bbb',
      borderColor: '#555',
    },
  };

  const themeStyles = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, themeStyles, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
