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