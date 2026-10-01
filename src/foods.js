// Procedural food builders - canvas-textured organic shapes, no external assets.
// Self-contained: has its own tiny helpers so props.js can import it safely.
import * as THREE from 'three';

const g3 = (x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); return g; };
const mesh = (geo, mat, x = 0, y = 0, z = 0) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  return m;
};
const std = (opts) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...opts });

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ---------------- food textures ---------------- */

// salmon flesh: orange gradient + wavy white fat stripes + sheen
export function salmonFleshTexture() {
  return canvasTex(512, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#f28f63'); g.addColorStop(0.5, '#ef7e4f'); g.addColorStop(1, '#e06c3e');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,238,228,0.9)';
    ctx.lineCap = 'round';
    for (let x = -40; x < w + 40; x += 30) {
      ctx.lineWidth = 3 + Math.random() * 4;
      ctx.beginPath();
      ctx.moveTo(x, -10);
      for (let y = 0; y <= h + 10; y += 22) {
        ctx.lineTo(x + Math.sin(y * 0.09 + x * 0.05) * 7 + y * 0.3, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = 'rgba(255,190,160,0.12)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 8 + Math.random() * 20, 2 + Math.random() * 3);
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = 'rgba(150,60,30,0.10)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 8, 2 + Math.random() * 4);
    }
  });
}

// grilled chicken: golden base + dark grill bands + char + oil sheen
export function grillTexture() {
  return canvasTex(512, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#d8a45f'); g.addColorStop(0.5, '#c98f4b'); g.addColorStop(1, '#b97e3e');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let x = 20; x < w; x += 64) {
      ctx.strokeStyle = 'rgba(74,38,14,0.85)';
      ctx.lineWidth = 10 + Math.random() * 8;
      ctx.beginPath();
      ctx.moveTo(x + (Math.random() * 6 - 3), 0);
      for (let y = 0; y <= h; y += 26) ctx.lineTo(x + Math.sin(y * 0.08 + x) * 4, y);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(40,18,6,0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = 'rgba(60,28,8,0.25)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 5, 2 + Math.random() * 4);
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = 'rgba(255,220,160,0.15)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 10 + Math.random() * 18, 2);
    }
  });
}

// grilled beef: deep brown muscle bands + light marbling + charred specks
export function beefTexture() {
  return canvasTex(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6e3a22'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = `rgba(${90 + Math.random() * 40 | 0},${45 + Math.random() * 20 | 0},22,0.5)`;
      ctx.fillRect(0, Math.random() * h, w, 6 + Math.random() * 16);
    }
    ctx.strokeStyle = 'rgba(214,168,138,0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 55; i++) {
      const y = Math.random() * h;
      const x = Math.random() * w;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 20, y + (Math.random() * 8 - 4), x + 45, y + (Math.random() * 8 - 4), x + 70, y + (Math.random() * 6 - 3));
      ctx.stroke();
    }
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = 'rgba(30,12,5,0.35)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 6, 2 + Math.random() * 3);
    }
  });
}

// lettuce leaf: radial green gradient + pale veins + ruffle specks
export function lettuceTexture() {
  return canvasTex(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    g.addColorStop(0, '#d8ecae'); g.addColorStop(0.45, '#9ed36a'); g.addColorStop(1, '#3f9e4f');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(230,244,200,0.55)';
    for (let i = 0; i < 9; i++) {
      const a = Math.random() * Math.PI * 2;
      ctx.lineWidth = 2 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.quadraticCurveTo(w / 2 + Math.cos(a) * 40, h / 2 + Math.sin(a) * 40, w / 2 + Math.cos(a) * 95, h / 2 + Math.sin(a) * 95);
      ctx.stroke();
    }
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = 'rgba(46,120,60,0.12)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 9, 2 + Math.random() * 5);
    }
  });
}

/* ---------------- shared materials ---------------- */

let _m = null;
function M() {
  if (_m) return _m;
  _m = {
    salmon: std({ map: salmonFleshTexture(), roughness: 0.5 }),
    chicken: std({ map: grillTexture(), roughness: 0.7 }),
    beef: std({ map: beefTexture(), roughness: 0.75 }),
    lettuce: std({ map: lettuceTexture(), roughness: 0.8, side: THREE.DoubleSide }),
    rice: std({ color: 0xf5f0e4, roughness: 0.55 }),
    stalk: std({ color: 0xcfe3ae, roughness: 0.9 }),
    broccoli: std({ color: 0xffffff, roughness: 0.9 }),
    tomato: std({ color: 0xe04b2f, roughness: 0.28 }),
    tomatoLeaf: std({ color: 0x2e7d3a, roughness: 0.9 }),
    core: std({ color: 0xdcedb4, roughness: 0.9 }),
    kraft: std({ color: 0xe6dcc3, roughness: 0.85 }),
  };
  return _m;
}

/* ---------------- builders ---------------- */

// salmon fillet: extruded teardrop slab with fat-stripe texture
export function salmonFillet(s = 1, yaw = 0) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.15, 0);
  shape.bezierCurveTo(-0.15, 0.08, -0.06, 0.1, 0.02, 0.095);
  shape.bezierCurveTo(0.1, 0.09, 0.15, 0.05, 0.165, 0);
  shape.bezierCurveTo(0.15, -0.05, 0.1, -0.088, 0, -0.09);
  shape.bezierCurveTo(-0.08, -0.092, -0.15, -0.07, -0.15, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.036, bevelEnabled: true, bevelThickness: 0.011, bevelSize: 0.012, bevelSegments: 2, curveSegments: 20,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0.02, 0);
  const g = g3();
  g.add(mesh(geo, M().salmon));
  g.scale.setScalar(s);
  if (yaw) g.rotation.y = yaw;
  return g;
}

// diced salmon cubes
export function salmonDice(n = 6, area = 0.12) {
  const g = g3();
  const geo = new THREE.BoxGeometry(0.034, 0.028, 0.034);
  for (let i = 0; i < n; i++) {
    const c = mesh(geo, M().salmon, (Math.random() - 0.5) * area, 0.014 + (i % 3) * 0.026, (Math.random() - 0.5) * area * 0.6);
    c.rotation.y = Math.random() * Math.PI;
    g.add(c);
  }
  return g;
}

// pile of grilled beef strips (bulgogi style)
export function beefStrips(n = 15, w = 0.36, d = 0.2) {
  const g = g3();
  const geo = new THREE.BoxGeometry(0.082, 0.011, 0.042);
  for (let i = 0; i < n; i++) {
    const m = mesh(geo, M().beef, (Math.random() - 0.5) * w, 0.006 + (i % 4) * 0.012 + Math.random() * 0.004, (Math.random() - 0.5) * d);
    m.rotation.y = Math.random() * Math.PI;
    m.rotation.x = (Math.random() - 0.5) * 0.25;
    m.rotation.z = (Math.random() - 0.5) * 0.2;
    g.add(m);
  }
  return g;
}

// grilled chicken breast with char bands
export function grilledChicken(s = 1) {
  const g = g3();
  const body = mesh(new THREE.SphereGeometry(0.07, 18, 12), M().chicken, 0, 0.038, 0);
  body.scale.set(1.5, 0.55, 0.92);
  g.add(body);
  const tail = mesh(new THREE.SphereGeometry(0.045, 12, 8), M().chicken, -0.105, 0.028, 0);
  tail.scale.set(1.1, 0.38, 0.68);
  g.add(tail);
  g.scale.setScalar(s);
  return g;
}

// broccoli head: stalk + instanced bumpy floret cloud in varied greens
export function broccoliHead(s = 1, n = 42) {
  const g = g3();
  g.add(mesh(new THREE.CylinderGeometry(0.014, 0.02, 0.055, 8), M().stalk, 0, 0.027, 0));
  const inst = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.019, 0), M().broccoli, n);
  inst.castShadow = true;
  const Mx = new THREE.Matrix4(), Q = new THREE.Quaternion(), Pv = new THREE.Vector3(), Sv = new THREE.Vector3(), col = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(Math.random()) * 0.052;
    const y = 0.05 + Math.sqrt(Math.max(0, 1 - rr / 0.062)) * (0.012 + Math.random() * 0.024);
    Pv.set(Math.cos(a) * rr, y, Math.sin(a) * rr);
    Q.setFromEuler(new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3));
    Sv.setScalar(0.7 + Math.random() * 0.65);
    Mx.compose(Pv, Q, Sv);
    inst.setMatrixAt(i, Mx);
    col.setHSL(0.36 + Math.random() * 0.04, 0.5, 0.3 + Math.random() * 0.14);
    inst.setColorAt(i, col);
  }
  inst.instanceMatrix.needsUpdate = true;
  if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  g.add(inst);
  g.scale.setScalar(s);
  return g;
}

// lettuce: layered tinted leaf shells wrapping a pale core
export function lettuceHead(s = 1) {
  const g = g3();
  for (let i = 0; i < 6; i++) {
    const r = 0.085 * (1 - i * 0.09);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 9, 0, Math.PI * 2, 0, 1.85), M().lettuce.clone());
    leaf.material.color.setHSL(0.3 - i * 0.012, 0.5, 0.42 + i * 0.03);
    leaf.position.y = 0.02 + i * 0.012;
    leaf.rotation.y = i * 0.62;
    leaf.rotation.x = 0.18 + i * 0.05;
    leaf.scale.set(1, 0.75, 1);
    leaf.castShadow = true;
    g.add(leaf);
  }
  g.add(mesh(new THREE.SphereGeometry(0.026, 10, 8), M().core, 0, 0.05, 0));
  g.scale.setScalar(s);
  return g;
}

// mound of individual rice grains (instanced capsules)
export function riceMound(w = 0.4, d = 0.22, h = 0.045, n = 130) {
  const g = g3();
  const inst = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.0065, 0.014, 2, 6), std({ color: 0xf2ecda, roughness: 0.55 }), n);
  inst.castShadow = true;
  const Mx = new THREE.Matrix4(), Q = new THREE.Quaternion(), Pv = new THREE.Vector3(), Sv = new THREE.Vector3(1, 1, 1), E = new THREE.Euler();
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1, v = Math.random() * 2 - 1;
    const y = h * (1 - u * u) * (1 - v * v) * (0.5 + Math.random() * 0.5) + 0.006;
    Pv.set(u * w / 2, y, v * d / 2);
    E.set((Math.random() - 0.5) * 0.5, Math.random() * Math.PI, Math.PI / 2 + (Math.random() - 0.5) * 0.5);
    Q.setFromEuler(E);
    Mx.compose(Pv, Q, Sv);
    inst.setMatrixAt(i, Mx);
  }
  inst.instanceMatrix.needsUpdate = true;
  g.add(inst);
  return g;
}

// kraft takeaway box filled with rice
export function riceBox() {
  const g = g3();
  g.add(mesh(new THREE.BoxGeometry(0.16, 0.045, 0.115), M().kraft, 0, 0.0225, 0));
  const rm = riceMound(0.13, 0.09, 0.026, 90);
  rm.position.y = 0.042;
  g.add(rm);
  return g;
}

// glossy cherry tomatoes with tiny sepals
export function cherryTomatoes(n = 6, w = 0.18, d = 0.11) {
  const g = g3();
  for (let i = 0; i < n; i++) {
    const t = mesh(new THREE.SphereGeometry(0.021, 12, 10), M().tomato, (Math.random() - 0.5) * w, 0.021, (Math.random() - 0.5) * d);
    g.add(t);
    for (let s = 0; s < 3; s++) {
      const sep = mesh(new THREE.ConeGeometry(0.004, 0.013, 5), M().tomatoLeaf, t.position.x + (s - 1) * 0.009, t.position.y + 0.019, t.position.z + (s % 2 - 0.5) * 0.009);
      sep.rotation.x = Math.PI / 2 + (s - 1) * 0.4;
      g.add(sep);
    }
  }
  return g;
}

// fresh tofu cubes
export function tofuCubes(n = 5, area = 0.12) {
  const g = g3();
  const geo = new THREE.BoxGeometry(0.03, 0.028, 0.03);
  for (let i = 0; i < n; i++) {
    const c = mesh(geo, M().kraft, (Math.random() - 0.5) * area, 0.014 + (i % 2) * 0.026, (Math.random() - 0.5) * area * 0.6);
    c.material = std({ color: 0xf2eee0, roughness: 0.55 });
    c.rotation.y = Math.random() * Math.PI;
    g.add(c);
  }
  return g;
}
