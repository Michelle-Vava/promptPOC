const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Faster resolution — skip looking for .native variants on non-native extensions
config.resolver.resolverMainFields = ['react-native', 'browser', 'main']

// Enable persistent cache (speeds up cold starts significantly)
config.cacheStores = []

// Inline requires — defer module execution until first use (faster TTI)
config.transformer = {
  ...config.transformer,
  inlineRequires: true,
}

module.exports = config
