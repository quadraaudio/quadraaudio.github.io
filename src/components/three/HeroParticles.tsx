"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./HeroParticles.module.scss";

export function HeroParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const count = isMobile ? 420 : 720;
    const base = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 4;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#00a3a0"),
      size: isMobile ? 0.04 : 0.035,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const ringGeo = new THREE.TorusGeometry(1.8, 0.01, 12, isMobile ? 96 : 160);
    const ringMat = new THREE.MeshBasicMaterial({
      color: "#1a222d",
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    scene.add(ring);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) {
        pointer.active = false;
        return;
      }
      pointer.active = true;
      pointer.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;

      frame += 1;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      const pull = pointer.active ? 0.55 : 0.12;
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;

      // Sample every Nth particle heavily toward cursor for feel without full CPU cost.
      for (let i = 0; i < count; i += 1) {
        const ix = i * 3;
        const bx = base[ix];
        const by = base[ix + 1];
        const bz = base[ix + 2];

        const dx = pointer.x * 3.2 - bx;
        const dy = pointer.y * 2.1 - by;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const force = Math.min(1.1, 1.4 / dist) * pull;

        arr[ix] = bx + dx * force * 0.22;
        arr[ix + 1] = by + dy * force * 0.22;
        arr[ix + 2] = bz + Math.sin(frame * 0.01 + i * 0.05) * 0.04;
      }
      pos.needsUpdate = true;

      points.rotation.y = frame * 0.0009 + pointer.x * 0.35;
      points.rotation.x = Math.sin(frame * 0.0007) * 0.1 + pointer.y * 0.25;
      ring.rotation.z = frame * 0.0008 + pointer.x * 0.2;
      ring.rotation.y = pointer.y * 0.15;
      camera.position.x += (pointer.x * 0.45 - camera.position.x) * 0.06;
      camera.position.y += (pointer.y * 0.3 - camera.position.y) * 0.06;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={styles.canvas} aria-hidden />;
}
