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
github:
demo:
draft: false
---
```

## Rebuild The Content Index

After adding or editing archive/project Markdown, run:

```powershell
python tools\update-content-index.py
```

This regenerates `content-index.js`, which powers the archive list, filters, and project cards. Do not edit the generated file by hand.
