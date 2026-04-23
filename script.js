// ===== ABOUT US DROPDOWN — CLICK TO TOGGLE =====
const dropdownBtn = document.querySelector('.dropdown-btn');
const navDropdown = document.querySelector('.nav-dropdown');

if (dropdownBtn && navDropdown) {
  dropdownBtn.addEventListener('click', function(e) {
    e.preventDefault();
    navDropdown.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!navDropdown.contains(e.target)) {
      navDropdown.classList.remove('open');
    }
  });
}


const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = document.getElementById('from_name').value.trim();
    const email   = document.getElementById('from_email').value.trim();
    const concern = document.getElementById('concern').value || 'General Inquiry';
    const message = document.getElementById('message').value.trim();
    const to      = 'gco@nbsc.edu.ph';
    const subject = encodeURIComponent(`[${concern}] Message from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nConcern: ${concern}\n\nMessage:\n${message}`);
    window.open(`https://mail.google.com/mail/?view=cm&to=${to}&su=${subject}&body=${body}`, '_blank');
    const btn = this.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-check"></i> Opening Gmail...';
    btn.style.background = '#27ae60';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
      this.reset();
    }, 3000);
  });
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.mod-card, .officer-tile, .member-tile, .pres-spotlight, .contact-detail-item, .org-upper-node, .org-card, .stat-box').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
  });
});

// ===== HAMBURGER MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.innerHTML = nav.classList.contains('open')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
  // Close when clicking a nav link
  nav.querySelectorAll('.nav-link:not(.dropdown-btn)').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}
