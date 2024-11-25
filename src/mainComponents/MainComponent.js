import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from './ThemeContext';
import packageJson from '../../package.json';

const MainComponent = ({ headerConfig, footerConfig, children }) => {
  const { themeStyles } = useTheme();
  const showAdGlobal = packageJson.customSettings.showAds;

  useEffect(() => {
    const loadAdScript = () => {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.setAttribute('data-ad-consent', 'false'); // Handle consent here
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadAdScript();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: themeStyles.backgroundColor,
      }}
    >
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
          margin: '0 auto',
        }}
      >
        {/* Ad Section */}
        {showAdGlobal && (
          <div
            style={{
              width: '100%',
              maxWidth: '728px',
              height: '90px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              borderRadius: '5px',
              boxShadow: `0px 2px 4px ${themeStyles.borderColor}`,
              backgroundColor: themeStyles.backgroundColor,
              overflow: 'hidden',
            }}
          >
            {/* Google Ad */}
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '100%' }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
              data-ad-slot="1234567890" // Replace with your AdSense ad slot
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </div>
        )}

        {/* Main Content */}
        <div
          style={{
            width: '100%',
            padding: '1em',
            display: 'flex',
            flexDirection: 'row',
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
