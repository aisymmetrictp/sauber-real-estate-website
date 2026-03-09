/* ============================================
   SAUBER REAL ESTATE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Navigation Toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
      });
    });
  }

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked if not already active
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Animate on Scroll (simple) ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.listing-card, .service-card, .testimonial-card, .community-card, .stat-card, .process-step, .contact-info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add animate-in class styles
  const style = document.createElement('style');
  style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  // ---------- Contact Form Handler ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      console.log('Form submission:', data);

      // Show success message
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = '#2d5016';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ---------- CMA Valuation Form Handler ----------
  const valuationForm = document.getElementById('valuationForm');
  if (valuationForm) {
    valuationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = valuationForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Request Submitted!';
      btn.style.background = '#2d5016';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        valuationForm.reset();
      }, 3000);
    });
  }

  // ---------- Property Search Form ----------
  const searchForm = document.getElementById('propertySearch');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // IDX integration point - this would connect to the MLS/IDX provider
      console.log('Property search submitted - IDX integration point');
      alert('Property search will be powered by your IDX/MLS provider. Connect your IDX API key to enable live search.');
    });
  }

  // ---------- Counter Animation ----------
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(start + (target - start) * eased);
        counter.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counters when stats section is visible
  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

});
