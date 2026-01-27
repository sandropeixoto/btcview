const BTCViewAPI = {
    async fetchPrice(coinId, currency) {
        try {
            // URL da CoinGecko (Gratuita)
            const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_24hr_change=true`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro na resposta da API');
            
            const data = await response.json();
            
            if (!data[coinId]) throw new Error('Dados da moeda não encontrados');

            return {
                price: data[coinId][currency],
                change: data[coinId][`${currency}_24h_change`]
            };
        } catch (error) {
            console.error("Erro API:", error);
            return null;
        }
    }
};