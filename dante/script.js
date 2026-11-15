/* ============================================================
   Dante.<3 — Portfolio behaviour
   ------------------------------------------------------------
   Everything renders from config.js (window.SITE).
   No dependencies, no build step.
   ============================================================ */

(() => {
  "use strict";

  const SITE = window.SITE || {};
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ----------------------------------------------------------
     Helpers
     ---------------------------------------------------------- */
  const get = (path, fallback = "") =>
    path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), SITE) ?? fallback;

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));

  const pad = (n) => String(n).padStart(2, "0");
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  /* ----------------------------------------------------------
     Icons
     ---------------------------------------------------------- */
  const ICONS = {
    server:
      '<rect x="3.5" y="4" width="17" height="7" rx="2"/><rect x="3.5" y="13" width="17" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    bot:
      '<rect x="4" y="7.5" width="16" height="12" rx="4"/><path d="M12 7.5V4.5M8.5 13h.01M15.5 13h.01M9.5 16.5h5"/>',
    terminal:
      '<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="m7.5 10 2.5 2-2.5 2M12.5 14h4"/>',
    shield:
      '<path d="M12 3.5 5 6v6c0 4.2 2.9 7.2 7 8.5 4.1-1.3 7-4.3 7-8.5V6l-7-2.5Z"/><path d="m9 12 2 2 4-4"/>',
    layout:
      '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    sparkles:
      '<path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M18 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9L18 15Z"/>',
    discord:
      '<path d="M8.6 6.4a14 14 0 0 1 6.8 0M7.1 18.5c-1.3-1.9-2.2-4.2-2.4-6.8.9-1.1 2-2 3.2-2.5l.7 1.1a11 11 0 0 1 6.8 0l.7-1.1c1.2.5 2.3 1.4 3.2 2.5-.2 2.6-1.1 4.9-2.4 6.8M9.5 14.6h.01M14.5 14.6h.01"/>',
    mail:
      '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4.5 8 7.5 5 7.5-5"/>',
    github:
      '<path d="M9 19c-4 1.4-4-2.4-6-3m12 5v-3.4c0-1 .1-1.4-.5-2 2.8-.3 4.5-1.4 4.5-5a4 4 0 0 0-1.1-2.8 3.7 3.7 0 0 0-.1-2.8s-.9-.3-2.9 1.1a10 10 0 0 0-5 0C7.9 4.7 7 5 7 5a3.7 3.7 0 0 0-.1 2.8A4 4 0 0 0 5.8 10.6c0 3.6 1.7 4.7 4.5 5-.6.6-.6 1.2-.5 2V21"/>',
    x:
      '<path d="M4.5 4.5l15 15M19.5 4.5l-15 15"/>',
    arrow:
      '<path d="M5 12h14M13 6l6 6-6 6"/>',
    external:
      '<path d="M14 4h6v6M20 4l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'
  };

  const icon = (name, size = 24) =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;

  /* ----------------------------------------------------------
     Availability
     ---------------------------------------------------------- */
  const availability = SITE.identity?.availability || {};
  const isOpen = availability.open !== false;

  const availabilityValue = (path) => {
    if (path === "identity.availability.label") return isOpen ? availability.label : availability.closedLabel;
    if (path === "identity.availability.short") return isOpen ? availability.short : availability.closedLabel;
    return get(path);
  };

  /* ----------------------------------------------------------
     Static text binding
     ---------------------------------------------------------- */
  function bindText() {
    $$("[data-bind]").forEach((el) => {
      const path = el.dataset.bind;

      /* contact heading: render the emphasised phrase with the gradient */
      if (path === "contact.heading") {
        const heading = get("contact.heading");
        const emphasis = get("contact.emphasis");
        if (heading && emphasis && String(heading).includes(emphasis)) {
          el.innerHTML = esc(heading).replace(esc(emphasis), `<span class="grad">${esc(emphasis)}</span>`);
          return;
        }
      }

      const value = availabilityValue(path);
      if (value !== "" && value != null) el.textContent = value;
    });

    const avatar = $("[data-avatar]");
    if (avatar && SITE.identity?.avatar) {
      avatar.src = SITE.identity.avatar;
      avatar.alt = `${SITE.identity.displayName || "Profile"} — Discord avatar`;
    }

    if (!isOpen) document.body.classList.add("is-busy");
    document.body.classList.toggle("is-open", isOpen);
  }

  /* ----------------------------------------------------------
     Email links
     ---------------------------------------------------------- */
  function bindEmail() {
    const email = SITE.identity?.email;
    if (!email) return;
    $$("[data-mail]").forEach((el) => {
      el.href = `mailto:${email}`;
      if (el.dataset.mail === "text") el.textContent = email;
    });
    const emailBtn = $("#emailBtn");
    if (emailBtn) emailBtn.href = `mailto:${email}`;
  }

  /* ----------------------------------------------------------
     Community invite links
     Everything marked [data-invite] opens the server invite
     in a new tab.
     ---------------------------------------------------------- */
  function bindCommunity() {
    const invite = get("community.inviteUrl");
    if (!invite) return;

    $$("[data-invite]").forEach((el) => {
      el.href = invite;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    });
  }

  /* ----------------------------------------------------------
     Hero extras
     ---------------------------------------------------------- */
  function renderHero() {
    const roles = $("[data-roles]");
    if (roles && Array.isArray(SITE.hero?.roles)) {
      roles.innerHTML = SITE.hero.roles
        .map((role) => `<span>${esc(role)}</span>`)
        .join('<i aria-hidden="true"></i>');
    }

    const chips = $("[data-chips]");
    if (chips && Array.isArray(SITE.hero?.chips)) {
      chips.innerHTML = SITE.hero.chips.map((chip) => `<li>${esc(chip)}</li>`).join("");
    }
  }

  /* ----------------------------------------------------------
     Fact lists (hero + about)
     ---------------------------------------------------------- */
  function renderFacts() {
    $$("[data-facts]").forEach((dl) => {
      const facts = get(dl.dataset.facts, []);
      if (!Array.isArray(facts)) return;
      dl.innerHTML = facts
        .map(
          (fact) => `
          <div>
            <dt>${esc(fact.label)}</dt>
            <dd>${esc(fact.value)}</dd>
          </div>`
        )
        .join("");
    });
  }

  /* ----------------------------------------------------------
     About paragraphs
     ---------------------------------------------------------- */
  function renderAbout() {
    $$("[data-list]").forEach((box) => {
      const paragraphs = get(box.dataset.list, []);
      if (!Array.isArray(paragraphs)) return;
      box.innerHTML = paragraphs.map((text) => `<p>${esc(text)}</p>`).join("");
    });
  }

  /* ----------------------------------------------------------
     Skills
     ---------------------------------------------------------- */
  function renderSkills() {
    const wrap = $("[data-skills]");
    const skills = Array.isArray(SITE.skills) ? SITE.skills : [];
    if (!wrap) return;

    wrap.innerHTML = skills
      .map(
        (skill, i) => `
        <article class="skill-card" data-reveal data-spotlight style="--d:${(i % 3) * 80}ms">
          <div class="skill-card__top">
            <span class="skill-card__icon">${icon(skill.icon || "sparkles", 22)}</span>
            <span class="skill-card__idx">${pad(i + 1)}</span>
          </div>
          <h3>${esc(skill.title)}</h3>
          <p>${esc(skill.desc)}</p>
          ${
            Array.isArray(skill.tags) && skill.tags.length
              ? `<ul class="skill-card__tags">${skill.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
              : ""
          }
          <div class="skill-card__meter" style="--lvl:${clamp(Number(skill.level) || 0, 0, 100)}%" role="img" aria-label="Proficiency ${clamp(Number(skill.level) || 0, 0, 100)} percent">
            <i></i>
          </div>
        </article>`
      )
      .join("");
  }

  /* ----------------------------------------------------------
     Services
     ---------------------------------------------------------- */
  function renderServices() {
    const wrap = $("[data-services]");
    const services = Array.isArray(SITE.services) ? SITE.services : [];
    if (!wrap) return;

    wrap.innerHTML = services
      .map(
        (service, i) => `
        <article class="service" data-reveal style="--d:${(i % 3) * 70}ms">
          <span class="service__num" aria-hidden="true">${pad(i + 1)}</span>
          <div>
            <h3>${esc(service.title)}</h3>
            <p>${esc(service.desc)}</p>
            ${
              Array.isArray(service.points) && service.points.length
                ? `<ul class="service__tags">${service.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`
                : ""
            }
          </div>
          <a class="service__cta" href="#contact" aria-label="Ask about ${esc(service.title)}">
            ${icon("arrow", 17)}
          </a>
        </article>`
      )
      .join("");
  }

  /* ----------------------------------------------------------
     Projects + filters
     ---------------------------------------------------------- */
  const HUES = {
    "Discord Bots": 271,
    "Discord Servers": 254,
    "Custom Bot Systems": 288,
    "Security Systems": 236,
    "Server Designs": 305,
    "Personal Projects": 262,
    "Client Projects": 280
  };

  const initials = (text) =>
    String(text || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toLowerCase();

  let activeFilter = "All";

  function projectCard(item, i) {
    const title = esc(item.title);
    const category = esc(item.category);
    const link = item.link ? String(item.link) : "";
    const source = item.source ? String(item.source) : "";
    const image = item.image ? String(item.image) : "";
    const tags = Array.isArray(item.tags) ? item.tags : [];

    const thumb = image
      ? `<img src="${esc(image)}" alt="${title}" loading="lazy" decoding="async" />`
      : `<span class="project__glyph" aria-hidden="true">${esc(initials(item.category))}</span>`;

    const links = [
      link
        ? `<a class="project__link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">View project ${icon("external", 13)}</a>`
        : "",
      source
        ? `<a class="project__link" href="${esc(source)}" target="_blank" rel="noopener noreferrer">Source ${icon("external", 13)}</a>`
        : ""
    ].filter(Boolean);

    return `
      <article class="project" data-cat="${category}" style="--i:${i};--h:${HUES[item.category] ?? 270}">
        <div class="project__thumb">
          ${thumb}
          <span class="project__cat">${category}</span>
          ${item.placeholder ? '<span class="project__flag">Template</span>' : ""}
        </div>
        <div class="project__body">
          <h3>${title}</h3>
          <p>${esc(item.desc)}</p>
          ${tags.length ? `<ul class="project__tags">${tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          <div class="project__links">
            ${links.length ? links.join("") : '<span class="project__soon">Details coming soon</span>'}
          </div>
        </div>
      </article>`;
  }

  function renderProjects() {
    const grid = $("#projects");
    const filterBar = $("#filters");
    const data = SITE.projects || {};
    const items = Array.isArray(data.items) ? data.items : [];
    const categories = Array.isArray(data.categories) ? data.categories : ["All"];

    if (grid) {
      grid.innerHTML = items.map(projectCard).join("");
    }

    if (filterBar) {
      filterBar.innerHTML = categories
        .map(
          (cat) => `
          <button class="filter${cat === "All" ? " is-active" : ""}" type="button"
            data-filter="${esc(cat)}" aria-controls="projects" aria-pressed="${cat === "All"}">${esc(cat)}</button>`
        )
        .join("");

      filterBar.addEventListener("click", (event) => {
        const btn = event.target.closest(".filter");
        if (!btn) return;
        const cat = btn.dataset.filter;
        if (!cat || cat === activeFilter) return;
        activeFilter = cat;

        $$(".filter", filterBar).forEach((b) => {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });

        applyFilter(cat);
      });
    }

    if (grid) {
      grid.addEventListener("click", (event) => {
        const link = event.target.closest("a[href^='#']");
        if (link) event.preventDefault();
      });
    }
  }

  function applyFilter(cat) {
    const grid = $("#projects");
    if (!grid) return;

    const cards = $$(".project", grid);
    let visible = 0;

    cards.forEach((card) => {
      const match = cat === "All" || card.dataset.cat === cat;
      card.classList.toggle("is-hidden", !match);
      card.classList.remove("pop");
      if (match) {
        visible += 1;
        // restart the entrance animation
        void card.offsetWidth;
        card.style.setProperty("--i", String(visible - 1));
        card.classList.add("pop");
      }
    });

    const oldEmpty = $(".projects__empty", grid);
    if (oldEmpty) oldEmpty.remove();

    if (!visible) {
      const empty = document.createElement("div");
      empty.className = "projects__empty";
      empty.textContent =
        cat === "All"
          ? "No projects yet — add your first one in config.js."
          : `Nothing in “${cat}” yet — add a project in this category in config.js.`;
      grid.appendChild(empty);
    }
  }

  /* ----------------------------------------------------------
     Journey timeline
     ---------------------------------------------------------- */
  function renderTimeline() {
    const wrap = $("#timeline");
    const items = Array.isArray(SITE.timeline) ? SITE.timeline : [];
    if (!wrap) return;

    wrap.insertAdjacentHTML(
      "beforeend",
      items
        .map(
          (item, i) => `
          <article class="tl" data-reveal style="--d:${(i % 4) * 70}ms">
            <p class="tl__phase">${esc(item.phase)}</p>
            <h3 class="tl__title">${esc(item.title)}</h3>
            <p class="tl__desc">${esc(item.desc)}</p>
            ${
              Array.isArray(item.tags) && item.tags.length
                ? `<ul class="tl__tags">${item.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
                : ""
            }
          </article>`
        )
        .join("")
    );

    const count = $("#journeyNum");
    if (count) count.textContent = items.length ? "01" : "00";
    const total = $(".journey__count i");
    if (total) total.textContent = `/ ${pad(items.length)}`;
  }

  /* ----------------------------------------------------------
     Socials
     ---------------------------------------------------------- */
  function renderSocials() {
    const list = Array.isArray(SITE.socials) ? SITE.socials : [];

    $$("[data-socials]").forEach((wrap) => {
      const compact = wrap.dataset.socials === "compact";

      wrap.innerHTML = list
        .filter((item) => item && (item.copy || item.url || item.handle))
        .map((item) => {
          const cls = `social${compact ? " social--compact" : ""}`;
          const label = esc(item.label);
          const inner = `${icon(item.icon || "sparkles", compact ? 14 : 15)}<span>${label}</span>`;

          if (item.copy) {
            return `<button class="${cls}" type="button" data-copy="identity.handle" aria-label="Copy Discord username">${inner}</button>`;
          }

          const url = String(item.url || "#");
          const external = /^https?:/i.test(url);
          return `<a class="${cls}" href="${esc(url)}"${
            external ? ' target="_blank" rel="noopener noreferrer"' : ""
          }>${inner}</a>`;
        })
        .join("");
    });
  }

  /* ----------------------------------------------------------
     Clipboard + toast
     ---------------------------------------------------------- */
  let toastTimer = 0;

  function toast(message, isError = false) {
    const box = $("#toast");
    const text = $("#toastText");
    if (!box || !text) return;

    text.textContent = message;
    box.classList.toggle("is-error", isError);
    box.classList.add("is-on");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => box.classList.remove("is-on"), 2600);
  }

  function legacyCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    if (!ok) throw new Error("copy failed");
  }

  async function copyText(text, successMessage) {
    const value = String(text ?? "").trim();
    if (!value) {
      toast("Nothing to copy — add it in config.js", true);
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        legacyCopy(value);
      }
      toast(successMessage || `Copied — ${value}`);
    } catch (error) {
      try {
        legacyCopy(value);
        toast(successMessage || `Copied — ${value}`);
      } catch (fallbackError) {
        toast("Copy failed — please select and copy manually", true);
      }
    }
  }

  function bindCopy() {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-copy]");
      if (!trigger) return;
      const path = trigger.dataset.copy;
      const value = get(path);
      const label = path.endsWith("email") ? "Email copied" : `Discord username copied — @${value}`;
      copyText(value, label);
    });

    const copyBtn = $("#copyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const handle = SITE.identity?.handle || "";
        copyText(handle, `Discord username copied — @${handle}`);
      });
    }

    const discordBtn = $("#discordBtn");
    if (discordBtn) {
      discordBtn.addEventListener("click", () => {
        const url = String(SITE.identity?.discordUrl || "").trim();
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
          return;
        }
        const handle = SITE.identity?.handle || "";
        copyText(handle, `Discord username copied — open Discord and add @${handle}`);
      });
    }
  }

  /* ----------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------- */
  function initMenu() {
    const toggle = $("#navToggle");
    const menu = $("#mobileNav");
    if (!toggle || !menu) return;

    const setMenu = (open) => {
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", (event) => {
      const open = !document.body.classList.contains("menu-open");
      setMenu(open);
      // keyboard activation: move focus into the overlay
      if (open && event.detail === 0) {
        window.setTimeout(() => $("a", menu)?.focus({ preventScroll: true }), 220);
      }
    });

    $$("a", menu).forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1020 && document.body.classList.contains("menu-open")) {
        setMenu(false);
      }
    });
  }

  /* ----------------------------------------------------------
     Smooth anchor scrolling
     ---------------------------------------------------------- */
  function initAnchors() {
    const header = $("#hdr");

    document.addEventListener("click", (event) => {
      const anchor = event.target.closest("a[href^='#']");
      if (!anchor) return;
      // let the skip link move focus to <main> natively
      if (anchor.classList.contains("skip")) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#" || hash.length < 2) return;

      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();

      if (document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        document.body.style.overflow = "";
        const toggle = $("#navToggle");
        const menu = $("#mobileNav");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
        }
        if (menu) menu.setAttribute("aria-hidden", "true");
      }

      const offset = (header ? header.getBoundingClientRect().height : 76) + 14;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(top, 0), behavior: REDUCE ? "auto" : "smooth" });

      if (history.replaceState) history.replaceState(null, "", hash);
    });
  }

  /* ----------------------------------------------------------
     Scroll: header, progress, spy, timeline, back to top
     ---------------------------------------------------------- */
  function initScroll() {
    const header = $("#hdr");
    const bar = $("#progressBar");
    const toTop = $("#toTop");
    const navLinks = $$(".nav__link");
    const sections = ["home", "about", "skills", "services", "work", "journey", "community", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const timeline = $("#timeline");
    const fill = $("#timelineFill");
    const journeyNum = $("#journeyNum");
    const journeyBar = $("#journeyBar");
    const tlItems = $$(".tl");

    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      if (header) header.classList.toggle("is-scrolled", y > 12);

      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.width = `${max > 0 ? clamp((y / max) * 100, 0, 100) : 0}%`;
      }

      if (toTop) toTop.classList.toggle("is-on", y > 640);

      /* scrollspy */
      let current = sections[0]?.id || "home";
      const line = y + (header ? header.getBoundingClientRect().height : 76) + vh * 0.22;
      sections.forEach((section) => {
        if (section.offsetTop <= line) current = section.id;
      });

      navLinks.forEach((link) => {
        const on = link.getAttribute("href") === `#${current}`;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });

      /* timeline progress */
      if (timeline && tlItems.length) {
        const rect = timeline.getBoundingClientRect();
        const line = vh * 0.34;
        const p = clamp((line - rect.top) / rect.height, 0, 1);
        if (fill) fill.style.height = `${p * 100}%`;

        let active = 0;
        tlItems.forEach((item, index) => {
          const r = item.getBoundingClientRect();
          if (r.top < line) active = index;
        });

        if (p <= 0) active = 0;
        tlItems.forEach((item, index) => item.classList.toggle("is-active", index <= active));
        if (journeyNum) journeyNum.textContent = pad(active + 1);
        if (journeyBar) journeyBar.style.width = `${((active + 1) / tlItems.length) * 100}%`;
      }

      ticking = false;
    };

    const request = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  }

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */
  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (REDUCE || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------
     Card spotlight + profile tilt
     ---------------------------------------------------------- */
  function initPointerEffects() {
    if (!FINE_POINTER || REDUCE) return;

    const spotTargets = $$("[data-spotlight], .project, .skill-card, .service");
    spotTargets.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    });

    const profile = $("[data-tilt]");
    if (!profile) return;

    const max = 7;
    let frame = 0;

    profile.addEventListener("pointermove", (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const rect = profile.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        profile.style.transform = `perspective(1000px) rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg)`;
        frame = 0;
      });
    });

    profile.addEventListener("pointerleave", () => {
      profile.style.transform = "";
    });
  }

  /* ----------------------------------------------------------
     Clock + year + back to top
     ---------------------------------------------------------- */
  function initUtilities() {
    const clock = $("#clock");
    const year = $("#year");

    if (year) year.textContent = String(new Date().getFullYear());

    if (clock) {
      const format = () => {
        try {
          clock.textContent = new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }).format(new Date());
        } catch (error) {
          const now = new Date();
          clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        }
      };
      format();
      window.setInterval(format, 30000);
    }

    const toTop = $("#toTop");
    if (toTop) {
      toTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: REDUCE ? "auto" : "smooth" });
      });
    }
  }

  /* ----------------------------------------------------------
     Contact form
     Validates in the browser, then posts to the same-origin
     endpoint (server.mjs) which performs its own validation and
     delivers the message through Resend. Success is only shown
     after the server confirms the provider accepted it.
     ---------------------------------------------------------- */
  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const status = $("#formStatus");
    const submit = $("#contactSubmit");
    const submitLabel = submit ? $("[data-submit-label]", submit) : null;
    const startedField = $("#cfStartedAt");
    const endpoint = get("contact.formEndpoint", "/api/contact");
    const successMessage = get(
      "contact.successMessage",
      "Thank you! Your message has been sent successfully. I'll get back to you soon."
    );
    const errorMessage = get(
      "contact.errorMessage",
      "Something went wrong while sending your message. Please try again later."
    );

    const fields = {
      name: { input: $("#cfName"), error: $("#cfNameError") },
      email: { input: $("#cfEmail"), error: $("#cfEmailError") },
      subject: { input: $("#cfSubject"), error: $("#cfSubjectError") },
      message: { input: $("#cfMessage"), error: $("#cfMessageError") }
    };

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    let sending = false;
    let submittedOnce = false;

    const setStartedAt = () => {
      if (startedField) startedField.value = String(Date.now());
    };

    const setFieldError = (key, message) => {
      const field = fields[key];
      if (!field?.input) return;
      const wrap = field.input.closest(".field");
      field.input.setAttribute("aria-invalid", message ? "true" : "false");
      if (wrap) wrap.classList.toggle("is-invalid", Boolean(message));
      if (field.error) field.error.textContent = message || "";
    };

    const clearErrors = () => {
      Object.keys(fields).forEach((key) => setFieldError(key, ""));
      if (form) form.removeAttribute("data-field-error");
    };

    const showStatus = (message, kind) => {
      if (!status) return;
      status.hidden = false;
      status.classList.remove("is-success", "is-error");
      status.classList.add(kind === "success" ? "is-success" : "is-error");
      status.textContent = message;
    };

    const clearStatus = () => {
      if (!status) return;
      status.hidden = true;
      status.classList.remove("is-success", "is-error");
      status.textContent = "";
    };

    const setLoading = (loading) => {
      sending = loading;
      form.setAttribute("aria-busy", loading ? "true" : "false");
      if (submit) {
        submit.disabled = loading;
        submit.classList.toggle("is-loading", loading);
      }
      if (submitLabel) submitLabel.textContent = loading ? "Sending…" : "Send Message";
    };

    const validate = () => {
      const values = {
        name: fields.name.input ? fields.name.input.value.trim() : "",
        email: fields.email.input ? fields.email.input.value.trim() : "",
        subject: fields.subject.input ? fields.subject.input.value.trim() : "",
        message: fields.message.input ? fields.message.input.value : ""
      };
      const errors = {};

      if (values.name.length < 2) errors.name = "Please enter your full name.";
      if (!values.email) errors.email = "Please enter your email address.";
      else if (!EMAIL_RE.test(values.email)) errors.email = "Please enter a valid email address.";
      if (values.subject.length < 3) errors.subject = "Please add a short subject.";
      if (values.message.trim().length < 10) {
        errors.message = "Please write a message of at least 10 characters.";
      }

      return { values, errors };
    };

    const focusFirstError = (errors) => {
      const order = ["name", "email", "subject", "message"];
      const key = order.find((name) => errors[name]);
      if (key && fields[key].input) fields[key].input.focus();
    };

    Object.entries(fields).forEach(([key, field]) => {
      if (!field.input) return;
      const handler = () => {
        if (field.error?.textContent) {
          const { errors } = validate();
          if (!errors[key]) setFieldError(key, "");
        }
        if (!sending && status?.classList.contains("is-success")) clearStatus();
      };
      field.input.addEventListener("input", handler);
      field.input.addEventListener("blur", () => {
        if (!submittedOnce && !field.input.value.trim()) return;
        const { errors } = validate();
        setFieldError(key, errors[key] || "");
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending) return;

      submittedOnce = true;
      clearStatus();

      const { errors } = validate();
      Object.keys(fields).forEach((key) => setFieldError(key, errors[key] || ""));

      if (Object.keys(errors).length) {
        focusFirstError(errors);
        showStatus("Please fix the highlighted fields and try again.", "error");
        return;
      }

      if (!startedField?.value) setStartedAt();
      setLoading(true);

      const payload = {
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        subject: fields.subject.input.value.trim(),
        message: fields.message.input.value.trim(),
        website: $("#cfWebsite")?.value || "",
        startedAt: Number(startedField?.value) || Date.now()
      };

      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        let data = {};
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (response.ok && data.ok) {
          form.reset();
          clearErrors();
          setStartedAt();
          showStatus(successMessage, "success");
          toast("Message sent", false);
          return;
        }

        if (data.fields && typeof data.fields === "object") {
          Object.keys(fields).forEach((key) => {
            if (data.fields[key]) setFieldError(key, data.fields[key]);
          });
          focusFirstError(data.fields);
        }

        if (response.status === 503) {
          console.warn(
            "[contact] Email delivery is not configured on the server. Set RESEND_API_KEY and CONTACT_FROM_EMAIL in .env."
          );
        } else if (response.status === 429) {
          showStatus("Too many messages from this connection. Please try again a little later.", "error");
          return;
        } else if (response.status === 400 && data.fields) {
          showStatus(data.fields.form || "Please check the form and try again.", "error");
          return;
        }

        showStatus(errorMessage, "error");
      } catch (error) {
        console.warn("[contact] Submission failed:", error?.name === "AbortError" ? "timeout" : error?.message);
        showStatus(errorMessage, "error");
      } finally {
        window.clearTimeout(timer);
        setLoading(false);
      }
    });

    setStartedAt();
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  function init() {
    renderHero();
    renderAbout();
    renderFacts();
    renderSkills();
    renderServices();
    renderProjects();
    renderTimeline();
    renderSocials();

    bindText();
    bindEmail();
    bindCommunity();
    bindCopy();

    initMenu();
    initAnchors();
    initScroll();
    initUtilities();
    initReveal();
    initPointerEffects();
    initContactForm();

    applyFilter(activeFilter);
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
