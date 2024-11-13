// // MainContent.js
// import React from 'react';
// import { useTheme } from './ThemeContext';

// const MainContent = ({ config }) => {
//   const { themeStyles } = useTheme();

//   const renderContent = () => {
//     if (config.type === 'blog') {
//       return <div>{config.content}</div>;
//     } else if (config.type === 'form') {
//       return (
//         <div>
//           <input type="text" placeholder={config.inputPlaceholder} style={{ padding: '0.5em', marginBottom: '1em', width: '100%' }} />
//           <div>{config.outputPlaceholder}</div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return <main style={{ ...themeStyles, padding: '2em', minHeight: '70vh' }}>{renderContent()}</main>;
// };

// export default MainContent;
