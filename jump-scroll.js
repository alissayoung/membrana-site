/* Блоки «впрыгивают» при прокрутке: листаешь вниз — появляются снизу и прыгают вверх, листаешь вверх — падают сверху. */
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  var css = document.createElement('style');
  css.textContent =
    '.jmp{opacity:0;transform:translateY(var(--jy,70px)) scale(.95);transition:opacity .3s ease,transform .3s ease}' +
    '.jmp.jin{opacity:1;transform:none;transition:opacity .35s ease var(--jd,0s),transform .75s cubic-bezier(.34,1.56,.64,1) var(--jd,0s)}';
  document.head.appendChild(css);

  var SEL = 'h1, h2, figure, .card, .toc, li, dl > div, article p, section > div > p, div[style*="padding: 16px 18px"]';
  var all = Array.prototype.slice.call(document.querySelectorAll(SEL)).filter(function (el) {
    return !el.closest('#wrap, svg, header, nav');
  });
  var set = new Set(all);
  // keep only the outermost matches so nested blocks do not jump twice
  var items = all.filter(function (el) { var p = el.parentElement; while (p) { if (set.has(p)) return false; p = p.parentElement; } return true; });

  var vh = window.innerHeight;
  items.forEach(function (el) {
    var r = el.getBoundingClientRect();
    el.classList.add('jmp');
    if (r.top < vh && r.bottom > 0) el.classList.add('jin');
    else el.style.setProperty('--jy', r.top >= vh ? '70px' : '-70px');
  });

  var io = new IntersectionObserver(function (entries) {
    var k = 0;
    entries.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
    entries.forEach(function (e) {
      var el = e.target;
      if (e.isIntersecting) {
        el.style.setProperty('--jd', Math.min(k++ * 0.07, 0.35) + 's');
        el.classList.add('jin');
      } else {
        // it left the screen: next time it comes from the side it left through
        el.style.setProperty('--jy', e.boundingClientRect.top < 0 ? '-70px' : '70px');
        el.style.setProperty('--jd', '0s');
        el.classList.remove('jin');
      }
    });
  }, { threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
