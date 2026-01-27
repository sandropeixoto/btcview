document.addEventListener('DOMContentLoaded', () => {
    const config = window.BTCViewConfig;
    let currentCoin = config.DEFAULT_COIN;
    let currentCurrency = config.DEFAULT_CURRENCY;

    const coinSelect = document.getElementById('coin-select');
    const priceDisplay = document.getElementById('btc-price');
    const changeDisplay = document.getElementById('btc-change');
    const timestampDisplay = document.getElementById('last-update');
    const coinLabel = document.getElementById('coin-label');
    const currencyLabel = document.getElementById('btc-currency');

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

    async function updateDashboard() {
        const data = await BTCViewAPI.fetchPrice(currentCoin, currentCurrency);
        
        if (data) {
            const oldPrice = parseFloat(priceDisplay.dataset.value) || 0;
            
            // Feedback Visual de subida/descida
            priceDisplay.classList.remove('price-up', 'price-down');
            if (data.price > oldPrice && oldPrice !== 0) priceDisplay.classList.add('price-up');
            else if (data.price < oldPrice && oldPrice !== 0) priceDisplay.classList.add('price-down');

<<<<<<< HEAD
            priceDisplay.dataset.value = data.price;
            priceDisplay.innerText = data.price.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            coinLabel.innerText = config.AVAILABLE_COINS.find(c => c.id === currentCoin).symbol;
            currencyLabel.innerText = currentCurrency.toUpperCase();
            
            changeDisplay.innerText = `${data.change > 0 ? '+' : ''}${data.change.toFixed(2)}%`;
            changeDisplay.style.color = data.change >= 0 ? '#00ff88' : '#ff4d4d';
            
            timestampDisplay.innerText = new Date().toLocaleTimeString();
        }
    }

    // Event Listeners
    coinSelect.addEventListener('change', (e) => {
        currentCoin = e.target.value;
        updateDashboard();
    });

    document.querySelectorAll('.pill').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.pill.is-active').classList.remove('is-active');
            btn.classList.add('is-active');
            currentCurrency = btn.dataset.currency;
            updateDashboard();
        });
    });

    // Fullscreen no clique
    document.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    });

    // Início
    updateDashboard();
    setInterval(updateDashboard, config.REFRESH_INTERVAL);
=======
  // Expõe funções para testes
  return {
    _state: state,
    _elements: elements,
    _currencyFormatter: currencyFormatter,
    renderQuote,
    fetchAndRender,
    init
  };
>>>>>>> parent of 178d4ac (feat: add support for multiple cryptocurrencies and improve UI controls)
});

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    });
}