"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { SignalItem } from "@/types/signal";
import { playPokeSound, playShockwaveSound } from "@/utils/foveaAudio";

interface ObservatoryCanvasProps {
  signals: SignalItem[];
  onSelectSignal: (item: SignalItem) => void;
  hoveredSignal: SignalItem | null;
  setHoveredSignal: (item: SignalItem | null) => void;
  tooltipPos: { x: number; y: number };
  setTooltipPos: (pos: { x: number; y: number }) => void;
}

interface NodeData {
  mesh: THREE.Mesh;
  glowMesh: THREE.Mesh;
  line: THREE.Line;
  signal: SignalItem;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  baseY: number;
  yOffsetFreq: number;
}

export const ObservatoryCanvas: React.FC<ObservatoryCanvasProps> = ({
  signals,
  onSelectSignal,
  setHoveredSignal,
  setTooltipPos,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const nodesRef = useRef<NodeData[]>([]);
  const coreRef = useRef<{
    eventHorizon: THREE.Mesh;
    chromaticRing: THREE.Mesh;
    halo: THREE.Mesh;
  } | null>(null);

  const mouseRef = useRef({ x: 0, y: 0, screenX: 0, screenY: 0 });
  const targetCameraPos = useRef({ x: 0, y: 15, z: 75 });
  const isTransitioningRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.008);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 15, 75);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x050507, 1);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Ambient Star / Nebula Dust Particle Field
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 120;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = (Math.random() - 0.5) * 35;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Subtle cyan, amber, and violet dust
      const col = new THREE.Color();
      const r = Math.random();
      if (r > 0.6) col.setHex(0xf59e0b); // amber
      else if (r > 0.3) col.setHex(0x06b6d4); // cyan
      else col.setHex(0xa855f7); // violet

      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(dustPoints);

    // 4. Central Fovea Lens (The Gravitational Core)
    const coreGroup = new THREE.Group();

    // 4a. Event Horizon Inner Nucleus (Deep Void)
    const nucleusGeo = new THREE.SphereGeometry(4.2, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x020408,
    });
    const eventHorizon = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(eventHorizon);

    // 4b. Luminous Chromatic Dispersion Ring
    const ringGeo = new THREE.TorusGeometry(5.2, 0.22, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.9,
    });
    const chromaticRing = new THREE.Mesh(ringGeo, ringMat);
    chromaticRing.rotation.x = Math.PI / 2.3;
    coreGroup.add(chromaticRing);

    // 4c. Outer Caustics Halo
    const haloGeo = new THREE.SphereGeometry(6.4, 32, 32);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xf59e0b) },
        color2: { value: new THREE.Color(0x06b6d4) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 mixedCol = mix(color1, color2, sin(time * 1.5) * 0.5 + 0.5);
          gl_FragColor = vec4(mixedCol, intensity * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    coreGroup.add(halo);

    // 4d. Orbital Coordinate Grid Guide
    const gridHelper = new THREE.PolarGridHelper(50, 4, 8, 64, 0x27272a, 0x18181b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    scene.add(coreGroup);
    coreRef.current = { eventHorizon, chromaticRing, halo };

    // 5. Build Orbital Signal Field from INITIAL_SIGNALS
    const nodes: NodeData[] = [];
    signals.forEach((sig, idx) => {
      // Landmark signals orbit closer and shine brighter
      const isLandmark = sig.isSignal;
      const orbitRadius = isLandmark ? 18 + (idx % 3) * 6 : 34 + (idx % 4) * 8;
      const orbitSpeed = (isLandmark ? 0.0035 : 0.002) * (idx % 2 === 0 ? 1 : -1);
      const orbitAngle = (idx / signals.length) * Math.PI * 2;
      const baseY = (idx % 3 - 1) * 3.5;

      // Color mapping by primary tag
      let nodeColorHex = 0xf59e0b; // default amber
      if (sig.tags.includes("REASONING")) nodeColorHex = 0x38bdf8; // sky blue
      else if (sig.tags.includes("ENERGY")) nodeColorHex = 0x10b981; // emerald
      else if (sig.tags.includes("GOVERNANCE")) nodeColorHex = 0xa855f7; // purple
      else if (sig.tags.includes("COMPUTE")) nodeColorHex = 0xf43f5e; // rose

      // Node Mesh (Solid Center Core)
      const nodeSize = isLandmark ? 1.6 : 1.1;
      const nodeGeo = new THREE.SphereGeometry(nodeSize, 24, 24);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: nodeColorHex,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.userData = { signal: sig };

      // Outer Glowing Aura Halo
      const glowGeo = new THREE.SphereGeometry(nodeSize * 2.2, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: nodeColorHex,
        transparent: true,
        opacity: isLandmark ? 0.35 : 0.15,
        blending: THREE.AdditiveBlending,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      nodeMesh.add(glowMesh);

      // Connecting Laser Filament to Central Fovea
      const lineMat = new THREE.LineBasicMaterial({
        color: nodeColorHex,
        transparent: true,
        opacity: isLandmark ? 0.3 : 0.1,
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      scene.add(nodeMesh);

      nodes.push({
        mesh: nodeMesh,
        glowMesh,
        line,
        signal: sig,
        orbitRadius,
        orbitSpeed,
        orbitAngle,
        baseY,
        yOffsetFreq: 1 + Math.random() * 2,
      });
    });
    nodesRef.current = nodes;

    // 6. Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // 7. Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Animate Central Lens
      if (coreRef.current) {
        coreRef.current.chromaticRing.rotation.z = elapsedTime * 0.4;
        coreRef.current.chromaticRing.rotation.y = elapsedTime * 0.2;
        const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
        coreRef.current.eventHorizon.scale.set(pulse, pulse, pulse);
        const shaderMat = coreRef.current.halo.material as THREE.ShaderMaterial;
        if (shaderMat.uniforms?.time) {
          shaderMat.uniforms.time.value = elapsedTime;
        }
      }

      // Animate Particles
      dustPoints.rotation.y = elapsedTime * 0.02;

      // Animate Orbital Nodes
      nodesRef.current.forEach((n) => {
        n.orbitAngle += n.orbitSpeed;
        const x = Math.cos(n.orbitAngle) * n.orbitRadius;
        const z = Math.sin(n.orbitAngle) * n.orbitRadius;
        const y = n.baseY + Math.sin(elapsedTime * n.yOffsetFreq + n.orbitRadius) * 1.5;

        n.mesh.position.set(x, y, z);

        // Update Laser Filament
        const linePos = n.line.geometry.attributes.position as THREE.BufferAttribute;
        linePos.setXYZ(0, 0, 0, 0);
        linePos.setXYZ(1, x, y, z);
        linePos.needsUpdate = true;
      });

      // Smooth Camera Parallax when not in transition
      if (cameraRef.current && !isTransitioningRef.current) {
        const mouseX = mouseRef.current.x * 12;
        const mouseY = mouseRef.current.y * 8;
        cameraRef.current.position.x += (targetCameraPos.current.x + mouseX - cameraRef.current.position.x) * 0.04;
        cameraRef.current.position.y += (targetCameraPos.current.y + mouseY - cameraRef.current.position.y) * 0.04;
        cameraRef.current.position.z += (targetCameraPos.current.z - cameraRef.current.position.z) * 0.04;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Raycast & Foveated Focus Calculation
      if (cameraRef.current && rendererRef.current) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(
          new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
          cameraRef.current
        );

        const meshes = nodesRef.current.map((n) => n.mesh);
        const intersects = raycaster.intersectObjects(meshes, true);

        if (intersects.length > 0) {
          let hitMesh = intersects[0].object as THREE.Mesh;
          if (hitMesh.parent && hitMesh.parent instanceof THREE.Mesh) {
            hitMesh = hitMesh.parent;
          }
          const matchedNode = nodesRef.current.find((n) => n.mesh === hitMesh);
          if (matchedNode) {
            setHoveredSignal(matchedNode.signal);

            // Project 3D coordinate to 2D screen coordinate for Tooltip
            const screenVec = matchedNode.mesh.position.clone().project(cameraRef.current);
            const sx = ((screenVec.x + 1) * width) / 2;
            const sy = ((-screenVec.y + 1) * height) / 2;
            setTooltipPos({ x: sx, y: sy });

            // Foveated Focus effect: Highlight node
            matchedNode.mesh.scale.set(1.4, 1.4, 1.4);
            (matchedNode.line.material as THREE.LineBasicMaterial).opacity = 0.8;
          }
        } else {
          setHoveredSignal(null);
          nodesRef.current.forEach((n) => {
            n.mesh.scale.set(1, 1, 1);
            const isL = n.signal.isSignal;
            (n.line.material as THREE.LineBasicMaterial).opacity = isL ? 0.25 : 0.08;
          });
        }
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [signals, setHoveredSignal, setTooltipPos]);

  // Mouse Move Listener for Foveated Eye Gaze
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    mouseRef.current.x = (e.clientX / width) * 2 - 1;
    mouseRef.current.y = -(e.clientY / height) * 2 + 1;
    mouseRef.current.screenX = e.clientX;
    mouseRef.current.screenY = e.clientY;
  }, []);

  // Click on Canvas Handler (Raycast Selection with Camera Fly-in)
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current) return;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        cameraRef.current
      );

      const meshes = nodesRef.current.map((n) => n.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let hitMesh = intersects[0].object as THREE.Mesh;
        if (hitMesh.parent && hitMesh.parent instanceof THREE.Mesh) {
          hitMesh = hitMesh.parent;
        }

        const matched = nodesRef.current.find((n) => n.mesh === hitMesh);
        if (matched) {
          playShockwaveSound();
          isTransitioningRef.current = true;

          // Camera fly-in towards the selected node
          const target = matched.mesh.position.clone();
          const startCam = cameraRef.current.position.clone();
          const startTime = performance.now();
          const duration = 500;

          const flyLoop = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            if (cameraRef.current) {
              cameraRef.current.position.lerpVectors(
                startCam,
                new THREE.Vector3(target.x * 0.7, target.y * 0.7, target.z * 0.7 + 10),
                ease
              );
              cameraRef.current.lookAt(target);
            }

            if (progress < 1) {
              requestAnimationFrame(flyLoop);
            } else {
              isTransitioningRef.current = false;
              onSelectSignal(matched.signal);
            }
          };

          requestAnimationFrame(flyLoop);
        }
      } else {
        // Poking the empty cosmic void triggers subtle ripple
        playPokeSound();
      }
    },
    [onSelectSignal]
  );

  return (
    <div
      ref={mountRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="absolute inset-0 w-full h-full cursor-crosshair overflow-hidden select-none"
    />
  );
};
