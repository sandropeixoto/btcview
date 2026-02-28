(function (root) {
    const config = {
        REFRESH_INTERVAL: 5000, // 5 segundos
        DEFAULT_CURRENCY: 'brl',
        DEFAULT_COIN: 'bitcoin',
        AVAILABLE_CURRENCIES: ['brl', 'usd'],
        AVAILABLE_COINS: [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
            { id: 'solana', symbol: 'SOL', name: 'Solana' },
            { id: 'ripple', symbol: 'XRP', name: 'XRP' }
        ]
    };

    if (typeof module === 'object' && module.exports) {
        module.exports = config;
    }

    if (root) {
        root.BTCViewConfig = config;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this);