// GREENBOX HKUST MVP - shop interior assembly.
// Plan: 8.4m (x, shopfront side z=0) x 7.2m (z, back wall z=7.2), ceiling 3.0m.
// Front-of-house z 0-3.2, open kitchen band z 3.2-7.2 (kitchen ~45% of floor).
import * as THREE from 'three';
import { M, signMaterials } from './materials.js';
import * as P from './props.js';
import * as F from './foods.js';

const W = 8.4, D = 7.2, H = 3.0;

export function buildShop(scene, reg) {
  // reg(name, object, expect) - expect: 'floor' | 'none'; also adds to scene.
  const S = signMaterials;

  /* ============ architecture ============ */
  const terr = M.terrazzo.clone();
  terr.map = M.terrazzo.map.clone();
  terr.map.repeat.set(3, 2.6);
  terr.map.needsUpdate = true;
  const floor = P.plane(W, D, terr, W / 2, 0, D / 2);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const kt = M.kitchenTile.clone();
  kt.map = M.kitchenTile.map.clone();
  kt.map.repeat.set(7.75, 5);
  kt.map.needsUpdate = true;
  const ktile = P.plane(6.2, 4.0, kt, 3.1, 0.005, 5.2);
  ktile.rotation.x = -Math.PI / 2;
  scene.add(ktile);

  // walls: single inward-facing planes (invisible from outside, dollhouse views)
  const back = P.plane(W, H, M.wallWhite, W / 2, H / 2, D);
  back.rotation.y = Math.PI;
  scene.add(back);
  const left = P.plane(D, H, M.wallWhite, 0, H / 2, D / 2);
  left.rotation.y = Math.PI / 2;
  scene.add(left);
  const right = P.plane(D, H, M.wallWhite, W, H / 2, D / 2);
  right.rotation.y = -Math.PI / 2;
  scene.add(right);

  const bt = M.kitchenTile.clone();
  bt.map = M.kitchenTile.map.clone();
  bt.map.repeat.set(7.75, 2.25);
  bt.map.needsUpdate = true;
  const splash = P.plane(6.2, 1.8, bt, 3.1, 0.9, D - 0.013);
  splash.rotation.y = Math.PI;
  scene.add(splash);

  const baseB = new THREE.MeshStandardMaterial({ color: 0xe3e8e2, roughness: 0.8 });
  scene.add(P.box(W, 0.1, 0.024, baseB, W / 2, 0.05, D - 0.012));
  scene.add(P.box(0.024, 0.1, D, baseB, 0.012, 0.05, D / 2));
  scene.add(P.box(0.024, 0.1, D, baseB, W - 0.012, 0.05, D / 2));

  const ceil = P.plane(W, D, M.ceiling, W / 2, H, D / 2);
  ceil.rotation.x = Math.PI / 2;
  scene.add(ceil);

  // cove light strips at ceiling perimeter
  scene.add(P.box(W - 0.4, 0.03, 0.05, M.lightWhite, W / 2, 2.96, 0.2));
  scene.add(P.box(W - 0.4, 0.03, 0.05, M.lightWhite, W / 2, 2.96, D - 0.2));
  scene.add(P.box(0.05, 0.03, D - 0.4, M.lightWhite, 0.2, 2.96, D / 2));
  scene.add(P.box(0.05, 0.03, D - 0.4, M.lightWhite, W - 0.2, 2.96, D / 2));

  // storefront glass + mullions (door opening x 6.5-7.7)
  const g1 = P.plane(6.46, H, M.glass, 3.23, H / 2, 0);
  scene.add(g1);
  const g2 = P.plane(0.58, H, M.glass, 8.05, H / 2, 0);
  scene.add(g2);
  const doorGlass = P.plane(1.2, 2.2, M.glass, 7.1, 1.1, 0);
  scene.add(doorGlass);
  const transom = P.plane(1.2, 0.68, M.glass, 7.1, 2.63, 0);
  scene.add(transom);
  for (const mx of [0.04, 2.15, 4.3, 6.46, 7.74, 8.36]) {
    scene.add(P.box(0.08, H, 0.08, M.steelDark, mx, H / 2, 0));
  }
  scene.add(P.box(W, 0.1, 0.06, M.steelDark, W / 2, 2.95, 0));
  scene.add(P.box(W, 0.06, 0.06, M.steelDark, W / 2, 0.03, 0));
  scene.add(P.box(0.06, 2.2, 0.08, M.brandGreen, 6.5, 1.1, 0));
  scene.add(P.box(0.06, 2.2, 0.08, M.brandGreen, 7.7, 1.1, 0));
  scene.add(P.box(1.26, 0.1, 0.08, M.brandGreen, 7.1, 2.25, 0));
  scene.add(P.box(0.03, 0.9, 0.03, M.steelDark, 7.02, 1.05, 0.05));
  scene.add(P.box(0.03, 0.9, 0.03, M.steelDark, 7.18, 1.05, -0.05));

  // outdoor hint (seen through glass / in dollhouse views)
  const bd = P.plane(44, 22, S.backdrop(), W / 2, 8, -14);
  scene.add(bd);
  const ground = P.plane(40, 30, new THREE.MeshStandardMaterial({ color: 0xe9e9e4, roughness: 1 }), W / 2, -0.02, D / 2);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ============ open kitchen (z 3.2 - 7.2) ============ */

  // customer-facing assembly counter, x 0.35-5.95, z 3.2-3.85
  const counter = P.grp(0, 0, 0);
  counter.add(P.box(5.6, 0.92, 0.65, M.counterWhite, 3.15, 0.46, 3.525));
  counter.add(P.box(5.5, 0.1, 0.55, M.charcoal, 3.15, 0.05, 3.53));
  counter.add(P.box(5.6, 0.05, 0.65, M.stainless, 3.15, 0.945, 3.525));
  counter.add(P.box(5.6, 0.16, 0.02, M.brandGreen, 3.15, 0.6, 3.198));
  for (const lx of [1.2, 3.15, 5.1]) {
    const lp = P.plane(0.3, 0.3, S.logo(), lx, 0.6, 3.187);
    lp.rotation.y = Math.PI;
    counter.add(lp);
  }
  const wellX = [1.15, 2.0, 2.85, 3.7]; // 牛肉 / 西兰花 / 糙米饭 / 三文鱼
  wellX.forEach((wx, i) => {
    // drop-in well: raised frame border, pan recessed inside
    counter.add(P.box(0.05, 0.04, 0.42, M.stainlessBrushed, wx - 0.285, 0.985, 3.5));
    counter.add(P.box(0.05, 0.04, 0.42, M.stainlessBrushed, wx + 0.285, 0.985, 3.5));
    counter.add(P.box(0.62, 0.04, 0.04, M.stainlessBrushed, wx, 0.985, 3.325));
    counter.add(P.box(0.62, 0.04, 0.04, M.stainlessBrushed, wx, 0.985, 3.675));
    const pan = P.foodPan(0.5, 0.31);
    pan.position.set(wx, 0.9, 3.5);
    counter.add(pan);
    if (i === 0) {
      const f = F.beefStrips(22, 0.34, 0.18);
      f.position.set(wx, 0.945, 3.5);
      counter.add(f);
    } else if (i === 1) {
      [[-0.12, -0.05], [0.05, 0.05], [0.12, -0.03]].forEach(([dx, dz]) => {
        const b = F.broccoliHead(1.0);
        b.position.set(wx + dx, 0.942, 3.5 + dz);
        counter.add(b);
      });
    } else if (i === 2) {
      const r = F.riceMound(0.36, 0.19, 0.065, 800);
      r.position.set(wx, 0.945, 3.5);
      counter.add(r);
    } else {
      const s1 = F.salmonFillet(1.2, 0.15); s1.position.set(wx - 0.03, 0.942, 3.49); counter.add(s1);
      const s2 = F.salmonFillet(1.0, -0.25); s2.position.set(wx + 0.05, 0.978, 3.53); counter.add(s2);
      const dc = F.salmonDice(4, 0.1); dc.position.set(wx - 0.13, 0.945, 3.58); counter.add(dc);
    }
  });
  const pumpColors = [0xd8a012, 0xb03030, 0x2e3330];
  pumpColors.forEach((c, i) => {
    const p = P.saucePump(c);
    p.position.set(0.5 + i * 0.15, 0.97, 3.42);
    counter.add(p);
  });
  const s1 = P.boxStack(4); s1.position.set(5.45, 0.97, 3.42); counter.add(s1);
  const s2 = P.boxStack(3); s2.position.set(5.45, 0.97, 3.66); counter.add(s2);
  // glass sneeze panel + posts
  counter.add(P.box(5.6, 0.55, 0.02, M.glass, 3.15, 1.245, 3.85));
  for (const px of [0.4, 1.8, 3.2, 4.6, 5.9]) {
    counter.add(P.cyl(0.014, 0.014, 0.55, 10, M.stainless, px, 1.245, 3.85));
  }
  // numbered scoop rail on the panel (staff side)
  counter.add(P.box(1.5, 0.016, 0.016, M.stainlessBrushed, 2.55, 1.42, 3.8));
  ['1', '2', '3'].forEach((n, i) => {
    const sc = P.scoop(n);
    sc.position.set(2.1 + i * 0.45, 1.412, 3.8);
    counter.add(sc);
  });
  const guide = P.plane(0.44, 0.22, S.scoopGuide(), 1.3, 1.31, 3.836);
  guide.rotation.y = Math.PI;
  counter.add(guide);
  const trace = P.plane(0.22, 0.28, S.trace(), 4.9, 1.31, 3.836);
  trace.rotation.y = Math.PI;
  counter.add(trace);
  reg('open-kitchen-counter', counter, 'floor');

  // KDS hanging over the staff aisle
  const kds = P.grp(0, 0, 0);
  kds.add(P.box(0.02, 0.72, 0.02, M.charcoal, 2.4, 2.64, 4.32));
  kds.add(P.box(0.68, 0.46, 0.03, M.charcoal, 2.4, 2.05, 4.32));
  const kdsFace = P.plane(0.64, 0.42, S.kds(), 2.4, 2.05, 4.302);
  kdsFace.rotation.y = Math.PI;
  kds.add(kdsFace);
  const kdsBack = P.plane(0.3, 0.3, S.logo(), 2.4, 2.05, 4.338);
  kds.add(kdsBack);
  reg('kds-screen', kds, 'none');

  // centre island: weighing & packaging station, x 0.9-4.6, z 4.95-5.75
  const island = P.grp(0, 0, 0);
  island.add(P.box(3.7, 0.85, 0.8, M.counterWhite, 2.75, 0.425, 5.35));
  island.add(P.box(3.5, 0.08, 0.6, M.charcoal, 2.75, 0.04, 5.35));
  island.add(P.box(3.74, 0.05, 0.84, M.stainless, 2.75, 0.905, 5.35));
  island.add(P.box(3.7, 0.14, 0.02, M.brandGreen, 2.75, 0.55, 4.945));
  island.add(P.box(3.7, 0.14, 0.02, M.brandGreen, 2.75, 0.55, 5.755));
  const sc = P.scaleProp(); sc.position.set(1.25, 0.93, 5.3); island.add(sc);
  const lp = P.labelPrinter(); lp.position.set(1.95, 0.93, 5.25); island.add(lp);
  const bs = P.boxStack(3); bs.position.set(2.5, 0.93, 5.45); island.add(bs);
  const vt1 = P.vegTray(); vt1.position.set(3.3, 0.93, 5.25); island.add(vt1);
  const lt1 = F.lettuceHead(1.0); lt1.position.set(0, 0.085, 0); vt1.add(lt1);
  const lt2 = F.lettuceHead(0.6); lt2.position.set(0.06, 0.09, 0.04); vt1.add(lt2);
  const vt2 = P.vegTray(); vt2.position.set(3.72, 0.93, 5.25); island.add(vt2);
  const ch1 = F.grilledChicken(0.85); ch1.position.set(-0.02, 0.088, 0); ch1.rotation.y = 0.4; vt2.add(ch1);
  const ch2 = F.grilledChicken(0.7); ch2.position.set(0.03, 0.128, 0.01); ch2.rotation.y = -0.5; vt2.add(ch2);
  const cb = P.clipBoard(); cb.position.set(4.3, 0.93, 5.4); island.add(cb);
  island.add(P.box(3.4, 0.03, 0.7, M.stainlessBrushed, 2.75, 0.25, 5.35));
  const cr1 = P.crate(0x2fa36b); cr1.position.set(1.4, 0, 5.35); island.add(cr1);
  const cr2 = P.crate(0x1c7a4e); cr2.position.set(2.2, 0, 5.35); island.add(cr2);
  reg('pack-island', island, 'floor');
  // linear light over island
  const batten = P.battenLight(2.2);
  batten.rotation.y = Math.PI / 2;
  batten.position.set(2.75, 2.35, 5.35);
  reg('island-batten', batten, 'none');
  scene.add(P.cyl(0.006, 0.006, 0.62, 6, M.charcoal, 1.8, 2.69, 5.35));
  scene.add(P.cyl(0.006, 0.006, 0.62, 6, M.charcoal, 3.7, 2.69, 5.35));

  // back line: sink / prep / range / ovens / fridge, z 6.5-7.2
  const backline = P.grp(0, 0, 0);
  backline.add(P.box(5.6, 0.88, 0.7, M.counterWhite, 3.15, 0.44, 6.85));
  backline.add(P.box(5.5, 0.08, 0.6, M.charcoal, 3.15, 0.04, 6.85));
  backline.add(P.box(5.6, 0.04, 0.7, M.stainless, 3.15, 0.9, 6.85));
  // double sink x 0.35-1.45 (raised rim + recessed dark twin basins)
  for (const sx of [0.72, 1.14]) {
    backline.add(P.box(0.42, 0.025, 0.46, M.stainlessBrushed, sx, 0.9225, 6.85));
    backline.add(P.box(0.32, 0.03, 0.36, new THREE.MeshStandardMaterial({ color: 0x11181c, roughness: 0.5, metalness: 0.6 }), sx, 0.912, 6.85));
  }
  backline.add(P.box(0.035, 0.03, 0.44, M.stainlessBrushed, 0.93, 0.925, 6.85));
  backline.add(P.cyl(0.012, 0.012, 0.25, 8, M.stainless, 0.93, 1.02, 7.06));
  backline.add(P.box(0.024, 0.024, 0.22, M.stainless, 0.93, 1.14, 6.97));
  backline.add(P.cyl(0.03, 0.035, 0.14, 10, M.brandGreen, 1.38, 0.99, 7.08));
  // prep table x 1.45-2.95
  const bd1 = P.cuttingBoard(0x2fa36b); bd1.position.set(1.75, 0.92, 6.78); backline.add(bd1);
  const bd2 = P.cuttingBoard(0xf2f2ee); bd2.position.set(2.2, 0.92, 6.85); backline.add(bd2);
  const pv1 = P.vegTray(); pv1.position.set(2.68, 0.92, 6.9); backline.add(pv1);
  const tm = F.cherryTomatoes(7, 0.16, 0.1); tm.position.set(0, 0.088, 0); pv1.add(tm);
  const pv2 = P.vegTray(); pv2.position.set(2.68, 0.92, 6.64); backline.add(pv2);
  const pb1 = F.broccoliHead(0.8); pb1.position.set(-0.05, 0.088, 0); pv2.add(pb1);
  const pb2 = F.broccoliHead(0.65); pb2.position.set(0.08, 0.09, 0.02); pv2.add(pb2);
  backline.add(P.box(1.2, 0.04, 0.03, M.charcoal, 2.2, 1.5, 7.155));
  for (const kx of [1.9, 2.2, 2.5]) {
    backline.add(P.box(0.025, 0.16, 0.008, M.steelDark, kx, 1.4, 7.145));
  }
  // induction range x 2.95-4.15 (batch cooking pots)
  backline.add(P.box(1.2, 0.02, 0.66, M.charcoal, 3.55, 0.915, 6.85));
  for (const [bx, bz] of [[3.25, 6.62], [3.85, 6.62], [3.25, 7.08], [3.85, 7.08]]) {
    backline.add(P.cyl(0.09, 0.09, 0.006, 16, new THREE.MeshStandardMaterial({ color: 0x14181a, roughness: 0.4 }), bx, 0.928, bz));
  }
  const pot1 = P.stockpot(1.1); pot1.position.set(3.25, 0.925, 6.62); backline.add(pot1);
  const pot2 = P.stockpot(0.9); pot2.position.set(3.85, 0.925, 7.08); pot2.rotation.y = Math.PI; backline.add(pot2);
  // combi oven tower x 4.15-5.05
  backline.add(P.box(0.9, 1.75, 0.68, M.stainless, 4.6, 0.875, 6.86));
  for (const wy of [1.15, 0.55]) {
    backline.add(P.box(0.66, 0.44, 0.015, M.glassCase, 4.6, wy, 6.505));
    backline.add(P.box(0.5, 0.03, 0.03, M.charcoal, 4.6, wy + 0.24, 6.49));
    const glow = P.plane(0.6, 0.38, new THREE.MeshStandardMaterial({ color: 0x1c2320, emissive: 0xffb36b, emissiveIntensity: 0.3 }), 4.6, wy, 6.516);
    glow.rotation.y = Math.PI;
    backline.add(glow);
  }
  backline.add(P.box(0.7, 0.06, 0.02, M.charcoal, 4.6, 1.62, 6.51));
  // glass-door fridge x 5.05-5.95
  backline.add(P.box(0.9, 2.0, 0.6, M.counterWhite, 5.5, 1.0, 6.9));
  backline.add(P.box(0.8, 1.7, 0.03, new THREE.MeshStandardMaterial({ color: 0x182420, roughness: 0.9 }), 5.5, 1.02, 6.615));
  backline.add(P.box(0.84, 1.74, 0.02, M.glassCase, 5.5, 1.02, 6.655));
  backline.add(P.box(0.035, 1.05, 0.035, M.steelDark, 5.14, 1.08, 6.675));
  for (const fy of [0.6, 1.02, 1.44]) {
    backline.add(P.box(0.74, 0.015, 0.02, M.stainlessBrushed, 5.5, fy, 6.62));
  }
  reg('kitchen-backline', backline, 'floor');

  // exhaust hood over range + ovens
  const hoodG = P.hood(2.2, 0.68);
  hoodG.position.set(4.0, 1.95, 6.84);
  reg('exhaust-hood', hoodG, 'none');

  // wall shelves with jars (above sink + prep)
  const shelfG = P.grp(0, 0, 0);
  for (const sy of [1.65, 2.05]) {
    shelfG.add(P.box(2.5, 0.035, 0.28, M.oak, 1.65, sy, 7.03));
    shelfG.add(P.box(0.03, 0.12, 0.24, M.steelDark, 0.6, sy - 0.075, 7.05));
    shelfG.add(P.box(0.03, 0.12, 0.24, M.steelDark, 2.7, sy - 0.075, 7.05));
  }
  for (const jx of [0.75, 1.0, 1.25, 1.5]) {
    const jar = P.grainJar([0xd9c9a0, 0xc9b482, 0xe0d3ae, 0xb8a276][jx * 4 | 0] || 0xd9c9a0);
    jar.position.set(jx, 1.6675, 7.0);
    shelfG.add(jar);
  }
  for (const jx of [0.75, 1.0, 1.25, 1.5]) {
    const jar = P.grainJar([0xc9b482, 0xd9c9a0, 0xb8a276, 0xe0d3ae][jx * 4 | 0] || 0xc9b482);
    jar.position.set(jx, 2.0675, 7.0);
    shelfG.add(jar);
  }
  const bottCol = [0xb03030, 0xd8a012, 0x2e3330];
  bottCol.forEach((c, i) => {
    shelfG.add(P.cyl(0.035, 0.035, 0.18, 10, P.std(c), 1.95 + i * 0.2, 2.0675 + 0.09, 7.0));
  });
  [0, 1, 2].forEach((i) => {
    shelfG.add(P.box(0.3, 0.2, 0.24, M.kraft, 2.05 + i * 0.33, 1.6675 + 0.1, 7.0));
  });
  reg('kitchen-wall-shelves', shelfG, 'none');

  // rice cookers sit on the dry rack's bottom shelf
  const rc1 = P.riceCooker(); rc1.position.set(0.25, 0.03, 4.75); reg('rice-cooker-1', rc1, 'none');
  const rc2 = P.riceCooker(); rc2.position.set(0.25, 0.03, 5.15); reg('rice-cooker-2', rc2, 'none');

  // dry storage rack along left kitchen wall
  const lrack = P.storageRack(0.5, 1.9, 4, 1.85);
  lrack.position.set(0.25, 0, 5.25);
  reg('kitchen-dry-rack', lrack, 'floor');
  const binM = new THREE.MeshStandardMaterial({ color: 0xf4f4ef, roughness: 0.6 });
  const lidM = new THREE.MeshStandardMaterial({ color: 0x2fa36b, roughness: 0.6 });
  for (const ty of [0.4725, 0.935]) {
    for (const bz of [4.6, 5.25, 5.9]) {
      scene.add(P.cyl(0.11, 0.1, 0.24, 14, binM, 0.25, ty + 0.12, bz));
      scene.add(P.cyl(0.115, 0.115, 0.02, 14, lidM, 0.25, ty + 0.25, bz));
    }
  }
  for (const bz of [4.7, 5.3, 5.9]) {
    scene.add(P.box(0.3, 0.2, 0.24, M.kraft, 0.25, 1.3975 + 0.1, bz));
  }
  for (const jz of [4.65, 5.05, 5.45, 5.85]) {
    const jar = P.grainJar(jz * 13 % 1 > 0.5 ? 0xd9c9a0 : 0xc9b482);
    jar.position.set(0.25, 1.86, jz);
    scene.add(jar);
  }
  const ext = P.extinguisher(); ext.position.set(0.28, 0, 6.85); reg('extinguisher', ext, 'floor');

  /* ============ pickup counter + storage (x 6.2-8.4) ============ */

  const pick = P.grp(0, 0, 0);
  pick.add(P.box(1.95, 0.88, 0.6, M.counterWhite, 7.275, 0.44, 3.75));
  pick.add(P.box(1.85, 0.08, 0.5, M.charcoal, 7.275, 0.04, 3.75));
  pick.add(P.box(2.0, 0.04, 0.64, M.stainless, 7.275, 0.92, 3.75));
  pick.add(P.box(1.95, 0.5, 0.02, M.oakDark, 7.275, 0.55, 3.444));
  pick.add(P.box(1.95, 0.16, 0.02, M.brandGreen, 7.275, 0.82, 3.444));
  // two-tier order shelves
  for (const [px, pz] of [[6.5, 3.55], [7.5, 3.55], [6.5, 3.95], [7.5, 3.95]]) {
    pick.add(P.cyl(0.008, 0.008, 0.24, 8, M.stainless, px, 1.06, pz));
  }
  pick.add(P.box(1.1, 0.015, 0.5, M.glassCase, 7.0, 1.18, 3.75));
  for (const [px, pz] of [[6.55, 3.6], [7.45, 3.6], [6.55, 3.9], [7.45, 3.9]]) {
    pick.add(P.cyl(0.008, 0.008, 0.26, 8, M.stainless, px, 1.31, pz));
  }
  pick.add(P.box(1.0, 0.015, 0.44, M.glassCase, 7.0, 1.44, 3.75));
  [6.6, 6.9, 7.2, 7.5].forEach((bx) => {
    const b = P.ecoBox(); b.position.set(bx, 1.1875, 3.75); pick.add(b);
  });
  [6.7, 7.05, 7.4].forEach((bx) => {
    const b = P.ecoBox(); b.position.set(bx, 1.4475, 3.75); pick.add(b);
  });
  // heated case for instant orders
  pick.add(P.box(0.56, 0.06, 0.5, M.stainless, 7.92, 0.95, 3.75));
  pick.add(P.box(0.56, 0.44, 0.012, M.glassCase, 7.92, 1.22, 3.995));
  pick.add(P.box(0.56, 0.44, 0.012, M.glassCase, 7.92, 1.22, 3.505));
  pick.add(P.box(0.012, 0.44, 0.5, M.glassCase, 8.195, 1.22, 3.75));
  pick.add(P.box(0.012, 0.44, 0.5, M.glassCase, 7.645, 1.22, 3.75));
  pick.add(P.box(0.58, 0.03, 0.52, M.stainless, 7.92, 1.455, 3.75));
  pick.add(P.box(0.5, 0.015, 0.44, M.stainlessBrushed, 7.92, 1.13, 3.75));
  const hb1 = P.ecoBox(); hb1.position.set(7.8, 1.1375, 3.75); pick.add(hb1);
  const hb2 = P.ecoBox(); hb2.position.set(8.05, 1.1375, 3.75); pick.add(hb2);
  pick.add(P.box(0.4, 0.012, 0.35, M.lightWarm, 7.92, 1.441, 3.75));
  // QR / card standee with a traceability card tilted toward customers
  const standeeG = P.grp(6.55, 0.94, 3.6);
  standeeG.rotation.x = -0.5;
  standeeG.add(P.box(0.14, 0.015, 0.2, M.charcoal, 0, 0.02, 0));
  standeeG.add(P.plane(0.11, 0.14, S.trace(), 0, 0.048, 0));
  standeeG.children[1].rotation.x = -Math.PI / 2;
  pick.add(standeeG);
  reg('pickup-counter', pick, 'floor');

  // hanging pickup sign
  const psign = P.grp(0, 0, 0);
  const ps1 = P.plane(0.95, 0.32, S.pickup(), 7.45, 2.2, 3.739);
  ps1.rotation.y = Math.PI;
  psign.add(ps1);
  const ps2 = P.plane(0.95, 0.32, S.pickup(), 7.45, 2.2, 3.761);
  psign.add(ps2);
  psign.add(P.box(0.95, 0.035, 0.03, M.oakDark, 7.45, 2.375, 3.75));
  psign.add(P.box(0.95, 0.035, 0.03, M.oakDark, 7.45, 2.025, 3.75));
  psign.add(P.cyl(0.004, 0.004, 0.62, 6, M.charcoal, 7.13, 2.68, 3.75));
  psign.add(P.cyl(0.004, 0.004, 0.62, 6, M.charcoal, 7.77, 2.68, 3.75));
  reg('pickup-sign', psign, 'none');

  // dry storage along right wall + crates
  const rrack = P.storageRack(0.5, 1.9, 4, 1.85);
  rrack.position.set(8.15, 0, 5.55);
  reg('storage-rack', rrack, 'floor');
  for (const ty of [0.01, 0.4725, 0.935]) {
    for (const bz of [5.05, 5.95]) {
      scene.add(P.box(0.34, 0.24, 0.28, M.kraft, 8.15, ty + 0.12, bz));
      scene.add(P.box(0.06, 0.006, 0.28, M.brandGreen, 8.15, ty + 0.243, bz));
    }
  }
  for (const pz of [5.0, 5.35, 5.7]) {
    scene.add(P.cyl(0.06, 0.06, 0.24, 12, M.counterWhite, 8.15, 1.3975 + 0.12, pz));
  }
  const cst1 = P.grp(7.15, 0, 5.35);
  cst1.add(P.crate(0x2fa36b));
  const cst1b = P.crate(0x1c7a4e); cst1b.position.y = 0.245; cst1.add(cst1b);
  reg('crate-stack-1', cst1, 'floor');
  const cst2 = P.crate(0x2fa36b); cst2.position.set(7.15, 0, 5.95);
  reg('crate-2', cst2, 'floor');

  const faid = P.firstAidBox(); faid.position.set(7.85, 1.75, 7.14); reg('first-aid', faid, 'none');

  /* ============ front of house (z 0-3.2) ============ */

  // window bar + stools
  const bar = P.grp(0, 0, 0);
  bar.add(P.box(2.7, 0.04, 0.37, M.oak, 1.7, 1.0, 0.365));
  for (const bx of [0.5, 1.7, 2.9]) {
    bar.add(P.box(0.05, 0.98, 0.05, M.counterWhite, bx, 0.49, 0.32));
  }
  reg('window-bar', bar, 'floor');
  const barStools = P.grp(0, 0, 0);
  [0.75, 1.4, 2.05, 2.7].forEach((sx) => {
    const st = P.stool(); st.position.set(sx, 0, 0.95); barStools.add(st);
  });
  reg('bar-stools', barStools, 'floor');

  // communal table + 6 stools
  const ct = P.communalTable(); ct.position.set(2.4, 0, 1.825);
  reg('communal-table', ct, 'floor');
  const cstools = P.grp(0, 0, 0);
  [1.7, 2.4, 3.1].forEach((sx) => {
    const a = P.stool(); a.position.set(sx, 0, 1.0); cstools.add(a);
    const b = P.stool(); b.position.set(sx, 0, 2.65); cstools.add(b);
  });
  reg('communal-stools', cstools, 'floor');

  // two 2-top tables with chairs
  [[4.55, 0.85], [4.55, 2.15]].forEach(([tx, tz], i) => {
    const t = P.roundTable(); t.position.set(tx, 0, tz);
    reg(`round-table-${i + 1}`, t, 'floor');
    const c1 = P.chair(); c1.position.set(tx - 0.55, 0, tz); c1.rotation.y = Math.PI / 2;
    reg(`chair-${i + 1}a`, c1, 'floor');
    const c2 = P.chair(); c2.position.set(tx + 0.55, 0, tz); c2.rotation.y = -Math.PI / 2;
    reg(`chair-${i + 1}b`, c2, 'floor');
  });

  // self-service kiosks OUTSIDE, both on the right-hand side of the main door
  // as you face it, against the shopfront glass, screens facing the street
  const k1 = P.kiosk(); k1.position.set(6.02, 0, -0.3); k1.rotation.y = -Math.PI / 2;
  reg('kiosk-1-outdoor', k1, 'none');
  const k2 = P.kiosk(); k2.position.set(5.3, 0, -0.3); k2.rotation.y = -Math.PI / 2;
  reg('kiosk-2-outdoor', k2, 'none');

  // outdoor queue: pavement + two rails PERPENDICULAR to the shopfront,
  // single-file lane from the street straight to the kiosks
  const pave = P.plane(2.9, 3.5, new THREE.MeshStandardMaterial({ color: 0xe6e6df, roughness: 0.95 }), 5.17, -0.012, -1.8);
  pave.rotation.x = -Math.PI / 2;
  pave.receiveShadow = true;
  scene.add(pave);
  const railW = P.queueRail(1.9); railW.position.set(4.72, 0, -1.0); railW.rotation.y = Math.PI / 2;
  reg('queue-rail-west', railW, 'none');
  const railE = P.queueRail(1.9); railE.position.set(5.62, 0, -1.0); railE.rotation.y = Math.PI / 2;
  reg('queue-rail-east', railE, 'none');
  // lane: open at the street end (entry), head opens between the rails
  // straight onto the two kiosks
  const qSign = P.standingSign(S.queueSign()); qSign.position.set(5.17, 0, -3.3);
  reg('queue-sign', qSign, 'none');

  // visual reference display (1:1 portion models), right wall inside
  const vit = P.vitrine(); vit.position.set(8.14, 0, 2.3);
  reg('portion-vitrine', vit, 'floor');
  const vitSign = P.plane(0.62, 0.31, S.scoopGuide(), 8.386, 1.95, 2.3);
  vitSign.rotation.y = -Math.PI / 2;
  reg('vitrine-sign', vitSign, 'none');

  // right-wall menu board above kiosks
  const rmenuG = P.grp();
  const rmenu = P.plane(0.78, 0.62, S.menuA(), 8.386, 2.0, 1.05);
  rmenu.rotation.y = -Math.PI / 2;
  rmenuG.add(rmenu);
  rmenuG.add(P.box(0.02, 0.66, 0.82, M.oakDark, 8.392, 2.0, 1.05));
  reg('right-menu', rmenuG, 'none');

  // recycle bins by the door
  const b1 = P.recycleBin(0x27a468); b1.position.set(7.92, 0, 0.3); reg('bin-1', b1, 'floor');
  const b2 = P.recycleBin(0x1c7a4e); b2.position.set(8.24, 0, 0.3); reg('bin-2', b2, 'floor');

  // entrance mat + pickup floor decal
  const mat = P.box(1.25, 0.012, 0.75, M.deepGreen, 7.05, 0.006, 0.62);
  mat.castShadow = false;
  scene.add(mat);
  const decal = P.plane(1.6, 0.8, S.decal(), 7.0, 0.009, 3.0);
  decal.rotation.x = -Math.PI / 2;
  scene.add(decal);

  // hanging menu boards over the open counter (content on both faces)
  const mb1 = P.grp(0, 0, 0);
  const mbf1 = P.box(1.39, 0.82, 0.025, M.oakDark, 1.55, 2.14, 3.5);
  mb1.add(mbf1);
  const mbp1 = P.plane(1.35, 0.78, S.menuA(), 1.55, 2.14, 3.486);
  mbp1.rotation.y = Math.PI;
  mb1.add(mbp1);
  mb1.add(P.plane(1.35, 0.78, S.menuB(), 1.55, 2.14, 3.514));
  mb1.add(P.cyl(0.004, 0.004, 0.44, 6, M.charcoal, 1.05, 2.77, 3.5));
  mb1.add(P.cyl(0.004, 0.004, 0.44, 6, M.charcoal, 2.05, 2.77, 3.5));
  reg('menu-board-1', mb1, 'none');
  const mb2 = P.grp(0, 0, 0);
  mb2.add(P.box(1.39, 0.82, 0.025, M.oakDark, 3.0, 2.14, 3.5));
  const mbp2 = P.plane(1.35, 0.78, S.menuA(), 3.0, 2.14, 3.486);
  mbp2.rotation.y = Math.PI;
  mb2.add(mbp2);
  mb2.add(P.plane(1.35, 0.78, S.menuA(), 3.0, 2.14, 3.514));
  mb2.add(P.cyl(0.004, 0.004, 0.44, 6, M.charcoal, 2.5, 2.77, 3.5));
  mb2.add(P.cyl(0.004, 0.004, 0.44, 6, M.charcoal, 3.5, 2.77, 3.5));
  reg('menu-board-2', mb2, 'none');

  /* ============ wall decor & branding ============ */

  const logoP = P.plane(0.95, 0.95, S.logo(), 0.013, 1.95, 1.8);
  logoP.rotation.y = Math.PI / 2;
  scene.add(logoP);
  const neonP = P.plane(1.7, 0.37, S.neon(), 0.013, 1.28, 1.8);
  neonP.rotation.y = Math.PI / 2;
  scene.add(neonP);
  [[0.7, S.poster1()], [2.8, S.poster2()]].forEach(([pz, matr]) => {
    scene.add(P.box(0.02, 0.68, 0.5, M.oakDark, 0.01, 1.62, pz));
    const pp = P.plane(0.46, 0.64, matr, 0.024, 1.62, pz);
    pp.rotation.y = Math.PI / 2;
    scene.add(pp);
  });

  const quoteP = P.plane(1.7, 0.42, S.quote(), 7.3, 2.35, D - 0.013);
  quoteP.rotation.y = Math.PI;
  scene.add(quoteP);
  const menuB = P.plane(0.9, 0.49, S.menuB(), 7.3, 1.7, D - 0.013);
  menuB.rotation.y = Math.PI;
  scene.add(menuB);
  const clock = P.clockProp(); clock.position.set(6.35, 2.45, 7.16);
  scene.add(clock);

  // frosted brand band on the shopfront glass + door stickers
  const frost = P.plane(6.0, 0.28, S.frost(), 3.25, 1.47, 0.016);
  scene.add(frost);
  const hours = P.plane(0.28, 0.28, S.hours(), 6.85, 1.55, 0.02);
  scene.add(hours);
  const doorLogo = P.plane(0.3, 0.3, S.logo(), 7.35, 1.5, 0.02);
  scene.add(doorLogo);

  // garland across the shopfront
  const garl = P.garland(2.95, 0, 0.12);
  garl.position.set(3.25, 2.55, 0);
  scene.add(garl);

  // plants (floor pots + one on the communal table)
  const pl1 = P.pottedPlant(true); pl1.position.set(3.35, 0, 0.35); reg('plant-1', pl1, 'floor');
  const pl2 = P.pottedPlant(true); pl2.position.set(0.3, 0, 2.9); reg('plant-2', pl2, 'floor');
  const tpl = P.pottedPlant(true); tpl.position.set(2.4, 0.78, 1.83); reg('table-plant', tpl, 'none');

  // ceiling fittings
  scene.add(P.box(0.88, 0.1, 0.88, M.counterWhite, 5.9, 2.93, 1.55));
  const acv = P.plane(0.8, 0.8, new THREE.MeshStandardMaterial({ color: 0xdfe3df, roughness: 0.7 }), 5.9, 2.878, 1.55);
  acv.rotation.x = Math.PI / 2;
  scene.add(acv);
  [[3.0, 0.7], [6.4, 5.4]].forEach(([sx, sz]) => {
    const sp = P.sph(0.06, M.counterWhite, sx, 2.955, sz, 12);
    sp.scale.y = 0.5;
    scene.add(sp);
  });
  for (const [px, pz] of [[1.05, 0.37], [2.45, 0.37], [1.5, 2.2], [2.75, 1.5], [4.55, 1.5]]) {
    const pl = P.pendantLamp(); pl.position.set(px, 0, pz);
    scene.add(pl);
  }

  return {
    steamAnchors: [
      [1.15, 1.1, 3.5],
      [2.85, 1.1, 3.5],
      [3.25, 1.3, 6.62],
    ],
  };
}
