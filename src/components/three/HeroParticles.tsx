"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HeroParticles.module.scss";

/**
 * Quadra Signal Field — a live audio membrane / oscilloscope plane.
 * Unique to Quadra: waveform ripples + cursor as a pressure/excitation point.
 * Not a logo morph.
 */
export function HeroParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const cols = isMobile ? 48 : 72;
    const rows = isMobile ? 28 : 40;
    const count = cols * rows;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const teal = new THREE.Color("#00a3a0");
    const ink = new THREE.Color("#1a222d");
    const warm = new THREE.Color("#e8a54b");

    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = (c / (cols - 1) - 0.5) * 11;
        const z = (r / (rows - 1) - 0.5) * 6.5;
        const y = 0;
        const ix = i * 3;
        base[ix] = x;
        base[ix + 1] = y;
        base[ix + 2] = z;
        positions[ix] = x;
        positions[ix + 1] = y;
        positions[ix + 2] = z;
        const mix = c / (cols - 1);
        const col = ink.clone().lerp(teal, 0.35 + mix * 0.65);
        colors[ix] = col.r;
        colors[ix + 1] = col.g;
        colors[ix + 2] = col.b;
        i += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.055 : 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    points.rotation.x = -0.42;
    scene.add(points);

    // Secondary “scope beam” — a bright traveling readout line.
    const beamCount = cols;
    const beamPos = new Float32Array(beamCount * 3);
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
    const beamMat = new THREE.PointsMaterial({
      color: warm,
      size: isMobile ? 0.08 : 0.07,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const beam = new THREE.Points(beamGeo, beamMat);
    beam.rotation.x = -0.42;
    scene.add(beam);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.active =
        event.clientY >= rect.top - 20 && event.clientY <= rect.bottom + 20;
      pointer.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    io.observe(mount);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      frame += 1;
      const t = frame * 0.016;

      // Snappy cursor follow (Antigravity-like responsiveness).
      const ease = pointer.active ? 0.22 : 0.1;
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;

      const exciteX = pointer.x * 5.2;
      const exciteZ = -pointer.y * 2.8;
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const colsArr = colAttr.array as Float32Array;

      for (let p = 0; p < count; p += 1) {
        const ix = p * 3;
        const x = base[ix];
        const z = base[ix + 2];
        const wave =
          Math.sin(x * 1.15 + t * 2.4) * 0.22 +
          Math.sin(z * 1.8 - t * 1.7) * 0.16 +
          Math.sin((x + z) * 0.65 + t * 1.1) * 0.1;

        const dx = x - exciteX;
        const dz = z - exciteZ;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const ripple =
          pointer.active
            ? Math.sin(Math.max(0, 3.2 - dist) * 2.4 - t * 6) *
              Math.exp(-dist * 0.55) *
              1.15
            : 0;

        const y = wave + ripple;
        arr[ix] = x;
        arr[ix + 1] = y;
        arr[ix + 2] = z;

        const energy = Math.min(1, Math.abs(y) * 1.4);
        const c = ink.clone().lerp(teal, 0.4).lerp(warm, energy * 0.85);
        colsArr[ix] = c.r;
        colsArr[ix + 1] = c.g;
        colsArr[ix + 2] = c.b;
      }
      pos.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Traveling scope beam across the membrane.
      const beamPhase = ((t * 0.35) % 1) * (rows - 1);
      const row = Math.floor(beamPhase);
      const bArr = beamGeo.attributes.position.array as Float32Array;
      for (let c = 0; c < cols; c += 1) {
        const src = (row * cols + c) * 3;
        const dest = c * 3;
        bArr[dest] = arr[src];
        bArr[dest + 1] = arr[src + 1] + 0.05;
        bArr[dest + 2] = arr[src + 2];
      }
      (beamGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.12;
      camera.position.y += (1.2 + pointer.y * 0.45 - camera.position.y) * 0.12;
      camera.lookAt(pointer.x * 0.4, 0.2, 0);
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
      beamGeo.dispose();
      beamMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvas} aria-hidden />;
}
