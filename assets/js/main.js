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

      var subject = "Intake aanvraag: " + (business || name);
      var bodyLines = [
        "Naam: " + name,
        "Bedrijf: " + business,
        "E-mail: " + email,
        "Interesse: " + service,
        "",
        message
      ];

      var mailto =
        "mailto:hallo@klaro.nl" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;
    });
  }
})();
