/**
 * main.js
 * Inicialização do Bitcoin Frame e orquestração da atualização das cotações.
 */

(function (root, factory) {
  const app = factory(root);

<<<<<<< HEAD
<<<<<<< HEAD
    // Popular Select
    config.AVAILABLE_COINS.forEach(coin => {
        const option = document.createElement('option');
        option.value = coin.id;
        option.textContent = coin.name;
        coinSelect.appendChild(option);
=======
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
>>>>>>> parent of 178d4ac (feat: add support for multiple cryptocurrencies and improve UI controls)
    });
=======
  if (typeof module === 'object' && module.exports) {
    module.exports = app;
  }
>>>>>>> parent of 601c75e (refatorando)

  if (root) {
    root.BTCViewApp = app;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  const config = (root && root.BTCViewConfig) || {
    REFRESH_INTERVAL: 5000,
    DEFAULT_CURRENCY: 'brl',
    DEFAULT_COIN: 'bitcoin',
    AVAILABLE_CURRENCIES: ['brl', 'usd'],
    AVAILABLE_COINS: [{ id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' }]
  };
  const { formatPercentage, getDirection, getChangeDirection } =
    (root && root.BTCViewUtils) || {};
  const BitcoinAPI = (root && root.BitcoinAPI) || {};
  const Effects = (root && root.Effects) || {};
  const storage = root?.localStorage ?? null;

<<<<<<< HEAD
<<<<<<< HEAD
            priceDisplay.dataset.value = data.price;
            priceDisplay.innerText = data.price.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
=======
  const availableCurrencies =
    Array.isArray(config.AVAILABLE_CURRENCIES) && config.AVAILABLE_CURRENCIES.length > 0
      ? config.AVAILABLE_CURRENCIES.map(c => c.toLowerCase())
      : ['brl', 'usd'];
>>>>>>> parent of 601c75e (refatorando)

  const availableCoins =
    Array.isArray(config.AVAILABLE_COINS) && config.AVAILABLE_COINS.length > 0
      ? config.AVAILABLE_COINS.map(coin => ({
          id: coin.id.toLowerCase(),
          symbol: coin.symbol,
          name: coin.name
        }))
      : [{ id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' }];

  const PREF_KEY = 'btcview:preferences';

  const elements =
    typeof document !== 'undefined'
      ? {
          coinLabel: document.getElementById('coin-label'),
          price: document.getElementById('btc-price'),
          change: document.getElementById('btc-change'),
          currency: document.getElementById('btc-currency'),
          clock: document.getElementById('last-update'),
          statusText: document.querySelector('.frame__status-text'),
          coinSelect: document.getElementById('coin-select'),
          currencyButtons: document.querySelectorAll('[data-currency]')
        }
      : {};

  function logWarning(message, error) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(message, error);
    }
  }

  function normalizeCurrency(value) {
    const val = typeof value === 'string' ? value.toLowerCase() : '';
    return availableCurrencies.includes(val) ? val : null;
  }

  function normalizeCoin(value) {
    const val = typeof value === 'string' ? value.toLowerCase() : '';
    return availableCoins.find(coin => coin.id === val)?.id ?? null;
  }

  function loadPreferences() {
    if (!storage) return {};
    try {
      const saved = storage.getItem(PREF_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      logWarning('[main] Falha ao ler preferências:', error);
      return {};
    }
  }

  function persistPreferences() {
    if (!storage) return;
    try {
      storage.setItem(
        PREF_KEY,
        JSON.stringify({
          currency: state.currency,
          coinId: state.coinId
        })
      );
    } catch (error) {
      logWarning('[main] Falha ao salvar preferências:', error);
    }
  }

  function createCurrencyFormatter(currency) {
    const safeCurrency = currency ? currency.toUpperCase() : 'USD';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 2
    });
  }

  function findCoinMeta(coinId) {
    const normalized = (coinId || '').toLowerCase();
    return availableCoins.find(coin => coin.id === normalized) || { id: normalized };
  }

  const savedPrefs = loadPreferences();
  const state = {
    currency:
      normalizeCurrency(savedPrefs.currency) ||
      normalizeCurrency(config.DEFAULT_CURRENCY) ||
      availableCurrencies[0],
    coinId: normalizeCoin(savedPrefs.coinId) || normalizeCoin(config.DEFAULT_COIN) || availableCoins[0].id,
    previousPrice: null,
    lastQuote: null
  };

  let currencyFormatter = createCurrencyFormatter(state.currency);

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
    const coinId = quote.coinId || state.coinId;

    const direction = getDirection(price, state.previousPrice);

    if (typeof price === 'number') {
      elements.price.textContent = currencyFormatter.format(price);
      elements.price.dataset.value = price;
      Effects.applyPriceEffect(elements.price, direction);
      state.previousPrice = price;
    } else if (elements.price) {
      elements.price.textContent = '--';
      elements.price.dataset.value = '';
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
    if (elements.coinLabel) {
      const coinMeta = findCoinMeta(coinId);
      elements.coinLabel.textContent =
        coinMeta.symbol || coinMeta.name || (coinId ? coinId.toUpperCase() : '--');
    }

    if (elements.statusText) {
      elements.statusText.textContent = fromCache
        ? 'Exibindo último valor salvo'
        : 'Atualizado em tempo real';
    }

    state.lastQuote = { ...quote, coinId };
  }

  /**
   * Tenta buscar a cotação mais recente da API e renderiza na tela.
   */
  async function fetchAndRender() {
    try {
      const quote = await BitcoinAPI.fetchQuote({
        currencies: availableCurrencies,
        coinId: state.coinId
      });
      renderQuote(quote);
    } catch (error) {
      console.error('[main] Falha ao atualizar cotação:', error);
      const fallback = BitcoinAPI.getCachedQuote(state.coinId);
      if (fallback) {
        renderQuote(fallback, { fromCache: true });
      } else if (elements.statusText) {
        elements.statusText.textContent = 'Falha ao carregar dados';
      }
    }
  }

  function syncControls() {
    if (elements.coinSelect) {
      elements.coinSelect.value = state.coinId;
    }

    if (elements.currencyButtons && elements.currencyButtons.length > 0) {
      elements.currencyButtons.forEach(button => {
        const code = button.dataset.currency?.toLowerCase();
        const isActive = code === state.currency;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    if (elements.currency) {
      elements.currency.textContent = state.currency.toUpperCase();
    }
  }

  function populateControls() {
    if (elements.coinSelect && elements.coinSelect.options.length === 0) {
      availableCoins.forEach(coin => {
        const option = document.createElement('option');
        option.value = coin.id;
        option.textContent = `${coin.symbol || coin.name || coin.id.toUpperCase()}`;
        elements.coinSelect.appendChild(option);
      });
    }

    syncControls();
  }

  async function setCoin(coinId) {
    const normalized = normalizeCoin(coinId);
    if (!normalized || normalized === state.coinId) return;
    state.coinId = normalized;
    state.previousPrice = null;
    persistPreferences();
    syncControls();
    await fetchAndRender();
  }

  function setCurrency(currency) {
    const normalized = normalizeCurrency(currency);
    if (!normalized || normalized === state.currency) return;
    state.currency = normalized;
    currencyFormatter = createCurrencyFormatter(state.currency);
    persistPreferences();
    syncControls();
    if (state.lastQuote) {
      renderQuote(state.lastQuote, { fromCache: true });
    }
  }

  function setupControlEvents() {
    if (elements.coinSelect) {
      elements.coinSelect.addEventListener('change', event => {
        setCoin(event.target.value);
      });
    }

    if (elements.currencyButtons && elements.currencyButtons.length > 0) {
      elements.currencyButtons.forEach(button => {
        button.addEventListener('click', () => {
          setCurrency(button.dataset.currency);
        });
      });
    }
  }

  /**
   * Inicializa o aplicativo carregando cache e agendando atualizações.
   */
  function init() {
    // Exibe imediatamente qualquer valor salvo no cache.
    const cached = BitcoinAPI.getCachedQuote(state.coinId);
    if (cached) {
      renderQuote(cached, { fromCache: true });
    }

<<<<<<< HEAD
    // Início
    updateDashboard();
    setInterval(updateDashboard, config.REFRESH_INTERVAL);
=======
=======
    populateControls();
    setupControlEvents();

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

>>>>>>> parent of 601c75e (refatorando)
  // Expõe funções para testes
  return {
    _state: state,
    _elements: elements,
<<<<<<< HEAD
    _currencyFormatter: currencyFormatter,
=======
    get _currencyFormatter() {
      return currencyFormatter;
    },
    setCurrency,
    setCoin,
    populateControls,
    syncControls,
>>>>>>> parent of 601c75e (refatorando)
    renderQuote,
    fetchAndRender,
    init
  };
<<<<<<< HEAD
>>>>>>> parent of 178d4ac (feat: add support for multiple cryptocurrencies and improve UI controls)
=======
>>>>>>> parent of 601c75e (refatorando)
});
