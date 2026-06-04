const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const {
  isDevMetroBundle,
  createSentryAwareResolveRequest,
  devSentryBlockList,
} = require('./metro/crash-reporting-resolver');

const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
let config;

if (isDevMetroBundle()) {
  // Dev: plain Expo Metro — no Sentry serializer hooks pulling @sentry/core into the graph.
  config = getDefaultConfig(projectRoot);
} else {
  const { getSentryExpoConfig } = require('@sentry/react-native/metro');
  config = getSentryExpoConfig(projectRoot, { includeWebReplay: false });
}

const SENTRY_CJS_ENTRY = {
  '@sentry/core': 'build/cjs/index.js',
  '@sentry/react': 'build/cjs/index.js',
  '@sentry/browser': 'build/npm/cjs/prod/index.js',
};

function resolveSentryCjsEntry(moduleName) {
  const relativeEntry = SENTRY_CJS_ENTRY[moduleName];
  if (!relativeEntry) return null;
  try {
    const pkgJson = require.resolve(`${moduleName}/package.json`, {
      paths: [projectRoot],
    });
    return path.join(path.dirname(pkgJson), relativeEntry);
  } catch {
    return null;
  }
}

const defaultResolveRequest = config.resolver?.resolveRequest;
const sentryToolingResolve = defaultResolveRequest;

config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
  unstable_conditionNames: ['require', 'import', 'react-native', 'default'],
  blockList: [
    ...(Array.isArray(config.resolver?.blockList)
      ? config.resolver.blockList
      : config.resolver?.blockList
        ? [config.resolver.blockList]
        : []),
    ...devSentryBlockList(),
  ],
  resolveRequest: createSentryAwareResolveRequest(projectRoot, (context, moduleName, platform) => {
    if (!isDevMetroBundle()) {
      const cjsFile = resolveSentryCjsEntry(moduleName);
      if (cjsFile) {
        return { type: 'sourceFile', filePath: cjsFile };
      }
    }

    if (sentryToolingResolve) {
      return sentryToolingResolve(context, moduleName, platform);
    }

    return context.resolveRequest(context, moduleName, platform);
  }),
};

module.exports = config;
