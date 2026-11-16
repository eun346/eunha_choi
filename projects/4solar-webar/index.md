---
title: Solar System WebAR
category: XR / WebAR
description: A browser-based AR scene that presents the Sun, all eight planets, and the Moon as an animated 3D solar system using A-Frame and WebXR.
outcome: Used A-Frame components and WebXR to practice orbital animation, spatial scale, and AR delivery through a compatible browser.
tags: [A-Frame, WebXR, WebAR, 3D Interaction]
accent: cyan
order: 4
github: https://github.com/eun346/solar-system-webar
demo:
draft: false
primaryTags: [A-Frame, WebXR]
---

# Solar System WebAR

# Overview

Solar System WebAR is a small browser-based AR scene built with A-Frame and WebXR. It presents the Sun, all eight planets, and the Moon as an animated solar system, exploring orbital animation, spatial scale, and educational 3D content in a compatible browser.

# Technologies Used

The source loads **A-Frame 1.0.4** and configures **WebXR** on an HTML scene. Planet textures are referenced from the repository's `Texture` directory.

# Implementation

- Textured spheres represent the Sun, planets, and Moon; text labels identify the celestial bodies.
- Rotating parent entities drive the planetary orbits. The Moon is nested within Earth's orbital entity, while individual spheres have their own rotation animations.
- Orbit rings, Saturn's rings, a camera, and lighting complete the scene.
- WebXR declares optional `hit-test` and `local-floor` features. This configuration alone does not establish a surface-placement interaction or tested device support.

# Source and Demonstration

The [inspected HTML source](https://github.com/eun346/solar-system-webar/blob/6264c3eee9f907220de11a828bb0c685244e6083/index.html) contains the scene and animation definitions. No real-device recording or application screenshot is included here, and AR behavior has not been independently tested for this portfolio review.
