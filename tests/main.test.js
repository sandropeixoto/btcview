const assert = require('node:assert');
const { describe, it, beforeEach, afterEach, mock } = require('node:test');
const { JSDOM } = require('jsdom');
const path = require('node:path');
const fs = require('node:fs');

// Garante que o Intl completo esteja disponível para o JSDOM
require('full-icu');

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
          <p id="btc-price"></p>
          <span id="btc-change"></span>
          <p id="btc-currency"></p>
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
  window.setInterval = mock.setInterval;
  window.setTimeout = mock.setTimeout;
  window.clearInterval = mock.clearInterval;
  window.clearTimeout = mock.clearTimeout;

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
    mock.timers.enable();
    window = setupDOM();
    app = window.BTCViewApp;
    elements = app._elements;

    elements.price.textContent = '';
    elements.change.textContent = '';
    elements.currency.textContent = '';
    elements.statusText.textContent = '';
  });

  afterEach(() => {
    mock.timers.reset();
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
    assert.strictEqual(elements.statusText.textContent, 'Exibindo último valor salvo');
  });

  it('deve lidar com dados ausentes', () => {
    const quote = {
      prices: {},
      change24h: {}
    };
    app.renderQuote(quote);
    assert.strictEqual(elements.price.textContent, '');
    assert.strictEqual(elements.change.textContent, '--');
    assert.strictEqual(elements.currency.textContent, 'BRL');
  });

  it('deve exibir mensagem de erro ao falhar sem cache', async () => {
    mock.method(window.BitcoinAPI, 'fetchQuote', () => Promise.reject(new Error('API offline')));
    mock.method(window.BitcoinAPI, 'getCachedQuote', () => null);

    await app.fetchAndRender();
    assert.strictEqual(elements.statusText.textContent, 'Falha ao carregar dados');
  });
});
