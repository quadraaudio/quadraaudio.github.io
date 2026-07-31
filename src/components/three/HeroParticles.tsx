"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HeroParticles.module.scss";

/**
 * Quadra Waveform Depth — a classic audio wave with real Z depth.
 * X = time, Y = amplitude, Z = stacked history into the distance.
 * Not a flat DAW editor view.
 */
export function HeroParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const samples = isMobile ? 160 : 240; // time axis (wide)
    const layers = isMobile ? 36 : 52; // depth history
    const count = samples * layers;
    const spanX = isMobile ? 30 : 44;
    const spanZ = isMobile ? 10 : 14;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfbfcfd, 0.038);

    const camera = new THREE.PerspectiveCamera(
      36,
      mount.clientWidth / mount.clientHeight,
      0.1,
      140
    );
    camera.position.set(0, 2.4, 9.2);

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

    // Synthetic “audio” harmonic stack — evolves slowly over time.
    const sampleSignal = (phase: number, t: number) => {
      const a =
        Math.sin(phase * 1.0 + t * 0.35) * 0.55 +
        Math.sin(phase * 2.05 + t * 0.22) * 0.28 +
        Math.sin(phase * 3.1 - t * 0.18) * 0.14 +
        Math.sin(phase * 5.2 + t * 0.5) * 0.08;
      // Soft clip like analog headroom.
      return Math.tanh(a * 1.15);
    };

    const ink = { r: 0.102, g: 0.133, b: 0.176 };
    const teal = { r: 0.0, g: 0.639, b: 0.627 };
    const warm = { r: 0.91, g: 0.647, b: 0.294 };

    // Seed initial grid in XZ; Y filled each frame from waveform.
    let i = 0;
    for (let layer = 0; layer < layers; layer += 1) {
      for (let s = 0; s < samples; s += 1) {
        const u = s / (samples - 1);
        const v = layer / (layers - 1);
        const ix = i * 3;
        positions[ix] = (u - 0.5) * spanX;
        positions[ix + 1] = 0;
        positions[ix + 2] = (v - 0.5) * spanZ;
        colors[ix] = teal.r;
        colors[ix + 1] = teal.g;
        colors[ix + 2] = teal.b;
        i += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.048 : 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    // Tip the waveform landscape toward the viewer.
    points.rotation.x = -0.52;
    scene.add(points);

    // Bright “playhead” waveform on the nearest layer.
    const headPos = new Float32Array(samples * 3);
    const headGeo = new THREE.BufferGeometry();
    headGeo.setAttribute("position", new THREE.BufferAttribute(headPos, 3));
    const headMat = new THREE.PointsMaterial({
      color: "#e8a54b",
      size: isMobile ? 0.075 : 0.065,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const head = new THREE.Points(headGeo, headMat);
    head.rotation.x = -0.52;
    scene.add(head);

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
      const t = frame * 0.0055;

      const ease = pointer.active ? 0.14 : 0.06;
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;

      const ampBoost = 1 + (pointer.active ? 0.35 + pointer.y * 0.25 : 0.15);
      const focusX = pointer.x * (spanX * 0.42);

      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const col = geometry.attributes.color as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const cols = col.array as Float32Array;
      const hArr = headGeo.attributes.position.array as Float32Array;

      let idx = 0;
      for (let layer = 0; layer < layers; layer += 1) {
        const v = layer / (layers - 1);
        // Older layers sit farther in Z and are phase-lagged (time history).
        const depthLag = (1 - v) * 2.8;
        const depthFade = 0.25 + v * 0.75;
        const z = (v - 0.5) * spanZ;

        for (let s = 0; s < samples; s += 1) {
          const u = s / (samples - 1);
          const x = (u - 0.5) * spanX;
          const phase = u * Math.PI * 2 * 3.2;

          let amp = sampleSignal(phase - depthLag + t * 0.15, t) * ampBoost;

          // Cursor as a local “gain / excitement” on the wave.
          if (pointer.active) {
            const dx = x - focusX;
            const local = Math.exp(-(dx * dx) * 0.045);
            amp +=
              local *
              Math.sin(phase * 1.5 + t * 1.2) *
              0.35 *
              (0.6 + pointer.y * 0.4);
          }

          const y = amp * (1.15 + (1 - v) * 0.35);
          const ix = idx * 3;
          arr[ix] = x;
          arr[ix + 1] = y;
          arr[ix + 2] = z;

          const energy = Math.min(1, Math.abs(amp));
          const side = Math.min(1, Math.abs(u - 0.5) * 2);
          const fade = depthFade * (1 - side * side * 0.4);
          const tr = ink.r + (teal.r - ink.r) * (0.35 + energy * 0.4) + (warm.r - teal.r) * energy * 0.55;
          const tg = ink.g + (teal.g - ink.g) * (0.35 + energy * 0.4) + (warm.g - teal.g) * energy * 0.55;
          const tb = ink.b + (teal.b - ink.b) * (0.35 + energy * 0.4) + (warm.b - teal.b) * energy * 0.55;
          cols[ix] = tr * fade;
          cols[ix + 1] = tg * fade;
          cols[ix + 2] = tb * fade;

          // Nearest layer becomes the glowing playhead waveform.
          if (layer === layers - 1) {
            const hx = s * 3;
            hArr[hx] = x;
            hArr[hx + 1] = y + 0.04;
            hArr[hx + 2] = z;
          }

          idx += 1;
        }
      }

      pos.needsUpdate = true;
      col.needsUpdate = true;
      (headGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.06;
      camera.position.y += (2.4 + pointer.y * 0.35 - camera.position.y) * 0.06;
      camera.lookAt(pointer.x * 0.3, 0.2, -1.5);
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
      headGeo.dispose();
      headMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvas} aria-hidden />;
}
