(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var body = document.body;

  if (toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Language toggle (NL default, client-side EN swap) ---------- */

  var LANG_KEY = "klaro-lang";
  var dict = (window.KLARO_I18N && window.KLARO_I18N.en) || {};
  var currentLang = localStorage.getItem(LANG_KEY) || "nl";

  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (el.dataset.i18nNl === undefined) {
        el.dataset.i18nNl = el.textContent;
      }
      el.textContent = lang === "en" && dict[key] ? dict[key] : el.dataset.i18nNl;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0];
        var key = parts[1];
        var storeAttr = "i18nNl_" + attr;
        if (el.dataset[storeAttr] === undefined) {
          el.dataset[storeAttr] = el.getAttribute(attr) || "";
        }
        el.setAttribute(attr, lang === "en" && dict[key] ? dict[key] : el.dataset[storeAttr]);
      });
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    localStorage.setItem(LANG_KEY, lang);
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  applyLanguage(currentLang);

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var revealTargets = document.querySelectorAll(
      ".hero-copy, .hero-visual, .page-hero, .section-head, .service-card, .compare-col, .contact-form, .contact-direct, .example-block, .cta-banner"
    );

    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal", "reveal-stagger");
      el.style.setProperty("--stagger", i % 4);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });

    var heroVisual = document.querySelector(".hero-visual");
    if (heroVisual) {
      var heroObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            entry.target.classList.toggle("in-view", entry.isIntersecting);
          });
        },
        { threshold: 0.2 }
      );
      heroObserver.observe(heroVisual);
    }
  }

  var progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    var ticking = false;
    var updateProgress = function () {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateProgress();
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements["name"].value.trim();
      var business = form.elements["business"].value.trim();
      var service = form.elements["service"].value;
      var message = form.elements["message"].value.trim();
      var email = form.elements["email"].value.trim();

      var isEn = currentLang === "en";
      var subjectLabel = isEn ? dict["mail.subject"] : "Intake aanvraag";
      var labels = isEn
        ? { name: dict["mail.name"], business: dict["mail.business"], email: dict["mail.email"], interest: dict["mail.interest"] }
        : { name: "Naam", business: "Bedrijf", email: "E-mail", interest: "Interesse" };

      var subject = subjectLabel + ": " + (business || name);
      var bodyLines = [
        labels.name + ": " + name,
        labels.business + ": " + business,
        labels.email + ": " + email,
        labels.interest + ": " + service,
        "",
        message
      ];

      var mailto =
        "mailto:info.klarodesigns@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;
    });
  }
})();
