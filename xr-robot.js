import { createRobot } from './xr-robot-model.js?v=20261116';

const hero = document.querySelector('#home');
const host = hero?.querySelector('[data-hero-robot]');
if (host) {
  try {
    const [THREE, { RoundedBoxGeometry }] = await Promise.all([
      import('three'),
      import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js'),
    ]);
    mountRobot(THREE, RoundedBoxGeometry);
  } catch (error) {
    // The page never waits for WebGL or its CDN before exposing text and links.
    host.dataset.state = 'unavailable';
    console.warn('The hero robot is unavailable; portfolio content remains accessible.', error);
  }
}

function mountRobot(THREE, RoundedBoxGeometry) {
  const canvas = host.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 50);
  scene.add(new THREE.HemisphereLight('#e9f4ff', '#67758e', 2.6));
  const key = new THREE.DirectionalLight('#fff7eb', 3.2);
  key.position.set(-3, 6, 7); scene.add(key);
  const rim = new THREE.DirectionalLight('#8fcaff', 2.8);
  rim.position.set(4, 4, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight('#ffffff', .8);
  fill.position.set(3, 1, 5); scene.add(fill);
  const robot = createRobot(THREE, RoundedBoxGeometry);
  scene.add(robot.root);
  robot.root.rotation.y = -.18;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const events = new AbortController();
  const listen = (target, name, fn, options = {}) => target.addEventListener(name, fn, { ...options, signal: events.signal });
  let frame = 0, last = 0, elapsed = 0, active = false, disposed = false, lost = false;
  let targetX = 0, targetY = 0, gazeX = 0, gazeY = 0;
  let hovering = false, tilt = 0, lastClick = -Infinity;
  let nextBlink = 2.5 + Math.random() * 3, blinkStart = -1;
  function schedule() { if (!frame && !disposed && !lost) frame = requestAnimationFrame(tick); }
  function measure() {
    const { width, height } = host.getBoundingClientRect();
    // CSS transforms during scroll must not alter the camera's framing.
    const w = host.clientWidth || width, h = host.clientHeight || height;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    camera.aspect = w / h;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const distance = Math.max(4.8 / (2 * Math.tan(halfFov)), 3.25 / (2 * Math.tan(halfFov) * camera.aspect));
    camera.position.set(.5, 2.65, distance);
    camera.lookAt(0, 2.05, 0); camera.updateProjectionMatrix();
    updateScroll();
  }
  function updateScroll() {
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    const t = Math.max(0, Math.min(1, (progress - .2) / .5));
    const fade = t * t * (3 - 2 * t);
    host.style.opacity = String(1 - fade);
    host.style.transform = motion.matches ? 'none' : `translateY(${-24 * fade}px) scale(${1 - .04 * fade})`;
    const visual = host.getBoundingClientRect();
    active = fade < 1 && visual.bottom > 0 && visual.top < innerHeight && !document.hidden;
    host.dataset.active = String(active);
    if (!active) { neutral(); gazeX = gazeY = tilt = 0; robot.head.rotation.set(0, 0, 0); cancelAnimationFrame(frame); frame = 0; last = 0; }
    else schedule();
  }
  function tick(now) {
    frame = 0;
    if (!active || disposed || lost) return;
    const dt = last ? Math.min((now - last) / 1000, .05) : 0;
    last = now;
    if (!motion.matches) elapsed += dt;
    const damping = 1 - Math.exp(-6 * dt);
    gazeX += (targetX - gazeX) * damping; gazeY += (targetY - gazeY) * damping;
    const quiet = motion.matches;
    robot.root.position.y = quiet ? 0 : Math.sin(elapsed * 1.3) * .02;
    robot.root.rotation.y = -.18;
    robot.head.rotation.y = quiet ? 0 : THREE.MathUtils.clamp(gazeX * .26 + Math.sin(elapsed * .6) * .025, -Math.PI / 12, Math.PI / 12);
    robot.head.rotation.x = quiet ? 0 : THREE.MathUtils.clamp(gazeY * .1745, -.1745, .1745);
    tilt += ((hovering ? .045 : 0) - tilt) * damping;
    robot.head.rotation.z = quiet ? 0 : Math.sin(elapsed * .7) * .018 + tilt;
    robot.gaze.position.x = quiet ? 0 : gazeX * .045;
    robot.gaze.position.y = .73 + (quiet ? 0 : -gazeY * .025);
    robot.arms.forEach(({ shoulder, elbow, side }) => {
      shoulder.rotation.z = side * (.13 + (quiet ? 0 : Math.sin(elapsed * .9) * .015));
      elbow.rotation.x = -.16 + (quiet ? 0 : Math.sin(elapsed * .8 + side) * .025);
    });
    if (!quiet && elapsed >= nextBlink && blinkStart < 0) blinkStart = elapsed;
    const blink = blinkStart < 0 ? 0 : (elapsed - blinkStart) / .18;
    const opening = quiet || blinkStart < 0 ? 1 : Math.max(.07, 1 - Math.sin(Math.min(1, blink) * Math.PI));
    robot.eyes.forEach(eye => eye.scale.y = opening);
    if (blink >= 1) { blinkStart = -1; nextBlink = elapsed + 2.5 + Math.random() * 3; }
    renderer.render(scene, camera);
    host.dataset.state = 'ready';
    if (!quiet) schedule(); else last = 0;
  }
  listen(hero, 'pointermove', event => {
    if (!active || motion.matches || !pointer.matches || event.pointerType === 'touch') return;
    const r = hero.getBoundingClientRect();
    targetX = THREE.MathUtils.clamp((event.clientX - r.left) / r.width * 2 - 1, -1, 1);
    targetY = THREE.MathUtils.clamp((event.clientY - r.top) / r.height * 2 - 1, -1, 1);
  }, { passive: true });
  const neutral = () => { targetX = targetY = 0; hovering = false; };
  listen(host, 'pointerenter', event => { hovering = active && pointer.matches && event.pointerType !== 'touch'; });
  listen(host, 'pointerleave', () => { hovering = false; });
  listen(host, 'click', () => {
    if (!active || motion.matches || blinkStart >= 0 || elapsed - lastClick < .65) return;
    blinkStart = elapsed; lastClick = elapsed; schedule();
  });
  listen(hero, 'pointerleave', neutral);
  listen(window, 'blur', neutral);
  listen(window, 'scroll', updateScroll, { passive: true });
  listen(window, 'resize', measure);
  listen(document, 'visibilitychange', updateScroll);
  listen(motion, 'change', () => { neutral(); gazeX = gazeY = 0; measure(); });
  listen(pointer, 'change', neutral);
  listen(canvas, 'webglcontextlost', event => {
    event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0;
    host.dataset.state = 'unavailable';
  });
  listen(canvas, 'webglcontextrestored', () => { lost = false; last = 0; measure(); });
  const resize = new ResizeObserver(measure); resize.observe(host); resize.observe(hero);
  listen(window, 'pagehide', event => {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (event.persisted) return;
    disposed = true; resize.disconnect(); events.abort(); robot.dispose(); renderer.dispose();
  });
  listen(window, 'pageshow', updateScroll);
  measure();
}
