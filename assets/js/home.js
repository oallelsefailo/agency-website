/* Vysible homepage animations — ported from option-47-synthesis-warm */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  /* Run a canvas rAF loop only while the canvas is on-screen and the tab is visible. */
  function pausableLoop(cv, drawFrame) {
    var running = false, visible = false;
    function active() { return visible && !document.hidden; }
    function tick(ts) {
      if (!active()) { running = false; return; }
      drawFrame(ts);
      requestAnimationFrame(tick);
    }
    function maybeStart() {
      if (active() && !running) { running = true; requestAnimationFrame(tick); }
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { visible = e.isIntersecting; });
        maybeStart();
      }, { threshold: 0 }).observe(cv);
    } else {
      visible = true; maybeStart();
    }
    document.addEventListener('visibilitychange', maybeStart);
  }

  /* ============ A/B variant resolution ============ */
  /* window.__AB_VARIANT is set by the inline head script (cookie ab_variant / ?ab=N). */
  var AB = 0;
  try { AB = parseInt(window.__AB_VARIANT, 10) || 0; } catch (e) {}
  if (AB < 0 || AB > 2) AB = 0;
  document.querySelectorAll('.ab-variant').forEach(function (el) {
    el.hidden = el.dataset.variant !== String(AB);
  });

  /* generic looping type-writer (shared by CTA variants) */
  function typeLoop(el, lines) {
    if (!el) return;
    if (prefersReducedMotion) { el.textContent = lines[0]; return; }
    var i = 0, c = 0, d = false;
    (function type() {
      var w = lines[i];
      el.textContent = w.slice(0, c);
      if (!d && c < w.length) { c++; setTimeout(type, 40); }
      else if (!d) { d = true; setTimeout(type, 2000); }
      else if (c > 0) { c--; setTimeout(type, 13); }
      else { d = false; i = (i + 1) % lines.length; setTimeout(type, 300); }
    })();
  }

  /* ============ typed "store says" line ============ */
  (function () {
    var says = document.getElementById('says');
    if (!says) return;
    var SAYS = ['"Here’s what changed."', '"Fix these two pages first."', '"Ask me anything."'];
    if (prefersReducedMotion) { says.textContent = SAYS[0]; return; }
    var si = 0, sc = 0, sd = false;
    (function type() {
      var w = SAYS[si];
      says.textContent = w.slice(0, sc);
      if (!sd && sc < w.length) { sc++; setTimeout(type, 52); }
      else if (!sd) { sd = true; setTimeout(type, 2000); }
      else if (sc > 0) { sc--; setTimeout(type, 18); }
      else { sd = false; si = (si + 1) % SAYS.length; setTimeout(type, 320); }
    })();
  })();

  /* ============ hero chat loop ============ */
  (function () {
    var log = document.getElementById('hclog');
    if (!log) return;
    var HC = [
      { q: 'How did we do yesterday?', a: 'Yesterday looked solid overall.<br>Revenue: <b>$4,870</b> · Orders: <b>22</b> · AOV: <b>$221</b><br>Top seller: <b>Canvas Travel Tote</b>.<br>Want it broken down by products, coupons, or refunds?' },
      { q: 'What should I fix first?', a: "One thing: <b>conversion on your top product pages</b>. You're pulling <b>18,420 sessions</b> but converting <b>3.2%</b> - improving browse &rarr; cart &rarr; checkout lifts revenue fastest." },
      { q: "What's my AOV?", a: 'Your average order value is about <b>$223</b>.' }
    ];

    if (prefersReducedMotion) {
      HC.forEach(function (t) {
        var u = document.createElement('div');
        u.className = 'hm u show';
        u.textContent = t.q;
        log.appendChild(u);
        var b = document.createElement('div');
        b.className = 'hm b show';
        b.innerHTML = t.a;
        log.appendChild(b);
      });
      log.scrollTop = log.scrollHeight;
      return;
    }

    (async function heroChat() {
      while (true) {
        log.innerHTML = '';
        for (var i = 0; i < HC.length; i++) {
          var t = HC[i];
          var u = document.createElement('div');
          u.className = 'hm u';
          u.innerHTML = '<span class="tx"></span><span class="cur2"></span>';
          log.appendChild(u);
          requestAnimationFrame(function () { u.classList.add('show'); });
          log.scrollTop = log.scrollHeight;
          var tx = u.querySelector('.tx');
          for (var c = 1; c <= t.q.length; c++) { tx.textContent = t.q.slice(0, c); await wait(34); }
          u.querySelector('.cur2').remove();
          await wait(300);
          var ty = document.createElement('div');
          ty.className = 'hty show';
          ty.innerHTML = '<i></i><i></i><i></i>';
          log.appendChild(ty);
          log.scrollTop = log.scrollHeight;
          await wait(950);
          ty.remove();
          var b = document.createElement('div');
          b.className = 'hm b';
          b.innerHTML = t.a;
          log.appendChild(b);
          requestAnimationFrame(function () { b.classList.add('show'); });
          log.scrollTop = log.scrollHeight;
          await wait(2500);
        }
        await wait(3800);
      }
    })();
  })();

  /* ============ hero background drift (very subtle) ============ */
  (function () {
    var cv = document.getElementById('bgdrift');
    if (!cv || prefersReducedMotion) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    function fit() { cv.width = cv.offsetWidth * 2; cv.height = cv.offsetHeight * 2; }
    fit(); addEventListener('resize', fit);
    var P = [];
    for (var i = 0; i < 50; i++) P.push({ x: Math.random(), y: Math.random(), dx: (Math.random() - .5) * .0004, dy: (Math.random() - .5) * .0003, sz: 1.4 + Math.random() * 2.4, c: ['#ef5b3b', '#17a08b', '#f2a93b', '#e0709a'][i % 4], o: .1 + Math.random() * .18 });
    pausableLoop(cv, function () {
      ctx.clearRect(0, 0, cv.width, cv.height);
      P.forEach(function (p) {
        p.x = (p.x + p.dx + 1) % 1; p.y = (p.y + p.dy + 1) % 1;
        ctx.globalAlpha = p.o;
        ctx.beginPath(); ctx.arc(p.x * cv.width, p.y * cv.height, p.sz, 0, 7);
        ctx.fillStyle = p.c; ctx.fill();
      });
      ctx.globalAlpha = 1;
    });
  })();

  /* ============ PARTICLE FORMATIONS in "How it thinks" ============ */
  (function () {
    var cv = document.getElementById('stagecv');
    if (!cv || prefersReducedMotion || AB !== 0) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    function fit() { cv.width = cv.offsetWidth * 2; cv.height = cv.offsetHeight * 2; }
    fit(); addEventListener('resize', function () { fit(); buildScenes(); assign(); });
    var NP = 700, parts = [];
    var WARM = ['#ef5b3b', '#17a08b', '#f2a93b', '#e0709a'];
    for (var i = 0; i < NP; i++) parts.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, tx: 0, ty: 0, c: '#ef5b3b', sz: 1.7 + Math.random() * 2.3 });
    function sample(drawFn, color) {
      var off = document.createElement('canvas');
      off.width = cv.width; off.height = cv.height;
      var octx = off.getContext('2d');
      if (!octx) return [];
      drawFn(octx, off.width, off.height);
      var data;
      try { data = octx.getImageData(0, 0, off.width, off.height).data; } catch (e) { return []; }
      var pts = [];
      var step = Math.max(3, Math.floor(Math.sqrt((off.width * off.height) / (NP * 2.4))));
      for (var y = 0; y < off.height; y += step) for (var x = 0; x < off.width; x += step)
        if (data[(y * off.width + x) * 4 + 3] > 120) pts.push({ x: x, y: y, c: color });
      return pts;
    }
    var SCENES = [];
    function buildScenes() {
      var W = cv.width, H = cv.height;
      SCENES = [
        { lab: 'RAW DATA POINTS', pts: (function () { var a = []; for (var i = 0; i < NP; i++) a.push({ x: W * .06 + Math.random() * W * .88, y: H * .06 + Math.random() * H * .78, c: WARM[i % 4] }); return a; })() },
        { lab: 'SORTED INTO SIGNALS', pts: sample(function (c, W2, H2) {
            var bw = W2 * .1, hs = [.3, .46, .38, .6, .5, .74];
            hs.forEach(function (h, i) { c.fillStyle = '#fff'; c.fillRect(W2 * .12 + i * bw * 1.3, H2 * .76 - h * H2 * .55, bw, h * H2 * .55); });
          }, '#ef5b3b') },
        { lab: 'HEADLINED: +12.4% REVENUE', pts: sample(function (c, W2, H2) {
            c.fillStyle = '#fff'; c.font = '800 ' + Math.floor(H2 * .3) + 'px Bricolage Grotesque, sans-serif';
            c.textAlign = 'center'; c.textBaseline = 'middle';
            c.fillText('+12.4%', W2 / 2, H2 * .44);
          }, '#1f9d6b') },
        { lab: 'TRENDED, CITED, ACTIONED', pts: sample(function (c, W2, H2) {
            c.strokeStyle = '#fff'; c.lineWidth = H2 * .05; c.lineCap = 'round'; c.lineJoin = 'round';
            c.beginPath();
            [[.06, .68], [.22, .58], [.38, .64], [.54, .46], [.7, .52], [.86, .28], [.94, .2]].forEach(function (p, i) { i ? c.lineTo(p[0] * W2, p[1] * H2) : c.moveTo(p[0] * W2, p[1] * H2); });
            c.stroke();
            c.beginPath(); c.arc(.94 * W2, .2 * H2, H2 * .05, 0, 7); c.fillStyle = '#fff'; c.fill();
          }, '#17a08b') }
      ];
    }
    buildScenes();
    var lab = document.getElementById('actlabel');
    var scene = 0;
    function assign() {
      var pts = SCENES[scene].pts;
      if (!pts.length) return;
      parts.forEach(function (p, i) {
        var t = pts[i % pts.length];
        p.tx = t.x + (Math.random() - .5) * 5; p.ty = t.y + (Math.random() - .5) * 5; p.c = t.c;
      });
    }
    assign();
    (async function cycle() {
      while (true) {
        await wait(2400);
        if (lab) lab.classList.add('fade');
        await wait(280);
        scene = (scene + 1) % SCENES.length;
        assign();
        if (lab) { lab.textContent = SCENES[scene].lab; lab.classList.remove('fade'); }
      }
    })();
    pausableLoop(cv, function (ts) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(function (p, i) {
        p.x += (p.tx - p.x) * .09; p.y += (p.ty - p.y) * .09;
        ctx.globalAlpha = .9;
        ctx.beginPath(); ctx.arc(p.x + Math.sin(ts / 650 + i) * 1.1, p.y, p.sz, 0, 7);
        ctx.fillStyle = p.c; ctx.fill();
      });
      ctx.globalAlpha = 1;
    });
  })();

  /* ============ stage animations (brief / targets / search) ============ */
  var BRIEF8 = [
    ['h', 'HEALTHY', 'Revenue momentum visible - $128,941, +12.4% vs prior.'],
    ['w', 'WATCH', 'Conversion softened 0.4 pts while sessions held.'],
    ['h', 'HEALTHY', 'Order-line revenue reconciled: $132,476 / 592 orders.'],
    ['w', 'WATCH', '10 high-impression pages under 2% CTR.']
  ];
  async function playBrief() {
    var pad = document.getElementById('bpad8'), st = document.getElementById('bstat8');
    if (!pad) return;
    for (var i = 0; i < BRIEF8.length; i++) {
      var b = BRIEF8[i];
      var d = document.createElement('div');
      d.className = 'bl8 ' + b[0];
      d.innerHTML = '<b>' + b[1] + '</b><span class="tx"></span><span class="cur"></span>';
      pad.appendChild(d);
      requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
      var tx = d.querySelector('.tx');
      for (var c = 1; c <= b[2].length; c++) { tx.textContent = b[2].slice(0, c); await wait(11); }
      d.querySelector('.cur').remove();
      if (st) st.textContent = (i + 1) + '/4';
      await wait(180);
    }
  }
  var TK8 = [
    ['Review /collections/sale — title & meta', 'hi'],
    ['Check DEMO-CARDIGAN placement', 'hi'],
    ['Compare paid landing pages', 'md'],
    ['Confirm AOV vs promo calendar', 'md']
  ];
  async function playTargets() {
    var pad = document.getElementById('tpad8'), st = document.getElementById('tstat8');
    if (!pad) return;
    var els = [];
    for (var i = 0; i < TK8.length; i++) {
      var t = TK8[i];
      var d = document.createElement('div');
      d.className = 'tk8';
      d.innerHTML = '<span class="bx"></span><span>' + t[0] + '</span><span class="p8 ' + t[1] + '">' + (t[1] === 'hi' ? 'HIGH' : 'MED') + '</span>';
      pad.appendChild(d);
      els.push(d);
      requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
      await wait(200);
    }
    await wait(450);
    for (var j = 0; j < els.length; j++) {
      els[j].classList.add('done');
      if (st) st.textContent = (j + 1) + ' CLEARED';
      await wait(480);
    }
  }
  var SR8 = [
    ['/collections/linen', '31,600 imp', ['4.1%', 'ok']],
    ['/collections/sale', '48,200 imp', ['1.7%', 'bad']],
    ['/collections/accessories', '33,600 imp', ['0.7%', 'bad']]
  ];
  async function playSearch() {
    var rows = document.getElementById('srows8');
    if (!rows) return;
    await wait(1100);
    for (var i = 0; i < SR8.length; i++) {
      var r = SR8[i];
      var d = document.createElement('div');
      d.className = 'srow8';
      d.innerHTML = '<span class="u8">' + r[0] + '</span><span style="color:#6d6355">' + r[1] + '</span><span class="c8 ' + r[2][1] + '">' + r[2][0] + '</span>';
      rows.appendChild(d);
      requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
      await wait(260);
    }
  }

  (function () {
    var boxes = document.querySelectorAll('[data-anim]');
    if (!boxes.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      boxes.forEach(function (box) {
        box.classList.add('play');
        if (box.dataset.anim === 'brief') playBrief();
        if (box.dataset.anim === 'targets') playTargets();
        if (box.dataset.anim === 'search') playSearch();
      });
      return;
    }
    var played = new Set();
    var stio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var box = e.target;
        if (played.has(box)) return;
        played.add(box);
        stio.unobserve(box);
        box.classList.add('play');
        if (box.dataset.anim === 'brief') playBrief();
        if (box.dataset.anim === 'targets') playTargets();
        if (box.dataset.anim === 'search') playSearch();
      });
    }, { threshold: .4 });
    boxes.forEach(function (b) { stio.observe(b); });
  })();

  /* ============ spec counters ============ */
  (function () {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (n) { n.textContent = n.dataset.count; });
      return;
    }
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target, end = +n.dataset.count, t0 = performance.now();
        var step = function (t) {
          var p = Math.min((t - t0) / 1200, 1);
          n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(n);
      });
    }, { threshold: .6 });
    counters.forEach(function (n) { cio.observe(n); });
  })();

  /* ============ finale: warm living scatter w/ jagged trend ============ */
  (function () {
    var cv = document.getElementById('finalecv');
    if (!cv || prefersReducedMotion || AB !== 0) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    function fit() { cv.width = cv.offsetWidth * 2; cv.height = cv.offsetHeight * 2; }
    fit(); addEventListener('resize', fit);
    var P = [];
    for (var i = 0; i < 70; i++) P.push({
      x: Math.random(), jitter: (Math.random() - .5) * .34,
      sp: .00018 + Math.random() * .00028, sz: 2 + Math.random() * 3,
      c: ['#ef5b3b', '#17a08b', '#f2a93b', '#e0709a'][i % 4],
      o: .22 + Math.random() * .35
    });
    var TP = [[0, .84], [.12, .68], [.24, .76], [.36, .56], [.48, .65], [.6, .44], [.72, .54], [.84, .36], [1, .26]];
    function trendY(x) {
      for (var i = 1; i < TP.length; i++) {
        if (x <= TP[i][0]) {
          var a = TP[i - 1], b = TP[i];
          var t = (x - a[0]) / (b[0] - a[0]);
          return a[1] + (b[1] - a[1]) * t;
        }
      }
      return TP[TP.length - 1][1];
    }
    pausableLoop(cv, function (ts) {
      var W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(160,120,80,.14)'; ctx.lineWidth = 1;
      for (var g = 1; g < 5; g++) { ctx.beginPath(); ctx.moveTo(0, H * g / 5); ctx.lineTo(W, H * g / 5); ctx.stroke(); }
      for (var g2 = 1; g2 < 8; g2++) { ctx.beginPath(); ctx.moveTo(W * g2 / 8, 0); ctx.lineTo(W * g2 / 8, H); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(160,120,80,.3)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W * .04, H * .06); ctx.lineTo(W * .04, H * .94); ctx.lineTo(W * .97, H * .94); ctx.stroke();
      ctx.strokeStyle = 'rgba(239,91,59,.45)'; ctx.lineWidth = 2.5; ctx.setLineDash([10, 9]); ctx.lineJoin = 'round';
      ctx.beginPath();
      TP.forEach(function (p, i) {
        var px = W * .06 + p[0] * W * .9, py = p[1] * H;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
      P.forEach(function (p, i) {
        p.x += p.sp * 16;
        if (p.x > 1) { p.x = 0; p.jitter = (Math.random() - .5) * .34; }
        var px = W * .06 + p.x * W * .9;
        var py = (trendY(p.x) + p.jitter * (1 - p.x * .4)) * H + Math.sin(ts / 900 + i) * 3;
        ctx.globalAlpha = p.o * Math.min(p.x * 8, 1) * Math.min((1 - p.x) * 8, 1);
        ctx.beginPath(); ctx.arc(px, py, p.sz, 0, 7);
        ctx.fillStyle = p.c; ctx.fill();
      });
      ctx.globalAlpha = 1;
    });
  })();

  /* ============ finale typed line ============ */
  (function () {
    var fintype = document.getElementById('fintype');
    if (!fintype || AB !== 0) return;
    var finL = ['free demo, staged store data - poke around all you like.', 'no signup. no sales deck. just the product.', 'your store has more to say. see the demo.'];
    if (prefersReducedMotion) { fintype.textContent = finL[0]; return; }
    var fi = 0, fc = 0, fd = false;
    (function type() {
      var w = finL[fi];
      fintype.textContent = w.slice(0, fc);
      if (!fd && fc < w.length) { fc++; setTimeout(type, 40); }
      else if (!fd) { fd = true; setTimeout(type, 2000); }
      else if (fc > 0) { fc--; setTimeout(type, 13); }
      else { fd = false; fi = (fi + 1) % finL.length; setTimeout(type, 300); }
    })();
  })();

  /* ============ A/B variant animations (zones A and B) ============ */
  var FINL = ['free demo, staged store data - poke around all you like.', 'no signup. no sales deck. just the product.', 'your store has more to say. see the demo.'];

  if (AB === 1) {
    /* A1: reconcile beams — graded insight types out */
    (async function () {
      var grade = document.getElementById('a1grade'), txt = document.getElementById('a1txt');
      if (!grade || !txt) return;
      var OUT = [
        ['HEALTHY', 'var(--okd)', 'Revenue +12.4% vs prior - sources agree.'],
        ['WATCH', '#8f610b', 'Conversion slipped 0.4 pts - traffic quality flagged.'],
        ['HEALTHY', 'var(--okd)', 'AOV steady at $224 - mix is holding.']
      ];
      if (prefersReducedMotion) { txt.textContent = OUT[0][2]; return; }
      var i = 0;
      while (true) {
        var o = OUT[i];
        grade.textContent = o[0]; grade.style.color = o[1];
        txt.textContent = '';
        for (var c = 1; c <= o[2].length; c++) { txt.textContent = o[2].slice(0, c); await wait(26); }
        await wait(2600);
        i = (i + 1) % OUT.length;
      }
    })();

    /* B1: breathing skyline + typed CTA line */
    (function () {
      var sky = document.getElementById('b1sky');
      if (sky) {
        var cols = ['#ef5b3b', '#f2a93b', '#17a08b', '#e0709a'];
        for (var i = 0; i < 22; i++) {
          var b = document.createElement('i');
          b.style.cssText = 'height:' + Math.round(20 + Math.random() * 75) + '%;--lo:' + (.35 + Math.random() * .45).toFixed(2) + ';background:' + cols[i % 4] + ';animation-duration:' + (2.2 + Math.random() * 2).toFixed(2) + 's;animation-delay:-' + (Math.random() * 3).toFixed(2) + 's';
          sky.appendChild(b);
        }
      }
      typeLoop(document.getElementById('b1type'), FINL);
    })();
  }

  if (AB === 2) {
    /* A2: self-sorting bars — priorities reorder, top one flagged */
    (async function () {
      var field = document.getElementById('a2field'), lab = document.getElementById('a2lab');
      if (!field || !lab) return;
      var COLORS = ['#ef5b3b', '#f2a93b', '#17a08b', '#e0709a', '#c8401f', '#f2c94c'];
      var bars = [];
      for (var i = 0; i < 6; i++) {
        var b = document.createElement('div');
        b.className = 'sb';
        b.style.background = COLORS[i];
        b.innerHTML = '<span class="v"></span><span class="flag">TOP TARGET</span>';
        field.appendChild(b); bars.push(b);
      }
      function setBars(vals) {
        bars.forEach(function (b, i) {
          b.style.height = vals[i] + '%';
          b.querySelector('.v').textContent = vals[i];
        });
      }
      if (prefersReducedMotion) {
        setBars([82, 66, 51, 43, 31, 22]);
        bars[0].querySelector('.flag').classList.add('on');
        lab.textContent = 'TOP TARGET FLAGGED \u00B7 NEXT STEP ATTACHED';
        return;
      }
      while (true) {
        lab.textContent = 'NEW SIGNALS ARRIVING\u2026';
        var vals = bars.map(function () { return 15 + Math.floor(Math.random() * 80); });
        bars.forEach(function (b) { b.querySelector('.flag').classList.remove('on'); });
        setBars(vals);
        await wait(1900);
        lab.textContent = 'RANKING BY LEVERAGE\u2026';
        setBars(vals.slice().sort(function (a, b) { return b - a; }));
        await wait(1300);
        bars[0].querySelector('.flag').classList.add('on');
        lab.textContent = 'TOP TARGET FLAGGED \u00B7 NEXT STEP ATTACHED';
        await wait(2600);
      }
    })();

    /* B3: chat sign-off loop */
    (async function () {
      var q = document.getElementById('b3q'), a = document.getElementById('b3a');
      if (!q || !a) return;
      var tx = q.querySelector('.tx');
      var QS = ['Can I try it without signing up?', 'Is the demo really free?', 'What data does the demo use?'];
      var AS = ['In the demo. <b>Staged store, real product</b> - no signup needed.',
                'Completely. <b>No card, no signup</b> - just open it.',
                'A <b>staged store</b> with realistic numbers - so you can click everything safely.'];
      if (prefersReducedMotion) {
        tx.textContent = QS[0];
        q.classList.add('show'); a.classList.add('show');
        return;
      }
      var i = 0;
      while (true) {
        a.classList.remove('show');
        tx.textContent = '';
        q.classList.add('show');
        var w = QS[i];
        for (var c = 1; c <= w.length; c++) { tx.textContent = w.slice(0, c); await wait(38); }
        await wait(500);
        a.innerHTML = AS[i];
        a.classList.add('show');
        await wait(3400);
        i = (i + 1) % QS.length;
      }
    })();
  }

}());
