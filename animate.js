document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll reveal, staggered within any [data-stagger] container ── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  revealEls.forEach(function (el) {
    var group = el.closest('[data-stagger]');
    if (group) {
      var siblings = Array.prototype.slice.call(group.querySelectorAll('.reveal'));
      var idx = siblings.indexOf(el);
      el.style.setProperty('--delay', Math.min(idx * 60, 480) + 'ms');
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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
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

  /* ── Nav gains a shadow once the page scrolls ── */
  var nav = document.querySelector('nav');
  if (nav) {
    var scrolled = false;
    function onScroll() {
      var next = window.scrollY > 24;
      if (next !== scrolled) {
        scrolled = next;
        nav.classList.toggle('nav-scrolled', scrolled);
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Subtle hero glow parallax on mouse move (pointer devices only) ── */
  var glow = document.querySelector('.hero-glow');
  var hero = document.getElementById('hero');
  if (glow && hero && !prefersReduced && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      glow.style.transform = 'translate(' + (x * 44).toFixed(1) + 'px,' + (y * 44).toFixed(1) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      glow.style.transform = 'translate(0,0)';
    });
  }
});
