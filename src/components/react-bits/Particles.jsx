import React, { useRef, useEffect } from 'react';

export default function Particles({
  particleCount = 50,
  speed = 0.5,
  particleColors = ['#0e7490', '#0891b2', '#06b6d4'],
  particleBaseSize = 2,
  moveParticlesOnHover = true,
  style = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null };

    const setSize = () => {
      // Read the actual rendered pixel dimensions of the canvas element
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width) || canvas.offsetWidth || 600;
      canvas.height = Math.round(rect.height) || canvas.offsetHeight || 400;
    };

    const handleMouseMove = (e) => {
      if (!moveParticlesOnHover) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => { mouse.x = null; mouse.y = null; };

    const makeParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * particleBaseSize + 1,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    });

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(makeParticle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (mouse.x && mouse.y && moveParticlesOnHover) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          if (Math.sqrt(dx * dx + dy * dy) < 100) {
            p.x -= dx * 0.02;
            p.y -= dy * 0.02;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    // ResizeObserver keeps canvas pixel dimensions in sync with CSS layout
    const ro = new ResizeObserver(() => { setSize(); init(); });
    ro.observe(canvas);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    setSize();
    init();
    animate();

    return () => {
      ro.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, speed, particleBaseSize, moveParticlesOnHover]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: moveParticlesOnHover ? 'auto' : 'none',
        ...style,
      }}
    />
  );
}
