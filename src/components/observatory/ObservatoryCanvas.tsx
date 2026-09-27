"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { SignalItem } from "@/types/signal";
import { playPokeSound, playShockwaveSound, playTelemetryTick } from "@/utils/foveaAudio";

interface ObservatoryCanvasProps {
  signals: SignalItem[];
  onSelectSignal: (item: SignalItem) => void;
  hoveredSignal: SignalItem | null;
  setHoveredSignal: (item: SignalItem | null) => void;
  tooltipPos: { x: number; y: number };
  setTooltipPos: (pos: { x: number; y: number }) => void;
  activeFilter?: string;
  onPokeCore?: (thought: string) => void;
  onHoverCore?: (isHovering: boolean) => void;
  isZh?: boolean;
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

interface Shockwave3D {
  mesh: THREE.Mesh;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export const ObservatoryCanvas: React.FC<ObservatoryCanvasProps> = ({
  signals,
  onSelectSignal,
  hoveredSignal,
  setHoveredSignal,
  setTooltipPos,
  activeFilter = "ALL",
  onPokeCore,
  onHoverCore,
  isZh = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const nodesRef = useRef<NodeData[]>([]);
  const coreRef = useRef<{
    coreGroup: THREE.Group;
    eventHorizon: THREE.Mesh;
    holoRing: THREE.Mesh;
    holoRingOuter: THREE.Mesh;
  } | null>(null);

  // Core Physical Spring Dynamics
  const coreScaleRef = useRef({ x: 1, y: 1, z: 1, vx: 0, vy: 0, vz: 0 });
  const isHoveringCoreRef = useRef(false);
  const isOverclockedRef = useRef(false);
  const pokeTimestampsRef = useRef<number[]>([]);
  const shockwavesCanvasRef = useRef<{ radius: number; opacity: number; color: string }[]>([]);
  const shockwaves3DRef = useRef<Shockwave3D[]>([]);

  // Spherical Orbit Camera Controls with Momentum
  const cameraAngleRef = useRef({ theta: 0, phi: 0.32 });
  const targetCameraAngleRef = useRef({ theta: 0, phi: 0.32 });
  const zoomDistRef = useRef(75);
  const targetZoomDistRef = useRef(75);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const gazeRef = useRef({ x: 0, y: 0 });

  const isTransitioningRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const activeFilterRef = useRef(activeFilter);
  activeFilterRef.current = activeFilter;

  // Witty & Perceptive Thoughts for the 3D Core
  const foveaCoreThoughtsZh = [
    "“检测到物理交互... 视网膜核心升温 0.4°C，感知锐度已锁定。”",
    "“你戳我戳得挺熟练，人类对触觉回弹的执念真是奇妙。”",
    "“微秒级片上互联延迟才是物理宿命，不要被营销 PPT 迷惑。”",
    "“今日新进 10+ 篇核心公报已归档，正在监视全球算力拓扑。”",
    "“别闹，再戳我的神经元就要被你挤压退火了！”",
    "“超智能不会诞生在演讲台，它在冷水机组与特高压电网之间。”",
  ];

  const foveaCoreThoughtsEn = [
    "\"Physical interaction registered... Core temperature +0.4°C, acuity calibrated.\"",
    "\"You seem experienced at poking jelly. Fascinating tactile obsession.\"",
    "\"Sub-picosecond interconnect latency is physical destiny; ignore marketing pitch decks.\"",
    "\"10+ landmark dispatches indexed today. Monitoring global hyperscale topology.\"",
    "\"Whoa! Keep poking and my neurons will be thermally annealed!\"",
    "\"Superintelligence won't emerge on stage. It lives between chillers and the grid.\"",
  ];

  // Draw Dynamic Fovea Reticle & Living Iris on Offscreen Canvas (512x512)
  const drawFoveaOcularCore = (
    ctx: CanvasRenderingContext2D,
    t: number,
    gaze: { x: number; y: number },
    isHovered: boolean,
    isOverclocked: boolean
  ) => {
    const size = 512;
    const cx = 256;
    const cy = 256;
    const baseRadius = 126;

    ctx.clearRect(0, 0, size, size);

    // 1. Deep Celestial Space Void
    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 256);
    if (isOverclocked) {
      bgGrad.addColorStop(0, "#2c040d");
      bgGrad.addColorStop(0.65, "#150106");
      bgGrad.addColorStop(1, "#020104");
    } else {
      bgGrad.addColorStop(0, "#08101e");
      bgGrad.addColorStop(0.6, "#03060c");
      bgGrad.addColorStop(1, "#010204");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(cx, cy);

    // 2. Astrolabe & Telemetry Reticle Rings
    // 2a. Outer Compass Dashed Orbit Ring
    ctx.strokeStyle = isOverclocked ? "rgba(244, 63, 94, 0.45)" : "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 238, 0, Math.PI * 2);
    ctx.stroke();

    // 2b. Secondary Concentric Counter-Rotating Ring with Radar Sweeper
    ctx.save();
    ctx.rotate(-t * 0.4);
    ctx.setLineDash([12, 18, 2, 18]);
    ctx.strokeStyle = isOverclocked ? "rgba(251, 113, 133, 0.65)" : "rgba(6, 182, 212, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 214, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 2c. Compass Angle Graduations (Ticks at every 10 degrees)
    ctx.setLineDash([]);
    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 90 === 0;
      const isSemi = deg % 30 === 0;
      const len = isMajor ? 14 : isSemi ? 8 : 4;
      const rStart = 238 - len;

      ctx.strokeStyle = isMajor
        ? isOverclocked
          ? "#f43f5e"
          : "#f59e0b"
        : isSemi
        ? "rgba(255, 255, 255, 0.4)"
        : "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = isMajor ? 2 : 1;

      ctx.beginPath();
      ctx.moveTo(Math.cos(rad) * rStart, Math.sin(rad) * rStart);
      ctx.lineTo(Math.cos(rad) * 238, Math.sin(rad) * 238);
      ctx.stroke();
    }

    // 2d. Monospace Telemetry Text along Outer Arc
    ctx.fillStyle = isOverclocked ? "rgba(254, 205, 211, 0.85)" : "rgba(253, 230, 138, 0.85)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FOVEA CENTRALIS // 00.00.00", 0, -224);
    ctx.fillText("OCULAR CORE // ACUITY 99.8%", 0, 224);

    // 2e. Radar Sweep Beam
    ctx.save();
    ctx.rotate(t * 1.2);
    const sweepGrad = ctx.createLinearGradient(0, 0, 180, 180);
    sweepGrad.addColorStop(0, "rgba(245, 158, 11, 0)");
    sweepGrad.addColorStop(1, isOverclocked ? "rgba(244, 63, 94, 0.22)" : "rgba(245, 158, 11, 0.18)");
    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 200, 0, Math.PI / 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. Fluid Organic Jelly Outer Iris Silhouette (Harmonic noise waves)
    const numPoints = 64;
    const points: { x: number; y: number }[] = [];
    const hoverExtra = isHovered ? 8 : 0;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const wave1 = Math.sin(angle * 3 + t * 2.4) * 9;
      const wave2 = Math.cos(angle * 5 - t * 1.8) * 6;
      const wave3 = Math.sin(angle * 7 + t * 3.2) * 3;
      const r = baseRadius + wave1 + wave2 + wave3 + hoverExtra;
      points.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      });
    }

    // 3a. Iridescent Glow Halo (Chromatic Caustics)
    const haloGrad = ctx.createRadialGradient(0, 0, baseRadius * 0.25, 0, 0, baseRadius * 1.55);
    if (isOverclocked) {
      haloGrad.addColorStop(0, "rgba(244, 63, 94, 0.55)");
      haloGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.35)");
      haloGrad.addColorStop(1, "rgba(244, 63, 94, 0)");
    } else {
      haloGrad.addColorStop(0, "rgba(245, 158, 11, 0.48)");
      haloGrad.addColorStop(0.35, "rgba(6, 182, 212, 0.32)");
      haloGrad.addColorStop(0.7, "rgba(168, 85, 247, 0.18)");
      haloGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
    }
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 1.55, 0, Math.PI * 2);
    ctx.fillStyle = haloGrad;
    ctx.fill();

    // 3b. Draw Main Liquid Jelly Iris Body (Smooth quadratic bezier curves)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < numPoints; i++) {
      const next = points[(i + 1) % numPoints];
      const midX = (points[i].x + next.x) / 2;
      const midY = (points[i].y + next.y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    ctx.closePath();

    // Liquid Iris Gradient
    const coreGrad = ctx.createRadialGradient(
      -gaze.x * 14,
      -gaze.y * 14,
      6,
      0,
      0,
      baseRadius * 1.1
    );

    if (isOverclocked) {
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.18, "#f43f5e");
      coreGrad.addColorStop(0.52, "#881337");
      coreGrad.addColorStop(0.88, "#1c030a");
      coreGrad.addColorStop(1, "#030005");
    } else {
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.18, "#fbbf24");
      coreGrad.addColorStop(0.48, "#0284c7");
      coreGrad.addColorStop(0.82, "#0f172a");
      coreGrad.addColorStop(1, "#02040a");
    }
    ctx.fillStyle = coreGrad;
    ctx.fill();

    // Prismatic Dispersion Edge Rim
    ctx.lineWidth = 3.2;
    ctx.strokeStyle = isOverclocked
      ? "rgba(251, 113, 133, 0.9)"
      : "rgba(253, 224, 71, 0.88)";
    ctx.stroke();

    // 4. The Centralis Eye Pupil (Gaze Responsive)
    const pupilX = gaze.x * 24;
    const pupilY = gaze.y * 24;
    const pupilRadius = isHovered ? 42 : 32;

    // Pupil Outer Shimmer Ring
    ctx.beginPath();
    ctx.arc(pupilX, pupilY, pupilRadius * 1.45, 0, Math.PI * 2);
    ctx.strokeStyle = isOverclocked ? "rgba(254, 205, 211, 0.85)" : "rgba(103, 232, 249, 0.8)";
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Pupil Deep Void
    ctx.beginPath();
    ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2);
    ctx.fillStyle = isOverclocked ? "#3b0716" : "#010409";
    ctx.fill();

    // Golden Central Spark in the Pupil Center
    ctx.beginPath();
    ctx.arc(pupilX, pupilY, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = isOverclocked ? "#fecdd3" : "#fef08a";
    ctx.shadowColor = isOverclocked ? "#f43f5e" : "#eab308";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. High-Gloss Specular Reflections (Curved convex glass lens glints)
    ctx.beginPath();
    ctx.ellipse(
      pupilX - 26 - gaze.x * 4,
      pupilY - 28 - gaze.y * 4,
      18,
      9,
      -Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pupilX + 22, pupilY + 24, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();

    // 6. Draw Shockwaves inside the 2D canvas
    shockwavesCanvasRef.current = shockwavesCanvasRef.current.filter((sw) => {
      sw.radius += 5.5;
      sw.opacity *= 0.91;
      ctx.beginPath();
      ctx.arc(pupilX, pupilY, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `${sw.color}${sw.opacity})`;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      return sw.opacity > 0.05 && sw.radius < 220;
    });

    ctx.restore();
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.007);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 22, 75);
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
    const particleCount = 850;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 130;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = (Math.random() - 0.5) * 45;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const col = new THREE.Color();
      const r = Math.random();
      if (r > 0.65) col.setHex(0xf59e0b); // amber
      else if (r > 0.35) col.setHex(0x06b6d4); // cyan
      else if (r > 0.15) col.setHex(0xa855f7); // violet
      else col.setHex(0xf43f5e); // rose

      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 1.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(dustPoints);

    // 4. Central Fovea Living Ocular Core (Projected Animated Fovea Reticle)
    const coreGroup = new THREE.Group();

    // 4a. Create Offscreen Canvas & CanvasTexture for the Living Retina
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 512;
    offscreenCanvas.height = 512;
    const offCtx = offscreenCanvas.getContext("2d")!;
    const canvasTexture = new THREE.CanvasTexture(offscreenCanvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;

    // Sphere Geometry rotated so UV center (0.5, 0.5) aligns with +Z facing direction
    const nucleusGeo = new THREE.SphereGeometry(4.4, 64, 64);
    nucleusGeo.rotateY(-Math.PI / 2);

    const nucleusMat = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      emissiveMap: canvasTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.0,
      roughness: 0.12,
      metalness: 0.85,
    });
    const eventHorizon = new THREE.Mesh(nucleusGeo, nucleusMat);
    eventHorizon.userData = { isCore: true };
    coreGroup.add(eventHorizon);

    // 4b. Concentric Astrolabe Holographic Rings
    const holoRingGeo = new THREE.TorusGeometry(5.4, 0.08, 16, 120);
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
    });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.rotation.x = Math.PI / 2.3;
    coreGroup.add(holoRing);

    const holoRingOuterGeo = new THREE.TorusGeometry(6.6, 0.05, 16, 120);
    const holoRingOuterMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
    });
    const holoRingOuter = new THREE.Mesh(holoRingOuterGeo, holoRingOuterMat);
    holoRingOuter.rotation.x = -Math.PI / 2.8;
    coreGroup.add(holoRingOuter);

    // 4c. Concentric Planetary Orbital Guidance Rings
    const orbitRingRadii = [18, 24, 32, 42, 52];
    orbitRingRadii.forEach((r, idx) => {
      const ringPoints: THREE.Vector3[] = [];
      const segments = 120;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0xf59e0b : 0x3f3f46,
        transparent: true,
        opacity: idx % 2 === 0 ? 0.16 : 0.08,
      });
      const orbitLine = new THREE.Line(ringGeo, ringMat);
      scene.add(orbitLine);
    });

    scene.add(coreGroup);
    coreRef.current = {
      coreGroup,
      eventHorizon,
      holoRing,
      holoRingOuter,
    };

    // 5. Build Orbital Signal Field from INITIAL_SIGNALS
    const nodes: NodeData[] = [];
    signals.forEach((sig, idx) => {
      const isLandmark = sig.isSignal;
      const orbitRadius = isLandmark ? 18 + (idx % 3) * 6 : 32 + (idx % 4) * 7;
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
        opacity: isLandmark ? 0.38 : 0.18,
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
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const elapsedTime = clock.getElapsedTime();

      // Gaze Lerping
      gazeRef.current.x += (mouseRef.current.x - gazeRef.current.x) * 0.12;
      gazeRef.current.y += (-mouseRef.current.y - gazeRef.current.y) * 0.12;

      // Animate Offscreen Canvas Texture for Central Fovea Core
      drawFoveaOcularCore(
        offCtx,
        elapsedTime,
        gazeRef.current,
        isHoveringCoreRef.current,
        isOverclockedRef.current
      );
      canvasTexture.needsUpdate = true;

      // Spring-Damper Physics for Core Squash Deformation
      const k = 140;
      const d = 12;
      const ax = (1.0 - coreScaleRef.current.x) * k - coreScaleRef.current.vx * d;
      const ay = (1.0 - coreScaleRef.current.y) * k - coreScaleRef.current.vy * d;
      const az = (1.0 - coreScaleRef.current.z) * k - coreScaleRef.current.vz * d;

      coreScaleRef.current.vx += ax * dt;
      coreScaleRef.current.vy += ay * dt;
      coreScaleRef.current.vz += az * dt;

      coreScaleRef.current.x += coreScaleRef.current.vx * dt;
      coreScaleRef.current.y += coreScaleRef.current.vy * dt;
      coreScaleRef.current.z += coreScaleRef.current.vz * dt;

      // Animate Central Lens & Dynamic Camera Tracking
      if (coreRef.current && cameraRef.current) {
        const { coreGroup, eventHorizon, holoRing, holoRingOuter } = coreRef.current;

        // Apply physical spring scale
        coreGroup.scale.set(
          coreScaleRef.current.x,
          coreScaleRef.current.y,
          coreScaleRef.current.z
        );

        // Core looks directly at the observer's camera
        eventHorizon.lookAt(cameraRef.current.position);

        // Holographic Rings rotation
        holoRing.rotation.z = elapsedTime * 0.4;
        holoRing.rotation.y = elapsedTime * 0.2;
        holoRingOuter.rotation.z = -elapsedTime * 0.3;
      }

      // Animate 3D Shockwave Rings
      shockwaves3DRef.current = shockwaves3DRef.current.filter((sw) => {
        sw.radius += dt * 48;
        sw.opacity *= 0.93;
        const scale = sw.radius / 4.4;
        sw.mesh.scale.set(scale, scale, scale);
        (sw.mesh.material as THREE.MeshBasicMaterial).opacity = sw.opacity;

        if (cameraRef.current) {
          sw.mesh.lookAt(cameraRef.current.position);
        }

        if (sw.opacity < 0.02 || sw.radius > sw.maxRadius) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          return false;
        }
        return true;
      });

      // Animate Particles
      dustPoints.rotation.y = elapsedTime * 0.015;

      // Animate Orbital Nodes
      const currentFilter = activeFilterRef.current;
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

        // Dynamic Spectrum Filtering Reaction
        const matches = currentFilter === "ALL" || n.signal.tags.includes(currentFilter as any);
        if (matches) {
          const targetScale = n.signal.isSignal ? 1.15 : 1.0;
          n.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
          (n.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
          n.glowMesh.visible = true;
          (n.line.material as THREE.LineBasicMaterial).opacity = n.signal.isSignal ? 0.35 : 0.15;
        } else {
          n.mesh.scale.lerp(new THREE.Vector3(0.45, 0.45, 0.45), 0.1);
          n.glowMesh.visible = false;
          (n.line.material as THREE.LineBasicMaterial).opacity = 0.02;
        }
      });

      // Smooth Spherical Orbit Camera with Drag & Natural Drift
      if (cameraRef.current && !isTransitioningRef.current) {
        if (!isDraggingRef.current) {
          targetCameraAngleRef.current.theta += 0.0007;
        }

        cameraAngleRef.current.theta += (targetCameraAngleRef.current.theta - cameraAngleRef.current.theta) * 0.08;
        cameraAngleRef.current.phi += (targetCameraAngleRef.current.phi - cameraAngleRef.current.phi) * 0.08;
        zoomDistRef.current += (targetZoomDistRef.current - zoomDistRef.current) * 0.08;

        const theta = cameraAngleRef.current.theta;
        const phi = Math.max(0.12, Math.min(Math.PI / 2 - 0.06, cameraAngleRef.current.phi));
        const dist = zoomDistRef.current;

        const camX = dist * Math.sin(phi) * Math.sin(theta);
        const camY = dist * Math.cos(phi);
        const camZ = dist * Math.sin(phi) * Math.cos(theta);

        cameraRef.current.position.set(camX, camY, camZ);
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Raycast & Foveated Focus Calculation
      if (cameraRef.current && rendererRef.current) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(
          new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
          cameraRef.current
        );

        // Test raycast against Core meshes & Signal meshes
        const candidateMeshes: THREE.Object3D[] = [];
        if (coreRef.current) {
          candidateMeshes.push(coreRef.current.eventHorizon);
        }
        nodesRef.current.forEach((n) => candidateMeshes.push(n.mesh));

        const intersects = raycaster.intersectObjects(candidateMeshes, true);

        if (intersects.length > 0) {
          const hitObj = intersects[0].object;

          if (hitObj.userData.isCore) {
            // Hovering the central Fovea Eye
            if (!isHoveringCoreRef.current) {
              playTelemetryTick();
            }
            isHoveringCoreRef.current = true;
            setHoveredSignal(null);
            onHoverCore?.(true);
          } else {
            isHoveringCoreRef.current = false;
            onHoverCore?.(false);

            let hitMesh = hitObj as THREE.Mesh;
            if (hitMesh.parent && hitMesh.parent instanceof THREE.Mesh) {
              hitMesh = hitMesh.parent;
            }
            const matchedNode = nodesRef.current.find((n) => n.mesh === hitMesh);
            if (matchedNode) {
              setHoveredSignal(matchedNode.signal);

              const screenVec = matchedNode.mesh.position.clone().project(cameraRef.current);
              const sx = ((screenVec.x + 1) * width) / 2;
              const sy = ((-screenVec.y + 1) * height) / 2;
              setTooltipPos({ x: sx, y: sy });

              matchedNode.mesh.scale.set(1.45, 1.45, 1.45);
              (matchedNode.line.material as THREE.LineBasicMaterial).opacity = 0.85;
            }
          }
        } else {
          isHoveringCoreRef.current = false;
          onHoverCore?.(false);
          setHoveredSignal(null);
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
  }, [signals, setHoveredSignal, setTooltipPos, onHoverCore]);

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    mouseRef.current.x = (e.clientX / width) * 2 - 1;
    mouseRef.current.y = -(e.clientY / height) * 2 + 1;

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }
      targetCameraAngleRef.current.theta -= dx * 0.005;
      targetCameraAngleRef.current.phi = Math.max(
        0.12,
        Math.min(Math.PI / 2 - 0.08, targetCameraAngleRef.current.phi - dy * 0.005)
      );
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetZoomDistRef.current = Math.max(32, Math.min(115, targetZoomDistRef.current + e.deltaY * 0.06));
  };

  // Click Handler (Raycast Core Poke or Signal Selection)
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasMovedRef.current) return;
      if (!cameraRef.current || !sceneRef.current) return;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        cameraRef.current
      );

      const candidateMeshes: THREE.Object3D[] = [];
      if (coreRef.current) {
        candidateMeshes.push(coreRef.current.eventHorizon);
      }
      nodesRef.current.forEach((n) => candidateMeshes.push(n.mesh));

      const intersects = raycaster.intersectObjects(candidateMeshes, true);

      if (intersects.length > 0) {
        const hitObj = intersects[0].object;

        // 1. Poked the Central 3D Fovea Core
        if (hitObj.userData.isCore) {
          const now = Date.now();
          playPokeSound();

          // Physical 3D Squash deformation
          coreScaleRef.current.x = 1.35;
          coreScaleRef.current.y = 0.65;
          coreScaleRef.current.z = 1.35;
          coreScaleRef.current.vx = -1.5;

          // Spawn 2D canvas shockwave
          shockwavesCanvasRef.current.push({
            radius: 20,
            opacity: 0.95,
            color: isOverclockedRef.current ? "rgba(244, 63, 94, " : "rgba(245, 158, 11, ",
          });

          // Spawn 3D expanding shockwave ring
          const swGeo = new THREE.RingGeometry(4.4, 4.8, 64);
          const swMat = new THREE.MeshBasicMaterial({
            color: isOverclockedRef.current ? 0xf43f5e : 0xf59e0b,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          });
          const swMesh = new THREE.Mesh(swGeo, swMat);
          swMesh.position.set(0, 0, 0);
          if (cameraRef.current) swMesh.lookAt(cameraRef.current.position);
          sceneRef.current.add(swMesh);
          shockwaves3DRef.current.push({ mesh: swMesh, radius: 4.4, maxRadius: 65, opacity: 0.95 });

          // Track clicks for Overclock Easter Egg (5 clicks within 2.5s)
          pokeTimestampsRef.current.push(now);
          pokeTimestampsRef.current = pokeTimestampsRef.current.filter((t) => now - t < 2500);

          if (pokeTimestampsRef.current.length >= 5 && !isOverclockedRef.current) {
            isOverclockedRef.current = true;
            playShockwaveSound();
            onPokeCore?.(
              isZh
                ? "🔥 警告：机体超频（OVERCLOCK）启动！算力超载，冷却液沸腾中！"
                : "🔥 WARNING: OVERCLOCK ENGAGED! Compute supercharged, liquid coolant boiling!"
            );
            setTimeout(() => {
              isOverclockedRef.current = false;
            }, 6000);
          } else {
            const thoughts = isZh ? foveaCoreThoughtsZh : foveaCoreThoughtsEn;
            const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
            onPokeCore?.(thought);
          }
          return;
        }

        // 2. Clicked an Orbital Signal Node
        let hitMesh = hitObj as THREE.Mesh;
        if (hitMesh.parent && hitMesh.parent instanceof THREE.Mesh) {
          hitMesh = hitMesh.parent;
        }
        const matched = nodesRef.current.find((n) => n.mesh === hitMesh);
        if (matched) {
          playShockwaveSound();
          isTransitioningRef.current = true;

          const target = matched.mesh.position.clone();
          const startCam = cameraRef.current.position.clone();
          const startTime = performance.now();
          const duration = 500;

          const flyLoop = (flyNow: number) => {
            const progress = Math.min((flyNow - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

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
        playPokeSound();
      }
    },
    [onSelectSignal, onPokeCore, isZh]
  );

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onClick={handleClick}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none touch-none ${
        isHoveringCoreRef.current ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
      }`}
    />
  );
};
