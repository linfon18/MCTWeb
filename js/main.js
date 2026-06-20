/* ========== MCT Website - Main JavaScript ========== */

(function() {
  'use strict';

  // ===== Random Background =====
  function initRandomBackground() {
    const bgImages = [
      '/assets/background.jpg',
      '/assets/background2.jpg',
      '/assets/background3.jpg',
      '/assets/background4.jpg',
      '/assets/backgroundN1.jpg',
      '/assets/backgroundN2.jpg',
      '/assets/backgroundN3.png',
      '/assets/backgroundN4.jpg',
      '/assets/backgroundN5.jpg',
      '/assets/backgroundN6.jpg'
    ];
    const randomIndex = Math.floor(Math.random() * bgImages.length);
    const selectedBg = bgImages[randomIndex];

    // Apply to body::before via CSS custom property
    document.documentElement.style.setProperty('--bg-image', 'url("' + selectedBg + '")');
  }

  // ===== Theme Toggle =====
  function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('mct-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('mct-theme', next);
      updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
      themeToggle.innerHTML = theme === 'dark' ? '&#9788;' : '&#9790;';
      themeToggle.setAttribute('title', theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
    }
  }

  // ===== Hero Text Adaptive Color =====
  function initHeroTextColor() {
    const heroText = document.querySelector('.hero-text');
    if (!heroText) return;

    // Load all background images and sample brightness
    const bgImages = [
      '/assets/background.jpg',
      '/assets/background2.jpg',
      '/assets/background3.jpg',
      '/assets/background4.jpg',
      '/assets/backgroundN1.jpg',
      '/assets/backgroundN2.jpg',
      '/assets/backgroundN3.png',
      '/assets/backgroundN4.jpg',
      '/assets/backgroundN5.jpg',
      '/assets/backgroundN6.jpg'
    ];

    // Determine which background is currently active
    const bgVar = getComputedStyle(document.documentElement).getPropertyValue('--bg-image').trim();
    // Extract filename from url("...") or url(...)
    const match = bgVar.match(/url\(["']?(.*?)["']?\)/);
    const currentBg = match ? match[1] : bgImages[0];

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      // Sample at reduced resolution for performance
      const w = 64, h = 64;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;

      // Calculate average luminance
      let totalLuminance = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Standard luminance formula
        totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
      }
      const avgLuminance = totalLuminance / (w * h);

      // If bright (luminance > 140), use dark text
      if (avgLuminance > 140) {
        heroText.classList.add('hero-text-light');
      } else {
        heroText.classList.remove('hero-text-light');
      }
    };
    img.src = currentBg;
  }

  // ===== Scroll Progress Bar =====
  function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ===== Navbar Scroll Effect =====
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ===== Mobile Menu Toggle =====
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleBtn.innerHTML = '&#9776;';
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== Intersection Observer for Scroll Animations =====
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-scale, .stagger-children, .reveal-mask').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== Particle System =====
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let isVisible = true;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function createParticles() {
      const count = Math.min(Math.floor(canvas.width * canvas.height / 15000), 80);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 170, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 170, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      if (isVisible) {
        animationId = requestAnimationFrame(drawParticles);
      }
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animationId) {
        drawParticles();
      }
    }, { threshold: 0 });

    visibilityObserver.observe(canvas);

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  // ===== Spotlight Effect =====
  function initSpotlight() {
    document.querySelectorAll('.spotlight').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mouse-x', x + '%');
        el.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // ===== Tilt Effect =====
  function initTilt() {
    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // ===== Counter Animation =====
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = parseInt(el.dataset.duration) || 2000;
          const startTime = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);
            el.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(update);
            }
          }

          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // ===== Smooth Scroll for Anchor Links =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ===== FAQ Accordion =====
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    });
  }

  // ===== Parallax Effect =====
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (!parallaxElements.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ===== Magnetic Button Effect =====
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ===== Active Nav Link =====
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // ===== Button Ripple Effect =====
  function initRipple() {
    document.querySelectorAll('.btn-ripple').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);pointer-events:none;transform:scale(0);animation:ripple-anim 0.6s ease-out forwards;';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.marginLeft = -Math.max(rect.width, rect.height) / 2 + 'px';
        ripple.style.marginTop = -Math.max(rect.width, rect.height) / 2 + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple keyframes
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = '@keyframes ripple-anim{to{transform:scale(2.5);opacity:0;}}';
      document.head.appendChild(style);
    }
  }

  // ===== Card Glow Mouse Follow =====
  function initCardGlow() {
    document.querySelectorAll('.card-glow').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--glow-x', x + 'px');
        card.style.setProperty('--glow-y', y + 'px');
      });
    });
  }

  // ===== Cursor Glow Trail =====
  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!glow.classList.contains('active')) {
        glow.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
    });

    function animate() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== Hero Parallax on Mouse Move =====
  function initHeroParallax() {
    const heroContent = document.getElementById('hero-content');
    if (!heroContent || window.matchMedia('(max-width: 1024px)').matches) return;

    const hero = heroContent.closest('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroContent.style.transform = `translate(${x * -12}px, ${y * -8}px)`;

      const orbs = hero.querySelectorAll('.orb');
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 8;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });

    hero.addEventListener('mouseleave', () => {
      heroContent.style.transition = 'transform 0.5s ease';
      heroContent.style.transform = 'translate(0, 0)';
      hero.querySelectorAll('.orb').forEach(orb => {
        orb.style.transition = 'transform 0.5s ease';
        orb.style.transform = 'translate(0, 0)';
      });
      setTimeout(() => {
        heroContent.style.transition = '';
        hero.querySelectorAll('.orb').forEach(orb => { orb.style.transition = ''; });
      }, 500);
    });
  }

  // ===== Text Decode Animation =====
  function initTextDecode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const originalText = el.dataset.originalText;
          if (!originalText || el.dataset.decoded === 'true') return;

          el.dataset.decoded = 'true';
          el.textContent = '';

          const charSpans = [];
          for (let i = 0; i < originalText.length; i++) {
            const span = document.createElement('span');
            span.className = 'decode-char';
            span.style.animationDelay = (i * 0.04) + 's';
            el.appendChild(span);
            charSpans.push(span);
          }

          let step = 0;
          const totalSteps = 8;

          function scramble() {
            charSpans.forEach((span, i) => {
              if (step < totalSteps) {
                if (Math.random() < 0.4 + (step / totalSteps) * 0.5) {
                  span.textContent = chars[Math.floor(Math.random() * chars.length)];
                } else {
                  span.textContent = originalText[i] || '';
                }
              } else {
                span.textContent = originalText[i] || '';
              }
            });
            step++;
            if (step <= totalSteps) {
              setTimeout(scramble, 60);
            }
          }

          scramble();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section-header h2').forEach(h2 => {
      const text = h2.textContent.trim();
      if (text && !h2.dataset.originalText) {
        h2.dataset.originalText = text;
        observer.observe(h2);
      }
    });
  }

  // ===== Initialize All =====
  function init() {
    initRandomBackground();
    initHeroTextColor();
    initTheme();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initParticles();
    initSpotlight();
    initTilt();
    initCounters();
    initSmoothScroll();
    initFAQ();
    initParallax();
    initMagnetic();
    initActiveNav();
    initRipple();
    initCardGlow();
    initCursorGlow();
    initHeroParallax();
    initTextDecode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
