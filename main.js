(function () {
  "use strict";

  var data = window.__CV__ || {};

  /* ── Safe wrapper ─────────────────────────────────────── */
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ── Nav ──────────────────────────────────────────────── */
  function initNav() {
    var nav = document.querySelector(".nav");
    var hamburger = document.querySelector(".nav-hamburger");
    var mobileMenu = document.querySelector(".nav-mobile");

    if (!nav) return;

    // Sticky style
    function onScroll() {
      if (window.scrollY > 40) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active link
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .nav-mobile a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        a.classList.add("is-active");
      }
    });

    // Mobile toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", function () {
        var open = mobileMenu.classList.contains("is-open");
        if (open) {
          mobileMenu.classList.remove("is-open");
          hamburger.classList.remove("is-open");
          mobileMenu.style.display = "";
        } else {
          mobileMenu.style.display = "flex";
          requestAnimationFrame(function () {
            mobileMenu.classList.add("is-open");
            hamburger.classList.add("is-open");
          });
        }
      });

      // Close on link click
      mobileMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          mobileMenu.classList.remove("is-open");
          hamburger.classList.remove("is-open");
          setTimeout(function () { mobileMenu.style.display = ""; }, 300);
        });
      });
    }
  }

  /* ── Smooth scroll for anchors ─────────────────────────── */
  function setupSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /* ── Scroll reveals ────────────────────────────────────── */
  function initReveals() {
    var selectors = ".reveal, .reveal-left, .reveal-right";
    var els = document.querySelectorAll(selectors);
    if (!els.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px -3% 0px" }
    );

    els.forEach(function (el) { io.observe(el); });

    // Safety net — reveal anything still hidden after 6s
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ── Count-up animation ────────────────────────────────── */
  function initCountUp() {
    var els = document.querySelectorAll("[data-count-to]");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var target = parseFloat(e.target.getAttribute("data-count-to"));
        var suffix = e.target.getAttribute("data-suffix") || "";
        var duration = 1800;
        var start = performance.now();
        function tick(now) {
          var progress = Math.min((now - start) / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3);
          var val = Math.round(ease * target);
          e.target.textContent = val + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Mouse-reactive mesh tilt ──────────────────────────── */
  function initMouseMesh() {
    var mesh = document.querySelector(".page-mesh");
    if (!mesh) return;
    if (matchMedia("(hover: none)").matches) return;

    var rx = 50, ry = 50;
    var cx = 50, cy = 50;
    var raf;

    window.addEventListener("mousemove", function (e) {
      rx = (e.clientX / window.innerWidth) * 100;
      ry = (e.clientY / window.innerHeight) * 100;
    }, { passive: true });

    function loop() {
      cx += (rx - cx) * 0.03;
      cy += (ry - cy) * 0.03;
      document.documentElement.style.setProperty("--mx", cx + "%");
      document.documentElement.style.setProperty("--my", cy + "%");
      raf = requestAnimationFrame(loop);
    }
    loop();
  }

  /* ── Tilt on cards ─────────────────────────────────────── */
  function initTilt() {
    if (matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".listing-card, .service-card, .stat-card").forEach(function (card) {
      card.addEventListener("mouseover", function (e) {
        if (!card.contains(e.relatedTarget)) activate(card, true);
      });
      card.addEventListener("mouseout", function (e) {
        if (!card.contains(e.relatedTarget)) activate(card, false);
      });
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "translateY(-8px) rotateX(" + (-y * 7) + "deg) rotateY(" + (x * 7) + "deg)";
      });
    });

    function activate(card, on) {
      if (!on) {
        card.style.transform = "";
        card.style.transition = "transform 0.5s var(--ease-out), box-shadow 0.4s";
      } else {
        card.style.transition = "transform 0.15s ease, box-shadow 0.3s";
      }
    }
  }

  /* ── Fill nav dynamically (mobile + desktop) ──────────── */
  function initNavLinks() {
    if (!data.nav) return;
    document.querySelectorAll("[data-nav-links]").forEach(function (container) {
      if (container.children.length > 0) return;
      var html = data.nav.map(function (item) {
        return '<a href="' + item.href + '">' + item.label + "</a>";
      }).join("");
      // Add CTA to desktop nav
      if (container.classList.contains("nav-links")) {
        html += '<a href="contact.html" class="nav-cta">Get a Quote</a>';
      }
      container.innerHTML = html;

      // Re-mark active
      var currentPage = window.location.pathname.split("/").pop() || "index.html";
      container.querySelectorAll("a").forEach(function (a) {
        var href = a.getAttribute("href");
        if (href === currentPage || (currentPage === "" && href === "index.html")) {
          if (!a.classList.contains("nav-cta")) a.classList.add("is-active");
        }
      });
    });
  }

  /* ── Fill listings ─────────────────────────────────────── */
  function initListings() {
    var container = document.querySelector("[data-listings]");
    if (!container || container.children.length > 0) return;
    var listings = data.listings || [];
    container.innerHTML = listings.map(function (l) {
      return '<article class="listing-card reveal" tabindex="0" role="article" aria-label="' + l.title + ' - ' + l.price + '">' +
        '<div class="listing-img">' +
          (l.tag ? '<span class="listing-tag">' + l.tag + '</span>' : '') +
          '<img src="assets/img/' + l.img + '" alt="' + l.title + ' — ' + l.type + ' in ' + l.location + '" loading="lazy" width="400" height="300">' +
        '</div>' +
        '<div class="listing-body">' +
          '<div class="listing-type">' + l.type + '</div>' +
          '<h3 class="listing-title">' + l.title + '</h3>' +
          '<p class="listing-location">📍 ' + l.location + '</p>' +
          '<div class="listing-price">' + l.price + '</div>' +
          '<div class="listing-meta">' +
            '<span>🛏 ' + l.beds + ' beds</span>' +
            '<span>🚿 ' + l.baths + ' baths</span>' +
            '<span>📐 ' + l.sqft + ' sqft</span>' +
          '</div>' +
        '</div>' +
        '</article>';
    }).join("");
    initReveals();
  }

  /* ── Fill services ─────────────────────────────────────── */
  function initServices() {
    var container = document.querySelector("[data-services]");
    if (!container || container.children.length > 0) return;
    var services = data.services || [];
    container.innerHTML = services.map(function (s) {
      return '<div class="service-card glass reveal">' +
        '<span class="service-icon" aria-hidden="true">' + s.icon + '</span>' +
        '<h3 class="service-title">' + s.title + '</h3>' +
        '<p class="service-desc">' + s.desc + '</p>' +
        '<div class="service-keywords">' +
          s.keywords.map(function (k) { return '<span class="service-kw">' + k + '</span>'; }).join("") +
        '</div>' +
        '</div>';
    }).join("");
    initReveals();
  }

  /* ── Fill stats ────────────────────────────────────────── */
  function initStats() {
    var container = document.querySelector("[data-stats]");
    if (!container || container.children.length > 0) return;
    var stats = data.stats || [];
    container.innerHTML = stats.map(function (s) {
      return '<div class="stat-card glass reveal">' +
        '<div class="stat-num">' +
          '<span data-count-to="' + s.value + '" data-suffix="' + s.suffix + '">0' + s.suffix + '</span>' +
        '</div>' +
        '<div class="stat-label">' + s.label + '</div>' +
        '</div>';
    }).join("");
    initCountUp();
    initReveals();
  }

  /* ── Fill testimonials ─────────────────────────────────── */
  function initTestimonials() {
    var container = document.querySelector("[data-testimonials]");
    if (!container || container.children.length > 0) return;
    var testimonials = data.testimonials || [];
    container.innerHTML = testimonials.map(function (t) {
      return '<div class="testimonial-card glass reveal">' +
        '<div class="testimonial-quote-mark" aria-hidden="true">"</div>' +
        '<p class="testimonial-text">' + t.quote + '</p>' +
        '<div class="testimonial-author">' +
          '<strong>' + t.author + '</strong>' +
          '<span>' + t.location + '</span>' +
        '</div>' +
        '</div>';
    }).join("");
    initReveals();
  }

  /* ── Fill blog ─────────────────────────────────────────── */
  function initBlog() {
    var container = document.querySelector("[data-blog]");
    if (!container || container.children.length > 0) return;
    var posts = data.blog || [];
    container.innerHTML = posts.map(function (p) {
      return '<article class="blog-card reveal">' +
        '<a href="' + p.slug + '">' +
          '<div class="blog-img">' +
            '<img src="assets/img/' + p.img + '" alt="' + p.title + '" loading="lazy" width="400" height="225">' +
          '</div>' +
          '<div class="blog-body">' +
            '<div class="blog-cat">' + p.category + '</div>' +
            '<h3 class="blog-title">' + p.title + '</h3>' +
            '<p class="blog-excerpt">' + p.excerpt + '</p>' +
            '<div class="blog-footer">' +
              '<span>' + p.date + '</span>' +
              '<span class="blog-read-more">Read more →</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
        '</article>';
    }).join("");
    initReveals();
  }

  /* ── Fill footer ───────────────────────────────────────── */
  function initFooter() {
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();

    var phone = document.querySelectorAll("[data-phone]");
    phone.forEach(function (el) { el.textContent = data.phone || ""; });

    var email = document.querySelectorAll("[data-email]");
    email.forEach(function (el) { el.textContent = data.email || ""; });

    var address = document.querySelectorAll("[data-address]");
    address.forEach(function (el) { el.textContent = data.address || ""; });
  }

  /* ── Contact form ──────────────────────────────────────── */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var btn = form.querySelector(".form-submit");
      var successMsg = form.querySelector(".form-success-msg");
      btn.classList.add("is-sending");
      btn.textContent = "Sending…";

      setTimeout(function () {
        btn.classList.remove("is-sending");
        btn.classList.add("is-success");
        btn.textContent = "✓ Message sent!";
        if (successMsg) successMsg.style.display = "block";
        form.reset();
        setTimeout(function () {
          btn.classList.remove("is-success");
          btn.textContent = "Send Message";
          if (successMsg) successMsg.style.display = "none";
        }, 5000);
      }, 1400);
    });
  }

  /* ── Portfolio filter ──────────────────────────────────── */
  function initPortfolioFilter() {
    var filterBtns = document.querySelectorAll(".filter-btn");
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");

        document.querySelectorAll(".listing-card[data-type]").forEach(function (card) {
          var type = card.getAttribute("data-type");
          if (filter === "all" || type === filter) {
            card.style.display = "";
            requestAnimationFrame(function () { card.style.opacity = "1"; });
          } else {
            card.style.opacity = "0";
            setTimeout(function () { card.style.display = "none"; }, 300);
          }
        });
      });
    });
  }

  /* ── GSAP scroll animations ─────────────────────────────── */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Parallax on hero image
    var heroImg = document.querySelector(".hero-img-wrap img");
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }

  /* ── Boot ──────────────────────────────────────────────── */
  function boot() {
    safe(initNavLinks, "initNavLinks");
    safe(initNav, "initNav");
    safe(setupSmoothScroll, "setupSmoothScroll");
    safe(initReveals, "initReveals");
    safe(initMouseMesh, "initMouseMesh");
    safe(initTilt, "initTilt");
    safe(initListings, "initListings");
    safe(initServices, "initServices");
    safe(initStats, "initStats");
    safe(initTestimonials, "initTestimonials");
    safe(initBlog, "initBlog");
    safe(initFooter, "initFooter");
    safe(initContactForm, "initContactForm");
    safe(initPortfolioFilter, "initPortfolioFilter");
    safe(initGSAP, "initGSAP");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
