document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll reveal, staggered within any [data-stagger] container ── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  revealEls.forEach(function (el) {
    var group = el.closest('[data-stagger]');
    if (group) {
      var siblings = Array.prototype.slice.call(group.querySelectorAll('.reveal'));
      var idx = siblings.indexOf(el);
      el.style.setProperty('--delay', Math.min(idx * 60, 300) + 'ms');
    }
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ── Animated number counters, e.g. data-count-to="6.6k" or "4.0" ── */
  function animateCount(el) {
    var raw = el.getAttribute('data-count-to') || '';
    var match = raw.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    var target = parseFloat(match[1]);
    var suffix = match[2] || '';
    var decimals = (match[1].split('.')[1] || '').length;

    if (prefersReduced || isNaN(target)) {
      el.textContent = raw;
      return;
    }

    var duration = 1100;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countIO.unobserve(entry.target);
          animateCount(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { countIO.observe(el); });
    }
  }

  /* ── Header gains a hairline once the page scrolls ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var scrolled = false;
    function onScroll() {
      var next = window.scrollY > 24;
      if (next !== scrolled) {
        scrolled = next;
        header.classList.toggle('is-scrolled', scrolled);
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});
