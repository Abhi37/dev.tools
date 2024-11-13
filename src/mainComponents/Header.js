// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Tabs, Tab } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from './ThemeContext';
import './Header.css'

const Header = ({ config }) => {
  const { theme, themeStyles, toggleTheme } = useTheme();
  const maxTabs = config.tabs?.maxTabs || 4;

    // Set colors based on theme for better visibility
  const braceColor = theme === 'light' ? '#d35400' : 'yellow'; // Orange for light mode, yellow for dark mode
  const textColor = theme === 'light' ? '#333' : themeStyles.primaryColor || '#3498db'; // Darker text in light mode
  const titleColor = theme === 'light' ? '#2c3e50' : themeStyles.fontColor; // Darker title color for light mode

  return (
    <AppBar
      position="static"
      color="default"
      style={{
        backgroundColor: themeStyles.backgroundColor,
        color: themeStyles.fontColor,
        boxShadow: `0px 4px 6px ${themeStyles.borderColor}`,
      }}
    >
      <Toolbar>
        {/* Custom Logo with styled text "{ Dev.tools }" */}
         <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
           <span style={{ fontWeight: 'bold', color: braceColor, fontSize: '1.5em', marginRight: '4px' }}>
           {'{'}
           </span>
           <span style={{ color: textColor, fontSize: '1.5em', marginRight: '4px' }}>
            Dev.tools
          </span>
           <span style={{ fontWeight: 'bold', color: braceColor, fontSize: '1.5em' }}>
           {'}'}
         </span>
         </div>


        {/* Title and Navigation */}
        <Typography variant="h6" style={{ flexGrow: 1, color: themeStyles.fontColor }}>
          {config.title || 'My Website'}
        </Typography>

        {/* Render Tabs if Enabled */}
        {/* Tabs (Centered) */}
        {config.tabs?.enabled && (
          <div className="header-tabs">
            <Tabs
              value={config.tabs.activeTabIndex}
              onChange={(e, newIndex) => config.tabs.onTabChange(newIndex)}
              aria-label="tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              {config.tabs.tabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {tab.name}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          config.tabs.onRemoveTab(index);
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  }
                />
              ))}
            </Tabs>

            {/* "+" Icon Button: Show only if tabs are less than maxTabs */}
            {config.tabs.tabs.length < maxTabs && (
              <IconButton onClick={config.tabs.onAddTab}>
                <AddIcon />
              </IconButton>
            )}
          </div>
        )}
        
        <nav>
          <ul style={{ display: 'flex', gap: '1em', listStyleType: 'none', margin: 0, padding: 0 }}>
            {config.navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  style={{
                    color: themeStyles.fontColor,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = themeStyles.hoverColor)}
                  onMouseLeave={(e) => (e.target.style.color = themeStyles.fontColor)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle Button */}
        <IconButton onClick={toggleTheme} style={{ color: themeStyles.iconColor }}>
          {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>

      
    </AppBar>
  );
};

export default Header;


















// // Header.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
// import LightModeIcon from '@mui/icons-material/LightMode';
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import { useTheme } from './ThemeContext';

// const Header = ({ config }) => {
//   const { theme, themeStyles, toggleTheme } = useTheme();

//   // Set colors based on theme for better visibility
//   const braceColor = theme === 'light' ? '#d35400' : 'yellow'; // Orange for light mode, yellow for dark mode
//   const textColor = theme === 'light' ? '#333' : themeStyles.primaryColor || '#3498db'; // Darker text in light mode
//   const titleColor = theme === 'light' ? '#2c3e50' : themeStyles.fontColor; // Darker title color for light mode

//   return (
//     <AppBar
//       position="static"
//       color="default"
//       style={{
//         backgroundColor: themeStyles.backgroundColor,
//         color: themeStyles.fontColor,
//         boxShadow: `0px 4px 6px ${themeStyles.borderColor}`,
//       }}
//     >
//       <Toolbar>
//         {/* Custom Logo with styled text "{ Dev.tools }" */}
//         <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
//           <span style={{ fontWeight: 'bold', color: braceColor, fontSize: '1.5em', marginRight: '4px' }}>
//             {'{'}
//           </span>
//           <span style={{ color: textColor, fontSize: '1.5em', marginRight: '4px' }}>
//             Dev.tools
//           </span>
//           <span style={{ fontWeight: 'bold', color: braceColor, fontSize: '1.5em' }}>
//             {'}'}
//           </span>
//         </div>

//         <Typography variant="h6" style={{ flexGrow: 1, color: titleColor }}>
//           {config.title || 'My Website'}
//         </Typography>

//         <nav>
//           <ul style={{ display: 'flex', gap: '1em', listStyleType: 'none', margin: 0, padding: 0 }}>
//             {config.navigationItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.path}
//                   style={{
//                     color: themeStyles.fontColor,
//                     textDecoration: 'none',
//                   }}
//                   onMouseEnter={(e) => (e.target.style.color = themeStyles.hoverColor)}
//                   onMouseLeave={(e) => (e.target.style.color = themeStyles.fontColor)}
//                 >
//                   {item.name}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         <IconButton onClick={toggleTheme} style={{ color: themeStyles.iconColor }}>
//           {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;
