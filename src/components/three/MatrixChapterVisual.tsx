"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./MatrixChapterVisual.module.scss";

export type MatrixVisualVariant = "matrix" | "bridges" | "control" | "guard";

type Props = {
  variant: MatrixVisualVariant;
  className?: string;
  label?: string;
};

function readProgress(from: HTMLElement | null): number {
  if (!from) return 0;
  const pin = from.closest("[data-mx-pin]") as HTMLElement | null;
  const raw = pin?.dataset.mxProgress;
  const n = raw == null ? 0 : Number(raw);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}

function boot(el: HTMLElement, isMobile: boolean) {
  const w = el.clientWidth;
  const h = el.clientHeight;
  if (w < 8 || h < 8) return null;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 80);
  camera.position.set(0, 0.1, 13.2);
  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: "default",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.3 : 2));
  renderer.setSize(w, h);
  el.appendChild(renderer.domElement);
  return { scene, camera, renderer };
}

type SceneApi = {
  setProgress: (p: number) => void;
  resize: () => void;
  dispose: () => void;
  render: () => void;
};

/** Patch field: empty grid → cables draw in with scroll progress. */
function createMatrix(el: HTMLElement, isMobile: boolean): SceneApi | null {
  const bootstrapped = boot(el, isMobile);
  if (!bootstrapped) return null;
  const { scene, camera, renderer } = bootstrapped;

  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");
  const cols = isMobile ? 11 : 16;
  const rows = isMobile ? 7 : 10;
  const spanX = 14.8;
  const spanY = 8.2;
  const nodeCount = cols * rows;
  const nodeBase: { x: number; y: number }[] = [];
  const nodePos = new Float32Array(nodeCount * 3);
  const nodeCol = new Float32Array(nodeCount * 3);

  let ni = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = (c / (cols - 1) - 0.5) * spanX;
      const y = (0.5 - r / (rows - 1)) * spanY;
      nodeBase.push({ x, y });
      const ix = ni * 3;
      nodePos[ix] = x;
      nodePos[ix + 1] = y;
      nodeCol[ix] = steel.r * 0.35;
      nodeCol[ix + 1] = steel.g * 0.35;
      nodeCol[ix + 2] = steel.b * 0.35;
      ni += 1;
    }
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
  const nodes = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({
      size: isMobile ? 0.13 : 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  scene.add(nodes);

  const routes: { from: number; to: number }[] = [];
  const routeCount = isMobile ? 7 : 12;
  for (let k = 0; k < routeCount; k += 1) {
    const c0 = Math.floor(Math.random() * Math.max(2, cols * 0.4));
    const c1 = Math.floor(cols * 0.55 + Math.random() * Math.max(2, cols * 0.4));
    const r0 = Math.floor(Math.random() * rows);
    const r1 = Math.floor(Math.random() * rows);
    routes.push({ from: r0 * cols + c0, to: r1 * cols + Math.min(cols - 1, c1) });
  }

  const segs = isMobile ? 22 : 32;
  const cables = routes.map(() => {
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
        opacity: 0,
        depthWrite: false,
      }),
    );
    scene.add(mesh);
    return { positions, colors, mesh, geo };
  });

  let progress = 0;
  const tmp = new THREE.Color();

  const setProgress = (p: number) => {
    progress = p;
  };

  const render = () => {
    const drawCount = progress * routes.length;
    const lit = new Float32Array(nodeCount);

    cables.forEach((cable, i) => {
      const route = routes[i];
      const a = nodeBase[route.from];
      const b = nodeBase[route.to];
      const local = Math.min(1, Math.max(0, drawCount - i));
      const mat = cable.mesh.material as THREE.LineBasicMaterial;
      mat.opacity = local * 0.95;
      if (local <= 0.001 || !a || !b) return;

      lit[route.from] = Math.max(lit[route.from], local);
      lit[route.to] = Math.max(lit[route.to], local);

      const midX = (a.x + b.x) * 0.5;
      const midY = (a.y + b.y) * 0.5 + (i % 2 === 0 ? 0.7 : -0.55);
      const midZ = 0.55;
      const tip = local; // cable grows along length

      for (let s = 0; s <= segs; s += 1) {
        const u = s / segs;
        const drawU = Math.min(u, tip);
        const omu = 1 - drawU;
        const ix = s * 3;
        cable.positions[ix] = omu * omu * a.x + 2 * omu * drawU * midX + drawU * drawU * b.x;
        cable.positions[ix + 1] =
          omu * omu * a.y + 2 * omu * drawU * midY + drawU * drawU * b.y;
        cable.positions[ix + 2] = 2 * omu * drawU * midZ;
        const head = u <= tip ? Math.exp(-Math.abs(u - tip) * 18) : 0;
        const on = u <= tip ? 1 : 0;
        tmp.copy(steel).lerp(accent, 0.45 * on).lerp(hot, head);
        cable.colors[ix] = tmp.r;
        cable.colors[ix + 1] = tmp.g;
        cable.colors[ix + 2] = tmp.b;
      }
      (cable.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (cable.geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    });

    const nCols = (nodeGeo.attributes.color as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < nodeCount; i += 1) {
      const glow = lit[i] || 0.08 * progress;
      const ix = i * 3;
      tmp.copy(steel).multiplyScalar(0.35).lerp(accent, glow).lerp(hot, glow * 0.5);
      nCols[ix] = tmp.r;
      nCols[ix + 1] = tmp.g;
      nCols[ix + 2] = tmp.b;
    }
    (nodeGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

    camera.position.z = 14.2 - progress * 1.4;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };

  return {
    setProgress,
    render,
    resize: () => {
      const rw = Math.max(1, el.clientWidth);
      const rh = Math.max(1, el.clientHeight);
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    },
    dispose: () => {
      nodeGeo.dispose();
      (nodes.material as THREE.Material).dispose();
      for (const c of cables) {
        c.geo.dispose();
        (c.mesh.material as THREE.Material).dispose();
      }
      const canvas = renderer.domElement;
      renderer.dispose();
      if (canvas.parentElement === el) el.removeChild(canvas);
    },
  };
}

/** Bridges: device slabs materialize left→right with scroll. */
function createBridges(el: HTMLElement, isMobile: boolean): SceneApi | null {
  const bootstrapped = boot(el, isMobile);
  if (!bootstrapped) return null;
  const { scene, camera, renderer } = bootstrapped;
  camera.position.set(0, 0.3, 14.5);

  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");
  const widths = [2, 2, 4, 8, 16, 32, 64, 128];
  const geo = new THREE.BoxGeometry(1, 0.48, 0.2);
  const devices = widths.map((w, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: steel.clone().multiplyScalar(0.25),
      transparent: true,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const scaleX = 1.05 + Math.log2(w) * 0.5;
    mesh.scale.set(scaleX, 1, 1);
    const col = i % 4;
    const row = Math.floor(i / 4);
    mesh.position.set((col - 1.5) * 3.35, (0.9 - row * 2.2) * (isMobile ? 0.85 : 1), 0);
    scene.add(mesh);
    return { mesh, mat, scaleX, i };
  });

  let progress = 0;
  const tmp = new THREE.Color();

  return {
    setProgress: (p) => {
      progress = p;
    },
    render: () => {
      const n = devices.length;
      devices.forEach((d) => {
        const local = Math.min(1, Math.max(0, progress * n - d.i));
        d.mat.opacity = local * 0.9;
        tmp.copy(steel).multiplyScalar(0.28).lerp(accent, local).lerp(hot, local * 0.35);
        d.mat.color.copy(tmp);
        d.mesh.scale.set(d.scaleX * (0.75 + local * 0.25), 0.75 + local * 0.25, 1);
        d.mesh.position.z = local * 0.35;
      });
      camera.position.x = (progress - 0.5) * 0.6;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    },
    resize: () => {
      const rw = Math.max(1, el.clientWidth);
      const rh = Math.max(1, el.clientHeight);
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    },
    dispose: () => {
      geo.dispose();
      for (const d of devices) d.mat.dispose();
      const canvas = renderer.domElement;
      renderer.dispose();
      if (canvas.parentElement === el) el.removeChild(canvas);
    },
  };
}

/** Control: meter towers rise with scroll; pads ignite near the end. */
function createControl(el: HTMLElement, isMobile: boolean): SceneApi | null {
  const bootstrapped = boot(el, isMobile);
  if (!bootstrapped) return null;
  const { scene, camera, renderer } = bootstrapped;
  camera.position.set(0, 0.2, 13.8);

  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");
  const warm = new THREE.Color("#e8a54b");
  const danger = new THREE.Color("#c44536");

  const bands = isMobile ? 20 : 30;
  const levels = isMobile ? 12 : 16;
  const count = bands * levels;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  // Fixed “song” envelope so scroll feels authored, not random
  const envelope = new Float32Array(bands);
  for (let b = 0; b < bands; b += 1) {
    const u = b / (bands - 1);
    envelope[b] =
      0.25 +
      0.55 * Math.sin(u * Math.PI * 2.2) ** 2 +
      0.2 * Math.sin(u * Math.PI * 5.1);
  }

  let i = 0;
  for (let b = 0; b < bands; b += 1) {
    for (let l = 0; l < levels; l += 1) {
      const x = (b / (bands - 1) - 0.5) * 12;
      const y = (l / (levels - 1) - 0.5) * 4.6 - 0.3;
      const ix = i * 3;
      positions[ix] = x;
      positions[ix + 1] = y;
      colors[ix] = steel.r * 0.15;
      colors[ix + 1] = steel.g * 0.15;
      colors[ix + 2] = steel.b * 0.15;
      i += 1;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const meters = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: isMobile ? 0.1 : 0.078,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    }),
  );
  scene.add(meters);

  const padGeo = new THREE.CircleGeometry(0.5, 24);
  const padColors = [accent, accent, danger, warm, hot];
  const pads = padColors.map((color, idx) => {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(padGeo, mat);
    mesh.position.set((idx - 2) * 1.55, -3.35, 0.15);
    scene.add(mesh);
    return { mesh, mat };
  });

  let progress = 0;
  const tmp = new THREE.Color();

  return {
    setProgress: (p) => {
      progress = p;
    },
    render: () => {
      let pi = 0;
      for (let b = 0; b < bands; b += 1) {
        const h = envelope[b] * progress;
        for (let l = 0; l < levels; l += 1) {
          const u = l / (levels - 1);
          const ix = pi * 3;
          const on = u <= h;
          if (!on) {
            tmp.copy(steel).multiplyScalar(0.12);
          } else if (u > 0.8) {
            tmp.copy(warm).lerp(danger, (u - 0.8) / 0.2);
          } else {
            tmp.copy(accent).lerp(hot, u);
          }
          colors[ix] = tmp.r;
          colors[ix + 1] = tmp.g;
          colors[ix + 2] = tmp.b;
          pi += 1;
        }
      }
      (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      const padP = Math.max(0, (progress - 0.55) / 0.45);
      pads.forEach((p, idx) => {
        const local = Math.min(1, Math.max(0, padP * pads.length - idx));
        p.mat.opacity = local * 0.7;
        p.mesh.scale.setScalar(0.85 + local * 0.2);
      });

      camera.position.z = 14.5 - progress * 1.2;
      camera.lookAt(0, -0.5, 0);
      renderer.render(scene, camera);
    },
    resize: () => {
      const rw = Math.max(1, el.clientWidth);
      const rh = Math.max(1, el.clientHeight);
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    },
    dispose: () => {
      geo.dispose();
      (meters.material as THREE.Material).dispose();
      padGeo.dispose();
      for (const p of pads) p.mat.dispose();
      const canvas = renderer.domElement;
      renderer.dispose();
      if (canvas.parentElement === el) el.removeChild(canvas);
    },
  };
}

/** Guard: license bond grows from identity to two Mac seats. */
function createGuard(el: HTMLElement, isMobile: boolean): SceneApi | null {
  const bootstrapped = boot(el, isMobile);
  if (!bootstrapped) return null;
  const { scene, camera, renderer } = bootstrapped;

  const steel = new THREE.Color("#8b95a5");
  const accent = new THREE.Color("#00a3a0");
  const hot = new THREE.Color("#5ee0dc");

  const nodes = [
    { x: 0, y: 1.5, r: 0.9 },
    { x: -3.5, y: -1.55, r: 0.62 },
    { x: 3.5, y: -1.55, r: 0.62 },
  ];

  const sphereGeo = new THREE.SphereGeometry(1, isMobile ? 14 : 22, isMobile ? 10 : 16);
  const cores = nodes.map((n, idx) => {
    const wire = new THREE.MeshBasicMaterial({
      color: idx === 0 ? hot : accent,
      transparent: true,
      opacity: 0,
      wireframe: true,
    });
    const fill = new THREE.MeshBasicMaterial({
      color: idx === 0 ? hot : accent,
      transparent: true,
      opacity: 0,
    });
    const wMesh = new THREE.Mesh(sphereGeo, wire);
    const fMesh = new THREE.Mesh(sphereGeo, fill);
    wMesh.position.set(n.x, n.y, 0);
    fMesh.position.set(n.x, n.y, 0);
    wMesh.scale.setScalar(n.r);
    fMesh.scale.setScalar(n.r * 0.45);
    scene.add(wMesh, fMesh);
    return { wMesh, fMesh, wire, fill, n };
  });

  const segs = 36;
  const links = [
    [0, 1],
    [0, 2],
  ].map(([from, to]) => {
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
        opacity: 0,
        depthWrite: false,
      }),
    );
    scene.add(mesh);
    return { from, to, positions, colors, geo, mesh };
  });

  let progress = 0;
  const tmp = new THREE.Color();

  return {
    setProgress: (p) => {
      progress = p;
    },
    render: () => {
      // Identity appears first, then seats, then bonds complete
      const idP = Math.min(1, progress / 0.28);
      const seatP = Math.min(1, Math.max(0, (progress - 0.22) / 0.35));
      const bondP = Math.min(1, Math.max(0, (progress - 0.45) / 0.55));

      cores.forEach((c, idx) => {
        const local = idx === 0 ? idP : seatP;
        c.wire.opacity = local * 0.4;
        c.fill.opacity = local * 0.25;
        c.wMesh.scale.setScalar(c.n.r * (0.7 + local * 0.3));
        c.fMesh.scale.setScalar(c.n.r * 0.4 * (0.7 + local * 0.3));
      });

      links.forEach((link, li) => {
        const local = Math.min(1, Math.max(0, bondP * 2 - li));
        (link.mesh.material as THREE.LineBasicMaterial).opacity = local * 0.95;
        const a = nodes[link.from];
        const b = nodes[link.to];
        for (let s = 0; s <= segs; s += 1) {
          const u = s / segs;
          const drawU = Math.min(u, local);
          const omu = 1 - drawU;
          const midX = (a.x + b.x) * 0.5;
          const midY = (a.y + b.y) * 0.5 + 0.85;
          const ix = s * 3;
          link.positions[ix] = omu * omu * a.x + 2 * omu * drawU * midX + drawU * drawU * b.x;
          link.positions[ix + 1] =
            omu * omu * a.y + 2 * omu * drawU * midY + drawU * drawU * b.y;
          link.positions[ix + 2] = 2 * omu * drawU * 0.55;
          const head = u <= local ? Math.exp(-Math.abs(u - local) * 14) : 0;
          tmp.copy(steel).lerp(accent, 0.5).lerp(hot, head);
          link.colors[ix] = tmp.r;
          link.colors[ix + 1] = tmp.g;
          link.colors[ix + 2] = tmp.b;
        }
        (link.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        (link.geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      });

      camera.position.z = 14 - progress * 1.1;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    },
    resize: () => {
      const rw = Math.max(1, el.clientWidth);
      const rh = Math.max(1, el.clientHeight);
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    },
    dispose: () => {
      sphereGeo.dispose();
      for (const c of cores) {
        c.wire.dispose();
        c.fill.dispose();
      }
      for (const l of links) {
        l.geo.dispose();
        (l.mesh.material as THREE.Material).dispose();
      }
      const canvas = renderer.domElement;
      renderer.dispose();
      if (canvas.parentElement === el) el.removeChild(canvas);
    },
  };
}

const FACTORIES: Record<
  MatrixVisualVariant,
  (el: HTMLElement, isMobile: boolean) => SceneApi | null
> = {
  matrix: createMatrix,
  bridges: createBridges,
  control: createControl,
  guard: createGuard,
};

/**
 * Full-bleed chapter visual — state is scroll progress from MatrixChapterPin,
 * not a free-running loop. Designed to sit behind typography, not in a card.
 */
export function MatrixChapterVisual({ variant, className = "", label }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const root = rootRef.current;
    if (!mount || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let api: SceneApi | null = null;
    let raf = 0;
    let tries = 0;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const tick = () => {
      if (cancelled || !api) return;
      api.setProgress(readProgress(root));
      api.render();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (cancelled) return;
      api = FACTORIES[variant](mount, isMobile);
      if (!api) {
        tries += 1;
        if (tries < 40) raf = requestAnimationFrame(start);
        return;
      }
      api.setProgress(readProgress(root));
      api.render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(start);

    const onResize = () => api?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      api?.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={rootRef}
      className={`${styles.stage} ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <div className={styles.cssFallback} aria-hidden>
        <div className={styles.grid} />
        <div className={styles.glow} />
      </div>
      <div ref={mountRef} className={styles.canvas} aria-hidden />
      <div className={styles.veil} aria-hidden />
    </div>
  );
}
