/* Эффект «расшифровки» текста при прокрутке: каждый блок расшифровывается, когда впервые появляется на экране. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var GLYPHS = 'NaKCaHOАТФ⁺⁻→←↑↓⇌Δαβγ0123456789абвгдеклмнопрст'.split('');
  function glyph() { return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
  function scramble(t, locked) { var s = ''; for (var k = 0; k < t.length; k++) { var ch = t[k]; s += (k < locked || /\s/.test(ch)) ? ch : glyph(); } return s; }
  function textNodes(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentElement;
      if (!p || !/\S/.test(n.nodeValue) || p.closest('svg,script,style,canvas') || p.offsetParent === null) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    var out = [], n; while ((n = w.nextNode())) out.push(n); return out;
  }
  function decodeNodes(nodes, step) {
    var items = nodes.map(function (n, i) {
      var t = Array.from(n.nodeValue);
      return { n: n, t: t, p: n.parentElement, frames: Math.min(30, Math.max(10, Math.round(t.length * 0.7))), start: Math.min(i * step, 650), done: false };
    });
    items.forEach(function (it) { it.n.nodeValue = scramble(it.t, 0); it.p.style.color = it.p.style.color || ''; it.p.classList.add('decoding'); });
    var t0 = performance.now();
    (function tick() {
      var now = performance.now() - t0, alive = false;
      items.forEach(function (it) {
        if (it.done) return;
        var f = Math.floor((now - it.start) / 34);
        if (f < 0) { alive = true; if (Math.random() < 0.35) it.n.nodeValue = scramble(it.t, 0); return; }
        if (f >= it.frames) { it.n.nodeValue = it.t.join(''); it.done = true; it.p.classList.remove('decoding'); return; }
        alive = true; it.n.nodeValue = scramble(it.t, Math.floor(it.t.length * f / it.frames));
      });
      if (alive) setTimeout(tick, 34);
    })();
  }
  var st = document.createElement('style');
  st.textContent = '.decoding{color:#7A7A7A!important}';
  document.head.appendChild(st);
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); decodeNodes(textNodes(e.target), 22); } });
  }, { threshold: 0.12 });
  var root = document.body.firstElementChild;
  Array.prototype.forEach.call(root ? root.children : [], function (el) {
    if (/^(HEADER|SECTION|ARTICLE|FOOTER)$/.test(el.tagName)) io.observe(el);
  });
})();
