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

  /* ---- Tier row stagger (homepage compact pricing) ---- */
  (function () {
    var tierRows = document.querySelector('.tier-rows');
    if (!tierRows) return;
    var rows = tierRows.querySelectorAll('.tier-row');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
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
      var src = trigger.getAttribute('data-lightbox-src');
      var alt = trigger.getAttribute('data-lightbox-alt') || '';
      previousFocus = document.activeElement;

      modalImg.hidden = false;
      modalImg.src = src;
      modalImg.alt = alt;

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
      modalImg.hidden = false;
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

  /* ---- Reveal on scroll (.rv) ---- */
  (function () {
    var els = document.querySelectorAll('.rv');
    if (!els.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }());

  /* ---- Pricing billing toggle (monthly / yearly) ---- */
  (function () {
    var buttons = document.querySelectorAll('.toggle button[data-cycle]');
    if (!buttons.length) return;
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var yr = b.dataset.cycle === 'yr';
        document.querySelectorAll('.price span[data-mo]').forEach(function (s) {
          s.textContent = yr ? s.dataset.yr : s.dataset.mo;
        });
        document.querySelectorAll('.price .pl').forEach(function (s) {
          s.textContent = yr ? '/yr' : '/mo';
        });
        document.querySelectorAll('.alt[data-alt-mo]').forEach(function (s) {
          s.textContent = yr ? s.dataset.altYr : s.dataset.altMo;
        });
      });
    });
  }());

  /* ---- Cookie consent banner (gates Google Analytics) ---- */
  (function () {
    var KEY = 'vys-consent';
    var choice = null;
    try { choice = localStorage.getItem(KEY); } catch (e) { return; }
    if (choice === 'granted' || choice === 'denied') return;

    var banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>We use Google Analytics to understand how visitors use this site. No analytics cookies are set unless you accept. See our <a href="/privacy/">privacy policy</a>.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-primary" data-consent="granted">Accept</button>' +
      '<button type="button" class="btn btn-secondary" data-consent="denied">Decline</button>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('show'); });

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var value = btn.getAttribute('data-consent');
      try { localStorage.setItem(KEY, value); } catch (e2) {}
      if (value === 'granted' && typeof window.vysLoadGA === 'function') {
        window.vysLoadGA();
      }
      banner.remove();
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
            status.textContent = 'Message sent. We will get back to you within one business day.';
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          status.className = 'form-status visible error';
          status.textContent = 'Something went wrong. Please try again or email hello@vysible.io directly.';
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
