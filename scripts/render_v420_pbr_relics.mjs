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
renderer.toneMappingExposure = 1.15;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// High-Contrast Fine-Jewelry Studio Dark-Box Environment (Bright Softbox Strips + Deep Black Void Contrast!)
function buildLuxuryEnvMap() {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x04060c);
  const stripMatWarm = new THREE.MeshBasicMaterial({ color: new THREE.Color(6.5, 5.2, 2.8) });
  const stripMatCool = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 5.2, 7.5) });
  const stripMatWhite = new THREE.MeshBasicMaterial({ color: new THREE.Color(8.0, 8.0, 8.2) });
  const darkFill = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.28, 0.32, 0.45) });

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
  return pmrem.fromScene(envScene, 0.035).texture;
}

const scene = new THREE.Scene();
scene.environment = buildLuxuryEnvMap();
scene.environmentIntensity = 1.6;

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 0, 5.4);

const keyLight = new THREE.DirectionalLight(0xfff2d6, 2.6);
keyLight.position.set(3.5, 4.8, 4.6);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
fillLight.position.set(-4.5, -1.8, 3.2);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xfde047, 2.2);
rimLight.position.set(0.4, 4.2, -4.5);
scene.add(rimLight);

const rootGroup = new THREE.Group();
scene.add(rootGroup);

// Procedural 512x512 Luxury Guilloche & Filigree Engraving Bump Map
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

// High-Contrast Deep Luxury PBR Metals & Deep Saturated Gemstones (Zero Milky Pastels!)
const matGold24k = new THREE.MeshPhysicalMaterial({
  color: 0xe6a82e, metalness: 0.98, roughness: 0.17, clearcoat: 0.68, clearcoatRoughness: 0.09,
  bumpMap: filigreeBump, bumpScale: 0.022, envMapIntensity: 1.95
});
const matGoldDark = new THREE.MeshPhysicalMaterial({
  color: 0xa66e14, metalness: 0.95, roughness: 0.26, clearcoat: 0.35,
  bumpMap: filigreeBump, bumpScale: 0.025, envMapIntensity: 1.5
});
const matPlatinum = new THREE.MeshPhysicalMaterial({
  color: 0xdbe5f2, metalness: 0.98, roughness: 0.13, clearcoat: 0.72, clearcoatRoughness: 0.08,
  bumpMap: filigreeBump, bumpScale: 0.018, envMapIntensity: 1.95
});
const matSapphireMetal = new THREE.MeshPhysicalMaterial({
  color: 0x0c3466, metalness: 0.90, roughness: 0.20, clearcoat: 0.85,
  bumpMap: filigreeBump, bumpScale: 0.02, envMapIntensity: 1.8
});
const matObsidianDark = new THREE.MeshPhysicalMaterial({
  color: 0x0b0d14, metalness: 0.86, roughness: 0.20, clearcoat: 0.85, clearcoatRoughness: 0.12, envMapIntensity: 1.65
});
const matBronzeDark = new THREE.MeshPhysicalMaterial({
  color: 0x543118, metalness: 0.92, roughness: 0.25, clearcoat: 0.45, envMapIntensity: 1.5
});
const matDiamond = new THREE.MeshPhysicalMaterial({
  color: 0xe0f2fe, metalness: 0.22, roughness: 0.04, clearcoat: 1.0, reflectivity: 1.0,
  emissive: 0x0284c7, emissiveIntensity: 0.22, flatShading: true, envMapIntensity: 2.3
});

function makeDeepJewelMat(colorHex, emissiveHex, emissiveInt = 0.34) {
  return new THREE.MeshPhysicalMaterial({
    color: colorHex, metalness: 0.25, roughness: 0.06, clearcoat: 1.0, clearcoatRoughness: 0.05,
    iridescence: 0.55, iridescenceIOR: 1.8, emissive: emissiveHex, emissiveIntensity: emissiveInt,
    flatShading: true, envMapIntensity: 2.2
  });
}

function addDiamondRing(parent, radius, count, size, mat = matDiamond, z = 0) {
  const geo = new THREE.OctahedronGeometry(size, 0);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Math.cos(a) * radius, Math.sin(a) * radius, z);
    m.rotation.set(a, a * 0.5, 0);
    parent.add(m);
  }
}

function clearGroup() {
  while (rootGroup.children.length > 0) rootGroup.remove(rootGroup.children[0]);
  rootGroup.rotation.set(0, 0, 0);
}

function buildMissiles() {
  const g = new THREE.Group();
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.11, 20, 6), matPlatinum);
  g.add(outerRing);
  const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.075, 20, 6), matGold24k);
  midRing.position.z = 0.07;
  g.add(midRing);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.01, 1.01, 0.38, 6), matSapphireMetal);
  drum.rotation.x = Math.PI * 0.5;
  drum.position.z = -0.14;
  g.add(drum);

  // 4 Sculpted Gold Radar Brackets
  const clampGeo = new THREE.BoxGeometry(0.16, 0.34, 0.18);
  for (let k = 0; k < 4; k++) {
    const a = k * (Math.PI * 0.5) + Math.PI * 0.25;
    const cm = new THREE.Mesh(clampGeo, matGold24k);
    cm.position.set(Math.cos(a) * 1.18, Math.sin(a) * 1.18, 0.04);
    cm.rotation.z = a + Math.PI * 0.5;
    g.add(cm);
  }

  // Deep Royal-Sapphire Faceted Core Jewel
  const hubBezel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 16, 32), matGold24k);
  hubBezel.position.z = 0.18;
  g.add(hubBezel);
  const hubGem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.27, 0), makeDeepJewelMat(0x0369a1, 0x0ea5e9, 0.42));
  hubGem.position.z = 0.17;
  g.add(hubGem);
  const hubLight = new THREE.PointLight(0x38bdf8, 1.8, 4);
  hubLight.position.set(0, 0, 0.9);
  g.add(hubLight);

  // 4 Sculpted Sapphire-Platinum & Gold Micro-Missiles with Crisp Cyan Crystal Warheads
  const matCyanWarhead = makeDeepJewelMat(0x0284c7, 0x22d3ee, 0.65);
  for (let i = 0; i < 4; i++) {
    const a = i * (Math.PI * 0.5) + Math.PI * 0.25;
    const silo = new THREE.Group();
    silo.position.set(Math.cos(a) * 0.57, Math.sin(a) * 0.57, 0.05);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 16, 24), matGold24k);
    collar.position.z = 0.05;
    silo.add(collar);
    const well = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.24, 20), matObsidianDark);
    well.rotation.x = Math.PI * 0.5;
    silo.add(well);

    const msl = new THREE.Group();
    msl.rotation.x = 0.24;
    msl.rotation.y = Math.cos(a) * -0.20;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.11, 0.34, 16), matPlatinum);
    body.rotation.x = Math.PI * 0.5;
    body.position.z = 0.12;
    msl.add(body);
    const goldBand = new THREE.Mesh(new THREE.CylinderGeometry(0.114, 0.114, 0.08, 16), matGold24k);
    goldBand.rotation.x = Math.PI * 0.5;
    goldBand.position.z = 0.22;
    msl.add(goldBand);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.25, 8), matCyanWarhead);
    nose.rotation.x = Math.PI * 0.5;
    nose.position.z = 0.37;
    msl.add(nose);
    for (let f = 0; f < 3; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.13, 0.14), matGoldDark);
      const fa = (f * Math.PI * 2) / 3;
      fin.position.set(Math.cos(fa) * 0.11, Math.sin(fa) * 0.11, 0.05);
      fin.rotation.z = fa + Math.PI * 0.5;
      msl.add(fin);
    }
    silo.add(msl);
    g.add(silo);
  }
  g.rotation.set(0.24, -0.18, 0.12);
  return g;
}

function buildCluster() {
  const g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const denom = 1 + Math.sin(t) * Math.sin(t);
    pts.push(new THREE.Vector3(1.24 * Math.cos(t) / denom, 1.04 * Math.sin(t) * Math.cos(t) / denom, 0.20 * Math.sin(t * 2)));
  }
  const curve = new THREE.CatmullRomCurve3(pts, true);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 128, 0.082, 18, true), matGold24k));
  const infPlat = new THREE.Mesh(new THREE.TubeGeometry(curve, 128, 0.044, 14, true), matPlatinum);
  infPlat.scale.set(1.09, 1.16, 0.85);
  g.add(infPlat);

  g.add(new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.052, 18, 64), matGoldDark));
  addDiamondRing(g, 1.18, 12, 0.055, matDiamond, 0.045);

  // Brilliant-Cut Multi-Faceted Cyan-Sapphire & Imperial-Amethyst Gemstones (detail=2 crystal cuts!)
  const gemCyan = new THREE.Mesh(new THREE.IcosahedronGeometry(0.43, 2), makeDeepJewelMat(0x0369a1, 0x22d3ee, 0.42));
  gemCyan.position.set(-0.56, 0, 0.05);
  g.add(gemCyan);
  const crownCyan = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.028, 12, 32), matGold24k);
  crownCyan.position.set(-0.56, 0, 0.28);
  g.add(crownCyan);
  const ringL = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.052, 16, 36), matPlatinum);
  ringL.position.set(-0.56, 0, 0.05);
  ringL.rotation.set(0.32, 0.52, 0);
  g.add(ringL);

  const gemMag = new THREE.Mesh(new THREE.IcosahedronGeometry(0.43, 2), makeDeepJewelMat(0x7e22ce, 0xe879f9, 0.42));
  gemMag.position.set(0.56, 0, -0.05);
  g.add(gemMag);
  const crownMag = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.028, 12, 32), matPlatinum);
  crownMag.position.set(0.56, 0, 0.18);
  g.add(crownMag);
  const ringR = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.052, 16, 36), matGold24k);
  ringR.position.set(0.56, 0, -0.05);
  ringR.rotation.set(-0.32, 0.52, 0);
  g.add(ringR);

  // Pavé Diamond Bridge Clasp
  const claspRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 12, 24), matGold24k);
  g.add(claspRing);
  g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.17, 1), matDiamond));
  const l1 = new THREE.PointLight(0x06b6d4, 1.8, 3); l1.position.set(-0.6, 0, 1.0); g.add(l1);
  const l2 = new THREE.PointLight(0xc026d3, 1.8, 3); l2.position.set(0.6, 0, 1.0); g.add(l2);
  g.rotation.set(0.22, -0.15, -0.14);
  return g;
}

function buildSupercharge() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.105, 20, 64), matGold24k));
  const platInner = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.052, 16, 64), matPlatinum);
  platInner.position.z = 0.07;
  g.add(platInner);
  addDiamondRing(g, 0.84, 16, 0.052, matDiamond, 0.095);

  const majorShape = new THREE.Shape();
  majorShape.moveTo(-0.14, 0);
  majorShape.quadraticCurveTo(-0.07, 0.40, 0.04, 0.68);
  majorShape.quadraticCurveTo(0.11, 0.34, 0.14, 0);
  majorShape.closePath();
  const majorGeo = new THREE.ExtrudeGeometry(majorShape, { depth: 0.09, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 2 });

  const minorShape = new THREE.Shape();
  minorShape.moveTo(-0.075, 0);
  minorShape.lineTo(0, 0.42);
  minorShape.lineTo(0.075, 0);
  minorShape.closePath();
  const minorGeo = new THREE.ExtrudeGeometry(minorShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 2 });

  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const isMaj = (i % 2 === 0);
    const ray = new THREE.Mesh(isMaj ? majorGeo : minorGeo, (i % 4 === 0) ? matGold24k : ((i % 2 === 0) ? matGoldDark : matPlatinum));
    ray.position.set(Math.cos(a) * 0.77, Math.sin(a) * 0.77, -0.03);
    ray.rotation.z = a - Math.PI * 0.5;
    g.add(ray);
  }

  // Stepped Brilliant-Cut Golden Citrine Sun Core + Filigree Compass Star
  const starCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.57, 2), makeDeepJewelMat(0xd97706, 0xf59e0b, 0.44));
  g.add(starCore);
  const tableJewel = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 1), makeDeepJewelMat(0xf59e0b, 0xfde047, 0.55));
  tableJewel.position.z = 0.25;
  g.add(tableJewel);
  const coreCage = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.038, 12, 8), matGold24k);
  coreCage.position.z = 0.23;
  g.add(coreCage);

  const l1 = new THREE.PointLight(0xf59e0b, 2.0, 4); l1.position.set(0, 0, 1.2); g.add(l1);
  g.rotation.set(0.16, 0.12, 0.06);
  return g;
}

function buildSingularity() {
  const g = new THREE.Group();
  const ringConfigs = [
    { r: 1.18, tube: 0.072, rx: 0.16, ry: 0.26, rz: 0, mat: matGold24k },
    { r: 1.02, tube: 0.058, rx: 1.05, ry: 0.45, rz: 0.4, mat: matGoldDark },
    { r: 0.86, tube: 0.054, rx: -0.95, ry: 0.55, rz: -0.5, mat: matPlatinum },
    { r: 0.72, tube: 0.045, rx: 0.35, ry: -1.10, rz: 0.2, mat: matGold24k }
  ];
  for (const rc of ringConfigs) {
    const rm = new THREE.Mesh(new THREE.TorusGeometry(rc.r, rc.tube, 18, 64), rc.mat);
    rm.rotation.set(rc.rx, rc.ry, rc.rz);
    g.add(rm);
  }
  addDiamondRing(g, 1.18, 8, 0.072, makeDeepJewelMat(0x1d4ed8, 0x38bdf8, 0.42), 0.16);

  const coreSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.47, 2), makeDeepJewelMat(0x1e40af, 0x0284c7, 0.42));
  g.add(coreSphere);
  const eqBand = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.045, 14, 40), matGold24k);
  eqBand.rotation.x = 1.25;
  g.add(eqBand);
  const pearlCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 1), makeDeepJewelMat(0x67e8f9, 0xe0f2fe, 0.52));
  pearlCore.position.z = 0.28;
  g.add(pearlCore);

  const l1 = new THREE.PointLight(0x38bdf8, 1.9, 4); l1.position.set(0, 0, 1.2); g.add(l1);
  g.rotation.set(0.22, -0.20, 0.12);
  return g;
}

function buildCatalyst() {
  const g = new THREE.Group();
  const makeHeartShape = (sc) => {
    const hs = new THREE.Shape();
    hs.moveTo(0, 0.26 * sc);
    hs.bezierCurveTo(0.06 * sc, 0.52 * sc, 0.52 * sc, 0.62 * sc, 0.62 * sc, 0.22 * sc);
    hs.bezierCurveTo(0.70 * sc, -0.14 * sc, 0.30 * sc, -0.46 * sc, 0, -0.74 * sc);
    hs.bezierCurveTo(-0.30 * sc, -0.46 * sc, -0.70 * sc, -0.14 * sc, -0.62 * sc, 0.22 * sc);
    hs.bezierCurveTo(-0.52 * sc, 0.62 * sc, -0.06 * sc, 0.52 * sc, 0, 0.26 * sc);
    return hs;
  };

  // Ornate 24K Gold Heart Setting + Stepped 3-Tier Brilliant-Cut Imperial Emerald Heart
  const bezelGeo = new THREE.ExtrudeGeometry(makeHeartShape(1.10), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 3 });
  bezelGeo.center();
  const bezelMesh = new THREE.Mesh(bezelGeo, matGold24k);
  bezelMesh.position.set(0, -0.04, -0.02);
  g.add(bezelMesh);

  const emOuterGeo = new THREE.ExtrudeGeometry(makeHeartShape(0.95), { depth: 0.22, bevelEnabled: true, bevelThickness: 0.10, bevelSize: 0.07, bevelSegments: 2 });
  emOuterGeo.center();
  const emOuter = new THREE.Mesh(emOuterGeo, makeDeepJewelMat(0x065f46, 0x059669, 0.36));
  emOuter.position.set(0, -0.04, 0.06);
  g.add(emOuter);

  const emCrownGeo = new THREE.ExtrudeGeometry(makeHeartShape(0.68), { depth: 0.18, bevelEnabled: true, bevelThickness: 0.10, bevelSize: 0.07, bevelSegments: 1 });
  emCrownGeo.center();
  const emCrown = new THREE.Mesh(emCrownGeo, makeDeepJewelMat(0x059669, 0x10b981, 0.48));
  emCrown.position.set(0, -0.04, 0.16);
  g.add(emCrown);

  const emTableGeo = new THREE.ExtrudeGeometry(makeHeartShape(0.38), { depth: 0.10, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 1 });
  emTableGeo.center();
  const emTable = new THREE.Mesh(emTableGeo, makeDeepJewelMat(0x34d399, 0x6ee7b7, 0.62));
  emTable.position.set(0, -0.04, 0.24);
  g.add(emTable);

  // Gold & Pavé-Diamond Outer Halo Ring
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.065, 18, 64), matGold24k);
  halo.position.z = -0.10;
  g.add(halo);
  addDiamondRing(g, 0.88, 14, 0.052, matDiamond, -0.07);

  // Ornate Royal Coronet above the Heart Setting
  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.19, 0.12, 16), matGold24k);
  crownBase.position.set(0, 0.69, 0.04);
  g.add(crownBase);
  for (let p = -1; p <= 1; p++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.25, 6), p === 0 ? matGold24k : matPlatinum);
    spike.position.set(p * 0.15, 0.83, 0.04);
    spike.rotation.z = -p * 0.26;
    g.add(spike);
  }

  // 7-Feather Sculpted Seraph Wing-Guards (Gold & Platinum alternating feathers)
  const featherShape = new THREE.Shape();
  featherShape.moveTo(0, -0.06);
  featherShape.quadraticCurveTo(0.45, 0.12, 0.78, 0.36);
  featherShape.quadraticCurveTo(0.48, -0.04, 0, -0.14);
  featherShape.closePath();
  const fGeo = new THREE.ExtrudeGeometry(featherShape, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
  for (let side = -1; side <= 1; side += 2) {
    for (let f = 0; f < 6; f++) {
      const fm = new THREE.Mesh(fGeo, (f % 2 === 0) ? matGold24k : matPlatinum);
      const sc = 1.0 - f * 0.10;
      fm.scale.set(side * sc, sc, 1);
      fm.position.set(side * 0.64, 0.28 - f * 0.13, -0.06 + f * 0.015);
      fm.rotation.z = side * (0.38 - f * 0.20);
      g.add(fm);
    }
  }
  const l1 = new THREE.PointLight(0x10b981, 1.9, 4); l1.position.set(0, 0, 1.1); g.add(l1);
  g.rotation.set(0.14, -0.12, 0);
  return g;
}

function buildHazardDynamo() {
  const g = new THREE.Group();
  const innerPlasma = new THREE.Mesh(new THREE.IcosahedronGeometry(0.84, 1), makeDeepJewelMat(0x9f1239, 0xe11d48, 0.65));
  g.add(innerPlasma);

  const plateGeo = new THREE.SphereGeometry(0.95, 24, 16, 0, Math.PI * 0.42, 0.25, Math.PI * 0.42);
  for (let i = 0; i < 4; i++) {
    const pm = new THREE.Mesh(plateGeo, matObsidianDark);
    pm.rotation.y = i * Math.PI * 0.5 + 0.3;
    pm.rotation.x = (i % 2 === 0) ? 0.35 : -0.35;
    g.add(pm);
  }

  const bandMats = [matBronzeDark, matObsidianDark, matBronzeDark];
  const rots = [[0.2, 0.1, 0], [1.1, 0.4, 0.6], [-0.9, 0.5, -0.7]];
  for (let b = 0; b < 3; b++) {
    const bm = new THREE.Mesh(new THREE.TorusGeometry(1.03, 0.09, 14, 48), bandMats[b]);
    bm.rotation.set(rots[b][0], rots[b][1], rots[b][2]);
    g.add(bm);
  }

  const spMat = makeDeepJewelMat(0x881337, 0xf43f5e, 0.58);
  const spGeo = new THREE.ConeGeometry(0.14, 0.46, 6);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    const sp = new THREE.Mesh(spGeo, (k % 2 === 0) ? spMat : matObsidianDark);
    sp.position.set(Math.cos(a) * 1.10, Math.sin(a) * 1.10, (k % 2 === 0 ? 0.14 : -0.14));
    sp.rotation.z = a - Math.PI * 0.5;
    g.add(sp);
  }
  const l1 = new THREE.PointLight(0xe11d48, 2.0, 4); l1.position.set(0, 0, 1.1); g.add(l1);
  g.rotation.set(0.28, 0.34, 0.15);
  return g;
}

function buildHazardHelix() {
  const g = new THREE.Group();
  const rubyCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.84, 1), makeDeepJewelMat(0x881337, 0xbe123c, 0.58));
  g.add(rubyCore);

  const shardGeo = new THREE.TetrahedronGeometry(0.42, 0);
  for (let i = 0; i < 14; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / 14);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const sm = new THREE.Mesh(shardGeo, (i % 3 === 0) ? makeDeepJewelMat(0x9f1239, 0xf43f5e, 0.52) : matObsidianDark);
    sm.position.setFromSphericalCoords(0.84, phi, theta);
    sm.lookAt(0, 0, 0);
    g.add(sm);
  }

  for (let s = -1; s <= 1; s += 2) {
    const pts = [];
    for (let t = 0; t <= 40; t++) {
      const a = (t / 40) * Math.PI * 1.65;
      pts.push(new THREE.Vector3(Math.cos(a) * 1.08 * s, (t / 40 - 0.5) * 1.75, Math.sin(a) * 1.08));
    }
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.08, 10, false), matObsidianDark));
  }

  const fault = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.042, 12, 48), makeDeepJewelMat(0xbe123c, 0xf43f5e, 0.72));
  fault.rotation.set(0.55, 0.25, 0);
  g.add(fault);

  const l1 = new THREE.PointLight(0xbe123c, 2.2, 4); l1.position.set(0, 0, 1.2); g.add(l1);
  g.rotation.set(0.18, -0.28, 0.22);
  return g;
}

function buildSeekerRing() {
  const g = new THREE.Group();
  const ringArmor = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.115, 18, 48), matObsidianDark);
  g.add(ringArmor);
  const bronzeTrim = new THREE.Mesh(new THREE.TorusGeometry(0.89, 0.045, 14, 48), matBronzeDark);
  bronzeTrim.position.z = 0.06;
  g.add(bronzeTrim);
  const crimsonVein = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.04, 12, 48), makeDeepJewelMat(0x9f1239, 0xf43f5e, 0.78));
  crimsonVein.position.z = 0.095;
  g.add(crimsonVein);

  const scythe = new THREE.Shape();
  scythe.moveTo(0, -0.14);
  scythe.quadraticCurveTo(0.32, -0.06, 0.60, 0.36);
  scythe.quadraticCurveTo(0.22, 0.26, -0.06, 0.12);
  scythe.closePath();
  const sGeo = new THREE.ExtrudeGeometry(scythe, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 });
  const veinMat = makeDeepJewelMat(0xbe123c, 0xf43f5e, 0.72);

  for (let b = 0; b < 4; b++) {
    const a = b * (Math.PI * 0.5);
    const blade = new THREE.Group();
    blade.rotation.z = a;
    const bm = new THREE.Mesh(sGeo, matObsidianDark);
    bm.position.set(0.95, 0, -0.04);
    blade.add(bm);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.045, 0.12), veinMat);
    edge.position.set(1.22, 0.18, 0.02);
    edge.rotation.z = 0.65;
    blade.add(edge);
    g.add(blade);
  }
  const l1 = new THREE.PointLight(0xef4444, 1.8, 4); l1.position.set(0, 0, 1.2); g.add(l1);
  return g;
}

const BUILDERS = {
  'powerup-missiles-3d.png': buildMissiles,
  'powerup-cluster-3d.png': buildCluster,
  'powerup-supercharge-3d.png': buildSupercharge,
  'powerup-singularity-3d.png': buildSingularity,
  'powerup-catalyst-3d.png': buildCatalyst,
  'hazard-core-dynamo-3d.png': buildHazardDynamo,
  'hazard-core-helix-3d.png': buildHazardHelix,
  'hazard-seeker-ring-3d.png': buildSeekerRing
};

window.renderAsset = (filename) => {
  clearGroup();
  const builder = BUILDERS[filename];
  if (!builder) throw new Error('Unknown asset: ' + filename);
  rootGroup.add(builder());
  renderer.render(scene, camera);
  return canvas.toDataURL('image/png');
};
</script>
</body>
</html>`;

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
  const server = http.createServer((req, res) => {
    const cleanUrl = (req.url || '/').split('?')[0];
    if (cleanUrl === '/' || cleanUrl === '/studio.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(STUDIO_HTML);
      return;
    }
    if (cleanUrl.startsWith('/three/')) {
      const rel = cleanUrl.slice('/three/'.length);
      const fp = path.resolve(THREE_DIR, rel);
      if (!fp.startsWith(THREE_DIR)) { res.writeHead(403); res.end(); return; }
      fs.readFile(fp, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        const ext = path.extname(fp).toLowerCase();
        res.writeHead(200, { 'Content-Type': ext === '.js' ? 'application/javascript; charset=utf-8' : 'application/octet-stream' });
        res.end(data);
      });
      return;
    }
    res.writeHead(404); res.end();
  });
  return new Promise((resolve) => {
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
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
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
  async eval(expr) {
    const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
    return res.result ? res.result.value : undefined;
  }
  close() { try { this.ws.close(); } catch {} }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch(port, glFlags) {
  const cdpPort = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-pbr-'));
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
    const ready = await cdp.eval(`typeof window.renderAsset === 'function'`);
    if (ready) break;
    await sleep(120);
  }
  const ok = await cdp.eval(`typeof window.renderAsset === 'function'`);
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

    const targets = [
      'powerup-missiles-3d.png',
      'powerup-cluster-3d.png',
      'powerup-supercharge-3d.png',
      'powerup-singularity-3d.png',
      'powerup-catalyst-3d.png',
      'hazard-core-dynamo-3d.png',
      'hazard-core-helix-3d.png',
      'hazard-seeker-ring-3d.png'
    ];

    const rawDir = path.join(ROOT_DIR, 'scratch', 'pbr_raw_512');
    fs.mkdirSync(rawDir, { recursive: true });
    for (const fname of targets) {
      const dataUrl = await session.cdp.eval(`window.renderAsset('${fname}')`);
      const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(rawDir, fname), Buffer.from(b64, 'base64'));
      console.log('RENDERED_512', fname);
    }
    console.log('ALL_8_PBR_RENDERS_COMPLETE');
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
