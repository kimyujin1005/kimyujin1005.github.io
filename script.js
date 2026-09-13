(() => {
  "use strict";

  const select = (selector, root = document) => root.querySelector(selector);
  const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)];

  const listenForMediaChange = (mediaQuery, callback) => {
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", callback);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(callback);
    }
  };

  function setupTheme() {
    const toggle = select("[data-theme-toggle]");
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    const update = (theme) => {
      document.documentElement.dataset.theme = theme;
      select('meta[name="theme-color"]')?.setAttribute(
        "content",
        theme === "dark" ? "#0a0d0f" : "#f4f6f1",
      );
      if (toggle) {
        const nextTheme = theme === "dark" ? "light" : "dark";
        toggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
        toggle.setAttribute("title", `Switch to ${nextTheme} theme`);
      }
    };

    update(document.documentElement.dataset.theme || (systemPreference.matches ? "dark" : "light"));

    toggle?.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      update(nextTheme);
      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch {
        // The theme still works for this visit when storage is unavailable.
      }
    });

    listenForMediaChange(systemPreference, (event) => {
      try {
        if (localStorage.getItem("portfolio-theme")) return;
      } catch {
        // Fall through to the current system preference.
      }
      update(event.matches ? "dark" : "light");
    });
  }

  function setupMobileMenu() {
    const toggle = select("[data-menu-toggle]");
    const menu = select("[data-mobile-menu]");
    if (!toggle || !menu) return;

    const close = ({ restoreFocus = false } = {}) => {
      const wasOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      menu.hidden = true;
      document.body.classList.remove("menu-open");
      if (wasOpen && restoreFocus) toggle.focus();
    };

    const open = () => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      menu.hidden = false;
      document.body.classList.add("menu-open");
      select("a", menu)?.focus();
    };

    toggle.addEventListener("click", () => {
      toggle.getAttribute("aria-expanded") === "true" ? close() : open();
    });
    selectAll("a", menu).forEach((link) => link.addEventListener("click", () => close()));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close({ restoreFocus: true });
    });
    listenForMediaChange(window.matchMedia("(min-width: 981px)"), (event) => {
      if (event.matches) close();
    });
  }

  setupTheme();
  setupMobileMenu();
})();
