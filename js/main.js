/**
 * main.js
 * Inicialização do Bitcoin Frame e orquestração da atualização das cotações.
 */

(function () {
  const REFRESH_INTERVAL = 5000; // ms
  const DEFAULT_CURRENCY = 'brl';

  const elements = {
    price: document.getElementById('btc-price'),
    change: document.getElementById('btc-change'),
    currency: document.getElementById('btc-currency'),
    clock: document.getElementById('last-update'),
    statusText: document.querySelector('.frame__status-text')
  };

  const state = {
    currency: DEFAULT_CURRENCY,
    previousPrice: null,
    lastQuote: null
  };

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: state.currency.toUpperCase(),
    maximumFractionDigits: 2
  });

  /**
   * Atualiza o relógio com o horário local.
   */
  function updateClock() {
    if (!elements.clock) return;
    const now = new Date();
    elements.clock.textContent = now.toLocaleTimeString('pt-BR', {
      hour12: false
    });
  }

  /**
   * Formata a porcentagem com uma casa decimal.
   * @param {number|null} value
   * @returns {string}
   */
  function formatPercentage(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '--';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

  /**
   * Determina direção de movimento do preço.
   * @param {number} current
   * @param {number|null} previous
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
   * Atualiza o layout com a cotação fornecida.
   * @param {object} quote
   * @param {object} options
   */
  function renderQuote(quote, options = {}) {
    const { fromCache = false } = options;
    if (!quote) return;

    const price = quote.prices?.[state.currency] ?? null;
    const change = quote.change24h?.[state.currency] ?? null;

    const direction = getDirection(price, state.previousPrice);

    if (typeof price === 'number') {
      elements.price.textContent = currencyFormatter.format(price);
      elements.price.dataset.value = price;
      Effects.applyPriceEffect(elements.price, direction);
      state.previousPrice = price;
    }

    if (typeof change === 'number') {
      elements.change.textContent = formatPercentage(change);
      const changeDirection = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
      Effects.applyChangeBadge(elements.change, changeDirection);
    } else {
      elements.change.textContent = '--';
      Effects.applyChangeBadge(elements.change, 'neutral');
    }

    elements.currency.textContent = state.currency.toUpperCase();

    if (elements.statusText) {
      elements.statusText.textContent = fromCache
        ? 'Exibindo último valor salvo'
        : 'Atualizado em tempo real';
    }

    state.lastQuote = quote;
  }

  /**
   * Tenta buscar a cotação mais recente da API e renderiza na tela.
   */
  async function fetchAndRender() {
    try {
      const quote = await BitcoinAPI.fetchQuote();
      renderQuote(quote);
    } catch (error) {
      console.error('[main] Falha ao atualizar cotação:', error);
      const fallback = BitcoinAPI.getCachedQuote();
      if (fallback) {
        renderQuote(fallback, { fromCache: true });
      }
    }
  }

  /**
   * Inicializa o aplicativo carregando cache e agendando atualizações.
   */
  function init() {
    // Exibe imediatamente qualquer valor salvo no cache.
    const cached = BitcoinAPI.getCachedQuote();
    if (cached) {
      renderQuote(cached, { fromCache: true });
    }

    // Atualiza relógio constantemente.
    updateClock();
    setInterval(updateClock, 1000);

    // Busca cotação inicial e agenda atualizações periódicas.
    fetchAndRender();
    setInterval(fetchAndRender, REFRESH_INTERVAL);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      fetchAndRender();
    }
  });

  window.addEventListener('load', init);
})();
