document.addEventListener('DOMContentLoaded', () => {
    // Verifica se as dependências foram carregadas
    if (!window.BTCViewConfig || !window.BTCViewAPI) {
        console.error("Config ou API não carregaram corretamente.");
        return;
    }

    const config = window.BTCViewConfig;
    const api = window.BTCViewAPI;
    
    let currentCoin = config.DEFAULT_COIN;
    let currentCurrency = config.DEFAULT_CURRENCY;

    // Elementos do DOM
    const coinSelect = document.getElementById('coin-select');
    const priceDisplay = document.getElementById('btc-price');
    const changeDisplay = document.getElementById('btc-change');
    const timestampDisplay = document.getElementById('last-update');
    const coinLabel = document.getElementById('coin-label');
    const currencyLabel = document.getElementById('btc-currency');
    const currencyButtons = document.querySelectorAll('.pill');

    // 1. Preencher o Select de Moedas
    config.AVAILABLE_COINS.forEach(coin => {
        const option = document.createElement('option');
        option.value = coin.id;
        option.textContent = coin.name;
        if (coin.id === currentCoin) option.selected = true;
        coinSelect.appendChild(option);
    });

    // 2. Função de Atualização
    async function updateDashboard() {
        const data = await api.fetchPrice(currentCoin, currentCurrency);
        
        if (data) {
            const oldPrice = parseFloat(priceDisplay.dataset.value) || 0;
            
            // Efeito visual (Verde/Vermelho)
            priceDisplay.classList.remove('price-up', 'price-down');
            if (data.price > oldPrice && oldPrice !== 0) {
                priceDisplay.classList.add('price-up');
            } else if (data.price < oldPrice && oldPrice !== 0) {
                priceDisplay.classList.add('price-down');
            }

            // Atualiza Textos
            priceDisplay.dataset.value = data.price;
            priceDisplay.innerText = data.price.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const coinObj = config.AVAILABLE_COINS.find(c => c.id === currentCoin);
            coinLabel.innerText = coinObj ? coinObj.symbol : '---';
            currencyLabel.innerText = currentCurrency.toUpperCase();
            
            // Atualiza Porcentagem
            const changeVal = data.change || 0;
            changeDisplay.innerText = `${changeVal > 0 ? '+' : ''}${changeVal.toFixed(2)}%`;
            changeDisplay.style.color = changeVal >= 0 ? '#00ff88' : '#ff4d4d';
            
            // Atualiza Hora
            timestampDisplay.innerText = new Date().toLocaleTimeString();
        } else {
            console.log("Tentando reconectar...");
        }
    }

    // 3. Event Listeners (Cliques e Trocas)
    
    // Troca de Moeda (Dropdown)
    coinSelect.addEventListener('change', (e) => {
        currentCoin = e.target.value;
        priceDisplay.innerText = "..."; // Feedback visual de carregamento
        updateDashboard();
    });

    // Troca de Moeda (BRL/USD)
    currencyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.pill.is-active').classList.remove('is-active');
            btn.classList.add('is-active');
            currentCurrency = btn.dataset.currency;
            priceDisplay.innerText = "..."; 
            updateDashboard();
        });
    });

    // Fullscreen ao clicar na tela
    document.addEventListener('click', () => {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                // Ignora erro se o usuário negar ou navegador não suportar
            });
        }
    });

    // 4. Iniciar Loop
    updateDashboard();
    setInterval(updateDashboard, config.REFRESH_INTERVAL);
});

// Registro do Service Worker (Se existir o arquivo sw.js)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW falhou:', err));
    });
}