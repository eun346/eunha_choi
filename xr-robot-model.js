// Procedural, joint-based model. No external model, texture, or animation assets.
export function createRobot(THREE, RoundedBoxGeometry) {
  const root = new THREE.Group();
  const geometries = new Map();
  const shell = new THREE.MeshPhysicalMaterial({ color: '#eeebe6', roughness: .38, metalness: .06, clearcoat: .45 });
  const panel = new THREE.MeshPhysicalMaterial({ color: '#f8f6f2', roughness: .34, clearcoat: .45 });
  const joint = new THREE.MeshStandardMaterial({ color: '#1b1b1f', roughness: .55, metalness: .3 });
  const metal = new THREE.MeshStandardMaterial({ color: '#657382', roughness: .36, metalness: .65 });
  const screen = new THREE.MeshPhysicalMaterial({ color: '#0f0f12', roughness: .22, metalness: .12, clearcoat: .6 });
  const cyan = new THREE.MeshStandardMaterial({ color: '#38d9e6', emissive: '#38d9e6', emissiveIntensity: .45, roughness: .35 });
  const blue = new THREE.MeshStandardMaterial({ color: '#6a9cff', emissive: '#6a9cff', emissiveIntensity: .3, roughness: .4 });
  const light = new THREE.MeshBasicMaterial({ color: '#d5fbff', toneMapped: false });
  const materials = [shell, panel, joint, metal, screen, cyan, blue, light];
  function geometry(key, make) {
    if (!geometries.has(key)) geometries.set(key, make());
    return geometries.get(key);
  }
  function box(parent, size, pos, mat, radius = .08) {
    const key = `box:${size}:${radius}`;
    const mesh = new THREE.Mesh(geometry(key, () => new RoundedBoxGeometry(...size, 3, radius)), mat);
    mesh.position.set(...pos); parent.add(mesh); return mesh;
  }
  function axle(parent, radius, length, pos, mat, axis = 'x') {
    const mesh = new THREE.Mesh(geometry(`axle:${radius}:${length}`, () => new THREE.CylinderGeometry(radius, radius, length, 24)), mat);
    if (axis === 'x') mesh.rotation.z = Math.PI / 2;
    if (axis === 'z') mesh.rotation.x = Math.PI / 2;
    mesh.position.set(...pos); parent.add(mesh); return mesh;
  }
  function visor(size, pos, mat, radius) {
    const [w, h, depth] = size, x = -w / 2, y = -h / 2, r = radius;
    const geo = geometry(`visor:${size}:${r}`, () => {
      const shape = new THREE.Shape();
      shape.moveTo(x + r, y); shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
      const result = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 8 });
      result.translate(0, 0, -depth / 2); return result;
    });
    const mesh = new THREE.Mesh(geo, mat); mesh.position.set(...pos); head.add(mesh);
  }
  function pivot(parent, pos) { const group = new THREE.Group(); group.position.set(...pos); parent.add(group); return group; }

  // Compact torso with inset processor window, a seam, and two circuit traces.
  box(root, [1.22, 1.12, .92], [0, 1.96, 0], shell, .18);
  box(root, [.83, .66, .07], [0, 2.02, .46], panel, .1);
  box(root, [.34, .25, .08], [0, 2.1, .515], joint, .05);
  box(root, [.19, .12, .025], [0, 2.1, .565], cyan, .025);
  for (const x of [-.25, .25]) {
    box(root, [.018, .16, .015], [x, 2.02, .505], metal, .005);
    box(root, [.085, .018, .015], [x * .88, 1.94, .505], metal, .005);
  }
  box(root, [.55, .022, .022], [0, 1.64, .456], joint, .007);
  for (let i = 0; i < 3; i++) box(root, [.04, .025, .02], [-.07 + i * .07, 1.8, .505], i === 0 ? cyan : metal, .008);
  axle(root, .21, .26, [0, 2.6, 0], joint, 'y');
  axle(root, .23, .07, [0, 2.68, 0], metal, 'y');

  // Neck-local head pivot keeps the shell, visor and eyes mechanically connected.
  const head = pivot(root, [0, 2.69, 0]);
  box(head, [1.5, 1.42, 1.3], [0, .69, 0], shell, .25);
  visor([1.36, .94, .15], [0, .72, .60], joint, .2);
  visor([1.30, .88, .09], [0, .72, .69], cyan, .19);
  visor([1.23, .81, .085], [0, .72, .735], screen, .18);
  const gaze = pivot(head, [0, .73, .785]);
  const eyes = [-.285, .285].map(x => {
    const eye = pivot(gaze, [x, 0, .008]);
    const lens = new THREE.Mesh(geometry('eye', () => new THREE.SphereGeometry(1, 20, 12)), light);
    lens.scale.set(.075, .135, .018); eye.add(lens); return eye;
  });
  box(head, [.14, .028, .018], [0, .48, .784], blue, .01);
  for (const side of [-1, 1]) {
    axle(head, .235, .12, [side * .77, .64, -.04], joint);
    axle(head, .18, .135, [side * .79, .64, -.04], panel);
    axle(head, .085, .14, [side * .8, .64, -.04], metal);
    box(head, [.02, .11, .15], [side * .872, .64, -.04], blue, .01);
  }

  const arms = [-1, 1].map(side => {
    const shoulder = pivot(root, [side * .69, 2.28, 0]);
    axle(shoulder, .205, .24, [0, 0, 0], joint);
    axle(shoulder, .15, .035, [side * .14, 0, 0], metal);
    box(shoulder, [.32, .48, .39], [0, -.26, 0], shell, .11);
    const elbow = pivot(shoulder, [0, -.55, 0]);
    axle(elbow, .145, .33, [0, 0, 0], joint);
    axle(elbow, .075, .345, [0, 0, 0], metal);
    box(elbow, [.35, .45, .42], [0, -.28, .025], panel, .12);
    box(elbow, [.16, .035, .02], [0, -.25, .24], blue, .01);
    axle(elbow, .10, .14, [0, -.55, .025], joint, 'y');
    box(elbow, [.27, .22, .29], [0, -.69, .045], shell, .07);
    box(elbow, [.018, .09, .018], [0, -.735, .192], joint, .005);
    box(elbow, [.1, .15, .14], [-side * .15, -.66, .1], panel, .04);
    shoulder.rotation.z = side * .13;
    elbow.rotation.x = -.16;
    return { shoulder, elbow, side };
  });
  // Hip cross-member, knees, and flat soles anchor the silhouette without a pedestal.
  box(root, [.76, .24, .62], [0, 1.3, 0], joint, .08);
  for (const side of [-1, 1]) {
    const leg = pivot(root, [side * .34, 1.25, 0]);
    axle(leg, .15, .30, [0, 0, 0], metal);
    box(leg, [.39, .42, .47], [0, -.25, 0], shell, .1);
    axle(leg, .13, .34, [0, -.5, 0], joint);
    box(leg, [.25, .18, .09], [0, -.50, .22], panel, .05);
    box(leg, [.34, .37, .40], [0, -.74, 0], panel, .09);
    axle(leg, .1, .2, [0, -.97, 0], joint, 'y');
    box(leg, [.47, .22, .7], [0, -1.09, .13], shell, .08);
    box(leg, [.47, .06, .68], [0, -1.20, .13], joint, .025);
  }
  return { root, head, gaze, eyes, arms, dispose() {
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
  } };
}
