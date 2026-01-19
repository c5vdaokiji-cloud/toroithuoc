export const triggerConfetti = () => {
  const colors = ['#06b6d4', '#4f46e5', '#ec4899', '#f59e0b', '#10b981'];
  
  const createParticle = (x: number, y: number) => {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.position = 'fixed';
    particle.style.top = `${y}px`;
    particle.style.left = `${x}px`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 100; // Upward bias

    particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], {
      duration: Math.random() * 1000 + 500,
      easing: 'cubic-bezier(0, .9, .57, 1)',
    }).onfinish = () => particle.remove();

    document.body.appendChild(particle);
  };

  // Burst from center
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      createParticle(centerX, centerY);
    }, i * 10);
  }
};