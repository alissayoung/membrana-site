/* Мембранный транспорт — вкладки, частицы, тест. Без библиотек. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAU = Math.PI * 2;
  var C = { na: '#FF9A2E', k: '#A77BFF', atp: '#FF5A4E', teal: '#23A094', tail: '#8FD8CE', blue: '#2F6FEB', pink: '#FF90E8', yel: '#FFC900', per: '#90A8ED', ink: '#111111', white: '#FFFFFF' };
  var PANELS = ['home', 'types', 'pump', 'game', 'ref', 'quiz'];

  /* ---------- drawing helpers for particle targets ---------- */
  function circle(g, x, y, r, fill) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = fill; g.fill(); }
  function rrect(g, x, y, w, h, r, fill) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
    g.fillStyle = fill; g.fill();
  }
  function face(g, x, y, r, smile) {
    [-1, 1].forEach(function (s) {
      circle(g, x + s * r * 0.32, y - r * 0.1, r * 0.2, C.white);
      circle(g, x + s * r * 0.32 + r * 0.04, y - r * 0.06, r * 0.1, C.ink);
    });
    g.strokeStyle = C.ink; g.lineWidth = r * 0.1; g.lineCap = 'round'; g.beginPath();
    if (smile) g.arc(x, y + r * 0.12, r * 0.3, 0.15 * Math.PI, 0.85 * Math.PI);
    else { g.moveTo(x - r * 0.22, y + r * 0.38); g.lineTo(x + r * 0.22, y + r * 0.38); }
    g.stroke();
  }
  function badge(g, x, y, r) {
    circle(g, x, y, r * 1.25, C.ink); circle(g, x, y, r, C.white);
    g.strokeStyle = C.ink; g.lineWidth = r * 0.32; g.lineCap = 'round'; g.beginPath();
    g.moveTo(x - r * 0.5, y); g.lineTo(x + r * 0.5, y); g.moveTo(x, y - r * 0.5); g.lineTo(x, y + r * 0.5); g.stroke();
  }
  function na(g, x, y, r) { circle(g, x, y, r * 1.1, C.ink); circle(g, x, y, r, C.na); face(g, x, y, r, true); badge(g, x + r * 0.78, y - r * 0.78, r * 0.3); }
  function kIon(g, x, y, s) { var r = s / 2; rrect(g, x - r * 1.08, y - r * 1.08, s * 1.08, s * 1.08, s * 0.34, C.ink); rrect(g, x - r, y - r, s, s, s * 0.32, C.k); face(g, x, y, r, false); badge(g, x + r * 0.8, y - r * 0.8, r * 0.3); }
  function atp(g, x, y, s) {
    var r = s / 2; rrect(g, x - r * 1.08, y - r * 1.08, s * 1.08, s * 1.08, s * 0.22, C.ink); rrect(g, x - r, y - r, s, s, s * 0.2, C.atp);
    var u = s / 40, pts = [[2, -13], [-9, 3], [-1, 3], [-3, 14], [9, -3], [1, -3]];
    g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(x + p[0] * u, y + p[1] * u); else g.moveTo(x + p[0] * u, y + p[1] * u); }); g.closePath();
    g.lineWidth = u * 2.4; g.strokeStyle = C.ink; g.lineJoin = 'round'; g.stroke(); g.fillStyle = C.white; g.fill();
  }
  function glu(g, x, y, r) {
    function hex(rr, fill) { g.beginPath(); for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; var px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; if (i) g.lineTo(px, py); else g.moveTo(px, py); } g.closePath(); g.fillStyle = fill; g.fill(); }
    hex(r * 1.12, C.ink); hex(r, C.teal); face(g, x, y, r * 0.9, true);
  }
  function arrow(g, x1, y1, x2, y2, w) {
    var a = Math.atan2(y2 - y1, x2 - x1); g.strokeStyle = C.ink; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    g.beginPath(); g.moveTo(x2 - Math.cos(a - 0.5) * w * 3.2, y2 - Math.sin(a - 0.5) * w * 3.2); g.lineTo(x2, y2); g.lineTo(x2 - Math.cos(a + 0.5) * w * 3.2, y2 - Math.sin(a + 0.5) * w * 3.2); g.stroke();
  }
  function membrane(g, x0, x1, yTop, yBot, step, hr) {
    g.strokeStyle = C.tail; g.lineWidth = hr * 0.38; g.lineCap = 'round';
    for (var x = x0; x <= x1; x += step) {
      g.beginPath(); g.moveTo(x - hr * 0.35, yTop + hr * 1.2); g.lineTo(x - hr * 0.35, (yTop + yBot) / 2 - hr * 0.3);
      g.moveTo(x + hr * 0.35, yTop + hr * 1.2); g.lineTo(x + hr * 0.35, (yTop + yBot) / 2 - hr * 0.3);
      g.moveTo(x - hr * 0.35, (yTop + yBot) / 2 + hr * 0.3); g.lineTo(x - hr * 0.35, yBot - hr * 1.2);
      g.moveTo(x + hr * 0.35, (yTop + yBot) / 2 + hr * 0.3); g.lineTo(x + hr * 0.35, yBot - hr * 1.2); g.stroke();
      circle(g, x, yTop, hr * 1.22, C.ink); circle(g, x, yTop, hr, C.teal);
      circle(g, x, yBot, hr * 1.22, C.ink); circle(g, x, yBot, hr, C.teal);
    }
  }
  function slope(g, path) { g.strokeStyle = C.ink; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); path(); g.stroke(); }
  function lobe(g, x, y, w, h, color) { rrect(g, x - 4, y - 4, w + 8, h + 8, w / 2 + 2, C.ink); rrect(g, x, y, w, h, w / 2 - 2, color); }

  var TARGETS = {
    home: { dw: 600, dh: 400, draw: function (g) {
      kIon(g, 80, 100, 46); na(g, 528, 86, 24); glu(g, 96, 300, 28); kIon(g, 520, 316, 52); atp(g, 470, 210, 34);
      na(g, 300, 205, 140);
    } },
    type0: { dw: 320, dh: 170, draw: function (g) {
      g.fillStyle = C.yel; g.fillRect(0, 0, 320, 170);
      slope(g, function () { g.moveTo(0, 40); g.quadraticCurveTo(160, 60, 320, 150); });
      g.strokeStyle = C.ink; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath();
      g.moveTo(98, 42); g.lineTo(124, 42); g.moveTo(92, 54); g.lineTo(118, 54); g.moveTo(100, 66); g.lineTo(126, 66); g.stroke();
      na(g, 160, 55, 20); na(g, 262, 100, 13); na(g, 36, 22, 11);
      arrow(g, 210, 128, 290, 160, 3);
    } },
    type1: { dw: 320, dh: 170, draw: function (g) {
      g.fillStyle = C.pink; g.fillRect(0, 0, 320, 170);
      slope(g, function () { g.moveTo(0, 150); g.quadraticCurveTo(160, 60, 320, 40); });
      atp(g, 119, 74, 28); na(g, 160, 55, 20);
      arrow(g, 210, 34, 290, 16, 3);
    } },
    type2: { dw: 320, dh: 170, draw: function (g) {
      g.fillStyle = C.per; g.fillRect(0, 0, 320, 170);
      slope(g, function () { g.moveTo(0, 150); g.lineTo(160, 50); g.lineTo(320, 150); });
      g.strokeStyle = C.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(160, 46); g.lineTo(206, 75); g.moveTo(160, 46); g.lineTo(52, 118); g.stroke();
      circle(g, 160, 40, 14, C.ink); circle(g, 160, 40, 11, C.white);
      g.lineWidth = 3; g.beginPath(); g.moveTo(160, 31); g.lineTo(160, 49); g.moveTo(151, 40); g.lineTo(169, 40); g.stroke();
      glu(g, 44, 124, 19); na(g, 212, 82, 17);
    } },
    pump: { dw: 1440, dh: 500, draw: function (g) {
      g.fillStyle = C.per; g.fillRect(0, 0, 1440, 240); g.fillStyle = C.yel; g.fillRect(0, 320, 1440, 180);
      membrane(g, 11 * 1.6, 1440, 228 + 9 * 1.6, 228 + 55 * 1.6, 35.2, 12.8);
      lobe(g, 604, 190, 72, 180, C.blue); lobe(g, 724, 190, 72, 180, C.blue);
      [[636, 226], [764, 226]].forEach(function (e) { circle(g, e[0], e[1], 11, C.ink); circle(g, e[0], e[1], 9, C.white); circle(g, e[0] + 2, e[1] + 2, 4.5, C.ink); });
      [[140, 50, 64], [320, 110, 52], [430, 30, 58], [920, 100, 56], [1060, 40, 64], [1250, 130, 52]].forEach(function (b) { na(g, b[0] + b[2] * 20 / 44, b[1] + b[2] * 24 / 44, b[2] * 16.5 / 44); });
      [[420, 392, 60], [530, 420, 54], [1000, 410, 60], [1180, 380, 56], [1310, 430, 50]].forEach(function (b) { kIon(g, b[0] + b[2] * 20 / 44, b[1] + b[2] * 24 / 44, b[2] * 33 / 44); });
      arrow(g, 584, 186, 584, 112, 6); arrow(g, 816, 345, 816, 424, 6);
    } },
    game: { dw: 900, dh: 300, draw: function (g) { na(g, 180, 160, 104); kIon(g, 450, 160, 186); atp(g, 720, 160, 186); } },
    ref: { dw: 700, dh: 460, draw: function (g) {
      function page(pts, fill) { g.beginPath(); pts.forEach(function (p, i) { if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath(); g.fillStyle = fill; g.fill(); g.lineWidth = 12; g.strokeStyle = C.ink; g.lineJoin = 'round'; g.stroke(); }
      page([[350, 92], [82, 58], [62, 398], [350, 424]], C.pink);
      page([[350, 92], [618, 58], [638, 398], [350, 424]], C.yel);
      g.strokeStyle = C.ink; g.lineWidth = 7; g.lineCap = 'round';
      for (var i = 0; i < 6; i++) {
        var y = 124 + i * 44; g.beginPath(); g.moveTo(118, y - 18 + i * 2); g.lineTo(312, y + 4); g.stroke();
        g.beginPath(); g.moveTo(388, y + 4); g.lineTo(i === 5 ? 500 : 582, y - 18 + i * 2); g.stroke();
      }
      na(g, 628, 404, 40);
    } },
    quiz: { dw: 500, dh: 500, draw: function (g) {
      g.font = '900 440px "Inter Tight", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineWidth = 22; g.strokeStyle = C.ink; g.lineJoin = 'round'; g.strokeText('?', 240, 250); g.fillStyle = C.yel; g.fillText('?', 240, 250);
      na(g, 410, 410, 52);
    } }
  };

  /* ---------- particles ---------- */
  var cv = document.getElementById('particles');
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = 1;
  var N = Math.min(6000, Math.max(2600, Math.round(window.innerWidth * window.innerHeight / 240)));
  var P = [];
  for (var i = 0; i < N; i++) P.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: 0, vy: 0, rx: 0, ry: 0, r: 200, g: 200, b: 200, tr: 200, tg: 200, tb: 200, ph: Math.random() * TAU, delay: 0, s: 2.8 + Math.random() * 1.8 });
  var cur = null, targetEl = null, switchT = 0, pAlpha = 1, pAlphaT = 1, mx = -9999, my = -9999, last = 0, haveTarget = false;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function panelEl(name) { return document.querySelector('[data-panel="' + name + '"]'); }
  function targetFor(name) {
    if (name === 'pump') return panelEl(name).querySelector('#scene > [role="img"]');
    if (name === 'types') return panelEl(name).querySelector('.tcard2.on > [aria-hidden]');
    return panelEl(name).querySelector('.target');
  }
  var CRISP = { pump: 1, types: 1 };
  var typeIdx = 0;
  function targetKey(name) { return name === 'types' ? 'type' + typeIdx : name; }

  // Mosaic sampling: every particle gets its own cell of a grid, so the picture assembles like crisp pixel art.
  function sample(name) {
    var el = targetFor(name); var rect = el.getBoundingClientRect();
    var w = Math.max(40, Math.round(rect.width)), h = Math.max(40, Math.round(rect.height));
    var t = TARGETS[targetKey(name)]; var off = document.createElement('canvas'); off.width = w; off.height = h;
    var g = off.getContext('2d'); var fit = Math.min(w / t.dw, h / t.dh);
    g.translate((w - t.dw * fit) / 2, (h - t.dh * fit) / 2); g.scale(fit, fit); t.draw(g);
    var data = g.getImageData(0, 0, w, h).data;
    var cell = 4, cand;
    for (;;) {
      cand = [];
      var half = Math.floor(cell / 2);
      for (var y = half; y < h; y += cell) for (var x = half; x < w; x += cell) {
        var o = (y * w + x) * 4; if (data[o + 3] > 160 && data[o] + data[o + 1] + data[o + 2] < 690) cand.push(x, y, data[o], data[o + 1], data[o + 2]);
      }
      if (cand.length / 5 <= N || cell > 24) break;
      cell++;
    }
    var n = cand.length / 5; if (!n) return;
    var order = []; for (var j = 0; j < N; j++) order.push(j < n ? j : Math.floor(Math.random() * n));
    for (j = N - 1; j > 0; j--) { var q = Math.floor(Math.random() * (j + 1)); var tmp = order[j]; order[j] = order[q]; order[q] = tmp; }
    var size = Math.max(2, cell - 1);
    for (j = 0; j < N; j++) {
      var c = order[j] * 5, p = P[j];
      p.rx = cand[c]; p.ry = cand[c + 1]; p.s = size;
      p.tr = cand[c + 2]; p.tg = cand[c + 3]; p.tb = cand[c + 4]; p.key = (p.tr << 16) | (p.tg << 8) | p.tb;
    }
    P.sort(function (a, b) { return a.key - b.key; });
    targetEl = el; haveTarget = true;
  }
  function scatter() {
    var cx = W / 2, cy = H / 2;
    P.forEach(function (p) {
      p.vx += (Math.random() - 0.5) * 7 + (p.x - cx) * 0.004; p.vy += -2 - Math.random() * 6; p.delay = 250 + Math.random() * 450;
    });
  }

  function frame(now) {
    var dt = last ? Math.min(3, (now - last) / 16.667) : 1; last = now;
    var curPanel = cur && panelEl(cur);
    if (curPanel && CRISP[cur] && !curPanel.classList.contains('assembled') && now - switchT > (reduce ? 0 : 1800)) { curPanel.classList.add('assembled'); pAlphaT = 0; }
    pAlpha += (pAlphaT - pAlpha) * Math.min(1, 0.1 * dt);
    ctx.clearRect(0, 0, W, H);
    if (haveTarget && pAlpha > 0.01) {
      var rect = targetEl.getBoundingClientRect(), ox = rect.left, oy = rect.top, t = now / 1000;
      var k = 0.05 * dt, damp = Math.pow(0.84, dt), ck = Math.min(1, 0.07 * dt);
      ctx.globalAlpha = pAlpha;
      var lastKey = -1;
      for (var i = 0; i < N; i++) {
        var p = P[i];
        var tx = ox + p.rx, ty = oy + p.ry;
        if (reduce) { p.x = tx; p.y = ty; p.r = p.tr; p.g = p.tg; p.b = p.tb; }
        else {
          if (now - switchT > p.delay) { p.vx += (tx - p.x) * k; p.vy += (ty - p.y) * k; }
          else p.vy += 0.55 * dt;
          var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (d2 < 6400) { var d = Math.sqrt(d2) || 1, f = (1 - d2 / 6400) * 2.4 * dt; p.vx += dx / d * f; p.vy += dy / d * f; }
          p.vx *= damp; p.vy *= damp; p.x += p.vx * dt; p.y += p.vy * dt;
          p.r += (p.tr - p.r) * ck; p.g += (p.tg - p.g) * ck; p.b += (p.tb - p.b) * ck;
        }
        var ri = p.r | 0, gi = p.g | 0, bi = p.b | 0, key = (ri << 16) | (gi << 8) | bi;
        if (key !== lastKey) { ctx.fillStyle = 'rgb(' + ri + ',' + gi + ',' + bi + ')'; lastKey = key; }
        ctx.fillRect(Math.round(p.x - p.s / 2), Math.round(p.y - p.s / 2), p.s, p.s);
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- navigation ---------- */
  var scene = document.getElementById('scene');
  var userPaused = false;
  function syncPause() {
    scene.classList.toggle('paused', userPaused || cur !== 'pump');
    var b = document.getElementById('pauseBtn'); b.textContent = userPaused ? 'Запустить' : 'Пауза'; b.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    panelEl('types').classList.toggle('paused', cur !== 'types');
  }
  function go(name, fromHash) {
    if (PANELS.indexOf(name) < 0) name = 'home';
    if (cur === name) return;
    var down = cur === null || PANELS.indexOf(name) > PANELS.indexOf(cur);
    document.body.style.setProperty('--jy', down ? '90px' : '-90px');
    cur = name;
    PANELS.forEach(function (n) {
      var el = panelEl(n); var on = n === name; el.classList.toggle('active', on); el.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) el.removeAttribute('inert'); else el.setAttribute('inert', '');
    });
    document.querySelectorAll('.dock [data-go]').forEach(function (b) { var on = b.getAttribute('data-go') === name; b.setAttribute('aria-selected', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    panelEl('pump').classList.remove('assembled'); panelEl('types').classList.remove('assembled');
    pAlpha = 1; pAlphaT = 1; switchT = performance.now();
    syncPause();
    replayJumps(name, down);
    requestAnimationFrame(function () { sample(name); if (!reduce) scatter(); switchT = performance.now(); });
    decodePanel(name);
    if (!fromHash) history.replaceState(null, '', name === 'home' ? location.pathname : '#' + name);
  }
  /* ---------- decode effect: glyphs flicker, then lock into the real text left to right ---------- */
  var GLYPHS = 'NaKCaHOАТФ⁺⁻→←↑↓⇌Δαβγ0123456789абвгдеклмнопрст'.split('');
  function glyph() { return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
  function scramble(t, locked) {
    var s = ''; for (var k = 0; k < t.length; k++) { var ch = t[k]; s += (k < locked || /\s/.test(ch)) ? ch : glyph(); } return s;
  }
  // All visible text nodes inside root (SVG labels and hidden cards are skipped).
  function textNodes(root) {
    if (!root) return [];
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentElement;
      if (!p || !/\S/.test(n._orig !== undefined ? n._orig : n.nodeValue)) return NodeFilter.FILTER_REJECT;
      if (p.closest('svg,script,style')) return NodeFilter.FILTER_REJECT;
      if (p.offsetParent === null) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    var out = [], n; while ((n = w.nextNode())) out.push(n); return out;
  }
  // Every node flickers with glyphs, then locks into its real text left to right; nodes start one after another.
  function decodeNodes(nodes, base, step) {
    if (reduce || !nodes.length) return;
    var token = {};
    var items = nodes.map(function (n, i) {
      if (n._orig === undefined) n._orig = n.nodeValue;
      n._dec = token;
      var t = Array.from(n._orig);
      return { n: n, t: t, p: n.parentElement, frames: Math.min(30, Math.max(10, Math.round(t.length * 0.7))), start: (base || 0) + Math.min(i * (step || 30), 650), done: false };
    });
    items.forEach(function (it) { it.n.nodeValue = scramble(it.t, 0); it.p.classList.add('decoding'); });
    var t0 = performance.now();
    (function tick() {
      var now = performance.now() - t0, alive = false;
      items.forEach(function (it) {
        if (it.done || it.n._dec !== token) return;
        var f = Math.floor((now - it.start) / 34);
        if (f < 0) { alive = true; if (Math.random() < 0.35) it.n.nodeValue = scramble(it.t, 0); return; }
        if (f >= it.frames) { it.n.nodeValue = it._final = it.t.join(''); it.done = true; it.p.classList.remove('decoding'); return; }
        alive = true; it.n.nodeValue = scramble(it.t, Math.floor(it.t.length * f / it.frames));
      });
      if (alive) setTimeout(tick, 34);
    })();
  }
  function decode(el, delay) { decodeNodes(textNodes(el), delay || 0, 30); }
  function decodePanel(name) {
    var k = 0;
    panelEl(name).querySelectorAll('.dec').forEach(function (el) { if (el.offsetParent !== null) decode(el, 80 + (k++) * 140); });
  }

  function setType(i, silent) {
    var prev = typeIdx;
    if (!silent && cur === 'types') { panelEl('types').classList.remove('assembled'); pAlpha = 1; pAlphaT = 1; switchT = performance.now(); }
    typeIdx = (i + 3) % 3;
    document.querySelectorAll('[data-card]').forEach(function (c) {
      var on = +c.getAttribute('data-card') === typeIdx; c.classList.toggle('on', on);
      if (on) { c.style.setProperty('--dx', (i < prev ? -40 : 40) + 'px'); }
    });
    document.querySelectorAll('[data-gate]').forEach(function (gEl) { gEl.classList.toggle('cur', +gEl.getAttribute('data-gate') === typeIdx); });
    if (!silent) {
      decode(document.querySelector('[data-card="' + typeIdx + '"] .dec'), 80);
      if (cur === 'types') { requestAnimationFrame(function () { sample('types'); if (!reduce) scatter(); switchT = performance.now(); }); }
    }
  }
  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-type-step]'); if (s) { setType(typeIdx + +s.getAttribute('data-type-step')); return; }
    var b = e.target.closest('[data-go]'); if (!b) return; e.preventDefault(); go(b.getAttribute('data-go'));
  });
  document.addEventListener('keydown', function (e) {
    if (cur !== 'types' || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    if (e.target.closest && e.target.closest('.dock')) return;
    setType(typeIdx + (e.key === 'ArrowRight' ? 1 : -1)); e.preventDefault();
  });
  document.querySelector('.dock').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.dock [data-go]'));
    var i = tabs.indexOf(document.activeElement); if (i < 0) return;
    var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); go(n.getAttribute('data-go')); e.preventDefault();
  });
  window.addEventListener('hashchange', function () { go(location.hash.slice(1) || 'home', true); });

  /* ---------- jumping cards: they bounce in when a tab opens and whenever they scroll into view ---------- */
  function inView(el) { var r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; }
  function replayJumps(name, down) {
    var k = 0;
    panelEl(name).querySelectorAll('.jmp').forEach(function (el) {
      el.classList.remove('jin'); el.style.setProperty('--jy2', down ? '70px' : '-70px');
    });
    requestAnimationFrame(function () {
      panelEl(name).querySelectorAll('.jmp').forEach(function (el) {
        if (inView(el)) { el.style.setProperty('--jd', (0.15 + Math.min(k++ * 0.08, 0.5)) + 's'); el.classList.add('jin'); }
      });
    });
  }
  if ('IntersectionObserver' in window) {
    var jio = new IntersectionObserver(function (entries) {
      var k = 0;
      entries.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      entries.forEach(function (e) {
        var el = e.target, panel = el.closest('.panel');
        if (!panel || !panel.classList.contains('active')) return;
        if (e.isIntersecting) { el.style.setProperty('--jd', Math.min(k++ * 0.08, 0.4) + 's'); el.classList.add('jin'); }
        else { el.style.setProperty('--jy2', e.boundingClientRect.top < 0 ? '-70px' : '70px'); el.style.setProperty('--jd', '0s'); el.classList.remove('jin'); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.jmp').forEach(function (el) { jio.observe(el); });
  } else {
    document.querySelectorAll('.jmp').forEach(function (el) { el.classList.add('jin'); });
  }
  window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; });
  document.addEventListener('pointerleave', function () { mx = -9999; my = -9999; });
  var rt = 0;
  window.addEventListener('resize', function () { resize(); clearTimeout(rt); rt = setTimeout(function () { if (cur) sample(cur); }, 150); });
  document.getElementById('pauseBtn').addEventListener('click', function () { userPaused = !userPaused; syncPause(); });

  /* ---------- quiz ---------- */
  var Q = [
    { t: 'В каком направлении Na⁺/K⁺-АТФаза переносит ионы натрия?', o: ['В цитоплазму, по градиенту', 'Во внеклеточную среду, против градиента', 'Не переносит, только связывает'], c: 1, e: 'За один цикл насос выводит 3 Na⁺ из клетки — против градиента концентрации, за счёт энергии АТФ.' },
    { t: 'Сколько ионов переносит насос за один цикл?', o: ['2 Na⁺ из клетки и 3 K⁺ в клетку', '3 Na⁺ из клетки и 2 K⁺ в клетку', 'По одному иону в каждую сторону'], c: 1, e: '3 Na⁺ выходят из клетки, 2 K⁺ заходят внутрь — и всё это за одну молекулу АТФ.' },
    { t: 'Какой вид транспорта не требует затрат АТФ?', o: ['Na⁺/K⁺-насос', 'Облегчённая диффузия', 'Протонная помпа'], c: 1, e: 'Облегчённая диффузия — пассивный транспорт: вещество идёт по градиенту с помощью белка-переносчика, энергия не тратится.' },
    { t: 'Что такое антипорт?', o: ['Перенос одного вещества', 'Перенос двух веществ в одном направлении', 'Перенос двух веществ в противоположных направлениях'], c: 2, e: 'Пример — Na⁺/Ca²⁺-обмен в клетках сердца: на 3 входящих Na⁺ из клетки выводится 1 Ca²⁺.' },
    { t: 'За счёт чего идёт вторично-активный (сопряжённый) транспорт глюкозы?', o: ['Прямого гидролиза АТФ', 'Градиента Na⁺, созданного насосом', 'Осмотического давления'], c: 1, e: 'Глюкоза поднимается против своего градиента вместе с Na⁺, который идёт по своему. Сам градиент Na⁺ поддерживает Na⁺/K⁺-АТФаза.' },
    { t: 'Почему внутренняя сторона мембраны заряжена отрицательно?', o: ['Насос выносит больше положительных зарядов, чем заносит', 'Калий свободно проходит через липидный бислой', 'В цитоплазме накапливается АДФ'], c: 0, e: '3 Na⁺ наружу против 2 K⁺ внутрь: за каждый цикл клетка теряет один положительный заряд — насос электрогенен.' }
  ];
  var qs = { q: 0, picked: -1, answers: [], done: false };
  var qRoot = document.getElementById('quizRoot');
  var PILL = 'display: inline-block; border: 2px solid #000000; border-radius: 6px; padding: 4px 12px; font-weight: 900; font-size: 15px';
  var ACT = "min-height: 50px; padding: 0 22px; border-radius: 6px; border: 2px solid #000000; color: #000000; font: 800 16px 'Inter Tight', sans-serif; cursor: pointer";
  function renderQuiz() {
    var h = '', letters = ['А', 'Б', 'В'];
    if (!qs.done) {
      var cq = Q[qs.q], answered = qs.picked >= 0, ok = answered && qs.picked === cq.c;
      var dots = Q.map(function (_, i) { var bg = i < qs.answers.length ? (qs.answers[i] ? '#7CE0B0' : '#FF90E8') : (i === qs.q ? '#FFC900' : '#FFFFFF'); return '<span style="width: 20px; height: 10px; border: 2px solid #000000; border-radius: 3px; background: ' + bg + '; display: inline-block"></span>'; }).join('');
      h += '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px"><span style="' + PILL + '; background: #90A8ED">Вопрос ' + (qs.q + 1) + ' из ' + Q.length + '</span><span style="display: flex; gap: 5px" aria-hidden="true">' + dots + '</span></div>';
      h += '<h3 class="dec" style="font-weight: 900; font-size: clamp(22px, 2.2vw, 30px); line-height: 1.1; letter-spacing: -0.02em; margin: 14px 0 18px">' + cq.t + '</h3>';
      h += '<div role="group" aria-label="Варианты ответа" style="display: flex; flex-direction: column; gap: 10px">';
      cq.o.forEach(function (text, i) {
        var right = answered && i === cq.c, wrong = answered && i === qs.picked && !ok;
        h += '<button type="button" class="btn" data-opt="' + i + '" aria-pressed="' + (i === qs.picked) + '" style="min-height: 50px; text-align: left; padding: 8px 14px; border-radius: 6px; border: 2px solid #000000; color: #000000; font: 700 16px \'Inter Tight\', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 12px; background: ' + (right ? '#7CE0B0' : wrong ? '#FF90E8' : '#FFFFFF') + '"><span style="flex: 0 0 auto; width: 30px; height: 30px; box-sizing: border-box; border: 2px solid #000000; border-radius: 4px; background: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-weight: 900">' + (right ? '✓' : wrong ? '✕' : letters[i]) + '</span><span>' + text + '</span></button>';
      });
      h += '</div>';
      if (answered) {
        h += '<div role="status" style="margin-top: 16px; background: ' + (ok ? '#7CE0B0' : '#FF90E8') + '; border: 2px solid #000000; border-radius: 8px; padding: 12px 14px"><div style="font-weight: 900">' + (ok ? 'Верно!' : 'Неверно') + '</div><div style="font-weight: 500; font-size: 15px; margin-top: 4px">' + cq.e + '</div></div>';
        h += '<button type="button" class="btn" data-q="next" style="margin-top: 14px; ' + ACT + '; background: #FFC900">' + (qs.q + 1 >= Q.length ? 'Посмотреть результат →' : 'Следующий вопрос →') + '</button>';
      }
    } else {
      var score = qs.answers.filter(Boolean).length;
      h += '<span style="' + PILL + '; background: #FFC900">Результат</span>';
      h += '<div class="dec" style="font-weight: 900; font-size: clamp(48px, 5vw, 80px); line-height: 1; letter-spacing: -0.04em; margin: 14px 0 10px">' + score + ' из ' + Q.length + '</div>';
      h += '<p style="margin: 0 0 20px; font-weight: 500; font-size: 18px">' + (score === Q.length ? 'Отлично! Ты уверенно разбираешься в мембранном транспорте.' : score >= 4 ? 'Хорошо! Разбери ошибки — и будет идеально.' : 'Стоит открыть справочник и пройти тест ещё раз.') + '</p>';
      h += '<div style="display: flex; flex-wrap: wrap; gap: 12px"><button type="button" class="btn" data-q="restart" style="' + ACT + '; background: #FF90E8">Пройти ещё раз</button><button type="button" class="btn" data-go="ref" style="' + ACT + '; background: #FFFFFF">Открыть справочник</button></div>';
    }
    qRoot.innerHTML = h;
    var key = qs.done ? 'done' : 'q' + qs.q;
    if (key !== lastQuizKey && cur === 'quiz') decode(qRoot.querySelector('.dec'), 40);
    lastQuizKey = key;
  }
  var lastQuizKey = '';
  qRoot.addEventListener('click', function (e) {
    var b = e.target.closest('[data-opt],[data-q]'); if (!b) return;
    if (b.hasAttribute('data-opt')) {
      if (qs.picked >= 0) return; var i = +b.getAttribute('data-opt'); qs.picked = i; qs.answers.push(i === Q[qs.q].c);
    } else if (b.getAttribute('data-q') === 'next') { if (qs.q + 1 >= Q.length) qs.done = true; else { qs.q++; qs.picked = -1; } }
    else if (b.getAttribute('data-q') === 'restart') { qs = { q: 0, picked: -1, answers: [], done: false }; }
    renderQuiz();
  });

  /* ---------- start ---------- */
  resize(); renderQuiz(); setType(0, true);
  var start = function () { go(location.hash.slice(1) || 'home', true); requestAnimationFrame(frame); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
})();
