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

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const count = isMobile ? 280 : 420;
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

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (event.clientY < rect.top - 40 || event.clientY > rect.bottom + 40) return;
      pointer.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "80px", threshold: 0.05 }
    );
    io.observe(mount);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;

      frame += 1;
      pointer.x += (pointer.tx - pointer.x) * 0.07;
      pointer.y += (pointer.ty - pointer.y) * 0.07;

      const t = (Math.sin(frame * 0.008) + 1) / 2;
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < count; i += 1) {
        const ix = i * 3;
        const mx = a[ix] * (1 - t) + b[ix] * t;
        const my = a[ix + 1] * (1 - t) + b[ix + 1] * t;
        const mz = a[ix + 2] * (1 - t) + b[ix + 2] * t;
        arr[ix] = mx + pointer.x * 0.35;
        arr[ix + 1] = my + pointer.y * 0.25;
        arr[ix + 2] = mz;
      }
      pos.needsUpdate = true;
      points.rotation.y = frame * 0.0015 + pointer.x * 0.2;
      points.rotation.x = pointer.y * 0.15;
      renderer.render(scene, camera);
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
