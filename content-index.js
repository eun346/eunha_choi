// Generated from archive/*/index.md and projects/*/index.md.
// Run `python tools/update-content-index.py` after adding or editing content.

export const projects = [
  {
    "slug": "1UGV-Lidar-SLAM",
    "title": "UGV LiDAR–Inertial SLAM",
    "category": "Robotics / Mapping Study",
    "description": "A mapping study that uses repeated LiDAR–inertial SLAM runs from an unmanned ground vehicle to examine how an environment changes over time.",
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
    "order": 1,
    "github": "",
    "demo": ""
  },
  {
    "slug": "2CourtVision",
    "title": "CourtVision",
    "category": "Computer Vision / CSE 327",
    "description": "A basketball video-analysis system that detects and tracks players, identifies key game events such as jump shots and layups, and connects those events to individual player IDs.",
    "outcome": "Built a multi-stage computer vision pipeline for player, ball, referee, and court-region detection, with player tracking and event recognition for analyzing basketball gameplay.",
    "tags": [
      "Computer Vision",
      "OpenCV",
      "YOLO",
      "Object Tracking"
    ],
    "accent": "cyan",
    "image": "./CSE327_ChoiVyas.png",
    "order": 2,
    "github": "",
    "demo": ""
  },
  {
    "slug": "3faceOnOff",
    "title": "FaceOnOff",
    "category": "Computer Vision / CSE 327",
    "description": "An early interaction experiment that connects face-detection input to a simple on/off visual response.",
    "outcome": "Used the prototype to practice a real-time detection-to-interface loop; implementation details and results are still being documented.",
    "tags": [
      "Computer Vision",
      "Face Detection"
    ],
    "accent": "cyan",
    "image": "",
    "order": 3,
    "github": "https://github.com/eun346/faceOnOff",
    "demo": ""
  },
  {
    "slug": "4solar-webar",
    "title": "Solar System WebAR",
    "category": "XR / WebAR",
    "description": "A browser-based AR scene that presents the Sun, all eight planets, and the Moon as an animated 3D solar system using A-Frame and WebXR.",
    "outcome": "Used A-Frame components and WebXR to practice orbital animation, spatial scale, and AR delivery through a compatible browser.",
    "tags": [
      "A-Frame",
      "WebXR",
      "WebAR",
      "3D Interaction"
    ],
    "accent": "cyan",
    "image": "",
    "order": 4,
    "github": "https://github.com/eun346/solar-system-webar",
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
