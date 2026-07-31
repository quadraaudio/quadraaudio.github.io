"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HeroParticles.module.scss";

/**
 * Quadra Signal Field — wide, slow audio membrane that reads as infinite laterally.
 */
export function HeroParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    // Dense enough, but very wide so edges never sit in-frame.
    const cols = isMobile ? 96 : 140;
    const rows = isMobile ? 26 : 36;
    const count = cols * rows;
    const fieldWidth = isMobile ? 28 : 42;
    const fieldDepth = isMobile ? 7 : 8.5;

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0xfbfcfd, 0.045);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 1.35, 7.8);

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

    // Precomputed palette endpoints (avoid Color.clone per particle/frame).
    const ink = { r: 0.102, g: 0.133, b: 0.176 }; // #1a222d
    const teal = { r: 0.0, g: 0.639, b: 0.627 }; // #00a3a0
    const warm = { r: 0.91, g: 0.647, b: 0.294 }; // #e8a54b

    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const u = c / (cols - 1);
        const v = r / (rows - 1);
        const x = (u - 0.5) * fieldWidth;
        const z = (v - 0.5) * fieldDepth;
        const ix = i * 3;
        base[ix] = x;
        base[ix + 1] = 0;
        base[ix + 2] = z;
        positions[ix] = x;
        positions[ix + 1] = 0;
        positions[ix + 2] = z;

        // Soft center emphasis; sides fade into fog/infinite.
        const edgeFade = 1 - Math.pow(Math.abs(u - 0.5) * 2, 1.6) * 0.35;
        const mix = 0.28 + v * 0.45;
        colors[ix] = (ink.r + (teal.r - ink.r) * mix) * edgeFade;
        colors[ix + 1] = (ink.g + (teal.g - ink.g) * mix) * edgeFade;
        colors[ix + 2] = (ink.b + (teal.b - ink.b) * mix) * edgeFade;
        i += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.042,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    points.rotation.x = -0.4;
    scene.add(points);

    const beamCount = cols;
    const beamPos = new Float32Array(beamCount * 3);
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
    const beamMat = new THREE.PointsMaterial({
      color: warm.r * 0x10000 + warm.g * 0x100 + warm.b > 0 ? "#e8a54b" : "#e8a54b",
      size: isMobile ? 0.07 : 0.06,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const beam = new THREE.Points(beamGeo, beamMat);
    beam.rotation.x = -0.4;
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
      // Slow, cinematic timebase.
      const t = frame * 0.0065;

      const ease = pointer.active ? 0.12 : 0.06;
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;

      // Map cursor across the wide field.
      const exciteX = pointer.x * (fieldWidth * 0.38);
      const exciteZ = -pointer.y * (fieldDepth * 0.35);
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const colsArr = colAttr.array as Float32Array;

      for (let p = 0; p < count; p += 1) {
        const ix = p * 3;
        const x = base[ix];
        const z = base[ix + 2];

        // Long, slow traveling waves — not jittery.
        const wave =
          Math.sin(x * 0.35 + t * 0.85) * 0.18 +
          Math.sin(z * 0.7 - t * 0.55) * 0.12 +
          Math.sin((x * 0.15 + z) * 0.45 + t * 0.4) * 0.08;

        const dx = x - exciteX;
        const dz = z - exciteZ;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const ripple = pointer.active
          ? Math.sin(Math.max(0, 4.5 - dist) * 1.15 - t * 2.2) *
            Math.exp(-dist * 0.32) *
            0.7
          : 0;

        const y = wave + ripple;
        arr[ix] = x;
        arr[ix + 1] = y;
        arr[ix + 2] = z;

        const energy = Math.min(1, Math.abs(y) * 1.15);
        const edge = Math.min(1, Math.abs(x) / (fieldWidth * 0.5));
        const fade = 1 - edge * edge * 0.45;
        const tr = ink.r + (teal.r - ink.r) * 0.45 + (warm.r - teal.r) * energy;
        const tg = ink.g + (teal.g - ink.g) * 0.45 + (warm.g - teal.g) * energy;
        const tb = ink.b + (teal.b - ink.b) * 0.45 + (warm.b - teal.b) * energy;
        colsArr[ix] = tr * fade;
        colsArr[ix + 1] = tg * fade;
        colsArr[ix + 2] = tb * fade;
      }
      pos.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Slow scope sweep.
      const beamPhase = ((t * 0.12) % 1) * (rows - 1);
      const row = Math.floor(beamPhase);
      const bArr = beamGeo.attributes.position.array as Float32Array;
      for (let c = 0; c < cols; c += 1) {
        const src = (row * cols + c) * 3;
        const dest = c * 3;
        bArr[dest] = arr[src];
        bArr[dest + 1] = arr[src + 1] + 0.04;
        bArr[dest + 2] = arr[src + 2];
      }
      (beamGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.06;
      camera.position.y += (1.35 + pointer.y * 0.28 - camera.position.y) * 0.06;
      camera.lookAt(pointer.x * 0.25, 0.15, 0);
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
