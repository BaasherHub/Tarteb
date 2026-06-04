/**
 * Metro dev shim — satisfies @sentry/* imports without loading ESM internals.
 * Production EAS builds resolve real @sentry packages (see metro.config.js).
 */
function noop() {}

const scope = { setExtra: noop, setTag: noop, setUser: noop };

module.exports = {
  init: noop,
  wrap: (component) => component,
  captureException: noop,
  captureMessage: noop,
  withScope: (callback) => callback(scope),
  addBreadcrumb: noop,
  setContext: noop,
  setExtra: noop,
  setTag: noop,
  setUser: noop,
  close: noop,
  flush: () => Promise.resolve(true),
  nativeCrash: noop,
};
