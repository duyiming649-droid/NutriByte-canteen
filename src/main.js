// GREENBOX HKUST MVP - bootstrap, lighting, snap mode, geometry audit.
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { RoomEnvironment } from '../lib/RoomEnvironment.js';
import { M, signMaterials } from './materials.js';
import { buildShop } from './layout.js';
import { VIEWS, VIEW_LABELS, tweenCamera } from './views.js';
import * as T from './textures.js';

const params = new URLSearchParams(location.search);
const SNAP = params.get('snap') === '1';
const INIT_VIEW = params.get('view') || 'overview';

const W = 8.4, D = 7.2, H = 3.0;

/* ---------- renderer / scene / camera ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.getElementById('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfecdf);

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 120);
const v0 = VIEWS[INIT_VIEW] || VIEWS.overview;
camera.position.set(...v0.pos);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = !SNAP;
controls.dampingFactor = 0.06;
controls.minDistance = 0.8;
controls.maxDistance = 22;
controls.maxPolarAngle = 1.52;
controls.target.set(...v0.tgt);
controls.update();

/* ---------- environment & lights ---------- */
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.48;

scene.add(new THREE.HemisphereLight(0xeaf4ec, 0xd8cfc2, 0.6));

const sun = new THREE.DirectionalLight(0xfff2e0, 2.1);
sun.position.set(2.5, 9, -6.5);
sun.target.position.set(4.2, 0, 3.6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 30;
sun.shadow.camera.left = -9;
sun.shadow.camera.right = 9;
sun.shadow.camera.top = 9;
sun.shadow.camera.bottom = -9;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.02;
scene.add(sun, sun.target);

const warm = 0xffe7c4;
for (const [px, pz] of [[1.05, 0.37], [2.45, 0.37], [1.5, 2.2], [2.75, 1.5], [4.55, 1.5]]) {
  const l = new THREE.PointLight(warm, 10, 3.4, 2);
  l.position.set(px, 1.9, pz);
  scene.add(l);
}
const islandL = new THREE.PointLight(0xeef7ff, 8, 2.8, 2);
islandL.position.set(2.75, 2.2, 5.35);
scene.add(islandL);
const hoodL = new THREE.PointLight(0xffc890, 5, 2.4, 2);
hoodL.position.set(4.2, 1.55, 6.7);
scene.add(hoodL);
const fridgeL = new THREE.PointLight(0xa9f0c8, 2, 0.9, 2);
fridgeL.position.set(5.5, 1.15, 6.6);
scene.add(fridgeL);
const hotL = new THREE.PointLight(0xffb36b, 2, 1.1, 2);
hotL.position.set(7.92, 1.3, 3.75);
scene.add(hotL);
const neonL = new THREE.PointLight(0x35e08a, 3, 1.9, 2);
neonL.position.set(0.4, 1.3, 1.8);
scene.add(neonL);

/* ---------- build shop + audit registry ---------- */
const auditList = [];
function reg(name, obj, expect) {
  scene.add(obj);
  auditList.push({ name, obj, expect });
}
const { steamAnchors } = buildShop(scene, reg);

/* ---------- steam sprites ---------- */
const steamTex = T.steamTexture();
const steams = [];
for (const [ax, ay, az] of steamAnchors) {
  for (let i = 0; i < 3; i++) {
    const m = new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false });
    const s = new THREE.Sprite(m);
    s.position.set(ax + (Math.random() - 0.5) * 0.16, ay, az + (Math.random() - 0.5) * 0.14);
    s.scale.setScalar(0.22);
    s.userData = { t: i / 3, ax, ay, az };
    scene.add(s);
    steams.push(s);
  }
}

/* ---------- geometry audit ---------- */
function bboxOf(entry) {
  scene.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(entry.obj);
  return b;
}
function runAudit() {
  const issues = [];
  const boxes = new Map();
  for (const e of auditList) boxes.set(e.name, bboxOf(e));
  for (const e of auditList) {
    const b = boxes.get(e.name);
    const name = e.name;
    if (e.expect === 'floor') {
      if (b.min.y > 0.06) issues.push(`FLOAT  ${name}  minY=${b.min.y.toFixed(3)}`);
      if (b.min.y < -0.05) issues.push(`SINK   ${name}  minY=${b.min.y.toFixed(3)}`);
      if (b.min.x < -0.06 || b.max.x > W + 0.06 || b.min.z < -0.06 || b.max.z > D + 0.06) {
        issues.push(`OUT    ${name}  x[${b.min.x.toFixed(2)},${b.max.x.toFixed(2)}] z[${b.min.z.toFixed(2)},${b.max.z.toFixed(2)}]`);
      }
    } else {
      if (b.max.y > H + 0.05) issues.push(`TALL   ${name}  maxY=${b.max.y.toFixed(3)}`);
      // outdoor furniture (kiosks, queue rails) legitimately sits in front of the shop
      const outdoor = /outdoor|queue/.test(name);
      const mx = outdoor ? 3 : 0.3;
      const mz = outdoor ? 5 : 0.3;
      if (b.min.x < -mx || b.max.x > W + mx || b.min.z < -mz || b.max.z > D + mz) {
        issues.push(`OUTW   ${name}  x[${b.min.x.toFixed(2)},${b.max.x.toFixed(2)}] z[${b.min.z.toFixed(2)},${b.max.z.toFixed(2)}]`);
      }
    }
  }
  // pairwise floor-furniture overlap
  const names = [...boxes.keys()];
  const relax = (a, b) =>
    (/stool|chair/.test(a) && /table|bar/.test(b)) || (/stool|chair/.test(b) && /table|bar/.test(a));
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = auditList.find((e) => e.name === names[i]);
      const c = auditList.find((e) => e.name === names[j]);
      if (a.expect !== 'floor' || c.expect !== 'floor') continue;
      if (relax(names[i], names[j])) continue;
      const ba = boxes.get(names[i]);
      const bb = boxes.get(names[j]);
      const ox = Math.min(ba.max.x, bb.max.x) - Math.max(ba.min.x, bb.min.x);
      const oz = Math.min(ba.max.z, bb.max.z) - Math.max(ba.min.z, bb.min.z);
      const oy = Math.min(ba.max.y, bb.max.y) - Math.max(ba.min.y, bb.min.y);
      if (ox > 0.12 && oz > 0.12 && oy > 0.05) {
        issues.push(`HIT    ${names[i]} x ${names[j]}  overlap ${ox.toFixed(2)}x${oz.toFixed(2)}`);
      }
    }
  }
  return issues;
}

/* ---------- render loop / snap mode ---------- */
const clock = new THREE.Clock();
function tickSteam() {
  const t = clock.getElapsedTime();
  for (const s of steams) {
    const u = s.userData;
    const k = (t * 0.25 + u.t) % 1;
    s.position.set(u.ax + Math.sin(k * 9 + u.t * 7) * 0.05, u.ay + k * 0.55, u.az);
    s.scale.setScalar(0.16 + k * 0.3);
    s.material.opacity = 0.32 * Math.sin(Math.PI * k);
  }
}

let firstRender = true;
function renderNow() {
  if (!SNAP) tickSteam();
  renderer.render(scene, camera);
  if (firstRender) {
    firstRender = false;
    document.getElementById('loading').classList.add('done');
    window.__READY = true;
  }
}

if (SNAP) {
  controls.addEventListener('change', renderNow);
  renderNow();
} else {
  renderer.setAnimationLoop(renderNow);
  // RAF can be throttled in embedded browsers; keep the scene alive at a low rate
  setInterval(() => { if (!SNAP) renderNow(); }, 450);
}
// fail-safe: never leave the loader up forever
setTimeout(() => document.getElementById('loading').classList.add('done'), 4000);

/* ---------- view switching ---------- */
let animating = false;
function applyView(name, instant = false) {
  const v = VIEWS[name];
  if (!v) return;
  setActiveBtn(name);
  window.__VIEW = name;
  if (instant || SNAP) {
    camera.position.set(...v.pos);
    controls.target.set(...v.tgt);
    controls.update();
    if (SNAP) renderNow();
    return;
  }
  if (animating) return;
  animating = true;
  controls.enabled = false;
  tweenCamera(
    camera, controls,
    camera.position.toArray(), controls.target.toArray(),
    v.pos, v.tgt, 1100,
    () => { animating = false; controls.enabled = true; },
  );
}
window.__setView = (n) => applyView(n, true);

function setActiveBtn(name) {
  document.querySelectorAll('#views button').forEach((b) => {
    b.classList.toggle('on', b.dataset.view === name);
  });
}

const bar = document.getElementById('views');
for (const key of Object.keys(VIEWS)) {
  const b = document.createElement('button');
  b.textContent = VIEW_LABELS[key];
  b.dataset.view = key;
  b.addEventListener('click', () => applyView(key));
  bar.appendChild(b);
}
setActiveBtn(INIT_VIEW in VIEWS ? INIT_VIEW : 'overview');

/* ---------- audit export ---------- */
window.__audit = () => {
  const issues = runAudit();
  window.__auditResults = issues;
  return issues;
};

/* ---------- debug / automation hooks ---------- */
window.camera = camera;
window.controls = controls;
window.renderer = renderer;
window.renderNow = renderNow;

/* ---------- resize ---------- */
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  if (SNAP) renderNow();
});
