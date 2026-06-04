const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname, {
  includeWebReplay: false,
});

// @sentry/core ESM uses deep relative imports not listed in package "exports".
// Disabling package exports lets Metro resolve those files on disk.
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
};

module.exports = config;
