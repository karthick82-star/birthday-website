/* =========================================================
   A Little Birthday Surprise 🎀  –  script.js
   Customized especially for Kaviya
   ========================================================= */

/* ---------- 0. SECURITY & PRIVACY GATE ---------- */
const securityGate = document.getElementById('securityGate');
const passcodeInput = document.getElementById('passcodeInput');
const passcodeForm = document.getElementById('passcodeForm');
const togglePassBtn = document.getElementById('togglePassBtn');
const quickUnlockBtn = document.getElementById('quickUnlockBtn');
const securityError = document.getElementById('securityError');

const VALID_PASSCODES = ['7308', 'kaviya', 'kavya', '8807437308', 'birthday'];

function unlockSecurity() {
  if (securityGate) {
    securityGate.classList.add('unlocked');
    try { sessionStorage.setItem('kaviya_surprise_unlocked', '1'); } catch (e) {}
    if (typeof confetti === 'function') confetti(90);
  }
}

// Restore unlock state within session
try {
  if (sessionStorage.getItem('kaviya_surprise_unlocked') === '1' && securityGate) {
    securityGate.classList.add('unlocked');
  }
} catch (e) {}

if (passcodeForm) {
  passcodeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (passcodeInput ? passcodeInput.value : '').trim().toLowerCase();
    if (VALID_PASSCODES.includes(val) || val === '') {
      unlockSecurity();
    } else {
      if (securityError) securityError.classList.remove('hidden');
    }
  });
}

if (quickUnlockBtn) {
  quickUnlockBtn.addEventListener('click', () => {
    unlockSecurity();
  });
}

if (togglePassBtn && passcodeInput) {
  togglePassBtn.addEventListener('click', () => {
    const isPass = passcodeInput.type === 'password';
    passcodeInput.type = isPass ? 'text' : 'password';
    togglePassBtn.textContent = isPass ? '🙈' : '👁️';
  });
}

// Prevent image scraping/dragging
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach((img) => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('contextmenu', (e) => e.preventDefault());
  });
});

/* ---------- 1. PHOTOS & CAPTIONS ----------
   Featured photo of Kaviya */
const PHOTOS = [
  { src: 'assets/photos/photo1.jpg', caption: 'Happy Birthday Kaviya! 🌸' }
];

const $ = (id) => document.getElementById(id);
const rand = (a, b) => Math.random() * (b - a) + a;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 2. FLOATING HEARTS & FALLING PETALS ---------- */
function spawnFloater(type) {
  const el = document.createElement('span');
  el.className = 'float-item ' + (type === 'heart' ? 'heart-up' : 'petal-down');
  el.textContent = type === 'heart'
    ? ['💗', '💖', '💕', '🩷', '✨'][Math.floor(rand(0, 5))]
    : ['🌸', '🌺', '🌷', '🎀'][Math.floor(rand(0, 4))];
  el.style.left = rand(0, 100) + 'vw';
  el.style.fontSize = rand(14, 30) + 'px';
  el.style.opacity = rand(0.5, 0.9);
  el.style.setProperty('--dx', rand(-60, 60) + 'px');
  const dur = rand(7, 13);
  el.style.animationDuration = dur + 's';
  $('floaters').appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}
if (!reduceMotion) {
  setInterval(() => spawnFloater('heart'), 1100);
  setInterval(() => spawnFloater('petal'), 1500);
}

/* ---------- 3. SPARKLE CURSOR TRAIL (desktop only) ---------- */
let lastSparkle = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSparkle < 60 || reduceMotion) return;
  lastSparkle = now;
  const s = document.createElement('span');
  s.className = 'sparkle';
  s.textContent = ['✨', '💖', '⭐', '🌸'][Math.floor(rand(0, 4))];
  s.style.left = e.clientX + rand(-8, 8) + 'px';
  s.style.top = e.clientY + rand(-8, 8) + 'px';
  s.style.fontSize = rand(10, 18) + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

/* ---------- 4. CONFETTI (drawn on a canvas) ---------- */
const canvas = $('confetti');
const ctx = canvas.getContext('2d');
let pieces = [], confettiRunning = false;
function resizeCanvas() { canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas();
addEventListener('resize', resizeCanvas);

function confetti(count = 140) {
  if (reduceMotion) return;
  const colors = ['#F8C8DC', '#E88EAE', '#C75B83', '#FFDDE8', '#FFD86B', '#fff', '#FF9AA2'];
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: rand(0, canvas.width), y: rand(-canvas.height * 0.4, 0),
      w: rand(6, 12), h: rand(8, 16), vy: rand(2, 5), vx: rand(-2, 2),
      rot: rand(0, 6.28), vr: rand(-0.2, 0.2), c: colors[Math.floor(rand(0, colors.length))]
    });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
}
function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 20);
  if (pieces.length) requestAnimationFrame(drawConfetti);
  else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

/* ---------- 5. MUSIC ---------- */
const bgm = $('bgm'), musicBtn = $('musicBtn');
bgm.volume = 0.55;
function setMusicUI(playing) {
  musicBtn.classList.toggle('playing', playing);
  $('musicIcon').textContent = playing ? '🎶' : '🔇';
}
function playMusic() {
  bgm.play().then(() => setMusicUI(true)).catch(() => setMusicUI(false));
}
musicBtn.addEventListener('click', () => {
  if (bgm.paused) playMusic(); else { bgm.pause(); setMusicUI(false); }
});

/* ---------- 6. SECTION HELPERS ---------- */
function goTo(id) {
  const sec = $(id);
  if (!sec) return;
  sec.classList.remove('enter'); void sec.offsetWidth; sec.classList.add('enter');
  sec.scrollIntoView({ behavior: 'smooth' });
}
document.querySelectorAll('.go').forEach((b) =>
  b.addEventListener('click', () => goTo(b.dataset.next)));

function onActivate(el, fn) {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
  });
}

/* ---------- 7. WELCOME -> SITE ---------- */
$('openBtn').addEventListener('click', () => {
  playMusic();
  musicBtn.classList.remove('hidden');
  $('site').classList.remove('hidden');
  confetti(100);
  setTimeout(() => {
    $('welcome').classList.add('hidden');
    window.scrollTo(0, 0);
    goTo('gift');
  }, 60);
});

/* ---------- 8. GIFT BOX ---------- */
let giftOpened = false;
onActivate($('giftBox'), () => {
  if (giftOpened) return;
  giftOpened = true;
  $('giftBox').classList.add('open');
  $('giftHint').style.visibility = 'hidden';
  confetti(220);
  setTimeout(() => $('giftMsg').classList.add('show'), 500);
});

/* ---------- 9. GALLERY ---------- */
/* Aesthetic soft gift card SVGs when a photo file is not yet added */
function placeholder(n) {
  const cards = [
    { emoji: '🌸', text: 'Endless Smiles ✨' },
    { emoji: '🌷', text: 'Beautiful Soul 💖' },
    { emoji: '🎀', text: 'Countless Blessings 🌟' },
    { emoji: '💫', text: 'Stay Wonderful 🌷' },
    { emoji: '🎂', text: 'Happy Birthday 🎀' },
    { emoji: '💕', text: 'Keep Smiling Always 🌸' }
  ];
  const item = cards[(n - 1) % cards.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
    <defs>
      <linearGradient id='bgGrad${n}' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='#FFEBF2'/>
        <stop offset='50%' stop-color='#FFD6E5'/>
        <stop offset='100%' stop-color='#F8C8DC'/>
      </linearGradient>
    </defs>
    <rect width='400' height='400' rx='16' fill='url(#bgGrad${n})'/>
    <circle cx='200' cy='175' r='85' fill='rgba(255,255,255,0.7)'/>
    <text x='200' y='175' font-size='76' text-anchor='middle' dominant-baseline='central'>${item.emoji}</text>
    <text x='200' y='295' font-size='22' font-weight='600' text-anchor='middle' fill='#C75B83' font-family='sans-serif'>${item.text}</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function buildGallery() {
  const wrap = $('polaroids');
  wrap.innerHTML = '';
  PHOTOS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.tabIndex = 0;
    card.style.setProperty('--r', (PHOTOS.length > 1 ? ((i % 2 ? 1 : -1) * rand(1, 4)).toFixed(1) : '-1.5') + 'deg');
    
    const pin = document.createElement('div');
    pin.className = 'polaroid-ribbon';
    pin.textContent = '🎀';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'polaroid-img-wrap';

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.caption;
    img.loading = 'lazy';
    imgWrap.appendChild(img);

    const cap = document.createElement('p');
    cap.textContent = p.caption;

    card.append(pin, imgWrap, cap);
    onActivate(card, () => openLightbox(img.src, p.caption));
    wrap.appendChild(card);
  });
}
buildGallery();

function openLightbox(src, caption) {
  $('lbImg').src = src; $('lbImg').alt = caption; $('lbCap').textContent = caption;
  $('lightbox').classList.add('show');
}
function closeLightbox() { $('lightbox').classList.remove('show'); }
$('lbClose').addEventListener('click', closeLightbox);
$('lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ---------- 10. CAKE & WISH ---------- */
$('wishBtn').addEventListener('click', () => {
  $('cakeEl').classList.add('out');
  $('wishBtn').style.display = 'none';
  $('cakeHint').style.display = 'none';
  confetti(220);
  for (let i = 0; i < 16; i++) setTimeout(() => spawnStar(), i * 110);
  $('wishMsg').classList.add('show');
  $('cakeNext').classList.add('show');
});

function spawnStar() {
  const s = document.createElement('span');
  s.className = 'float-item heart-up';
  s.textContent = ['⭐', '🌟', '✨', '💖'][Math.floor(rand(0, 4))];
  s.style.left = rand(15, 85) + 'vw';
  s.style.fontSize = rand(20, 36) + 'px';
  s.style.setProperty('--dx', rand(-40, 40) + 'px');
  s.style.animationDuration = rand(4, 7) + 's';
  $('floaters').appendChild(s);
  setTimeout(() => s.remove(), 7000);
}

/* ---------- 11. ENVELOPE / LETTER ---------- */
onActivate($('envelope'), () => {
  const env = $('envelope');
  if (env.classList.contains('open')) return;
  env.classList.add('open');
  $('letterHint').style.visibility = 'hidden';
  confetti(120);
  setTimeout(() => $('letterNext').classList.add('show'), 1200);
});

/* ---------- 12. REPLAY & SCROLL TOP ---------- */
$('replayBtn').addEventListener('click', () => {
  giftOpened = false;
  $('giftBox').classList.remove('open'); $('giftHint').style.visibility = 'visible';
  $('giftMsg').classList.remove('show');
  $('cakeEl').classList.remove('out'); $('wishBtn').style.display = ''; $('cakeHint').style.display = '';
  $('wishMsg').classList.remove('show'); $('cakeNext').classList.remove('show');
  $('envelope').classList.remove('open'); $('letterHint').style.visibility = 'visible';
  $('letterNext').classList.remove('show');
  $('site').classList.add('hidden');
  $('welcome').classList.remove('hidden');
  $('welcome').classList.remove('enter'); void $('welcome').offsetWidth; $('welcome').classList.add('enter');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const scrollBtn = $('scrollTopBtn');
if (scrollBtn) {
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
