//const CracoWebpackPlugin = require("craco-webpack-plugin");

module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.resolve.fallback = {
          ...webpackConfig.resolve.fallback,
          fs: false,
          buffer: require.resolve('buffer/'),
          timers: require.resolve('timers-browserify'),
        };
        return webpackConfig;
      },
    },
  };


