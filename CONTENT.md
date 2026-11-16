# Updating Content

## Archive

Create a new folder under `archive/` with an `index.md` file. For the clean `/archive/post-name/` URL used by this site, also copy an existing archive post’s `index.html` into the new folder and update its `data-post-slug` value.

```text
archive/my-new-post/
├── index.html
└── index.md
```

Use this front matter at the top:

```md
---
title: My Learning Note
published: 2026-07-16
description: Short summary shown on the archive page.
tags: [Unity, ROS 2]
category: Learning Log
draft: false
---
```

Images can live inside the same folder, usually under `images/`, and can be referenced from Markdown:

```md
![Alt text](./images/example.png)
```

In the copied `index.html`, use the new folder name in the article element:

```html
<article data-post-page data-post-slug="my-new-post" data-post-markdown="./index.md">
```

## Projects

Create a new folder under `projects/` with an `index.md` file:

```text
projects/my-new-project/index.md
```

Use this front matter:

```md
---
title: My New Project
category: XR / Robotics
description: One-sentence project summary.
outcome: Main result or impact.
tags: [Unity, ROS 2]
accent: cyan
order: 4
image: ./project-preview.png
preview: ./preview.webp
imageAlt: A description of the real project image.
primaryTags: [Unity, ROS 2]
github:
demo:
draft: false
---
```

## Rebuild The Content Index

Project cards link to the shared `projects/project.html?slug=folder-name` page. It reads
the selected folder's `index.md` and uses the existing Markdown renderer. Keep the
project title as the first `#` heading; use `# Overview`, `# Implementation`, etc.
for sections (rendered as h2 below the page title). Include contribution or results
sections only when supported by actual evidence.

`preview`, `imageAlt`, and `primaryTags` are optional project fields. A preview is a
smaller derivative of the real original image, never a synthetic screenshot. The
lightbox continues to open `image` at full resolution. Keep 2–4 evidence-supported
primary tags; the original full tag list is retained on the detail page.

For project-only edits, use:

```powershell
python tools\update-content-index.py --projects-only
python tools\update-content-index.py --projects-only --check
```

This preserves archive metadata verbatim. Currently `7Csharp-studying` exists in the
archive index without its source Markdown, so a full rebuild refuses to remove it.
Restore the missing source before attempting a full rebuild. The same guard protects
missing project sources. `--check` validates without writing.

After restoring any missing sources, use a full rebuild for archive changes:

```powershell
python tools\update-content-index.py
```

This regenerates `content-index.js`, which powers the archive list, filters, and project cards. Do not edit the generated file by hand.
