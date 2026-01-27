/**
 * config.js
 * Configurações centralizadas para o aplicativo Bitcoin Frame.
 */

(function (root) {
  const config = {
    REFRESH_INTERVAL: 5000, // ms
    DEFAULT_CURRENCY: 'brl'
  };

  if (typeof module === 'object' && module.exports) {
    module.exports = config;
  }

  if (root) {
    root.BTCViewConfig = config;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
