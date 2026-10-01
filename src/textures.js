// Programmatic canvas textures for the NutriByte HKUST MVP interior.
// All signage is bilingual (Chinese + English). No external assets.
import * as THREE from 'three';

function makeCanvas(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const FONT = '"Microsoft YaHei", "PingFang SC", sans-serif';

// shrink font size until text fits maxWidth
function fitFont(ctx, text, maxWidth, px, weight = 'bold ') {
  let size = px;
  ctx.font = `${weight}${size}px ${FONT}`;
  while (ctx.measureText(text).width > maxWidth && size > 12) {
    size -= 2;
    ctx.font = `${weight}${size}px ${FONT}`;
  }
  return size;
}

/* ---------------- floors ---------------- */

export function terrazzoTexture() {
  const t = makeCanvas(512, 512, (ctx) => {
    ctx.fillStyle = '#f2efe7';
    ctx.fillRect(0, 0, 512, 512);
    const colors = ['#a8b0a9', '#2fa36b', '#cfc8b8', '#6b7f74', '#e4e0d5', '#8fae9c'];
    for (let i = 0; i < 750; i++) {
      ctx.fillStyle = colors[(Math.random() * colors.length) | 0];
      ctx.globalAlpha = 0.35 + Math.random() * 0.45;
      const r = 0.8 + Math.random() * 2.6;
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 512, r, r * (0.6 + Math.random() * 0.5), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function kitchenTileTexture() {
  const t = makeCanvas(256, 256, (ctx) => {
    ctx.fillStyle = '#dff0e6';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#c3ddcd';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 256; i += 64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
    for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) {
      ctx.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.05})`;
      ctx.fillRect(x * 64 + 2, y * 64 + 2, 60, 60);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ---------------- wood ---------------- */

export function woodTexture(base = '#d9b98c', streak = '#c39b68') {
  const t = makeCanvas(512, 512, (ctx) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) {
      ctx.strokeStyle = streak;
      ctx.globalAlpha = 0.08 + Math.random() * 0.16;
      ctx.lineWidth = 1 + Math.random() * 3;
      const y = Math.random() * 512;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(170, y + (Math.random() * 14 - 7), 340, y + (Math.random() * 14 - 7), 512, y + (Math.random() * 10 - 5));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ---------------- signage ---------------- */

export function logoTexture() {
  return makeCanvas(512, 512, (ctx) => {
    roundRect(ctx, 8, 8, 496, 496, 96);
    ctx.fillStyle = '#27a468';
    ctx.fill();
    // bowl
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 240, 128, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(138, 230, 236, 22);
    // steam
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    for (const dx of [-52, 0, 52]) {
      ctx.beginPath();
      ctx.moveTo(256 + dx, 168);
      ctx.bezierCurveTo(256 + dx - 22, 130, 256 + dx + 22, 102, 256 + dx, 62);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    fitFont(ctx, 'NutriByte', 440, 84);
    ctx.fillText('NutriByte', 256, 420);
    ctx.font = `34px ${FONT}`;
    ctx.fillText('营养轻食 NUTRITION BITES', 256, 470);
  });
}

// items: [cn, en, price]
export function menuBoardTexture(title, items, footer) {
  return makeCanvas(1024, 560, (ctx) => {
    ctx.fillStyle = '#1c7a4e';
    ctx.fillRect(0, 0, 1024, 560);
    ctx.fillStyle = '#27a468';
    ctx.fillRect(0, 0, 1024, 92);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    fitFont(ctx, title, 760, 50);
    ctx.fillText(title, 44, 62);
    ctx.textAlign = 'right';
    ctx.font = `bold 30px ${FONT}`;
    ctx.fillText('MENU', 980, 60);
    let y = 166;
    for (const [cn, en, price] of items) {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      fitFont(ctx, cn, 700, 34);
      ctx.fillText(cn, 48, y);
      ctx.fillStyle = '#bfe8d2';
      fitFont(ctx, en, 700, 21, '');
      ctx.fillText(en, 48, y + 30);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 34px ${FONT}`;
      ctx.fillText(price, 976, y);
      y += 40;
      ctx.strokeStyle = 'rgba(255,255,255,0.26)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(48, y); ctx.lineTo(976, y); ctx.stroke();
      y += 42;
    }
    ctx.fillStyle = '#bfe8d2';
    ctx.textAlign = 'left';
    fitFont(ctx, footer, 930, 24, '');
    ctx.fillText(footer, 48, 536);
  });
}

// kicker (EN), cn line, en line, accent colour
export function posterTexture(kicker, cn, en, accent) {
  return makeCanvas(512, 720, (ctx) => {
    ctx.fillStyle = '#fbfbf8';
    ctx.fillRect(0, 0, 512, 720);
    ctx.strokeStyle = '#e2e6e0';
    ctx.lineWidth = 6;
    ctx.strokeRect(14, 14, 484, 692);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(256, 226, 106, 0, Math.PI);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1c7a4e';
    ctx.beginPath();
    ctx.arc(256, 248, 76, 0, Math.PI);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(196, 120, 22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(300, 96, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2e3330';
    ctx.textAlign = 'center';
    fitFont(ctx, cn, 430, 46);
    ctx.fillText(cn, 256, 462);
    ctx.fillStyle = '#5b6660';
    fitFont(ctx, en, 430, 26, '');
    ctx.fillText(en, 256, 520);
    ctx.fillStyle = '#8a948c';
    ctx.font = `22px ${FONT}`;
    ctx.fillText(kicker, 256, 646);
  });
}

// tagline wall: official brand tagline, bilingual
export function quoteTexture() {
  return makeCanvas(1024, 256, (ctx) => {
    ctx.clearRect(0, 0, 1024, 256);
    ctx.fillStyle = '#1c7a4e';
    ctx.textAlign = 'center';
    fitFont(ctx, '吃得好 · 省时间 · 花得少', 960, 74);
    ctx.fillText('吃得好 · 省时间 · 花得少', 512, 108);
    ctx.font = `34px ${FONT}`;
    ctx.fillStyle = '#2e3330';
    ctx.fillText('EAT WELL, SAVE TIME, SPEND LESS', 512, 190);
  });
}

export function neonTexture(text) {
  return makeCanvas(1024, 224, (ctx) => {
    ctx.clearRect(0, 0, 1024, 224);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#35e08a';
    ctx.shadowBlur = 34;
    ctx.fillStyle = '#7cffc0';
    ctx.font = `bold 88px ${FONT}`;
    ctx.fillText(text, 512, 112);
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#eafff4';
    ctx.fillText(text, 512, 112);
  });
}

export function frostBandTexture() {
  return makeCanvas(2048, 128, (ctx) => {
    ctx.clearRect(0, 0, 2048, 128);
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.fillRect(0, 0, 2048, 128);
    ctx.fillStyle = '#27a468';
    for (let x = 40; x < 2048; x += 560) {
      ctx.beginPath();
      ctx.arc(x, 64, 34, 0, Math.PI);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(x - 34, 56, 68, 8);
      ctx.fillStyle = '#2e3330';
      ctx.font = `bold 44px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.fillText('NutriByte 营养轻食 · HKUST', x + 52, 80);
      ctx.fillStyle = '#27a468';
    }
  });
}

export function pickupSignTexture() {
  return makeCanvas(768, 256, (ctx) => {
    roundRect(ctx, 6, 6, 756, 244, 36);
    ctx.fillStyle = '#27a468';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    fitFont(ctx, '自提 PICK-UP', 700, 92);
    ctx.fillText('自提 PICK-UP', 384, 118);
    ctx.font = `36px ${FONT}`;
    ctx.fillText('凭取餐号自取 · GRAB & GO', 384, 196);
  });
}

export function floorDecalTexture() {
  return makeCanvas(640, 320, (ctx) => {
    ctx.clearRect(0, 0, 640, 320);
    ctx.strokeStyle = '#27a468';
    ctx.lineWidth = 10;
    roundRect(ctx, 10, 10, 620, 300, 40);
    ctx.stroke();
    ctx.fillStyle = 'rgba(39,164,104,0.16)';
    roundRect(ctx, 10, 10, 620, 300, 40);
    ctx.fill();
    ctx.fillStyle = '#1c7a4e';
    ctx.textAlign = 'center';
    ctx.font = `bold 84px ${FONT}`;
    ctx.fillText('PICK-UP', 320, 140);
    ctx.font = `bold 52px ${FONT}`;
    ctx.fillText('自提区', 320, 226);
  });
}

export function scoopGuideTexture() {
  return makeCanvas(512, 256, (ctx) => {
    ctx.fillStyle = '#fbfbf8';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#27a468';
    ctx.fillRect(0, 0, 512, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 30px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('定量标准 SCOOP GUIDE', 256, 39);
    ctx.fillStyle = '#2e3330';
    const rows = [
      ['勺 1 蔬菜 40g', 'Scoop 1 · Veg 40g'],
      ['夹 2 烤肉 50g', 'Tongs 2 · Meat 50g'],
      ['泵 3 酱汁 10g', 'Pump 3 · Sauce 10g'],
    ];
    rows.forEach(([cn, en], i) => {
      const y = 104 + i * 52;
      ctx.font = `bold 30px ${FONT}`;
      ctx.fillText(cn, 256, y);
      ctx.fillStyle = '#79857d';
      ctx.font = `19px ${FONT}`;
      ctx.fillText(en, 256, y + 26);
      ctx.fillStyle = '#2e3330';
    });
  });
}

export function hoursTexture() {
  return makeCanvas(320, 320, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(160, 160, 152, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#27a468';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(160, 160, 146, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#27a468';
    ctx.textAlign = 'center';
    ctx.font = `bold 56px ${FONT}`;
    ctx.fillText('OPEN', 160, 112);
    ctx.font = `bold 30px ${FONT}`;
    ctx.fillText('营业中', 160, 152);
    ctx.fillStyle = '#2e3330';
    ctx.font = `24px ${FONT}`;
    ctx.fillText('周一至五 08:00-20:00', 160, 200);
    ctx.fillText('Mon-Fri', 160, 228);
    ctx.font = `24px ${FONT}`;
    ctx.fillText('周六 10:00-18:00', 160, 262);
  });
}

export function kdsTexture() {
  return makeCanvas(640, 440, (ctx) => {
    ctx.fillStyle = '#16211b';
    ctx.fillRect(0, 0, 640, 440);
    ctx.fillStyle = '#27a468';
    ctx.fillRect(0, 0, 640, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 32px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.fillText('KDS 厨房单据 · Kitchen Tickets', 20, 43);
    const rows = [
      ['A-037', '鸡胸高蛋白盒 x1', 'Chicken box x1', '装配中 Assembling', '#ffb36b'],
      ['A-038', '牛肉能量碗 x2', 'Bulgogi bowls x2', '待装配 Queued', '#ffffff'],
      ['B-112', '豆腐素食碗 x1', 'Tofu bowl x1', '已完成 Done', '#7cffc0'],
      ['B-113', '鸡胸高蛋白盒 x3', 'Chicken boxes x3', '待装配 Queued', '#ffffff'],
    ];
    let y = 112;
    for (const [id, cn, en, st, col] of rows) {
      ctx.fillStyle = '#22332a';
      roundRect(ctx, 16, y - 36, 608, 70, 10);
      ctx.fill();
      ctx.fillStyle = col;
      ctx.font = `bold 26px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.fillText(id, 32, y - 6);
      ctx.fillStyle = '#dfe8e2';
      ctx.font = `22px ${FONT}`;
      ctx.fillText(cn, 128, y - 6);
      ctx.fillStyle = '#9db3a6';
      ctx.font = `17px ${FONT}`;
      ctx.fillText(en, 128, y + 20);
      ctx.textAlign = 'right';
      ctx.fillStyle = col;
      ctx.font = `19px ${FONT}`;
      ctx.fillText(st, 608, y + 8);
      y += 82;
    }
  });
}

export function traceTexture() {
  return makeCanvas(320, 400, (ctx) => {
    ctx.fillStyle = '#fbfbf8';
    ctx.fillRect(0, 0, 320, 400);
    ctx.strokeStyle = '#e2e6e0'; ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 304, 384);
    ctx.fillStyle = '#2e3330';
    ctx.fillRect(52, 48, 216, 216);
    ctx.fillStyle = '#ffffff';
    for (let x = 0; x < 6; x++) for (let y = 0; y < 6; y++) {
      if ((x * 7 + y * 3 + x * y) % 3 !== 0) ctx.fillRect(64 + x * 34, 60 + y * 34, 24, 24);
    }
    ctx.fillStyle = '#2e3330';
    ctx.textAlign = 'center';
    ctx.font = `bold 30px ${FONT}`;
    ctx.fillText('扫码看食材溯源', 160, 312);
    ctx.font = `20px ${FONT}`;
    ctx.fillStyle = '#8a948c';
    ctx.fillText('SCAN FOR INGREDIENT SOURCE', 160, 350);
  });
}

// band + cn + optional en; used for scoop tags and vitrine labels
export function labelTexture(cn, en = '') {
  return makeCanvas(256, 128, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#27a468';
    ctx.fillRect(0, 0, 256, 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 20px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('NUTRIBYTE', 128, 24);
    if (en) {
      ctx.fillStyle = '#2e3330';
      ctx.font = `bold 34px ${FONT}`;
      ctx.fillText(cn, 128, 76);
      ctx.fillStyle = '#79857d';
      fitFont(ctx, en, 220, 20, '');
      ctx.fillText(en, 128, 108);
    } else {
      ctx.fillStyle = '#2e3330';
      ctx.font = `bold 52px ${FONT}`;
      ctx.fillText(cn, 128, 92);
    }
  });
}

// self-order kiosk UI, bilingual
export function kioskUiTexture() {
  return makeCanvas(512, 512, (ctx) => {
    ctx.fillStyle = '#f4f7f4';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#27a468';
    ctx.fillRect(0, 0, 512, 92);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = `bold 34px ${FONT}`;
    ctx.fillText('NutriByte 自助点餐', 22, 42);
    ctx.font = `20px ${FONT}`;
    ctx.fillText('SELF-ORDER KIOSK', 22, 72);
    const items = [
      ['A 招牌牛肉能量碗', 'Bulgogi Bowl', 'HK$48'],
      ['B 鸡胸高蛋白盒', 'Chicken Breast Box', 'HK$42'],
      ['C 豆腐素食碗', 'Tofu Veggie Bowl', 'HK$38'],
    ];
    items.forEach(([cn, en, price], i) => {
      const y = 118 + i * 112;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#dfe7e1';
      ctx.lineWidth = 3;
      roundRect(ctx, 24, y, 464, 94, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2e3330';
      ctx.font = `bold 27px ${FONT}`;
      ctx.fillText(cn, 44, y + 40);
      ctx.fillStyle = '#8a948c';
      ctx.font = `19px ${FONT}`;
      ctx.fillText(en, 44, y + 70);
      ctx.fillStyle = '#27a468';
      roundRect(ctx, 368, y + 22, 104, 50, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 25px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText(price, 420, y + 55);
      ctx.textAlign = 'left';
    });
    ctx.fillStyle = '#2e3330';
    ctx.font = `23px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('扫码下单 · 凭号自取 SCAN & COLLECT', 256, 478);
  });
}

export function queueSignTexture() {
  return makeCanvas(320, 320, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 320, 320);
    ctx.fillStyle = '#27a468';
    ctx.fillRect(0, 0, 320, 62);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 27px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('NutriByte 自助点餐', 160, 41);
    ctx.fillStyle = '#2e3330';
    ctx.font = `bold 42px ${FONT}`;
    ctx.fillText('请在此排队', 160, 126);
    ctx.font = `bold 23px ${FONT}`;
    ctx.fillText('SELF-ORDER QUEUE', 160, 164);
    ctx.fillStyle = '#5b6660';
    ctx.font = `21px ${FONT}`;
    ctx.fillText('点餐后凭号入店自取', 160, 212);
    ctx.font = `19px ${FONT}`;
    ctx.fillText('ORDER HERE, COLLECT INSIDE', 160, 244);
    ctx.fillStyle = '#27a468';
    for (const ax of [116, 204]) {
      ctx.beginPath();
      ctx.moveTo(ax - 15, 272); ctx.lineTo(ax + 15, 272); ctx.lineTo(ax, 302);
      ctx.closePath(); ctx.fill();
    }
  });
}

export function gradientBackdropTexture() {
  return makeCanvas(64, 512, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#f7fbf7');
    g.addColorStop(0.55, '#e2f1e7');
    g.addColorStop(1, '#cfe7d8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 512);
  });
}

export function steamTexture() {
  const t = makeCanvas(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 6, 64, 64, 62);
    g.addColorStop(0, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.30)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
