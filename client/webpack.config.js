// webpack.config.js

const path = require('path');

module.exports = {
  // ... other webpack configuration options ...
  resolve: {
    alias: {
      crypto: path.resolve(__dirname, 'webpack.polyfills.js'),
      zlib: path.resolve(__dirname, 'webpack.polyfills.js'),
    },
  },
};
