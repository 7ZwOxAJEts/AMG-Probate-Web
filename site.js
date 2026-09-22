// AMG Probate — header state, mobile nav, active link, year
(function () {
  var header = document.getElementById('site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-navigation');
  var backToTop = document.getElementById('back-to-top');

  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    if (backToTop) {
      if (window.scrollY > 600) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Scroll reveal: JS adds .reveal so content stays visible without JS
  var revealTargets = document.querySelectorAll(
    '.strengths > *, .stat-card, .about-values > *, .service-card, ' +
    '.approach-steps > li, .contact-item, .contact-spotlight, ' +
    '.works-intro, .works-details, .who-copy > p, .section-intro-grid > div, ' +
    '.stats'
  );
  Array.prototype.forEach.call(revealTargets, function (el) {
    var siblings = el.parentNode ? el.parentNode.children : [];
    var index = Array.prototype.indexOf.call(siblings, el);
    el.style.setProperty('--rd', Math.min(index, 4) * 70 + 'ms');
    el.classList.add('reveal');
  });
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) { revealObserver.observe(el); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('in'); });
  }

  // Active nav highlight
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        links.forEach(function (a) {
          if (a.getAttribute('href') === id) {
            a.classList.add('active');
            if (!a.classList.contains('nav-cta')) a.setAttribute('aria-current', 'page');
          } else {
            a.classList.remove('active');
            a.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
