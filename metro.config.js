const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web support for client-side routing
config.resolver.assetExts.push('web.js', 'web.ts', 'web.tsx');

module.exports = config;