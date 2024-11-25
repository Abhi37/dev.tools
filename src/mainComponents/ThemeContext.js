// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  //const [theme, setTheme] = useState('light');

  const getInitialTheme = () => {
    const savedTheme = JSON.parse(localStorage.getItem('devtools'));
    return savedTheme?.theme || 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Toggle theme and save the preference to localStorage
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('devtools', JSON.stringify({ theme: newTheme }));
      return newTheme;
    });
  };

  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  // };

  // Define colors for each theme
  const themes = {
    light: {
      backgroundColor: '#f5f5f5',
      fontColor: '#333',
      hoverColor: '#e0e0e0',
      iconColor: '#555',
      borderColor: '#ddd',
      boxBorder: '#333',
      hoverFontColor: '#007BFF',
      cardBackground:'#f5f5f5'
    },
    dark: {
      backgroundColor: '#333',
      fontColor: '#f5f5f5',
      hoverColor: '#555',
      iconColor: '#bbb',
      borderColor: '#555',
      boxBorder: '#f5f5f5',
      hoverFontColor: '#1E90FF',
      cardBackground: '#333'
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
