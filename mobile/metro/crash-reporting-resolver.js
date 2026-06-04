const path = require('path');

const SENTRY_STUB = path.join(__dirname, 'sentry-stub.js');

const SENTRY_PKG_RE = /^@sentry(?:-internal)?\//;

/** True when Metro is bundling for local dev (expo start), not EAS production. */
function isDevMetroBundle() {
  if (process.env.EAS_BUILD === 'true') return false;
  if (process.env.TARTEB_SENTRY_BUNDLE === '1') return false;
  return process.env.NODE_ENV !== 'production';
}

function shouldStubSentryModule(moduleName) {
  return isDevMetroBundle() && SENTRY_PKG_RE.test(moduleName);
}

function redirectCrashReportingFile(filePath, projectRoot) {
  if (!filePath) return filePath;
  const normalized = path.normalize(filePath);
  const crashTs = path.normalize(
    path.join(projectRoot, 'src/core/services/crashReporting.ts'),
  );

  if (normalized !== crashTs) {
    return filePath;
  }

  if (isDevMetroBundle()) {
    return path.join(projectRoot, 'src/core/services/crashReporting.stub.ts');
  }

  return path.join(projectRoot, 'src/core/services/crashReporting.prod.ts');
}

function createSentryAwareResolveRequest(projectRoot, innerResolve) {
  return (context, moduleName, platform) => {
    if (shouldStubSentryModule(moduleName)) {
      return { type: 'sourceFile', filePath: SENTRY_STUB };
    }

    if (isDevMetroBundle() && moduleName.includes('crashReporting.prod')) {
      return { type: 'empty' };
    }

    const resolution = innerResolve(context, moduleName, platform);

    if (resolution?.type === 'sourceFile' && resolution.filePath) {
      const redirected = redirectCrashReportingFile(resolution.filePath, projectRoot);
      if (redirected !== resolution.filePath) {
        return { type: 'sourceFile', filePath: redirected };
      }
    }

    return resolution;
  };
}

function devSentryBlockList() {
  if (!isDevMetroBundle()) return [];
  return [
    /node_modules[/\\]@sentry[/\\]core[/\\]build[/\\]esm[/\\].*/,
    /node_modules[/\\]@sentry[/\\]react[/\\]build[/\\]esm[/\\].*/,
    /node_modules[/\\]@sentry[/\\]browser[/\\]build[/\\]npm[/\\]esm[/\\].*/,
    /[/\\]crashReporting\.prod\.(ts|tsx|js)$/,
  ];
}

module.exports = {
  isDevMetroBundle,
  createSentryAwareResolveRequest,
  devSentryBlockList,
  SENTRY_STUB,
};
