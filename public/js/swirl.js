'use strict';

let particleCount = 700;
const particlePropCount = 9;
let particlePropsLength = particleCount * particlePropCount;
let rangeY = 100; // Vertical spawning range
const baseTTL = 50;
const rangeTTL = 150;
const baseSpeed = 0.1;
const rangeSpeed = 2;
const baseRadius = 2;
const rangeRadius = 8;
const baseHue = 270; // Indigo/Purple matching #7338a0
const rangeHue = 0;
const noiseSteps = 8;
const xOff = 0.00125;
const yOff = 0.00125;
const zOff = 0.0005;
const backgroundColor = '#ffffff'; // Absolute White

let container;
let canvas;
let ctx;
let center = [0, 0];
let tick = 0;
let simplex;
let particleProps;
let speedMultiplier = 1;
let radiusMultiplier = 1;
let mobileSaturation = 40;
let mobileLightness = 40;
let animationFrameId = null;

function setup() {
  if (typeof SimplexNoise === 'undefined') {
    console.warn('SimplexNoise not yet loaded. Deferring swirl setup.');
    return;
  }
  container = document.querySelector('.content--canvas');
  if (!container) return;

  // Cancel any existing animation frame
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  const isMobile = window.innerWidth < 768;
  particleCount = isMobile ? 40 : 150; // Heavily reduced from 400/600 to save CPU
  particlePropsLength = particleCount * particlePropCount;

  // Faster but fewer particles for a "cleaner" look with less CPU load
  speedMultiplier = isMobile ? 0.4 : 0.7;
  radiusMultiplier = isMobile ? 1 : 1;
  mobileSaturation = isMobile ? 80 : 40;
  mobileLightness = isMobile ? 40 : 40;

  // More concentrated vertical spread on mobile
  rangeY = isMobile ? window.innerHeight * 0.25 : 100;

  // Clean up existing canvases if any
  const existingCanvases = container.querySelectorAll('canvas');
  existingCanvases.forEach(c => c.remove());

  createCanvas();
  resize();
  initParticles();
  draw();
}

function initParticles() {
  tick = 0;
  simplex = new SimplexNoise();
  particleProps = new Float32Array(particlePropsLength);

  let i;
  for (i = 0; i < particlePropsLength; i += particlePropCount) {
    initParticle(i, true); // true for initial random spread
  }
}

function initParticle(i, isInitial = false) {
  let x, y, vx, vy, life, ttl, speed, radius, hue;

  if (!canvas || !canvas.a) return;

  x = rand(canvas.a.width);
  // Spawn within rangeY around the vertical center
  y = isInitial ? rand(canvas.a.height) : center[1] + randRange(rangeY);

  vx = 0;
  vy = 0;
  life = 0;
  ttl = baseTTL + rand(rangeTTL);
  speed = baseSpeed + rand(rangeSpeed);
  radius = baseRadius + rand(rangeRadius);
  hue = baseHue + rand(rangeHue);

  particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
}

function drawParticles() {
  let i;
  for (i = 0; i < particlePropsLength; i += particlePropCount) {
    updateParticle(i);
  }
}

function updateParticle(i) {
  let i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i, i9 = 8 + i;
  let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

  x = particleProps[i];
  y = particleProps[i2];

  if (isNaN(x) || isNaN(y)) {
    initParticle(i);
    return;
  }

  n = simplex.noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
  vx = lerp(particleProps[i3], cos(n), 0.5);
  vy = lerp(particleProps[i4], sin(n), 0.5);
  life = particleProps[i5];
  ttl = particleProps[i6];
  speed = particleProps[i7] * speedMultiplier;
  x2 = x + vx * speed;
  y2 = y + vy * speed;
  radius = particleProps[i8];
  hue = particleProps[i9];

  drawParticle(x, y, x2, y2, life, ttl, radius, hue);

  life++;

  particleProps[i] = x2;
  particleProps[i2] = y2;
  particleProps[i3] = vx;
  particleProps[i4] = vy;
  particleProps[i5] = life;

  (checkBounds(x, y) || life > ttl) && initParticle(i);
}

function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
  ctx.a.lineWidth = radius * radiusMultiplier;
  ctx.a.strokeStyle = `hsla(${hue}, ${mobileSaturation}%, ${mobileLightness}%, ${fadeInOut(life, ttl)})`;
  ctx.a.beginPath();
  ctx.a.moveTo(x, y);
  ctx.a.lineTo(x2, y2);
  ctx.a.stroke();
  ctx.a.closePath();
}

function checkBounds(x, y) {
  return (
    x > canvas.a.width ||
    x < 0 ||
    y > canvas.a.height ||
    y < 0
  );
}

function createCanvas() {
  container = document.querySelector('.content--canvas');
  if (!container) return;
  canvas = {
    a: document.createElement('canvas'),
    b: document.createElement('canvas')
  };
  canvas.b.style = `
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
    z-index: 1;
    will-change: transform, opacity;
	`;
  canvas.b.className = 'gpu-accelerated';
  canvas.a.className = 'gpu-accelerated';
  container.appendChild(canvas.b);
  ctx = {
    a: canvas.a.getContext('2d'),
    b: canvas.b.getContext('2d')
  };
  ctx.a.lineCap = 'round';
  center = [];
}

function resize() {
  if (!canvas || !container) return;
  const { width, height } = container.getBoundingClientRect();

  if (width <= 0 || height <= 0) return;

  const canDrawA = canvas.a.width > 0 && canvas.a.height > 0;
  const canDrawB = canvas.b.width > 0 && canvas.b.height > 0;

  // Force full width on mobile/desktop
  canvas.a.width = width;
  canvas.a.height = height;

  if (ctx.b && canDrawB) {
    try {
      ctx.a.drawImage(canvas.b, 0, 0);
    } catch (e) { }
  }

  canvas.b.width = width;
  canvas.b.height = height;

  if (ctx.a && canDrawA) {
    try {
      ctx.b.drawImage(canvas.a, 0, 0);
    } catch (e) { }
  }

  center[0] = 0.5 * canvas.a.width;
  center[1] = 0.5 * canvas.a.height;
}

function renderToScreen() {
  if (!canvas || !canvas.a || canvas.a.width <= 0 || canvas.a.height <= 0) return;
  if (!ctx || !ctx.b) return;

  ctx.b.save();
  ctx.b.globalCompositeOperation = 'source-over';
  try {
    ctx.b.drawImage(canvas.a, 0, 0);
  } catch (e) { }
  ctx.b.restore();
}

function draw() {
  tick++;

  if (!canvas || !canvas.a || canvas.a.width <= 0 || canvas.a.height <= 0) {
    animationFrameId = window.requestAnimationFrame(draw);
    return;
  }

  ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);

  ctx.b.fillStyle = backgroundColor;
  ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height);

  drawParticles();
  renderToScreen();

  animationFrameId = window.requestAnimationFrame(draw);
}

window.initSwirl = setup;

if (document.readyState === 'complete') {
  setup();
} else {
  window.addEventListener('load', setup);
}
window.addEventListener('resize', resize);
