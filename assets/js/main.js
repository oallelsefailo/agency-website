(function () {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("vysible-theme", theme);
    if (!themeToggle) return;
    const isLight = theme === "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    const text = themeToggle.querySelector(".theme-toggle__text");
    if (text) text.textContent = isLight ? "Dark" : "Light";
  }

  const savedTheme = localStorage.getItem("vysible-theme");
  setTheme(savedTheme || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(root.dataset.theme === "light" ? "dark" : "light");
    });
  }

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function syncHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );
    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 60}ms`);
      observer.observe(item);
    });
  }

  document.querySelectorAll("[data-faq]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      if (item) item.classList.toggle("is-open", !isOpen);
    });
  });
})();
