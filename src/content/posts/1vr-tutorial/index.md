---
title: VR Game Tutorial
published: 2025-07-07
description: This post deals with Tutorial for VR Game.
tags: [VR, Unity, Game]
category: Tutorial
draft: false
---

# Introduction
I recently followed Valem’s “How to Make a VR Game in Unity” series (13 videos) to understand the fundamentals of VR interaction using the Unity XR Interaction Toolkit. The videos cover everything from basic VR setup to locomotion, grabbing, haptics, UI interaction, and comfort features. While the tutorial itself is straightforward, implementing it in a real Unity project exposed a lot of small details that matter more than expected. This post is a structured summary of everything I learned along the way—both from the guide and from debugging my own mistakes.

---

# Tutorial Overview
**Source:** “How to make a VR game in Unity” by Valem (13-video series)  
**Hardware:** Meta Quest 2 / Quest Link  
**Software:** Unity 2023.x + XR Interaction Toolkit  

### Video Breakdown
1–2. VR Overview & Unity Setup  
3. Hand Models & Input  
4. Continuous Move & Turn  
5. Teleportation  
6. Hover / Grab / Interactables  
7. Offset Grab & Distance Grab  
8. VR UI  
9. Haptics  
10–11. Grab Poses  
12. Tunneling Vignette (comfort)  
13. Example Project Overview  

---

# Development Steps

## Programming (C#)
Throughout the tutorial I implemented several core interaction scripts:
- custom input detection (pinch, grip, trigger) using the Input System  
- projectile / bullet firing logic  
- vibrating controllers via XR haptics  
- enforcing custom grab poses  
- automatically disabling teleport rays while interacting with UI  
- managing interaction layers for direct vs. ray interactors  

Implementing these by hand gave me a much better understanding of how XR Interaction Toolkit actually processes events behind the scenes.

---

## Unity & XR Interaction Toolkit
### Core Unity steps included:
- enabling OpenXR in XR Plugin Management  
- setting up the XR Origin (camera + hands)  
- using XR Ray Interactor for teleportation and distance grabbing  
- building interactive World Space UIs  
- adding continuous locomotion and snap turning  
- configuring Tunneling Vignette to reduce motion sickness  
- mirroring hand poses between left and right hands  
- organizing interaction layers  

Even though Unity automates a lot of VR setup today, the small configuration details still matter—especially when multiple systems like locomotion, UI, grabbing, and physics overlap.

---

# Step-by-Step Implementation

## Video 1–2: VR Overview & Setup
### 1. Project Setup
- Created a new Unity project  
- Adjusted project settings (rendering, physics, XR defaults)  
- Added a main VR scene with a plane and basic environment  

### 2. XR Setup
- Installed **XR Interaction Toolkit** via Package Manager  
- Added **XR Origin** containing camera and both hand controllers  
- Configured Input Actions for both controllers  

### 3. XR Plugin
- Enabled **OpenXR**  
- Activated required interaction profiles  

This part seems simple, but OpenXR configuration must match the headset—otherwise nothing responds.

---

## Video 3: Hand Models & VR Input
### Hand Setup
- Imported custom hand models  
- Placed them under LeftHand / RightHand  
- (Optional) Added Animator controllers for finger motions  

### Input Detection
Coded detection for:
- trigger  
- grip  
- pinch  

This made it easier to connect interactions like firing bullets or grabbing interactables.

---

## Video 4: Continuous Movement & Turning
### Continuous Locomotion
Implemented using:
- **Continuous Move Provider**
- Character Controller  
- Gravity + center adjustments  

### Turn Provider
Two modes:
- Continuous Turn (smooth rotation)  
- Snap Turn (fixed-angle rotation for comfort)  

Movement feels simple, but balancing gravity, character height, and collision takes trial and error.

---

## Video 5: Teleportation
### Teleportation Setup
- Added **XR Ray Interactor** to each controller  
- Configured straight or curved ray  
- Added **Teleportation Provider**  
- Defined teleportation areas (floors, platforms)  
- Added a hover reticle for valid targets  

Teleport is still the most comfortable VR locomotion option, so getting this right matters.

---

## Video 6: Hover, Grab, and Interactables
### Hover Detection
Used **XR Direct Interactor** + Collider.

### Grab Interactables
Configured:
- Rigidbody  
- Collider  
- Interaction settings (instantaneous / velocity-based / kinematic)  

### Projectile Firing
Imported a pistol model and implemented forward bullet firing.

This was the first part that made the project feel like an actual VR game.

---

## Video 7: Offset Grab & Distance Grab
### Offset Grab
Created attachment transforms for left and right hands so each object is held naturally.

### Distance Grab
Enabled remote grabbing using:
- XR Ray Interactor  
- Interaction layers  

Layer management is surprisingly easy to overlook, but it's crucial for preventing your rays from grabbing UI or teleport surfaces unintentionally.

---

## Video 8: VR UI
### World-Space UI
- Added a World Space canvas  
- Attached buttons, sliders, toggles  
- Set UI layer + interaction components  

### Handling Interaction Conflicts
Disabled teleport rays whenever hands interacted with UI—preventing accidental teleports.

### Dynamic UI
Added a toggle panel that appears in front of the user.

---

## Video 9: Haptic Feedback
### Haptic Setup
- Attached custom haptic scripts  
- Triggered haptics on grab/release  
- Controlled intensity + duration  

Haptics are a small detail but dramatically improve interaction feel.

---

## Video 10–11: Grab Poses
### Custom Grab Poses
- Captured hand joint data for right hand  
- Applied pose to interactable via attach transform  
- Mirrored pose to left hand  

Custom grab poses make objects feel much more realistic, especially tools or weapons.

---

## Video 12: Tunneling Vignette
### Comfort Feature
- Imported **Tunneling Vignette** sample  
- Configured feathering, fade times, colors  
- Attached component to main camera  

This reduces VR motion sickness by limiting peripheral vision during movement.

---

## Video 13: Example Project
Explored Unity’s built-in XR samples:
- interactables  
- physics interaction  
- socket interactables  
- climbing  
- gaze input  
- locomotion  
- both 2D & 3D UI  

This was helpful to understand more complex, real-world setups.

---

# Problems I Encountered

## 1. Unity Version Mismatch
**Issue:** Certain XR features didn't match the tutorial.  
**Fix:** Downgraded Unity to **2023.3.16f1** (matching the tutorial’s version).

## 2. Meta Quest Link Issues
**Issue:** Quest Link displayed in low resolution or failed to connect.  
**Fix:** Switched PCs + updated GPU drivers & Oculus app.

## 3. Input Misconfiguration
**Issue:** Trigger / grip inputs not firing correctly.  
**Fix:** Rewrote entire Input Action asset and fixed bindings.

Debugging VR setups often feels like fighting invisible settings—especially with the Input System.

---

# Questions Going Forward
Following the tutorial clarified the basics, but it also left me with a few questions that matter for real development:

- Should I rely on Unity’s default grab system or fully customize grab poses per object?  
- Are there recommended architecture patterns for complex VR interactions?  
- How can I simulate and debug VR features quickly without wearing the headset every time?  

These are areas I want to explore more deeply as I start developing my own VR mechanics.

