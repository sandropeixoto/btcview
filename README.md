# Bitcoin Frame (btcview)

Painel web *full-screen* minimalista projetado para transformar tablets, celulares ou monitores em porta-retratos digitais de criptomoedas. Focado em estética e prevenção de *burn-in* para telas OLED/AMOLED.

## 🚀 Funcionalidades

- **Multi-Ativos:** Monitoramento em tempo real de Bitcoin (BTC), Ethereum (ETH), Solana (SOL) e Ripple (XRP).
- **Conversão Dinâmica:** Alternância instantânea entre BRL (R$) e USD ($).
- **Modo Kiosk/Full-screen:** Oculta a interface do navegador e a barra de status com um clique na tela.
- **Proteção de Tela (Pixel Shift):** Sistema de movimentação imperceptível dos elementos a cada ciclo para evitar *burn-in* em telas permanentes.
- **PWA (Progressive Web App):** Instalável nativamente no Android e iOS, funcionando como um aplicativo independente.
- **Feedback Visual:** Cores dinâmicas (Verde/Vermelho) e efeitos de brilho indicando a direção da variação de preço.
- **API Gratuita:** Conexão direta com a API da CoinGecko (sem necessidade de chave de API).

## 📂 Estrutura do Projeto

- `index.html`: Estrutura semântica e ponto de entrada da aplicação.
- `manifest.json`: Metadados para instalação como aplicativo (ícones, cores, orientação).
- `sw.js`: Service Worker para cache de ativos e funcionamento offline/PWA.
- `css/`:
  - `style.css`: Estilização geral, animações de pixel shift e responsividade.
  - `theme-minimal.css`: Paleta de cores e tipografia (Orbitron/Roboto).
- `js/`:
  - `config.js`: Lista de moedas disponíveis e configurações globais.
  - `api.js`: Lógica de conexão e tratamento de erros da CoinGecko API.
  - `main.js`: Controle de DOM, eventos de UI e ciclo de atualização.
- `assets/`: Ícones e logos para o manifesto PWA.

## 🛠️ Como usar

### Online (Recomendado)
Acesse diretamente via GitHub Pages ou faça o deploy do repositório.
1. Abra no navegador do seu tablet/celular.
2. Adicione à tela de início (Instalar App).
3. Abra o app instalado e toque na tela para entrar em modo imersivo.

### Executando Localmente
1. Clone o repositório.
2. Como o projeto utiliza **Service Workers** e **Módulos ES6**, é necessário servir os arquivos via HTTP (não abra direto o arquivo file://).
   
   Com Python 3:
   ```bash
   python -m http.server 8000