/* ============================================
   SCRIPT.JS — Cinematic Portfolio Engine
   Lenis Smooth Scroll + GSAP + Particles
   Award-Winning Single-Page Architecture
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════
  // FLOATING PARTICLES BACKGROUND
  // ═══════════════════════════════════════════
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.7 ? 72 : (Math.random() > 0.5 ? 40 : 220);
        this.life = Math.random() * 300 + 200;
        this.maxLife = this.life;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        // Mouse interaction
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }

        // Fade at end of life
        if (this.life < 50) {
          this.opacity *= 0.97;
        }

        // Respawn
        if (this.life <= 0 || this.x < -20 || this.x > canvas.width + 20 ||
            this.y < -20 || this.y > canvas.height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 70%, 70%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.fillStyle = `hsl(${this.hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles (fewer on mobile)
    const count = window.innerWidth > 768 ? 60 : 25;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // Draw connections between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = 'rgba(201, 243, 29, 0.5)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      animId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animate();
      }
    });
  }

  // ═══════════════════════════════════════════
  // LOADER
  // ═══════════════════════════════════════════
  const loader = document.querySelector('.loader');
  const loaderCount = document.querySelector('.loader-count');
  const loaderBar = document.querySelector('.loader-bar');
  let progress = 0;
  let pageInitialised = false;

  function runLoader() {
    if (!loader) { safeInitPage(); return; }

    const interval = setInterval(() => {
      progress += Math.random() * 12 + 2;
      if (progress > 100) progress = 100;

      if (loaderCount) loaderCount.textContent = Math.floor(progress);
      if (loaderBar) loaderBar.style.width = progress + '%';

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(loader, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut',
            onComplete: () => {
              loader.remove();
              safeInitPage();
            }
          });
        }, 400);
      }
    }, 80);
  }

  // Safety fallback
  setTimeout(() => {
    if (loader && loader.parentNode) {
      loader.remove();
    }
    safeInitPage();
  }, 5000);

  function safeInitPage() {
    if (pageInitialised) return;
    pageInitialised = true;
    initPage();
  }

  runLoader();

  // ═══════════════════════════════════════════
  // INIT PAGE
  // ═══════════════════════════════════════════
  function initPage() {
    gsap.registerPlugin(ScrollTrigger);
    initParticles();
    initLenisScroll();
    initCursor();
    initNavbar();
    initHeroAnimations();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initProjectFilter();
    initContactForm();
    initMagneticButtons();
    initTimeline();
    initMarquee();
    initScrollProgress();
    initTiltCards();
    initGlobalAnimations();
  }

  // ═══════════════════════════════════════════
  // LENIS SMOOTH SCROLL
  // ═══════════════════════════════════════════
  let lenis;

  function initLenisScroll() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ═══════════════════════════════════════════
  // CUSTOM CURSOR
  // ═══════════════════════════════════════════
  function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const circle = document.querySelector('.cursor-circle');
    const label = document.querySelector('.cursor-label');

    if (!dot || !circle || window.innerWidth <= 768) return;

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateCircle() {
      circleX += (mouseX - circleX) * 0.12;
      circleY += (mouseY - circleY) * 0.12;
      circle.style.left = circleX + 'px';
      circle.style.top = circleY + 'px';

      if (label) {
        label.style.left = circleX + 'px';
        label.style.top = (circleY - 40) + 'px';
      }
      requestAnimationFrame(animateCircle);
    }
    animateCircle();

    // Hover targets
    const hoverables = document.querySelectorAll(
      'a, button, .btn, .project-card, .skill-card, .cert-card, .social-btn, .filter-pill, input, textarea'
    );
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hovering');
        circle.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hovering');
        circle.classList.remove('is-hovering');
      });
    });

    // Cursor label on project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (label) {
          label.textContent = 'View Project';
          label.classList.add('visible');
        }
      });
      card.addEventListener('mouseleave', () => {
        if (label) label.classList.remove('visible');
      });
    });
  }

  // ═══════════════════════════════════════════
  // NAVBAR
  // ═══════════════════════════════════════════
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      });
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    // Mobile menu
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menuBtn.classList.remove('active');
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    if (sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('.nav-links a').forEach(a => {
              const href = a.getAttribute('href');
              a.classList.toggle('active', href === `#${id}`);
            });
          }
        });
      }, { rootMargin: '-30% 0px -70% 0px' });

      sections.forEach(s => observer.observe(s));
    }

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#') { e.preventDefault(); return; }
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = navbar ? navbar.offsetHeight : 80;
          const y = target.getBoundingClientRect().top + window.scrollY - offset;

          if (lenis) {
            lenis.scrollTo(y, { duration: 1.6 });
          } else {
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // HERO ANIMATIONS — Cinematic Intro
  // ═══════════════════════════════════════════
  function initHeroAnimations() {
    const heroLines = document.querySelectorAll('.hero-heading .line-inner');
    const eyebrow = document.querySelector('.hero-eyebrow');
    const bottom = document.querySelector('.hero-bottom');
    const scrollHint = document.querySelector('.hero-scroll-hint');
    const heroProfile = document.querySelector('.hero-profile');

    if (!heroLines.length) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // Text line reveals
    tl.to(heroLines, {
      y: '0%',
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out',
    });

    if (eyebrow) {
      tl.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6');
    }

    if (bottom) {
      tl.to(bottom, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4');
    }

    // Profile photo entrance
    if (heroProfile) {
      tl.fromTo(heroProfile, {
        scale: 0.8,
        opacity: 0,
        rotate: -5,
      }, {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 1,
        ease: 'power3.out',
      }, '-=1');
    }

    if (scrollHint) {
      tl.to(scrollHint, {
        opacity: 1,
        duration: 0.6,
      }, '-=0.2');
    }

    // Parallax gradients on scroll
    gsap.utils.toArray('.hero-gradient').forEach((blob, i) => {
      gsap.to(blob, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: (i + 1) * 100,
        scale: 0.8,
        opacity: 0,
      });
    });

    // Orbs parallax
    gsap.utils.toArray('.hero-orb').forEach((orb, i) => {
      gsap.to(orb, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
        y: (i + 1) * 80,
        opacity: 0,
      });
    });

    // Hero content parallax on scroll
    const heroSplit = document.querySelector('.hero-split');
    if (heroSplit) {
      gsap.to(heroSplit, {
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 120,
        opacity: 0,
      });
    }
  }

  // ═══════════════════════════════════════════
  // SCROLL-TRIGGERED ANIMATIONS
  // ═══════════════════════════════════════════
  function initScrollAnimations() {

    // All data-animate elements
    document.querySelectorAll('[data-animate]').forEach((el) => {
      const type = el.getAttribute('data-animate');
      const delay = parseFloat(el.getAttribute('data-delay') || 0);

      const from = { opacity: 0 };
      if (type === 'slide-up' || type === '') from.y = 50;
      else if (type === 'slide-left') from.x = -50;
      else if (type === 'slide-right') from.x = 50;
      else if (type === 'scale') from.scale = 0.9;

      gsap.fromTo(el, from, {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: 0.9, delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.from(header, {
        scrollTrigger: { trigger: header, start: 'top 85%' },
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
    });

    // Skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length) {
      gsap.fromTo(skillCards, 
        { y: 60, opacity: 0 },
        {
          scrollTrigger: { trigger: '.skills-grid', start: 'top 85%' },
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        }
      );
    }

    // Project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        y: 70, opacity: 0, duration: 0.7, delay: i * 0.08, ease: 'power3.out',
      });
    });

    // Cert cards
    gsap.utils.toArray('.cert-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        y: 50, scale: 0.95, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'power3.out',
      });
    });

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      const dir = i % 2 === 0 ? -60 : 60;
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        x: dir, opacity: 0, duration: 0.8, ease: 'power3.out',
      });
    });

    // Timeline dots
    gsap.utils.toArray('.timeline-dot').forEach(dot => {
      gsap.from(dot, {
        scrollTrigger: { trigger: dot, start: 'top 85%' },
        scale: 0, duration: 0.5, ease: 'back.out(2)',
      });
    });

    // Featured
    const featuredVisual = document.querySelector('.featured-visual');
    if (featuredVisual) {
      gsap.from(featuredVisual, {
        scrollTrigger: { trigger: featuredVisual, start: 'top 85%' },
        x: -80, opacity: 0, duration: 1, ease: 'power3.out',
      });
    }
    const featuredContent = document.querySelector('.featured-content');
    if (featuredContent) {
      gsap.from(featuredContent, {
        scrollTrigger: { trigger: featuredContent, start: 'top 85%' },
        x: 80, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out',
      });
    }

    // Contact fields
    gsap.utils.toArray('.form-field').forEach((field, i) => {
      gsap.from(field, {
        scrollTrigger: { trigger: field, start: 'top 90%' },
        y: 30, opacity: 0, duration: 0.5, delay: i * 0.08, ease: 'power3.out',
      });
    });

    // Social buttons
    gsap.utils.toArray('.social-btn').forEach((btn, i) => {
      gsap.from(btn, {
        scrollTrigger: { trigger: btn.parentElement, start: 'top 85%' },
        scale: 0, opacity: 0, duration: 0.4, delay: i * 0.08, ease: 'back.out(2)',
      });
    });

    // About stats
    gsap.utils.toArray('.about-stat').forEach((stat, i) => {
      gsap.from(stat, {
        scrollTrigger: { trigger: stat, start: 'top 88%' },
        y: 40, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out',
      });
    });

    // About content paragraphs
    document.querySelectorAll('.about-text').forEach((text, i) => {
      gsap.from(text, {
        scrollTrigger: { trigger: text, start: 'top 88%' },
        y: 30, opacity: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
      });
    });

    // About visual
    const aboutVisual = document.querySelector('.about-visual');
    if (aboutVisual) {
      gsap.from(aboutVisual, {
        scrollTrigger: { trigger: aboutVisual, start: 'top 85%' },
        x: -60, opacity: 0, duration: 1, ease: 'power3.out',
      });
    }

    // Filter pills
    const filterPills = document.querySelectorAll('.filter-pill');
    if (filterPills.length) {
      gsap.from(filterPills, {
        scrollTrigger: { trigger: '.projects-filter', start: 'top 88%' },
        y: 20, opacity: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out',
      });
    }

    // Contact sections
    const contactLeft = document.querySelector('.contact-left');
    if (contactLeft) {
      gsap.from(contactLeft, {
        scrollTrigger: { trigger: contactLeft, start: 'top 85%' },
        x: -60, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
    }
    const contactFormCard = document.querySelector('.contact-form-card');
    if (contactFormCard) {
      gsap.from(contactFormCard, {
        scrollTrigger: { trigger: contactFormCard, start: 'top 85%' },
        x: 60, opacity: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
      });
    }

    // Section glow dividers
    gsap.utils.toArray('.section-glow').forEach(glow => {
      gsap.fromTo(glow, { scaleX: 0 }, {
        scrollTrigger: { trigger: glow, start: 'top 95%' },
        scaleX: 1, duration: 1.2, ease: 'power3.out',
      });
    });
  }

  // ═══════════════════════════════════════════
  // 3D TILT ON CARDS (Premium Effect)
  // ═══════════════════════════════════════════
  function initTiltCards() {
    if (window.innerWidth <= 768) return;

    const cards = document.querySelectorAll('.project-card, .cert-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // ═══════════════════════════════════════════
  // SKILL BARS
  // ═══════════════════════════════════════════
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const fill = bar.getAttribute('data-fill');
          if (fill) bar.style.width = fill + '%';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  }

  // ═══════════════════════════════════════════
  // COUNTERS
  // ═══════════════════════════════════════════
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(target * ease) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // ═══════════════════════════════════════════
  // PROJECT FILTER
  // ═══════════════════════════════════════════
  function initProjectFilter() {
    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.project-card');
    if (!pills.length || !cards.length) return;

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter');

        let visibleIndex = 0;
        cards.forEach((card) => {
          const cat = card.getAttribute('data-category');
          const show = filter === 'all' || cat === filter;

          if (show) {
            card.style.display = '';
            gsap.fromTo(card,
              { opacity: 0, y: 40, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: visibleIndex * 0.06, ease: 'power3.out' }
            );
            visibleIndex++;
          } else {
            gsap.to(card, {
              opacity: 0, y: 20, scale: 0.95, duration: 0.3,
              onComplete: () => { card.style.display = 'none'; }
            });
          }
        });
      });
    });
  }

  // ═══════════════════════════════════════════
  // CONTACT FORM
  // ═══════════════════════════════════════════
  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit .btn');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = '#10b981';
      btn.style.borderColor = '#10b981';

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        form.reset();
      }, 2500);
    });
  }

  // ═══════════════════════════════════════════
  // MAGNETIC BUTTONS
  // ═══════════════════════════════════════════
  function initMagneticButtons() {
    if (window.innerWidth <= 768) return;

    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ═══════════════════════════════════════════
  // TIMELINE LINE FILL
  // ═══════════════════════════════════════════
  function initTimeline() {
    const fill = document.querySelector('.timeline-line-fill');
    if (!fill) return;

    ScrollTrigger.create({
      trigger: '.timeline',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1,
      onUpdate: (self) => {
        fill.style.height = (self.progress * 100) + '%';
      }
    });
  }

  // ═══════════════════════════════════════════
  // MARQUEE
  // ═══════════════════════════════════════════
  function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;

    const items = track.innerHTML;
    track.innerHTML = items + items;
  }

  // ═══════════════════════════════════════════
  // SCROLL PROGRESS BAR
  // ═══════════════════════════════════════════
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    });
  }

  // ═══════════════════════════════════════════
  // GLOBAL ANIMATIONS (called inside initPage)
  // ═══════════════════════════════════════════
  function initGlobalAnimations() {
    // Nav entrance
    gsap.from('.navbar', {
      y: -60, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out',
    });

    // Parallax background shapes
    gsap.utils.toArray('.hero-gradient').forEach((el, i) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el.closest('section') || el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
        y: (i % 2 === 0) ? -80 : 80,
        x: (i % 2 === 0) ? 40 : -40,
      });
    });
  }
});
