const path = require('path');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const projectRoot = __dirname;

/** Force Metro to bundle Sentry JS SDKs via CJS (ESM has unresolvable ./tracing/* paths). */
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

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(projectRoot, {
  includeWebReplay: false,
});

const sentryResolveRequest = config.resolver?.resolveRequest;

config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
  unstable_conditionNames: ['require', 'import', 'react-native', 'default'],
  resolveRequest: (context, moduleName, platform) => {
    const cjsFile = resolveSentryCjsEntry(moduleName);
    if (cjsFile) {
      return { type: 'sourceFile', filePath: cjsFile };
    }

    if (sentryResolveRequest) {
      return sentryResolveRequest(context, moduleName, platform);
    }

    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
