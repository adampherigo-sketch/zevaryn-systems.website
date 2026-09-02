/* ==========================================================
   ZEVARYN SYSTEMS — HOMEPAGE JS  (Phase 2)
   Loaded after main.js, on index.html only.

   - Entry status sequence + click / key to enter
   - Hero load reveal
   - Hero interface pointer tilt
   - Featured mockup scroll parallax
   ========================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initEntry();
    initHeroFallback();
    initInterfaceTilt();
    initFeaturedParallax();
  });


  /* ---- Entry screen ---- */

  function revealHero() {
    var hero = document.querySelector('.home-hero');
    if (hero) hero.classList.add('is-revealed');
  }

  function initEntry() {
    var entry = document.getElementById('entry-screen');

    // Returning visitor: main.js already removed the entry screen.
    if (!entry) {
      revealHero();
      return;
    }

    var statusEl = entry.querySelector('.entry-status');
    var enterBtn = entry.querySelector('[data-entry-enter]');
    var entered = false;

    var enter = function () {
      if (entered) return;
      entered = true;
      if (enterBtn) enterBtn.click(); // main.js handles fade-out + sessionStorage
      revealHero();
    };

    // Boot sequence for the status line.
    if (statusEl) {
      var steps = ['INITIALIZING', 'LOADING INTERFACE', 'SYSTEM / READY'];

      if (reduceMotion) {
        statusEl.textContent = steps[steps.length - 1];
        entry.classList.add('is-ready');
      } else {
        statusEl.textContent = steps[0];
        var i = 0;
        var advance = function () {
          i += 1;
          if (i < steps.length) {
            statusEl.textContent = steps[i];
            window.setTimeout(advance, 520);
          } else {
            entry.classList.add('is-ready');
          }
        };
        window.setTimeout(advance, 520);
      }
    }

    // Click anywhere on the backdrop (not on a real control) enters.
    entry.addEventListener('click', function (event) {
      if (event.target.closest('button, a')) return;
      enter();
    });

    // Enter / Space enters while the screen is up.
    document.addEventListener('keydown', function (event) {
      if (!document.getElementById('entry-screen')) return;
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        enter();
      }
    });

    // Direct button use should also trigger the hero reveal.
    if (enterBtn) enterBtn.addEventListener('click', revealHero);
  }

  function initHeroFallback() {
    // Safety net: if nothing revealed the hero, show it.
    window.setTimeout(function () {
      var hero = document.querySelector('.home-hero');
      if (hero && !hero.classList.contains('is-revealed') && !document.getElementById('entry-screen')) {
        hero.classList.add('is-revealed');
      }
    }, 1400);
  }


  /* ---- Hero interface pointer tilt ---- */

  function initInterfaceTilt() {
    if (reduceMotion || !finePointer) return;

    var scene = document.querySelector('.hero-interface');
    var inner = scene && scene.querySelector('.hero-interface-inner');
    if (!inner) return;

    var frame = 0;

    scene.addEventListener('pointermove', function (event) {
      var rect = scene.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;

      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        frame = 0;
        inner.style.transform =
          'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (y * -7).toFixed(2) + 'deg)';
      });
    });

    scene.addEventListener('pointerleave', function () {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      inner.style.transform = '';
    });
  }


  /* ---- Featured mockup scroll parallax ---- */

  function initFeaturedParallax() {
    if (reduceMotion || !window.matchMedia('(min-width: 1024px)').matches) return;

    var items = document.querySelectorAll('[data-parallax]');
    if (!items.length) return;

    var frame = 0;

    var update = function () {
      frame = 0;
      var vh = window.innerHeight || document.documentElement.clientHeight;

      items.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var progress = (center - vh / 2) / vh;
        var depth = parseFloat(el.getAttribute('data-parallax')) || 1;
        el.style.transform = 'translate3d(0,' + (-progress * 20 * depth).toFixed(1) + 'px,0)';
      });
    };

    var onScroll = function () {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }
})();
