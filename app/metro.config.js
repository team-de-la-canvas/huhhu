const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
    ...defaultConfig.resolver.extraNodeModules,
    // Add your shared packages or directories here
    'common/interface': '../common/interface',
};

module.exports = defaultConfig;