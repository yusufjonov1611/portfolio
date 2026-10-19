import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { soundFX } from "../utils/audio";

export default function CyberCanvas3D({ theme = "emerald", onCoreClick }) {
  const mountRef = useRef(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Palette mapping
    const getColors = (t) => {
      switch (t) {
        case "cyan":
          return {
            primary: 0x00e5ff,
            secondary: 0x0077b6,
            accent: 0x90e0ef,
            ambient: 0x0a192f,
            grid: 0x112240,
            fog: 0x08090d
          };
        case "crimson":
          return {
            primary: 0xff3366,
            secondary: 0x9b111e,
            accent: 0xff758f,
            ambient: 0x220911,
            grid: 0x3d0c18,
            fog: 0x0d0709
          };
        case "monochrome":
          return {
            primary: 0xe2e8f0,
            secondary: 0x64748b,
            accent: 0x94a3b8,
            ambient: 0x1e293b,
            grid: 0x334155,
            fog: 0x090a0f
          };
        case "emerald":
        default:
          return {
            primary: 0x00ff9d,
            secondary: 0x0a5c36,
            accent: 0x64ffda,
            ambient: 0x041f14,
            grid: 0x092e1e,
            fog: 0x080c0a
          };
      }
    };

    let colors = getColors(themeRef.current);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(colors.fog, 0.025);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(colors.ambient, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(colors.primary, 3, 50);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const coreLight = new THREE.PointLight(colors.accent, 4, 15);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // --- CYBER CORE GROUP ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer Wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: colors.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Inner Solid Octahedron with Holographic Shading
    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: colors.secondary,
      emissive: colors.primary,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Orbital Ring 1
    const ringGeo1 = new THREE.TorusGeometry(3.0, 0.03, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: colors.accent,
      transparent: true,
      opacity: 0.5
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Orbital Ring 2 (Orthogonal)
    const ringGeo2 = new THREE.TorusGeometry(3.4, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: colors.primary,
      transparent: true,
      opacity: 0.4
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // Nodes on Icosahedron Vertices
    const icoVertices = icoGeo.attributes.position.array;
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: colors.accent });
    const nodesGroup = new THREE.Group();
    for (let i = 0; i < icoVertices.length; i += 3) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(icoVertices[i], icoVertices[i + 1], icoVertices[i + 2]);
      nodesGroup.add(node);
    }
    coreGroup.add(nodesGroup);

    // --- CYBERSPACE GRID FLOOR ---
    const gridHelper = new THREE.GridHelper(50, 40, colors.primary, colors.grid);
    gridHelper.position.y = -3.2;
    scene.add(gridHelper);

    // --- PARTICLES CLOUD ---
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 35;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      particleSpeeds[i] = 0.005 + Math.random() * 0.015;
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: colors.accent,
      size: 0.07,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.8;
      mouse.targetY = y * 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Interactive Shockwave Pulse State
    let pulseScale = 1;
    let pulseTarget = 1;

    const handleClick = () => {
      soundFX.playCyberPulse();
      pulseTarget = 1.35;
      if (onCoreClick) onCoreClick();
    };

    container.addEventListener("click", handleClick);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Pulse physics
      pulseScale += (pulseTarget - pulseScale) * 0.1;
      if (pulseTarget > 1 && pulseScale > 1.3) {
        pulseTarget = 1.0;
      }

      // Core rotation & scaling
      coreGroup.rotation.y = elapsedTime * 0.35 + mouse.x * 0.5;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2 - mouse.y * 0.4;
      coreGroup.scale.set(pulseScale, pulseScale, pulseScale);

      // Orbital rings counter-rotation
      ring1.rotation.z = elapsedTime * 0.6;
      ring2.rotation.z = -elapsedTime * 0.4;
      innerMesh.rotation.y = -elapsedTime * 0.8;
      innerMesh.rotation.z = elapsedTime * 0.4;

      // Subtle bobbing
      coreGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

      // Particles drift
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 12) {
          positions[i * 3 + 1] = -10;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Cyberspace Grid wave simulation
      gridHelper.position.z = (elapsedTime * 1.5) % 2;

      // Camera parallax
      camera.position.x = mouse.x * 1.5;
      camera.position.y = 2 + mouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);

      // Dispose Three.js objects
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      gridHelper.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [theme, onCoreClick]);

  return (
    <div className="relative w-full h-full select-none cursor-pointer group">
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ minHeight: "380px" }}
      />
      {/* 3D Interactive HUD Overlay */}
      <div className="absolute bottom-4 left-4 pointer-events-none flex items-center space-x-2 text-[10px] font-mono text-emerald-400/80 bg-black/60 px-3 py-1.5 rounded border border-emerald-500/20 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        <span>3D CYBER CORE // MOUSE PARALLAX // CLICK TO TRIGGER PULSE</span>
      </div>
      <div className="absolute top-4 right-4 pointer-events-none text-right font-mono text-[9px] text-gray-500 hidden sm:block">
        <div>SYS_COORD: [X: 0.0, Y: 2.0, Z: 9.0]</div>
        <div>MESH_VERTICES: 1240 | SHADER: GLSL_V3</div>
      </div>
    </div>
  );
}
