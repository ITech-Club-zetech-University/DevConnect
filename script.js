/*
  DevConnect interactions
  - Mobile menu toggle
  - Smooth scrolling for internal links
  - Theme toggle (session-persisted)
  - Welcome message on main CTA click
*/

(function () {
  document.body.classList.add("js-enabled");

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("primary-menu");
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const themeToggles = [
    { button: document.getElementById("theme-toggle"), text: document.getElementById("theme-toggle-text") },
    { button: document.getElementById("theme-toggle-nav"), text: document.getElementById("theme-toggle-nav-text") }
  ].filter((entry) => entry.button && entry.text);
  const root = document.documentElement;
  const mainCta = document.getElementById("main-cta");
  const welcomeMessage = document.getElementById("welcome-message");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Mobile navigation ----------
  if (navToggle && navMenu) {
    // Start collapsed only when JavaScript is active.
    navMenu.dataset.open = "false";

    const setNavState = (isOpen) => {
      navMenu.dataset.open = String(isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    };

    setNavState(false);

    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.dataset.open === "true";
      setNavState(!isOpen);
    });

    // Close mobile menu after selecting a menu item.
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 768) {
          setNavState(false);
        }
      });
    });

    // Allow Escape key to close menu for keyboard users.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.dataset.open === "true") {
        setNavState(false);
        navToggle.focus();
      }
    });
  }

  // ---------- Smooth scrolling ----------
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      // Keep URL fragment updated for accessibility and sharing.
      history.replaceState(null, "", href);
    });
  });

  // ---------- Theme handling ----------
  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    root.setAttribute("data-theme", isDark ? "dark" : "light");

    themeToggles.forEach(({ button, text }) => {
      text.textContent = isDark ? "Light mode" : "Dark mode";
      button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    });
  };

  const savedTheme = localStorage.getItem("devconnect-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }

  themeToggles.forEach(({ button }) => {
    button.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem("devconnect-theme", nextTheme);
    });
  });

  // ---------- Interactive CTA message ----------
  if (mainCta && welcomeMessage) {
    mainCta.addEventListener("click", () => {
      welcomeMessage.textContent = "Welcome! You are now exploring DevConnect demo events for the workshop.";
    });
  }
})();
