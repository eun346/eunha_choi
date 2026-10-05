// Shared, low-poly mechanical templates. Each visible part uses spherical physics bounds.
export const ANGULAR = Object.freeze({
  damping: 0.986, shapeDamping: 0.87, maxSpeed: 0.024,
  pointerImpulse: 0.035, collisionImpulse: 0.018, floorImpulse: 0.055,
  floorDamping: 0.91, shapeAlignment: 0.055, rolling: 0.08,
});

export const FIELD_STYLE = Object.freeze({
  size: 0.82, heroLift: 0.12, shapeSize: 0.62, textOpacity: 0.12,
});

export const PART_TYPES = Object.freeze([
  { type: 'gear', weight: 16, size: 1, mass: 1, spin: [0.00025, 0.00035, 0.0015] },
  { type: 'bevelGear', weight: 6, size: 1, mass: 1.15, spin: [0.0003, 0.0004, 0.0011] },
  { type: 'bearing', weight: 16, size: 0.94, mass: 1.25, spin: [0.0003, 0.0002, 0.0008] },
  { type: 'washer', weight: 14, size: 0.8, mass: 0.65, spin: [0.0007, 0.0006, 0.0004] },
  { type: 'bolt', weight: 12, size: 1, mass: 1, spin: [0.0008, 0.0004, 0.0006] },
  { type: 'nut', weight: 10, size: 0.8, mass: 0.85, spin: [0.0004, 0.0007, 0.0006] },
  { type: 'shaft', weight: 8, size: 1, mass: 1.1, spin: [0.0006, 0.0008, 0.0004] },
  { type: 'spring', weight: 6, size: 0.95, mass: 0.7, spin: [0.0008, 0.0004, 0.0005] },
  { type: 'linkage', weight: 8, size: 1, mass: 1.1, spin: [0.0004, 0.0006, 0.0004] },
  { type: 'pliers', weight: 4, size: 1.12, mass: 1.5, spin: [0.0002, 0.0003, 0.00025] },
]);

function shuffledBag(items, count) {
  const bag = [];
  for (const item of items) for (let i = 0; i < Math.max(1, Math.floor(item.weight * count / 100)); i++) bag.push(item);
  while (bag.length < count) {
    let roll = Math.random() * 100;
    bag.push(items.find(item => (roll -= item.weight) < 0) || items[0]);
  }
  for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
  return bag.slice(0, count);
}

export function createMechanicalLibrary(THREE, { mobile, count, palette }) {
  const templates = new Map(), geometries = new Set(), materials = new Set(), primitives = new Map();
  const segments = mobile ? 16 : 24;
  const rotation = new THREE.Euler(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3(), position = new THREE.Vector3();
  const aluminumColor = new THREE.Color('#E0E5EB'), pearlColor = new THREE.Color('#F4F5F2');
  const typeBag = shuffledBag(PART_TYPES, count);
  const familyBag = shuffledBag([
    { name: 'pearl', weight: mobile ? 34 : 30 }, { name: 'aluminum', weight: 25 },
    { name: 'pale', weight: 20 }, { name: 'cobalt', weight: 15 }, { name: 'glass', weight: mobile ? 6 : 10 },
  ], count);
  function primitive(key, build) {
    if (!primitives.has(key)) primitives.set(key, build());
    return primitives.get(key);
  }
  const cylinder = sides => primitive(`cylinder:${sides}`, () => new THREE.CylinderGeometry(1, 1, 1, sides));
  const box = () => primitive('box', () => new THREE.BoxGeometry(1, 1, 1));
  const ball = () => primitive('ball', () => new THREE.SphereGeometry(1, 10, 6));
  function add(bucket, role, geometry, xyz = [0, 0, 0], size = [1, 1, 1], angles = [0, 0, 0]) {
    rotation.set(...angles); quaternion.setFromEuler(rotation); scale.set(...size); position.set(...xyz);
    bucket[role].push({ geometry, matrix: new THREE.Matrix4().compose(position, quaternion, scale) });
  }
  function ring(outer, inner, depth, sides = segments, teeth = 0, taper = false) {
    const key = `ring:${outer}:${inner}:${depth}:${sides}:${teeth}:${taper}`;
    return primitive(key, () => {
      const shape = new THREE.Shape();
      const n = teeth ? teeth * 4 : sides;
      for (let i = 0; i < n; i++) {
        const angle = i / n * Math.PI * 2;
        const radius = teeth && (i % 4 === 0 || i % 4 === 3) ? outer * 0.81 : outer;
        const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
        if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
      }
      shape.closePath();
      const hole = new THREE.Path();
      hole.absarc(0, 0, inner, 0, Math.PI * 2, true); shape.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth, steps: 1, bevelEnabled: true, bevelThickness: 0.016, bevelSize: 0.016,
        bevelSegments: 1, curveSegments: mobile ? 6 : 10,
      });
      geo.translate(0, 0, -depth / 2);
      if (taper) {
        const attr = geo.attributes.position;
        for (let i = 0; i < attr.count; i++) {
          const factor = 1 - 0.22 * Math.max(0, Math.min(1, (attr.getZ(i) + depth / 2) / depth));
          attr.setXY(i, attr.getX(i) * factor, attr.getY(i) * factor);
        }
        geo.computeVertexNormals();
      }
      return geo;
    });
  }
  function rod(bucket, role, a, b, radius) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), delta = end.clone().sub(start);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize());
    bucket[role].push({ geometry: cylinder(mobile ? 8 : 12), matrix: new THREE.Matrix4().compose(start.add(end).multiplyScalar(0.5), q, new THREE.Vector3(radius, delta.length(), radius)) });
  }
  // Merge by material slot once, keeping draw calls to two per body (three for bearings).
  function merge(entries) {
    if (!entries.length) return null;
    const positions = [], normals = [], indices = [];
    for (const entry of entries) {
      const geo = entry.geometry.clone().applyMatrix4(entry.matrix);
      const offset = positions.length / 3;
      positions.push(...geo.attributes.position.array); normals.push(...geo.attributes.normal.array);
      if (geo.index) for (const i of geo.index.array) indices.push(i + offset);
      else for (let i = 0; i < geo.attributes.position.count; i++) indices.push(i + offset);
      geo.dispose();
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    result.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    result.setIndex(indices); result.computeBoundingBox(); geometries.add(result);
    return result;
  }

  for (const definition of PART_TYPES) {
    const parts = { main: [], accent: [], detail: [] }, type = definition.type;
    if (type === 'gear' || type === 'bevelGear') {
      add(parts, 'main', ring(0.9, 0.24, type === 'gear' ? 0.21 : 0.32, segments, type === 'gear' ? (mobile ? 10 : 12) : (mobile ? 12 : 16), type === 'bevelGear'));
      add(parts, 'accent', ring(0.39, 0.24, 0.13), [0, 0, 0.14]);
    } else if (type === 'bearing') {
      add(parts, 'main', ring(0.9, 0.72, 0.27));
      add(parts, 'main', ring(0.43, 0.27, 0.27));
      if (!mobile) for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        add(parts, 'detail', ball(), [Math.cos(angle) * 0.575, Math.sin(angle) * 0.575, 0], [0.135, 0.135, 0.135]);
      }
      add(parts, 'accent', ring(0.705, 0.45, 0.04), [0, 0, mobile ? 0 : -0.10]);
    } else if (type === 'washer') {
      add(parts, 'main', ring(0.9, 0.46, 0.13));
      add(parts, 'accent', ring(0.56, 0.47, 0.025), [0, 0, 0.077]);
    } else if (type === 'nut') {
      add(parts, 'main', ring(0.82, 0.34, 0.44, 6));
      add(parts, 'accent', ring(0.39, 0.34, 0.024), [0, 0, 0.237]);
    } else if (type === 'bolt') {
      add(parts, 'main', cylinder(6), [0, 0.51, 0], [0.44, 0.26, 0.44]);
      add(parts, 'main', cylinder(segments), [0, -0.15, 0], [0.2, 1.13, 0.2]);
      for (let i = 0; i < 5; i++) add(parts, 'accent', ring(0.225, 0.195, 0.025, 12), [0, -0.67 + i * 0.15, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    } else if (type === 'shaft') {
      add(parts, 'main', cylinder(segments), [0, 0, 0], [0.23, 1.6, 0.23]);
      add(parts, 'main', cylinder(segments), [0, -0.32, 0], [0.4, 0.25, 0.4]);
      add(parts, 'accent', cylinder(segments), [0, 0.28, 0], [0.3, 0.14, 0.3]);
    } else if (type === 'spring') {
      const helix = primitive('spring', () => {
        class Helix extends THREE.Curve {
          getPoint(t, target = new THREE.Vector3()) { const angle = t * Math.PI * 2 * 4.5; return target.set(Math.cos(angle) * 0.35, (t - 0.5) * 1.5, Math.sin(angle) * 0.35); }
        }
        return new THREE.TubeGeometry(new Helix(), mobile ? 48 : 80, 0.075, mobile ? 5 : 7, false);
      });
      add(parts, 'main', helix);
      add(parts, 'accent', ring(0.425, 0.275, 0.065), [0, -0.75, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
    } else if (type === 'linkage') {
      for (const y of [-0.55, 0.55]) add(parts, 'main', ring(0.32, 0.16, 0.2), [0, y, 0]);
      add(parts, 'main', box(), [0, 0, 0], [0.29, 0.83, 0.2]);
      add(parts, 'accent', box(), [0, 0, 0.105], [0.10, 0.5, 0.025]);
    } else if (type === 'pliers') {
      for (const side of [-1, 1]) {
        rod(parts, 'main', [side * 0.3, -0.82, 0], [side * -0.10, 0.14, 0], 0.105);
        rod(parts, 'main', [side * -0.10, 0.14, 0], [side * -0.24, 0.49, 0], 0.10);
        rod(parts, 'main', [side * -0.24, 0.49, 0], [side * -0.09, 0.76, 0], 0.08);
      }
      add(parts, 'accent', cylinder(12), [0, 0.07, 0.10], [0.18, 0.12, 0.18], [Math.PI / 2, 0, 0]);
    }
    const slots = Object.entries(parts).map(([role, entries]) => ({ role, geometry: merge(entries) })).filter(slot => slot.geometry);
    const bounds = new THREE.Box3(); slots.forEach(slot => bounds.union(slot.geometry.boundingBox));
    const center = bounds.getCenter(new THREE.Vector3());
    let bound = 0;
    for (const slot of slots) {
      const attr = slot.geometry.attributes.position;
      for (let i = 0; i < attr.count; i++) bound = Math.max(bound, position.fromBufferAttribute(attr, i).distanceTo(center));
    }
    slots.forEach(slot => { slot.geometry.translate(-center.x, -center.y, -center.z); slot.geometry.scale(1 / bound, 1 / bound, 1 / bound); slot.geometry.computeBoundingSphere(); });
    templates.set(type, slots);
  }
  primitives.forEach(geometry => geometry.dispose()); primitives.clear();

  function makeMaterial(family, role) {
    const glass = family === 'glass' && role === 'main';
    const neutral = role === 'detail' || (role === 'main' && family === 'aluminum');
    const mat = new THREE.MeshPhysicalMaterial({
      color: neutral ? aluminumColor : family === 'pearl' && role === 'main' ? pearlColor : palette.light,
      metalness: glass ? 0 : neutral ? 0.65 : family === 'cobalt' ? 0.42 : 0.12,
      roughness: glass ? 0.12 : neutral ? 0.3 : 0.42,
      clearcoat: glass ? 1 : 0.25, clearcoatRoughness: 0.2,
      transmission: glass ? 0.75 : 0, thickness: glass ? 0.35 : 0,
      ior: 1.45, emissive: 0x000000, emissiveIntensity: neutral ? 0.055 : 0.025,
      transparent: true,
    });
    materials.add(mat);
    return { material: mat, neutral, role, family };
  }
  function createBody(id, originalRadius) {
    const definition = typeBag[id], family = familyBag[id].name;
    const radius = originalRadius * definition.size * FIELD_STYLE.size;
    const meshGroup = new THREE.Group(), visual = new THREE.Group(), materialData = [];
    meshGroup.name = `mechanical-${definition.type}`; meshGroup.add(visual);
    for (const slot of templates.get(definition.type)) {
      const entry = makeMaterial(family, slot.role);
      const item = new THREE.Mesh(slot.geometry, entry.material);
      item.castShadow = false; item.receiveShadow = false;
      visual.add(item); materialData.push(entry);
    }
    visual.scale.setScalar(radius);
    meshGroup.rotation.set((Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8, Math.random() * Math.PI * 2);
    const initialSpin = new THREE.Vector3(...definition.spin).multiplyScalar(0.75 + Math.random() * 0.5);
    initialSpin.x *= Math.random() < 0.5 ? -1 : 1; initialSpin.y *= Math.random() < 0.5 ? -1 : 1; initialSpin.z *= Math.random() < 0.5 ? -1 : 1;
    return {
      id, type: definition.type, radius, collisionRadius: radius,
      mass: radius ** 3 * definition.mass, position: new THREE.Vector3(), velocity: new THREE.Vector3(),
      angularVelocity: initialSpin.clone(), idleSpin: initialSpin, spinResponse: 1 / definition.mass,
      meshGroup, visual, visualScale: radius, materialData, role: family,
      shapeTarget: new THREE.Vector3(),
      shapeOrientation: new THREE.Quaternion().setFromEuler(new THREE.Euler((Math.random() - 0.5) * 0.32, (Math.random() - 0.5) * 0.32, Math.random() * Math.PI * 2)),
    };
  }
  function updateMaterials(body, currentPalette, opacity) {
    for (const entry of body.materialData) {
      const mat = entry.material;
      if (entry.neutral) mat.color.copy(aluminumColor).lerp(currentPalette.light, 0.035);
      else if (entry.role === 'accent') mat.color.copy(currentPalette.medium);
      else if (entry.family === 'pearl') mat.color.copy(pearlColor);
      else if (entry.family === 'pale') mat.color.copy(pearlColor).lerp(currentPalette.light, 0.52);
      else mat.color.copy(entry.family === 'glass' ? currentPalette.glass : currentPalette.medium);
      mat.emissive.copy(mat.color); mat.opacity = opacity;
    }
  }
  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true; geometries.forEach(geometry => geometry.dispose()); materials.forEach(mat => mat.dispose());
  }
  return { createBody, updateMaterials, dispose, templates };
}
