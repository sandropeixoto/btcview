(function (root, factory) {
  const utils = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = utils;
  }

  if (root) {
    root.BTCViewUtils = utils;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  /**
   * Formata uma porcentagem com sinal explícito quando positiva.
   * @param {number|null|undefined} value
   * @returns {string}
   */
  function formatPercentage(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '--';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

  /**
   * Determina a direção da variação de preço.
   * @param {number|null|undefined} current
   * @param {number|null|undefined} previous
   * @returns {'up'|'down'|'neutral'}
   */
  function getDirection(current, previous) {
    if (typeof current !== 'number' || Number.isNaN(current)) return 'neutral';
    if (typeof previous !== 'number' || Number.isNaN(previous)) return 'neutral';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  }

  /**
   * Determina a direção textual da mudança percentual.
   * @param {number|null|undefined} value
   * @returns {'up'|'down'|'neutral'}
   */
  function getChangeDirection(value) {
    if (typeof value !== 'number' || Number.isNaN(value) || value === 0) return 'neutral';
    return value > 0 ? 'up' : 'down';
  }

  return {
    formatPercentage,
    getDirection,
    getChangeDirection
  };
});
