---
title: UGV LiDAR–Inertial SLAM
category: Robotics / Mapping Study
description: An independently conducted UGV mapping study using repeated LiDAR–inertial maps to examine structural changes, from scan collection and map preparation through alignment and change visualization.
outcome: Created a technical poster documenting the sensing and map-comparison workflow for structural change detection.
tags: [UGV, LiDAR, SLAM, Change Detection, Robotics]
accent: cyan
order: 1
image: ./PHM_POSTER_EUNHA CHOI.png
github:
demo:
draft: false
preview: ./preview.webp
imageAlt: Technical poster showing repeated UGV point-cloud maps and highlighted structural differences.
primaryTags: [LiDAR, R3LIVE, ICP]
---

# UGV LiDAR–Inertial SLAM

# Overview

This mapping study explores whether repeated LiDAR–inertial maps captured by an unmanned ground vehicle can reveal structural changes in an environment. The technical poster presents a workflow for revisiting an environment, comparing its point clouds, and highlighting geometric differences for structural monitoring.

# My Contribution

I independently conducted the entire project, taking responsibility for the documented workflow: repeated scan collection, R3LIVE-based mapping, point-cloud preparation, ICP alignment, change visualization, and the technical poster. I used existing algorithms, including R3LIVE and ICP, rather than developing those algorithms.

# Technologies and Hardware

The poster documents the following system components. The descriptions below reflect the documented workflow, rather than an independently reproduced implementation.

- **R3LIVE:** fusion of LiDAR, inertial, and visual data for colorized point-cloud mapping.
- **Ouster OS0-32 and FLIR Blackfly S:** the LiDAR and camera identified in the mobile sensing setup.
- **Point-cloud processing:** format conversion, voxel downsampling, and statistical outlier removal.
- **ICP and Median Absolute Deviation:** alignment of repeated maps and adaptive thresholding for geometric differences.

# Implementation

1. **Collect repeated scans.** A mobile platform revisits the same environment at different times to capture maps for comparison.
2. **Build and prepare maps.** The poster describes R3LIVE-based reconstruction, conversion from `.pcd` to `.ply`, voxel downsampling, and noise filtering.
3. **Align the point clouds.** Point-to-point ICP registers the maps into a common coordinate system.
4. **Identify differences.** Cloud-to-cloud distances and a Median Absolute Deviation threshold isolate geometric discrepancies, displayed in red against the compared maps.

# Results and Demonstration

The poster shows source and comparison maps, preprocessing views, and highlighted change regions for indoor scenes. These figures provide a visual account of the mapping and comparison workflow; they are not an independently reproduced accuracy benchmark.

The full-resolution poster above contains the system diagram, methodology, and result figures. This portfolio does not include the implementation code, raw point clouds, or a recorded demonstration.
