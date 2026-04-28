// ===== DROPDOWN TOGGLE =====
const dropdownBtn = document.querySelector('.dropdown-btn');
const navDropdown = document.querySelector('.nav-dropdown');

if (dropdownBtn && navDropdown) {
  dropdownBtn.addEventListener('click', function(e) {
    e.preventDefault();
    navDropdown.classList.toggle('open');
  });
  document.addEventListener('click', function(e) {
    if (!navDropdown.contains(e.target)) {
      navDropdown.classList.remove('open');
    }
  });
}

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
  nav.querySelectorAll('.nav-link:not(.dropdown-btn)').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}
