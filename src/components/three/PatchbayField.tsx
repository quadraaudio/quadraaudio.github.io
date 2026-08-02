"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./PatchbayField.module.scss";

type PatchbayFieldProps = {
  fallbackSrc?: string;
  fallbackAlt?: string;
};

/**
 * Hydra-exclusive hero: a living patchbay matrix.
 * WebGL init is fail-safe — falls back to a still so the page never goes blank.
 */
export function PatchbayField({
  fallbackSrc,
  fallbackAlt = "",
}: PatchbayFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const mount = mountRef.current;
    if (!mount) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | undefined;
    let raf = 0;
    let io: IntersectionObserver | undefined;
    const cleanups: Array<() => void> = [];

    try {
      const probe = document.createElement("canvas");
      if (
        !(probe.getContext("webgl2") || probe.getContext("webgl"))
      ) {
        setFailed(true);
        return;
      }

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      /* Dense ambient field for full-bleed hero (not a framed panel) */
      const cols = isMobile ? 14 : 22;
      const rows = isMobile ? 10 : 14;
      const cableCount = isMobile ? 9 : 16;

      const scene = new THREE.Scene();
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 80);
      camera.position.set(0, 0.1, 13.6);

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, isMobile ? 1.4 : 2),
      );
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);

      const ink = new THREE.Color("#0e1218");
      const steel = new THREE.Color("#8b95a5");
      const hot = new THREE.Color("#00a3a0");
      const accent = new THREE.Color("#00a3a0");

      const spanX = 16.5;
      const spanY = 9.4;
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
          nodeCol[ix] = steel.r * 0.55;
          nodeCol[ix + 1] = steel.g * 0.55;
          nodeCol[ix + 2] = steel.b * 0.55;
          ni += 1;
        }
      }

      const nodeGeo = new THREE.BufferGeometry();
      nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
      nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
      const nodeMat = new THREE.PointsMaterial({
        size: isMobile ? 0.1 : 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const nodes = new THREE.Points(nodeGeo, nodeMat);
      scene.add(nodes);

      const gridPts: number[] = [];
      for (let c = 0; c < cols; c += 1) {
        const x = (c / (cols - 1) - 0.5) * spanX;
        for (let s = 0; s < 18; s += 1) {
          gridPts.push(x, (s / 17 - 0.5) * spanY, -0.08);
        }
      }
      for (let r = 0; r < rows; r += 1) {
        const y = (0.5 - r / (rows - 1)) * spanY;
        for (let s = 0; s < 22; s += 1) {
          gridPts.push((s / 21 - 0.5) * spanX, y, -0.08);
        }
      }
      const gridGeo = new THREE.BufferGeometry();
      gridGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(gridPts, 3),
      );
      const gridMat = new THREE.PointsMaterial({
        size: 0.02,
        color: new THREE.Color("#1a2330"),
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
      scene.add(new THREE.Points(gridGeo, gridMat));

      type Cable = {
        from: number;
        to: number;
        phase: number;
        speed: number;
        mesh: THREE.Line;
        positions: Float32Array;
        colors: Float32Array;
        segs: number;
      };

      const cables: Cable[] = [];
      const pickNode = (preferLeft: boolean) => {
        const c = preferLeft
          ? Math.floor(Math.random() * Math.max(2, cols * 0.45))
          : Math.floor(cols * 0.55 + Math.random() * Math.max(2, cols * 0.45));
        const r = Math.floor(Math.random() * rows);
        return r * cols + Math.min(cols - 1, c);
      };

      for (let k = 0; k < cableCount; k += 1) {
        const segs = isMobile ? 28 : 40;
        const positions = new Float32Array((segs + 1) * 3);
        const colors = new Float32Array((segs + 1) * 3);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        });
        const mesh = new THREE.Line(geo, mat);
        scene.add(mesh);
        cables.push({
          from: pickNode(true),
          to: pickNode(false),
          phase: Math.random() * Math.PI * 2,
          speed: 0.35 + Math.random() * 0.55,
          mesh,
          positions,
          colors,
          segs,
        });
      }

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointerMove = (event: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        pointer.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      cleanups.push(() =>
        window.removeEventListener("pointermove", onPointerMove),
      );

      let visible = true;
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "60px", threshold: 0.05 },
      );
      io.observe(mount);

      let frame = 0;
      let rewireAt = 180;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible || !renderer) return;
        frame += 1;
        const t = frame * 0.016;

        pointer.x += (pointer.tx - pointer.x) * 0.12;
        pointer.y += (pointer.ty - pointer.y) * 0.12;

        if (frame > rewireAt) {
          rewireAt = frame + 140 + Math.floor(Math.random() * 160);
          const cable = cables[Math.floor(Math.random() * cables.length)];
          if (cable) {
            cable.from = pickNode(true);
            cable.to = pickNode(false);
            cable.phase = Math.random() * Math.PI * 2;
          }
        }

        const lit = new Float32Array(nodeCount);

        for (const cable of cables) {
          const a = nodeBase[cable.from];
          const b = nodeBase[cable.to];
          if (!a || !b) continue;

          const midX = (a.x + b.x) * 0.5 + pointer.x * 0.55;
          const midY =
            (a.y + b.y) * 0.5 +
            Math.sin(t * cable.speed + cable.phase) * 0.55 +
            pointer.y * 0.25;
          const midZ = 0.35 + Math.sin(t * 0.8 + cable.phase) * 0.12;
          const travel = (t * cable.speed * 0.35 + cable.phase) % 1;
          lit[cable.from] = Math.max(lit[cable.from], 0.75);
          lit[cable.to] = Math.max(lit[cable.to], 0.9);

          for (let s = 0; s <= cable.segs; s += 1) {
            const u = s / cable.segs;
            const omu = 1 - u;
            const x = omu * omu * a.x + 2 * omu * u * midX + u * u * b.x;
            const y = omu * omu * a.y + 2 * omu * u * midY + u * u * b.y;
            const z = 2 * omu * u * midZ;
            const ix = s * 3;
            cable.positions[ix] = x;
            cable.positions[ix + 1] = y;
            cable.positions[ix + 2] = z;

            const pulse = Math.exp(-Math.abs(u - travel) * 14);
            const c = ink
              .clone()
              .lerp(accent, 0.35 + pulse * 0.65)
              .lerp(hot, pulse * 0.45);
            cable.colors[ix] = c.r;
            cable.colors[ix + 1] = c.g;
            cable.colors[ix + 2] = c.b;

            const near = Math.floor(u * (cols - 1));
            for (let d = -1; d <= 1; d += 1) {
              const rr = Math.floor((0.5 - y / spanY) * (rows - 1));
              const cc = Math.min(cols - 1, Math.max(0, near + d));
              const idx = Math.min(rows - 1, Math.max(0, rr)) * cols + cc;
              lit[idx] = Math.max(lit[idx], 0.15 + pulse * 0.55);
            }
          }

          (
            cable.mesh.geometry.attributes.position as THREE.BufferAttribute
          ).needsUpdate = true;
          (
            cable.mesh.geometry.attributes.color as THREE.BufferAttribute
          ).needsUpdate = true;
        }

        const nPos = nodeGeo.attributes.position as THREE.BufferAttribute;
        const nCol = nodeGeo.attributes.color as THREE.BufferAttribute;
        const nArr = nPos.array as Float32Array;
        const nCols = nCol.array as Float32Array;

        for (let i = 0; i < nodeCount; i += 1) {
          const base = nodeBase[i];
          if (!base) continue;
          const ix = i * 3;
          const glow = lit[i] || 0.05 + 0.04 * Math.sin(t * 2 + i * 0.35);
          nArr[ix] = base.x;
          nArr[ix + 1] = base.y;
          nArr[ix + 2] = glow * 0.12;
          const c = steel
            .clone()
            .lerp(accent, Math.min(1, glow))
            .lerp(hot, glow * 0.35);
          nCols[ix] = c.r;
          nCols[ix + 1] = c.g;
          nCols[ix + 2] = c.b;
        }
        nPos.needsUpdate = true;
        nCol.needsUpdate = true;

        nodes.rotation.y = pointer.x * 0.08;
        nodes.rotation.x = -0.06 + pointer.y * 0.04;
        camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.08;
        camera.position.y +=
          (0.15 + pointer.y * 0.2 - camera.position.y) * 0.08;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        if (!renderer) return;
        const rw = Math.max(1, mount.clientWidth);
        const rh = Math.max(1, mount.clientHeight);
        camera.aspect = rw / rh;
        camera.updateProjectionMatrix();
        renderer.setSize(rw, rh);
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      cleanups.push(() => {
        cancelAnimationFrame(raf);
        io?.disconnect();
        nodeGeo.dispose();
        nodeMat.dispose();
        gridGeo.dispose();
        gridMat.dispose();
        for (const cable of cables) {
          cable.mesh.geometry.dispose();
          (cable.mesh.material as THREE.Material).dispose();
        }
        if (renderer) {
          const el = renderer.domElement;
          renderer.dispose();
          if (el.parentElement === mount) mount.removeChild(el);
        }
      });
    } catch {
      // Tear down any partial WebGL setup, then show still.
      for (const fn of cleanups) {
        try {
          fn();
        } catch {
          /* ignore */
        }
      }
      if (renderer) {
        try {
          const el = renderer.domElement;
          renderer.dispose();
          el.remove();
        } catch {
          /* ignore */
        }
      }
      setFailed(true);
      return;
    }

    return () => {
      for (const fn of cleanups) {
        try {
          fn();
        } catch {
          /* ignore */
        }
      }
    };
  }, [failed]);

  if (failed) {
    if (!fallbackSrc) return null;
    return (
      <div className={styles.fallback} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.fallbackImage}
          src={fallbackSrc}
          alt={fallbackAlt}
        />
      </div>
    );
  }

  return <div ref={mountRef} className={styles.canvas} aria-hidden />;
}
