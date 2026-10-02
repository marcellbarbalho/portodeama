/**
 * Animação de Partículas (Morphing) para a Hero Section
 * Usa dados pré-calculados de coordenadas (animData1 e animData2).
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-animation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  const colorTinta = '#1c2e35'; 
  const colorBg = '#FAF8F5'; 
  
  let width, height;
  let particles = [];
  let isAnimating = false;
  let currentState = 1; // 1: Imagem 1, 2: Transição para 2, 3: Imagem 2, 4: Transição para 1
  let drawScale = 1;
  let cx = 0, cy = 0;
  
  let lastWidth = 0;
  let lastHeight = 0;
  let isFirstLoad = true;

  function resizeCanvas() {
    const currentWidth = canvas.clientWidth || 800;
    const currentHeight = canvas.clientHeight || 460;
    
    // Ignora pequenos resizes da UI do mobile para não dar saltos (re-inicializações duplas)
    if (!isFirstLoad && Math.abs(currentWidth - lastWidth) < 10 && Math.abs(currentHeight - lastHeight) < 10) {
      return; 
    }
    
    lastWidth = currentWidth;
    lastHeight = currentHeight;
    width = currentWidth;
    height = currentHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    // Voltando a escala para 1.0 com base na altura real do pai
    const canvasRect = canvas.getBoundingClientRect();
    const parentRect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : canvasRect;
    
    drawScale = parentRect.height * 1.0; 
    
    // Centraliza o desenho exatamente no meio visual do elemento pai, 
    // mesmo que o canvas esteja vazando para fora (bleeds) via CSS negativo.
    cx = (parentRect.left - canvasRect.left) + (parentRect.width / 2);
    cy = (parentRect.top - canvasRect.top) + (parentRect.height / 2);
    
    // Inicia ou recalcula os alvos
    initParticles();
    
    // Se for a primeira vez que geramos as partículas com sucesso, damos o play!
    if (isFirstLoad && particles.length > 0) {
      isFirstLoad = false;
      isAnimating = true;
      requestAnimationFrame(animate);
      
      setInterval(() => {
        triggerMorph();
      }, 4000); 
    }
  }
  
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(resizeCanvas, 100);
  });
  
  if (canvas.parentElement) {
    resizeObserver.observe(canvas.parentElement);
  } else {
    window.addEventListener('resize', () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(resizeCanvas, 100);
    });
  }
  
  function initParticles() {
    if (typeof animData1 === 'undefined' || typeof animData2 === 'undefined' || typeof animDataMatriz === 'undefined') {
      console.error("Dados da animação não encontrados.");
      return;
    }
    
    const numParticles = Math.max(animData1.length, animData2.length, animDataMatriz.length);
    particles = [];
    
    for (let i = 0; i < numParticles; i++) {
      const dadosMoinho = animData2;
      const dadosIgreja = animDataMatriz;
      const dadosMontanhas = animData1;
      
      const p1 = dadosMontanhas[i] || dadosMontanhas[Math.floor(Math.random() * dadosMontanhas.length)];
      const p2 = dadosMoinho[i] || dadosMoinho[Math.floor(Math.random() * dadosMoinho.length)];
      const p3 = dadosIgreja[i] || dadosIgreja[Math.floor(Math.random() * dadosIgreja.length)];
      
      const px1 = cx + p1[0] * drawScale;
      const py1 = cy + p1[1] * drawScale;
      const px2 = cx + p2[0] * drawScale;
      const py2 = cy + p2[1] * drawScale;
      // Aumenta a imagem da Igreja (que na prática é a segunda a aparecer) em 30%
      const px3 = cx + p3[0] * (drawScale * 1.30);
      const py3 = cy + p3[1] * (drawScale * 1.30);
      
      particles.push({
        x: px1 + (Math.random() - 0.5) * 5,
        y: py1 + (Math.random() - 0.5) * 5,
        vx: 0,
        vy: 0,
        img1X: px1,
        img1Y: py1,
        img2X: px2,
        img2Y: py2,
        img3X: px3,
        img3Y: py3,
        randomFactor: Math.random() * 2 + 0.5
      });
    }
  }
  
  function triggerMorph() {
    // Altera o estado para transição
    if (currentState === 1) {
      currentState = 2; // de 1 pra 2
    } else if (currentState === 3) {
      currentState = 4; // de 2 pra 3
    } else if (currentState === 5) {
      currentState = 6; // de 3 pra 1
    }
    
    // Dá um impulso aleatório orgânico
    particles.forEach(p => {
      p.vx = (Math.random() - 0.5) * 20;
      p.vy = (Math.random() - 0.5) * 20 - 5; // Tendência de subir levemente
    });
    
    // Após 1 segundo de dispersão, começa a atração magnética para a próxima imagem
    setTimeout(() => {
      if (currentState === 2) currentState = 3;
      if (currentState === 4) currentState = 5;
      if (currentState === 6) currentState = 1;
    }, 1000);
  }
  
  function animate() {
    if (!isAnimating) return;
    
    // Limpa o canvas para ser transparente e mostrar o fundo da Hero
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = colorTinta;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      if (currentState === 1) { // Imagem 1 (Moinho)
        const dx = p.img1X - p.x;
        const dy = p.img1Y - p.y;
        p.vx += dx * 0.05 * p.randomFactor;
        p.vy += dy * 0.05 * p.randomFactor;
        p.vx *= 0.8; 
        p.vy *= 0.8;
      } 
      else if (currentState === 3) { // Imagem 2 (Matriz)
        const dx = p.img2X - p.x;
        const dy = p.img2Y - p.y;
        p.vx += dx * 0.05 * p.randomFactor;
        p.vy += dy * 0.05 * p.randomFactor;
        p.vx *= 0.8; 
        p.vy *= 0.8;
      }
      else if (currentState === 5) { // Imagem 3 (Montanhas)
        const dx = p.img3X - p.x;
        const dy = p.img3Y - p.y;
        p.vx += dx * 0.05 * p.randomFactor;
        p.vy += dy * 0.05 * p.randomFactor;
        p.vx *= 0.8; 
        p.vy *= 0.8;
      }
      else if (currentState === 2 || currentState === 4 || currentState === 6) { // Explodindo / Dispersando
        p.vx *= 0.96; 
        p.vy *= 0.96;
        
        p.vx += Math.sin(p.y * 0.05 + Date.now() * 0.001) * 0.5;
        p.vy += Math.cos(p.x * 0.05 + Date.now() * 0.001) * 0.5;
      }
      
      p.x += p.vx;
      p.y += p.vy;
      
      // Desenha com um tamanho menor (1.5px) e leve transparência para um traço mais suave
      ctx.fillStyle = 'rgba(28, 46, 53, 0.7)'; // Cor da tinta com 70% de opacidade
      ctx.fillRect(p.x, p.y, 1.5, 1.5);
    }
    
    requestAnimationFrame(animate);
  }
  
  // A inicialização agora acontece automaticamente dentro do resizeCanvas
  // quando o ResizeObserver detectar o tamanho real do elemento pela primeira vez.
  
});
