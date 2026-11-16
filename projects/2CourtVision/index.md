---
title: CourtVision
category: Computer Vision / CSE 327
description: A collaborative basketball video-analysis project. My main contribution was jersey-number detection and player identification, associating jersey numbers with player IDs to identify scoring players.
outcome: Built a multi-stage computer vision pipeline for player, ball, referee, and court-region detection, with player tracking and event recognition for analyzing basketball gameplay.
tags: [Computer Vision, OpenCV, YOLO, Object Tracking]
accent: cyan
order: 2
image: ./CSE327_ChoiVyas.png
github: 
demo:
draft: false
preview: ./preview.webp
imageAlt: CourtVision poster showing basketball detection, jersey labels, and a made-or-missed shot map.
primaryTags: [OpenCV, Supervision, OCR, YOLO]
---

# CourtVision

# Overview

CourtVision is a basketball video-analysis project developed for CSE 327. Its existing project notes describe YOLO-based detection and object tracking for players, the ball, referees, and court regions, with player IDs associated across frames. The notes also describe jump-shot and layup/dunk events connected to the involved player.

The accompanying poster focuses on jump-shot make-or-miss analysis and spatial shot mapping: connecting detected events to jersey numbers, annotated frames, and a two-dimensional court view.

# My Contribution

This was a collaborative project. My main contribution was jersey-number detection and player identification, including associating jersey numbers with player IDs to identify scoring players. The system workflow described below represents the shared project, not work I completed entirely on my own.

# Technologies Used

The poster and project notes document **OpenCV**, **Supervision**, **OCR**, and **YOLO-based detection**, with a Roboflow-based detection workflow. These are documented technologies; the implementation repository is not included in the portfolio.

# Implementation

1. **Process basketball frames.** The documented pipeline identifies relevant objects and shot actions in video clips.
2. **Associate jersey numbers.** OCR and a confidence-voting approach assign a jersey number to a tracked player; a memory mechanism retains prior assignments across frames.
3. **Track shot events.** The pipeline follows the beginning and end of a shot and associates the outcome with the player number.
4. **Visualize the results.** The poster shows annotated video frames and makes/misses plotted on a custom court map. It also describes processing lists of clips and saving annotated output images.

# Technical Challenges

The poster reports detection errors during motion blur and fast shot actions. Low-resolution footage makes small details, including jersey numbers and the ball, difficult to detect.

It also reports inconsistent detection when moving to basketball footage outside the original model's domain, motivating further model development. The available poster does not establish that these limitations have been resolved or provide a quantitative comparison of models.

# Results and Demonstration

The full poster shows four types of output: an annotated shot outcome, object/action detection boxes, jersey-number regions, and a two-dimensional made/missed-shot map. These are qualitative examples, not a measured accuracy claim.

The documented result is a multi-stage pipeline connecting detection, tracking, player association, and event visualization. The poster lists Eunha Choi and Vedant P. Vyas as authors. My contribution focused on jersey-number detection and player identification as described above.

# Future Work

The poster proposes broader league and broadcast coverage, richer player shooting profiles, practical coaching/scouting applications, and a continuous shot timeline. These remain future directions rather than completed features.
