(function () {
  "use strict";

  /* ── Navbar: add .scrolled class when page scrolls ── */
  var navbar = document.querySelector(".navbar");
  if (navbar) {
    var checkScroll = function () {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
  }

  /* ── Mobile nav toggle ── */
  var toggle = document.querySelector(".navbar-toggle");
  var nav    = document.querySelector(".navbar-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── Scroll-spy: highlight active nav link ── */
  var sections = document.querySelectorAll(".home-section[id]");
  var navLinks = document.querySelectorAll('.navbar-nav a[href^="/#"]');
  if (sections.length && navLinks.length) {
    var spy = function () {
      var current = "";
      sections.forEach(function (s) {
        if (window.scrollY >= s.offsetTop - 90) current = s.id;
      });
      navLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "/#" + current);
      });
    };
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* ── Scroll reveal ── */
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    document
      .querySelectorAll(".home-section, .post-item, .project-card, .post-list-item")
      .forEach(function (el) {
        el.classList.add("reveal");
        obs.observe(el);
      });
  }

  /* ── Cycling typewriter on role text ── */
  var role = document.querySelector(".about-role");
  if (role) {
    var roles = [];
    try { roles = JSON.parse(role.getAttribute("data-roles") || "[]"); } catch (e) {}
    if (!roles.length) {
      var fallback = role.textContent.trim();
      if (fallback) roles = [fallback];
    }

    if (roles.length === 0) return;

    role.textContent = "";

    var roleIdx   = 0;
    var charIdx   = 0;
    var deleting  = false;
    var PAUSE_END = 2200;   /* ms to pause after fully typing a role  */
    var PAUSE_GAP = 350;    /* ms to pause before typing the next one */
    var SPEED_TYPE = function () { return 55 + Math.random() * 35; };
    var SPEED_DEL  = 28;

    var tick = function () {
      var current = roles[roleIdx];

      if (!deleting) {
        charIdx++;
        role.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          if (roles.length === 1) {
            /* single role — stop cursor after pause */
            setTimeout(function () { role.classList.add("cursor-done"); }, 1800);
            return;
          }
          deleting = true;
          setTimeout(tick, PAUSE_END);
          return;
        }
        setTimeout(tick, SPEED_TYPE());
      } else {
        charIdx--;
        role.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          var next;
          do { next = Math.random() * roles.length | 0; } while (next === roleIdx && roles.length > 1);
          roleIdx = next;
          setTimeout(tick, PAUSE_GAP);
          return;
        }
        setTimeout(tick, SPEED_DEL);
      }
    };

    setTimeout(tick, 500);
  }
})();
