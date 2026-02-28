# Documentação Técnica - Bitcoin Frame

O **Bitcoin Frame** é um painel de monitoramento de criptomoedas construído com HTML, CSS e JavaScript puro (Vanilla JS). Esta documentação detalha a arquitetura do projeto e como estendê-lo.

---

## 1. Arquitetura de Scripts

O projeto segue uma abordagem modular para facilitar a manutenção e escalabilidade. Os scripts são carregados no `index.html` na seguinte ordem de dependência:

1.  **`js/config.js`**: Define constantes globais e configurações de moedas.
2.  **`js/utils/quote-utils.js`**: Fornece funções puras de lógica matemática e formatação.
3.  **`js/effects.js`**: Gerencia feedbacks visuais (animações e cores) e sonoros.
4.  **`js/api.js`**: Abstrai as requisições para a API externa (CoinGecko).
5.  **`js/main.js`**: O ponto de entrada que inicializa a aplicação e o loop de atualização.

---

## 2. Configurações (`config.js`)

Para alterar o comportamento global, edite o arquivo `js/config.js`:

| Parâmetro            | Descrição                                                                 | Padrão      |
| -------------------- | ------------------------------------------------------------------------- | ----------- |
| `REFRESH_INTERVAL`   | Tempo em milissegundos entre as atualizações (mínimo recomendado: 5000ms). | `5000`      |
| `DEFAULT_CURRENCY`   | Moeda de conversão inicial (`brl` ou `usd`).                              | `'brl'`     |
| `DEFAULT_COIN`       | ID da moeda inicial na API da CoinGecko.                                  | `'bitcoin'` |
| `AVAILABLE_COINS`    | Lista de moedas que aparecerão no seletor do cabeçalho.                    | `[...]`     |

### Adicionando uma nova moeda:
Para adicionar uma nova moeda, insira um novo objeto no array `AVAILABLE_COINS`:
```javascript
{ id: 'cardano', symbol: 'ADA', name: 'Cardano' }
```
*O `id` deve corresponder ao ID oficial da moeda na [CoinGecko API](https://www.coingecko.com/en/api/documentation).*

---

## 3. Estilização e Temas

O projeto utiliza variáveis CSS para facilitar a customização de cores e fontes.

### `css/style.css`
Contém o layout base (Flexbox) e a lógica de responsividade. O principal mecanismo de proteção de tela é a animação `pixelShift`, que move o container principal suavemente em frações de pixel para evitar a retenção de imagem (burn-in).

### `css/theme-minimal.css`
Contém a paleta de cores. Se desejar criar um novo tema, você pode adicionar uma nova classe ao `body` e sobrescrever as variáveis `:root`.

---

## 4. Progressive Web App (PWA)

O suporte PWA é garantido pelo `manifest.json` e pelo `sw.js` (Service Worker).

### Estratégia de Cache
O Service Worker utiliza uma estratégia **Network First**. Ele tenta buscar os arquivos estáticos e os dados da API na rede primeiro. Se não houver conexão, ele serve os arquivos estáticos (HTML, CSS, JS) do cache, permitindo que o app abra offline, embora os preços não sejam atualizados sem internet.

---

## 5. Solução de Problemas (Troubleshooting)

### A API não está carregando os preços
- Verifique sua conexão com a internet.
- A CoinGecko possui limites de requisições por minuto na API gratuita. Se você atualizar muito rápido, pode receber um erro `429 (Too Many Requests)`. O app tentará reconectar no próximo ciclo.

### O modo Fullscreen não funciona
- O modo tela cheia requer uma interação do usuário (clique) por questões de segurança dos navegadores. Toque em qualquer área vazia do painel para ativar.
- Alguns dispositivos móveis (especialmente iOS) possuem restrições mais severas sobre o modo `requestFullscreen`. Nestes casos, o PWA instalado funcionará melhor.

---

## 6. Contribuição e Extensão

Sinta-se à vontade para clonar e modificar este projeto. Sugestões de melhorias:
- Adicionar gráficos de linha simples (*sparklines*).
- Implementar alertas sonoros para grandes variações.
- Criar novos temas (ex: Dark Neon, Paper, Matrix).
