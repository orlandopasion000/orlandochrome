import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { spawn } from 'node:child_process';

const ROOT_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const THREE_DIR = 'C:\\Users\\Orlando\\.gemini\\antigravity\\brain\\15adc93a-4633-48b3-91ab-72d7cbd3f039\\scratch\\true3d_studio\\node_modules\\three';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const STUDIO_HTML = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;}</style>
<script type="importmap">
{
  "imports": {
    "three": "/three/build/three.module.js",
    "three/addons/": "/three/examples/jsm/"
  }
}
</script>
</head>
<body>
<canvas id="c" width="512" height="512"></canvas>
<script type="module">
import * as THREE from 'three';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(512, 512, false);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.86;
renderer.outputColorSpace = THREE.SRGBColorSpace;

function buildLuxuryEnvMap() {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x050814);
  const stripMatWarm = new THREE.MeshBasicMaterial({ color: new THREE.Color(4.8, 3.8, 2.0) });
  const stripMatCool = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.9, 4.1, 6.2) });
  const stripMatWhite = new THREE.MeshBasicMaterial({ color: new THREE.Color(5.8, 5.9, 6.2) });
  const darkFill = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.24, 0.28, 0.42) });

  const panels = [
    { pos: [6, 7, 6], rot: [-0.6, 0.7, 0], size: [7, 2.4, 0.2], mat: stripMatWhite },
    { pos: [-7, 4, 5], rot: [0.2, 1.0, 0], size: [5, 2.2, 0.2], mat: stripMatCool },
    { pos: [3, -6, 6], rot: [0.7, 0.2, 0], size: [6, 1.8, 0.2], mat: stripMatWarm },
    { pos: [0, 8, -4], rot: [1.1, 0, 0], size: [8, 2.0, 0.2], mat: stripMatWarm },
    { pos: [-5, -5, -5], rot: [0, 0.8, 0], size: [6, 6, 0.2], mat: darkFill }
  ];
  for (const p of panels) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(...p.size), p.mat);
    m.position.set(...p.pos);
    m.rotation.set(...p.rot);
    envScene.add(m);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  return pmrem.fromScene(envScene, 0.04).texture;
}

const scene = new THREE.Scene();
scene.environment = buildLuxuryEnvMap();
scene.environmentIntensity = 1.35;

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 0, 5.5);

const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.1);
keyLight.position.set(3.5, 4.8, 4.8);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.15);
fillLight.position.set(-4.5, -1.8, 3.2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xfde047, 1.6);
rimLight.position.set(0.4, 4.2, -4.5);
scene.add(rimLight);

const rootGroup = new THREE.Group();
scene.add(rootGroup);

function makeGuillocheBump() {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 512;
  const g = cv.getContext('2d');
  g.fillStyle = '#808080';
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = '#ffffff';
  g.lineWidth = 2;
  for (let i = 0; i < 64; i++) {
    const y = i * 8;
    g.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const yy = y + Math.sin(x * 0.049 + i * 0.5) * 4;
      if (x === 0) g.moveTo(x, yy); else g.lineTo(x, yy);
    }
    g.globalAlpha = (i % 2 === 0) ? 0.45 : 0.25;
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}
const filigreeBump = makeGuillocheBump();

// Balanced Rich Jewel & Precious Metal Materials (Zero Washed-Out White!)
const M = {
  gold: new THREE.MeshPhysicalMaterial({ color: 0xd99b26, metalness: 0.94, roughness: 0.19, clearcoat: 0.7, bumpMap: filigreeBump, bumpScale: 0.02, envMapIntensity: 1.8 }),
  roseGold: new THREE.MeshPhysicalMaterial({ color: 0xd97757, metalness: 0.92, roughness: 0.18, clearcoat: 0.72, bumpMap: filigreeBump, bumpScale: 0.018, envMapIntensity: 1.8 }),
  platinum: new THREE.MeshPhysicalMaterial({ color: 0xc8d6e8, metalness: 0.96, roughness: 0.15, clearcoat: 0.75, bumpMap: filigreeBump, bumpScale: 0.015, envMapIntensity: 1.8 }),
  pearl: new THREE.MeshPhysicalMaterial({ color: 0xdbeafe, metalness: 0.22, roughness: 0.18, clearcoat: 0.9, iridescence: 0.5, envMapIntensity: 1.55 }),
  sapphire: new THREE.MeshPhysicalMaterial({ color: 0x1d4ed8, metalness: 0.45, roughness: 0.14, clearcoat: 0.95, emissive: 0x0f2f7a, emissiveIntensity: 0.22, flatShading: true, envMapIntensity: 1.75 }),
  cobaltEnamel: new THREE.MeshPhysicalMaterial({ color: 0x1e3a8a, metalness: 0.55, roughness: 0.18, clearcoat: 0.9, bumpMap: filigreeBump, bumpScale: 0.014, envMapIntensity: 1.6 }),
  skyGem: new THREE.MeshPhysicalMaterial({ color: 0x0284c7, metalness: 0.24, roughness: 0.08, clearcoat: 1.0, iridescence: 0.55, emissive: 0x0369a1, emissiveIntensity: 0.28, flatShading: true, envMapIntensity: 1.85 }),
  aquaGem: new THREE.MeshPhysicalMaterial({ color: 0x0d9488, metalness: 0.22, roughness: 0.08, clearcoat: 1.0, iridescence: 0.5, emissive: 0x0f766e, emissiveIntensity: 0.28, flatShading: true, envMapIntensity: 1.85 }),
  amberGem: new THREE.MeshPhysicalMaterial({ color: 0xd97706, metalness: 0.24, roughness: 0.08, clearcoat: 1.0, iridescence: 0.45, emissive: 0xb45309, emissiveIntensity: 0.30, flatShading: true, envMapIntensity: 1.85 }),
  citrineSmooth: new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, metalness: 0.20, roughness: 0.10, clearcoat: 1.0, emissive: 0xb45309, emissiveIntensity: 0.28, envMapIntensity: 1.7 }),
  amethystGem: new THREE.MeshPhysicalMaterial({ color: 0x7e22ce, metalness: 0.26, roughness: 0.08, clearcoat: 1.0, iridescence: 0.65, emissive: 0x581c87, emissiveIntensity: 0.30, flatShading: true, envMapIntensity: 1.85 }),
  roseGem: new THREE.MeshPhysicalMaterial({ color: 0xdb2777, metalness: 0.22, roughness: 0.08, clearcoat: 1.0, iridescence: 0.55, emissive: 0x9d174d, emissiveIntensity: 0.26, flatShading: true, envMapIntensity: 1.85 }),
  emeraldGem: new THREE.MeshPhysicalMaterial({ color: 0x059669, metalness: 0.22, roughness: 0.08, clearcoat: 1.0, iridescence: 0.50, emissive: 0x065f46, emissiveIntensity: 0.26, flatShading: true, envMapIntensity: 1.85 }),
  indigoDial: new THREE.MeshPhysicalMaterial({ color: 0x172554, metalness: 0.52, roughness: 0.16, clearcoat: 0.92, bumpMap: filigreeBump, bumpScale: 0.015, envMapIntensity: 1.65 }),
  cyanGlow: new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, metalness: 0.15, roughness: 0.12, emissive: 0x0ea5e9, emissiveIntensity: 0.62, envMapIntensity: 1.7 }),
  violetGlow: new THREE.MeshPhysicalMaterial({ color: 0xa855f7, metalness: 0.18, roughness: 0.12, emissive: 0x7e22ce, emissiveIntensity: 0.68, envMapIntensity: 1.7 }),

  // Menacing Bad Node Dark PBR Metals & Hazard Emissions
  obsidian: new THREE.MeshPhysicalMaterial({ color: 0x10131c, metalness: 0.88, roughness: 0.24, clearcoat: 0.8, bumpMap: filigreeBump, bumpScale: 0.025, envMapIntensity: 1.4 }),
  gunmetal: new THREE.MeshPhysicalMaterial({ color: 0x262b38, metalness: 0.94, roughness: 0.28, clearcoat: 0.5, envMapIntensity: 1.45 }),
  basalt: new THREE.MeshPhysicalMaterial({ color: 0x1f191a, metalness: 0.32, roughness: 0.72, flatShading: true, envMapIntensity: 1.0 }),
  darkCopper: new THREE.MeshPhysicalMaterial({ color: 0x5c2d16, metalness: 0.92, roughness: 0.24, clearcoat: 0.45, envMapIntensity: 1.45 }),
  darkVioletMetal: new THREE.MeshPhysicalMaterial({ color: 0x1e1133, metalness: 0.88, roughness: 0.20, clearcoat: 0.78, envMapIntensity: 1.45 }),
  crimsonGlow: new THREE.MeshPhysicalMaterial({ color: 0xef4444, metalness: 0.18, roughness: 0.14, emissive: 0xdc2626, emissiveIntensity: 0.95, envMapIntensity: 1.6 }),
  magmaGlow: new THREE.MeshPhysicalMaterial({ color: 0xf97316, metalness: 0.12, roughness: 0.18, emissive: 0xea580c, emissiveIntensity: 0.98, envMapIntensity: 1.6 }),
  bloodRuby: new THREE.MeshPhysicalMaterial({ color: 0x991b1b, metalness: 0.28, roughness: 0.08, clearcoat: 1.0, emissive: 0xbe123c, emissiveIntensity: 0.72, flatShading: true, envMapIntensity: 1.8 }),
  neonMagenta: new THREE.MeshPhysicalMaterial({ color: 0xe11d48, metalness: 0.20, roughness: 0.10, emissive: 0xdb2777, emissiveIntensity: 0.92, envMapIntensity: 1.65 }),
  voidViolet: new THREE.MeshPhysicalMaterial({ color: 0x7c3aed, metalness: 0.22, roughness: 0.12, emissive: 0x6d28d9, emissiveIntensity: 0.88, envMapIntensity: 1.65 }),
  hazardAmber: new THREE.MeshPhysicalMaterial({ color: 0xd97706, metalness: 0.72, roughness: 0.24, emissive: 0x92400e, emissiveIntensity: 0.35, envMapIntensity: 1.55 })
};

function ringBeads(g, r, n, sz, mat, z = 0) {
  const geo = new THREE.SphereGeometry(sz, 14, 14);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Math.cos(a) * r, Math.sin(a) * r, z);
    g.add(m);
  }
}

function ringGems(g, r, n, sz, mat, z = 0) {
  const geo = new THREE.OctahedronGeometry(sz, 0);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Math.cos(a) * r, Math.sin(a) * r, z);
    m.rotation.set(a, a * 0.5, 0);
    g.add(m);
  }
}

function roundedPetalMesh(w, len, mat) {
  const sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.bezierCurveTo(-w, len * 0.32, -w * 0.88, len * 0.88, 0, len);
  sh.bezierCurveTo(w * 0.88, len * 0.88, w, len * 0.32, 0, 0);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 3 });
  geo.translate(0, 0, -0.04);
  return new THREE.Mesh(geo, mat);
}

function makeTube(pts, r, mat, segs = 40) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, segs, r, 14, false), mat);
}

function makeFeatherWing(side, n, matMain, matTrim, baseR = 0.82) {
  const grp = new THREE.Group();
  const sh = new THREE.Shape();
  sh.moveTo(0, -0.06);
  sh.bezierCurveTo(0.28, 0.08, 0.58, 0.24, 0.66, 0.38);
  sh.bezierCurveTo(0.68, 0.46, 0.52, 0.48, 0.32, 0.32);
  sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.055, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.022, bevelSegments: 3 });
  for (let i = 0; i < n; i++) {
    const mesh = new THREE.Mesh(geo, i % 2 === 0 ? matMain : matTrim);
    const sc = 0.92 - i * 0.12;
    mesh.scale.set(side * sc, sc, 1);
    mesh.position.set(side * baseR, 0.24 - i * 0.16, -0.04 + i * 0.012);
    mesh.rotation.z = side * (0.28 - i * 0.22);
    grp.add(mesh);
  }
  return grp;
}

function friendlyDart(matBody, matTip, matFlame) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.34, 12, 24), matBody);
  g.add(body);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.026, 10, 24), M.gold);
  collar.rotation.x = Math.PI * 0.5;
  collar.position.y = 0.06;
  g.add(collar);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 18), matTip);
  tip.scale.set(1, 1.35, 1);
  tip.position.y = 0.22;
  g.add(tip);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.082, 16, 16), matFlame);
  flame.scale.set(0.85, 1.45, 0.85);
  flame.position.y = -0.26;
  g.add(flame);
  return g;
}

function jaggedSpike(r, h, mat) {
  return new THREE.Mesh(new THREE.ConeGeometry(r, h, 5), mat);
}

// ─── DYNAMO TIER VII ROYAL SIEGE MEGA-CANNON (Pointing straight UP +Y!) ───
function buildDynamoCannon3D() {
  const g = new THREE.Group();

  // Central sapphire & obsidian-bronze reinforced barrel cylinder
  const barrelOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 1.85, 16), M.sapphire);
  barrelOuter.position.y = 0.12;
  g.add(barrelOuter);

  // Inner glowing plasma bore cylinder (visible down muzzle & slotted side vents!)
  const boreCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 2.02, 20), M.cyanGlow);
  boreCore.position.y = 0.18;
  g.add(boreCore);

  // Twin thick 24K Gold vertical accelerator frame rails flanking the barrel
  for (const s of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.98, 0.34), M.gold);
    rail.position.set(s * 0.42, 0.12, 0.02);
    g.add(rail);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.72, 0.42), M.platinum);
    trim.position.set(s * 0.46, 0.14, 0.02);
    g.add(trim);

    // Side amethyst power capacitor pods
    const cap = new THREE.Mesh(new THREE.OctahedronGeometry(0.21, 0), M.amethystGem);
    cap.scale.set(0.8, 1.5, 0.9);
    cap.position.set(s * 0.62, -0.42, 0.04);
    g.add(cap);

    const capRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 14, 32), M.gold);
    capRing.rotation.y = Math.PI * 0.5;
    capRing.position.set(s * 0.56, -0.42, 0.04);
    g.add(capRing);

    // Swept lower palm-grip arcane stabilizer wings
    const wing = roundedPetalMesh(0.24, 0.72, M.cobaltEnamel);
    wing.rotation.z = s * -2.25;
    wing.position.set(s * 0.40, -0.58, -0.02);
    g.add(wing);
    const wingGold = roundedPetalMesh(0.14, 0.58, M.gold);
    wingGold.rotation.z = s * -2.25;
    wingGold.position.set(s * 0.40, -0.58, 0.04);
    g.add(wingGold);
  }

  // Sculpted Breech Armor Core & Faceted Sapphire Crystal Heart
  const breechBody = new THREE.Mesh(new THREE.OctahedronGeometry(0.56, 1), M.gold);
  breechBody.scale.set(1.25, 0.92, 0.72);
  breechBody.position.set(0, -0.62, 0.02);
  g.add(breechBody);

  const heartGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), M.amethystGem);
  heartGem.scale.set(1.0, 1.32, 0.8);
  heartGem.position.set(0, -0.56, 0.34);
  g.add(heartGem);

  const heartBezel = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.055, 14, 32), M.gold);
  heartBezel.position.set(0, -0.56, 0.36);
  g.add(heartBezel);

  // 3 Tiered Ornate Muzzle Focusing Collars along the barrel
  [
    { y: -0.02, r: 0.48, t: 0.065, mat: M.gold },
    { y: 0.48,  r: 0.44, t: 0.06,  mat: M.platinum },
    { y: 0.96,  r: 0.42, t: 0.072, mat: M.gold },
    { y: 1.18,  r: 0.34, t: 0.055, mat: M.sapphire }
  ].forEach((c) => {
    const col = new THREE.Mesh(new THREE.TorusGeometry(c.r, c.t, 16, 40), c.mat);
    col.rotation.x = Math.PI * 0.5;
    col.position.y = c.y;
    g.add(col);
  });

  // Glowing Crown Muzzle Tip Emitter
  const muzzleCrown = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.055, 16, 36), M.cyanGlow);
  muzzleCrown.rotation.x = Math.PI * 0.5;
  muzzleCrown.position.y = 1.24;
  g.add(muzzleCrown);

  const muzzleJewels = new THREE.Group();
  muzzleJewels.position.y = 0.96;
  muzzleJewels.rotation.x = Math.PI * 0.5;
  ringGems(muzzleJewels, 0.45, 6, 0.075, M.skyGem, 0);
  g.add(muzzleJewels);

  // Slight heroic 3D tilt toward camera so bore & facets read with depth
  g.rotation.set(0.18, 0.0, 0.0);
  return g;
}

// ─── 25 POWERED-UP GOOD NODES (Rich Royal Jewel Tones, ZERO Spikes, ZERO White Blowout) ───
function buildGoodMissiles(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.10, 20, 56), M.gold));
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.14, 48), M.cobaltEnamel);
    disc.rotation.x = Math.PI * 0.5; disc.position.z = -0.05; g.add(disc);
    ringBeads(g, 0.95, 12, 0.045, M.skyGem, 0.09);
    [[-0.36, -0.06, 0.85], [0, 0.10, 1.0], [0.36, -0.06, 0.85]].forEach(([x, y, s]) => {
      const d = friendlyDart(M.pearl, M.skyGem, M.amberGem);
      d.position.set(x, y, 0.16); d.scale.setScalar(s); g.add(d);
    });
  } else if (opt === 'B') {
    g.add(makeFeatherWing(-1, 4, M.pearl, M.gold, 0.72));
    g.add(makeFeatherWing(1, 4, M.pearl, M.gold, 0.72));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.09, 20, 48), M.gold));
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.14, 40), M.aquaGem);
    core.rotation.x = Math.PI * 0.5; g.add(core);
    [[-0.24, 0.02], [0.24, 0.02]].forEach(([x, y]) => {
      const d = friendlyDart(M.platinum, M.emeraldGem, M.citrineSmooth);
      d.position.set(x, y, 0.16); d.scale.setScalar(0.96); g.add(d);
    });
  } else if (opt === 'C') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.08, 20, 56), M.gold));
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.055, 16, 48), M.skyGem);
    inner.rotation.x = 0.35; g.add(inner);
    const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), M.sapphire);
    g.add(jewel);
    [[0, 0.62], [0, -0.62], [-0.62, 0], [0.62, 0]].forEach(([x, y]) => {
      const pod = friendlyDart(M.aquaGem, M.gold, M.cyanGlow);
      pod.position.set(x, y, 0.12); pod.scale.setScalar(0.68); g.add(pod);
    });
  } else if (opt === 'D') {
    const outer = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.11, 20, 56), M.cobaltEnamel);
    g.add(outer);
    const trim = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.06, 16, 48), M.gold);
    trim.position.z = 0.06; g.add(trim);
    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.14, 44), M.indigoDial);
    back.rotation.x = Math.PI * 0.5; back.position.z = -0.04; g.add(back);
    const hero = friendlyDart(M.skyGem, M.gold, M.citrineSmooth);
    hero.scale.setScalar(1.42); hero.position.set(0, 0.04, 0.22); g.add(hero);
  } else {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.08, 20, 56), M.aquaGem);
    g.add(ring);
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.045, 14, 52), M.gold));
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), M.sapphire);
    g.add(gem);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
      const orb = friendlyDart(M.pearl, M.amethystGem, M.cyanGlow);
      orb.position.set(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.15);
      orb.rotation.z = a - Math.PI / 2; orb.scale.setScalar(0.78);
      g.add(orb);
    }
  }
  return g;
}

function buildGoodHyper(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    for (let i = 0; i < 10; i++) {
      const p = roundedPetalMesh(0.24, 0.92, i % 2 === 0 ? M.gold : M.amberGem);
      p.rotation.z = (i / 10) * Math.PI * 2; g.add(p);
    }
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.08, 18, 44), M.platinum);
    rim.position.z = 0.08; g.add(rim);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), M.citrineSmooth);
    core.position.z = 0.16; g.add(core);
  } else if (opt === 'B') {
    g.add(makeFeatherWing(-1, 4, M.gold, M.citrineSmooth, 0.68));
    g.add(makeFeatherWing(1, 4, M.gold, M.citrineSmooth, 0.68));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.09, 18, 48), M.gold));
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.52, 28, 28), M.citrineSmooth);
    g.add(orb);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.045, 12, 40), M.skyGem);
    band.rotation.x = 0.7; g.add(band);
  } else if (opt === 'C') {
    [0.98, 0.80, 0.64].forEach((r, idx) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.055, 16, 48), idx % 2 === 0 ? M.gold : M.aquaGem);
      t.rotation.set(idx * 0.48, idx * 0.52, 0); g.add(t);
    });
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.40, 0), M.amberGem);
    g.add(gem);
  } else if (opt === 'D') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.10, 20, 56), M.gold));
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.14, 48), M.indigoDial);
    disc.rotation.x = Math.PI * 0.5; g.add(disc);
    ringGems(g, 0.88, 8, 0.065, M.skyGem, 0.09);
    const sh = new THREE.Shape();
    sh.moveTo(0.14, 0.58); sh.lineTo(-0.34, 0.04); sh.lineTo(-0.02, 0.04);
    sh.lineTo(-0.18, -0.58); sh.lineTo(0.36, -0.02); sh.lineTo(0.04, -0.02); sh.closePath();
    const bGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3 });
    bGeo.translate(0, 0, -0.06);
    const bolt = new THREE.Mesh(bGeo, M.citrineSmooth);
    bolt.position.z = 0.14; g.add(bolt);
  } else {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.94, 0.075, 18, 52), M.roseGold));
    const t2 = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.06, 16, 48), M.gold);
    t2.rotation.x = 0.55; g.add(t2);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.46, 28, 28), M.amberGem);
    g.add(orb);
    ringBeads(g, 0.94, 8, 0.055, M.pearl, 0.08);
  }
  return g;
}

function buildGoodDup(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.085, 20, 56), M.gold));
    const gL = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), M.skyGem);
    gL.position.set(-0.36, 0, 0.08); g.add(gL);
    const gR = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), M.amethystGem);
    gR.position.set(0.36, 0, 0.08); g.add(gR);
    const link = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 12, 32), M.gold);
    link.rotation.y = Math.PI * 0.25; link.position.z = 0.12; g.add(link);
  } else if (opt === 'B') {
    for (const s of [-1, 1]) {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.08, 16, 36, Math.PI * 0.72), M.gold);
      arc.rotation.z = s === -1 ? Math.PI * 0.64 : -Math.PI * 0.36; g.add(arc);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), M.skyGem);
      orb.position.set(s * 0.36, 0, 0.08); g.add(orb);
    }
    const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.44, 16), M.platinum);
    bridge.rotation.z = Math.PI * 0.5; g.add(bridge);
  } else if (opt === 'C') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.09, 20, 52), M.gold));
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), M.aquaGem);
    core.position.z = 0.14; g.add(core);
    const sL = roundedPetalMesh(0.22, 0.68, M.skyGem); sL.rotation.z = 0.62; sL.position.set(-0.1, -0.2, 0.06); g.add(sL);
    const sR = roundedPetalMesh(0.22, 0.68, M.roseGem); sR.rotation.z = -0.62; sR.position.set(0.1, -0.2, 0.06); g.add(sR);
  } else if (opt === 'D') {
    for (const [x, mRing, mGem] of [[-0.36, M.gold, M.skyGem], [0.36, M.roseGold, M.roseGem]]) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.08, 18, 44), mRing);
      r.position.set(x, 0, x < 0 ? 0.04 : -0.04); g.add(r);
      const j = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 0), mGem);
      j.position.set(x, 0, 0.08); g.add(j);
    }
  } else {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.14, 48), M.cobaltEnamel);
    disc.rotation.x = Math.PI * 0.5; g.add(disc);
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.90, 0.08, 18, 48), M.gold));
    for (const [x, mat] of [[-0.28, M.gold], [0.28, M.skyGem]]) {
      for (let i = 0; i < 4; i++) {
        const pt = roundedPetalMesh(0.11, 0.34, mat);
        pt.rotation.z = (i / 4) * Math.PI * 2;
        pt.position.set(x, 0, 0.12);
        g.add(pt);
      }
    }
  }
  return g;
}

function buildGoodStasis(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.90, 0.11, 20, 56), M.gold));
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 12, 24), M.gold);
    bow.position.y = 1.06; g.add(bow);
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.14, 48), M.indigoDial);
    dial.rotation.x = Math.PI * 0.5; g.add(dial);
    ringBeads(g, 0.66, 12, 0.04, M.skyGem, 0.09);
    const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.48, 0.05), M.platinum);
    h1.position.set(0, 0.22, 0.12); g.add(h1);
    const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.05), M.skyGem);
    h2.rotation.z = -1.05; h2.position.set(0.14, -0.06, 0.12); g.add(h2);
  } else if (opt === 'B') {
    for (const y of [-0.76, 0.76]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.12, 32), M.gold);
      cap.position.y = y; g.add(cap);
    }
    for (const x of [-0.46, 0.46]) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.52, 16), M.platinum);
      rod.position.x = x; g.add(rod);
    }
    const topCone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.70, 28), M.aquaGem);
    topCone.rotation.x = Math.PI; topCone.position.y = 0.34; g.add(topCone);
    const botCone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.70, 28), M.skyGem);
    botCone.position.y = -0.34; g.add(botCone);
  } else if (opt === 'C') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.94, 0.08, 18, 52), M.platinum));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.06, 16, 44), M.gold));
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), M.sapphire);
    g.add(core);
    const cresc = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.09, 14, 32, Math.PI * 1.15), M.pearl);
    cresc.rotation.z = 0.85; cresc.position.z = 0.10; g.add(cresc);
  } else if (opt === 'D') {
    for (let i = 0; i < 8; i++) {
      const p = roundedPetalMesh(0.22, 0.86, i % 2 === 0 ? M.skyGem : M.pearl);
      p.rotation.z = (i / 8) * Math.PI * 2; g.add(p);
    }
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.075, 16, 40), M.gold));
    const cen = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), M.aquaGem);
    cen.position.z = 0.12; g.add(cen);
  } else {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.085, 18, 52), M.gold));
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.40, 24, 24), M.skyGem);
    drop.scale.set(0.82, 1.35, 0.82); drop.position.y = -0.10; g.add(drop);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.045, 12, 36), M.platinum);
    ring.rotation.x = 0.9; g.add(ring);
  }
  return g;
}

function buildGoodVacuum(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    const u = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.17, 18, 40, Math.PI), M.sapphire);
    u.rotation.z = Math.PI; g.add(u);
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.56, 20), M.sapphire);
      leg.position.set(s * 0.62, 0.28, 0); g.add(leg);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.28, 20), M.gold);
      tip.position.set(s * 0.62, 0.62, 0); g.add(tip);
    }
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 10, 32, Math.PI), M.cyanGlow);
    arc.position.y = 0.66; g.add(arc);
  } else if (opt === 'B') {
    for (let i = 0; i < 4; i++) {
      const spiral = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.075, 14, 36, Math.PI * 0.85), i % 2 === 0 ? M.aquaGem : M.gold);
      spiral.rotation.z = (i / 4) * Math.PI * 2; g.add(spiral);
    }
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), M.sapphire));
  } else if (opt === 'C') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.08, 18, 52), M.platinum));
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.60, 0.065, 16, 44), M.gold);
    inner.rotation.x = 0.45; g.add(inner);
    ringGems(g, 0.92, 6, 0.075, M.skyGem, 0.09);
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.30, 0), M.aquaGem));
  } else if (opt === 'D') {
    for (let i = 0; i < 4; i++) {
      const cage = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.045, 12, 44), M.gold);
      cage.rotation.y = (i / 4) * Math.PI; g.add(cage);
    }
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.40, 24, 24), M.aquaGem));
  } else {
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), M.indigoDial));
    for (let i = 0; i < 2; i++) {
      const sw = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.065, 16, 48), i === 0 ? M.gold : M.roseGold);
      sw.rotation.set(0.65 * (i === 0 ? 1 : -1), 0.55, 0); g.add(sw);
    }
    ringBeads(g, 0.84, 4, 0.07, M.skyGem, 0);
  }
  return g;
}

// ─── 25 POWERED-UP BAD NODES (Menacing Dark Obsidian, Basalt, Blood-Ruby & Crimson Hazard Aesthetics) ───
function buildBadComet(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    const core = new THREE.Mesh(new THREE.DodecahedronGeometry(0.64, 0), M.basalt);
    core.scale.set(1.05, 1.15, 0.9); g.add(core);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const vein = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.22), M.magmaGlow);
      vein.rotation.z = a; vein.position.set(Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0.14); g.add(vein);
    }
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.07, 14, 40), M.crimsonGlow));
  } else if (opt === 'B') {
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.56, 20, 20), M.gunmetal));
    for (let i = 0; i < 8; i++) {
      const sp = jaggedSpike(0.16, 0.44, i % 2 === 0 ? M.crimsonGlow : M.obsidian);
      const a = (i / 8) * Math.PI * 2;
      sp.position.set(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0); sp.rotation.z = a - Math.PI / 2; g.add(sp);
    }
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.34, 0), M.bloodRuby));
  } else if (opt === 'C') {
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 0), M.basalt);
    rock.rotation.set(0.3, 0.5, 0.2); g.add(rock);
    const lavaCore = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), M.magmaGlow);
    lavaCore.position.set(0.12, -0.08, 0.28); g.add(lavaCore);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.06, 12, 36), M.darkCopper);
    ring.rotation.x = 0.6; g.add(ring);
  } else if (opt === 'D') {
    const spear = new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.35, 4), M.obsidian);
    spear.rotation.z = Math.PI; g.add(spear);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.09, 12, 24), M.crimsonGlow);
    collar.rotation.x = Math.PI * 0.5; collar.position.y = 0.22; g.add(collar);
  } else {
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 20), M.crimsonGlow));
    for (let i = 0; i < 7; i++) {
      const sh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), M.obsidian);
      const a = (i / 7) * Math.PI * 2;
      sh.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, (i % 2) * 0.16);
      sh.rotation.set(a, a, 0); g.add(sh);
    }
  }
  return g;
}

function buildBadLaser(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const prong = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.72, 0.24), M.obsidian);
      prong.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0); prong.rotation.z = a + Math.PI / 2; g.add(prong);
    }
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.40, 0), M.crimsonGlow));
  } else if (opt === 'B') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.14, 18, 40), M.gunmetal));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.60, 0.06, 14, 32), M.crimsonGlow));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), M.bloodRuby));
    for (let i = 0; i < 4; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.34, 0.12), M.crimsonGlow);
      const a = (i / 4) * Math.PI * 2;
      tick.position.set(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.08); tick.rotation.z = a + Math.PI / 2; g.add(tick);
    }
  } else if (opt === 'C') {
    for (const s of [-1, 1]) {
      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.38, 0.32), M.obsidian);
      jaw.position.set(s * 0.56, 0, 0); g.add(jaw);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.24, 0.38), M.neonMagenta);
      rail.position.set(s * 0.42, 0, 0); g.add(rail);
    }
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.48, 16), M.crimsonGlow));
  } else if (opt === 'D') {
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.76, 0), M.darkVioletMetal));
    for (const rot of [0, Math.PI / 2]) {
      const slit = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.065, 12, 24), M.crimsonGlow);
      slit.rotation.y = rot; g.add(slit);
    }
  } else {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.12, 16, 36), M.darkCopper));
    ringGems(g, 0.88, 6, 0.12, M.crimsonGlow, 0.06);
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), M.bloodRuby));
  }
  return g;
}

function buildBadVortex(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 24), M.obsidian));
    const disk = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.10, 16, 48), M.voidViolet);
    disk.rotation.x = 1.05; g.add(disk);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.06, 12, 48), M.crimsonGlow);
    ring2.rotation.y = 0.6; g.add(ring2);
  } else if (opt === 'B') {
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 20), M.voidViolet));
    for (let i = 0; i < 5; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.88, 0.16), M.obsidian);
      const a = (i / 5) * Math.PI * 2;
      blade.rotation.z = a + 0.55; blade.position.set(Math.cos(a) * 0.52, Math.sin(a) * 0.52, 0); g.add(blade);
    }
  } else if (opt === 'C') {
    const rift = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), M.obsidian);
    rift.scale.set(0.65, 1.45, 0.6); g.add(rift);
    const glow = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.065, 12, 32), M.neonMagenta);
    glow.scale.set(0.75, 1.25, 1); g.add(glow);
  } else if (opt === 'D') {
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.12, 16, 40), M.gunmetal));
    for (let i = 0; i < 8; i++) {
      const sp = jaggedSpike(0.14, 0.36, M.crimsonGlow);
      const a = (i / 8) * Math.PI * 2;
      sp.position.set(Math.cos(a) * 0.94, Math.sin(a) * 0.94, 0); sp.rotation.z = a - Math.PI / 2; g.add(sp);
    }
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), M.obsidian));
  } else {
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 20), M.crimsonGlow));
    for (let i = 0; i < 4; i++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.07, 12, 32), M.obsidian);
      rib.rotation.set(i * 0.5, i * 0.7, 0); g.add(rib);
    }
  }
  return g;
}

function buildBadEmp(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 24), M.gunmetal));
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.055, 12, 36), M.crimsonGlow);
    g.add(band);
    [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0.7, 0.7, 0.2], [-0.7, 0.7, 0.2], [0.7, -0.7, 0.2], [-0.7, -0.7, 0.2]].forEach(([dx, dy, dz]) => {
      const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.10, 0.36, 12), M.darkCopper);
      const dir = new THREE.Vector3(dx, dy, dz).normalize();
      horn.position.copy(dir).multiplyScalar(0.72);
      horn.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      g.add(horn);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), M.crimsonGlow);
      tip.position.copy(dir).multiplyScalar(0.90);
      g.add(tip);
    });
  } else if (opt === 'B') {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 1.24, 24), M.obsidian);
    cap.rotation.z = 0.28; g.add(cap);
    for (const y of [-0.35, 0.35]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.08, 12, 28), M.hazardAmber);
      ring.rotation.x = Math.PI * 0.5; ring.rotation.y = -0.28;
      ring.position.set(-Math.sin(0.28) * y, Math.cos(0.28) * y, 0); g.add(ring);
    }
    const core = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.05, 10, 36), M.crimsonGlow);
    core.rotation.x = 0.6; g.add(core);
  } else if (opt === 'C') {
    g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.68, 0), M.obsidian));
    for (let i = 0; i < 3; i++) {
      const c = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.055, 12, 32), M.crimsonGlow);
      c.rotation.set(i * 0.7, i * 0.5, 0); g.add(c);
    }
  } else if (opt === 'D') {
    g.add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.66, 0), M.gunmetal));
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.50, 20, 20), M.crimsonGlow);
    g.add(core);
    for (const y of [-0.62, 0.62]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.24, 16), M.obsidian);
      cap.position.y = y; g.add(cap);
    }
  } else {
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.44, 20, 20), M.neonMagenta));
    for (let i = 0; i < 6; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.34, 0.16), M.darkCopper);
      bar.rotation.z = (i / 6) * Math.PI; g.add(bar);
    }
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.08, 12, 36), M.crimsonGlow));
  }
  return g;
}

function buildBadBlink(opt) {
  const g = new THREE.Group();
  if (opt === 'A') {
    for (const [dx, dy, dz, m] of [[0, 0, 0, M.obsidian], [-0.26, 0.18, 0.12, M.voidViolet], [0.24, -0.18, -0.1, M.neonMagenta]]) {
      const p = new THREE.Mesh(new THREE.OctahedronGeometry(0.56, 0), m);
      p.scale.set(0.65, 1.3, 0.65); p.position.set(dx, dy, dz); g.add(p);
    }
  } else if (opt === 'B') {
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.76, 0), M.obsidian);
    body.scale.set(0.62, 1.38, 0.62); g.add(body);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.72, 0.42), M.neonMagenta);
    g.add(seam);
  } else if (opt === 'C') {
    for (let i = 0; i < 4; i++) {
      const blade = jaggedSpike(0.24, 0.78, i % 2 === 0 ? M.darkVioletMetal : M.crimsonGlow);
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      blade.position.set(Math.cos(a) * 0.56, Math.sin(a) * 0.56, 0); blade.rotation.z = a - Math.PI / 2; g.add(blade);
    }
    g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), M.obsidian));
  } else if (opt === 'D') {
    const pod = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.44, 5), M.gunmetal);
    pod.rotation.z = -0.35; g.add(pod);
    const slit = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.065, 12, 32), M.voidViolet);
    slit.rotation.set(0.8, 0.4, 0); g.add(slit);
  } else {
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.82, 0.82), M.obsidian)).rotation.set(0.5, 0.6, 0.2);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.56, 0.56), M.crimsonGlow);
    inner.rotation.set(-0.4, 0.8, 0.3); g.add(inner);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.05, 10, 32), M.voidViolet);
    edge.rotation.x = 0.6; g.add(edge);
  }
  return g;
}

const BUILDERS = {
  'vfx-t7-dynamo-cannon-3d.png': { fn: buildDynamoCannon3D, cannon: true },
  'good_missiles_A.png': { fn: () => buildGoodMissiles('A') },
  'good_missiles_B.png': { fn: () => buildGoodMissiles('B') },
  'good_missiles_C.png': { fn: () => buildGoodMissiles('C') },
  'good_missiles_D.png': { fn: () => buildGoodMissiles('D') },
  'good_missiles_E.png': { fn: () => buildGoodMissiles('E') },
  'good_hyper_A.png': { fn: () => buildGoodHyper('A') },
  'good_hyper_B.png': { fn: () => buildGoodHyper('B') },
  'good_hyper_C.png': { fn: () => buildGoodHyper('C') },
  'good_hyper_D.png': { fn: () => buildGoodHyper('D') },
  'good_hyper_E.png': { fn: () => buildGoodHyper('E') },
  'good_dup_A.png': { fn: () => buildGoodDup('A') },
  'good_dup_B.png': { fn: () => buildGoodDup('B') },
  'good_dup_C.png': { fn: () => buildGoodDup('C') },
  'good_dup_D.png': { fn: () => buildGoodDup('D') },
  'good_dup_E.png': { fn: () => buildGoodDup('E') },
  'good_stasis_A.png': { fn: () => buildGoodStasis('A') },
  'good_stasis_B.png': { fn: () => buildGoodStasis('B') },
  'good_stasis_C.png': { fn: () => buildGoodStasis('C') },
  'good_stasis_D.png': { fn: () => buildGoodStasis('D') },
  'good_stasis_E.png': { fn: () => buildGoodStasis('E') },
  'good_vacuum_A.png': { fn: () => buildGoodVacuum('A') },
  'good_vacuum_B.png': { fn: () => buildGoodVacuum('B') },
  'good_vacuum_C.png': { fn: () => buildGoodVacuum('C') },
  'good_vacuum_D.png': { fn: () => buildGoodVacuum('D') },
  'good_vacuum_E.png': { fn: () => buildGoodVacuum('E') },
  'bad_comet_A.png': { fn: () => buildBadComet('A') },
  'bad_comet_B.png': { fn: () => buildBadComet('B') },
  'bad_comet_C.png': { fn: () => buildBadComet('C') },
  'bad_comet_D.png': { fn: () => buildBadComet('D') },
  'bad_comet_E.png': { fn: () => buildBadComet('E') },
  'bad_laser_A.png': { fn: () => buildBadLaser('A') },
  'bad_laser_B.png': { fn: () => buildBadLaser('B') },
  'bad_laser_C.png': { fn: () => buildBadLaser('C') },
  'bad_laser_D.png': { fn: () => buildBadLaser('D') },
  'bad_laser_E.png': { fn: () => buildBadLaser('E') },
  'bad_vortex_A.png': { fn: () => buildBadVortex('A') },
  'bad_vortex_B.png': { fn: () => buildBadVortex('B') },
  'bad_vortex_C.png': { fn: () => buildBadVortex('C') },
  'bad_vortex_D.png': { fn: () => buildBadVortex('D') },
  'bad_vortex_E.png': { fn: () => buildBadVortex('E') },
  'bad_emp_A.png': { fn: () => buildBadEmp('A') },
  'bad_emp_B.png': { fn: () => buildBadEmp('B') },
  'bad_emp_C.png': { fn: () => buildBadEmp('C') },
  'bad_emp_D.png': { fn: () => buildBadEmp('D') },
  'bad_emp_E.png': { fn: () => buildBadEmp('E') },
  'bad_blink_A.png': { fn: () => buildBadBlink('A') },
  'bad_blink_B.png': { fn: () => buildBadBlink('B') },
  'bad_blink_C.png': { fn: () => buildBadBlink('C') },
  'bad_blink_D.png': { fn: () => buildBadBlink('D') },
  'bad_blink_E.png': { fn: () => buildBadBlink('E') }
};

function fitToFrame(group, targetSize = 2.25) {
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const sc = targetSize / maxDim;
  group.scale.multiplyScalar(sc);
  group.position.sub(center.multiplyScalar(sc));
}

window.renderTarget = function(name) {
  while (rootGroup.children.length > 0) rootGroup.remove(rootGroup.children[0]);
  const spec = BUILDERS[name];
  if (!spec) throw new Error('Unknown render target: ' + name);
  renderer.toneMappingExposure = spec.cannon ? 0.96 : 0.86;
  const obj = spec.fn();
  fitToFrame(obj, spec.cannon ? 2.68 : 2.24);
  if (!spec.cannon) obj.rotation.set(0.16, -0.22, 0.0);
  rootGroup.add(obj);
  renderer.render(scene, camera);
  return canvas.toDataURL('image/png');
};
window.ALL_TARGETS = Object.keys(BUILDERS);
</script>
</body>
</html>`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const p = srv.address().port;
      srv.close(() => resolve(p));
    });
    srv.on('error', reject);
  });
}

function startStudioServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];
      if (urlPath === '/' || urlPath === '/studio.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(STUDIO_HTML);
        return;
      }
      if (urlPath.startsWith('/three/')) {
        const rel = urlPath.slice('/three/'.length);
        const fp = path.resolve(THREE_DIR, rel);
        if (fp.startsWith(THREE_DIR) && fs.existsSync(fp)) {
          res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
          fs.createReadStream(fp).pipe(res);
          return;
        }
      }
      res.writeHead(404);
      res.end();
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
  }
  async connect() {
    await new Promise((res, rej) => {
      this.ws.addEventListener('open', res, { once: true });
      this.ws.addEventListener('error', rej, { once: true });
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) throw new Error('Studio eval error: ' + JSON.stringify(res.exceptionDetails));
    return res.result ? res.result.value : undefined;
  }
  close() { try { this.ws.close(); } catch {} }
}

async function launch(port, glFlags) {
  const cdpPort = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-v422-studio-'));
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=600,600',
    '--no-first-run',
    '--no-default-browser-check',
    ...glFlags,
    'about:blank'
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
      const page = list.find((t) => t.type === 'page') || list[0];
      if (page?.webSocketDebuggerUrl) { wsUrl = page.webSocketDebuggerUrl; break; }
    } catch {}
    await sleep(150);
  }
  if (!wsUrl) throw new Error('Chrome failed to start');
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/studio.html` });
  for (let t = 0; t < 40; t++) {
    const ready = await cdp.eval(`typeof window.renderTarget === 'function'`);
    if (ready) break;
    await sleep(120);
  }
  const ok = await cdp.eval(`typeof window.renderTarget === 'function'`);
  return { chromeProc, userDataDir, cdp, ok };
}

async function main() {
  const { server, port } = await startStudioServer();
  let session = null;
  try {
    session = await launch(port, ['--use-angle=d3d11', '--ignore-gpu-blocklist']);
    if (!session.ok) {
      session.cdp.close();
      try { session.chromeProc.kill(); } catch {}
      session = await launch(port, ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']);
      if (!session.ok) throw new Error('WebGL2 unavailable in headless Chrome');
    }

    const targets = await session.cdp.eval(`window.ALL_TARGETS`);
    const catalogDir = path.join(ROOT_DIR, 'scratch', 'v422_catalog_512');
    const assetsDir = path.join(ROOT_DIR, 'assets');
    fs.mkdirSync(catalogDir, { recursive: true });

    for (const fname of targets) {
      const dataUrl = await session.cdp.eval(`window.renderTarget('${fname}')`);
      const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      const outPath = fname === 'vfx-t7-dynamo-cannon-3d.png'
        ? path.join(assetsDir, fname)
        : path.join(catalogDir, fname);
      fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
    }
    console.log(`ALL_${targets.length}_V422_PBR_RENDERS_COMPLETE`);
  } finally {
    if (session) {
      session.cdp.close();
      try { session.chromeProc.kill(); } catch {}
      await sleep(200);
      try { fs.rmSync(session.userDataDir, { recursive: true, force: true }); } catch {}
    }
    server.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
