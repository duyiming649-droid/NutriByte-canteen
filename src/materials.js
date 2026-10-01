// Shared PBR materials. Single instances reused across props.
import * as THREE from 'three';
import * as T from './textures.js';

const std = (opts) => new THREE.MeshStandardMaterial(opts);

export const M = {
  // palette
  brandGreen: std({ color: 0x27a468, roughness: 0.55 }),
  deepGreen: std({ color: 0x1c7a4e, roughness: 0.6 }),
  mintPaint: std({ color: 0xe8f4ec, roughness: 0.9 }),
  wallWhite: std({ color: 0xf7f8f5, roughness: 0.95 }),
  ceiling: std({ color: 0xfbfcf9, roughness: 0.95 }),
  charcoal: std({ color: 0x2e3330, roughness: 0.7 }),
  steelDark: std({ color: 0x3a3f3c, roughness: 0.5, metalness: 0.6 }),

  // metals / tops
  stainless: std({ color: 0xc9cdd0, roughness: 0.38, metalness: 0.85 }),
  stainlessBrushed: std({ color: 0xb8bec2, roughness: 0.45, metalness: 0.75 }),
  counterWhite: std({ color: 0xfafaf7, roughness: 0.4 }),

  // wood & kraft
  oak: std({ map: T.woodTexture(), roughness: 0.62 }),
  oakDark: std({ map: T.woodTexture('#b98f5f', '#a37b4d'), roughness: 0.65 }),
  kraft: std({ color: 0xe6dcc3, roughness: 0.85 }),

  // glass
  glass: new THREE.MeshPhysicalMaterial({
    color: 0xdff2e8, roughness: 0.08, metalness: 0, transparent: true,
    opacity: 0.16, side: THREE.DoubleSide, depthWrite: false,
  }),
  glassCase: new THREE.MeshPhysicalMaterial({
    color: 0xe8f6ef, roughness: 0.05, transparent: true, opacity: 0.22,
    side: THREE.DoubleSide, depthWrite: false,
  }),

  // floors
  terrazzo: std({ map: T.terrazzoTexture(), roughness: 0.35 }),
  kitchenTile: std({ map: T.kitchenTileTexture(), roughness: 0.3 }),

  // fabrics
  feltGreen: std({ color: 0x9fd4b4, roughness: 1 }),

  // lights-emissive
  lightWarm: std({ color: 0xfff3e0, emissive: 0xffdcae, emissiveIntensity: 1.15 }),
  lightWhite: std({ color: 0xffffff, emissive: 0xf2fff6, emissiveIntensity: 1.4 }),
  glowGreen: std({ color: 0x27a468, emissive: 0x27a468, emissiveIntensity: 0.9 }),
  glowAmber: std({ color: 0x8a5a2a, emissive: 0xb96a25, emissiveIntensity: 0.55 }),
};

// one-off texture-backed materials created lazily and cached
const cache = new Map();
export function texMat(key, build) {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key);
}

export const signMaterials = {
  logo: () => texMat('logo', () => std({ map: T.logoTexture(), roughness: 0.5 })),
  menuA: () => texMat('menuA', () => std({ map: T.menuBoardTexture('今日菜单 TODAY', [
    ['A · 招牌韩式牛肉能量碗', 'Signature Bulgogi Bowl', 'HK$48'],
    ['B · 香烤鸡胸高蛋白盒', 'Grilled Chicken Breast Box', 'HK$42'],
    ['C · 板豆腐素食碗', 'Tofu Veggie Bowl', 'HK$38'],
    ['加购 · 30g西兰花 / 50g糙米饭', 'Add-on: broccoli 30g / brown rice 50g', '+HK$6'],
  ], '克重标准化 Standardised grams · 前一天APP下单省HK$2 Order a day ahead, save HK$2'), roughness: 0.6 })),
  menuB: () => texMat('menuB', () => std({ map: T.menuBoardTexture('自取指南 PICKUP GUIDE', [
    ['预订订单 · 前一天APP下单', 'Pre-orders (ordered yesterday)', 'A 架'],
    ['现场订单 · Kiosk 现点', 'Walk-in orders at kiosk', 'B 架'],
    ['热食保温 · 即到即取', 'Hot case, ready to go', 'HOT'],
  ], '请核对小票取餐号 · Please check your order number'), roughness: 0.6 })),
  poster1: () => texMat('poster1', () => std({ map: T.posterTexture('NUTRIBYTE · HKUST', '期中周，也要好好吃饭', 'EAT WELL EVEN IN FINALS WEEK', '#ff9f45'), roughness: 0.8 })),
  poster2: () => texMat('poster2', () => std({ map: T.posterTexture('NUTRIBYTE · FRESH DAILY', '每日鲜送，从清洗到装盒', 'PREPPED & BOXED IN-STORE DAILY', '#27a468'), roughness: 0.8 })),
  quote: () => texMat('quote', () => new THREE.MeshBasicMaterial({ map: T.quoteTexture(), transparent: true })),
  neon: () => texMat('neon', () => new THREE.MeshBasicMaterial({ map: T.neonTexture('EAT FRESH · 吃得新鲜'), transparent: true, toneMapped: false })),
  frost: () => texMat('frost', () => new THREE.MeshBasicMaterial({ map: T.frostBandTexture(), transparent: true, opacity: 0.92 })),
  pickup: () => texMat('pickup', () => std({ map: T.pickupSignTexture(), roughness: 0.55 })),
  decal: () => texMat('decal', () => new THREE.MeshBasicMaterial({ map: T.floorDecalTexture(), transparent: true, opacity: 0.9 })),
  scoopGuide: () => texMat('scoopGuide', () => std({ map: T.scoopGuideTexture(), roughness: 0.7 })),
  hours: () => texMat('hours', () => std({ map: T.hoursTexture(), roughness: 0.6, transparent: true })),
  kds: () => texMat('kds', () => std({ map: T.kdsTexture(), roughness: 0.35, emissive: 0xdfffe8, emissiveIntensity: 0.5, emissiveMap: T.kdsTexture() })),
  trace: () => texMat('trace', () => std({ map: T.traceTexture(), roughness: 0.8 })),
  queueSign: () => texMat('queueSign', () => new THREE.MeshBasicMaterial({ map: T.queueSignTexture() })),
  backdrop: () => texMat('backdrop', () => new THREE.MeshBasicMaterial({ map: T.gradientBackdropTexture(), side: THREE.DoubleSide, depthWrite: false })),
};
