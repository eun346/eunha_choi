import { setupThemeToggle } from './hero3d.js?v=20261004-light-dark';
import { contact, technologies } from "./site-data.js";
import { archiveCategories, archivePosts, archiveTags, projects } from "./content-index.js?v=20261115-projects";

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
      target === "work"
        ? path.includes("/projects")
        : target === "notes"
          ? path.includes("/archive")
          : target === "home" && document.body.classList.contains("home-page");
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setupHeaderScrollState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let ticking = false;
  function sync() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    ticking = false;
  }
  sync();
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    },
    { passive: true },
  );
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

function setupHeroIntro() {
  document.querySelectorAll('[data-pop]').forEach(item => {
    item.style.setProperty('--pop', item.dataset.pop);
    item.classList.add('is-visible');
  });
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
    element.classList.add("reveal", "reveal-pending");
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

const projectRoot = new URL('./projects/', import.meta.url);
const projectHref = project => new URL(`project.html?slug=${encodeURIComponent(project.slug)}`, projectRoot).href;
const projectAsset = (project, path) => new URL(path, new URL(`${project.slug}/`, projectRoot)).href;

function createProjectVisual(project, eager = false) {
  const visual = document.createElement(project.image ? 'button' : 'div');
  visual.className = `project-visual ${project.accent}`;
  if (project.image) {
    visual.type = 'button';
    visual.classList.add('has-image');
    visual.setAttribute('aria-label', `View full image of ${project.title}`);
    const image = document.createElement('img');
    image.src = projectAsset(project, project.preview || project.image);
    image.alt = project.imageAlt || `${project.title} project poster`;
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    const hint = document.createElement('span');
    hint.className = 'image-zoom-hint';
    hint.textContent = 'View Full Image';
    visual.append(image, hint);
    visual.addEventListener('click', () => openImageLightbox(projectAsset(project, project.image), project.title));
  } else {
    visual.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = project.category.split('/')[0].trim();
    visual.append(label);
  }
  return visual;
}

function appendProjectLinks(container, project) {
  for (const [url, label] of [[project.github, 'View Code'], [project.demo, 'Live Demo']]) {
    if (!url) continue;
    const link = document.createElement('a');
    link.className = 'button ghost';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = `${label} ↗`;
    link.setAttribute('aria-label', `${label} for ${project.title} (opens in a new tab)`);
    container.append(link);
  }
}

function renderProjects() {
  const grid = document.querySelector('[data-project-grid]');
  if (!grid) return;
  grid.replaceChildren(...projects.map((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-showcase-card';
    card.dataset.category = project.category;
    const discipline = document.createElement('div');
    discipline.className = 'project-discipline';
    const number = document.createElement('p');
    number.className = 'project-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = projectHref(project);
    titleLink.textContent = project.title;
    title.append(titleLink);
    const category = document.createElement('p');
    category.className = 'eyebrow';
    category.textContent = project.category;
    discipline.append(number, title, category);
    const content = document.createElement('div');
    content.className = 'project-showcase-content';
    const description = document.createElement('p');
    description.textContent = project.description;
    const tags = document.createElement('div');
    tags.className = 'tag-list';
    tags.setAttribute('aria-label', 'Primary technologies');
    tags.append(...(project.primaryTags || project.tags.slice(0, 4)).map(createTag));
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const detail = document.createElement('a');
    detail.className = 'button primary';
    detail.href = projectHref(project);
    detail.textContent = 'View Project →';
    detail.setAttribute('aria-label', `View project: ${project.title}`);
    actions.append(detail);
    appendProjectLinks(actions, project);
    content.append(description, tags, actions);
    card.append(createProjectVisual(project), discipline, content);
    return card;
  }));
}

async function setupProjectPage() {
  const article = document.querySelector('[data-project-page]');
  if (!article) return;
  const slug = new URLSearchParams(location.search).get('slug');
  const project = projects.find(item => item.slug === slug);
  const title = article.querySelector('[data-project-title]');
  const body = article.querySelector('[data-project-content]');
  if (!project) {
    title.textContent = 'Project not found';
    body.textContent = 'Choose a project from the Work page.';
    article.removeAttribute('aria-busy');
    return;
  }
  document.title = `${project.title} — Eunha Choi`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', project.description);
  title.textContent = project.title;
  article.querySelector('[data-project-category]').textContent = project.category;
  article.querySelector('[data-project-summary]').textContent = project.description;
  article.querySelector('[data-project-tags]').replaceChildren(...(project.primaryTags || project.tags).map(createTag));
  const media = article.querySelector('[data-project-media]');
  if (project.image) {
    const caption = document.createElement('figcaption');
    caption.textContent = project.imageAlt || `${project.title} project poster`;
    media.replaceChildren(createProjectVisual(project, true), caption);
  } else media.remove();
  appendProjectLinks(article.querySelector('[data-project-links]'), project);
  const topics = article.querySelector('[data-project-topics]');
  topics.replaceChildren(...project.tags.map(createTag));
  try {
    const response = await fetch(projectAsset(project, './index.md'));
    if (!response.ok) throw new Error(`Project content returned ${response.status}`);
    const { markdown } = parseFrontMatter(await response.text());
    // The page already owns the h1; existing Markdown rendering maps # sections to h2.
    body.innerHTML = renderMarkdown(markdown.replace(/^\s*# [^\n]+\n/, ''));
    body.querySelectorAll('img[src^="./"], a[href^="./"]').forEach(element => {
      const attribute = element.tagName === 'IMG' ? 'src' : 'href';
      element.setAttribute(attribute, projectAsset(project, element.getAttribute(attribute)));
    });
  } catch {
    body.replaceChildren();
    const message = document.createElement('p');
    message.textContent = 'The project notes could not be loaded. You can still return to Work or use the available project links.';
    message.setAttribute('role', 'status');
    body.append(message);
  } finally {
    article.removeAttribute('aria-busy');
  }
  const position = projects.indexOf(project);
  const next = projects[(position + 1) % projects.length];
  const nextLink = article.querySelector('[data-next-project]');
  nextLink.href = projectHref(next);
  nextLink.textContent = `Next project: ${next.title} →`;
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
      const active = chip.dataset.category === state.category || chip.dataset.tag === state.tag;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
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
setupHeaderScrollState();
setupThemeToggle();
setupMobileNavigation();
setupContactLinks();
renderTechnologies();
renderProjects();
setupProjectPage();
setupArchivePage();
setupArchivePostPage();
setupRevealAnimations();
setupHeroIntro();
