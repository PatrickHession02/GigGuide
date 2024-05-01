const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, "cjs"],
  },
  server: {
    logLevel: "error", 
  },
};