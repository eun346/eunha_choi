---
title: FaceOnOff
category: Computer Vision / CSE 327
description: An experimental webcam application using an existing open-source face detector. I implemented selective face pixelation, recording functionality, and the user interface.
outcome: Used the prototype to practice a real-time detection-to-interface loop; implementation details and results are still being documented.
tags: [Computer Vision, Face Detection]
accent: cyan
order: 3
github: https://github.com/eun346/faceOnOff
demo:
draft: false
primaryTags: [Python, OpenCV, Haar cascades]
---

# FaceOnOff

# Overview

FaceOnOff is an experimental webcam application for interactive face pixelation. It detects faces, applies a pixelation effect, and lets the user choose faces that should remain unblurred. The source also includes adjustable pixelation levels and recording of the processed output.

The original portfolio described this as an in-progress face-detection-to-interface experiment. The linked implementation now provides more detail about that interaction; the project's documentation and results remain in progress.

# My Contribution

I reused an existing open-source face detector. I personally implemented selective face pixelation, recording functionality, and the user interface. The underlying face detection functionality was reused, not developed by me.

# Technologies Used

**Python** and **OpenCV** are directly visible in `blur_face.py`. The implementation uses Haar cascade detection and bounding-box overlap for detection association. It does not implement persistent identity recognition.

# Implementation

1. **Capture a webcam frame.** OpenCV reads the camera stream; detection operates on grayscale frames.
2. **Detect and stabilize faces.** The source uses multiple Haar cascades, combines overlapping detections, and stabilizes candidate boxes across frames. Detection is performed at configured intervals with cached results between detection passes.
3. **Apply selective pixelation.** Detected face regions are pixelated unless the user marks them exempt. Clicking a face toggles its exemption; UI controls change pixelation strength.
4. **Render and record.** The application draws controls on the frame and can write the processed output to a video file. Keyboard shortcuts include `r` for recording, `c` to clear exemptions, and `q` to quit.

# Limitations

The README documents possible false positives, sensitivity to lighting, and the absence of identity-based tracking. Its planned deep-learning detectors, persistent recognition, GPU acceleration, and web version should not be read as implemented features.

# Source and Demonstration

The linked source implements the detection-to-interface loop and recording controls. No saved output video or application screenshot is included in this portfolio, and this review did not execute the webcam application or measure its performance.

[Read the inspected implementation](https://github.com/eun346/faceOnOff/blob/5c880e3a850d71a8dc4ed720f6cab143982d685c/blur_face.py) or [the project README](https://github.com/eun346/faceOnOff/blob/5c880e3a850d71a8dc4ed720f6cab143982d685c/README.md).
