/* ============================================================
   Portfolio – Muhammad Zubair
   script.js: Navbar, mobile menu, typewriter, reveal, form
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR — scroll state & active link tracking
  ---------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function updateNavbar() {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function updateActiveLink() {
    let current = '';
    const offset = 120;

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveLink();
  }, { passive: true });

  updateNavbar();
  updateActiveLink();

  /* ----------------------------------------------------------
     2. MOBILE MENU — hamburger toggle
  ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  function openMenu() {
    navMenu.classList.add('open');
    navOverlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navOverlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);

  /* Close menu when a nav link is clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ----------------------------------------------------------
     3. TYPEWRITER EFFECT — hero title
  ---------------------------------------------------------- */
  const typewriterEl = document.getElementById('typewriterText');

  if (typewriterEl) {
    const roles = [
      'Mobile App Developer',
      'React Native Engineer',
      'TypeScript Developer',
      'UI/UX Implementer',
    ];

    let roleIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;
    let paused     = false;

    function typeStep() {
      const current = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        /* Pause at end of word */
        if (paused) {
          paused = false;
          isDeleting = true;
          delay = 1800;
        } else {
          paused = true;
          delay = 1800;
        }
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        delay = 350;
      }

      setTimeout(typeStep, delay);
    }

    /* Start after initial hero animations settle */
    setTimeout(typeStep, 1200);
  }

  /* ----------------------------------------------------------
     4. SCROLL-REVEAL — Intersection Observer
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            /* Stagger children inside grids */
            const parent = entry.target.closest('.skills-grid, .projects-grid, .about-stats');
            if (parent) {
              const siblings = Array.from(parent.querySelectorAll('.reveal'));
              const idx = siblings.indexOf(entry.target);
              entry.target.style.transitionDelay = `${idx * 70}ms`;
            }
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    /* Fallback: show all instantly */
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     5. CONTACT FORM — validation & feedback
  ---------------------------------------------------------- */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = document.getElementById('btnText');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    function getField(id) { return document.getElementById(id); }
    function getError(id) { return document.getElementById(id + 'Error'); }

    function setError(id, msg) {
      const field = getField(id);
      const err   = getError(id);
      if (field) field.classList.toggle('error', !!msg);
      if (err)   err.textContent = msg || '';
    }

    function clearErrors() {
      ['name', 'email', 'message'].forEach(id => setError(id, ''));
    }

    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      let valid = true;
      const name    = getField('name').value.trim();
      const email   = getField('email').value.trim();
      const message = getField('message').value.trim();

      if (!name) {
        setError('name', 'Name is required.');
        valid = false;
      } else if (name.length < 2) {
        setError('name', 'Name must be at least 2 characters.');
        valid = false;
      }

      if (!email) {
        setError('email', 'Email is required.');
        valid = false;
      } else if (!validateEmail(email)) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      }

      if (!message) {
        setError('message', 'Message is required.');
        valid = false;
      } else if (message.length < 10) {
        setError('message', 'Message must be at least 10 characters.');
        valid = false;
      }

      return valid;
    }

    /* Clear per-field errors on input */
    ['name', 'email', 'message'].forEach(id => {
      const el = getField(id);
      if (el) el.addEventListener('input', () => setError(id, ''));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();

      if (!validate()) return;

      /* Simulate async submission */
      submitBtn.disabled = true;
      btnText.textContent = 'Sending…';

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        form.reset();
        formSuccess.classList.add('show');

        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1400);
    });
  }

  /* ----------------------------------------------------------
     6. FOOTER — current year
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL — progressive enhancement
     (CSS scroll-behavior handles most cases; this catches
      cases where the browser doesn't support it)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      if (!CSS.supports('scroll-behavior', 'smooth')) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
