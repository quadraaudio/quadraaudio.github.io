"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./MatrixChapterVisual.module.scss";

export type MatrixVisualVariant = "matrix" | "bridges" | "control" | "guard";

const TITLES: Record<MatrixVisualVariant, string> = {
  matrix: "Patch field",
  bridges: "Matrix Bridge",
  control: "Control room",
  guard: "Quadra Guard",
};

const FOOTER: Record<MatrixVisualVariant, string[]> = {
  matrix: ["Grid", "Gain", "Scenes A · B · C"],
  bridges: ["2A", "2B", "4", "8", "16", "32", "64", "128"],
  control: ["Dim", "Mono", "Mute", "Talk", "Cue"],
  guard: ["Trial", "Seat 1", "Seat 2", ".qkey"],
};

type Props = {
  variant: MatrixVisualVariant;
  className?: string;
  /** Accessible label for the stage */
  label?: string;
};

function prefersReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function bootRenderer(el: HTMLElement, isMobile: boolean) {
  const w = el.clientWidth;
  const h = el.clientHeight;
  if (w < 8 || h < 8) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 80);
  camera.position.set(0, 0.05, 12.8);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: "default",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 2));
  renderer.setSize(w, h);
  el.appendChild(renderer.domElement);

  return { scene, camera, renderer, w, h };
}

/** Living NxN patch matrix — cables rewire, nodes light with gain pulses. */
function buildMatrixScene(
  el: HTMLElement,
  isMobile: boolean,
  cleanups: Array<() => void>,
) {
  const boot = bootRenderer(el, isMobile);
  if (!boot) return false;
  const { scene, camera, renderer } = boot;

  const ink = new THREE.Color("#0e1218");
  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");
  const warm = new THREE.Color("#e8a54b");

  const cols = isMobile ? 12 : 18;
  const rows = isMobile ? 8 : 11;
  const spanX = 15.2;
  const spanY = 8.6;
  const nodeCount = cols * rows;
  const nodePos = new Float32Array(nodeCount * 3);
  const nodeCol = new Float32Array(nodeCount * 3);
  const nodeBase: { x: number; y: number }[] = [];

  let ni = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = (c / (cols - 1) - 0.5) * spanX;
      const y = (0.5 - r / (rows - 1)) * spanY;
      nodeBase.push({ x, y });
      const ix = ni * 3;
      nodePos[ix] = x;
      nodePos[ix + 1] = y;
      nodePos[ix + 2] = 0;
      nodeCol[ix] = steel.r * 0.4;
      nodeCol[ix + 1] = steel.g * 0.4;
      nodeCol[ix + 2] = steel.b * 0.4;
      ni += 1;
    }
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
  const nodes = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({
      size: isMobile ? 0.14 : 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  scene.add(nodes);

  type Cable = {
    from: number;
    to: number;
    phase: number;
    speed: number;
    gain: number;
    positions: Float32Array;
    colors: Float32Array;
    segs: number;
    mesh: THREE.Line;
  };

  const cables: Cable[] = [];
  const cableCount = isMobile ? 8 : 14;
  const pick = (left: boolean) => {
    const c = left
      ? Math.floor(Math.random() * Math.max(2, cols * 0.42))
      : Math.floor(cols * 0.55 + Math.random() * Math.max(2, cols * 0.42));
    const r = Math.floor(Math.random() * rows);
    return r * cols + Math.min(cols - 1, c);
  };

  for (let k = 0; k < cableCount; k += 1) {
    const segs = isMobile ? 24 : 36;
    const positions = new Float32Array((segs + 1) * 3);
    const colors = new Float32Array((segs + 1) * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mesh = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
    scene.add(mesh);
    cables.push({
      from: pick(true),
      to: pick(false),
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.7,
      gain: 0.45 + Math.random() * 0.55,
      positions,
      colors,
      segs,
      mesh,
    });
  }

  const tmp = new THREE.Color();
  let visible = true;
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
    },
    { rootMargin: "60px", threshold: 0.02 },
  );
  io.observe(el);
  cleanups.push(() => io.disconnect());

  let frame = 0;
  let rewireAt = 90;
  let raf = 0;

  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (!visible) return;
    frame += 1;
    const t = frame * 0.016;

    if (frame > rewireAt) {
      rewireAt = frame + 80 + Math.floor(Math.random() * 120);
      const cable = cables[Math.floor(Math.random() * cables.length)];
      if (cable) {
        cable.from = pick(true);
        cable.to = pick(false);
        cable.gain = 0.4 + Math.random() * 0.6;
      }
    }

    const lit = new Float32Array(nodeCount);
    for (const cable of cables) {
      const a = nodeBase[cable.from];
      const b = nodeBase[cable.to];
      if (!a || !b) continue;
      const midX = (a.x + b.x) * 0.5 + Math.sin(t * 0.7 + cable.phase) * 0.8;
      const midY = (a.y + b.y) * 0.5 + Math.cos(t * cable.speed + cable.phase) * 0.55;
      const midZ = 0.4 + cable.gain * 0.35;
      const travel = (t * cable.speed * 0.32 + cable.phase) % 1;
      lit[cable.from] = Math.max(lit[cable.from], 0.7);
      lit[cable.to] = Math.max(lit[cable.to], 0.95);

      for (let s = 0; s <= cable.segs; s += 1) {
        const u = s / cable.segs;
        const omu = 1 - u;
        const ix = s * 3;
        cable.positions[ix] = omu * omu * a.x + 2 * omu * u * midX + u * u * b.x;
        cable.positions[ix + 1] = omu * omu * a.y + 2 * omu * u * midY + u * u * b.y;
        cable.positions[ix + 2] = 2 * omu * u * midZ;
        const pulse = Math.exp(-Math.abs(u - travel) * 12) * cable.gain;
        tmp.copy(ink).lerp(accent, 0.3 + pulse * 0.5).lerp(hot, pulse * 0.55);
        if (cable.gain > 0.75) tmp.lerp(warm, pulse * 0.25);
        cable.colors[ix] = tmp.r;
        cable.colors[ix + 1] = tmp.g;
        cable.colors[ix + 2] = tmp.b;
      }
      (cable.mesh.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (cable.mesh.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    const nArr = (nodeGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
    const nCols = (nodeGeo.attributes.color as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < nodeCount; i += 1) {
      const base = nodeBase[i];
      if (!base) continue;
      const ix = i * 3;
      const glow = lit[i] || 0.06 + 0.05 * Math.sin(t * 2.1 + i * 0.4);
      nArr[ix + 2] = glow * 0.1;
      tmp.copy(steel).lerp(accent, Math.min(1, glow)).lerp(hot, glow * 0.4);
      nCols[ix] = tmp.r;
      nCols[ix + 1] = tmp.g;
      nCols[ix + 2] = tmp.b;
    }
    (nodeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (nodeGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    camera.position.x = Math.sin(t * 0.12) * 0.35;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const rw = Math.max(1, el.clientWidth);
    const rh = Math.max(1, el.clientHeight);
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh);
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));
  cleanups.push(() => {
    cancelAnimationFrame(raf);
    nodeGeo.dispose();
    (nodes.material as THREE.Material).dispose();
    for (const c of cables) {
      c.mesh.geometry.dispose();
      (c.mesh.material as THREE.Material).dispose();
    }
    const canvas = renderer.domElement;
    renderer.dispose();
    if (canvas.parentElement === el) el.removeChild(canvas);
  });
  return true;
}

/** HAL bridge devices acquire one-by-one — bars light as Core Audio devices. */
function buildBridgesScene(
  el: HTMLElement,
  isMobile: boolean,
  cleanups: Array<() => void>,
) {
  const boot = bootRenderer(el, isMobile);
  if (!boot) return false;
  const { scene, camera, renderer } = boot;
  camera.position.set(0, 0.2, 14);

  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");
  const widths = [2, 2, 4, 8, 16, 32, 64, 128];
  const count = widths.length;
  const group = new THREE.Group();
  scene.add(group);

  type Device = {
    mesh: THREE.Mesh;
    glow: THREE.Mesh;
    baseY: number;
    phase: number;
    activeAt: number;
  };
  const devices: Device[] = [];
  const geo = new THREE.BoxGeometry(1, 0.55, 0.22);
  const glowGeo = new THREE.BoxGeometry(1.05, 0.6, 0.08);

  for (let i = 0; i < count; i += 1) {
    const w = 1.1 + Math.log2(widths[i]) * 0.55;
    const mat = new THREE.MeshBasicMaterial({
      color: steel.clone().multiplyScalar(0.35),
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.scale.set(w, 1, 1);
    const x = ((i % 4) - 1.5) * 3.4;
    const y = (1.2 - Math.floor(i / 4) * 2.4) * (isMobile ? 0.85 : 1);
    mesh.position.set(x, y, 0);
    group.add(mesh);

    const glowMat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.scale.set(w, 1, 1);
    glow.position.set(x, y, 0.18);
    group.add(glow);

    devices.push({
      mesh,
      glow,
      baseY: y,
      phase: i * 0.7,
      activeAt: 0.08 + i * 0.11,
    });
  }

  // Channel tick marks as points along active devices
  const tickCount = isMobile ? 48 : 80;
  const tickPos = new Float32Array(tickCount * 3);
  const tickCol = new Float32Array(tickCount * 3);
  const tickGeo = new THREE.BufferGeometry();
  tickGeo.setAttribute("position", new THREE.BufferAttribute(tickPos, 3));
  tickGeo.setAttribute("color", new THREE.BufferAttribute(tickCol, 3));
  const ticks = new THREE.Points(
    tickGeo,
    new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    }),
  );
  scene.add(ticks);

  let visible = true;
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
    },
    { rootMargin: "60px", threshold: 0.02 },
  );
  io.observe(el);
  cleanups.push(() => io.disconnect());

  let frame = 0;
  let raf = 0;
  const tmp = new THREE.Color();

  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (!visible) return;
    frame += 1;
    const t = frame * 0.016;
    // Loop acquire cycle ~10s
    const cycle = (t * 0.1) % 1.35;

    devices.forEach((d, i) => {
      const on = cycle > d.activeAt && cycle < d.activeAt + 0.85;
      const mat = d.mesh.material as THREE.MeshBasicMaterial;
      const gmat = d.glow.material as THREE.MeshBasicMaterial;
      const target = on ? 1 : 0;
      gmat.opacity += (target * 0.55 - gmat.opacity) * 0.08;
      tmp.copy(steel).multiplyScalar(0.35).lerp(accent, gmat.opacity * 1.4);
      mat.color.copy(tmp);
      d.mesh.position.y = d.baseY + Math.sin(t * 1.2 + d.phase) * 0.04;
      d.glow.position.y = d.mesh.position.y;
      d.mesh.rotation.y = Math.sin(t * 0.4 + d.phase) * 0.08;
      d.glow.rotation.y = d.mesh.rotation.y;

      // Sprinkle channel ticks on active devices
      const base = Math.floor((i / count) * tickCount);
      const span = Math.floor(tickCount / count);
      for (let k = 0; k < span; k += 1) {
        const idx = Math.min(tickCount - 1, base + k);
        const ix = idx * 3;
        const u = k / Math.max(1, span - 1);
        tickPos[ix] = d.mesh.position.x + (u - 0.5) * d.mesh.scale.x * 0.9;
        tickPos[ix + 1] = d.mesh.position.y + 0.42;
        tickPos[ix + 2] = 0.3;
        const lit = on ? 0.5 + 0.5 * Math.sin(t * 4 + k) : 0.08;
        tmp.copy(steel).lerp(hot, lit);
        tickCol[ix] = tmp.r;
        tickCol[ix + 1] = tmp.g;
        tickCol[ix + 2] = tmp.b;
      }
    });
    (tickGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (tickGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    group.rotation.y = Math.sin(t * 0.15) * 0.12;
    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const rw = Math.max(1, el.clientWidth);
    const rh = Math.max(1, el.clientHeight);
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh);
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));
  cleanups.push(() => {
    cancelAnimationFrame(raf);
    geo.dispose();
    glowGeo.dispose();
    for (const d of devices) {
      (d.mesh.material as THREE.Material).dispose();
      (d.glow.material as THREE.Material).dispose();
    }
    tickGeo.dispose();
    (ticks.material as THREE.Material).dispose();
    const canvas = renderer.domElement;
    renderer.dispose();
    if (canvas.parentElement === el) el.removeChild(canvas);
  });
  return true;
}

/** Control-room meters + soft-pad pulses (Dim / Mono / Mute / Talk / Cue). */
function buildControlScene(
  el: HTMLElement,
  isMobile: boolean,
  cleanups: Array<() => void>,
) {
  const boot = bootRenderer(el, isMobile);
  if (!boot) return false;
  const { scene, camera, renderer } = boot;
  camera.position.set(0, 0.1, 13.5);

  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");
  const warm = new THREE.Color("#e8a54b");
  const danger = new THREE.Color("#c44536");

  const bands = isMobile ? 24 : 36;
  const levels = isMobile ? 14 : 20;
  const count = bands * levels;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const heights = new Float32Array(bands);
  const targets = new Float32Array(bands);

  let i = 0;
  for (let b = 0; b < bands; b += 1) {
    heights[b] = 0.25;
    targets[b] = 0.4;
    for (let l = 0; l < levels; l += 1) {
      const x = (b / (bands - 1) - 0.5) * 12.5;
      const y = (l / (levels - 1) - 0.55) * 5.2 - 0.6;
      const ix = i * 3;
      positions[ix] = x;
      positions[ix + 1] = y;
      positions[ix + 2] = 0;
      colors[ix] = steel.r * 0.25;
      colors[ix + 1] = steel.g * 0.25;
      colors[ix + 2] = steel.b * 0.25;
      i += 1;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const meters = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: isMobile ? 0.1 : 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    }),
  );
  scene.add(meters);

  // Soft pads as glowing discs
  const pads = ["Dim", "Mono", "Mute", "Talk", "Cue"];
  const padMeshes: { mesh: THREE.Mesh; phase: number; color: THREE.Color }[] = [];
  const padGeo = new THREE.CircleGeometry(0.55, 28);
  pads.forEach((_, idx) => {
    const color =
      idx === 2 ? danger : idx === 3 ? warm : idx === 4 ? hot : accent;
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
    });
    const mesh = new THREE.Mesh(padGeo, mat);
    const x = (idx - 2) * 1.7;
    mesh.position.set(x, -3.55, 0.2);
    scene.add(mesh);
    padMeshes.push({ mesh, phase: idx * 1.1, color });
  });

  let visible = true;
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
    },
    { rootMargin: "60px", threshold: 0.02 },
  );
  io.observe(el);
  cleanups.push(() => io.disconnect());

  let frame = 0;
  let raf = 0;
  const tmp = new THREE.Color();

  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (!visible) return;
    frame += 1;
    const t = frame * 0.016;

    for (let b = 0; b < bands; b += 1) {
      if (Math.random() < 0.08) {
        targets[b] = 0.15 + Math.random() * 0.85;
      }
      heights[b] += (targets[b] - heights[b]) * 0.12;
    }

    let pi = 0;
    for (let b = 0; b < bands; b += 1) {
      const h = heights[b];
      for (let l = 0; l < levels; l += 1) {
        const u = l / (levels - 1);
        const ix = pi * 3;
        const on = u <= h;
        const peak = u > 0.82;
        if (!on) {
          tmp.copy(steel).multiplyScalar(0.18);
        } else if (peak) {
          tmp.copy(warm).lerp(danger, (u - 0.82) / 0.18);
        } else {
          tmp.copy(accent).lerp(hot, u);
        }
        colors[ix] = tmp.r;
        colors[ix + 1] = tmp.g;
        colors[ix + 2] = tmp.b;
        positions[ix + 2] = on ? 0.05 + u * 0.1 : 0;
        pi += 1;
      }
    }
    (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    padMeshes.forEach((p, idx) => {
      const pulse = 0.18 + 0.55 * Math.max(0, Math.sin(t * 1.4 + p.phase));
      // Mute flashes rarer; Talk/Cue alternate
      const active =
        idx === 2
          ? Math.sin(t * 0.35) > 0.92
          : idx === 3
            ? Math.sin(t * 0.55 + 1) > 0.4
            : true;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = active
        ? pulse
        : 0.12;
      p.mesh.scale.setScalar(0.92 + pulse * 0.12);
    });

    camera.position.x = Math.sin(t * 0.1) * 0.25;
    camera.lookAt(0, -0.4, 0);
    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const rw = Math.max(1, el.clientWidth);
    const rh = Math.max(1, el.clientHeight);
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh);
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));
  cleanups.push(() => {
    cancelAnimationFrame(raf);
    geo.dispose();
    (meters.material as THREE.Material).dispose();
    padGeo.dispose();
    for (const p of padMeshes) (p.mesh.material as THREE.Material).dispose();
    const canvas = renderer.domElement;
    renderer.dispose();
    if (canvas.parentElement === el) el.removeChild(canvas);
  });
  return true;
}

/** Guard: account node binds two Mac seats + signed license pulse. */
function buildGuardScene(
  el: HTMLElement,
  isMobile: boolean,
  cleanups: Array<() => void>,
) {
  const boot = bootRenderer(el, isMobile);
  if (!boot) return false;
  const { scene, camera, renderer } = boot;
  camera.position.set(0, 0.15, 13.2);

  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");

  const nodes = [
    { x: 0, y: 1.6, r: 0.85, label: "id" },
    { x: -3.4, y: -1.5, r: 0.65, label: "mac1" },
    { x: 3.4, y: -1.5, r: 0.65, label: "mac2" },
  ];

  const sphereGeo = new THREE.SphereGeometry(1, isMobile ? 16 : 24, isMobile ? 12 : 18);
  const meshes = nodes.map((n) => {
    const mat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.position.set(n.x, n.y, 0);
    mesh.scale.setScalar(n.r);
    scene.add(mesh);
    return mesh;
  });

  // Core filled seals
  const coreGeo = new THREE.SphereGeometry(1, 20, 16);
  const cores = nodes.map((n, idx) => {
    const mat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? hot : accent,
      transparent: true,
      opacity: 0.22,
    });
    const mesh = new THREE.Mesh(coreGeo, mat);
    mesh.position.set(n.x, n.y, 0);
    mesh.scale.setScalar(n.r * 0.55);
    scene.add(mesh);
    return mesh;
  });

  type Link = {
    positions: Float32Array;
    colors: Float32Array;
    mesh: THREE.Line;
    from: number;
    to: number;
    phase: number;
  };
  const links: Link[] = [];
  const pairs: [number, number][] = [
    [0, 1],
    [0, 2],
  ];
  for (const [from, to] of pairs) {
    const segs = 40;
    const positions = new Float32Array((segs + 1) * 3);
    const colors = new Float32Array((segs + 1) * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mesh = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
    scene.add(mesh);
    links.push({ positions, colors, mesh, from, to, phase: from * 1.7 });
  }

  // Orbiting particles = signed payload
  const pCount = isMobile ? 60 : 100;
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    }),
  );
  scene.add(particles);

  let visible = true;
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
    },
    { rootMargin: "60px", threshold: 0.02 },
  );
  io.observe(el);
  cleanups.push(() => io.disconnect());

  let frame = 0;
  let raf = 0;
  const tmp = new THREE.Color();

  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (!visible) return;
    frame += 1;
    const t = frame * 0.016;

    meshes.forEach((m, idx) => {
      m.rotation.y = t * (0.25 + idx * 0.08);
      m.rotation.x = t * 0.12;
      (m.material as THREE.MeshBasicMaterial).opacity =
        0.28 + 0.12 * Math.sin(t * 1.5 + idx);
    });
    cores.forEach((c, idx) => {
      c.scale.setScalar(nodes[idx].r * (0.5 + 0.08 * Math.sin(t * 2 + idx)));
    });

    for (const link of links) {
      const a = nodes[link.from];
      const b = nodes[link.to];
      const travel = (t * 0.35 + link.phase) % 1;
      for (let s = 0; s <= 40; s += 1) {
        const u = s / 40;
        const omu = 1 - u;
        const midX = (a.x + b.x) * 0.5;
        const midY = (a.y + b.y) * 0.5 + 0.8;
        const midZ = 0.6;
        const ix = s * 3;
        link.positions[ix] = omu * omu * a.x + 2 * omu * u * midX + u * u * b.x;
        link.positions[ix + 1] = omu * omu * a.y + 2 * omu * u * midY + u * u * b.y;
        link.positions[ix + 2] = 2 * omu * u * midZ;
        const pulse = Math.exp(-Math.abs(u - travel) * 10);
        tmp.copy(steel).lerp(accent, 0.4).lerp(hot, pulse);
        link.colors[ix] = tmp.r;
        link.colors[ix + 1] = tmp.g;
        link.colors[ix + 2] = tmp.b;
      }
      (link.mesh.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
      (link.mesh.geometry.attributes.color as THREE.BufferAttribute).needsUpdate =
        true;
    }

    for (let p = 0; p < pCount; p += 1) {
      const ix = p * 3;
      const orbit = p / pCount;
      const seat = p % 2 === 0 ? 1 : 2;
      const target = nodes[seat];
      const ang = t * 0.8 + orbit * Math.PI * 2;
      const rad = 1.2 + (p % 5) * 0.12;
      // Particles travel from center to seats
      const go = (t * 0.2 + orbit) % 1;
      pPos[ix] = THREE.MathUtils.lerp(nodes[0].x, target.x + Math.cos(ang) * rad * 0.3, go);
      pPos[ix + 1] = THREE.MathUtils.lerp(nodes[0].y, target.y + Math.sin(ang) * rad * 0.3, go);
      pPos[ix + 2] = Math.sin(go * Math.PI) * 0.8;
      tmp.copy(accent).lerp(hot, go);
      pCol[ix] = tmp.r;
      pCol[ix + 1] = tmp.g;
      pCol[ix + 2] = tmp.b;
    }
    (pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (pGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    camera.position.x = Math.sin(t * 0.12) * 0.4;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const rw = Math.max(1, el.clientWidth);
    const rh = Math.max(1, el.clientHeight);
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh);
  };
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));
  cleanups.push(() => {
    cancelAnimationFrame(raf);
    sphereGeo.dispose();
    coreGeo.dispose();
    for (const m of meshes) (m.material as THREE.Material).dispose();
    for (const c of cores) (c.material as THREE.Material).dispose();
    for (const l of links) {
      l.mesh.geometry.dispose();
      (l.mesh.material as THREE.Material).dispose();
    }
    pGeo.dispose();
    (particles.material as THREE.Material).dispose();
    const canvas = renderer.domElement;
    renderer.dispose();
    if (canvas.parentElement === el) el.removeChild(canvas);
  });
  return true;
}

const BUILDERS: Record<
  MatrixVisualVariant,
  (el: HTMLElement, isMobile: boolean, cleanups: Array<() => void>) => boolean
> = {
  matrix: buildMatrixScene,
  bridges: buildBridgesScene,
  control: buildControlScene,
  guard: buildGuardScene,
};

/**
 * Chapter visual plane — procedural WebGL story per MATRIX feature.
 * No stock photography; CSS motion fallback when WebGL / motion is unavailable.
 */
export function MatrixChapterVisual({
  variant,
  className = "",
  label,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLabel, setActiveLabel] = useState(0);
  const footer = FOOTER[variant];

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveLabel((n) => (n + 1) % footer.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [footer.length]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (prefersReduce()) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];
    let raf = 0;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const build = BUILDERS[variant];

    let tries = 0;
    const boot = () => {
      if (cancelled) return;
      if (build(mount, isMobile, cleanups)) return;
      tries += 1;
      if (tries < 40) raf = requestAnimationFrame(boot);
    };
    raf = requestAnimationFrame(boot);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      for (const fn of cleanups) {
        try {
          fn();
        } catch {
          /* ignore */
        }
      }
    };
  }, [variant]);

  return (
    <figure
      className={`${styles.stage} ${className}`.trim()}
      aria-label={label || TITLES[variant]}
    >
      <div className={styles.cssFallback} aria-hidden>
        <div className={styles.grid} />
        <div className={styles.glow} />
      </div>
      <div ref={mountRef} className={styles.canvas} aria-hidden />
      <div className={styles.chrome} aria-hidden>
        <div className={styles.chromeTop}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={`${styles.dot} ${styles.dotHot}`} />
          <span className={styles.title}>{TITLES[variant]}</span>
        </div>
      </div>
      <div className={styles.labels} aria-hidden>
        {footer.map((text, i) => (
          <span
            key={text}
            className={`${styles.label} ${i === activeLabel ? styles.labelOn : ""}`}
          >
            {text}
          </span>
        ))}
      </div>
    </figure>
  );
}
