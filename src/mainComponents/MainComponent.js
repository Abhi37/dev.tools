import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from './ThemeContext';
import packageJson from '../../package.json';

const MainComponent = ({ headerConfig, footerConfig, children }) => {
  const { themeStyles } = useTheme();
  const showAdGlobal = packageJson.customSettings.showAds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: themeStyles.backgroundColor }}>
      <Header config={headerConfig} />

      <main
        style={{
          flex: 1,
          color: themeStyles.fontColor,
          padding: '1em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%',
         // Adjust based on your layout requirements  maxWidth: '1200px', 
          margin: '0 auto',
        }}
      >
        {/* Conditionally Render Ad Placeholder based on global setting */}
        {showAdGlobal && (
          <div
            style={{
              width: '100%',
              maxWidth: '728px',
              height: '90px',
              backgroundColor: themeStyles.borderColor,
              color: themeStyles.fontColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              borderRadius: '5px',
              boxShadow: `0px 2px 4px ${themeStyles.borderColor}`,
              boxSizing: 'border-box',
            }}
          >
            <p style={{ margin: 0 }}>Ad Space (728x90) - Replace with Google Ad Code</p>
          </div>
        )}

        {/* Main Content */}
        <div
          style={{
            width: '100%',
            padding: '1em',
            display: 'flex',
            flexDirection: 'row', // Adjusts layout based on content
            justifyContent: 'space-between',
            gap: '1em',
          }}
        >
          {children}
        </div>
      </main>

      <Footer config={footerConfig} />
    </div>
  );
};

export default MainComponent;
