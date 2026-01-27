# btcview

Aplicativo web responsivo pensado para porta-retratos digitais que exibe a cotação do Bitcoin em tempo real, com fallback para o último valor cacheado quando a conexão falha.

## Funcionalidades
- Consulta a API pública do CoinGecko e normaliza os dados para BRL e USD.
- Atualização automática a cada 5 s e atualização imediata ao voltar ao foco (`visibilitychange`).
- Exibição de variação percentual em 24 h com formatação consistente e indicação visual (cores, animação e áudio opcional).
- Cache local (`localStorage`) das últimas cotações para uso offline ou em caso de erro na API.
- Relógio local sempre em sincronia para indicar o horário da última atualização.

## Estrutura
- `index.html`: layout principal e inclusão dos módulos JS.
- `css/`: temas e estilos do visor.
- `js/api.js`: camada de integração com o CoinGecko, preparada para testes e reutilização.
- `js/main.js`: orquestração da UI (renderização, timers e gerenciamento de estado).
- `js/utils/quote-utils.js`: utilidades puras para formatação e classificação da variação.
- `js/effects.js`: efeitos visuais/sonoros aplicados aos elementos da UI.
- `tests/`: suíte automatizada baseada em `node:test`.

## Executando localmente
1. Abra `index.html` em um navegador moderno. Não é necessário servidor, mas recomenda-se servir os arquivos (ex.: `python -m http.server`) para evitar políticas de CORS em ambientes restritos.
2. Verifique o console do navegador para acompanhar logs de erros da API ou do cache.

## Testes automatizados
Requer Node.js ≥ 20.

```bash
node --test
```

Os testes cobrem:
- Normalização do payload do CoinGecko (`js/api.js`).
- Regras de formatação e direção de mudança (`js/utils/quote-utils.js`).
