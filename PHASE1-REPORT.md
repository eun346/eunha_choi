# Engineering Portfolio — Phase 1

Implemented November 15, 2026. Local implementation only; no commit, push, or deployment.

## Summary

Improved layout, reading sizes, card alignment, touch targets, and contact action hierarchy while retaining the existing pastel surfaces, font families, navigation, content, and mechanical field. No production JavaScript was changed.

## Files changed

- `index.html`: changed only “What I work with.” to “Technical Skills”.
- `styles.css`: targeted changes to existing rules plus static reading surfaces and responsive containment rules.
- `PHASE1-REPORT.md`: this implementation and verification report.

The pre-existing untracked `gravity/` directory was not changed. Temporary browser audit code was removed from the repository after verification.

## Repository inspection

- Static HTML and ES modules; no React, package manifest, or frontend build step.
- Home sections: Hero, About, Experience, Tools & Skills, Contact. Work and Note remain separate pages; notes use shared Markdown rendering in `site.js`.
- `styles.css` supplies shared layout, surfaces, light/dark modes, and existing CSS animations. Existing breakpoints include 1600, 1100, 900, 767, and 380 pixels; these were retained.
- `hero3d.js` controls shared scrolling, pointer state, and theme switching. `main.js` renders the fixed Three.js canvas; `mechanical-parts.js` supplies procedural geometry and materials. Reveal animations remain in `site.js`.
- Existing external dependencies are Google Fonts and the Three.js 0.160.0 CDN import. No dependency was added.
- Relative links, module paths, Markdown/image paths, and GitHub Pages subdirectory compatibility were inspected. Existing URLs were preserved.

## Section-by-section changes

| Section | Changes |
| --- | --- |
| Hero | More comfortable heading line height, responsive support columns and button wrapping, larger mobile body text and focus metadata. Added a soft static backing behind copy, using the existing surface colors, to reduce contrast from objects behind text. Name, headline, introduction, and actions remain unchanged. |
| About | Explicit shrink-safe grid columns and bounded gaps; a single-column reading order on mobile and smaller tablets. Existing glass copy surface is more readable; heading backing fades at the edges rather than introducing a bordered card. Reduced mobile section padding and unnecessary viewport-height whitespace. |
| Experience | Dates/status can wrap safely, institution placement adapts to card width, and role/date text is larger. Cards and introductory copy have stronger separation from the decorative field. Research text, organization names, dates, tags, and links are unchanged. |
| Technical Skills | Heading is now “Technical Skills”. Grid uses available-width-based columns; narrow phones receive one column, larger screens retain balanced grids. Increased tiny tags to 11px and made padding more consistent. All four categories and every technology entry are unchanged. |
| Contact | Email remains primary. On phones it spans the first row, with GitHub and LinkedIn below. Buttons have at least 48px height, consistent spacing, and a white keyboard-focus outline against the existing dark section. Contact text and destinations are unchanged. |
| Projects | Shrink-safe columns, top alignment, consistent 4:3 preview boxes, and full-image `contain` behavior prevent image dimensions from stretching cards. Existing image zoom/hover behavior is unchanged. Descriptions have a slightly larger reading size. Titles, order, images, descriptions, outcomes, tags, and destinations are unchanged. |
| Notes | Shrink-safe grids, larger mobile input/body/code text, safer long-title wrapping, and locally contained code/table overflow. Filter and text-action targets have a 44px minimum height. No note content or rendering logic was rewritten. |

## Verification

### Passed

- Browser layout audit at **320, 375, 390, 430, 768, 1024, and 1440px** for Home, Work, Note, and the ROS 2/Unity TCP note: 28 page/width combinations, using the existing reduced-motion mode to stabilize measurements.
- Home audited at the same seven widths with normal animations enabled.
- No page-level horizontal overflow, offscreen headings/buttons/tags, or intersecting primary content groups detected in those audits. Checks included Hero rows, Experience headers, Contact actions, and header controls.
- Screenshots visually reviewed for mobile Hero, About, Experience, Skills, Contact, project card, and dark Experience, plus desktop About and tablet Hero.
- Direct Home → Contact navigation and Work/Note navigation worked. Mobile navigation opened and closed with Escape.
- Light/dark switching worked. Keyboard Tab moved from the Contact primary action to GitHub with a visible 2px white outline.
- Project image lightbox opened with a loaded image and closed with Escape.
- Note search for “ROS” returned the two expected ROS notes.
- Six existing JavaScript modules parsed successfully. No JavaScript runtime exceptions were observed.
- Static local HTML `href`/`src` targets resolve. No production asset URLs were modified.
- `git diff --check` passed.
- Direct comparison against HEAD confirmed all production JavaScript, content data, geometry, and physics files are unchanged. Existing CSS animation, transition, transform, filter, and backdrop-filter declarations match the original.
- Home HTML differs only in the requested Skills heading.
- The existing content generator's read functions parsed four project Markdown files and six note Markdown files without writing output. There is no framework build command. The index was deliberately not regenerated, as doing so would remove the existing C# metadata entry whose source Markdown is absent.

### Existing failures and limits

- **C# Foundations for Unity:** the wrapper and metadata exist, but its Markdown body does not. Its current loader requests `archive/7Csharp-studying/7Csharp-studying/index.md`, resulting in a 404. The displayed title alone is not evidence of successful body loading. No body was fabricated or placeholder added.
- **ROS 2 Foundations:** four existing externally hosted GIFs from `docs.ros.org/en/foxy/_images/` failed to load in this test environment. Their origin availability was not diagnosed; the original URLs and note content were left intact.
- The other six note bodies loaded, with no broken local images detected. The C# 404 is the known browser network-console failure; this is not an all-clean network test result.
- Browser testing was local Chromium-based testing, not a deployed GitHub Pages test or a Safari/Firefox/physical-device certification. The live website could not be retrieved through the web tool.
- DOM bounds and selected screenshots do not prove that every moving object is separated from text at every instant. This phase uses static CSS reading surfaces, not changes to the renderer.

## Preservation check

| Item | Result / exception |
| --- | --- |
| Color palette | Preserved. Reading surfaces reuse existing white and dark-panel RGB colors with adjusted opacity; no new color family. |
| Typography | Existing font families, wording, and visual hierarchy retained. Font sizes, wrapping, and heading line height were intentionally adjusted for readability. |
| 3D assets | Unchanged. No geometry, material, object count, or camera changes. |
| Animation behavior | No animation, physics, reveal, timing, or scrolling code changed; no CSS motion declarations changed. Mobile layout height changes naturally alter absolute section scroll offsets, which the existing section-based animation system already measures. Static reading surfaces reduce object visibility behind copy without changing object motion. |
| Project/experience/note content | Unchanged. Only the explicitly authorized Technical Skills heading changed. |
| Navigation and contact links | Unchanged; representative internal navigation and contact keyboard interaction verified. External destinations were preserved, not exhaustively tested for remote availability. |

## Deferred to Phase 2

1. Review the fixed-canvas choreography on mobile. Completely separating the moving field into its own visual region would require changes to its viewport/camera or motion coordination; it was not attempted under Phase 1's animation freeze.
2. Review animation performance and accessibility across physical devices separately. No performance optimizations or timing changes were introduced here.
3. Resolve the missing C# note source and its wrapper path when the intended existing content is available. Repair or locally preserve the four ROS diagrams after verifying their authoritative sources.
4. Improve project technical storytelling, responsibilities, and results using supplied evidence in the later content phase. No achievements, metrics, or proficiency levels were invented.
