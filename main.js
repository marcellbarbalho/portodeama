/* ==========================================================================
   PORTO DE AMA CENTRO DE CULTURA
   Scripts de interatividade (main.js)
   Regra: Sem uso de travessoes no codigo ou comentarios.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu de navegacao mobile
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Fechar menu mobile ao clicar em um link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      });
    });
  }

  // 2. Calculo automatico dos anos de atuacao (fundacao em 2002)
  const yearsElement = document.getElementById('years-active');
  if (yearsElement) {
    const currentYear = new Date().getFullYear();
    const foundationYear = 2002;
    const yearsDiff = currentYear - foundationYear;
    if (yearsDiff > 0) {
      yearsElement.textContent = String(yearsDiff);
    }
  }

  // 3. Pilha de abas verticais no Hero com reacao ao scroll
  const heroSection = document.getElementById('hero');
  const tabsDeck = document.getElementById('hero-tabs-deck');

  if (heroSection && tabsDeck) {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tabFrente = tabsDeck.querySelector('.hero-tab-dourado');
    const tabMeio = tabsDeck.querySelector('.hero-tab-vermelho');

    if (!isReducedMotion && tabFrente && tabMeio) {
      const updateVerticalTabs = () => {
        const rect = heroSection.getBoundingClientRect();
        const totalScroll = heroSection.offsetHeight - window.innerHeight;

        if (totalScroll <= 0) return;

        // Progresso do scroll dentro do Hero (entre 0 e 1)
        const currentScroll = -rect.top;
        const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);

        // Limiares de scroll:
        // A aba dourada (frente) desliza a partir de cerca de 25% de rolagem
        if (progress >= 0.25) {
          tabFrente.classList.add('is-dismissed');
        } else {
          tabFrente.classList.remove('is-dismissed');
        }

        // A aba vermelha (meio) desliza a partir de cerca de 65% de rolagem
        if (progress >= 0.65) {
          tabMeio.classList.add('is-dismissed');
        } else {
          tabMeio.classList.remove('is-dismissed');
        }
      };

      let ticking = false;
      const onScrollOrResize = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateVerticalTabs();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });
      updateVerticalTabs();

      // Permitir interacao tatil ou por clique
      tabFrente.addEventListener('click', () => {
        tabFrente.classList.toggle('is-dismissed');
      });
      tabMeio.addEventListener('click', () => {
        tabMeio.classList.toggle('is-dismissed');
      });
    }
  }

  // 4. Animacao de abertura do site e voo do logo para o cabecalho
  const introOverlay = document.getElementById('intro-overlay');
  const introVideo = document.getElementById('intro-video');
  const movingLogo = document.getElementById('intro-moving-logo');
  const headerLogo = document.getElementById('header-logo-img');
  const skipBtn = document.getElementById('intro-skip-btn');

  if (introOverlay && introVideo && movingLogo && headerLogo) {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      introOverlay.style.display = 'none';
      headerLogo.classList.remove('header-logo-hidden');
    } else {
      document.body.classList.add('is-intro-active');
      headerLogo.classList.add('header-logo-hidden');

      let hasCompleted = false;

      const finishIntroAnimation = () => {
        if (hasCompleted) return;
        hasCompleted = true;

        // 1. Ocultar video e exibir logo movel centralizado
        introVideo.style.opacity = '0';
        movingLogo.style.opacity = '1';

        // 2. Coordenadas de centro de origem e centro de destino
        const startRect = movingLogo.getBoundingClientRect();
        const targetRect = headerLogo.getBoundingClientRect();

        const centerStartX = startRect.left + startRect.width / 2;
        const centerStartY = startRect.top + startRect.height / 2;
        const centerTargetX = targetRect.left + targetRect.width / 2;
        const centerTargetY = targetRect.top + targetRect.height / 2;

        const deltaX = centerTargetX - centerStartX;
        const deltaY = centerTargetY - centerStartY;
        const scale = targetRect.height / startRect.height;

        // 3. Iniciar voo suave do logo em direcao ao cabecalho
        introOverlay.classList.add('is-completing');
        movingLogo.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(${scale})`;

        // 4. Ao concluir o voo, fixar o logo no cabecalho e encerrar a intro
        setTimeout(() => {
          headerLogo.classList.remove('header-logo-hidden');
          headerLogo.style.opacity = '1';
          introOverlay.style.opacity = '0';

          setTimeout(() => {
            introOverlay.style.display = 'none';
            document.body.classList.remove('is-intro-active');
          }, 400);
        }, 720);
      };

      // Gatilhos de conclusao do video
      introVideo.addEventListener('ended', finishIntroAnimation);

      // Ou aos 3.8s para transicao instantanea e sem saltos
      introVideo.addEventListener('timeupdate', () => {
        if (introVideo.currentTime >= 3.85) {
          finishIntroAnimation();
        }
      });

      // Botao para pular abertura
      if (skipBtn) {
        skipBtn.addEventListener('click', finishIntroAnimation);
      }

      // Timeout de seguranca caso ocorra lentidao no carregamento da midia
      setTimeout(() => {
        if (!hasCompleted) {
          finishIntroAnimation();
        }
      }, 5200);

      // Iniciar reproducao do video
      const playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Em caso de restricao de autoplay, o timeout ou o clique realizam a transicao
        });
      }
    }
  }

  // 5. Animacao dos contadores de impacto
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = (counter) => {
      const target = +counter.getAttribute('data-target');
      if (isReducedMotion) {
        counter.textContent = target.toLocaleString('pt-BR');
        return;
      }

      const duration = 2000; // 2 segundos
      let startTime = null;
      
      // Funcao de suavizacao easeOutExpo (acelera no comeco, frena no final)
      const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      const updateCounter = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        const currentCount = Math.floor(easeOutExpo(progress) * target);
        counter.textContent = currentCount.toLocaleString('pt-BR');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString('pt-BR');
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (document.body.classList.contains('is-intro-active')) {
            const checkIntro = setInterval(() => {
              if (!document.body.classList.contains('is-intro-active')) {
                clearInterval(checkIntro);
                animateCounter(entry.target);
              }
            }, 200);
          } else {
            animateCounter(entry.target);
          }
          obs.unobserve(entry.target); // Roda apenas uma vez
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }
});
