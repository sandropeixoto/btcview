document.addEventListener('DOMContentLoaded', () => {
    // Verifica se as dependências foram carregadas
    if (!window.BTCViewConfig || !window.BTCViewAPI) {
        console.error("Dependências críticas (Config ou API) não carregaram.");
        return;
    }

    const config = window.BTCViewConfig;
    const api = window.BTCViewAPI;
    const utils = window.BTCViewUtils;
    const effects = window.Effects;
    
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

    /**
     * Atualiza o painel com novos dados da API.
     */
    async function updateDashboard() {
        try {
            const data = await api.fetchPrice(currentCoin, currentCurrency);
            
            if (data) {
                const oldPrice = parseFloat(priceDisplay.dataset.value) || 0;
                const direction = utils ? utils.getDirection(data.price, oldPrice) : 'neutral';
                
                // Feedback Visual de Preço (Fade + Cor)
                if (effects) {
                    effects.applyPriceEffect(priceDisplay, direction);
                } else {
                    priceDisplay.classList.remove('price-up', 'price-down');
                    if (direction === 'up') priceDisplay.classList.add('price-up');
                    else if (direction === 'down') priceDisplay.classList.add('price-down');
                }

                // Atualiza Valor Numérico
                priceDisplay.dataset.value = data.price;
                priceDisplay.innerText = data.price.toLocaleString(currentCurrency === 'brl' ? 'pt-BR' : 'en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                // Labels de Identificação
                const coinObj = config.AVAILABLE_COINS.find(c => c.id === currentCoin);
                coinLabel.innerText = coinObj ? coinObj.symbol : '---';
                currencyLabel.innerText = currentCurrency.toUpperCase();
                
                // Atualiza Variação 24h
                const changeVal = data.change || 0;
                const changeDir = utils ? utils.getChangeDirection(changeVal) : (changeVal >= 0 ? 'up' : 'down');
                
                changeDisplay.innerText = utils ? utils.formatPercentage(changeVal) : `${changeVal > 0 ? '+' : ''}${changeVal.toFixed(2)}%`;
                
                if (effects) {
                    effects.applyChangeBadge(changeDisplay, changeDir);
                } else {
                    changeDisplay.style.color = changeVal >= 0 ? '#00ff88' : '#ff4d4d';
                }
                
                // Timestamp
                timestampDisplay.innerText = new Date().toLocaleTimeString();
            }
        } catch (error) {
            console.error("Erro no ciclo de atualização:", error);
            timestampDisplay.innerText = "Erro de conexão";
        }
    }

    // 3. Event Listeners
    
    // Troca de Moeda Ativa
    coinSelect.addEventListener('change', (e) => {
        currentCoin = e.target.value;
        priceDisplay.innerText = "...";
        updateDashboard();
    });

    // Troca BRL/USD
    currencyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const activePill = document.querySelector('.pill.is-active');
            if (activePill) activePill.classList.remove('is-active');
            
            btn.classList.add('is-active');
            currentCurrency = btn.dataset.currency;
            priceDisplay.innerText = "..."; 
            updateDashboard();
        });
    });

    // Modo Imersivo (Fullscreen)
    document.addEventListener('click', (e) => {
        // Evita fullscreen ao clicar em controles
        if (e.target.closest('.frame__controls')) return;

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else if (document.exitFullscreen) {
            // Opcional: permitir sair do fullscreen clicando novamente
            // document.exitFullscreen();
        }
    });

    // 4. Ciclo Inicial
    updateDashboard();
    setInterval(updateDashboard, config.REFRESH_INTERVAL);
});

// Service Worker (Opcional - Verificação de existência resolvida no HTML)