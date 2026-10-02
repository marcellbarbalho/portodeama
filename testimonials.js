document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('testimonialsCarousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  
  if (slides.length === 0 || dots.length === 0) return;

  let currentIndex = 0;
  let intervalId;
  const intervalTime = 8000; // 8 segundos por depoimento

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    let nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function startAutoPlay() {
    intervalId = setInterval(nextSlide, intervalTime);
  }

  function resetAutoPlay() {
    clearInterval(intervalId);
    startAutoPlay();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoPlay();
    });
  });

  // Pausar auto-play quando o mouse estiver em cima
  carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Iniciar carrossel
  startAutoPlay();
});
