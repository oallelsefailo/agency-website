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

  /* ---- Overview metrics strip ---- */
  (function () {
    var overviewMetrics = document.querySelector('.overview-metrics');
    if (!overviewMetrics) return;

    var counters = overviewMetrics.querySelectorAll('[data-count]');

    function formatValue(el, value) {
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      return prefix + value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
    }

    function renderFinal() {
      counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        if (!Number.isNaN(target)) {
          el.textContent = formatValue(el, target);
        }
      });
      overviewMetrics.classList.add('is-visible');
    }

    function animateCounter(el, duration) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (Number.isNaN(target)) return;

      var start = null;
      el.textContent = formatValue(el, 0);

      function tick(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatValue(el, target * eased);

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          el.textContent = formatValue(el, target);
        }
      }

      window.requestAnimationFrame(tick);
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      renderFinal();
      return;
    }

    overviewMetrics.classList.add('is-motion-ready');

    observeOnce('.overview-metrics', function () {
      overviewMetrics.classList.add('is-visible');
      counters.forEach(function (el) {
        animateCounter(el, 1450);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10px 0px' });
  }());

  /* ---- Connected source beam sequence ---- */
  (function () {
    var stage = document.querySelector('.sources-stage');
    if (!stage) return;

    var sourceNodes = Array.prototype.slice.call(stage.querySelectorAll('.source-node'));
    var dashMetrics = Array.prototype.slice.call(stage.querySelectorAll('.dash-metric'));
    var dash = stage.querySelector('.dash-node');
    var desktopBeams = Array.prototype.slice.call(stage.querySelectorAll('.beam-desktop .beam-line'));
    var mobileBeam = stage.querySelector('[data-beam-mobile]');
    var allBeams = desktopBeams.concat(mobileBeam ? [mobileBeam] : []);

    function prepareBeam(path) {
      if (!path || typeof path.getTotalLength !== 'function') return;

      var length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.setAttribute('data-length', String(length));
    }

    function completeStage() {
      sourceNodes.forEach(function (node) {
        node.classList.add('is-active', 'is-viz-on');
      });
      dashMetrics.forEach(function (metric) {
        metric.classList.add('is-on');
      });
      allBeams.forEach(function (path) {
        if (path) path.style.strokeDashoffset = '0';
      });
      if (dash) dash.classList.add('is-active');
      stage.classList.add('is-sequence-complete');
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      completeStage();
      return;
    }

    allBeams.forEach(prepareBeam);
    stage.classList.add('is-motion-ready');

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function segment(progress, start, end) {
      return clamp((progress - start) / (end - start), 0, 1);
    }

    function setBeamProgress(path, progress) {
      if (!path) return;
      var length = parseFloat(path.getAttribute('data-length') || '0');
      if (!length) return;
      path.style.strokeDashoffset = String(length * (1 - progress));
    }

    function setProgress(progress) {
      sourceNodes.forEach(function (node, index) {
        var activeAt = [0.03, 0.36, 0.69][index];
        var vizAt = [0.08, 0.41, 0.74][index];
        node.classList.toggle('is-active', progress >= activeAt);
        node.classList.toggle('is-viz-on', progress >= vizAt);
      });

      var beamProgress = [
        segment(progress, 0.14, 0.32),
        segment(progress, 0.47, 0.65),
        segment(progress, 0.79, 0.94)
      ];

      desktopBeams.forEach(function (beam, index) {
        setBeamProgress(beam, beamProgress[index] || 0);
      });

      if (mobileBeam) {
        setBeamProgress(mobileBeam, segment(progress, 0.14, 0.94));
      }

      dashMetrics.forEach(function (metric, index) {
        metric.classList.toggle('is-on', progress >= [0.34, 0.67, 0.95][index]);
      });

      if (dash) dash.classList.toggle('is-active', progress >= 0.96);
      stage.classList.toggle('is-sequence-complete', progress >= 0.96);
    }

    function render() {
      var rect = stage.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      var start = viewport * 0.86;
      var end = viewport * 0.22;
      var progress = clamp((start - rect.top) / (start - end), 0, 1);
      setProgress(progress);
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

  /* ---- Autoplay product videos ---- */
  (function () {
    var videos = document.querySelectorAll('video[autoplay]');
    if (!videos.length) return;

    function playVideo(video) {
      video.muted = true;
      video.play().catch(function () {});
    }

    if (!('IntersectionObserver' in window)) {
      videos.forEach(playVideo);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          playVideo(video);
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.2 });

    videos.forEach(function (video) {
      observer.observe(video);
    });
  }());

  /* ---- Screenshot lightbox ---- */
  (function () {
    var modal = document.getElementById('screenshot-modal');
    if (!modal) return;

    var modalImg = modal.querySelector('.screenshot-modal-body img');
    var modalVideo = modal.querySelector('.screenshot-modal-body video');
    var closeButtons = modal.querySelectorAll('[data-lightbox-close]');
    var triggers = document.querySelectorAll('[data-lightbox-src]');
    var previousFocus = null;

    function openModal(trigger) {
      var src = trigger.getAttribute('data-lightbox-src');
      var alt = trigger.getAttribute('data-lightbox-alt') || '';
      var type = trigger.getAttribute('data-lightbox-type') || '';
      previousFocus = document.activeElement;

      if (type === 'video' && modalVideo) {
        modalImg.hidden = true;
        modalImg.removeAttribute('src');
        modalVideo.hidden = false;
        modalVideo.src = src;
        modalVideo.setAttribute('aria-label', alt);
        modalVideo.play().catch(function () {});
      } else {
        if (modalVideo) {
          modalVideo.pause();
          modalVideo.hidden = true;
          modalVideo.removeAttribute('src');
          modalVideo.removeAttribute('aria-label');
          modalVideo.load();
        }
        modalImg.hidden = false;
        modalImg.src = src;
        modalImg.alt = alt;
      }

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
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.hidden = true;
        modalVideo.removeAttribute('src');
        modalVideo.removeAttribute('aria-label');
        modalVideo.load();
      }
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
