/* ============================================================
   Portfolio – Muhammad Zubair
   script.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR — scroll state
  ---------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function updateNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 110) {
        current = s.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', () => {
    updateNavScroll();
    updateActiveLink();
  }, { passive: true });

  updateNavScroll();
  updateActiveLink();

  /* ----------------------------------------------------------
     2. MOBILE MENU
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
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  navOverlay.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ----------------------------------------------------------
     3. PROFILE IMAGE FALLBACK
  ---------------------------------------------------------- */
  const avatarImg      = document.getElementById('avatarImg');
  const avatarFallback = document.getElementById('avatarFallback');

  if (avatarImg) {
    avatarImg.addEventListener('error', () => {
      avatarImg.style.display = 'none';
      if (avatarFallback) avatarFallback.classList.add('show');
    });
    /* If already broken (cached error) */
    if (avatarImg.complete && !avatarImg.naturalWidth) {
      avatarImg.style.display = 'none';
      if (avatarFallback) avatarFallback.classList.add('show');
    }
  }

  /* ----------------------------------------------------------
     4. TYPEWRITER EFFECT
  ---------------------------------------------------------- */
  const twEl = document.getElementById('typewriterText');

  if (twEl) {
    const roles = [
      'React Native Developer',
      'Mobile App Developer',
      'TypeScript Engineer',
      'Android & iOS Developer',
    ];

    let roleIdx    = 0;
    let charIdx    = 0;
    let deleting   = false;
    let pauseTimer = null;

    function step() {
      const current = roles[roleIdx];

      if (deleting) {
        twEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
      } else {
        twEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
      }

      let delay = deleting ? 38 : 78;

      if (!deleting && charIdx === current.length) {
        pauseTimer = setTimeout(() => {
          deleting = true;
          step();
        }, 1900);
        return;
      }

      if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        delay    = 320;
      }

      setTimeout(step, delay);
    }

    setTimeout(step, 1100);

    /* Cleanup on page unload */
    window.addEventListener('beforeunload', () => clearTimeout(pauseTimer));
  }

  /* ----------------------------------------------------------
     5. SCROLL-REVEAL (Intersection Observer)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        /* Stagger siblings inside grid/flex containers */
        const gridParent = entry.target.closest(
          '.skills-categories, .projects-grid, .about-stats, .tools-grid, .certs-grid'
        );
        if (gridParent) {
          const siblings = Array.from(gridParent.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 65}ms`;
        }

        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     6. CONTACT FORM
  ---------------------------------------------------------- */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const btnText     = document.getElementById('btnText');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    const fields = {
      fname:  { el: document.getElementById('fname'),  errEl: document.getElementById('fnameError') },
      femail: { el: document.getElementById('femail'), errEl: document.getElementById('femailError') },
      fmsg:   { el: document.getElementById('fmsg'),   errEl: document.getElementById('fmsgError') },
    };

    function setError(key, msg) {
      const { el, errEl } = fields[key];
      el.classList.toggle('error', !!msg);
      errEl.textContent = msg || '';
    }

    function clearAll() {
      Object.keys(fields).forEach(k => setError(k, ''));
    }

    function isValidEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function validate() {
      let ok = true;
      const name  = fields.fname.el.value.trim();
      const email = fields.femail.el.value.trim();
      const msg   = fields.fmsg.el.value.trim();

      if (!name || name.length < 2) {
        setError('fname', name ? 'Name must be at least 2 characters.' : 'Name is required.');
        ok = false;
      }
      if (!email) {
        setError('femail', 'Email is required.');
        ok = false;
      } else if (!isValidEmail(email)) {
        setError('femail', 'Please enter a valid email address.');
        ok = false;
      }
      if (!msg || msg.length < 10) {
        setError('fmsg', msg ? 'Message must be at least 10 characters.' : 'Message is required.');
        ok = false;
      }
      return ok;
    }

    /* Clear error on input */
    Object.entries(fields).forEach(([key, { el }]) => {
      el.addEventListener('input', () => setError(key, ''));
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      clearAll();
      if (!validate()) return;

      submitBtn.disabled = true;
      btnText.textContent = 'Sending…';

      /* Simulated async submission — replace with real endpoint */
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        form.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5500);
      }, 1400);
    });
  }

  /* ----------------------------------------------------------
     7. FOOTER YEAR
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     8. SMOOTH SCROLL POLYFILL (for browsers without native support)
  ---------------------------------------------------------- */
  if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

})();
