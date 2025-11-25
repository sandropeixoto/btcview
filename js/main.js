/**
 * main.js
 * Inicialização do Bitcoin Frame e orquestração da atualização das cotações.
 */

(function (root, factory) {
  const app = factory(root);

  if (typeof module === 'object' && module.exports) {
    module.exports = app;
  }

  if (root) {
    root.BTCViewApp = app;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  const config = (root && root.BTCViewConfig) || {
    REFRESH_INTERVAL: 5000,
    DEFAULT_CURRENCY: 'brl'
  };
  const { formatPercentage, getDirection, getChangeDirection } =
    (root && root.BTCViewUtils) || {};
  const BitcoinAPI = (root && root.BitcoinAPI) || {};
  const Effects = (root && root.Effects) || {};

  const elements =
    typeof document !== 'undefined'
      ? {
          price: document.getElementById('btc-price'),
          change: document.getElementById('btc-change'),
          currency: document.getElementById('btc-currency'),
          clock: document.getElementById('last-update'),
          statusText: document.querySelector('.frame__status-text')
        }
      : {};

  const state = {
    currency: config.DEFAULT_CURRENCY,
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
      const changeDirection = getChangeDirection(change);
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
      } else if (elements.statusText) {
        elements.statusText.textContent = 'Falha ao carregar dados';
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
    setInterval(fetchAndRender, config.REFRESH_INTERVAL);
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchAndRender();
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('load', init);
  }

  // Expõe funções para testes
  return {
    _state: state,
    _elements: elements,
    _currencyFormatter: currencyFormatter,
    renderQuote,
    fetchAndRender,
    init
  };
});
