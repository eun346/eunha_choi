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

## Run Locally

Requirements:

- Python 3
- An internet connection for the Three.js CDN and web fonts

Start a local static server from the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4173/
```

Stop the server with `Ctrl+C`.

Opening `index.html` directly is not recommended because archive Markdown is loaded with `fetch()`, which browsers may block on `file://` URLs.

## Update Projects or Archive Notes

Project cards and archive listings are generated from each folder's `index.md` front matter. After adding or editing Markdown, run:

```powershell
python tools\update-content-index.py
```

Then refresh the browser. If an old version remains cached, use `Ctrl+F5`.

Do not edit `content-index.js` manually—it is generated from the Markdown files.

### Change Project Order

Set a unique `order` value in each project file:

```md
order: 1
```

Lower values appear first. Run the content-index command again after changing the order.

For complete front-matter templates and archive page instructions, see [CONTENT.md](./CONTENT.md).

## Testing Checklist

Before publishing, check:

- Home, Work, Archive, and every archive note
- Mobile navigation at narrow screen widths
- Light and dark themes
- 3D scene mouse and touch controls
- Project image lightbox
- Archive search and filters
- Internal, GitHub, LinkedIn, email, and demo links
- Browser console for missing files or JavaScript errors

Recommended viewport checks:

- Desktop: `1440 × 900`
- Tablet: `768 × 1024`
- Mobile: `390 × 844`

## Deployment

This is a static website and can be deployed to GitHub Pages, Netlify, Vercel, or another static host. Run the content-index generator before committing or deploying so `content-index.js` matches the Markdown content.

## Content

Portfolio writing, project information, and original media are © Eunha Choi unless otherwise attributed in the relevant archive note.
