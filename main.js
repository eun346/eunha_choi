import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.querySelector("#hero-model");
const fallback = document.querySelector("[data-model-fallback]");

if (canvas) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.65, 13.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    scene.add(new THREE.HemisphereLight(0x9adfff, 0x02040b, 1.75));

    const keyLight = new THREE.DirectionalLight(0xb9eaff, 3.3);
    keyLight.position.set(-3.5, 5.5, 7);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x20cfff, 48, 12);
    cyanLight.position.set(3.2, 0.15, 3.5);
    scene.add(cyanLight);

    const screenLight = new THREE.PointLight(0x1689ff, 32, 11);
    screenLight.position.set(-0.6, 0.8, 3.1);
    scene.add(screenLight);

    const materials = {
      black: new THREE.MeshStandardMaterial({ color: 0x030711, roughness: 0.5, metalness: 0.55 }),
      frame: new THREE.MeshStandardMaterial({ color: 0x05070b, roughness: 0.3, metalness: 0.9 }),
      shell: new THREE.MeshPhysicalMaterial({ color: 0x0b1728, roughness: 0.24, metalness: 0.7, clearcoat: 0.82, clearcoatRoughness: 0.18 }),
      navy: new THREE.MeshStandardMaterial({ color: 0x071d3f, roughness: 0.58, metalness: 0.32 }),
      desk: new THREE.MeshStandardMaterial({ color: 0x07111f, roughness: 0.47, metalness: 0.38 }),
      rubber: new THREE.MeshStandardMaterial({ color: 0x060a12, roughness: 0.88, metalness: 0.04 }),
      metal: new THREE.MeshStandardMaterial({ color: 0x607891, roughness: 0.28, metalness: 0.94 }),
      screen: new THREE.MeshStandardMaterial({ color: 0x031126, emissive: 0x031f49, emissiveIntensity: 1.15, roughness: 0.2 }),
      cyan: new THREE.MeshStandardMaterial({ color: 0x73efff, emissive: 0x17cfff, emissiveIntensity: 3.25, roughness: 0.18 }),
      blue: new THREE.MeshStandardMaterial({ color: 0x2a8cff, emissive: 0x075ed8, emissiveIntensity: 2.55, roughness: 0.2 }),
      softBlue: new THREE.MeshStandardMaterial({ color: 0x153f72, emissive: 0x062a68, emissiveIntensity: 0.8, roughness: 0.36 }),
      glass: new THREE.MeshPhysicalMaterial({ color: 0x153b67, transparent: true, opacity: 0.28, roughness: 0.08, metalness: 0.36, clearcoat: 1 }),
    };

    const glowMaterials = [materials.cyan, materials.blue];

    function roundedShape(width, height, radius) {
      const shape = new THREE.Shape();
      const x = -width / 2;
      const y = -height / 2;
      shape.moveTo(x + radius, y);
      shape.lineTo(x + width - radius, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + radius);
      shape.lineTo(x + width, y + height - radius);
      shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      shape.lineTo(x + radius, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - radius);
      shape.lineTo(x, y + radius);
      shape.quadraticCurveTo(x, y, x + radius, y);
      return shape;
    }

    function plate(group, width, height, depth, radius, material, position = [0, 0, 0]) {
      const geometry = new THREE.ExtrudeGeometry(roundedShape(width, height, radius), {
        depth,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: Math.min(0.035, radius * 0.3),
        bevelThickness: 0.035,
        curveSegments: 10,
      });
      geometry.center();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      group.add(mesh);
      return mesh;
    }

    function box(group, size, position, material, rotation = [0, 0, 0]) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      group.add(mesh);
      return mesh;
    }

    function beam(group, start, end, thickness, material) {
      const from = new THREE.Vector3(...start);
      const to = new THREE.Vector3(...end);
      const direction = to.clone().sub(from);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(thickness, direction.length(), thickness), material);
      mesh.position.copy(from).add(to).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      group.add(mesh);
      return mesh;
    }

    function cylinder(group, radius, depth, material, position, rotation = [Math.PI / 2, 0, 0], segments = 32) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, segments), material);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      group.add(mesh);
      return mesh;
    }

    function tube(group, points, radius, material) {
      const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 42, radius, 8, false), material);
      group.add(mesh);
      return mesh;
    }

    function torus(group, radius, thickness, material, position, rotation = [0, 0, 0]) {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 12, 48), material);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      group.add(mesh);
      return mesh;
    }

    function createEditorTexture() {
      const editorCanvas = document.createElement("canvas");
      editorCanvas.width = 1280;
      editorCanvas.height = 720;
      const context = editorCanvas.getContext("2d");

      context.fillStyle = "#041022";
      context.fillRect(0, 0, editorCanvas.width, editorCanvas.height);
      context.fillStyle = "#071a32";
      context.fillRect(0, 0, editorCanvas.width, 52);
      context.fillStyle = "#06162a";
      context.fillRect(0, 52, 58, 668);
      context.fillStyle = "#091d35";
      context.fillRect(58, 52, 246, 668);
      context.fillStyle = "#03101f";
      context.fillRect(304, 548, 976, 172);
      context.fillStyle = "#0b2c4b";
      context.fillRect(304, 52, 976, 42);
      context.fillStyle = "#086ac2";
      context.fillRect(0, 704, 1280, 16);

      context.font = "600 17px ui-monospace, SFMono-Regular, Consolas, monospace";
      context.fillStyle = "#d7edff";
      context.fillText("EXPLORER", 76, 82);
      context.fillStyle = "#8faac4";
      context.font = "15px ui-monospace, SFMono-Regular, Consolas, monospace";
      context.fillText("PORTFOLIO", 76, 116);

      const files = ["src", "  components", "    Computer.jsx", "    Experience.jsx", "    Hero.jsx", "    Navbar.jsx", "  constants", "  assets", "  App.jsx", "  main.jsx"];
      files.forEach((file, index) => {
        context.fillStyle = index === 2 ? "#68ccff" : index < 8 ? "#a9bfd5" : "#77a9d4";
        context.fillText(file, 76, 150 + index * 29);
      });

      const activityY = [92, 145, 198, 251, 304, 357];
      activityY.forEach((y, index) => {
        context.strokeStyle = index === 0 ? "#68ccff" : "#5d7894";
        context.lineWidth = 4;
        context.strokeRect(18, y, 22, 22);
      });

      context.font = "16px ui-monospace, SFMono-Regular, Consolas, monospace";
      context.fillStyle = "#d7edff";
      context.fillText("Computer.jsx", 330, 79);
      context.fillStyle = "#7390ac";
      context.fillText("Loader.jsx", 475, 79);
      context.fillText("index.js", 585, 79);

      const codeLines = [
        ["import", " { Canvas } ", "from", " '@react-three/fiber'"],
        ["import", " { OrbitControls, Preload } ", "from", " '@react-three/drei'"],
        ["", "", "", ""],
        ["const", " Computers = () => {", "", ""],
        ["", "  const computer = useGLTF('./desktop_pc/scene.gltf')", "", ""],
        ["", "  return (", "", ""],
        ["", "    <mesh>", "", ""],
        ["", "      <hemisphereLight intensity={0.15} />", "", ""],
        ["", "      <pointLight intensity={1} />", "", ""],
        ["", "      <primitive object={computer.scene} />", "", ""],
        ["", "    </mesh>", "", ""],
        ["", "  )", "", ""],
        ["", "}", "", ""],
      ];

      context.font = "17px ui-monospace, SFMono-Regular, Consolas, monospace";
      codeLines.forEach((segments, index) => {
        const y = 126 + index * 31;
        context.fillStyle = "#46647e";
        context.fillText(String(index + 1).padStart(2, " "), 322, y);
        let x = 365;
        segments.forEach((segment, segmentIndex) => {
          context.fillStyle = segmentIndex === 0 ? "#5eb8ff" : segmentIndex === 2 ? "#8aa4ff" : segmentIndex === 3 ? "#66e4ff" : "#c7d9e8";
          context.fillText(segment, x, y);
          x += context.measureText(segment).width;
        });
      });

      context.fillStyle = "#8faac4";
      context.font = "600 15px ui-monospace, SFMono-Regular, Consolas, monospace";
      context.fillText("PROBLEMS    OUTPUT    DEBUG CONSOLE    TERMINAL", 330, 579);
      context.fillStyle = "#4ebdff";
      context.fillRect(330, 590, 78, 2);
      context.font = "14px ui-monospace, SFMono-Regular, Consolas, monospace";
      [
        "22:10:42  [vite] hmr update /src/components/Computers.jsx",
        "22:10:43  Three.js scene compiled successfully",
        "22:10:44  Local: http://localhost:5173/",
      ].forEach((line, index) => {
        context.fillStyle = index === 2 ? "#6ee8ff" : "#7897b4";
        context.fillText(line, 330, 624 + index * 27);
      });

      for (let index = 0; index < 34; index += 1) {
        context.fillStyle = index % 5 === 0 ? "#1f70a8" : "#164365";
        const width = 22 + ((index * 17) % 56);
        context.fillRect(1190, 105 + index * 12, width, 4);
      }

      const texture = new THREE.CanvasTexture(editorCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return texture;
    }

    const studio = new THREE.Group();
    studio.rotation.set(-0.035, -0.045, 0);
    studio.position.y = -0.06;
    scene.add(studio);

    // Desk and subtle edge lighting.
    box(studio, [8.45, 0.16, 2.45], [0, -1.18, 0.25], materials.desk);
    box(studio, [8.34, 0.04, 2.34], [0, -1.28, 0.25], materials.black);
    [-3.42, 3.42].forEach((x) => {
      const topBack = [x, -1.34, -0.84];
      const topFront = [x, -1.34, 1.08];
      const bottomBack = [x, -2.84, -0.78];
      const bottomFront = [x, -2.84, 1.02];
      const braceCenter = [x, -2.03, 0.08];

      beam(studio, topBack, topFront, 0.13, materials.frame);
      beam(studio, bottomBack, bottomFront, 0.13, materials.frame);
      beam(studio, topBack, bottomBack, 0.14, materials.frame);
      beam(studio, bottomFront, [x, -1.34, -0.48], 0.16, materials.frame);
      beam(studio, topFront, braceCenter, 0.12, materials.frame);
      box(studio, [0.23, 0.05, 0.28], [x, -2.91, -0.78], materials.rubber);
      box(studio, [0.23, 0.05, 0.28], [x, -2.91, 1.02], materials.rubber);
    });
    box(studio, [3.25, 0.025, 1.58], [-2.35, -1.085, 0.27], materials.rubber);
    box(studio, [3.05, 0.018, 0.025], [-2.35, -1.065, 1.03], materials.blue);

    // Monitor, stand, and an abstract but readable code editor interface.
    const monitor = new THREE.Group();
    plate(monitor, 4.25, 2.38, 0.18, 0.12, materials.black, [0, 0.45, -0.83]);
    plate(monitor, 3.98, 2.1, 0.025, 0.075, materials.screen, [0, 0.45, -0.715]);
    const editorScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(3.88, 2),
      new THREE.MeshBasicMaterial({ map: createEditorTexture(), toneMapped: false }),
    );
    editorScreen.position.set(0, 0.45, -0.675);
    monitor.add(editorScreen);
    box(monitor, [0.24, 0.82, 0.18], [0, -0.76, -0.92], materials.shell);
    plate(monitor, 1.42, 0.16, 0.16, 0.07, materials.shell, [0, -1.09, -0.69]);
    box(monitor, [4.02, 0.025, 0.03], [0, -0.57, -0.65], materials.blue);

    // Editor chrome.
    box(monitor, [3.9, 0.07, 0.018], [0, 1.38, -0.68], materials.softBlue);
    [-1.76, -1.64, -1.52].forEach((x, index) => {
      cylinder(monitor, 0.025, 0.018, index === 2 ? materials.cyan : materials.blue, [x, 1.38, -0.655]);
    });
    box(monitor, [0.52, 1.83, 0.018], [-1.7, 0.43, -0.68], materials.navy);
    for (let index = 0; index < 8; index += 1) {
      box(monitor, [0.25 + (index % 3) * 0.045, 0.018, 0.018], [-1.72, 1.14 - index * 0.19, -0.65], index % 3 === 0 ? materials.cyan : materials.softBlue);
    }
    box(monitor, [0.8, 0.035, 0.018], [-0.93, 1.17, -0.65], materials.blue);
    const lineWidths = [1.85, 1.2, 1.58, 0.92, 1.72, 1.36, 1.95, 1.1, 1.64, 0.78];
    lineWidths.forEach((width, index) => {
      const indent = [0, 0.2, 0.42, 0.42, 0.18][index % 5];
      box(monitor, [width, 0.027, 0.018], [-0.8 + indent + width * 0.08, 0.93 - index * 0.17, -0.648], glowMaterials[index % 2]);
    });
    box(monitor, [0.74, 1.72, 0.018], [1.48, 0.42, -0.68], materials.navy);
    for (let index = 0; index < 9; index += 1) {
      box(monitor, [0.43 + (index % 2) * 0.15, 0.018, 0.018], [1.46, 1.1 - index * 0.17, -0.65], index % 4 === 0 ? materials.cyan : materials.softBlue);
    }
    cylinder(monitor, 0.035, 0.025, materials.cyan, [0, -0.63, -0.64]);

    // Finished rear monitor housing with vents, hub, logo, and routed cables.
    plate(monitor, 2.35, 1.42, 0.06, 0.16, materials.shell, [0, 0.45, -0.965]);
    plate(monitor, 0.62, 0.62, 0.035, 0.1, materials.navy, [0, 0.46, -1.02]);
    torus(monitor, 0.16, 0.025, materials.blue, [0, 0.46, -1.055]);
    for (let index = 0; index < 8; index += 1) {
      box(monitor, [0.16, 0.025, 0.025], [-0.72 + index * 0.205, 0.93, -1.02], index % 3 === 0 ? materials.blue : materials.metal);
    }
    [-0.17, 0, 0.17].forEach((x, index) => {
      box(monitor, [0.09, 0.055, 0.025], [x, -0.18, -1.02], index === 1 ? materials.cyan : materials.metal);
    });
    tube(monitor, [[0.22, -0.17, -1.02], [0.38, -0.52, -1.04], [0.28, -0.9, -0.92], [0.44, -1.08, -0.62]], 0.022, materials.rubber);
    studio.add(monitor);

    // Compact speakers with illuminated concentric drivers.
    [-2.55, 2.5].forEach((x, speakerIndex) => {
      const speaker = new THREE.Group();
      plate(speaker, 0.48, 1.02, 0.42, 0.09, materials.black, [x, -0.55, -0.45]);
      [0, 1].forEach((driverIndex) => {
        const y = -0.31 - driverIndex * 0.43;
        cylinder(speaker, driverIndex ? 0.1 : 0.16, 0.04, materials.blue, [x, y, -0.19]);
        cylinder(speaker, driverIndex ? 0.045 : 0.075, 0.045, materials.cyan, [x, y, -0.16]);
      });
      speaker.rotation.y = speakerIndex === 0 ? 0.05 : -0.05;
      studio.add(speaker);
    });

    // Glass-sided PC tower with animated cooling fans and visible cable runs.
    const tower = new THREE.Group();
    tower.position.set(3.12, -0.05, -0.24);
    plate(tower, 1.4, 2.3, 0.98, 0.08, materials.black, [0, 0, 0]);
    plate(tower, 1.2, 2.06, 0.025, 0.04, materials.glass, [0, 0, 0.525]);
    box(tower, [0.1, 2.08, 0.05], [-0.6, 0, 0.55], materials.metal);
    box(tower, [0.1, 2.08, 0.05], [0.6, 0, 0.55], materials.metal);
    box(tower, [1.1, 0.09, 0.05], [0, 0.99, 0.55], materials.metal);
    box(tower, [1.1, 0.09, 0.05], [0, -0.99, 0.55], materials.metal);

    // Motherboard, CPU block, RAM, graphics card and power-supply shroud.
    plate(tower, 0.72, 1.3, 0.035, 0.035, materials.navy, [-0.18, 0.12, 0.555]);
    plate(tower, 0.3, 0.32, 0.045, 0.04, materials.metal, [-0.2, 0.38, 0.59]);
    plate(tower, 0.2, 0.21, 0.05, 0.04, materials.blue, [-0.2, 0.38, 0.63]);
    [-0.01, 0.08, 0.17].forEach((x, index) => {
      box(tower, [0.045, 0.58, 0.055], [x, 0.21, 0.61], index === 1 ? materials.cyan : materials.blue);
    });
    plate(tower, 0.82, 0.18, 0.065, 0.035, materials.shell, [-0.05, -0.24, 0.61]);
    box(tower, [0.52, 0.035, 0.075], [-0.06, -0.24, 0.66], materials.cyan);
    box(tower, [1.02, 0.34, 0.08], [0, -0.77, 0.58], materials.shell);
    box(tower, [0.34, 0.04, 0.085], [0.27, -0.69, 0.63], materials.blue);
    tube(tower, [[-0.42, 0.66, 0.62], [-0.3, 0.8, 0.65], [0.08, 0.7, 0.66], [0.18, 0.45, 0.66]], 0.025, materials.blue);
    tube(tower, [[-0.36, 0.62, 0.64], [-0.24, 0.73, 0.67], [0.06, 0.64, 0.68]], 0.018, materials.cyan);

    const fanRotors = [];
    [
      { x: 0.28, y: 0.49, radius: 0.3, accent: materials.cyan },
      { x: 0.28, y: -0.31, radius: 0.3, accent: materials.blue },
      { x: -0.35, y: 0.67, radius: 0.17, accent: materials.cyan },
    ].forEach(({ x, y, radius, accent }, fanIndex) => {
      const fan = new THREE.Group();
      fan.position.set(x, y, 0.67);
      torus(fan, radius, radius * 0.17, accent, [0, 0, 0]);
      torus(fan, radius * 0.82, radius * 0.025, materials.cyan, [0, 0, 0.012]);
      cylinder(fan, radius * 0.36, 0.045, materials.cyan, [0, 0, 0.025]);
      for (let blade = 0; blade < 6; blade += 1) {
        const angle = (blade / 6) * Math.PI * 2;
        const bladeMesh = box(
          fan,
          [radius * 0.25, radius * 0.8, 0.025],
          [Math.cos(angle) * radius * 0.55, Math.sin(angle) * radius * 0.55, 0.012],
          materials.softBlue,
          [0, 0, angle],
        );
        bladeMesh.rotation.z = angle + 0.3;
      }
      fanRotors.push(fan);
      tower.add(fan);
    });
    [-0.43, -0.15, 0.13, 0.41].forEach((x) => box(tower, [0.13, 0.035, 0.84], [x, 1.17, 0], materials.softBlue));
    cylinder(tower, 0.055, 0.035, materials.cyan, [0.42, 1.18, 0.18], [Math.PI / 2, 0, 0]);
    box(tower, [0.16, 0.035, 0.06], [0.15, 1.18, 0.22], materials.metal);
    cylinder(tower, 0.035, 0.9, materials.metal, [0.34, 1.57, -0.25], [0, 0, 0]);
    cylinder(tower, 0.025, 0.76, materials.metal, [0.52, 1.51, -0.25], [0, 0, -0.12]);

    // Rear I/O panel, exhaust grille, expansion slots, and power socket.
    plate(tower, 1.12, 1.94, 0.035, 0.035, materials.shell, [0, 0, -0.515]);
    torus(tower, 0.31, 0.035, materials.metal, [0, 0.55, -0.555]);
    torus(tower, 0.24, 0.018, materials.blue, [0, 0.55, -0.575]);
    for (let index = 0; index < 7; index += 1) {
      box(tower, [0.78, 0.035, 0.025], [0, 0.13 - index * 0.085, -0.555], index === 2 ? materials.blue : materials.metal);
    }
    const portPositions = [[-0.32, 0.03], [-0.1, 0.03], [0.12, 0.03], [-0.22, -0.17], [0.04, -0.17]];
    portPositions.forEach(([x, y], index) => {
      box(tower, [index > 2 ? 0.17 : 0.11, 0.08, 0.026], [x, y, -0.575], index === 1 ? materials.cyan : materials.navy);
    });
    plate(tower, 0.42, 0.3, 0.03, 0.025, materials.black, [0.25, -0.72, -0.555]);
    box(tower, [0.2, 0.12, 0.025], [0.25, -0.72, -0.58], materials.metal);
    tube(tower, [[0.25, -0.75, -0.59], [0.42, -0.96, -0.64], [0.2, -1.12, -0.56]], 0.028, materials.rubber);
    studio.add(tower);

    // VR headset and two controllers on the left side of the desk.
    const vr = new THREE.Group();
    vr.position.set(-2.45, -0.78, 0.42);
    vr.rotation.set(-0.08, 0.18, 0.02);
    plate(vr, 1.55, 0.72, 0.46, 0.22, materials.shell, [0, 0, 0]);
    plate(vr, 1.42, 0.58, 0.08, 0.18, materials.softBlue, [0, 0, 0.29]);
    plate(vr, 1.28, 0.14, 0.035, 0.06, materials.blue, [0, 0.16, 0.36]);
    plate(vr, 1.15, 0.16, 0.08, 0.055, materials.metal, [0, 0.3, 0.12]);
    plate(vr, 0.82, 0.08, 0.04, 0.03, materials.cyan, [0, 0.31, 0.18]);
    [-0.48, -0.18, 0.18, 0.48].forEach((x, index) => {
      cylinder(vr, index === 0 || index === 3 ? 0.07 : 0.05, 0.04, index % 2 ? materials.blue : materials.cyan, [x, -0.12, 0.36]);
    });
    tube(vr, [[-0.72, 0.12, -0.12], [-0.92, 0.37, -0.42], [-0.35, 0.58, -0.66], [0.38, 0.54, -0.65], [0.76, 0.17, -0.18]], 0.075, materials.rubber);
    tube(vr, [[-0.67, 0.15, -0.1], [-0.78, 0.36, -0.39], [-0.32, 0.49, -0.58], [0.34, 0.46, -0.58], [0.7, 0.16, -0.14]], 0.018, materials.blue);
    [-1, 1].forEach((side) => {
      cylinder(vr, 0.12, 0.08, materials.metal, [side * 0.78, 0.04, 0], [0, 0, Math.PI / 2]);
      cylinder(vr, 0.06, 0.09, materials.cyan, [side * 0.8, 0.04, 0], [0, 0, Math.PI / 2]);
    });
    [-0.42, -0.21, 0, 0.21, 0.42].forEach((x) => box(vr, [0.1, 0.025, 0.04], [x, -0.3, 0.35], materials.metal));
    box(vr, [0.12, 0.42, 0.14], [0, -0.38, -0.17], materials.metal);
    plate(vr, 0.86, 0.1, 0.42, 0.04, materials.black, [0, -0.45, -0.06]);
    studio.add(vr);

    function createController(accentMaterial) {
      const controller = new THREE.Group();
      const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.48, 6, 14), materials.shell);
      handle.rotation.z = -0.62;
      handle.position.set(0.08, -0.28, 0);
      controller.add(handle);
      torus(controller, 0.29, 0.042, accentMaterial, [0, 0.12, 0], [Math.PI / 2.35, 0.12, 0]);
      cylinder(controller, 0.065, 0.045, materials.cyan, [-0.02, -0.1, 0.08]);
      return controller;
    }

    const leftController = createController(materials.cyan);
    leftController.position.set(-3.47, -0.82, 0.69);
    leftController.rotation.set(0.05, 0.12, -0.24);
    studio.add(leftController);

    const rightController = createController(materials.blue);
    rightController.position.set(-1.52, -0.82, 0.76);
    rightController.rotation.set(0.02, -0.18, 0.35);
    studio.add(rightController);

    // Low-profile keyboard with blue backlight.
    const keyboard = new THREE.Group();
    keyboard.position.set(0.25, -1.01, 0.72);
    keyboard.rotation.y = -0.02;
    box(keyboard, [2.6, 0.08, 0.75], [0, 0, 0], materials.black);
    const keyRows = 5;
    const keyColumns = 15;
    for (let row = 0; row < keyRows; row += 1) {
      for (let column = 0; column < keyColumns; column += 1) {
        const keyMaterial = (row + column) % 9 === 0 ? materials.cyan : (row + column) % 5 === 0 ? materials.blue : materials.softBlue;
        box(keyboard, [0.13, 0.035, 0.105], [-1.05 + column * 0.15, 0.075, -0.25 + row * 0.125], keyMaterial);
      }
    }
    studio.add(keyboard);

    const mouse = new THREE.Group();
    const mouseShell = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.36, 7, 18), materials.shell);
    mouseShell.rotation.x = Math.PI / 2;
    mouse.add(mouseShell);
    box(mouse, [0.025, 0.04, 0.22], [0, 0.12, -0.02], materials.cyan);
    mouse.position.set(1.92, -0.94, 0.8);
    mouse.rotation.y = -0.12;
    studio.add(mouse);

    // Cable routing keeps the composition grounded and adds mechanical detail.
    tube(studio, [[1.95, -1.07, 0.78], [2.2, -1.06, 0.52], [2.44, -1.05, 0.03], [2.76, -0.98, -0.28]], 0.018, materials.blue);
    tube(studio, [[-1.66, -1.06, 0.88], [-1.2, -1.04, 1.24], [-0.2, -1.03, 1.35], [0.72, -1.04, 1.2]], 0.015, materials.metal);

    const pointer = { x: 0, y: 0 };
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotationX = 0;
    let dragRotationY = 0;
    let userRotationX = 0;
    let userRotationY = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    canvas.addEventListener("pointerdown", (event) => {
      dragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragRotationX = userRotationX;
      dragRotationY = userRotationY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (dragging) {
        userRotationY = dragRotationY + (event.clientX - dragStartX) * 0.007;
        userRotationX = THREE.MathUtils.clamp(dragRotationX + (event.clientY - dragStartY) * 0.0045, -0.92, 0.92);
      }
    });

    const endDrag = () => { dragging = false; };
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("dblclick", () => {
      userRotationX = 0;
      userRotationY = 0;
    });
    canvas.addEventListener("pointerleave", () => {
      pointer.x = 0;
      pointer.y = 0;
    });

    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const mobile = width < 520;
      const tablet = width >= 520 && width < 760;
      const scale = mobile ? 0.66 : tablet ? 0.76 : 0.86;
      studio.scale.setScalar(scale);
      camera.position.z = mobile ? 13.8 : tablet ? 13.5 : 13.2;
      camera.position.y = mobile ? 0.35 : 0.65;
      camera.lookAt(0, -0.08, 0);
    }

    new ResizeObserver(resize).observe(canvas);
    resize();

    const clock = new THREE.Clock();
    function animate() {
      const time = clock.getElapsedTime();
      const motionOffset = reducedMotion.matches ? 0 : Math.sin(time * 0.24) * 0.018;
      const pointerOffsetX = dragging || reducedMotion.matches ? 0 : pointer.y * 0.018;
      const pointerOffsetY = dragging || reducedMotion.matches ? 0 : pointer.x * 0.025;
      const targetY = -0.045 + userRotationY + pointerOffsetY + motionOffset;
      const targetX = THREE.MathUtils.clamp(-0.035 + userRotationX - pointerOffsetX, -0.98, 0.98);
      const smoothing = reducedMotion.matches ? 1 : 0.065;
      studio.rotation.y += (targetY - studio.rotation.y) * smoothing;
      studio.rotation.x += (targetX - studio.rotation.x) * smoothing;

      if (!reducedMotion.matches) {
        fanRotors.forEach((fan, index) => {
          fan.rotation.z = time * (index ? -1.45 : 1.25);
        });
        materials.cyan.emissiveIntensity = 3.05 + Math.sin(time * 1.4) * 0.3;
        materials.blue.emissiveIntensity = 2.35 + Math.cos(time * 1.15) * 0.22;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  } catch (error) {
    console.warn("3D studio could not be initialized.", error);
    canvas.hidden = true;
    if (fallback) fallback.hidden = false;
  }
}
