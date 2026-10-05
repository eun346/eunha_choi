# Eunha Choi — Engineering Portfolio

Personal portfolio website for **Eunha Choi**, a Mechanical Engineering student minoring in Computer Science. The site presents projects and learning notes across VR/XR, computer vision, robotics, interactive 3D systems, and hardware–software prototyping.

![Portfolio preview](./og-blue.png)

## Pages

- **Home** — Personal introduction, interactive 3D workspace, interests, tools, and contact links
- **Work** — Selected robotics, WebAR, and computer-vision projects
- **Note** — Learning logs, experiments, setup notes, and small technical builds

## Features

- Gravity-inspired layout with a procedural Three.js field of ten mechanical part types
- Original scatter entrance, pointer repulsion, gravity drop, heart formation, and camera release
- Restrained angular momentum and spherical collision proxies; shared geometry with mobile simplification
- Responsive desktop, tablet, and mobile layouts
- Bright gradients and glass cards with a direct light/dark toggle saved in `localStorage`
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
├── mechanical-parts.js        # Shared part geometry, materials, and angular tuning
├── hero3d.js                  # Scroll progress, pointer input, and light/dark controls
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

Mechanical field tuning lives in `mechanical-parts.js`: `PART_TYPES` controls the mixture,
`ANGULAR` controls damping and impulses, and `FIELD_STYLE` controls scale and text protection.
Desktop uses 96 bodies; mobile uses 54 with simpler gears, bearings, springs, and fewer glass pieces.
