/**
 * effects.js
 * Responsável por aplicar animações visuais e sonoras aos elementos.
 */

const Effects = (() => {
  const SOUND_MAP = {
    up: 'assets/sounds/up.mp3',
    down: 'assets/sounds/down.mp3'
  };

  let audioEnabled = false;
  let audioCache = {};

  /**
   * Ativa ou desativa efeitos sonoros.
   * Mantido falso por padrão; preparado para futuras configurações.
   * @param {boolean} enabled
   */
  function toggleSound(enabled) {
    audioEnabled = Boolean(enabled);
  }

  /**
   * Busca (com pequeno cache) o elemento de áudio para o efeito escolhido.
   * @param {'up'|'down'} type
   * @returns {HTMLAudioElement}
   */
  function getAudio(type) {
    if (!audioCache[type]) {
      const audio = new Audio(SOUND_MAP[type]);
      audio.volume = 0.25;
      audioCache[type] = audio;
    }
    return audioCache[type];
  }

  /**
   * Executa um efeito sonoro quando habilitado.
   * @param {'up'|'down'} type
   */
  function playSound(type) {
    if (!audioEnabled || !SOUND_MAP[type]) return;
    try {
      const audio = getAudio(type);
      audio.currentTime = 0;
      audio.play();
    } catch (error) {
      console.warn('[Effects] Falha ao reproduzir áudio:', error);
    }
  }

  /**
   * Aplica a classe de animação fade ao elemento alvo.
   * @param {HTMLElement} element
   */
  function runFade(element) {
    if (!element) return;
    element.classList.remove('fade');
    // Força reflow para reiniciar a animação CSS
    void element.offsetWidth;
    element.classList.add('fade');
  }

  /**
   * Aplica feedback visual conforme a direção da variação.
   * @param {HTMLElement} element
   * @param {'up'|'down'|'neutral'} direction
   */
  function applyDirection(element, direction) {
    if (!element) return;
    element.classList.remove('up', 'down');
    if (direction === 'up') {
      element.classList.add('up');
    }
    if (direction === 'down') {
      element.classList.add('down');
    }
  }

  /**
   * Aplica efeito visual e sonoro completo para o preço.
   * @param {HTMLElement} element
   * @param {'up'|'down'|'neutral'} direction
   */
  function applyPriceEffect(element, direction) {
    runFade(element);
    applyDirection(element, direction);
    playSound(direction);
  }

  /**
   * Atualiza as classes de variação percentual.
   * @param {HTMLElement} element
   * @param {'up'|'down'|'neutral'} direction
   */
  function applyChangeBadge(element, direction) {
    if (!element) return;
    element.classList.remove('is-up', 'is-down');
    if (direction === 'up') element.classList.add('is-up');
    if (direction === 'down') element.classList.add('is-down');
  }

  return {
    applyPriceEffect,
    applyChangeBadge,
    toggleSound
  };
})();

window.Effects = Effects;
