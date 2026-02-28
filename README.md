# Bitcoin Frame (btcview)

Painel web *full-screen* minimalista projetado para transformar tablets, celulares ou monitores em porta-retratos digitais de criptomoedas. Focado em estética e prevenção de *burn-in* para telas OLED/AMOLED.

![Versão 1.2](https://img.shields.io/badge/Vers%C3%A3o-1.2-orange)
![PWA Ready](https://img.shields.io/badge/PWA-Pronto-green)
![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue)

## 🚀 Funcionalidades

- **Multi-Ativos:** Monitoramento em tempo real de Bitcoin (BTC), Ethereum (ETH), Solana (SOL) e Ripple (XRP).
- **Conversão Dinâmica:** Alternância instantânea entre BRL (R$) e USD ($) com formatação regional.
- **Modo Kiosk/Full-screen:** Interface imersiva que oculta a barra de status do navegador com um toque.
- **Proteção de Tela (Pixel Shift):** Micro-movimentação imperceptível dos elementos a cada ciclo para evitar *burn-in*.
- **PWA (Progressive Web App):** Instalável no Android e iOS, funcionando como um app independente com suporte offline básico.
- **Feedback Visual:** Efeitos de brilho e cores (Verde/Vermelho) indicando a direção da variação de preço.
- **Arquitetura Modular:** Código organizado em componentes (API, Utils, Effects, Config).

## 📂 Estrutura do Projeto

- `index.html`: Ponto de entrada limpo e semântico.
- `manifest.json`: Configurações de instalação PWA.
- `sw.js`: Service Worker para cache e estratégia de rede.
- `css/`:
  - `style.css`: Layout base, animações e responsividade.
  - `theme-minimal.css`: Definições de cores e variáveis de tema.
- `js/`:
  - `config.js`: Centralização de parâmetros (intervalos, moedas disponíveis).
  - `api.js`: Abstração de chamadas à CoinGecko.
  - `utils/`: Funções utilitárias de formatação e lógica matemática.
  - `effects.js`: Gerenciamento de animações e feedback visual.
  - `main.js`: Orquestrador da interface e ciclo de vida.

## 🛠️ Como usar

### Online (Recomendado)
Acesse via GitHub Pages ou seu serviço de hospedagem estática favorito.
1. Abra no navegador do seu dispositivo.
2. No menu do navegador, selecione "Adicionar à Tela de Início" ou "Instalar Aplicativo".
3. Toque em qualquer lugar da tela (exceto nos controles) para entrar em modo tela cheia.

### Executando Localmente
1. Clone o repositório.
2. Utilize um servidor HTTP local (necessário para Service Workers e Módulos):
   
   ```bash
   npx serve .
   # ou
   python -m http.server 8000
   ```

## 📄 Documentação Técnica
Para detalhes sobre como estender o projeto, adicionar novas moedas ou modificar o intervalo de atualização, consulte o arquivo [DOCUMENTATION.md](./DOCUMENTATION.md).

## ⚖️ Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
