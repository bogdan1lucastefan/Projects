import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize with fallback to prevent 0 which causes division by zero errors
    let width = window.innerWidth || 1000;
    let height = window.innerHeight || 800;
    
    // Handle High-DPI
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      width = window.innerWidth || 1000;
      height = window.innerHeight || 800;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Track mouse position for parallax
    const handleMouseMove = (e: MouseEvent) => {
      // Safety check to prevent division by zero or Infinity
      if (width <= 0 || height <= 0) return;

      // Normalize mouse position (-1 to 1)
      const x = (e.clientX - width / 2) / (width / 2);
      const y = (e.clientY - height / 2) / (height / 2);
      
      // Ensure values are finite before updating
      if (Number.isFinite(x) && Number.isFinite(y)) {
        mouseRef.current = { x, y };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Star Generation Helpers ---

    const createStars = (count: number, sizeRange: [number, number], speedBase: number) => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        speedX: -1 * (Math.random() * speedBase + speedBase * 0.5), // Drift left
        speedY: (Math.random() - 0.5) * speedBase * 0.5, // Slight vertical drift
        brightness: Math.random(),
        oscillation: Math.random() * Math.PI * 2
      }));
    };

    const createNebulae = (count: number) => {
      const colors = [
        'rgba(76, 29, 149, 0.12)', // Violet
        'rgba(192, 38, 211, 0.08)', // Fuchsia
        'rgba(14, 165, 233, 0.08)', // Sky Blue
        'rgba(236, 72, 153, 0.06)', // Pink
        'rgba(56, 189, 248, 0.05)'  // Light Blue
      ];
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 200 + Math.random() * 400,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.05, // Very slow drift
        speedY: (Math.random() - 0.5) * 0.05,
      }));
    };

    const createHeroStars = (count: number) => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2.5 + Math.random() * 2.5, // Larger size
        speedX: -1 * (Math.random() * 0.4 + 0.2), 
        speedY: (Math.random() - 0.5) * 0.1,
        brightness: Math.random(),
        oscillation: Math.random() * Math.PI * 2,
        color: Math.random() > 0.7 ? '#fde047' : '#e0f2fe', // Yellowish or Blueish white
        hasFlare: Math.random() > 0.6 // Some stars have diffraction spikes
      }));
    };

    // --- Layers Definition ---

    const layers = [
      { 
        stars: createStars(400, [0.5, 1], 0.05), 
        color: '#64748b', 
        parallax: 0.02 // Reduced from 0.05 for subtler background movement
      }, 
      { 
        stars: createStars(250, [1, 2], 0.2), 
        color: '#94a3b8', 
        parallax: 0.08 // Reduced from 0.15
      },
      { 
        stars: createStars(60, [2, 3.5], 0.5), 
        color: '#e2e8f0', 
        parallax: 0.18 // Reduced from 0.35
      }
    ];

    const nebulae = createNebulae(6);
    const heroStars = createHeroStars(5);

    let animationFrameId: number;
    let lerpMouseX = 0;
    let lerpMouseY = 0;

    const render = () => {
      // Smooth interpolation for mouse movement
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      
      if (Number.isFinite(targetX) && Number.isFinite(targetY)) {
        lerpMouseX += (targetX - lerpMouseX) * 0.05;
        lerpMouseY += (targetY - lerpMouseY) * 0.05;
      }

      // Safety checks
      if (!Number.isFinite(lerpMouseX)) lerpMouseX = 0;
      if (!Number.isFinite(lerpMouseY)) lerpMouseY = 0;

      // 1. Dynamic Background Gradient
      // Reduced movement range from -30 to -15
      let gradientX = width / 2 + (lerpMouseX * -15);
      let gradientY = height / 2 + (lerpMouseY * -15);
      
      if (!Number.isFinite(gradientX)) gradientX = width / 2;
      if (!Number.isFinite(gradientY)) gradientY = height / 2;
      
      const gradient = ctx.createRadialGradient(gradientX, gradientY, 0, width / 2, height / 2, Math.max(width, 1));
      gradient.addColorStop(0, '#0f172a'); // Deep slate center
      gradient.addColorStop(1, '#000000'); // Black edges
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Milky Way Galaxy Effect
      ctx.save();
      // Reduced movement from -20 to -10
      const galaxyX = width / 2 + (lerpMouseX * -10);
      const galaxyY = height / 2 + (lerpMouseY * -10);
      
      if (Number.isFinite(galaxyX) && Number.isFinite(galaxyY)) {
        ctx.translate(galaxyX, galaxyY);
        ctx.rotate(-45 * Math.PI / 180);

        const maxDim = Math.max(width, height, 1);

        // Main galactic band
        const galaxyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxDim * 0.6);
        galaxyGradient.addColorStop(0, 'rgba(88, 28, 135, 0.15)');
        galaxyGradient.addColorStop(0.4, 'rgba(30, 58, 138, 0.12)');
        galaxyGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = galaxyGradient;
        ctx.scale(2.5, 0.8);
        ctx.beginPath();
        ctx.arc(0, 0, maxDim * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Galactic Core
        ctx.beginPath();
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxDim * 0.2);
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
        coreGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
        coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGradient;
        ctx.arc(0, 0, maxDim * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Render Nebulae (Background Clouds)
      nebulae.forEach(nebula => {
        // Reduced parallax from 0.02 to 0.01
        const offsetX = lerpMouseX * -50 * 0.01; 
        const offsetY = lerpMouseY * -50 * 0.01;
        
        nebula.x += nebula.speedX;
        nebula.y += nebula.speedY;
        
        // Wrapping
        if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
        if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = height + nebula.radius;
        if (nebula.y > height + nebula.radius) nebula.y = -nebula.radius;

        if (Number.isFinite(nebula.x) && Number.isFinite(nebula.y)) {
            const drawX = nebula.x + offsetX;
            const drawY = nebula.y + offsetY;
            
            const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, nebula.radius);
            grad.addColorStop(0, nebula.color);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(drawX, drawY, nebula.radius, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      // 4. Render Star Layers
      layers.forEach((layer) => {
        ctx.fillStyle = layer.color;
        const offsetX = lerpMouseX * -100 * layer.parallax;
        const offsetY = lerpMouseY * -100 * layer.parallax;

        layer.stars.forEach((star) => {
          star.x += star.speedX;
          star.y += star.speedY;

          let drawX = (star.x + offsetX) % width;
          if (drawX < 0) drawX += width;
          let drawY = (star.y + offsetY) % height;
          if (drawY < 0) drawY += height;

          star.oscillation += 0.03;
          const opacity = 0.3 + (Math.sin(star.oscillation) * 0.5 + 0.5) * 0.7;

          if (Number.isFinite(drawX) && Number.isFinite(drawY)) {
            ctx.globalAlpha = opacity * star.brightness;
            ctx.beginPath();
            ctx.arc(drawX, drawY, star.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      // 5. Render Hero Stars (Foreground)
      // Reduced multiplier from 0.4 to 0.2
      const heroOffsetX = lerpMouseX * -100 * 0.2;
      const heroOffsetY = lerpMouseY * -100 * 0.2;

      heroStars.forEach(star => {
        star.x += star.speedX;
        star.y += star.speedY;

        let drawX = (star.x + heroOffsetX) % width;
        if (drawX < 0) drawX += width;
        let drawY = (star.y + heroOffsetY) % height;
        if (drawY < 0) drawY += height;
        
        star.oscillation += 0.02;
        // Slower, more dramatic pulse
        const pulse = 0.6 + (Math.sin(star.oscillation) * 0.5 + 0.5) * 0.4; 

        if (Number.isFinite(drawX) && Number.isFinite(drawY)) {
            ctx.globalAlpha = 1.0;
            
            // Draw Glow
            const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, star.size * 5);
            glow.addColorStop(0, star.color === '#fde047' ? 'rgba(253, 224, 71, 0.4)' : 'rgba(224, 242, 254, 0.4)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(drawX, drawY, star.size * 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw Core
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = pulse;
            ctx.beginPath();
            ctx.arc(drawX, drawY, star.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw Diffraction Spikes (Flare)
            if (star.hasFlare) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 0.8;
                const spikeLen = star.size * 3 * pulse;
                
                ctx.beginPath();
                ctx.moveTo(drawX - spikeLen, drawY);
                ctx.lineTo(drawX + spikeLen, drawY);
                ctx.moveTo(drawX, drawY - spikeLen);
                ctx.lineTo(drawX, drawY + spikeLen);
                ctx.stroke();
            }
        }
      });
      
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
    />
  );
};

export default Starfield;