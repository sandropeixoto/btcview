const assert = require('node:assert');
const { describe, it, beforeEach, afterEach, mock } = require('node:test');
const { JSDOM } = require('jsdom');
const path = require('node:path');
const fs = require('node:fs');

// Garante que o Intl completo esteja disponível para o JSDOM
require('full-icu');

const originalTimers = {
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout
};

const root = path.resolve(__dirname, '..');
const scripts = {
  utils: fs.readFileSync(path.join(root, 'js', 'utils', 'quote-utils.js'), 'utf8'),
  config: fs.readFileSync(path.join(root, 'js', 'config.js'), 'utf8'),
  api: fs.readFileSync(path.join(root, 'js', 'api.js'), 'utf8'),
  main: fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8')
};

function setupDOM() {
  const dom = new JSDOM(
    `<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div class="frame__controls">
            <select id="coin-select"></select>
            <div id="currency-toggle">
              <button data-currency="brl"></button>
              <button data-currency="usd"></button>
            </div>
          </div>
          <p id="btc-price"></p>
          <span id="btc-change"></span>
          <p id="btc-currency"></p>
          <p id="coin-label"></p>
          <span class="frame__status-text"></span>
        </body>
      </html>`,
    {
      runScripts: 'dangerously',
      url: 'http://localhost'
    }
  );

  const { window } = dom;
  const { document } = window;

  // Polyfill para Intl e injeta mocks de timers no JSDOM
  Object.defineProperty(window, 'Intl', { value: global.Intl });
  window.setInterval = () => 0;
  window.clearInterval = () => {};
  window.setTimeout = fn => {
    if (typeof fn === 'function') fn();
    return 0;
  };
  window.clearTimeout = () => {};
  window.fetch = () =>
    Promise.resolve({
      ok: true,
      json: async () => ({
        bitcoin: {
          usd: 0,
          brl: 0,
          usd_24h_change: 0,
          brl_24h_change: 0
        }
      })
    });
  global.setInterval = window.setInterval;
  global.setTimeout = window.setTimeout;
  global.clearInterval = window.clearInterval;
  global.clearTimeout = window.clearTimeout;

  // Injeta mocks e dependências
  window.Effects = {
    applyPriceEffect: () => {},
    applyChangeBadge: () => {}
  };

  const scriptOrder = ['utils', 'config', 'api', 'main'];
  scriptOrder.forEach(key => {
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scripts[key];
    document.head.appendChild(scriptEl);
  });

  return window;
}

describe('BTCViewApp', () => {
  let window, app, elements;

  beforeEach(() => {
    window = setupDOM();
    app = window.BTCViewApp;
    elements = app._elements;

    elements.price.textContent = '';
    elements.change.textContent = '';
    elements.currency.textContent = '';
    elements.statusText.textContent = '';
  });

  afterEach(() => {
    mock.restoreAll();
    global.setInterval = originalTimers.setInterval;
    global.setTimeout = originalTimers.setTimeout;
    global.clearInterval = originalTimers.clearInterval;
    global.clearTimeout = originalTimers.clearTimeout;
  });

  it('deve renderizar a cotação corretamente', () => {
    const quote = {
      prices: { brl: 250000 },
      change24h: { brl: 5.5 }
    };
    app.renderQuote(quote);
    assert.strictEqual(elements.price.textContent, 'R$ 250.000,00');
    assert.strictEqual(elements.change.textContent, '+5.50%');
    assert.strictEqual(elements.currency.textContent, 'BRL');
    assert.strictEqual(elements.coinLabel.textContent, 'BTC');
    assert.strictEqual(elements.statusText.textContent, 'Atualizado em tempo real');
  });

  it('deve renderizar a partir do cache corretamente', () => {
    const quote = {
      prices: { brl: 240000 },
      change24h: { brl: -2.3 }
    };
    app.renderQuote(quote, { fromCache: true });
    assert.strictEqual(elements.price.textContent, 'R$ 240.000,00');
    assert.strictEqual(elements.change.textContent, '-2.30%');
    assert.strictEqual(elements.currency.textContent, 'BRL');
    assert.strictEqual(elements.coinLabel.textContent, 'BTC');
    assert.strictEqual(elements.statusText.textContent, 'Exibindo último valor salvo');
  });

  it('deve lidar com dados ausentes', () => {
    const quote = {
      prices: {},
      change24h: {}
    };
    app.renderQuote(quote);
    assert.strictEqual(elements.price.textContent, '--');
    assert.strictEqual(elements.change.textContent, '--');
    assert.strictEqual(elements.currency.textContent, 'BRL');
    assert.strictEqual(elements.coinLabel.textContent, 'BTC');
  });

  it('deve exibir mensagem de erro ao falhar sem cache', async () => {
    mock.method(window.BitcoinAPI, 'fetchQuote', () => Promise.reject(new Error('API offline')));
    mock.method(window.BitcoinAPI, 'getCachedQuote', () => null);

    await app.fetchAndRender();
    assert.strictEqual(elements.statusText.textContent, 'Falha ao carregar dados');
  });

  it('deve trocar a moeda e reaplicar formatação em memória', () => {
    const quote = {
      prices: { brl: 200000, usd: 40000 },
      change24h: { brl: 1, usd: 1 }
    };
    app.renderQuote(quote);
    app.setCurrency('usd');
    assert.strictEqual(elements.price.textContent, 'US$ 40.000,00');
    assert.strictEqual(elements.currency.textContent, 'USD');
  });

  it('deve trocar de ativo e atualizar a UI', async () => {
    mock.method(window.BitcoinAPI, 'fetchQuote', () =>
      Promise.resolve({
        coinId: 'ethereum',
        prices: { brl: 10000, usd: 2000 },
        change24h: { brl: 0.5, usd: 0.5 }
      })
    );

    await app.setCoin('ethereum');
    assert.strictEqual(elements.coinLabel.textContent, 'ETH');
    assert.strictEqual(elements.price.textContent, 'R$ 10.000,00');
  });
});
