/* Velrixa Studio — premium enhancements.
   Vanilla JS, no dependencies. Safe by design: every feature guards for
   missing elements, and the stagger reveal only hides cards when
   IntersectionObserver exists (without this script, cards render as before). */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document.documentElement;

  /* Scroll progress bar, header state, back-to-top, hero-glow parallax. */
  var bar = document.getElementById('scroll-progress');
  var header = document.querySelector('header');
  var toTop = document.getElementById('toTop');
  var glow = document.querySelector('.hero-glow');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (header) header.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
    if (glow && !reduced) {
      var shift = Math.min(y * 0.12, 140);
      glow.style.transform = 'translate3d(0,' + shift + 'px,0)';
      glow.style.opacity = String(Math.max(0, 1 - y / 700));
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('load', onScroll);
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* Staggered card reveals. Cards stay visible if IO is unavailable. */
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        io.unobserve(card);
        card.classList.add('in-view');
        setTimeout(function () {
          var grid = card.parentElement;
          var pending = grid && grid.querySelector('.card:not(.in-view), .stat-card:not(.in-view), .cert-card:not(.in-view)');
          if (grid && !pending) grid.classList.add('stagger-done');
        }, 950);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('.grid, .cert-grid, .stats-grid').forEach(function (grid) {
      grid.classList.add('js-stagger');
      Array.prototype.forEach.call(grid.children, function (child) {
        if (child.classList.contains('card') || child.classList.contains('stat-card') || child.classList.contains('cert-card')) {
          io.observe(child);
        }
      });
    });
  }
})();
