(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav mobile toggle ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Utility: observe once ---- */
  function observeOnce(selector, callback, options) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
    var opts = Object.assign({ threshold: 0.18, rootMargin: '0px 0px -40px 0px' }, options || {});
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          callback(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, opts);
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Connected source mini charts ---- */
  (function () {
    var sourceCharts = document.querySelectorAll('[data-source-chart]');
    if (!sourceCharts.length) return;

    if (prefersReducedMotion) {
      sourceCharts.forEach(function (chart) {
        chart.classList.add('visible');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      sourceCharts.forEach(function (chart) {
        chart.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    sourceCharts.forEach(function (chart) {
      observer.observe(chart);
    });
  }());

  /* ---- Scroll-driven analytics decoration ---- */
  (function () {
    var art = document.querySelector('[data-analytics-scroll]');
    var section = document.querySelector('.section-features');
    if (!art || !section) return;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function render() {
      var rect = section.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      var progress = clamp((viewport - rect.top) / (rect.height + viewport), 0, 1);
      var eased = 1 - Math.pow(1 - progress, 3);

      art.style.setProperty('--scroll-progress', eased.toFixed(3));
      art.style.setProperty('--bar-1', (0.16 + eased * 0.54).toFixed(3));
      art.style.setProperty('--bar-2', (0.28 + eased * 0.62).toFixed(3));
      art.style.setProperty('--bar-3', (0.12 + eased * 0.46).toFixed(3));
      art.style.setProperty('--bar-4', (0.36 + eased * 0.5).toFixed(3));
      art.style.setProperty('--line-progress', clamp(eased * 1.15, 0, 1).toFixed(3));
      art.style.setProperty('--data-opacity', (0.08 + eased * 0.12).toFixed(3));
      art.style.setProperty('--data-x', ((1 - eased) * 34).toFixed(1) + 'px');
    }

    if (prefersReducedMotion) {
      art.style.setProperty('--scroll-progress', '1');
      art.style.setProperty('--bar-1', '0.7');
      art.style.setProperty('--bar-2', '0.9');
      art.style.setProperty('--bar-3', '0.58');
      art.style.setProperty('--bar-4', '0.86');
      art.style.setProperty('--line-progress', '1');
      art.style.setProperty('--data-opacity', '0.11');
      art.style.setProperty('--data-x', '0px');
      return;
    }

    var ticking = false;
    function requestRender() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        render();
        ticking = false;
      });
    }

    render();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
  }());


  /* ---- Feature block animations ---- */
  (function () {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.feature-block').forEach(function (block) {
      var copy    = block.querySelector('.feature-copy');
      var visual  = block.querySelector('.feature-visual');

      if (copy)   copy.classList.add('anim-fade-up');
      if (visual) visual.classList.add('anim-slide-right');

      var triggered = false;
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            if (copy)   copy.classList.add('visible');
            setTimeout(function () {
              if (visual) visual.classList.add('visible');
            }, 150);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      observer.observe(block);
    });
  }());

  /* ---- How it works step sequence ---- */
  (function () {
    var stepsGrid = document.querySelector('.steps-grid');
    if (!stepsGrid) return;

    var steps = stepsGrid.querySelectorAll('.step');

    if (prefersReducedMotion) {
      steps.forEach(function (s) { s.classList.add('visible'); });
      return;
    }

    var triggered = false;
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          steps.forEach(function (step, i) {
            setTimeout(function () {
              step.classList.add('visible');
            }, i * 390);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(stepsGrid);
  }());

  /* ---- FAQ accordion ---- */
  (function () {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var btn  = item.querySelector('.faq-btn');
      var body = item.querySelector('.faq-body');
      if (!btn || !body) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
            var ob = other.querySelector('.faq-body');
            if (ob) ob.style.maxHeight = '0';
            var obtn = other.querySelector('.faq-btn');
            if (obtn) obtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          body.style.maxHeight = '0';
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }());

  /* ---- FIX 7A: section entrance — background-color transition when sections enter viewport ---- */
  (function () {
    if (prefersReducedMotion) return;
    var sections = document.querySelectorAll('section');
    if (!sections.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.08 });
    sections.forEach(function (s) { observer.observe(s); });
  }());

  /* ---- FIX 7B: problem rule — expands from 0 to 48px on scroll into view ---- */
  (function () {
    var rule = document.querySelector('.problem-rule');
    if (!rule) return;
    if (prefersReducedMotion) {
      rule.style.width = '48px';
      return;
    }
    var triggered = false;
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          rule.style.width = '48px';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(rule);
  }());

  /* ---- FIX 7C: tier row stagger — each row slides in with 100ms offset ---- */
  (function () {
    var tierRows = document.querySelector('.tier-rows');
    if (!tierRows) return;
    var rows = tierRows.querySelectorAll('.tier-row');
    if (prefersReducedMotion) {
      rows.forEach(function (r) { r.classList.add('visible'); });
      return;
    }
    var triggered = false;
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          rows.forEach(function (row, i) {
            setTimeout(function () {
              row.classList.add('visible');
            }, i * 100);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(tierRows);
  }());

  /* ---- Screenshot lightbox ---- */
  (function () {
    var modal = document.getElementById('screenshot-modal');
    if (!modal) return;

    var modalImg = modal.querySelector('.screenshot-modal-body img');
    var closeButtons = modal.querySelectorAll('[data-lightbox-close]');
    var triggers = document.querySelectorAll('[data-lightbox-src]');
    var previousFocus = null;

    function openModal(trigger) {
      previousFocus = document.activeElement;
      modalImg.src = trigger.getAttribute('data-lightbox-src');
      modalImg.alt = trigger.getAttribute('data-lightbox-alt') || '';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      var close = modal.querySelector('.screenshot-modal-close');
      if (close) close.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      modalImg.removeAttribute('src');
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openModal(trigger);
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }

      if (event.key === 'Tab' && modal.classList.contains('open')) {
        var focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }());

  /* ---- Contact form (Web3Forms) ---- */
  (function () {
    var form   = document.querySelector('.contact-form');
    var status = document.querySelector('.form-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      status.className = 'form-status';
      status.textContent = '';

      var data = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            status.className = 'form-status visible success';
            status.textContent = 'Message sent. We will get back to you within 24 hours.';
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          status.className = 'form-status visible error';
          status.textContent = 'Something went wrong. Please try again or email vysiblesales@gmail.com directly.';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        });
    });
  }());

}());
