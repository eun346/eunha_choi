# Eunha Choi — Engineering Portfolio

Personal portfolio website for **Eunha Choi**, a Mechanical Engineering student minoring in Computer Science. The site presents projects and learning notes across VR/XR, computer vision, robotics, interactive 3D systems, and hardware–software prototyping.

![Portfolio preview](./og-blue.png)

## Pages

- **Home** — Personal introduction, interactive 3D workspace, interests, tools, and contact links
- **Work** — Selected robotics, WebAR, and computer-vision projects
- **Archive** — Learning logs, experiments, setup notes, and small technical builds

## Features

- Interactive Three.js engineering workspace with VR equipment
- Responsive desktop, tablet, and mobile layouts
- Black-and-blue visual system with light and dark themes
- Theme preference saved in `localStorage`
- Markdown-based project and archive content
- Project image lightbox
- Archive search, category filters, and topic filters
- Keyboard navigation, focus states, reduced-motion support, and semantic page structure
- No framework build step required

## Technology

- HTML5
- CSS3
- JavaScript ES modules
- Three.js
- Markdown with front matter
- Python content-index generator

## Project Structure

```text
.
├── index.html                 # Home page
├── projects/
│   ├── index.html             # Work page
│   └── */index.md             # Project content
├── archive/
│   ├── index.html             # Archive listing
│   ├── post.html              # Shared archive post template
│   └── */
│       ├── index.html         # Clean URL wrapper
│       ├── index.md           # Archive note
│       └── images/            # Note assets
├── styles.css                 # Shared design and responsive styles
├── site.js                    # Navigation, themes, cards, filters, and Markdown rendering
├── main.js                    # Interactive Three.js scene
├── site-data.js               # Contact information and technology groups
├── content-index.js           # Generated project and archive metadata
├── tools/
│   └── update-content-index.py
└── CONTENT.md                 # Detailed content-authoring guide
```

Recommended viewport checks:

- Desktop: `1440 × 900`
- Tablet: `768 × 1024`
- Mobile: `390 × 844`
