"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HeroParticles.module.scss";

/**
 * Clear 3D audio waveform:
 * - Classic oscilloscope silhouette around a visible zero-line (X = time, Y = amp)
 * - Depth = ghosted history traces behind the live wave (not a terrain mesh)
 */
export function HeroParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const samples = isMobile ? 220 : 360;
    const traces = isMobile ? 14 : 22; // history layers into Z
    const spanX = isMobile ? 26 : 38;
    const depthStep = isMobile ? 0.38 : 0.42;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfbfcfd, 0.034);

    const camera = new THREE.PerspectiveCamera(
      34,
      mount.clientWidth / mount.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 0.55, 11.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.6 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const waveCount = samples * traces;
    const stemCount = samples; // stems only on live trace for clarity
    const zeroCount = samples;

    const wavePos = new Float32Array(waveCount * 3);
    const waveCol = new Float32Array(waveCount * 3);
    const stemPos = new Float32Array(stemCount * 2 * 3); // line pairs zero→peak
    const stemCol = new Float32Array(stemCount * 2 * 3);
    const zeroPos = new Float32Array(zeroCount * 3);

    const ink = { r: 0.102, g: 0.133, b: 0.176 };
    const teal = { r: 0.0, g: 0.639, b: 0.627 };
    const warm = { r: 0.91, g: 0.647, b: 0.294 };

    // Classic multi-harmonic audio-looking signal.
    const sampleAmp = (xNorm: number, t: number, lag: number) => {
      const p = xNorm * Math.PI * 2;
      // Carrier + harmonics + slow AM — reads as audio, not soft hills.
      const carrier = Math.sin(p * 2.0 - t * 0.55 - lag);
      const h2 = Math.sin(p * 4.0 + t * 0.3 - lag * 1.2) * 0.42;
      const h3 = Math.sin(p * 6.0 - t * 0.45 - lag) * 0.22;
      const h5 = Math.sin(p * 10.0 + t * 0.8 - lag * 0.7) * 0.1;
      const am = 0.72 + 0.28 * Math.sin(p * 0.35 + t * 0.2);
      return Math.tanh((carrier + h2 + h3 + h5) * am * 1.35);
    };

    // Zero-line across time (readable oscilloscope baseline).
    for (let s = 0; s < zeroCount; s += 1) {
      const u = s / (zeroCount - 1);
      const ix = s * 3;
      zeroPos[ix] = (u - 0.5) * spanX;
      zeroPos[ix + 1] = 0;
      zeroPos[ix + 2] = 0;
    }

    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute("position", new THREE.BufferAttribute(wavePos, 3));
    waveGeo.setAttribute("color", new THREE.BufferAttribute(waveCol, 3));
    const waveMat = new THREE.PointsMaterial({
      size: isMobile ? 0.055 : 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const wavePoints = new THREE.Points(waveGeo, waveMat);
    wavePoints.rotation.x = -0.28;
    scene.add(wavePoints);

    const stemGeo = new THREE.BufferGeometry();
    stemGeo.setAttribute("position", new THREE.BufferAttribute(stemPos, 3));
    stemGeo.setAttribute("color", new THREE.BufferAttribute(stemCol, 3));
    const stemMat = new THREE.PointsMaterial({
      size: isMobile ? 0.028 : 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const stems = new THREE.Points(stemGeo, stemMat);
    stems.rotation.x = -0.28;
    scene.add(stems);

    const zeroGeo = new THREE.BufferGeometry();
    zeroGeo.setAttribute("position", new THREE.BufferAttribute(zeroPos, 3));
    const zeroMat = new THREE.PointsMaterial({
      color: "#8b95a5",
      size: isMobile ? 0.03 : 0.024,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const zeroLine = new THREE.Points(zeroGeo, zeroMat);
    zeroLine.rotation.x = -0.28;
    scene.add(zeroLine);

    // Live outline — denser/brighter front waveform.
    const livePos = new Float32Array(samples * 3);
    const liveGeo = new THREE.BufferGeometry();
    liveGeo.setAttribute("position", new THREE.BufferAttribute(livePos, 3));
    const liveMat = new THREE.PointsMaterial({
      color: "#00a3a0",
      size: isMobile ? 0.08 : 0.07,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const liveWave = new THREE.Points(liveGeo, liveMat);
    liveWave.rotation.x = -0.28;
    scene.add(liveWave);

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
    const amplitude = isMobile ? 1.55 : 1.85;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      frame += 1;
      const t = frame * 0.007;

      const ease = pointer.active ? 0.14 : 0.06;
      pointer.x += (pointer.tx - pointer.x) * ease;
      pointer.y += (pointer.ty - pointer.y) * ease;

      const gain = 1 + (pointer.active ? 0.45 + pointer.y * 0.35 : 0.12);
      const focus = pointer.x * 0.55 + 0.5;

      const wArr = waveGeo.attributes.position.array as Float32Array;
      const wCol = waveGeo.attributes.color.array as Float32Array;
      const sArr = stemGeo.attributes.position.array as Float32Array;
      const sCol = stemGeo.attributes.color.array as Float32Array;
      const lArr = liveGeo.attributes.position.array as Float32Array;

      let wi = 0;
      for (let tr = 0; tr < traces; tr += 1) {
        const depthT = tr / (traces - 1);
        const lag = depthT * 1.8;
        const z = -depthT * traces * depthStep;
        const fade = 1 - depthT * 0.82;

        for (let s = 0; s < samples; s += 1) {
          const u = s / (samples - 1);
          const x = (u - 0.5) * spanX;
          let amp = sampleAmp(u, t, lag) * gain;

          if (pointer.active) {
            const local = Math.exp(-Math.pow((u - focus) * 7.5, 2));
            amp += local * Math.sin(u * Math.PI * 14 + t * 2) * 0.28;
          }

          const y = amp * amplitude;
          const ix = wi * 3;
          wArr[ix] = x;
          wArr[ix + 1] = y;
          wArr[ix + 2] = z;

          const energy = Math.min(1, Math.abs(amp));
          const side = Math.min(1, Math.abs(u - 0.5) * 2);
          const edge = 1 - side * side * 0.35;
          const isFront = tr === 0;
          const r =
            (isFront ? teal.r : ink.r + (teal.r - ink.r) * 0.55) +
            (warm.r - teal.r) * energy * (isFront ? 0.5 : 0.15);
          const g =
            (isFront ? teal.g : ink.g + (teal.g - ink.g) * 0.55) +
            (warm.g - teal.g) * energy * (isFront ? 0.5 : 0.15);
          const b =
            (isFront ? teal.b : ink.b + (teal.b - ink.b) * 0.55) +
            (warm.b - teal.b) * energy * (isFront ? 0.5 : 0.15);
          wCol[ix] = r * fade * edge;
          wCol[ix + 1] = g * fade * edge;
          wCol[ix + 2] = b * fade * edge;

          if (tr === 0) {
            lArr[s * 3] = x;
            lArr[s * 3 + 1] = y;
            lArr[s * 3 + 2] = 0.02;

            // Stem from zero-line up/down to sample — classic waveform cue.
            const a = s * 6;
            sArr[a] = x;
            sArr[a + 1] = 0;
            sArr[a + 2] = 0.01;
            sArr[a + 3] = x;
            sArr[a + 4] = y;
            sArr[a + 5] = 0.01;
            const sr = ink.r + (teal.r - ink.r) * 0.7;
            const sg = ink.g + (teal.g - ink.g) * 0.7;
            const sb = ink.b + (teal.b - ink.b) * 0.7;
            sCol[a] = sr * 0.35;
            sCol[a + 1] = sg * 0.35;
            sCol[a + 2] = sb * 0.35;
            sCol[a + 3] = sr;
            sCol[a + 4] = sg;
            sCol[a + 5] = sb;
          }

          wi += 1;
        }
      }

      (waveGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (waveGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      (stemGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (stemGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      (liveGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      camera.position.x += (pointer.x * 0.65 - camera.position.x) * 0.06;
      camera.position.y += (0.55 + pointer.y * 0.25 - camera.position.y) * 0.06;
      camera.lookAt(pointer.x * 0.25, 0.05, -2.5);
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
      waveGeo.dispose();
      waveMat.dispose();
      stemGeo.dispose();
      stemMat.dispose();
      zeroGeo.dispose();
      zeroMat.dispose();
      liveGeo.dispose();
      liveMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvas} aria-hidden />;
}
