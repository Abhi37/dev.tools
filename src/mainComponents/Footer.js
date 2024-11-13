// Footer.js
import React from 'react';
import { useTheme } from './ThemeContext';

const Footer = ({ config }) => {
  const { themeStyles } = useTheme();

  return (
    <footer
      style={{
        backgroundColor: themeStyles.backgroundColor,
        color: themeStyles.fontColor,
        padding: '1em',
        textAlign: 'center',
        borderTop: `1px solid ${themeStyles.borderColor}`,
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1,
      }}
    >
      <ul style={{ display: 'flex', justifyContent: 'center', gap: '1em', listStyleType: 'none', padding: 0, margin: 0 }}>
        {config.navigationItems.map((item) => (
          <li key={item.name}>
            <a
              href={item.path}
              style={{
                color: themeStyles.fontColor,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.target.style.color = themeStyles.hoverColor)}
              onMouseLeave={(e) => (e.target.style.color = themeStyles.fontColor)}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
