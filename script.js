(() => {
  "use strict";

  const data = window.PORTFOLIO_DATA;
  if (!data) {
    document.documentElement.classList.remove("js");
    console.error("Portfolio content could not be loaded from content/profile.js.");
    return;
  }

  const select = (selector, root = document) => root.querySelector(selector);
  const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)];
  const hasItems = (value) => Array.isArray(value) && value.length > 0;
  const escapeHTML = (value = "") =>
    String(value).replace(
      /[&<>'"]/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[character],
    );

  const safeHref = (value = "") => {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };

  const linkAttributes = (href) =>
    /^https?:/i.test(href) ? ' target="_blank" rel="noreferrer"' : "";

  const listenForMediaChange = (mediaQuery, callback) => {
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", callback);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(callback);
    }
  };

  const icons = {
    arrow:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
    external:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M10 14l9-9M19 14v5H5V5h5"></path></svg>',
    github:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9l-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"></path></svg>',
    mail:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 7l8 6 8-6"></path></svg>',
    document:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 2v5h5M9 13h6M9 17h6"></path></svg>',
  };

  const makeButton = ({ label, href, icon = "arrow", secondary = false }) => {
    const safeUrl = safeHref(href);
    if (!label || !safeUrl) return "";
    return `<a class="button${secondary ? " button-secondary" : ""}" href="${escapeHTML(
      safeUrl,
    )}"${linkAttributes(safeUrl)}>${escapeHTML(label)}${icons[icon] || icons.arrow}</a>`;
  };

  const setText = (selector, value) => {
    if (!value) return;
    selectAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  const revealSection = (containerSelector, collection, render) => {
    const container = select(containerSelector);
    if (!container || !hasItems(collection)) return;
    container.innerHTML = collection.map(render).join("");
    container.closest("[data-optional-section]")?.removeAttribute("hidden");
  };

  function populateMetadata() {
    const name = data.name || "Yujin Kim";
    const title = data.meta?.title || `${name} — Developer Portfolio`;
    const description =
      data.meta?.description || `Experience, projects, and selected work by ${name}.`;

    document.documentElement.lang = data.locale || "en";
    document.title = title;
    select('meta[name="description"]')?.setAttribute("content", description);
    select('meta[property="og:title"]')?.setAttribute("content", title);
    select('meta[property="og:description"]')?.setAttribute("content", description);

    const siteUrl = safeHref(data.siteUrl);
    if (siteUrl) select('link[rel="canonical"]')?.setAttribute("href", siteUrl);
  }

  function populateIdentity() {
    const name = data.name || "Yujin Kim";
    const firstName = data.firstName || name.split(/\s+/)[0];
    const initials =
      data.initials ||
      name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    setText("[data-name]", name);
    setText("[data-first-name]", firstName);
    setText("[data-initials]", initials);
    setText("[data-role]", data.role);
    setText("[data-status]", data.status);
    setText("[data-headline]", data.headline);
    setText("[data-intro]", data.intro);
    setText("[data-contact-copy]", data.contactCopy);
    setText("[data-year]", new Date().getFullYear());

    const avatar = select("[data-avatar]");
    const avatarUrl = safeHref(data.avatar);
    if (avatar && avatarUrl) {
      avatar.src = avatarUrl;
      avatar.alt = `${name} profile photo`;
      avatar.addEventListener(
        "load",
        () => select("[data-avatar-shell]")?.classList.add("has-image"),
        { once: true },
      );
      avatar.addEventListener("error", () => avatar.removeAttribute("src"), { once: true });
    }

    const facts = [
      ["Location", data.location],
      ["Status", data.availability],
    ].filter(([, value]) => value);
    const factsContainer = select("[data-profile-facts]");
    if (factsContainer) {
      factsContainer.innerHTML = facts
        .map(
          ([label, value]) =>
            `<div class="profile-fact"><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`,
        )
        .join("");
      factsContainer.hidden = facts.length === 0;
    }

    const focusContainer = select("[data-focus-list]");
    if (focusContainer) {
      focusContainer.innerHTML = (data.focus || [])
        .map((item) => `<span class="tag">${escapeHTML(item)}</span>`)
        .join("");
      focusContainer.hidden = !hasItems(data.focus);
    }

    const aboutContainer = select("[data-about]");
    if (aboutContainer) {
      aboutContainer.innerHTML = (data.about || [])
        .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
        .join("");
    }

    select("[data-draft-card]")?.toggleAttribute("hidden", data.draft === false);
  }

  function populateActions() {
    const emailHref = data.email ? `mailto:${data.email}` : "";
    const socialLinks = (data.socials || [])
      .map((social) => ({ ...social, href: safeHref(social.url) }))
      .filter((social) => social.label && social.href);
    const github = socialLinks.find((social) => social.icon === "github");

    const heroActions = [
      emailHref
        ? makeButton({ label: "Say hello", href: emailHref, icon: "mail" })
        : github
          ? makeButton({ label: "View GitHub", href: github.href, icon: "github" })
          : "",
      data.resume
        ? makeButton({ label: "Download CV", href: data.resume, icon: "document", secondary: true })
        : "",
    ].join("");
    const heroContainer = select("[data-hero-actions]");
    if (heroContainer) heroContainer.innerHTML = heroActions;

    const contactActions = [
      emailHref ? makeButton({ label: "Send an email", href: emailHref, icon: "mail" }) : "",
      ...socialLinks.map((social) =>
        makeButton({
          label: social.label,
          href: social.href,
          icon: social.icon || "external",
          secondary: Boolean(emailHref),
        }),
      ),
    ].join("");
    const contactContainer = select("[data-contact-actions]");
    if (contactContainer) contactContainer.innerHTML = contactActions;

    const allProjects = select("[data-all-projects]");
    if (allProjects && github) {
      allProjects.href = github.href;
      allProjects.target = "_blank";
      allProjects.rel = "noreferrer";
      allProjects.hidden = false;
    }
  }

  function populateCollections() {
    revealSection("[data-experience]", data.experience, (item) => {
      const companyUrl = safeHref(item.companyUrl);
      const company = companyUrl
        ? `<a href="${escapeHTML(companyUrl)}"${linkAttributes(companyUrl)}>${escapeHTML(item.company)}</a>`
        : escapeHTML(item.company);
      const description = item.summary
        ? `<p class="timeline-description">${escapeHTML(item.summary)}</p>`
        : "";
      const highlights = hasItems(item.highlights)
        ? `<ul class="bullet-list">${item.highlights
            .map((highlight) => `<li>${escapeHTML(highlight)}</li>`)
            .join("")}</ul>`
        : "";

      return `<article class="timeline-item">
        <div class="timeline-date">${escapeHTML(item.period)}</div>
        <div class="timeline-content">
          <div class="timeline-heading">
            <h3>${escapeHTML(item.role)}</h3>
            ${item.company ? `<span>· ${company}</span>` : ""}
          </div>
          ${item.location ? `<p class="timeline-location">${escapeHTML(item.location)}</p>` : ""}
          ${description}${highlights}
        </div>
      </article>`;
    });

    revealSection("[data-projects]", data.projects, (item, index) => {
      const sourceUrl = safeHref(item.sourceUrl);
      const liveUrl = safeHref(item.liveUrl);
      const links = [
        sourceUrl
          ? `<a class="project-link" href="${escapeHTML(sourceUrl)}"${linkAttributes(
              sourceUrl,
            )} aria-label="${escapeHTML(item.title)} source code">${icons.github}</a>`
          : "",
        liveUrl
          ? `<a class="project-link" href="${escapeHTML(liveUrl)}"${linkAttributes(
              liveUrl,
            )} aria-label="${escapeHTML(item.title)} live demo">${icons.external}</a>`
          : "",
      ].join("");
      const technologies = hasItems(item.technologies)
        ? `<ul class="project-tech">${item.technologies
            .map((technology) => `<li>${escapeHTML(technology)}</li>`)
            .join("")}</ul>`
        : "";

      return `<article class="project-card">
        <div class="project-card-topline">
          <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
          <div class="project-links">${links}</div>
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.description)}</p>
        ${technologies}
      </article>`;
    });

    revealSection("[data-skills]", data.skills, (group) => {
      const items = (group.items || [])
        .map((item) => `<li class="tag">${escapeHTML(item)}</li>`)
        .join("");
      return `<article class="skill-group"><h3>${escapeHTML(group.category)}</h3><ul>${items}</ul></article>`;
    });

    revealSection("[data-education]", data.education, (item) => {
      const details = [item.institution, item.location].filter(Boolean).join(" · ");
      const detailItems = Array.isArray(item.details)
        ? item.details
        : item.details
          ? [item.details]
          : [];
      const detailList = hasItems(detailItems)
        ? `<ul class="bullet-list">${detailItems
            .map((detail) => `<li>${escapeHTML(detail)}</li>`)
            .join("")}</ul>`
        : "";
      return `<article class="compact-item">
        <div><h3>${escapeHTML(item.degree)}</h3>${details ? `<p>${escapeHTML(details)}</p>` : ""}${detailList}</div>
        <span class="compact-meta">${escapeHTML(item.period)}</span>
      </article>`;
    });

    revealSection("[data-publications]", data.publications, (item) => {
      const publicationUrl = safeHref(item.url);
      const title = publicationUrl
        ? `<a href="${escapeHTML(publicationUrl)}"${linkAttributes(publicationUrl)}>${escapeHTML(
            item.title,
          )}</a>`
        : escapeHTML(item.title);
      return `<li class="publication-item">
        <div><h3>${title}</h3>${item.authors ? `<p>${escapeHTML(item.authors)}</p>` : ""}</div>
        <span class="publication-venue">${escapeHTML(
          [item.venue, item.year].filter(Boolean).join(" · "),
        )}</span>
      </li>`;
    });

    revealSection("[data-honors]", data.honors, (item) => {
      const details = [item.issuer, item.description].filter(Boolean).join(" · ");
      return `<article class="compact-item">
        <div><h3>${escapeHTML(item.title)}</h3>${details ? `<p>${escapeHTML(details)}</p>` : ""}</div>
        <span class="compact-meta">${escapeHTML(item.year)}</span>
      </article>`;
    });
  }

  function setupNavigation() {
    const labels = {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      publications: "Publications",
      honors: "Honors",
      contact: "Contact",
    };
    const sections = selectAll("main > section.section:not([hidden])");

    sections.forEach((section, index) => {
      const label = labels[section.id] || section.id;
      const indexLabel = select(".section-index", section);
      if (indexLabel) indexLabel.textContent = `${String(index + 1).padStart(2, "0")} / ${label}`;
    });

    const links = sections
      .map(
        (section) =>
          `<a class="nav-link" href="#${escapeHTML(section.id)}" data-nav-link="${escapeHTML(
            section.id,
          )}">${escapeHTML(labels[section.id] || section.id)}</a>`,
      )
      .join("");
    const desktopNav = select("[data-nav-desktop]");
    const mobileNav = select("[data-nav-mobile]");
    if (desktopNav) desktopNav.innerHTML = links;
    if (mobileNav) mobileNav.innerHTML = links;

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        selectAll("[data-nav-link]").forEach((link) => {
          const active = link.dataset.navLink === visible.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-28% 0px -55%", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
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
      if (wasOpen && restoreFocus) toggle.focus();
    };
    const open = () => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      menu.hidden = false;
      select("a", menu)?.focus();
    };

    toggle.addEventListener("click", () => {
      toggle.getAttribute("aria-expanded") === "true" ? close() : open();
    });
    selectAll("a", menu).forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close({ restoreFocus: true });
    });
    listenForMediaChange(window.matchMedia("(min-width: 901px)"), (event) => {
      if (event.matches) close();
    });
  }

  function setupTheme() {
    const toggle = select("[data-theme-toggle]");
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    const update = (theme) => {
      document.documentElement.dataset.theme = theme;
      select('meta[name="theme-color"]')?.setAttribute(
        "content",
        theme === "dark" ? "#0b0d10" : "#f4f5f1",
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
        // The selected theme still works for this visit when storage is unavailable.
      }
    });
    listenForMediaChange(systemPreference, (event) => {
      try {
        if (localStorage.getItem("portfolio-theme")) return;
      } catch {
        // Fall through to the system preference.
      }
      update(event.matches ? "dark" : "light");
    });
  }

  function setupRevealAnimations() {
    const elements = selectAll(".reveal:not([hidden])");
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    elements.forEach((element) => observer.observe(element));
  }

  function setupHeader() {
    const header = select("[data-header]");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  populateMetadata();
  populateIdentity();
  populateActions();
  populateCollections();
  setupNavigation();
  setupMobileMenu();
  setupTheme();
  setupHeader();
  document.documentElement.classList.add("js");
  try {
    setupRevealAnimations();
  } catch (error) {
    document.documentElement.classList.remove("js");
    console.error("Reveal animations could not be initialized.", error);
  }
})();
