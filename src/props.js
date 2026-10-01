// Reusable prop builders. Convention: group origin sits at the footprint
// centre on the floor (y=0), so placing a prop at (x, 0, z) grounds it.
import * as THREE from 'three';
import { M } from './materials.js';
import * as T from './textures.js';
import * as F from './foods.js';

export function grp(x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  return g;
}

export function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function cyl(rT, rB, h, seg, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function sph(r, mat, x = 0, y = 0, z = 0, seg = 20) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg * 0.75 | 0)), mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

export function plane(w, h, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.set(x, y, z);
  m.receiveShadow = true;
  return m;
}

export function std(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
}

/* ---------------- seating ---------------- */

export function stool() {
  const g = grp();
  g.add(cyl(0.17, 0.17, 0.045, 20, M.oak, 0, 0.4475, 0));
  for (const [dx, dz] of [[0.11, 0.11], [-0.11, 0.11], [0.11, -0.11], [-0.11, -0.11]]) {
    g.add(cyl(0.013, 0.011, 0.43, 8, M.charcoal, dx, 0.215, dz));
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.008, 8, 24), M.charcoal);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.14;
  ring.castShadow = true;
  g.add(ring);
  return g;
}

export function chair() {
  const g = grp();
  g.add(box(0.42, 0.04, 0.42, M.oak, 0, 0.45, 0));
  g.add(box(0.42, 0.46, 0.035, M.oak, 0, 0.70, -0.192));
  for (const [dx, dz] of [[0.17, 0.17], [-0.17, 0.17], [0.17, -0.17], [-0.17, -0.17]]) {
    g.add(cyl(0.014, 0.012, 0.44, 8, M.charcoal, dx, 0.22, dz));
  }
  return g;
}

export function communalTable() {
  const g = grp();
  g.add(box(2.2, 0.05, 0.95, M.oak, 0, 0.755, 0));
  for (const [dx, dz] of [[0.98, 0.36], [-0.98, 0.36], [0.98, -0.36], [-0.98, -0.36]]) {
    g.add(box(0.055, 0.73, 0.055, M.counterWhite, dx, 0.365, dz));
  }
  g.add(box(2.0, 0.05, 0.05, M.charcoal, 0, 0.18, 0));
  return g;
}

export function roundTable() {
  const g = grp();
  g.add(cyl(0.36, 0.36, 0.045, 28, M.oak, 0, 0.7425, 0));
  g.add(cyl(0.035, 0.05, 0.72, 12, M.counterWhite, 0, 0.36, 0));
  g.add(cyl(0.2, 0.22, 0.02, 24, M.charcoal, 0, 0.01, 0));
  return g;
}

/* ---------------- plants ---------------- */

export function pottedPlant(small = true) {
  const g = grp();
  const potH = small ? 0.28 : 0.4;
  const potR = small ? 0.17 : 0.24;
  g.add(cyl(potR * 0.82, potR * 0.68, potH, 18, M.counterWhite, 0, potH / 2, 0));
  g.add(cyl(potR * 0.8, potR * 0.8, 0.02, 18, M.mintPaint, 0, potH, 0));
  const greens = [0x3e9e5f, 0x2f7a4c, 0x57b876, 0x35885a];
  if (small) {
    g.add(cyl(0.012, 0.014, 0.1, 8, M.oakDark, 0, potH + 0.04, 0));
    for (let i = 0; i < 7; i++) {
      const s = sph(0.09 + Math.random() * 0.06, std(greens[i % 4]), (Math.random() - 0.5) * 0.24, potH + 0.07 + Math.random() * 0.2, (Math.random() - 0.5) * 0.24, 12);
      s.scale.y = 0.62 + Math.random() * 0.3;
      g.add(s);
    }
  } else {
    g.add(cyl(0.025, 0.035, 0.75, 10, M.oakDark, 0, potH + 0.375, 0));
    for (let i = 0; i < 9; i++) {
      const s = sph(0.13 + Math.random() * 0.1, std(greens[i % 4]), (Math.random() - 0.5) * 0.55, potH + 0.62 + Math.random() * 0.55, (Math.random() - 0.5) * 0.55, 12);
      s.scale.y = 0.5 + Math.random() * 0.3;
      g.add(s);
    }
  }
  return g;
}

export function hangingPlanter() {
  const g = grp();
  g.add(cyl(0.005, 0.005, 1.74, 6, M.charcoal, 0, 2.12, 0));
  g.add(cyl(0.14, 0.11, 0.18, 16, M.counterWhite, 0, 1.14, 0));
  for (let i = 0; i < 5; i++) {
    const s = sph(0.07 + Math.random() * 0.04, std([0x3e9e5f, 0x57b876, 0x2f7a4c][i % 3]), (Math.random() - 0.5) * 0.22, 1.2 + Math.random() * 0.12, (Math.random() - 0.5) * 0.22, 10);
    s.scale.y = 0.55;
    g.add(s);
  }
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    g.add(cyl(0.006, 0.004, 0.32, 6, std(0x2f7a4c), Math.cos(a) * 0.1, 0.98, Math.sin(a) * 0.1));
  }
  return g;
}

/* ---------------- lighting fixtures ---------------- */

export function pendantLamp() {
  const g = grp();
  g.add(cyl(0.006, 0.006, 0.95, 6, M.brandGreen, 0, 2.525, 0));
  g.add(cyl(0.16, 0.22, 0.16, 24, M.counterWhite, 0, 2.0, 0));
  g.add(sph(0.055, M.lightWarm, 0, 1.945, 0, 14));
  g.add(cyl(0.16, 0.16, 0.01, 24, M.lightWarm, 0, 1.925, 0));
  return g;
}

export function battenLight(len = 1.2) {
  const g = grp();
  g.add(box(0.09, 0.05, len, M.counterWhite, 0, 0, 0));
  const strip = plane(0.07, len - 0.1, M.lightWhite, 0, -0.026, 0);
  strip.rotation.x = Math.PI / 2; // face down
  g.add(strip);
  return g;
}

/* ---------------- tableware / disposables ---------------- */

export function ecoBox() {
  const g = grp();
  g.add(box(0.24, 0.055, 0.18, M.kraft, 0, 0.0275, 0));
  g.add(box(0.25, 0.018, 0.19, M.kraft, 0, 0.062, 0));
  g.add(box(0.252, 0.008, 0.04, M.brandGreen, 0, 0.073, 0));
  return g;
}

export function boxStack(n = 4) {
  const g = grp();
  for (let i = 0; i < n; i++) {
    const b = ecoBox();
    b.position.y = i * 0.084;
    if (i % 2 === 1) b.rotation.y = 0.03 * i;
    g.add(b);
  }
  return g;
}

export function foodPan(w = 0.5, d = 0.31) {
  const g = grp();
  g.add(box(w, 0.03, d, M.stainlessBrushed, 0, 0.015, 0));
  const inner = box(w - 0.07, 0.02, d - 0.06, new THREE.MeshStandardMaterial({ color: 0x2c3234, roughness: 0.55, metalness: 0.5 }), 0, 0.035, 0);
  inner.castShadow = false;
  g.add(inner);
  return g;
}

// hanging scoop: ring at top (hooks over a rail), bowl at the bottom
export function scoop(tagNum) {
  const g = grp();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.004, 8, 16), M.charcoal);
  ring.rotation.y = Math.PI / 2; // hole faces x, hooks over an x-running rail
  ring.castShadow = true;
  g.add(ring);
  g.add(cyl(0.01, 0.01, 0.16, 8, M.brandGreen, 0, -0.09, 0));
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.brandGreen);
  bowl.rotation.x = Math.PI; // open side up
  bowl.position.y = -0.175;
  bowl.castShadow = true;
  g.add(bowl);
  const tag = plane(0.062, 0.062, new THREE.MeshBasicMaterial({ map: T.labelTexture(tagNum), side: THREE.DoubleSide }), 0, -0.09, 0.034);
  g.add(tag);
  return g;
}

export function saucePump(labelColor = 0xd8a012) {
  const g = grp();
  g.add(cyl(0.045, 0.05, 0.19, 14, M.counterWhite, 0, 0.095, 0));
  g.add(cyl(0.046, 0.046, 0.035, 14, std(labelColor), 0, 0.12, 0));
  g.add(box(0.024, 0.05, 0.1, M.charcoal, 0, 0.215, -0.02));
  const nozzle = cyl(0.009, 0.009, 0.09, 8, M.charcoal, 0, 0.2, 0.045);
  nozzle.rotation.x = Math.PI / 2.2;
  g.add(nozzle);
  return g;
}

export function grainJar(content = 0xd9c9a0) {
  const g = grp();
  const glassM = new THREE.MeshPhysicalMaterial({ color: 0xe8f4ef, roughness: 0.06, transparent: true, opacity: 0.3, depthWrite: false });
  g.add(cyl(0.055, 0.055, 0.2, 14, glassM, 0, 0.1, 0));
  g.add(cyl(0.048, 0.048, 0.15, 12, std(content), 0, 0.075, 0));
  g.add(cyl(0.058, 0.058, 0.025, 14, M.oak, 0, 0.212, 0));
  return g;
}

/* ---------------- kitchen equipment ---------------- */

// recessed sink basin; origin sits on the counter surface, interior descends -y
export function sinkBasin(w = 0.5, d = 0.46, depth = 0.14) {
  const g = grp();
  const t = 0.013;
  const rim = 0.025;
  const dark = new THREE.MeshStandardMaterial({ color: 0x22282b, roughness: 0.6, metalness: 0.25 });
  // chrome rim, slightly proud of the counter top
  g.add(box(w + rim * 2, 0.018, rim, M.stainless, 0, 0.009, -(d + rim) / 2));
  g.add(box(w + rim * 2, 0.018, rim, M.stainless, 0, 0.009, (d + rim) / 2));
  g.add(box(rim, 0.018, d, M.stainless, -(w + rim) / 2, 0.009, 0));
  g.add(box(rim, 0.018, d, M.stainless, (w + rim) / 2, 0.009, 0));
  // interior walls descending into the cabinet
  const wallH = depth + 0.01;
  const wallY = -depth / 2 + 0.005;
  g.add(box(t, wallH, d, M.stainlessBrushed, -w / 2 + t / 2, wallY, 0));
  g.add(box(t, wallH, d, M.stainlessBrushed, w / 2 - t / 2, wallY, 0));
  g.add(box(w, wallH, t, M.stainlessBrushed, 0, wallY, -d / 2 + t / 2));
  g.add(box(w, wallH, t, M.stainlessBrushed, 0, wallY, d / 2 - t / 2));
  // dark bottom + drain
  g.add(box(w - t * 2, 0.012, d - t * 2, dark, 0, -depth + 0.006, 0));
  g.add(cyl(0.026, 0.026, 0.01, 12, dark, 0, -depth + 0.014, 0));
  return g;
}

// dark cast-iron style burner ring that reads around a pot base
export function burnerRing(r = 0.17) {
  const g = grp();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.011, 8, 28), M.steelDark);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.004;
  ring.castShadow = true;
  g.add(ring);
  return g;
}

export function scaleProp() {
  const g = grp();
  g.add(box(0.3, 0.035, 0.26, M.counterWhite, 0, 0.0175, 0));
  g.add(box(0.24, 0.012, 0.2, M.stainless, 0, 0.041, 0));
  g.add(box(0.1, 0.11, 0.04, M.charcoal, 0.16, 0.09, 0.1));
  const disp = plane(0.085, 0.05, new THREE.MeshBasicMaterial({ color: 0x9effc9 }), 0.16, 0.125, 0.079);
  disp.rotation.x = -0.35;
  g.add(disp);
  return g;
}

export function labelPrinter() {
  const g = grp();
  g.add(box(0.22, 0.15, 0.26, M.counterWhite, 0, 0.075, 0));
  g.add(box(0.16, 0.012, 0.06, M.charcoal, 0, 0.152, 0.06));
  g.add(cyl(0.018, 0.018, 0.012, 10, M.brandGreen, 0.07, 0.152, -0.06));
  g.add(box(0.05, 0.004, 0.1, M.kraft, 0, 0.158, 0.12));
  return g;
}

export function riceCooker() {
  const g = grp();
  g.add(cyl(0.155, 0.14, 0.26, 18, M.stainlessBrushed, 0, 0.13, 0));
  g.add(cyl(0.158, 0.158, 0.035, 18, M.charcoal, 0, 0.275, 0));
  g.add(box(0.05, 0.02, 0.02, M.charcoal, 0.13, 0.18, 0.13));
  return g;
}

export function crate(col = 0x2fa36b) {
  const g = grp();
  g.add(box(0.42, 0.24, 0.32, std(col), 0, 0.12, 0));
  const inner = box(0.36, 0.02, 0.26, new THREE.MeshStandardMaterial({ color: 0x101513, roughness: 1 }), 0, 0.235, 0);
  inner.castShadow = false;
  g.add(inner);
  return g;
}

// rack with w along x, d along z; rotate the returned group for wall runs
export function storageRack(w = 0.5, d = 1.9, tiers = 4, h = 1.85) {
  const g = grp();
  for (const [dx, dz] of [[w / 2 - 0.02, d / 2 - 0.02], [-w / 2 + 0.02, d / 2 - 0.02], [w / 2 - 0.02, -d / 2 + 0.02], [-w / 2 + 0.02, -d / 2 + 0.02]]) {
    g.add(box(0.035, h, 0.035, M.steelDark, dx, h / 2, dz));
  }
  const shelfH = h / tiers;
  for (let i = 0; i <= tiers; i++) {
    g.add(box(w, 0.02, d, M.stainlessBrushed, 0, i * shelfH, 0));
  }
  return g;
}

export function hood(len = 2.2, dep = 0.7) {
  const g = grp();
  // lower-reflectance brushed steel: keeps panel detail instead of mirroring the env
  const steel = new THREE.MeshStandardMaterial({ color: 0xaeb4b8, roughness: 0.55, metalness: 0.55 });
  const steelDark = new THREE.MeshStandardMaterial({ color: 0x8f9599, roughness: 0.6, metalness: 0.5 });
  g.add(box(len, 0.42, dep, steel, 0, 0.21, 0));
  g.add(box(len - 0.12, 0.05, dep - 0.12, steelDark, 0, -0.02, 0));
  g.add(box(len - 0.4, 0.012, 0.1, M.lightWarm, 0, -0.048, -dep / 2 + 0.2));
  g.add(box(0.3, 0.65, 0.3, steel, 0, 0.735, 0));
  return g;
}

export function stockpot(scale = 1) {
  const g = grp();
  g.add(cyl(0.14 * scale, 0.13 * scale, 0.22 * scale, 18, M.stainless, 0, 0.11 * scale, 0));
  g.add(cyl(0.145 * scale, 0.145 * scale, 0.02, 18, M.stainlessBrushed, 0, 0.225 * scale, 0));
  g.add(box(0.02, 0.02, 0.16 * scale, M.charcoal, 0, 0.16 * scale, 0.14 * scale));
  return g;
}

export function vegTray() {
  const g = grp();
  g.add(box(0.3, 0.09, 0.2, M.counterWhite, 0, 0.045, 0));
  const inner = box(0.26, 0.02, 0.16, new THREE.MeshStandardMaterial({ color: 0x2c3234, roughness: 0.6 }), 0, 0.07, 0);
  inner.castShadow = false;
  g.add(inner);
  return g;
}

export function cuttingBoard(color = 0x2fa36b) {
  const g = grp();
  g.add(box(0.4, 0.02, 0.28, std(color), 0, 0.01, 0));
  return g;
}

/* ---------------- appliances ---------------- */

export function kiosk() {
  const g = grp();
  // pedestal body, screen head leans out on top facing -x
  g.add(box(0.5, 0.95, 0.5, M.counterWhite, 0, 0.475, 0));
  g.add(box(0.52, 0.06, 0.52, M.brandGreen, 0, 0.98, 0));
  g.add(box(0.16, 0.14, 0.22, M.charcoal, 0, 1.08, 0));
  const head = grp(0, 1.24, 0);
  head.rotation.z = -0.5; // tilt the screen up toward a standing user
  head.add(box(0.05, 0.46, 0.48, M.charcoal, 0, 0.08, 0));
  const face = plane(0.42, 0.4, new THREE.MeshBasicMaterial({ map: T.kioskUiTexture() }), -0.028, 0.08, 0);
  face.rotation.y = -Math.PI / 2; // normal -> -x
  head.add(face);
  g.add(head);
  g.add(box(0.03, 0.1, 0.14, M.charcoal, -0.262, 0.62, -0.1));
  g.add(box(0.2, 0.015, 0.08, M.charcoal, -0.251, 0.45, 0.18));
  g.add(box(0.08, 0.02, 0.12, M.brandGreen, -0.255, 0.3, 0.12));
  return g;
}

export function vitrine() {
  const g = grp();
  g.add(box(0.5, 0.9, 0.5, M.counterWhite, 0, 0.45, 0));
  g.add(box(0.52, 0.04, 0.52, M.oak, 0, 0.92, 0));
  const h = 0.44;
  const t = 0.012;
  g.add(box(0.46, h, t, M.glassCase, 0, 0.92 + h / 2, 0.235));
  g.add(box(0.46, h, t, M.glassCase, 0, 0.92 + h / 2, -0.235));
  g.add(box(t, h, 0.46, M.glassCase, 0.235, 0.92 + h / 2, 0));
  g.add(box(t, h, 0.46, M.glassCase, -0.235, 0.92 + h / 2, 0));
  g.add(box(0.48, 0.02, 0.48, M.oak, 0, 0.92 + h, 0));
  g.add(box(0.4, 0.05, 0.13, M.mintPaint, 0, 0.965, 0.14));
  g.add(box(0.4, 0.05, 0.13, M.mintPaint, 0, 1.015, 0));
  g.add(box(0.4, 0.05, 0.13, M.mintPaint, 0, 1.065, -0.14));
  const chick = F.grilledChicken(1.0); chick.position.set(0, 1.09, 0.14); g.add(chick);
  const rice = F.riceBox(); rice.position.set(0, 1.04, 0); g.add(rice);
  const broc = F.broccoliHead(0.8); broc.position.set(0, 0.99, -0.14); g.add(broc);
  const labels = [['鸡胸 100g', 'Chicken breast'], ['糙米饭 150g', 'Brown rice'], ['西兰花 30g', 'Broccoli']];
  labels.forEach(([cn, en], i) => {
    const lab = plane(0.13, 0.065, new THREE.MeshBasicMaterial({ map: T.labelTexture(cn, en) }), -0.256, 0.78, 0.14 - i * 0.14);
    lab.rotation.y = -Math.PI / 2;
    g.add(lab);
  });
  return g;
}

/* ---------------- outdoor queue furniture ---------------- */

// post-and-rail queue barrier, built along +x from local x=0
export function queueRail(len = 3) {
  const g = grp();
  const n = Math.max(1, Math.round(len));
  for (let i = 0; i <= n; i++) {
    const x = (len * i) / n;
    g.add(cyl(0.024, 0.03, 1.0, 10, M.brandGreen, x, 0.5, 0));
    g.add(box(0.15, 0.02, 0.15, M.charcoal, x, 0.01, 0));
  }
  for (const ry of [0.92, 0.58]) {
    const rail = cyl(0.014, 0.014, len, 8, M.deepGreen, len / 2, ry, 0);
    rail.rotation.z = Math.PI / 2;
    g.add(rail);
  }
  return g;
}

// freestanding double-sided sign on a post
export function standingSign(mat) {
  const g = grp();
  g.add(cyl(0.02, 0.026, 1.3, 10, M.charcoal, 0, 0.65, 0));
  g.add(box(0.22, 0.02, 0.22, M.charcoal, 0, 0.01, 0));
  g.add(box(0.56, 0.56, 0.024, M.counterWhite, 0, 1.26, 0));
  g.add(plane(0.52, 0.52, mat, 0, 1.26, 0.014));
  const back = plane(0.52, 0.52, mat, 0, 1.26, -0.014);
  back.rotation.y = Math.PI;
  g.add(back);
  return g;
}

/* ---------------- misc ---------------- */

export function recycleBin(lidColor = 0x27a468) {
  const g = grp();
  g.add(box(0.3, 0.62, 0.3, M.steelDark, 0, 0.31, 0));
  g.add(box(0.32, 0.03, 0.32, std(lidColor), 0, 0.635, 0));
  g.add(box(0.18, 0.02, 0.05, M.charcoal, 0, 0.652, 0));
  return g;
}

export function clockProp() {
  const g = grp();
  const body = cyl(0.13, 0.13, 0.035, 24, M.counterWhite, 0, 0, 0);
  body.rotation.x = Math.PI / 2; // face along z
  g.add(body);
  const mkHand = (len, w, rot) => {
    const h = grp(0, 0, 0.021);
    h.rotation.z = rot;
    h.add(box(w, len, 0.004, M.charcoal, 0, len / 2, 0));
    return h;
  };
  g.add(mkHand(0.07, 0.014, 0.7));
  g.add(mkHand(0.05, 0.018, -2.1));
  g.add(sph(0.012, M.charcoal, 0, 0, 0.026, 8));
  return g;
}

export function extinguisher() {
  const g = grp();
  g.add(cyl(0.055, 0.055, 0.42, 12, std(0xc23b2e), 0, 0.21, 0));
  g.add(cyl(0.015, 0.015, 0.09, 8, M.charcoal, 0, 0.46, 0));
  g.add(box(0.09, 0.025, 0.03, M.charcoal, 0, 0.5, 0));
  return g;
}

export function firstAidBox() {
  const g = grp();
  g.add(box(0.24, 0.18, 0.1, std(0xf7f7f2), 0, 0.09, 0));
  g.add(box(0.09, 0.028, 0.012, std(0x2fa36b), 0, 0.09, 0.052));
  g.add(box(0.028, 0.09, 0.012, std(0x2fa36b), 0, 0.09, 0.052));
  return g;
}

export function garland(halfSpan = 2.9, y0 = 0, z = 0.12) {
  const g = grp();
  const n = 14;
  const colors = [0x27a468, 0xff9f45, 0xfbfbf8, 0x1c7a4e];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = -halfSpan + 2 * halfSpan * t;
    const y = y0 - 0.22 * Math.sin(Math.PI * t);
    if (i > 0 && i < n) {
      const flag = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.11, 4), std(colors[i % 4]));
      flag.rotation.x = Math.PI;
      flag.position.set(x, y - 0.06, z);
      flag.castShadow = true;
      g.add(flag);
    }
  }
  g.add(box(halfSpan * 2, 0.006, 0.006, M.charcoal, 0, y0, z));
  return g;
}

export function clipBoard() {
  const g = grp();
  g.add(box(0.23, 0.012, 0.32, M.oakDark, 0, 0.006, 0));
  g.add(box(0.08, 0.02, 0.03, M.charcoal, 0, 0.018, -0.135));
  const paper = plane(0.19, 0.26, new THREE.MeshBasicMaterial({ color: 0xfdfdf8 }), 0, 0.014, 0.01);
  paper.rotation.x = -Math.PI / 2;
  g.add(paper);
  return g;
}
