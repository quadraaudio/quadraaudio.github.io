"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./MorphParticles.module.scss";

export function MorphParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const count = 600;
    const a = new Float32Array(count * 3);
    const b = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 2;
      a[i * 3] = Math.cos(t) * 1.6 + (Math.random() - 0.5) * 0.2;
      a[i * 3 + 1] = Math.sin(t * 2) * 0.7 + (Math.random() - 0.5) * 0.2;
      a[i * 3 + 2] = Math.sin(t) * 0.8;
      b[i * 3] = (Math.random() - 0.5) * 4;
      b[i * 3 + 1] = (Math.random() - 0.5) * 2;
      b[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(a.slice(), 3));
    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#f7f9fb"),
      size: 0.03,
      transparent: true,
      opacity: 0.65,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame += 1;
      const t = (Math.sin(frame * 0.01) + 1) / 2;
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i += 1) {
        pos.array[i * 3] = a[i * 3] * (1 - t) + b[i * 3] * t;
        pos.array[i * 3 + 1] = a[i * 3 + 1] * (1 - t) + b[i * 3 + 1] * t;
        pos.array[i * 3 + 2] = a[i * 3 + 2] * (1 - t) + b[i * 3 + 2] * t;
      }
      pos.needsUpdate = true;
      points.rotation.y = frame * 0.002;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
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
