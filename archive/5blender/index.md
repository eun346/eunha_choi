---
title: Blender Practice: A Cookie and a Floor Plan
published: 2025-08-08
description: Notes from two Blender exercises focused on mesh editing, modifiers, materials, lighting, and preparing simple 3D assets for future Unity scenes.
image: "./images/0cover.png"
tags: [Blender, 3D Modeling, Materials, Unity]
category: Learning Log
draft: false 
---

I used two Blender exercises—a modeled cookie and a floor-plan scene—to practice the basics I will need for Unity assets: mesh editing, modifiers, materials, lighting, and clean scene organization.

---

# Understanding the Basics
Before starting, I clarified essential 3D modeling concepts.  

| Term       | Description |
| ---------- | ----------- |
| `Mesh`     | A combination of vertices (points), edges (lines), faces (polygons), or any combination of these. |
| `Geometry` | Any 3D object with position data, including meshes, curves, instances, volumes, etc. |
| `Instance` | A duplicate of an object sharing the same underlying data as the original. |
| `Shader`   | A program controlling how light interacts with a surface, affecting color, reflection, transparency, and emission. In Blender, it’s often used interchangeably with `material`. |

💡 *Why it matters*: Separating object-level transforms from mesh edits helped me understand when to use Object Mode, Edit Mode, and modifiers.

---

# Tools & Resources
- **Blender 4.4**, the version used for these exercises: [release page](https://www.blender.org/download/releases/4-4/)  
- YouTube Tutorials:  
    - [Beginner Tutorial](https://www.youtube.com/watch?v=Ci3Has4L5W4)  
    - [Floor Plan Tutorial](https://www.youtube.com/watch?v=94kAIpRnhcY)  

---

# Essential Shortcuts
| Shortcut | Action |
| -------- | ------ |
| `Middle Mouse` | Orbit around scene |
| `Shift + Middle Mouse` | Pan view |
| `Mouse Wheel Scroll` | Zoom in/out |
| `Tab` | Switch between Object/Edit Mode |
| `N` | Toggle Sidebar |

For **Object Mode**:
| Shortcut | Action |
| -------- | ------ |
| `T` | Toggle Toolbar |
| `G` | Move objects |
| `R` | Rotate objects |
| `S` | Scale (resize) objects |
| `Shift + A` | Add object |
| `Ctrl + L` | Link properties between objects |

💡 *Tip:* For more shortcuts, check Blender’s [Keymap Documentation](https://docs.blender.org/manual/en/latest/interface/keymap/introduction.html).

## Recommended Setup
- Go to `Edit > Preferences > Interface` and adjust the **Resolution Scale**  
💡 *Why:* This keeps interface text and controls readable on the current display.  

- Check your GPU under `System > Cycles Render Devices > CUDA`  
💡 *Why:* This confirms whether the GPU is available for Cycles rendering.  

- Increase **Undo Steps** to **100** in `System > Memory & Limits`  
💡 *Why:* A longer undo history made it easier to recover from modeling mistakes.  

---

# Practice Exercises

## Tutorial 1: [Blender Beginner Tutorial](https://www.youtube.com/watch?v=Ci3Has4L5W4)
This tutorial covered the fundamentals:  
- Navigating Blender’s viewport  
- Differences between **Edit Mode** and **Object Mode**  
- Building a simple object step by step  

---

### 1. Cookie Base
![cookieBase](./images/1Blender1-1.png)
- Add a **Cylinder** (`Shift + A > Mesh > Cylinder`).
- Scale (`S`) to flatten into a cookie shape.
- Right-click → `Shade Smooth` for a softer look.
![rename](./images/2Blender1-2.png)
- Rename it Cookie in the Outliner to stay organized.

### 2. Chocolate Chips
![uvSphere](./images/3Blender1-3.png)
- Add a **UV Sphere** (`Shift + A > Mesh > UV Sphere`)  
- Scale down (`S`) to chip size  
- Position using **Move** (`G`)  
![duplicate](./images/4Blender1-4.png)
- Duplicate chips (`Shift + D`) and place around the cookie  

### 3. Tray
- Add a **Cube** (`Shift + A > Mesh > Cube`)  
- Scale and move it to sit under the cookie.
![insetFace](./images/5Blender1-5.png)
- Enter **Edit Mode** (`Tab`), select top face, use **Inset Faces** (`I`)  
![extrude](./images/6Blender1-6.png)
![extrude2](./images/7Blender1-7.png)
- Extrude inner face down (`E`) to create tray depth
![move](./images/8Blender1-8.png)
- Move the tray under the cookie.

### 4. Materials and Colors
![color](./images/9Blender1-9.png)
- Add material in **Material Properties** → `New`  
- Choose **Base Color** for cookie, chips, and tray  
![link](./images/10Blender1-10.png)
- To quickly assign the same material, select chips → last chip with material → `Ctrl + L > Materials`  

### 5. Lighting and Rendering
![renderview](./images/11Blender1-11.png)
- Click **Viewport Shading: Rendered**
- Delete default light → Add **Area Light** (`Shift + A > Light > Area`)  
![camera](./images/12Blender1-12.png)
- Position camera (`0` on numpad, enable **Camera to View**)  
- Set the render engine to **Cycles** for the final render.  
![image](./images/13Blender1-13.png)
- Render with `F12` → Save via `Image > Save As`  

---

## Tutorial 2: [Blender Floor Plan Tutorial](https://www.youtube.com/watch?v=94kAIpRnhcY)
This tutorial focused on combining objects and creating a full scene:  
- Importing and scaling floor plan images  
- Modeling floors and walls  
- Applying materials, lighting, and render settings  

### 1. Setup
- Download a floor plan image  
- Open Blender, select all (`A`) and delete (`X`) default objects  
- Import the floor plan as an image; Blender creates it as an Empty object.  
![img](./images/15Blender2-1.png)
- Reset location & rotation: `Alt + G`, `Alt + R`  
- Switch to Top Orthographic View (`7` on the numpad or click Z on the viewport gizmo).  
- Set **Units** to Metric (Scene Properties → Units → Metric → Meters)  

### 2. Floor and Walls
![plane](./images/16Blender2-2.png)
- Add **Plane** (`Shift + A > Mesh > Plane`)
![scale](./images/17Blender2-3.png)
- Rename to **Walls** and set dimensions in Item Sidebar → Apply scale (`Ctrl + A > Scale`) 
![wallsOrigin](./images/18Blender2-4.png)
- Select `Walls`, move the cursor with `Shift + S → Cursor to Selected`, and set `Right Click → Set Origin → Origin to 3D Cursor`.
- Clear the object’s translation with `Alt + G`.
![onlyface](./images/19Blender2-5.png)
- In **Edit Mode**, delete face (`X > Only Faces`)
- In **Object Mode**, align the floor-plan image with the wall outline.
- Delete three vertices in Walls (`X > Vertices`)
![extrudevertices](./images/20Blender2-6.png)
- **In Edit Mode**, extrude vertices (`E`) along X/Y to match outer walls
- Extrude inner walls for rooms too
![floor](./images/21Blender2-7.png)
- Duplicate `Walls`, rename the copy `Floor`, and hide `Walls` with the eye icon.
- Delete overlapping or unnecessary vertices from `Floor`.
- For each room, select its boundary vertices and create a face (`F`).

### 3. Finalizing and Rendering
![background](./images/22Blender2-8.png)
- Duplicate floor (`Shift + D > Right Click`) and rename **Background**
- Hide Floor and Walls
- In Background, delete all inner vertices  
- Extrude everything and scale (`A > E > S`)
![zextrude](./images/23Blender2-10.png)
- Hide Floor and Background. Select Walls → Extrude upwards along Z-axis (`E > Z`)  
![ori](./images/24Blender2-11.png)
- Enable `Face Orientation` from the Overlays menu.
![sol](./images/25Blender2-12.png)
![mod](./images/26Blender2-13.png)
- Add a **Solidify Modifier** (`Modifier > Add Modifier > Solidify`) and adjust the thickness for the wall geometry.
- Toggle the modifier’s viewport icon to inspect the result.
![flip](./images/27Blender2-14.png)
- Fix flipped faces (`Shift + N`) (blue = outer, red = inner)
- Toggle the modifier’s viewport icon again after checking the geometry.
- Disable the Face Orientation overlay.
![end](./images/28Blender2-15.png)
- Save your work (`Ctrl + S`)

---

# What I Learned
The floor-plan exercise was useful because it combined modeling, modifiers, materials, lighting, and object organization in one scene. It also showed me which details need attention before an asset is ready for a larger Unity project. My next step is to optimize a small asset and test the import workflow in Unity.

💡 *Final Tip:* Always organize objects, name them clearly, and save iterations frequently. This keeps projects manageable as scenes get complex.

---
