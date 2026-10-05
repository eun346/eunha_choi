import { createMechanicalLibrary, ANGULAR, FIELD_STYLE } from './mechanical-parts.js?v=20261004-mechanical';
// Original Gravity choreography, with mechanical meshes and spherical collision proxies.
import { control, mousePos, selectedPalette, reducedMotion } from './hero3d.js?v=20261004-light-dark';

const container = document.querySelector('.hero-atmosphere');
const fallback = document.querySelector('[data-model-fallback]');
let ready = false, completed = false;
let loader;
if (!reducedMotion) {
  document.body.classList.add('field-loading');
  loader = document.createElement('div');
  loader.className = 'field-loader';
  loader.setAttribute('role', 'progressbar');
  loader.setAttribute('aria-label', 'Calibrating gravity field');
  loader.setAttribute('aria-valuemin', '0'); loader.setAttribute('aria-valuemax', '100'); loader.setAttribute('aria-valuenow', '0');
  loader.innerHTML = '<div class="field-loader-status">Calibrating gravity field</div><div class="field-loader-track"><div class="field-loader-fill"></div></div><div class="field-loader-counter">000%</div>';
  document.body.append(loader);
}
function reveal() {
  if (completed) return;
  completed = true; control.started = true;
  document.body.classList.remove('field-loading'); document.body.classList.add('field-ready');
  loader?.remove();
}
const safetyTimer = setTimeout(() => { ready = true; reveal(); }, 10000);
const onReady = () => { ready = true; if (reducedMotion) reveal(); };
function reportFailure(error) {
  console.warn('The interactive field is unavailable; portfolio content remains accessible.', error);
  container.querySelector('canvas').hidden = true;
  if (fallback) fallback.hidden = false;
  ready = true; clearTimeout(safetyTimer); reveal();
}
if (loader) {
  let value = 0, last = performance.now(), leaving = false;
  function calibrate(now) {
    if (completed) return;
    const dt = Math.min((now - last) / 1000, .05); last = now;
    value += ((ready ? 100 : 92) - value) * (ready ? 6 : 1.7) * dt;
    if (ready && value >= 99.4) value = 100;
    loader.querySelector('.field-loader-fill').style.width = value + '%';
    loader.querySelector('.field-loader-counter').textContent = String(Math.floor(value)).padStart(3, '0') + '%';
    loader.setAttribute('aria-valuenow', String(Math.floor(value)));
    if (ready && value >= 99.9 && !leaving) {
      leaving = true; clearTimeout(safetyTimer);
      loader.querySelector('.field-loader-status').textContent = 'Entering orbit';
      setTimeout(() => loader.classList.add('leaving'), 140);
      setTimeout(reveal, 660);
    } else requestAnimationFrame(calibrate);
  }
  requestAnimationFrame(calibrate);
}
try {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  function createField(ballColor) {
    const canvas = container.querySelector('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0, 11);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = false; // No receiving floor: avoid unused multi-mesh shadow passes.
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemiLight = new THREE.HemisphereLight(0xffffff, new THREE.Color(ballColor), 1.6);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
keyLight.position.set(-6, 10, 8);
keyLight.castShadow = false;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 30;
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 8;
keyLight.shadow.camera.bottom = -8;
keyLight.shadow.bias = -0.0003;
keyLight.shadow.radius = 12.0;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.25);
rimLight.position.set(8, 7, -8);
scene.add(rimLight);

const frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
frontLight.position.set(0, 0, 11);
scene.add(frontLight);

const sideBounceLight = new THREE.DirectionalLight(0xffffff, 0.3);
sideBounceLight.position.set(-9, -2, 4);
scene.add(sideBounceLight);


let viewportWidth = 10;
let viewportHeight = 6;
const updateFrustumBounds = () => {
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  viewportHeight = 2 * Math.tan(fovRad / 2) * camera.position.z;
  viewportWidth = viewportHeight * (container.clientWidth / container.clientHeight);
};
updateFrustumBounds();

const isMobile = window.innerWidth < 768;
const ballCount = isMobile ? 54 : 96;


const getDynamicColors = (baseColor) => {
  const hex = baseColor.toLowerCase();
  if (hex === '#e1fc03') {
    return { pastel: new THREE.Color('#FBFFE2'), light: new THREE.Color('#EFFE69'),
      medium: new THREE.Color('#E1FC03'), deep: new THREE.Color('#B1E200'), glass: new THREE.Color('#DCFF32') };
  } else if (hex === '#ffc5c2' || hex === '#ffa19e') {
    return { pastel: new THREE.Color('#FFF5F4'), light: new THREE.Color('#FFECEB'),
      medium: new THREE.Color('#FFA6B3'), deep: new THREE.Color('#FF4D6D'), glass: new THREE.Color('#FFA6B3') };
  } else if (hex === '#96e5ff') {
    return { pastel: new THREE.Color('#F0F9FF'), light: new THREE.Color('#C9F1FF'),
      medium: new THREE.Color('#96E5FF'), deep: new THREE.Color('#2BA5FF'), glass: new THREE.Color('#98E4FF') };
  } else if (hex === '#2f69ff') {
    return { pastel: new THREE.Color('#ECEFFF'), light: new THREE.Color('#A8C1FF'),
      medium: new THREE.Color('#2F69FF'), deep: new THREE.Color('#0A33BF'), glass: new THREE.Color('#4D80FF') };
  } else if (hex === '#141414' || hex === '#000000') {
    return { pastel: new THREE.Color('#D8D8D8'), light: new THREE.Color('#555555'),
      medium: new THREE.Color('#242424'), deep: new THREE.Color('#0A0A0A'), glass: new THREE.Color('#1F1F1F') };
  }
  const c = new THREE.Color(baseColor);
  return { pastel: c.clone().offsetHSL(0, -0.15, 0.25), light: c.clone().offsetHSL(0, -0.05, 0.12),
    medium: c.clone(), deep: c.clone().offsetHSL(0.01, 0.1, -0.12), glass: c.clone() };
};

const palette = getDynamicColors(ballColor);

// Scroll-driven palettes: hero (base) → volt-lime (drop) → rose-pink (heart).
const palHero = palette;
const palLime = getDynamicColors('#E1FC03');
const palPink = getDynamicColors('#FFC5C2');
const ROLES = ['pastel', 'light', 'medium', 'deep', 'glass'];
const curPal = { pastel: new THREE.Color(), light: new THREE.Color(), medium: new THREE.Color(),
  deep: new THREE.Color(), glass: new THREE.Color() };


const library = createMechanicalLibrary(THREE, { mobile: isMobile, count: ballCount, palette });
const bodies = [];
for (let i = 0; i < ballCount; i++) {
  const random = Math.random();
  const radius = random < 0.3 ? 0.27 + Math.random() * 0.12
    : random < 0.8 ? 0.42 + Math.random() * 0.18 : 0.66 + Math.random() * 0.21;
  const body = library.createBody(i, radius);
  scene.add(body.meshGroup);
  bodies.push(body);
}

// Fade only the WebGL layer behind existing copy; never move or restyle the text.
const protectedText = [...document.querySelectorAll('.hero-copy, .section-heading h2, .section-heading > p, .overview-copy, .section-kicker')];
const projectedCenter = new THREE.Vector3();
let textRects = [], textRectsDirty = true;
const invalidateText = () => { textRectsDirty = true; };
window.addEventListener('scroll', invalidateText, { passive: true });
const refreshTextRects = () => {
  textRects = protectedText.map(el => el.getBoundingClientRect()).filter(rect => rect.bottom > 0 && rect.top < innerHeight);
  textRectsDirty = false;
};
const readableOpacity = (body, opacity) => {
  if (opacity <= 0) return 0;
  projectedCenter.copy(body.position).project(camera);
  const x = (projectedCenter.x + 1) * container.clientWidth / 2;
  const y = (1 - projectedCenter.y) * container.clientHeight / 2;
  const radius = body.visualScale / Math.max(0.5, camera.position.z - body.position.z) * container.clientHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  let visibility = 1;
  for (const rect of textRects) {
    const dx = Math.max(rect.left - x, 0, x - rect.right);
    const dy = Math.max(rect.top - y, 0, y - rect.bottom);
    const t = Math.min(1, Math.hypot(dx, dy) / Math.max(1, radius));
    visibility = Math.min(visibility, FIELD_STYLE.textOpacity + (1 - FIELD_STYLE.textOpacity) * t * t * (3 - 2 * t));
  }
  return opacity * visibility;
};

const meanRadius = bodies.reduce((sum, b) => sum + b.radius, 0) / bodies.length;
let shapeScale = 1;


const inHeart = (x, y) => {
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
};
const assignHeartTargets = () => {
  const S = Math.min(viewportWidth * 0.30, viewportHeight * 0.27);
  const baseCY = -viewportHeight * 0.03;
  shapeScale = Math.max(0.3, Math.min(1, (S * 0.45 / 2.3) / meanRadius));
  const points = [];
  const outlineCount = Math.round(bodies.length * 0.4);
  for (let i = 0; i < bodies.length; i++) {
    let x = 0, y = 0;
    if (i < outlineCount) {
      const angle = i / outlineCount * Math.PI * 2;
      let low = 0, high = 2;
      for (let step = 0; step < 18; step++) {
        const mid = (low + high) / 2;
        if (inHeart(Math.cos(angle) * mid, Math.sin(angle) * mid)) low = mid;
        else high = mid;
      }
      x = Math.cos(angle) * low * 0.95;
      y = Math.sin(angle) * low * 0.95;
    } else {
      // Evenly spaced interior pieces keep the original heart silhouette legible.
      let bestDistance = -1;
      for (let candidate = 0; candidate < 24; candidate++) {
        let cx, cy;
        do { cx = Math.random() * 2.5 - 1.25; cy = Math.random() * 2.55 - 1.4; }
        while (!inHeart(cx, cy));
        const distance = Math.min(...points.map(p => (cx - p.x) ** 2 + (cy - p.y) ** 2));
        if (distance > bestDistance) { bestDistance = distance; x = cx; y = cy; }
      }
    }
    points.push({ x, y });
    bodies[i].shapeTarget.set(x * S, (y + 0.12) * S + baseCY, (Math.random() - 0.5) * 0.35);
  }
};
assignHeartTargets();


const scatterFar = (withInwardVelocity) => {
  const R = Math.max(viewportWidth, viewportHeight) * 1.5;
  for (const b of bodies) {
    const a = Math.random() * Math.PI * 2;
    const px = Math.cos(a) * R * 1.25;
    const py = Math.sin(a) * R * 0.85;
    const pz = (Math.random() - 0.5) * 4;
    b.position.set(px, py, pz);
    b.meshGroup.position.copy(b.position);
    if (withInwardVelocity) {
      b.velocity.set(-px, -py, -pz).normalize().multiplyScalar(0.08 + Math.random() * 0.05);
    } else {
      b.velocity.set(0, 0, 0);
    }
  }
};
scatterFar(false); // parked off-screen until the loader reveals


const params = {
  gravity: 0, rebound: -0.3,
  mouseRepelForce: 0.05, mouseRepelRadius: 4.4,
  damping: 0.91, centerAttractForce: 0.0035, bounciness: 0.02,
};

const mouseProjVec = new THREE.Vector3();
const mouseWorld3D = new THREE.Vector3();
const updateMouse3D = () => {
  if (!mousePos) return;
  mouseProjVec.set(mousePos.x, mousePos.y, 0.5);
  mouseProjVec.unproject(camera);
  const dir = mouseProjVec.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  mouseWorld3D.copy(camera.position).add(dir.multiplyScalar(distance));
};


const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);


let animationFrameId = 0;
const clock = new THREE.Clock();
let localStarted = false;
let entranceStart = 0;
let reportedReady = false;

const diffVec = new THREE.Vector3();
const collideDiff = new THREE.Vector3();
const relVel = new THREE.Vector3();
const prevMouseWorld = new THREE.Vector3();
let mouseSpeed = 0;

const simulateAndRender = () => {
  if (!reducedMotion) animationFrameId = requestAnimationFrame(simulateAndRender);
  if (document.hidden) return;

  const time = clock.getElapsedTime();
  clock.getDelta();
  if (textRectsDirty) refreshTextRects();
  updateMouse3D();
  if (reducedMotion) mouseWorld3D.set(99, 99, 0);
  if (reducedMotion) {
    const progress = control.progress;
    const shape = smoothstep(1.4, 2.05, progress) * (1 - smoothstep(2.55, 3, progress));
    const drop = smoothstep(.4, .95, progress) * (1 - smoothstep(1.25, 1.75, progress));
    const fly = smoothstep(2.7, 3.45, progress);
    const lime = smoothstep(.55, 1.05, progress), pink = smoothstep(1.4, 1.95, progress);
    for (const role of ROLES) curPal[role].copy(palHero[role]).lerp(palLime[role], lime).lerp(palPink[role], pink);
    bodies.forEach((b, i) => {
      const a = i * 2.3999632297, r = Math.sqrt((i + .5) / bodies.length);
      const x = Math.cos(a) * viewportWidth * .34 * r;
      const y = Math.sin(a) * viewportHeight * .23 * r + viewportHeight * FIELD_STYLE.heroLift;
      const floor = -viewportHeight / 2 + b.radius + (i % 3) * b.radius * .7;
      b.position.set(lerp(x, b.shapeTarget.x, shape), lerp(lerp(y, floor, drop), b.shapeTarget.y, shape), lerp(Math.sin(i * 1.7) * .8, b.shapeTarget.z, shape));
      b.meshGroup.position.copy(b.position);
      b.visualScale = b.radius * (1 - (1 - shapeScale * FIELD_STYLE.shapeSize) * shape);
      b.visual.scale.setScalar(b.visualScale);
      b.meshGroup.quaternion.slerp(b.shapeOrientation, shape);
      library.updateMaterials(b, curPal, readableOpacity(b, 1 - fly));
    });
    renderer.render(scene, camera);
    if (!reportedReady) { reportedReady = true; onReady(); }
    return;
  }

  const ctrl = control;

  if (ctrl?.started && !localStarted) {
    localStarted = true;
    entranceStart = time;
    scatterFar(true);
  }

  if (!localStarted) {
    renderer.render(scene, camera);
    if (!reportedReady) { reportedReady = true; onReady(); }
    return;
  }

  const progress = ctrl?.progress ?? 0;

  // --- mode blend factors ---
  const heroF = 1 - smoothstep(0.30, 0.80, progress);
  const dropRaw = smoothstep(0.40, 0.95, progress);
  const flyF = smoothstep(2.7, 3.45, progress);
  const shapeF = smoothstep(1.40, 2.05, progress) * (1 - smoothstep(2.55, 3.0, progress));
  const dropF = dropRaw * (1 - smoothstep(1.25, 1.75, progress));

  // --- scroll-driven palette morph: hero → volt-lime → rose-pink ---
  const bLime = smoothstep(0.55, 1.05, progress);
  const bPink = smoothstep(1.40, 1.95, progress);
  for (const role of ROLES) {
    curPal[role].copy(palHero[role]).lerp(palLime[role], bLime).lerp(palPink[role], bPink);
  }
  hemiLight.groundColor.copy(curPal.medium);

  const entranceT = easeOutCubic(clamp01((time - entranceStart) / 2.2));
  const attractionBoost = lerp(7.5, 1, entranceT);

  const isMouseInteracting = !!mousePos &&
    (Math.abs(mousePos.x) < 0.99 || Math.abs(mousePos.y) < 0.99);

  mouseSpeed = isMouseInteracting ? mouseWorld3D.distanceTo(prevMouseWorld) : 0;
  if (mouseSpeed > 3) mouseSpeed = 3;
  prevMouseWorld.copy(mouseWorld3D);

  let damping = 0.91;
  damping = lerp(damping, 0.992, dropF);
  damping = lerp(damping, 0.90, shapeF);
  damping = lerp(damping, 0.985, flyF);

  const camZ = camera.position.z;
  const clusterActive = Math.max(heroF, entranceT < 1 ? 1 : 0);

  // 1. ACCELERATIONS
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    if (flyF > .99 && b.position.z > camZ + 5) { b.velocity.set(0, 0, 0); continue; }

    if (heroF > 0.01) {
      b.velocity.x += Math.sin(time * 0.4 + b.id * 1.5) * 0.0004 * b.radius * heroF;
      b.velocity.y += Math.cos(time * 0.5 + b.id * 1.2) * 0.0004 * b.radius * heroF;
      b.velocity.z += Math.sin(time * 0.35 + b.id) * 0.0001 * heroF;
    }

    const clusterStrength = params.centerAttractForce * attractionBoost * clusterActive;
    if (clusterStrength > 0.00001) {
      b.velocity.x += (0 - b.position.x) * clusterStrength * 0.38;
      b.velocity.y += (viewportHeight * FIELD_STYLE.heroLift * heroF - b.position.y) * clusterStrength * 1.85;
      b.velocity.z += (0 - b.position.z) * clusterStrength * 1.8;
    }

    if (dropF > 0.001) {
      b.velocity.y -= 0.011 * dropF;
    }

    if (shapeF > 0.001) {
      const k = 0.06 * shapeF;
      b.velocity.x += (b.shapeTarget.x - b.position.x) * k;
      b.velocity.y += (b.shapeTarget.y - b.position.y) * k;
      b.velocity.z += (b.shapeTarget.z - b.position.z) * k;
    }

    if (flyF > 0.001) {
      const stagger = (b.id * 0.6180339887) % 1;
      const local = smoothstep(stagger * 0.55, stagger * 0.55 + 0.45, flyF);
      b.velocity.z += 0.05 * local;
      b.velocity.x += b.position.x * 0.006 * local;
      b.velocity.y += b.position.y * 0.006 * local;
    }

    if (mousePos && isMouseInteracting) {
      diffVec.subVectors(b.position, mouseWorld3D);
      const rawDist = diffVec.length();
      const down = mousePos.isDown;
      const activeRepelRadius = down ? params.mouseRepelRadius * 1.4 : params.mouseRepelRadius;
      const activeRepelForce = down ? params.mouseRepelForce * 1.7 : params.mouseRepelForce;
      if (rawDist < activeRepelRadius && rawDist > 0.0001) {
        const ratio = rawDist / activeRepelRadius;
        const smoothFactor = 1.0 - (ratio * ratio * (3.0 - 2.0 * ratio));
        const speedBoost = 1 + mouseSpeed * 3.2;
        const push = smoothFactor * activeRepelForce * speedBoost;
        diffVec.normalize();
        diffVec.z *= 0.12;
        diffVec.normalize();
        b.velocity.addScaledVector(diffVec, push);
        const twist = push * ANGULAR.pointerImpulse * b.spinResponse;
        b.angularVelocity.x += diffVec.y * twist;
        b.angularVelocity.y -= diffVec.x * twist * 0.5;
        b.angularVelocity.z += (diffVec.x - diffVec.y) * twist;
      }
    }

    b.velocity.multiplyScalar(damping);
    b.position.addScaledVector(b.velocity, 1);

    const opacity = flyF > 0.001
      ? 1 - smoothstep(camZ - 2.6, camZ - 0.3, b.position.z) : 1;
    library.updateMaterials(b, curPal, readableOpacity(b, opacity));

    const targetVis = b.radius * (1 - (1 - shapeScale * FIELD_STYLE.shapeSize) * shapeF);
    b.visualScale += (targetVis - b.visualScale) * 0.12;
    b.visual.scale.setScalar(b.visualScale);
  }

  // 2. PAIRWISE COLLISIONS (nearly disabled in shape mode so bodies snap onto the silhouette)
  const collideScale = 0.28 * (1 - 0.93 * shapeF) * (1 - flyF);
  const subSteps = 4;
  for (let step = 0; step < subSteps; step++) {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const b1 = bodies[i];
        const b2 = bodies[j];
        collideDiff.subVectors(b2.position, b1.position);
        const dist = collideDiff.length();
        const minDist = b1.visualScale + b2.visualScale;
        if (dist < minDist && dist > 0.001) {
          const overlap = minDist - dist;
          collideDiff.multiplyScalar(1 / dist);
          const totalMass = b1.mass + b2.mass;
          const ratio1 = b2.mass / totalMass;
          const ratio2 = b1.mass / totalMass;
          b1.position.addScaledVector(collideDiff, -overlap * ratio1 * collideScale);
          b2.position.addScaledVector(collideDiff, overlap * ratio2 * collideScale);

          relVel.subVectors(b2.velocity, b1.velocity);
          const velAlongNormal = relVel.dot(collideDiff);
          if (velAlongNormal < -0.0001) {
            const impulse = -(1 + params.bounciness) * velAlongNormal / (1 / b1.mass + 1 / b2.mass);
            b1.velocity.addScaledVector(collideDiff, -impulse / b1.mass);
            b2.velocity.addScaledVector(collideDiff, impulse / b2.mass);
            const twist = Math.min(0.08, -velAlongNormal) * ANGULAR.collisionImpulse;
            b1.angularVelocity.x += collideDiff.y * twist * b1.spinResponse;
            b1.angularVelocity.z -= collideDiff.x * twist * b1.spinResponse;
            b2.angularVelocity.x -= collideDiff.y * twist * b2.spinResponse;
            b2.angularVelocity.z += collideDiff.x * twist * b2.spinResponse;
          }
        }
      }
    }
  }

  // 3. VIEWPORT WALLS + BOUNCY FLOOR
  const borderPad = 0.2;
  const xBound = viewportWidth / 2 - borderPad;
  const topY = viewportHeight / 2 - 0.05;
  const floorY = -viewportHeight / 2 + 0.05;
  const zBound = 2.0;
  const restitution = 0.30 + 0.35 * dropF;

  const contain = flyF < 0.5;
  const zContain = flyF < 0.02;

  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    const r = b.visualScale;

    if (contain) {
      if (b.position.x < -xBound - r) { b.position.x = -xBound - r; b.velocity.x *= params.rebound; }
      else if (b.position.x > xBound + r) { b.position.x = xBound + r; b.velocity.x *= params.rebound; }

      if (b.position.y - r < floorY) {
        b.position.y = floorY + r;
        if (b.velocity.y < 0) {
          const impact = Math.min(0.2, -b.velocity.y) * ANGULAR.floorImpulse * b.spinResponse;
          b.angularVelocity.x += b.velocity.z * ANGULAR.rolling + impact * Math.sin(b.id);
          b.angularVelocity.z -= b.velocity.x * ANGULAR.rolling + impact * Math.cos(b.id);
          b.velocity.y = -b.velocity.y * restitution;
        }
        if (dropF > 0.3) b.angularVelocity.multiplyScalar(ANGULAR.floorDamping);
        if (dropF > 0.3) { b.velocity.x *= 0.86; b.velocity.z *= 0.86; }
      }
      if (b.position.y + r > topY) {
        b.position.y = topY - r;
        if (b.velocity.y > 0) b.velocity.y *= params.rebound;
      }
    }

    if (zContain) {
      if (b.position.z < -zBound) { b.position.z = -zBound; b.velocity.z *= params.rebound; }
      else if (b.position.z > zBound) { b.position.z = zBound; b.velocity.z *= params.rebound; }
    }

    b.angularVelocity.multiplyScalar(lerp(ANGULAR.damping, ANGULAR.shapeDamping, shapeF));
    if (heroF > 0.01) b.angularVelocity.lerp(b.idleSpin, 0.025 * heroF);
    b.angularVelocity.clampScalar(-ANGULAR.maxSpeed, ANGULAR.maxSpeed);
    b.meshGroup.rotation.x += b.angularVelocity.x;
    b.meshGroup.rotation.y += b.angularVelocity.y;
    b.meshGroup.rotation.z += b.angularVelocity.z;
    if (shapeF > 0.01) b.meshGroup.quaternion.slerp(b.shapeOrientation, ANGULAR.shapeAlignment * shapeF);
    b.meshGroup.position.copy(b.position);
  }

  renderer.render(scene, camera);
  if (!reportedReady) { reportedReady = true; onReady(); }
};

simulateAndRender();


const handleResize = () => {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  updateFrustumBounds();
  invalidateText();
  assignHeartTargets();
  if (reducedMotion) simulateAndRender();
};
const resizeObserver = new ResizeObserver(handleResize);
resizeObserver.observe(container);


    const onReducedScroll = () => {
      if (reducedMotion) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(simulateAndRender);
      }
    };
    window.addEventListener('scroll', onReducedScroll, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrameId); resizeObserver.disconnect();
      window.removeEventListener('scroll', onReducedScroll);
      window.removeEventListener('scroll', invalidateText);
      library.dispose();
      keyLight.shadow.map?.dispose(); renderer.dispose(); renderer.forceContextLoss(); scene.clear();
      const replacement = document.createElement('canvas'); replacement.id = 'hero-model'; canvas.replaceWith(replacement);
    };
  }
  const dispose = createField(selectedPalette.color);
  window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); });
} catch (error) { reportFailure(error); }
