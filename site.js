import { contact, technologies } from "./site-data.js";
import { archiveCategories, archivePosts, archiveTags, projects } from "./content-index.js";

const THEME_STORAGE_KEY = "eunha-portfolio-theme";

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", theme === "light" ? "#f4f8fc" : "#030711");
}

applyTheme(readSavedTheme());

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

function createTag(tag) {
  const element = document.createElement("span");
  element.className = "tag";
  element.textContent = tag;
  return element;
}

function setActiveNavigation() {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const target = link.dataset.nav;
    const active =
      target === "home"
        ? path === "/" || path.endsWith("/eunha_choi/")
        : target === "work"
          ? path.includes("/projects")
          : target === "archive"
            ? path.includes("/archive")
            : false;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setupMobileNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    nav.classList.toggle("is-open", !open);
  });

  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  });
}

function setupThemeToggle() {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector("[data-site-nav]");
  const menu = document.querySelector("[data-menu-toggle]");
  if (!header || !nav || !menu || header.querySelector("[data-theme-toggle]")) return;

  const controls = document.createElement("div");
  controls.className = "header-controls";
  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.type = "button";
  button.dataset.themeToggle = "";
  button.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true"></span><span data-theme-label></span>';

  function syncButton() {
    const current = document.documentElement.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${next} mode`);
    button.setAttribute("aria-pressed", String(current === "light"));
    button.querySelector("[data-theme-label]").textContent = `${next[0].toUpperCase()}${next.slice(1)} mode`;
  }

  nav.replaceWith(controls);
  controls.append(nav, button, menu);
  syncButton();

  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The selected theme still applies for the current page when storage is unavailable.
    }
    syncButton();
  });
}

function setupCursorFollower() {
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "cursor-follower";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentX = -40;
  let currentY = -40;
  let targetX = -40;
  let targetY = -40;
  let animationFrame = 0;

  function drawCursor() {
    const easing = reducedMotion ? 1 : 0.22;
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      animationFrame = requestAnimationFrame(drawCursor);
    } else {
      animationFrame = 0;
    }
  }

  function scheduleCursor() {
    if (!animationFrame) animationFrame = requestAnimationFrame(drawCursor);
  }

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add("is-visible");
    const interactive = event.target instanceof Element
      ? event.target.closest("a, button, input, textarea, select, [role='button'], #hero-model")
      : null;
    cursor.classList.toggle("is-interactive", Boolean(interactive));
    scheduleCursor();
  }, { passive: true });

  window.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
  window.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
  document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  window.addEventListener("blur", () => cursor.classList.remove("is-visible"));
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(".reveal, .tech-card, .project-showcase-card, .archive-preview-card");
  if (!elements.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
  elements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

function setupContactLinks() {
  document.querySelectorAll("[data-contact-email]").forEach((item) => {
    item.setAttribute("href", `mailto:${contact.email}`);
  });
  document.querySelectorAll("[data-contact-github]").forEach((item) => {
    item.setAttribute("href", contact.github);
  });
  document.querySelectorAll("[data-contact-linkedin]").forEach((item) => {
    item.setAttribute("href", contact.linkedin);
  });
}

function renderTechnologies() {
  const container = document.querySelector("[data-tech-grid]");

  if (!container) {
    return;
  }

  container.replaceChildren(
    ...technologies.map((group, index) => {
      const card = document.createElement("article");
      card.className = "tech-card";
      const number = document.createElement("span");
      number.className = "tech-card-index";
      number.textContent = String(index + 1).padStart(2, "0");
      const heading = document.createElement("h3");
      heading.textContent = group.category;
      const list = document.createElement("div");
      list.className = "tag-list";
      list.replaceChildren(...group.items.map(createTag));
      card.append(number, heading, list);
      return card;
    }),
  );
}

let imageLightbox;

function getImageLightbox() {
  if (imageLightbox) return imageLightbox;

  const dialog = document.createElement("dialog");
  dialog.className = "image-lightbox";
  dialog.setAttribute("aria-label", "Project image viewer");

  const closeButton = document.createElement("button");
  closeButton.className = "image-lightbox-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close image");
  closeButton.textContent = "Close Image";

  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const caption = document.createElement("figcaption");
  figure.append(image, caption);
  dialog.append(closeButton, figure);
  document.body.append(dialog);

  const closeLightbox = () => {
    if (dialog.open) dialog.close();
  };

  closeButton.addEventListener("click", closeLightbox);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeLightbox();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
  });

  imageLightbox = { dialog, image, caption, closeButton };
  return imageLightbox;
}

function openImageLightbox(source, title) {
  const lightbox = getImageLightbox();
  lightbox.image.src = source;
  lightbox.image.alt = title;
  lightbox.caption.textContent = title;
  document.body.classList.add("lightbox-open");
  lightbox.dialog.showModal();
  lightbox.closeButton.focus();
}

function renderProjects() {
  const grid = document.querySelector("[data-project-grid]");

  if (!grid) {
    return;
  }

  grid.replaceChildren(
    ...projects.map((project, index) => {
      const card = document.createElement("article");
      card.className = "project-showcase-card";
      card.dataset.category = project.category;

      const visual = document.createElement(project.image ? "button" : "div");
      visual.className = `project-visual ${project.accent}`;
      if (project.image) {
        visual.type = "button";
        visual.setAttribute("aria-label", `View full image of ${project.title}`);
        const image = document.createElement("img");
        image.src = `./${project.slug}/${project.image.replace(/^\.\//, "")}`;
        image.alt = "";
        visual.classList.add("has-image");
        const zoomHint = document.createElement("span");
        zoomHint.className = "image-zoom-hint";
        zoomHint.textContent = "View Full Image";
        visual.append(image, zoomHint);
        visual.addEventListener("click", () => openImageLightbox(image.src, project.title));
      } else {
        visual.setAttribute("aria-hidden", "true");
        visual.innerHTML = `<span>${project.category.split("/")[0].trim()}</span>`;
      }

      const discipline = document.createElement("div");
      discipline.className = "project-discipline";

      const number = document.createElement("p");
      number.className = "project-number";
      number.textContent = `0${index + 1}`;

      const category = document.createElement("p");
      category.className = "eyebrow";
      category.textContent = project.category;

      const title = document.createElement("h2");
      title.textContent = project.title;

      const description = document.createElement("p");
      description.textContent = project.description;

      const outcome = document.createElement("p");
      outcome.className = "project-outcome";
      outcome.textContent = project.outcome;

      const tagList = document.createElement("div");
      tagList.className = "tag-list";
      tagList.replaceChildren(...project.tags.map(createTag));

      const actions = document.createElement("div");
      actions.className = "card-actions";
      if (project.github) {
        const githubLink = document.createElement("a");
        githubLink.className = "button secondary";
        githubLink.href = project.github;
        githubLink.target = "_blank";
        githubLink.rel = "noreferrer";
        githubLink.textContent = "View Code";
        actions.append(githubLink);
      }
      if (project.demo) {
        const demoLink = document.createElement("a");
        demoLink.className = "button primary";
        demoLink.href = project.demo;
        demoLink.target = "_blank";
        demoLink.rel = "noreferrer";
        demoLink.textContent = "Open Project";
        actions.append(demoLink);
      }

      discipline.append(number, title, category);

      const content = document.createElement("div");
      content.className = "project-showcase-content";
      content.append(description, outcome, tagList);
      if (actions.childElementCount > 0) {
        content.append(actions);
      }
      card.append(visual, discipline, content);
      return card;
    }),
  );
}

function renderFilterButtons(container, values, type) {
  container.replaceChildren(
    ...values.map((value) => {
      const button = document.createElement("button");
      button.className = "filter-chip";
      button.type = "button";
      button.dataset[type] = value;
      button.textContent = value;
      return button;
    }),
  );
}

function renderArchiveCards(posts) {
  const list = document.querySelector("[data-archive-list]");
  const empty = document.querySelector("[data-empty-state]");

  if (!list || !empty) {
    return;
  }

  empty.hidden = posts.length > 0;
  list.replaceChildren(
    ...posts.map((post) => {
      const card = document.createElement("article");
      card.className = "archive-preview-card";

      const meta = document.createElement("p");
      meta.className = "archive-meta";
      meta.innerHTML = `<span>${formatDate(post.date)}</span><span>${post.category}</span><span>${post.readingTime}</span>`;

      const title = document.createElement("h2");
      const link = document.createElement("a");
      link.href = `./${encodeURIComponent(post.slug)}/`;
      link.textContent = post.title;
      title.append(link);

      const excerpt = document.createElement("p");
      excerpt.textContent = post.excerpt;

      const tags = document.createElement("div");
      tags.className = "tag-list";
      tags.replaceChildren(...post.tags.map(createTag));

      const body = document.createElement("div");
      body.className = "archive-preview-body";
      body.append(excerpt, tags);

      const action = document.createElement("a");
      action.className = "read-link";
      action.href = `./${encodeURIComponent(post.slug)}/`;
      action.textContent = "Open Note →";

      card.append(meta, title, body, action);
      return card;
    }),
  );
}

function setupArchivePage() {
  const list = document.querySelector("[data-archive-list]");

  if (!list) {
    return;
  }

  const search = document.querySelector("[data-archive-search]");
  const categoryFilters = document.querySelector("[data-category-filters]");
  const tagFilters = document.querySelector("[data-tag-filters]");
  const reset = document.querySelector("[data-reset-filters]");
  const params = new URLSearchParams(window.location.search);
  const state = {
    query: params.get("search") || "",
    category: params.get("category") || "",
    tag: params.get("tag") || "",
  };

  if (categoryFilters) {
    renderFilterButtons(categoryFilters, archiveCategories, "category");
  }
  if (tagFilters) {
    renderFilterButtons(tagFilters, archiveTags, "tag");
  }

  function applyFilters() {
    const query = state.query.trim().toLowerCase();
    const filtered = archivePosts
      .filter((post) => {
        const searchable = [post.title, post.excerpt, post.category, ...post.tags].join(" ").toLowerCase();
        return !query || searchable.includes(query);
      })
      .filter((post) => !state.category || post.category === state.category)
      .filter((post) => !state.tag || post.tags.includes(state.tag))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const count = document.querySelector("[data-archive-count]");
    if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? "note" : "notes"}`;

    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.category === state.category || chip.dataset.tag === state.tag);
    });
    renderArchiveCards(filtered);
  }

  search?.addEventListener("input", (event) => {
    state.query = event.target.value;
    applyFilters();
  });
  categoryFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = state.category === button.dataset.category ? "" : button.dataset.category;
    applyFilters();
  });
  tagFilters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tag]");
    if (!button) return;
    state.tag = state.tag === button.dataset.tag ? "" : button.dataset.tag;
    applyFilters();
  });
  reset?.addEventListener("click", () => {
    state.query = "";
    state.category = "";
    state.tag = "";
    if (search) search.value = "";
    applyFilters();
  });

  if (search) search.value = state.query;
  applyFilters();
}

function renderContentBlock(block) {
  if (block.type === "heading") {
    const heading = document.createElement("h2");
    heading.textContent = block.text;
    return heading;
  }

  if (block.type === "list") {
    const list = document.createElement("ul");
    list.replaceChildren(
      ...block.items.map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      }),
    );
    return list;
  }

  if (block.type === "code") {
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    const label = document.createElement("span");
    label.textContent = block.language;
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = block.code;
    pre.append(code);
    wrapper.append(label, pre);
    return wrapper;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = block.text;
  return paragraph;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(String(value).trim());
}

function sanitizeUrl(value) {
  const url = String(value).trim().replace(/&amp;/g, "&");
  if (/^(https?:|mailto:|\.{0,2}\/|\/|#)/i.test(url)) {
    return url;
  }
  return "#";
}

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const safeHref = escapeAttribute(sanitizeUrl(href));
      const external = /^https?:/i.test(href) ? ' target="_blank" rel="noreferrer"' : "";
      return `<a href="${safeHref}"${external}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function parseFrontMatter(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  if (lines[0] !== "---") {
    return { meta: {}, markdown: source };
  }

  const meta = {};
  let end = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index] === "---") {
      end = index;
      break;
    }
    const match = lines[index].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (value === "false" || value === "true") {
      meta[key] = value === "true";
    } else {
      meta[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  if (end === -1) {
    return { meta: {}, markdown: source };
  }

  return {
    meta: {
      ...meta,
      date: meta.published || meta.date,
      excerpt: meta.description,
    },
    markdown: lines.slice(end + 1).join("\n"),
  };
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderMarkdownTable(lines) {
  const [headerLine, , ...bodyLines] = lines;
  const headers = splitTableRow(headerLine);
  const rows = bodyLines.map(splitTableRow);
  const thead = `<thead><tr>${headers.map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell)}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
  return `<div class="table-scroll"><table>${thead}${tbody}</table></div>`;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  function isSpecialLine(line, nextLine = "") {
    const trimmed = line.trim();
    return (
      trimmed === "---" ||
      trimmed.startsWith("```") ||
      trimmed.startsWith("<iframe") ||
      /^#{1,6}\s+/.test(trimmed) ||
      /^>\s?/.test(trimmed) ||
      /^!\[[^\]]*\]\([^)]+\)$/.test(trimmed) ||
      /^\s*[-*+]\s+/.test(line) ||
      /^\s*\d+[.)]\s+/.test(line) ||
      (trimmed.includes("|") && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(nextLine))
    );
  }

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed === "---") {
      blocks.push("<hr />");
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim() || "text";
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        `<div class="code-block"><span>${escapeHtml(language)}</span><pre><code>${escapeHtml(code.join("\n"))}</code></pre></div>`,
      );
      continue;
    }

    if (trimmed.startsWith("<iframe")) {
      blocks.push(`<div class="media-frame">${trimmed}</div>`);
      index += 1;
      continue;
    }

    if (
      trimmed.includes("|") &&
      lines[index + 1] &&
      /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])
    ) {
      const tableLines = [line, lines[index + 1]];
      index += 2;
      while (index < lines.length && lines[index].trim().includes("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      blocks.push(renderMarkdownTable(tableLines));
      continue;
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      const [, alt, src] = image;
      blocks.push(`<figure><img src="${escapeAttribute(sanitizeUrl(src))}" alt="${escapeAttribute(alt)}" /></figure>`);
      index += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 6);
      blocks.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quotes = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quotes.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote><p>${renderInlineMarkdown(quotes.join(" "))}</p></blockquote>`);
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const start = ordered ? Number(line.match(/^\s*(\d+)/)?.[1] || 1) : 1;
      const items = [];
      const listPattern = ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/;
      while (index < lines.length && listPattern.test(lines[index])) {
        items.push(lines[index].replace(listPattern, "").trim());
        index += 1;
      }
      const tag = ordered ? "ol" : "ul";
      const startAttribute = ordered && start !== 1 ? ` start="${start}"` : "";
      blocks.push(`<${tag}${startAttribute}>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${tag}>`);
      continue;
    }

    const paragraph = [trimmed];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isSpecialLine(lines[index], lines[index + 1])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
  }

  return blocks.join("");
}

async function setupArchivePostPage() {
  const article = document.querySelector("[data-post-page]");

  if (!article) {
    return;
  }

  const slug = article.dataset.postSlug || new URLSearchParams(window.location.search).get("slug");
  const markdownPath = article.dataset.postMarkdown || `./${slug}/index.md`;

  if (!slug) {
    article.innerHTML = "<h1>Archive note not found</h1><p>No archive note was selected.</p>";
    return;
  }

  const postIndex = archivePosts.findIndex((item) => item.slug === slug);
  const post = archivePosts[postIndex];
  let markdownData = null;

  try {
    const response = await fetch(markdownPath);
    if (response.ok) {
      markdownData = parseFrontMatter(await response.text());
    }
  } catch {
    markdownData = null;
  }

  if (!post && !markdownData) {
    article.innerHTML = "<h1>Archive note not found</h1><p>This archive note could not be found.</p>";
    return;
  }

  const currentPost = {
    readingTime: post?.readingTime || "Archive note",
    tags: [],
    ...post,
    ...markdownData?.meta,
  };

  document.title = `${currentPost.title} — Eunha Choi Archive`;
  let descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement("meta");
    descriptionMeta.name = "description";
    document.head.append(descriptionMeta);
  }
  descriptionMeta.content = currentPost.excerpt || "A learning note from Eunha Choi’s portfolio archive.";
  article.querySelector("[data-post-title]").textContent = currentPost.title;
  article.querySelector("[data-post-date]").textContent = formatDate(currentPost.date);
  article.querySelector("[data-post-category]").textContent = currentPost.category;
  article.querySelector("[data-post-reading]").textContent = currentPost.readingTime;
  const tags = article.querySelector("[data-post-tags]");
  tags.replaceChildren(...currentPost.tags.map(createTag));
  const body = article.querySelector("[data-post-content]");
  if (markdownData) {
    body.innerHTML = renderMarkdown(markdownData.markdown);
    if (!article.dataset.postSlug) {
      body.querySelectorAll('img[src^="./"]').forEach((image) => {
        image.setAttribute("src", `./${slug}/${image.getAttribute("src").slice(2)}`);
      });
    }
  } else if (post?.content) {
    body.replaceChildren(...post.content.map(renderContentBlock));
  } else {
    body.innerHTML = "<p>This archive post could not be loaded.</p>";
  }

  const previous = archivePosts[postIndex - 1];
  const next = archivePosts[postIndex + 1];
  const previousLink = article.querySelector("[data-previous-post]");
  const nextLink = article.querySelector("[data-next-post]");
  const postHref = (targetSlug) =>
    article.dataset.postSlug ? `../${targetSlug}/` : `./post.html?slug=${encodeURIComponent(targetSlug)}`;
  if (previous && previousLink) {
    previousLink.href = postHref(previous.slug);
    previousLink.textContent = `Newer note: ${previous.title}`;
  } else {
    previousLink?.remove();
  }
  if (next && nextLink) {
    nextLink.href = postHref(next.slug);
    nextLink.textContent = `Older note: ${next.title}`;
  } else {
    nextLink?.remove();
  }
}

setActiveNavigation();
setupThemeToggle();
setupMobileNavigation();
setupCursorFollower();
setupContactLinks();
renderTechnologies();
renderProjects();
setupArchivePage();
setupArchivePostPage();
setupRevealAnimations();
