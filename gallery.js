document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('workshops-gallery');
  if (!gallery) return;

  const tabs = gallery.querySelectorAll('.gallery-tab');
  const slides = gallery.querySelectorAll('.gallery-slide');
  let currentIndex = 0;
  let timer = null;
  let isHovered = false;

  // Verifica se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function goToSlide(index) {
    // Remove active da tab e slide atual
    tabs[currentIndex].classList.remove('active');
    tabs[currentIndex].setAttribute('aria-selected', 'false');
    slides[currentIndex].classList.remove('active');

    // Atualiza o index
    currentIndex = index;

    // Adiciona active na nova tab e slide
    tabs[currentIndex].classList.add('active');
    tabs[currentIndex].setAttribute('aria-selected', 'true');
    slides[currentIndex].classList.add('active');
  }

  function nextSlide() {
    let newIndex = currentIndex + 1;
    if (newIndex >= tabs.length) {
      newIndex = 0; // Volta pro início
    }
    goToSlide(newIndex);
  }

  function startTimer() {
    stopTimer();
    // Só inicia se não estiver com motion reduzido
    if (!prefersReducedMotion.matches) {
      timer = setInterval(() => {
        if (!isHovered) {
          nextSlide();
        }
      }, 4000);
    }
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Event Listeners das Tabs
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const index = parseInt(tab.getAttribute('data-index'), 10);
      goToSlide(index);
      
      // Reinicia o timer ao clicar
      startTimer();
    });
  });

  // Event Listeners de Hover na Galeria
  gallery.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  gallery.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Se a preferência de movimento mudar enquanto a página estiver aberta
  prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  // Inicia o auto-advance
  startTimer();
});
