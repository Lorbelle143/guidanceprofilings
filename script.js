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


// ===== EMAILJS INIT =====
// Sign up free at https://www.emailjs.com, create a service + template,
// then replace the three IDs below.
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // Account → API Keys
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // Email Services tab
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // Email Templates tab

(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name     = document.getElementById('from_name').value.trim();
    const email    = document.getElementById('from_email').value.trim();
    const concern  = document.getElementById('concern').value || 'General Inquiry';
    const message  = document.getElementById('message').value.trim();
    const sendBtn  = document.getElementById('sendBtn');
    const feedback = document.getElementById('formFeedback');

    // Basic validation
    if (!name || !email || !message) {
      showFeedback(feedback, 'error', '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.');
      return;
    }

    // Toggle loading state
    sendBtn.disabled = true;
    sendBtn.querySelector('.btn-send-text').style.display = 'none';
    sendBtn.querySelector('.btn-send-loading').style.display = 'flex';
    feedback.style.display = 'none';

    // If EmailJS is configured, use it; otherwise fall back to Gmail compose
    if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name:  name,
          from_email: email,
          concern:    concern,
          message:    message,
          to_email:   'gco@nbsc.edu.ph',
        });
        showFeedback(feedback, 'success', '<i class="fas fa-check-circle"></i> Message sent! We\'ll get back to you soon.');
        form.reset();
      } catch (err) {
        showFeedback(feedback, 'error', '<i class="fas fa-times-circle"></i> Failed to send. Please try emailing us directly at gco@nbsc.edu.ph');
      }
    } else {
      // Fallback: open Gmail compose pre-filled
      const subject = encodeURIComponent(`[${concern}] Message from ${name}`);
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nConcern: ${concern}\n\nMessage:\n${message}`);
      window.open(`https://mail.google.com/mail/?view=cm&to=gco@nbsc.edu.ph&su=${subject}&body=${body}`, '_blank');
      showFeedback(feedback, 'success', '<i class="fas fa-external-link-alt"></i> Gmail opened in a new tab. Please send the pre-filled email.');
      form.reset();
    }

    // Restore button
    sendBtn.disabled = false;
    sendBtn.querySelector('.btn-send-text').style.display = 'flex';
    sendBtn.querySelector('.btn-send-loading').style.display = 'none';
  });
}

function showFeedback(el, type, html) {
  el.className = 'form-feedback ' + type;
  el.innerHTML = html;
  el.style.display = 'flex';
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
