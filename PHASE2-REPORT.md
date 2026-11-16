# Phase 2 — Project presentation and technical storytelling

## Evidence inventory (before implementation)

The repository has four ordered project Markdown sources, two real poster images, generated project metadata in `content-index.js`, and a Work page rendered by `site.js`. There are no project detail HTML pages or local implementation repositories. The Markdown bodies were not previously exposed by project cards. Phase 1 edits to `index.html`, `styles.css`, and `PHASE1-REPORT.md`, and the untracked `gravity/` directory, predate this work.

| Project / original category | Existing description and assets | Evidence classification | Technologies and implementation evidence | Contribution / results / missing information |
| --- | --- | --- | --- | --- |
| UGV LiDAR–Inertial SLAM / Robotics · Mapping Study | Repeated LiDAR–inertial maps to identify structural changes. Source: `projects/1UGV-Lidar-SLAM/index.md`. Image: `PHM_POSTER_EUNHA CHOI.png`. No linked code or video. | **Documented**, with visible output figures; no independent implementation verification. | Poster documents R3LIVE sensor fusion, Ouster OS0-32, FLIR Blackfly S, point-cloud preprocessing, ICP registration, and MAD-based change thresholding. Map/difference figures are visible evidence; they do not establish measured accuracy. | Existing prose explicitly attributes organizing the sensing/mapping/comparison workflow into a poster to the owner. Poster coauthorship does not establish ownership of the whole system. Raw code, datasets, measured evaluation, individual implementation roles, and demo are missing. |
| CourtVision / Computer Vision · CSE 327 | Basketball detection/tracking and player-associated events. Source: `projects/2CourtVision/index.md`. Image: `CSE327_ChoiVyas.png`. No linked code/video. Markdown incorrectly headed “FaceOnOff”. | **Documented**, with annotated result images; no code verification. | Poster names OpenCV, Supervision, OCR, YOLO/Roboflow and describes detection, jersey-number voting, event tracking, and court visualization. Screenshots show bounding boxes, jersey labels, shot annotation, and a 2D court map. | Joint poster lists Vedant P. Vyas and Eunha Choi, but not task division. Motion blur, low resolution, and cross-domain consistency limitations are documented. No measured accuracy or personally attributable implementation is established. |
| FaceOnOff / Computer Vision · CSE 327 | Original portfolio calls it an in-progress face-detection/UI experiment. Source: `projects/3faceOnOff/index.md`. No image/video; existing decorative fallback retained. | **Verified** for source-level features only; not executed or benchmarked. | Public `blur_face.py` imports Python/OpenCV and shows webcam capture, Haar-based detection, cached detections, stabilization, selective face exemption, adjustable pixelation, recording, and keyboard/mouse UI. README documents the pipeline and limitations. | Repository existence does not establish personal division of work. No runtime recordings or measurements inspected. Preserve experimental/in-progress documentation status; do not assert production readiness or guaranteed privacy. |
| Solar System WebAR / XR · WebAR | Browser AR solar system with the Sun, eight planets, and Moon. Source: `projects/4solar-webar/index.md`. No authentic application screenshot/video; existing decorative fallback retained. | **Verified** for source-level scene configuration only; AR not device-tested. | Public `index.html` loads A-Frame 1.0.4, declares WebXR optional features, textures, planet spheres, labels, orbit rings, nested Moon entity, and declarative rotation animations. | No individual contribution breakdown or device compatibility results. Declaring optional hit-test does not prove implemented surface-placement interaction. No physical-device test, measured scale accuracy, or deployment claim made. |

### Source references

- UGV: existing local Markdown and full poster; methodology and map figures inspected directly.
- CourtVision: existing local Markdown and full poster; methodology, results, challenges and future-work panels inspected directly. No model-version claim added from the small poster label.
- FaceOnOff: [source at inspected commit](https://github.com/eun346/faceOnOff/blob/5c880e3a850d71a8dc4ed720f6cab143982d685c/blur_face.py), [README](https://github.com/eun346/faceOnOff/blob/5c880e3a850d71a8dc4ed720f6cab143982d685c/README.md).
- Solar: [source at inspected commit](https://github.com/eun346/solar-system-webar/blob/6264c3eee9f907220de11a828bb0c685244e6083/index.html).

The first two projects have stronger local visuals and engineering narratives. The latter two have accessible implementation code. The existing order is retained; a recruitment-specific alternate order can be considered after personal contributions and demonstrations are supplied.

## Generator constraint

The current generated archive metadata includes `7Csharp-studying`, but that note has no source Markdown. A full regeneration would remove its entry. Phase 2 must preserve the entire archive export and only regenerate project metadata. Existing source bodies, project order, external destinations, and original image files must remain available.

## Implementation summary

Implemented locally on November 15, 2026. No commit, push, or deployment.

- Kept the Work page's existing three-column card composition, pastel glass surfaces, rounded corners, order, and responsive stacking. Cards now contain a concise description, 2–4 supported primary technology tags, a linked project title, and a clear **View Project** action. Existing code destinations remain available and are marked as external.
- Added the shared `projects/project.html?slug=...` detail page because there were no existing project detail pages. It reuses the current header, themes, Markdown renderer, lightbox, and reading styles. Each of the four existing projects has its own URL and source Markdown body; there is no new project or framework.
- Detail pages present supported overview, technologies, implementation, results/source material, and appropriate limitations. They include Back to Work and next-project navigation. Optional sections are omitted rather than fabricated. Only UGV has a My Contribution section, based on its pre-existing explicit first-person documentation about organizing the poster workflow.
- Corrected CourtVision's erroneous Markdown title, which previously said FaceOnOff. Retained the basketball detection/tracking narrative and added the poster's methodology, qualitative outputs, documented challenges, and explicitly future work.
- Updated FaceOnOff's short description using its accessible implementation rather than the earlier generic on/off summary. Kept its experimental/documentation-in-progress distinction and did not infer personal ownership.
- Kept both original PNG posters intact. Created full-image WebP previews with preserved aspect ratio and no cropping: **139,452 bytes** for UGV and **155,952 bytes** for CourtVision. Combined previews are **295,404 bytes**, compared with **9,364,822 bytes** for the originals. These are measured file sizes, not runtime-performance claims. Cards load previews lazily; image enlargement opens the original files.
- Retained existing decorative fallbacks for FaceOnOff and Solar rather than inventing screenshots. Detail pages without actual media omit the image region.
- Added project-only index generation and read-only checking. Archive metadata is preserved verbatim, including the missing-source C# entry. Full generation refuses to remove missing-source entries; project-only generation also refuses accidental project removal.

## Modified and added files

Phase 2 changes only the following files. Phase 1's existing `index.html` change and `PHASE1-REPORT.md` remain untouched.

| File | Reason |
| --- | --- |
| `site.js` | Shared project visual/link helpers, concise cards, project-detail loading/navigation; refresh project-index import. Existing archive, reveal, and lightbox functions unchanged. |
| `styles.css` | Added scoped Work/detail styles and Work lightbox dark-theme contrast. Existing Phase 1 rules and motion declarations retained. |
| `projects/index.html` | Updated introduction to cover the actual four projects, clarified column label, refreshed changed CSS/script URLs. |
| `projects/project.html` (new) | Shared accessible detail-page shell with existing navigation/theme structure and clear loading/error behavior. |
| `projects/1UGV-Lidar-SLAM/index.md` | Structured poster-based implementation/results, existing documented personal contribution, primary tags and image metadata. |
| `projects/2CourtVision/index.md` | Correct project heading, poster-based implementation/challenges/results/future work, primary tags and image metadata. |
| `projects/3faceOnOff/index.md` | Source-supported description and implementation, documented limitations, pinned source links; retained experimental status. |
| `projects/4solar-webar/index.md` | Source-supported scene structure and technology explanation, pinned source link, no invented AR testing. |
| `projects/1UGV-Lidar-SLAM/preview.webp` (new) | Smaller full-poster derivative; original PNG preserved. |
| `projects/2CourtVision/preview.webp` (new) | Smaller full-poster derivative; original PNG preserved. |
| `content-index.js` | Project export only, regenerated from Markdown. Archive export retained verbatim. |
| `tools/update-content-index.py` | Optional image/primary-tag fields, `--projects-only`, `--check`, missing-source deletion guards. |
| `CONTENT.md` | Documents shared project detail URLs, source fields, preview behavior, and safe generator workflow. |
| `PHASE2-CONTENT-QUESTIONS.md` (new) | Essential private editorial questions, grouped by project. |
| `PHASE2-REPORT.md` (new) | Inventory, implementation record, evidence matrix, verification, and limitations. |

Temporary QA scripts and baseline hashes were removed after validation. The pre-existing untracked `gravity/` directory was not edited or deleted.

## Project evidence matrix

| Project | Verified technology / qualification | Evidence | Content changes | Missing information |
| --- | --- | --- | --- | --- |
| UGV LiDAR–Inertial SLAM | No independent code verification. LiDAR, R3LIVE and ICP are **poster-documented**, not newly code-verified claims. | Existing poster's system overview, methodology and map output figures; existing Markdown personal-contribution sentence. | Explained scan → map preparation → alignment → change visualization. Retained only documented poster-work contribution. | Implementation source, raw maps, measured evaluation, additional individually attributable work, demo. |
| CourtVision | No independent code verification. OpenCV, Supervision, OCR and YOLO are **documented** in the poster/notes. | Existing poster's methodology, qualitative outputs, challenges and future-work panels. | Corrected wrong title; explained player/jersey association and shot visualization. Kept future features distinct. | Repository/notebook, owner/team task split, original output frames, demo, model/version and evaluation details. |
| FaceOnOff | **Source-verified:** Python, OpenCV, Haar detection, selective pixelation/UI and recording code. No runtime or benchmark verification. | Public `blur_face.py` and README at the pinned commit above. | Replaced vague card summary with actual source-level behavior; expanded pipeline/limitations without personal ownership claims. | Personal contributions, privacy-safe screenshot/video, execution measurements, current project status. |
| Solar System WebAR | **Source-verified:** A-Frame 1.0.4, WebXR configuration, textured scene entities and declarative orbits. Not device-tested. | Public `index.html` at the pinned commit above. | Explained nested orbital scene, textures/labels, and the distinction between configured optional features and verified interaction. | Personal contribution, real AR screenshot/demo, working deployment confirmation, browser/device test results. |

## Content integrity

- No achievements, numerical project performance, testing outcomes, awards, or deployment status were fabricated.
- No undocumented technologies were added. Poster-documented technologies are identified as such in detail prose; source-verifiable technologies are grounded in the linked code.
- No individual development responsibilities were inferred from repository ownership or poster authorship. UGV's limited contribution statement is supported by its existing Markdown.
- CourtVision's proposed future features and FaceOnOff's experimental status remain distinct from completed functionality.
- No stock, AI-generated, synthetic demonstration, or unrelated image was introduced. Both new previews are deterministic resized derivatives of existing posters, preserving their full content.
- All four project entries, their original order, original full tag lists, outcome metadata, categories, original image paths, and existing external destinations are preserved. Expanded detail prose retains their relevant existing narrative. Primary card tags are an additional concise field, not deletion of original tags.
- No fake demo action was added. Existing GitHub links remain; pinned source links were added from inspected public commits. Runtime behavior of those applications was not asserted to have been tested.

## Verification

### Passed

- **70 layout combinations:** Work plus all four detail URLs × widths **320, 375, 390, 430, 768, 1024, 1440px** × light/dark themes. The existing reduced-motion mode stabilized these measurements; no production motion settings were changed.
- No page-level horizontal overflow, offscreen audited headings/actions/tags, missing h1, or broken loaded local images in those combinations.
- Screenshot inspection of Work desktop/mobile, poster-based detail desktop/mobile, source-only detail mobile, and dark variants. Existing card composition and Phase 1 wrapping remain recognizable.
- All four title/detail destinations, all four next-project destinations, Back to Work, and unknown-slug fallback exercised in the browser.
- UGV and CourtVision image viewers loaded original PNGs at their original widths (3179 and 1587 pixels); Escape closed the dialog.
- Keyboard focus showed a visible 2px solid outline on View Project; Enter opened the intended detail page.
- All detail Markdown bodies loaded with one page h1 and section h2 headings.
- No JavaScript runtime or browser network errors observed during the completed Phase 2 tests. An initial QA run stopped while printing an en dash under Windows' default console encoding; the remaining checks were resumed with UTF-8. This was a test-output issue, not a website exception.
- Home checked with normal motion: original name/Technical Skills heading, one ready canvas, no fallback, no horizontal overflow. Note listing still renders seven entries without overflow.
- Changed JavaScript and protected animation modules passed syntax parsing.
- `python tools/update-content-index.py --projects-only --check` passed.
- Static URL checks confirmed all four detail links and image paths retain a GitHub Pages repository subdirectory and encode spaces in asset names.
- Safety regression: full generation correctly refuses the missing C# source without changing the index. A simulated missing-project-source input also refuses deletion and leaves output unchanged.
- Archive export compared verbatim with the prior index. Project count/order and original metadata fields checked. All original poster PNG hashes match Git originals.
- Phase 1 home/report hashes and protected animation-file hashes match the pre-Phase-2 baseline. Removing the isolated new project CSS block reproduces Phase 1 CSS after line-ending normalization. Existing reveal, lightbox and archive-rendering functions were compared unchanged.
- `git diff --check` passed.

### Limits and known existing issues

- No commit, push, deployment, production GitHub Pages session, physical-device AR test, webcam-program execution, or project benchmark was performed. Portfolio rendering checks are not tests of the engineering projects themselves.
- Tests use a local Chromium browser, not a full Safari/Firefox/device matrix.
- Existing C# note body 404 and externally hosted ROS GIF problems remain outside this phase. The Note listing was regression-checked; these known failures were not claimed fixed.
- The first additional source-reading attempt was blocked when automatic approval review hit a usage limit. No action ran from that rejected request. Previously obtained sources were sufficient; browser validation later received approval and completed.
- Actual public contribution details, raw output assets, and measurements remain limited as recorded above. Unavailable evidence is not treated as proof that a project is incomplete or invalid.

## Deferred improvements

1. Obtain original map-comparison figures and basketball output images/videos so thumbnails can show specific results more clearly than full posters.
2. Obtain a privacy-safe FaceOnOff screenshot/recording and an authentic Solar AR screenshot or demonstration; keep existing fallback artwork until then.
3. Confirm personal contribution boundaries for CourtVision, FaceOnOff, Solar, and UGV implementation beyond the documented poster work.
4. Add implementation repositories/notebooks for the two poster-based projects and reproducible evaluation conditions before discussing measured results.
5. Confirm current demo URLs and actual browser/device behavior. Do not turn source configuration into a deployment or compatibility claim.
6. Resolve the pre-existing missing C# Markdown and ROS external-image issues in a separate notes maintenance task, without deleting metadata in a global rebuild.

See `PHASE2-CONTENT-QUESTIONS.md` for the short project-specific questions. Those questions are not rendered on public pages.
