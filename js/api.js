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
  const DEFAULT_COIN_ID = 'bitcoin';
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
   * Aceita assinatura antiga (apenas lista de moedas) ou objeto de opções.
   * @param {object|string[]} [input]
   * @param {string[]} [input.currencies]
   * @param {string} [input.coinId]
   * @returns {string}
   */
  function buildUrl(input = {}) {
    const options = Array.isArray(input) ? { currencies: input } : input || {};
    const list = Array.isArray(options.currencies) && options.currencies.length > 0 ? options.currencies : ['usd', 'brl'];
    const coinId =
      typeof options.coinId === 'string' && options.coinId.trim()
        ? options.coinId.trim().toLowerCase()
        : DEFAULT_COIN_ID;
    const params = new URLSearchParams({
      ids: coinId,
      vs_currencies: list.join(','),
      include_24hr_change: 'true'
    });
    return `${API_URL}?${params.toString()}`;
  }

  /**
   * Busca o último valor armazenado no localStorage.
   * @returns {object|null}
   */
  function getCachedQuote(coinId = DEFAULT_COIN_ID) {
    if (!storage) return null;
    try {
      const key = `${STORAGE_KEY}:${coinId}`;
      const cached = storage.getItem(key);
      if (cached) return JSON.parse(cached);

      // Compatibilidade retroativa com cache antigo (sem coinId no nome da chave).
      const legacy = storage.getItem(STORAGE_KEY);
      return legacy ? JSON.parse(legacy) : null;
    } catch (error) {
      logWarning('[BitcoinAPI] Falha ao ler cache local:', error);
      return null;
    }
  }

  /**
   * Salva a cotação para consultas futuras offline.
   * @param {object} quote
   * @param {string} [coinId]
   */
  function cacheQuote(quote, coinId = DEFAULT_COIN_ID) {
    if (!storage) return;
    const targetCoin = quote?.coinId || coinId || DEFAULT_COIN_ID;
    try {
      storage.setItem(`${STORAGE_KEY}:${targetCoin}`, JSON.stringify(quote));
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
   * @param {object} [options]
   * @param {number} [options.timestamp]
   * @param {string} [options.coinId]
   * @param {string[]} [options.currencies]
   * @returns {object}
   */
  function normalizePayload(data, options = {}) {
    const {
      timestamp = Date.now(),
      coinId = DEFAULT_COIN_ID,
      currencies = ['usd', 'brl']
    } = options;

    const safeTimestamp = typeof timestamp === 'number' && !Number.isNaN(timestamp) ? timestamp : Date.now();

    const normalizedCoinId =
      typeof coinId === 'string' && coinId.trim() ? coinId.trim().toLowerCase() : DEFAULT_COIN_ID;
    const source = data && typeof data === 'object' ? data : {};
    const coinKey = source[normalizedCoinId]
      ? normalizedCoinId
      : Object.keys(source).length > 0
        ? Object.keys(source)[0]
        : normalizedCoinId;
    const coinData = source[coinKey] ?? {};

    const list = Array.isArray(currencies) && currencies.length > 0 ? currencies : ['usd', 'brl'];
    const prices = {};
    const change24h = {};

    list.forEach(code => {
      const key = typeof code === 'string' ? code.toLowerCase() : '';
      if (!key) return;
      prices[key] = toNumberOrNull(coinData[key]);
      change24h[key] = toNumberOrNull(coinData[`${key}_24h_change`]);
    });

    return {
      coinId: coinKey,
      timestamp: safeTimestamp,
      prices,
      change24h
    };
  }

  /**
   * Faz a requisição à API do CoinGecko e retorna os dados normalizados.
   * @param {object} [options]
   * @param {string[]} [options.currencies]
   * @param {string} [options.coinId]
   * @returns {Promise<object>}
   */
  async function fetchQuote({ currencies, coinId } = {}) {
    if (!fetchImpl) {
      throw new Error('[BitcoinAPI] fetch não está disponível no ambiente atual');
    }

    const list = Array.isArray(currencies) && currencies.length > 0 ? currencies : ['usd', 'brl'];
    const response = await fetchImpl(buildUrl({ currencies: list, coinId }), {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Erro na API (${response.status})`);
    }

    const payload = await response.json();
    const quote = normalizePayload(payload, { currencies: list, coinId });
    cacheQuote(quote, coinId);
    return quote;
  }

  return {
    fetchQuote,
    getCachedQuote,
    cacheQuote,
    normalizePayload,
    buildUrl,
    STORAGE_KEY,
    DEFAULT_COIN_ID
  };
});
