// Fluid, theme-aware canvas background with smooth Perlin-like noise flow
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);

  let w = 0, h = 0, t = 0;
  // Mouse influence (smoothed)
  let mouseX = 0.5, mouseY = 0.5;     // normalized [0..1]
  let smoothX = 0.5, smoothY = 0.5;    // smoothed

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (e) => {
    mouseX = Math.min(1, Math.max(0, e.clientX / w));
    mouseY = Math.min(1, Math.max(0, e.clientY / h));
  }, { passive: true });
  resize();

  // Simple 2D noise via value-noise interpolation
  function noise2D(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const r = (ix, iy) => Math.sin((ix * 127.1 + iy * 311.7) * 0.1) * 43758.5453 % 1;
    const lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) * 0.5;
    const v1 = r(xi, yi), v2 = r(xi + 1, yi), v3 = r(xi, yi + 1), v4 = r(xi + 1, yi + 1);
    const i1 = lerp(v1, v2, xf), i2 = lerp(v3, v4, xf);
    return lerp(i1, i2, yf);
  }

  function themeColors() {
    const isDark = document.body.classList.contains('dark');
    return isDark
      ? { a: [255, 80, 0], b: [255, 0, 64], baseAlpha: 0.12 }
      : { a: [255, 120, 20], b: [255, 40, 20], baseAlpha: 0.18 };
  }

  function draw() {
    t += 0.0032; // slightly calmer idle flow
    // Smooth mouse tracking for responsive feel without jitter
    const follow = 0.18; // increase for snappier response
    smoothX += (mouseX - smoothX) * follow;
    smoothY += (mouseY - smoothY) * follow;
    const cols = themeColors();
    ctx.clearRect(0, 0, w, h);
    // Mouse-driven offset
    const offsetX = (smoothX - 0.5) * w * 0.18;
    const offsetY = (smoothY - 0.5) * h * 0.10;
    // Render a few large translucent blobs per side
    const blobs = [
      { cx: w * 0.15, side: -1 },
      { cx: w * 0.85, side: 1 },
      { cx: w * 0.12, side: -1 },
      { cx: w * 0.88, side: 1 },
    ];
    blobs.forEach((b, i) => {
      const scale = (i % 2 === 0) ? 0.38 : 0.32;
      const nx = noise2D(i * 2 + t * 0.6, i * 3) - 0.5;
      const ny = noise2D(i * 4, t * 0.6 + i * 2) - 0.5;
      const cx = b.cx + nx * w * 0.06 + offsetX * (b.side * 0.6);
      const cy = h * (0.5 + ny * 0.3) + offsetY * 0.8;
      const rx = Math.max(w, h) * (scale + (noise2D(i, t) - 0.5) * 0.06);
      const ry = rx * 1.6;
      const g = ctx.createRadialGradient(cx, cy, rx * 0.1, cx, cy, rx);
      const c1 = cols.a, c2 = cols.b;
      g.addColorStop(0, `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, ${cols.baseAlpha})`);
      g.addColorStop(1, `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  // React to theme toggle live
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => setTimeout(() => { /* redraw next frame uses new theme */ }, 0));
  }

  draw();
})();


