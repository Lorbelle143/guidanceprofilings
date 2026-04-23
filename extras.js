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
