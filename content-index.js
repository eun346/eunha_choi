// Generated from archive/*/index.md and projects/*/index.md.
// Run `python tools/update-content-index.py` after adding or editing content.

export const projects = [
  {
    "slug": "1UGV-Lidar-SLAM",
    "title": "UGV LiDAR–Inertial SLAM",
    "category": "Robotics / Mapping Study",
    "description": "An independently conducted UGV mapping study using repeated LiDAR–inertial maps to examine structural changes, from scan collection and map preparation through alignment and change visualization.",
    "outcome": "Created a technical poster documenting the sensing and map-comparison workflow for structural change detection.",
    "tags": [
      "UGV",
      "LiDAR",
      "SLAM",
      "Change Detection",
      "Robotics"
    ],
    "accent": "cyan",
    "image": "./PHM_POSTER_EUNHA CHOI.png",
    "preview": "./preview.webp",
    "imageAlt": "Technical poster showing repeated UGV point-cloud maps and highlighted structural differences.",
    "primaryTags": [
      "LiDAR",
      "R3LIVE",
      "ICP"
    ],
    "order": 1,
    "github": "",
    "demo": ""
  },
  {
    "slug": "2CourtVision",
    "title": "CourtVision",
    "category": "Computer Vision / CSE 327",
    "description": "A collaborative basketball video-analysis project. My main contribution was jersey-number detection and player identification, associating jersey numbers with player IDs to identify scoring players.",
    "outcome": "Built a multi-stage computer vision pipeline for player, ball, referee, and court-region detection, with player tracking and event recognition for analyzing basketball gameplay.",
    "tags": [
      "Computer Vision",
      "OpenCV",
      "YOLO",
      "Object Tracking"
    ],
    "accent": "cyan",
    "image": "./CSE327_ChoiVyas.png",
    "preview": "./preview.webp",
    "imageAlt": "CourtVision poster showing basketball detection, jersey labels, and a made-or-missed shot map.",
    "primaryTags": [
      "OpenCV",
      "Supervision",
      "OCR",
      "YOLO"
    ],
    "order": 2,
    "github": "",
    "demo": ""
  },
  {
    "slug": "3faceOnOff",
    "title": "FaceOnOff",
    "category": "Computer Vision / CSE 327",
    "description": "An experimental webcam application using an existing open-source face detector. I implemented selective face pixelation, recording functionality, and the user interface.",
    "outcome": "Used the prototype to practice a real-time detection-to-interface loop; implementation details and results are still being documented.",
    "tags": [
      "Computer Vision",
      "Face Detection"
    ],
    "accent": "cyan",
    "image": "",
    "preview": "",
    "imageAlt": "",
    "primaryTags": [
      "Python",
      "OpenCV",
      "Haar cascades"
    ],
    "order": 3,
    "github": "https://github.com/eun346/faceOnOff",
    "demo": ""
  },
  {
    "slug": "4gearbox",
    "title": "Gearbox Design and Motion Study",
    "category": "Mechanical Engineering / MEC 203",
    "description": "Designed and assembled a multi-component gearbox in Autodesk Fusion 360, including individual part modeling, component alignment, and motion visualization.",
    "outcome": "Completed a 3D gearbox assembly, technical assembly drawing, and motion study.",
    "tags": [
      "Mechanical Engineering",
      "CAD",
      "Gearbox",
      "Mechanical Design",
      "Motion Study"
    ],
    "accent": "cyan",
    "image": "./gearbox.png",
    "preview": "./gearbox-preview.webp",
    "imageAlt": "Autodesk Fusion 360 model showing an assembled gearbox with spur gears, shafts, bearings, and housing.",
    "primaryTags": [
      "Fusion 360",
      "CAD",
      "Motion Study"
    ],
    "order": 4,
    "github": "",
    "demo": ""
  }
];

export const archivePosts = [
  {
    "slug": "7Csharp-studying",
    "title": "C# Foundations for Unity",
    "date": "2025-12-16",
    "category": "Study Notes",
    "tags": [
      "C#",
      "Unity",
      "Programming Fundamentals"
    ],
    "excerpt": "Study notes and small code examples on types, operators, control flow, arrays, and methods as preparation for Unity scripting.",
    "readingTime": "3 minutes"
  },
  {
    "slug": "6mcp-unity-blender",
    "title": "Testing MCP Workflows in Blender and Unity",
    "date": "2025-08-11",
    "category": "Experiment",
    "tags": [
      "MCP",
      "Blender",
      "Unity",
      "AI Tools"
    ],
    "excerpt": "An experiment connecting Claude to Blender and Unity through MCP, with setup notes and observations about scene inspection, object edits, and current limitations.",
    "readingTime": "4 minutes"
  },
  {
    "slug": "5blender",
    "title": "Blender Practice: A Cookie and a Floor Plan",
    "date": "2025-08-08",
    "category": "Learning Log",
    "tags": [
      "Blender",
      "3D Modeling",
      "Materials",
      "Unity"
    ],
    "excerpt": "Notes from two Blender exercises focused on mesh editing, modifiers, materials, lighting, and preparing simple 3D assets for future Unity scenes.",
    "readingTime": "6 minutes"
  },
  {
    "slug": "4mr-tutorial",
    "title": "Meta Quest 3 Passthrough Physics Experiment",
    "date": "2025-08-06",
    "category": "Experiment",
    "tags": [
      "Mixed Reality",
      "Unity",
      "Meta Quest 3",
      "Passthrough"
    ],
    "excerpt": "An MR practice build that places throwable virtual balls in a room-scale passthrough scene and tests scene scanning, collisions, and Quest deployment in Unity.",
    "readingTime": "5 minutes"
  },
  {
    "slug": "3tcp-ro2-unity",
    "title": "Connecting ROS 2 and Unity over TCP",
    "date": "2025-07-24",
    "category": "Build Log",
    "tags": [
      "ROS 2",
      "Unity",
      "TCP",
      "SLAM"
    ],
    "excerpt": "A build log for linking ROS 2 Humble with Unity and testing publishers, subscribers, services, and a Nav2 and SLAM visualization workflow.",
    "readingTime": "5 minutes"
  },
  {
    "slug": "2ros2-tutorial",
    "title": "ROS 2 Foundations: Nodes, Topics, and Robot Tools",
    "date": "2025-07-14",
    "category": "Study Notes",
    "tags": [
      "ROS 2",
      "Robotics",
      "Ubuntu",
      "RViz"
    ],
    "excerpt": "Study notes on ROS 2 communication, launch files, TF2, URDF, RViz, and the debugging steps I used while moving toward robot workflows.",
    "readingTime": "6 minutes"
  },
  {
    "slug": "1vr-tutorial",
    "title": "Building Core VR Interactions in Unity",
    "date": "2025-07-07",
    "category": "Learning Log",
    "tags": [
      "Unity",
      "VR",
      "XR Interaction Toolkit",
      "Meta Quest"
    ],
    "excerpt": "A learning log from building locomotion, grabbing, haptics, world-space UI, and comfort features with Unity’s XR Interaction Toolkit.",
    "readingTime": "6 minutes"
  }
];

export const archiveCategories = [...new Set(archivePosts.map((post) => post.category))].sort();
export const archiveTags = [...new Set(archivePosts.flatMap((post) => post.tags))].sort();
