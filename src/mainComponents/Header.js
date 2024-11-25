// Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from './ThemeContext';
import './Header.css';

const Header = ({ config }) => {
  const { theme, themeStyles, toggleTheme } = useTheme();
  const maxTabs = config.tabs?.maxTabs || 4;
  const navigate = useNavigate();

  // State for managing dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null); // Track which menu is open

  const handleThemeToggle = () => {
    toggleTheme();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('devtools', JSON.stringify({ theme: newTheme }));
  };

  const handleMenuClick = (event, itemName) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(itemName);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Set colors based on theme for better visibility
  const braceColor = theme === 'light' ? '#d35400' : 'yellow';
  const textColor = theme === 'light' ? '#333' : themeStyles.primaryColor || '#3498db';

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
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
          <span
            style={{
              fontWeight: 'bold',
              color: braceColor,
              fontSize: '1.5em',
              marginRight: '4px',
            }}
          >
            {'{'}
          </span>
          <span style={{ color: textColor, fontSize: '1.5em', marginRight: '4px' }}>
            Dev.tools
          </span>
          <span style={{ fontWeight: 'bold', color: braceColor, fontSize: '1.5em' }}>
            {'}'}
          </span>
        </div>

        {/* Title */}
        <Typography variant="h6" style={{ flexGrow: 1, color: themeStyles.fontColor }}>
          {config.title || 'My Website'}
        </Typography>

        {/* Tabs */}
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

            {/* "+" Icon Button */}
            {config.tabs.tabs.length < maxTabs && (
              <IconButton onClick={config.tabs.onAddTab}>
                <AddIcon />
              </IconButton>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="header-nav">
          <ul className="header-nav-list">
            {config.navigationItems.map((item) => (
              <li key={item.name} className="header-nav-item">
                {item.child ? (
                  <>
                    <Button
                      id={`${item.name}-button`}
                      aria-controls={openMenu === item.name ? `${item.name}-menu` : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu === item.name ? 'true' : undefined}
                      onClick={(e) => handleMenuClick(e, item.name)}
                      className="header-nav-dropdown-trigger"
                      endIcon={<ArrowDropDownIcon />}
                      style={{
                        color: themeStyles.fontColor,
                      }}
                    >
                      {item.name}
                    </Button>
                    <Menu
                      id={`${item.name}-menu`}
                      anchorEl={anchorEl}
                      open={openMenu === item.name}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        'aria-labelledby': `${item.name}-button`,
                      }}
                      slotProps={{
                        paper: {
                          sx: {
                            fontSize: '0.875rem', // Compact font size
                            maxHeight: '200px', // Height constraint
                            width: '200px', // Compact width
                            backgroundColor: themeStyles.backgroundColor, // Theme background
                            color: themeStyles.fontColor, // Theme text color
                            border: `1px solid ${themeStyles.borderColor}`, // Optional border
                            overflowY: 'auto', // Scroll if necessary
                          },
                        },
                      }}
                    >
                      {item.child.map((subItem) => (
                        <MenuItem
                          key={subItem.name}
                          onClick={() => handleNavigate(subItem.path)}
                          sx={{
                            '&:hover': {
                              backgroundColor: themeStyles.hoverColor,
                            },
                            color: themeStyles.fontColor,
                            padding: '6px 12px',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: themeStyles.fontColor,
                              minWidth: '30px',
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.name}
                            sx={{
                              color: themeStyles.fontColor,
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`header-nav-link ${theme === 'dark' ? 'dark' : 'light'}`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <IconButton onClick={handleThemeToggle} style={{ color: themeStyles.iconColor }}>
          {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
