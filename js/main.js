/* ==========================================================
   ZEVARYN SYSTEMS — MAIN JAVASCRIPT
   WEB DEVELOPMENT STUDIO
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     ELEMENTS
     ========================================================== */

  const body = document.body;
  const entryScreen = document.getElementById('entry-screen');
  const entryButton = document.querySelector('[data-entry-enter]');
  const exitButton = document.querySelector('[data-entry-exit]');
  const siteNav = document.querySelector('.site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-scale'
  );
  const cursorHalo = document.querySelector('.cursor-halo');


  /* ==========================================================
     FIRST-VISIT ENTRY
     ========================================================== */

  const dismissEntry = () => {
    if (!entryScreen) return;

    entryScreen.classList.add('is-leaving');

    window.setTimeout(() => {
      entryScreen.remove();
    }, 650);
  };


  if (entryScreen) {
    let hasEntered = false;

    try {
      hasEntered = sessionStorage.getItem('zevarynEntered') === 'true';
    } catch (error) {
      hasEntered = false;
    }

    if (hasEntered) {
      entryScreen.remove();
    } else if (entryButton) {
      entryButton.addEventListener('click', () => {
        try {
          sessionStorage.setItem('zevarynEntered', 'true');
        } catch (error) {
          // Continue to the site when storage is unavailable.
        }

        dismissEntry();
      });
    }
  }


  if (exitButton) {
    exitButton.addEventListener('click', () => {
      window.close();

      if (window.history.length > 1) {
        window.setTimeout(() => {
          window.history.back();
        }, 100);
      }
    });
  }


  /* ==========================================================
     NAVBAR SCROLL STATE
     ========================================================== */

  const updateNavbar = () => {
    if (!siteNav) return;

    if (window.scrollY > 24) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  };


  updateNavbar();

  window.addEventListener(
    'scroll',
    updateNavbar,
    { passive: true }
  );


  /* ==========================================================
     MOBILE MENU
     ========================================================== */

  const openMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;

    navToggle.classList.add('open');
    mobileMenu.classList.add('open');
    body.classList.add('menu-open');

    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute(
      'aria-label',
      'Close navigation menu'
    );
  };


  const closeMobileMenu = () => {
    if (!navToggle || !mobileMenu) return;

    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    body.classList.remove('menu-open');

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute(
      'aria-label',
      'Open navigation menu'
    );
  };


  const toggleMobileMenu = () => {
    if (!mobileMenu) return;

    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };


  if (navToggle) {
    navToggle.addEventListener(
      'click',
      toggleMobileMenu
    );
  }


  /*
   * Close menu after selecting a link.
   */
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  /*
   * Escape key closes mobile navigation.
   */
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });


  /*
   * If the screen becomes desktop-sized while
   * the mobile menu is open, reset the menu state.
   */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMobileMenu();
    }
  });


  /* ==========================================================
     REVEAL ANIMATIONS
     ========================================================== */

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


  /*
   * Apply data-delay values from the HTML.
   *
   * Example:
   * data-delay="120"
   */
  revealElements.forEach(element => {
    const delay = element.dataset.delay;

    if (delay) {
      element.style.transitionDelay = `${delay}ms`;
    }
  });


  /*
   * Reduced motion:
   * immediately show everything.
   */
  if (prefersReducedMotion) {

    revealElements.forEach(element => {
      element.classList.add('in');
      element.style.transitionDelay = '0ms';
    });

  } else {

    const revealObserver = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('in');

          revealObserver.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    );


    revealElements.forEach(element => {

      /*
       * Elements that already contain .in in the HTML
       * should stay visible immediately.
       */
      if (element.classList.contains('in')) {
        return;
      }

      revealObserver.observe(element);

    });

  }


  /* ==========================================================
     CUSTOM CURSOR HALO
     ========================================================== */

  const supportsFinePointer = window.matchMedia(
    '(pointer: fine)'
  ).matches;


  if (
    cursorHalo &&
    supportsFinePointer &&
    !prefersReducedMotion
  ) {

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;


    const moveCursor = event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursorHalo.style.opacity = '1';
    };


    const hideCursor = () => {
      cursorHalo.style.opacity = '0';
    };


    const animateCursor = () => {

      /*
       * Small interpolation gives the halo
       * a subtle trailing motion.
       */
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      cursorHalo.style.left = `${currentX}px`;
      cursorHalo.style.top = `${currentY}px`;

      requestAnimationFrame(animateCursor);

    };


    document.addEventListener(
      'mousemove',
      moveCursor,
      { passive: true }
    );

    document.addEventListener(
      'mouseleave',
      hideCursor
    );

    document.addEventListener(
      'mouseenter',
      () => {
        cursorHalo.style.opacity = '1';
      }
    );


    animateCursor();


    /* ========================================================
       CURSOR INTERACTIONS
       ======================================================== */

    const interactiveElements = document.querySelectorAll(
      'a, button, .service-card, .capability-item, .project-card'
    );


    interactiveElements.forEach(element => {

      element.addEventListener('mouseenter', () => {

        cursorHalo.style.width = '48px';
        cursorHalo.style.height = '48px';
        cursorHalo.style.borderColor = 'var(--violet)';

      });


      element.addEventListener('mouseleave', () => {

        cursorHalo.style.width = '32px';
        cursorHalo.style.height = '32px';
        cursorHalo.style.borderColor = 'var(--pink)';

      });

    });

  } else if (cursorHalo) {

    /*
     * Hide custom cursor entirely on touch devices,
     * reduced-motion environments, etc.
     */
    cursorHalo.style.display = 'none';

  }


  /* ==========================================================
     INTERNAL ANCHOR LINKS
     ========================================================== */

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );


  anchorLinks.forEach(link => {

    link.addEventListener('click', event => {

      const selector = link.getAttribute('href');

      const target = document.querySelector(selector);

      if (!target) return;

      event.preventDefault();

      closeMobileMenu();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });

    });

  });


  /* ==========================================================
     PREVENT PLACEHOLDER SOCIAL LINKS FROM JUMPING TO TOP
     ========================================================== */

  const placeholderLinks = document.querySelectorAll(
    'a[href="#"]'
  );


  placeholderLinks.forEach(link => {

    link.addEventListener('click', event => {
      event.preventDefault();
    });

  });


  /* ==========================================================
     ACTIVE NAV LINK
     ========================================================== */

  const navLinks = document.querySelectorAll(
    '.nav-links a'
  );


  const currentPage =
    window.location.pathname.split('/').pop() ||
    'index.html';


  navLinks.forEach(link => {

    const linkPage =
      link.getAttribute('href')?.split('/').pop();

    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

  });


  /* ==========================================================
     PROJECT INQUIRY FORM
     ========================================================== */

  const projectForm = document.querySelector('[data-project-form]');
  const formStatus = document.querySelector('[data-form-status]');


  if (projectForm && formStatus) {
    projectForm.addEventListener('submit', event => {
      event.preventDefault();

      if (!projectForm.checkValidity()) {
        formStatus.textContent =
          'Please complete the required fields before sending.';
        projectForm.reportValidity();
        return;
      }

      formStatus.textContent =
        'Project form is being prepared for launch.';
    });
  }


  /* ==========================================================
     SYSTEM LINE OPTIONAL EFFECT
     ========================================================== */

  /*
   * If you add:
   *
   * <div class="system-line"></div>
   *
   * anywhere in the site, CSS automatically handles
   * the animated scan effect.
   *
   * No additional JS required.
   */


  /* ==========================================================
     READY
     ========================================================== */

  console.log(
    '%c ZEVARYN.SYSTEMS ',
    'background:#ff2f7e;color:#0a0a0c;font-weight:bold;padding:4px 8px;'
  );

  console.log(
    '%c Interface ready. ',
    'color:#8b5cf6;'
  );

});