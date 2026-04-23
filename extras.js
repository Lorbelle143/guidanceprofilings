// =============================================================
//  NBSC GCO — Extras JS
//  Loading Screen · Dark Mode · Back to Top · Lightbox
//  Announcement Banner · Search/Filter
// =============================================================

// ===== LOADING SCREEN =====
window.addEventListener('load', function () {
  const loader = document.getElementById('loadingScreen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }
});

// ===== ANNOUNCEMENT BANNER =====
const annClose = document.getElementById('annClose');
const annBanner = document.getElementById('announcementBanner');
if (annClose && annBanner) {
  // Restore dismissed state
  if (sessionStorage.getItem('annDismissed')) {
    annBanner.classList.add('dismissed');
  }
  annClose.addEventListener('click', () => {
    annBanner.classList.add('dismissed');
    sessionStorage.setItem('annDismissed', '1');
  });
}

// ===== DARK MODE =====
const darkBtn  = document.getElementById('darkModeToggle');
const darkIcon = document.getElementById('darkModeIcon');

function applyDark(on) {
  document.body.classList.toggle('dark-mode', on);
  if (darkIcon) {
    darkIcon.className = on ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// Restore preference
const savedDark = localStorage.getItem('darkMode') === 'true';
applyDark(savedDark);

if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    applyDark(!isDark);
    localStorage.setItem('darkMode', String(!isDark));
  });
}

// ===== BACK TO TOP =====
const backBtn = document.getElementById('backToTop');
if (backBtn) {
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 400);
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== LIGHTBOX =====
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = lightbox ? lightbox.querySelector('.lightbox-close') : null;
const lightboxOverlay = lightbox ? lightbox.querySelector('.lightbox-overlay') : null;

function openLightbox(src, caption) {
  if (!lightbox) return;
  lightboxImg.src = src;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.lightbox-trigger').forEach(el => {
  el.addEventListener('click', function (e) {
    // Don't trigger if clicking the Facebook link inside
    if (e.target.closest('a')) return;
    const img     = this.querySelector('img');
    const src     = this.dataset.img || (img ? img.src : '');
    const caption = this.dataset.caption || '';
    openLightbox(src, caption);
  });
});

if (lightboxClose)   lightboxClose.addEventListener('click', closeLightbox);
if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===== SEARCH / FILTER — OFFICERS =====
function setupSearch(inputId, clearId, containerId, itemSelector, noResultsId) {
  const input     = document.getElementById(inputId);
  const clearBtn  = document.getElementById(clearId);
  const container = document.getElementById(containerId);
  if (!input || !container) return;

  // Add no-results message
  let noMsg = document.getElementById(noResultsId);
  if (!noMsg) {
    noMsg = document.createElement('div');
    noMsg.id = noResultsId;
    noMsg.className = 'no-results-msg';
    noMsg.innerHTML = '<i class="fas fa-search"></i> No results found.';
    container.parentNode.insertBefore(noMsg, container.nextSibling);
  }

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    const items = container.querySelectorAll(itemSelector);
    let visible = 0;

    items.forEach(item => {
      const text = (item.dataset.search || item.textContent).toLowerCase();
      const show = !q || text.includes(q);
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    noMsg.style.display = visible === 0 ? 'block' : 'none';
    if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  }
}

setupSearch('officerSearch', 'officerClear', 'officersTiles',  '.officer-tile',  'officerNoResults');
setupSearch('memberSearch',  'memberClear',  'membersTiles',   '.member-tile',   'memberNoResults');

// Extend officer search to also cover VP grid and president spotlight
const officerInput = document.getElementById('officerSearch');
if (officerInput) {
  const vpGrid     = document.querySelector('.vp-grid');
  const presSpot   = document.querySelector('.pres-spotlight');
  officerInput.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    // VP tiles
    if (vpGrid) {
      vpGrid.querySelectorAll('.officer-tile').forEach(item => {
        const text = (item.dataset.search || item.textContent).toLowerCase();
        item.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    }
    // President
    if (presSpot) {
      const text = (presSpot.dataset.search || presSpot.textContent).toLowerCase();
      presSpot.style.display = (!q || text.includes(q)) ? '' : 'none';
    }
  });
}

// =============================================================
//  VISUAL ENHANCEMENTS
//  Particles · Animated Counter · Custom Cursor
// =============================================================

// ===== HERO PARTICLES =====
(function () {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x:     randomBetween(0, W),
      y:     randomBetween(0, H),
      r:     randomBetween(1.5, 4),
      dx:    randomBetween(-0.4, 0.4),
      dy:    randomBetween(-0.6, -0.15),
      alpha: randomBetween(0.15, 0.55),
      color: Math.random() > 0.5 ? '78,205,196' : '255,255,255',
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 70 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.0008;

      // Reset when faded or out of bounds
      if (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > W + 10) {
        Object.assign(p, createParticle(), { y: H + 5, alpha: randomBetween(0.15, 0.55) });
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

// ===== ANIMATED COUNTER =====
(function () {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Trigger when hero stats come into view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ===== CUSTOM CURSOR =====
(function () {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .officer-tile, .member-tile, .mod-card, .lightbox-trigger, .stat-box, .contact-info-card';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();
