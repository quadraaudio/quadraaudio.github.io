"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./SpectrumCascade.module.scss";

/**
 * Quadra Spectrum Cascade — studio meter / frequency analyzer made of particles.
 * Bars rise and fall like a hardware spectrum; cursor skews energy across bands.
 * Intentionally NOT a logo morph.
 */
export function SpectrumCascade() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const bands = isMobile ? 28 : 42;
    const levels = isMobile ? 18 : 26;
    const count = bands * levels;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      80
    );
    camera.position.set(0, 0.2, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const bandHeights = new Float32Array(bands);
    const bandTargets = new Float32Array(bands);

    const mint = new THREE.Color("#7ff5f1");
    const teal = new THREE.Color("#00a3a0");
    const deep = new THREE.Color("#0e1218");

    let i = 0;
    for (let b = 0; b < bands; b += 1) {
      bandHeights[b] = 0.2 + Math.random() * 0.3;
      bandTargets[b] = bandHeights[b];
      for (let l = 0; l < levels; l += 1) {
        const x = (b / (bands - 1) - 0.5) * 10.5;
        const y = (l / (levels - 1) - 0.5) * 3.8;
        const z = (Math.random() - 0.5) * 0.08;
        const ix = i * 3;
        positions[ix] = x;
        positions[ix + 1] = y;
        positions[ix + 2] = z;
        const c = deep.clone().lerp(teal, l / (levels - 1));
        colors[ix] = c.r;
        colors[ix + 1] = c.g;
        colors[ix + 2] = c.b;
        i += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.07 : 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const pointer = { x: 0, tx: 0, active: false };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.active =
        event.clientY >= rect.top - 40 && event.clientY <= rect.bottom + 40;
      pointer.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "60px", threshold: 0.05 }
    );
    io.observe(mount);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      frame += 1;
      const t = frame * 0.016;

      pointer.x += (pointer.tx - pointer.x) * 0.24;

      // Procedural “meter” targets — audio-like bands, biased by cursor.
      for (let b = 0; b < bands; b += 1) {
        const n = b / (bands - 1);
        const cursorBoost =
          pointer.active
            ? Math.exp(-Math.abs(n - (pointer.x * 0.5 + 0.5)) * 8) * 0.85
            : 0;
        const pulse =
          0.18 +
          0.35 * Math.abs(Math.sin(t * 2.1 + b * 0.37)) +
          0.25 * Math.abs(Math.sin(t * 3.4 + b * 0.19)) +
          cursorBoost;
        bandTargets[b] = THREE.MathUtils.clamp(pulse, 0.08, 1);
        // Fast attack, slower release — like a real meter.
        const rising = bandTargets[b] > bandHeights[b];
        bandHeights[b] +=
          (bandTargets[b] - bandHeights[b]) * (rising ? 0.35 : 0.08);
      }

      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const col = geometry.attributes.color as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const cols = col.array as Float32Array;

      let idx = 0;
      for (let b = 0; b < bands; b += 1) {
        const x = (b / (bands - 1) - 0.5) * 10.5;
        const height = bandHeights[b];
        for (let l = 0; l < levels; l += 1) {
          const lit = l / (levels - 1) <= height;
          const yBase = (l / (levels - 1) - 0.5) * 3.8;
          const ix = idx * 3;
          arr[ix] = x + Math.sin(t * 1.5 + b) * 0.01;
          arr[ix + 1] = lit ? yBase : yBase - 0.015;
          arr[ix + 2] = lit ? Math.sin(t * 2 + l * 0.2) * 0.05 : -0.4;

          const intensity = lit ? 0.35 + (l / (levels - 1)) * 0.65 : 0.08;
          const c = deep.clone().lerp(teal, intensity).lerp(mint, intensity * 0.35);
          cols[ix] = c.r;
          cols[ix + 1] = c.g;
          cols[ix + 2] = c.b;
          idx += 1;
        }
      }
      pos.needsUpdate = true;
      col.needsUpdate = true;

      points.rotation.y = pointer.x * 0.18;
      points.rotation.x = -0.08 + Math.sin(t * 0.4) * 0.02;
      camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.14;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvas} aria-hidden />;
}
