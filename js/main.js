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

    // Popular Select
    config.AVAILABLE_COINS.forEach(coin => {
        const option = document.createElement('option');
        option.value = coin.id;
        option.textContent = coin.name;
        coinSelect.appendChild(option);
    });

    async function updateDashboard() {
        const data = await BTCViewAPI.fetchPrice(currentCoin, currentCurrency);
        
        if (data) {
            const oldPrice = parseFloat(priceDisplay.dataset.value) || 0;
            
            // Feedback Visual de subida/descida
            priceDisplay.classList.remove('price-up', 'price-down');
            if (data.price > oldPrice && oldPrice !== 0) priceDisplay.classList.add('price-up');
            else if (data.price < oldPrice && oldPrice !== 0) priceDisplay.classList.add('price-down');

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
});

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    });
}