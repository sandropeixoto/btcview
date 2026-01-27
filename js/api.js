<<<<<<< HEAD
const BTCViewAPI = {
    async fetchPrice(coinId, currency) {
        try {
            // Busca preço e variação de 24h
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true`
            );
            if (!response.ok) throw new Error('Erro na API');
            const data = await response.json();
            
            return {
                price: data[coinId][currency],
                change: data[coinId][`${currency}_24h_change`]
            };
        } catch (error) {
            console.error("Erro na busca:", error);
            return null;
        }
    }
};
=======
/**
 * api.js
 * Camada de acesso à API pública do CoinGecko com pequeno cache local.
 */

(function (root, factory) {
  const api = factory(root);

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.BitcoinAPI = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
  const STORAGE_KEY = 'bitcoinFrame:lastQuote';

  const fetchImpl = root?.fetch ? root.fetch.bind(root) : null;
  const storage = root?.localStorage ?? null;

  function logWarning(message, error) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(message, error);
    }
  }

  /**
   * Monta a URL com os parâmetros necessários para buscar as cotações.
   * @param {string[]} currencies
   * @returns {string}
   */
  function buildUrl(currencies = ['usd', 'brl']) {
    const list = Array.isArray(currencies) && currencies.length > 0 ? currencies : ['usd', 'brl'];
    const params = new URLSearchParams({
      ids: 'bitcoin',
      vs_currencies: list.join(','),
      include_24hr_change: 'true'
    });
    return `${API_URL}?${params.toString()}`;
  }

  /**
   * Busca o último valor armazenado no localStorage.
   * @returns {object|null}
   */
  function getCachedQuote() {
    if (!storage) return null;
    try {
      const cached = storage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logWarning('[BitcoinAPI] Falha ao ler cache local:', error);
      return null;
    }
  }

  /**
   * Salva a cotação para consultas futuras offline.
   * @param {object} quote
   */
  function cacheQuote(quote) {
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch (error) {
      logWarning('[BitcoinAPI] Falha ao salvar cache local:', error);
    }
  }

  function toNumberOrNull(value) {
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    const parsed = typeof value === 'string' ? Number(value) : NaN;
    return Number.isNaN(parsed) ? null : parsed;
  }

  /**
   * Normaliza o payload recebido da API do CoinGecko.
   * @param {object} data
   * @param {number} [timestamp]
   * @returns {object}
   */
  function normalizePayload(data, timestamp = Date.now()) {
    const btc = data && typeof data === 'object' ? data.bitcoin ?? {} : {};
    const safeTimestamp = typeof timestamp === 'number' && !Number.isNaN(timestamp) ? timestamp : Date.now();

    return {
      timestamp: safeTimestamp,
      prices: {
        brl: toNumberOrNull(btc.brl),
        usd: toNumberOrNull(btc.usd)
      },
      change24h: {
        brl: toNumberOrNull(btc.brl_24h_change),
        usd: toNumberOrNull(btc.usd_24h_change)
      }
    };
  }

  /**
   * Faz a requisição à API do CoinGecko e retorna os dados normalizados.
   * @param {object} [options]
   * @param {string[]} [options.currencies]
   * @returns {Promise<object>}
   */
  async function fetchQuote({ currencies } = {}) {
    if (!fetchImpl) {
      throw new Error('[BitcoinAPI] fetch não está disponível no ambiente atual');
    }

    const response = await fetchImpl(buildUrl(currencies), {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Erro na API (${response.status})`);
    }

    const payload = await response.json();
    const quote = normalizePayload(payload);
    cacheQuote(quote);
    return quote;
  }

  return {
    fetchQuote,
    getCachedQuote,
    cacheQuote,
    normalizePayload,
    buildUrl,
    STORAGE_KEY
  };
});
>>>>>>> parent of 178d4ac (feat: add support for multiple cryptocurrencies and improve UI controls)
