/* ─────────────────────────────────────────────
   PARNA BLOOM THERAPY  ·  script.js
   ───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ─── SCROLL REVEAL ─── */
  const reveals = document.querySelectorAll('[data-reveal], [data-reveal-delay]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  /* ─── SERVICES TABS ─── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(`tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Trigger reveal on newly-shown cards
        panel.querySelectorAll('[data-reveal]').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 50);
        });
      }
    });
  });
  // Init first panel
  const firstPanel = document.getElementById('tab-unnamed');
  if (firstPanel) {
    setTimeout(() => {
      firstPanel.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
    }, 300);
  }

  /* ─── TESTIMONIALS SLIDER ─── */
  const cards    = document.querySelectorAll('.testi-card');
  const dotsWrap = document.getElementById('testiDots');
  let current    = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    cards[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (idx + cards.length) % cards.length;
    cards[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  // Show first
  cards[0]?.classList.add('active');
  resetTimer();

  document.getElementById('testiPrev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('testiNext')?.addEventListener('click', () => goTo(current + 1));

  // Pause on hover
  const sliderEl = document.querySelector('.testimonials-slider');
  sliderEl?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  sliderEl?.addEventListener('mouseleave', resetTimer);

  // Touch/swipe support
  let touchStartX = 0;
  sliderEl?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  sliderEl?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1);
  });

  /* ─── FAQ ACCORDION ─── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(f => f.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data    = new FormData(form);
    const name    = (data.get('name') || '').trim();
    const concern = (data.get('concern') || '').trim();
    if (!name) { showToast('Please enter your name.', 'error'); return; }

    const msg = `Hi Aparna, my name is ${name}. ${concern ? 'I wanted to reach out about: ' + concern : 'I\'d like to book a consultation.'}`;
    const waUrl = `https://wa.me/918529937305?text=${encodeURIComponent(msg)}`;
    showToast('Redirecting to WhatsApp…', 'success');
    setTimeout(() => window.open(waUrl, '_blank'), 800);
    form.reset();
  });

  function showToast(msg, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '5rem',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: type === 'success' ? '#25d366' : '#e05252',
      color: 'white',
      padding: '0.75rem 1.75rem',
      borderRadius: '50px',
      fontSize: '0.9rem',
      fontWeight: '500',
      zIndex: '9999',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      transition: 'opacity 0.4s, transform 0.4s',
      opacity: '0',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* ─── SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 12;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── ACTIVE NAV LINK HIGHLIGHT ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active-link'));
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        link?.classList.add('active-link');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => activeObserver.observe(s));

  /* ─── STAGGERED CARD ANIMATION ─── */
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const parent = entry.target;
      parent.querySelectorAll('[data-reveal]').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 100);
      });
      cardObserver.unobserve(parent);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.services-grid, .why-grid, .about-creds').forEach(g => cardObserver.observe(g));

  /* ─── WhatsApp button hide on footer ─── */
  const waFloat = document.getElementById('waFloat');
  const footer  = document.querySelector('.footer');
  if (waFloat && footer) {
    const waObserver = new IntersectionObserver(entries => {
      waFloat.style.opacity = entries[0].isIntersecting ? '0' : '1';
      waFloat.style.pointerEvents = entries[0].isIntersecting ? 'none' : 'auto';
    }, { threshold: 0.3 });
    waObserver.observe(footer);
  }

  /* ─── PARALLAX on hero orbs (subtle) ─── */
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 10;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });

});