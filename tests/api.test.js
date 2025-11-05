const test = require('node:test');
const assert = require('node:assert/strict');

const BitcoinAPI = require('../js/api.js');

test('buildUrl monta parâmetros padrão corretamente', () => {
  const url = BitcoinAPI.buildUrl();
  assert.ok(url.startsWith('https://api.coingecko.com/api/v3/simple/price?'));
  assert.ok(url.includes('ids=bitcoin'));
  assert.ok(url.includes('vs_currencies=usd%2Cbrl') || url.includes('vs_currencies=usd,brl'));
  assert.ok(url.includes('include_24hr_change=true'));
});

test('buildUrl aceita lista personalizada de moedas', () => {
  const url = BitcoinAPI.buildUrl(['eur', 'brl']);
  assert.ok(url.includes('vs_currencies=eur%2Cbrl') || url.includes('vs_currencies=eur,brl'));
});

test('normalizePayload normaliza valores numéricos e converte strings', () => {
  const result = BitcoinAPI.normalizePayload(
    {
      bitcoin: {
        usd: '12345.67',
        brl: 98765.43,
        usd_24h_change: '3.21',
        brl_24h_change: -1.11
      }
    },
    1700000000000
  );

  assert.deepEqual(result, {
    timestamp: 1700000000000,
    prices: {
      usd: 12345.67,
      brl: 98765.43
    },
    change24h: {
      usd: 3.21,
      brl: -1.11
    }
  });
});

test('normalizePayload retorna null quando dados estão ausentes', () => {
  const result = BitcoinAPI.normalizePayload({});
  assert.equal(result.prices.brl, null);
  assert.equal(result.prices.usd, null);
  assert.equal(result.change24h.brl, null);
  assert.equal(result.change24h.usd, null);
});

test('normalizePayload garante timestamp numérico mesmo com entrada inválida', () => {
  const result = BitcoinAPI.normalizePayload({ bitcoin: {} }, 'invalid');
  assert.equal(typeof result.timestamp, 'number');
  assert.ok(!Number.isNaN(result.timestamp));
});
