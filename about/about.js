// Dropdown toggle for About Us pages
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
