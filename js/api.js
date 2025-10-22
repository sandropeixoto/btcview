/**
 * api.js
 * Camada de acesso à API pública do CoinGecko com pequeno cache local.
 */

const BitcoinAPI = (() => {
  const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
  const STORAGE_KEY = 'bitcoinFrame:lastQuote';

  /**
   * Monta a URL com os parâmetros necessários para buscar as cotações.
   * @returns {string}
   */
  function buildUrl() {
    const params = new URLSearchParams({
      ids: 'bitcoin',
      vs_currencies: 'usd,brl',
      include_24hr_change: 'true'
    });
    return `${API_URL}?${params.toString()}`;
  }

  /**
   * Busca o último valor armazenado no localStorage.
   * @returns {object|null}
   */
  function getCachedQuote() {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('[BitcoinAPI] Falha ao ler cache local:', error);
      return null;
    }
  }

  /**
   * Salva a cotação para consultas futuras offline.
   * @param {object} quote
   */
  function cacheQuote(quote) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch (error) {
      console.warn('[BitcoinAPI] Falha ao salvar cache local:', error);
    }
  }

  /**
   * Normaliza o payload recebido da API do CoinGecko.
   * @param {object} data
   * @returns {object}
   */
  function normalizePayload(data) {
    const btc = data?.bitcoin ?? {};
    const now = Date.now();
    return {
      timestamp: now,
      prices: {
        brl: btc.brl ?? null,
        usd: btc.usd ?? null
      },
      change24h: {
        brl: btc.brl_24h_change ?? null,
        usd: btc.usd_24h_change ?? null
      }
    };
  }

  /**
   * Faz a requisição à API do CoinGecko e retorna os dados normalizados.
   * @returns {Promise<object>}
   */
  async function fetchQuote() {
    const response = await fetch(buildUrl(), {
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
    STORAGE_KEY
  };
})();

window.BitcoinAPI = BitcoinAPI;
