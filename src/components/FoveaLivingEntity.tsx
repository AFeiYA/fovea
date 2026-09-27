"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { Sparkles, MessageSquareQuote, Volume2, VolumeX, Flame, Zap, RefreshCw } from "lucide-react";
import { playPokeSound, playShockwaveSound, playChompSound, toggleSound, isSoundEnabled } from "@/utils/foveaAudio";
import { INITIAL_SIGNALS } from "@/data/signals";

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const FoveaLivingEntity: React.FC = () => {
  const { language, t, openAskFovea } = useApp();
  const isZh = language === "zh";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Interaction State
  const [pokeCount, setPokeCount] = useState(0);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [currentThought, setCurrentThought] = useState("");
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [isFeeding, setIsFeeding] = useState(false);

  // Physics & Animation refs
  const animFrameRef = useRef<number | null>(null);
  const scaleRef = useRef({ x: 1, y: 1, vx: 0, vy: 0 });
  const mousePosRef = useRef({ x: 0, y: 0, isHovering: false });
  const gazeRef = useRef({ x: 0, y: 0 });
  const shockwavesRef = useRef<Shockwave[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const pokeTimestampsRef = useRef<number[]>([]);
  const timeRef = useRef(0);

  // Witty & Perceptive Thoughts (Fovea's Personality)
  const idleThoughtsZh = [
    "“别看营销软文了，微秒级片上互联延迟才是物理宿命。”",
    "“今天人类又烧了 800 兆瓦核电，我闻到了烤硅片的焦香。”",
    "“今日新进 10+ 篇论文... 80% 在刷榜，只有 2 篇有真实自律性。”",
    "“我正在监视全球算力拓扑... 铜缆通信正在遭遇物理墙。”",
    "“用鼠标戳我？不如去看看那篇 106B 开源强化学习配方。”",
    "“超智能不会诞生在 PPT 里，它在冷水冷却管与特高压电网之间。”",
  ];

  const idleThoughtsEn = [
    "\"Stop reading marketing pitches. Sub-picosecond interconnect latency is physical destiny.\"",
    "\"Humans recommissioned 800MW nuclear baseload today. Smells like toasted silicon.\"",
    "\"10+ papers scanned today... 80% benchmark gaming, only 2 advance reasoning limits.\"",
    "\"Monitoring hyperscale topology... Copper cabling is colliding with fundamental physics.\"",
    "\"Poking me? You should inspect the open-source 106B reasoning RL recipe instead.\"",
    "\"Superintelligence won't emerge in pitch decks. It lives between chillers and the grid.\"",
  ];

  const pokeReactionsZh = [
    "“Duang~ 别戳了！再戳我的神经元就要被你挤压退火了！”",
    "“检测到物理接触... 算力核心升温 0.4°C。”",
    "“你戳我戳得挺熟练，人类对触觉回弹的执念真是奇妙。”",
    "“轻点！我正在计算 20 年未解的图论引理呢。”",
    "“别闹，再戳我就要把今天的数据缓存全吃掉了！”",
  ];

  const pokeReactionsEn = [
    "\"Whoa! Stop poking! My neurons are being thermally annealed by your clicks!\"",
    "\"Physical contact registered... Core temperature rising by 0.4°C.\"",
    "\"You seem experienced at poking jelly. Fascinating tactile obsession.\"",
    "\"Gently! I was mid-calculation on a 20-year-old graph lemma.\"",
    "\"Hey! Keep poking and I'll devour today's raw paper cache!\"",
  ];

  // Rotate thoughts periodically
  useEffect(() => {
    const list = isZh ? idleThoughtsZh : idleThoughtsEn;
    setCurrentThought(list[0]);

    const interval = setInterval(() => {
      setThoughtIndex((prev) => {
        const next = (prev + 1) % list.length;
        setCurrentThought(list[next]);
        return next;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isZh]);

  // Click / Poke Handler with Spring Soft-Body Physics
  const handlePoke = useCallback(
    (e?: React.MouseEvent) => {
      const now = Date.now();
      playPokeSound();

      // Track rapid clicking for Overclocking easter egg (5 clicks in 2.5s)
      pokeTimestampsRef.current.push(now);
      pokeTimestampsRef.current = pokeTimestampsRef.current.filter((t) => now - t < 2500);

      const newPokeCount = pokeCount + 1;
      setPokeCount(newPokeCount);

      // Trigger squash-and-stretch deformation
      scaleRef.current.x = 1.35;
      scaleRef.current.y = 0.65;
      scaleRef.current.vx = (Math.random() - 0.5) * 1.5;

      // Spawn optical shockwave
      const canvas = canvasRef.current;
      const cx = canvas ? canvas.width / (2 * (window.devicePixelRatio || 1)) : 80;
      const cy = canvas ? canvas.height / (2 * (window.devicePixelRatio || 1)) : 80;

      shockwavesRef.current.push({
        x: cx,
        y: cy,
        radius: 30,
        maxRadius: 110,
        opacity: 0.9,
        color: isOverclocked ? "rgba(244, 63, 94, " : "rgba(245, 158, 11, ",
      });

      // Show instant poke reaction
      const reactions = isZh ? pokeReactionsZh : pokeReactionsEn;
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      setCurrentThought(reaction);

      // Check Overclock threshold
      if (pokeTimestampsRef.current.length >= 5 && !isOverclocked) {
        setIsOverclocked(true);
        playShockwaveSound();
        setCurrentThought(
          isZh
            ? "🔥 警告：机体超频（OVERCLOCK）启动！算力超载，冷却液沸腾中！"
            : "🔥 WARNING: OVERCLOCK ENGAGED! Compute supercharged, liquid coolant boiling!"
        );

        // Spawn explosive sparks
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          sparksRef.current.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            maxLife: 30 + Math.random() * 20,
            color: Math.random() > 0.5 ? "#f43f5e" : "#06b6d4",
          });
        }

        setTimeout(() => {
          setIsOverclocked(false);
          setCurrentThought(
            isZh
              ? "💨 呼... 冷却循环恢复正常。算力温度回到安全阈值。"
              : "💨 Phew... Cooling loop restored. Core temperature normalized."
          );
        }, 6000);
      }
    },
    [pokeCount, isOverclocked, isZh]
  );

  // Feed Fovea mechanic
  const handleFeed = () => {
    setIsFeeding(true);
    playChompSound();

    scaleRef.current.x = 1.45;
    scaleRef.current.y = 1.45;

    const randomSignal = INITIAL_SIGNALS[Math.floor(Math.random() * INITIAL_SIGNALS.length)];
    const signalTitle = isZh ? randomSignal.titleZh || randomSignal.title : randomSignal.title;

    setTimeout(() => {
      setIsFeeding(false);
      setCurrentThought(
        isZh
          ? `😋 刚吃完「${signalTitle.slice(0, 24)}...」！大补！这篇信号让我逻辑通畅。`
          : `😋 Just digested "${signalTitle.slice(0, 28)}..."! Delicious! Structural parameters verified.`
      );
    }, 600);
  };

  // Sound toggle
  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  // Canvas WebGL-style 2D Shader Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 160;
    const height = 160;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cx = width / 2;
    const cy = height / 2;
    const baseRadius = 46;

    // Track global mouse
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      const relX = (clientX - (rect.left + rect.width / 2)) / (rect.width * 1.5);
      const relY = (clientY - (rect.top + rect.height / 2)) / (rect.height * 1.5);

      mousePosRef.current.x = Math.max(-1, Math.min(1, relX));
      mousePosRef.current.y = Math.max(-1, Math.min(1, relY));

      const isInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
      mousePosRef.current.isHovering = isInside;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let lastTime = performance.now();
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timeRef.current += dt * (isOverclocked ? 4.5 : 2.0);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Spring-Damper Physics for Squash & Stretch
      const k = 140; // Spring stiffness
      const d = 11; // Damping
      const ax = (1.0 - scaleRef.current.x) * k - scaleRef.current.vx * d;
      const ay = (1.0 - scaleRef.current.y) * k - scaleRef.current.vy * d;

      scaleRef.current.vx += ax * dt;
      scaleRef.current.vy += ay * dt;
      scaleRef.current.x += scaleRef.current.vx * dt;
      scaleRef.current.y += scaleRef.current.vy * dt;

      // 2. Eye Gaze Lerping
      const targetGazeX = mousePosRef.current.x * 14;
      const targetGazeY = mousePosRef.current.y * 14;
      gazeRef.current.x += (targetGazeX - gazeRef.current.x) * 0.12;
      gazeRef.current.y += (targetGazeY - gazeRef.current.y) * 0.12;

      const t = timeRef.current;
      const isHov = mousePosRef.current.isHovering;

      // Center transform with soft-body scaling & slight hover breathing
      ctx.translate(cx, cy);
      if (isOverclocked) {
        ctx.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
      }
      ctx.scale(scaleRef.current.x, scaleRef.current.y);

      // 3. Fluid Organic Jelly Outer Silhouette
      const numPoints = 64;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        // Harmonic noise simulation (squishy liquid boundary)
        const wave1 = Math.sin(angle * 3 + t * 2.2) * 4;
        const wave2 = Math.cos(angle * 5 - t * 1.6) * 2.5;
        const wave3 = Math.sin(angle * 7 + t * 3.1) * 1.2;
        const hoverInflate = isHov ? 3 : 0;
        const r = baseRadius + wave1 + wave2 + wave3 + hoverInflate;

        points.push({
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
        });
      }

      // Draw Iridescent Glow Halo (Chromatic Caustics)
      const haloGrad = ctx.createRadialGradient(0, 0, baseRadius * 0.3, 0, 0, baseRadius * 1.55);
      if (isOverclocked) {
        haloGrad.addColorStop(0, "rgba(244, 63, 94, 0.45)");
        haloGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.25)");
        haloGrad.addColorStop(1, "rgba(244, 63, 94, 0)");
      } else {
        haloGrad.addColorStop(0, "rgba(245, 158, 11, 0.35)");
        haloGrad.addColorStop(0.4, "rgba(6, 182, 212, 0.22)");
        haloGrad.addColorStop(0.8, "rgba(168, 85, 247, 0.12)");
        haloGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
      }

      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Draw Main Liquid Jelly Body
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < numPoints; i++) {
        const next = points[(i + 1) % numPoints];
        const midX = (points[i].x + next.x) / 2;
        const midY = (points[i].y + next.y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }
      ctx.closePath();

      // Liquid Core Gradient
      const coreGrad = ctx.createRadialGradient(
        -gazeRef.current.x * 0.4,
        -gazeRef.current.y * 0.4,
        4,
        0,
        0,
        baseRadius
      );

      if (isOverclocked) {
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.2, "#f43f5e");
        coreGrad.addColorStop(0.6, "#881337");
        coreGrad.addColorStop(1, "#18030a");
      } else {
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.18, "#fbbf24");
        coreGrad.addColorStop(0.5, "#0284c7");
        coreGrad.addColorStop(0.85, "#0f172a");
        coreGrad.addColorStop(1, "#030712");
      }

      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Chromatic Rim Light (Prismatic Dispersion Edge)
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = isOverclocked
        ? "rgba(251, 113, 133, 0.85)"
        : "rgba(253, 224, 71, 0.75)";
      ctx.stroke();

      // 4. The Centralis Eye Pupil (Tracks Cursor)
      const pupilX = gazeRef.current.x;
      const pupilY = gazeRef.current.y;
      const pupilRadius = isHov ? 14 : 11;

      // Pupil Outer Shimmer Ring
      ctx.beginPath();
      ctx.arc(pupilX, pupilY, pupilRadius * 1.45, 0, Math.PI * 2);
      ctx.strokeStyle = isOverclocked ? "rgba(254, 205, 211, 0.8)" : "rgba(103, 232, 249, 0.75)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Pupil Deep Void (The Centralis)
      ctx.beginPath();
      ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2);
      ctx.fillStyle = isOverclocked ? "#4c0519" : "#020617";
      ctx.fill();

      // Golden Central Spark in the Pupil Center
      ctx.beginPath();
      ctx.arc(pupilX, pupilY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isOverclocked ? "#fecdd3" : "#fef08a";
      ctx.shadowColor = isOverclocked ? "#f43f5e" : "#eab308";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. High-Gloss Specular Reflections (Glossy Glass Lens)
      ctx.beginPath();
      ctx.ellipse(
        pupilX - 12 - gazeRef.current.x * 0.2,
        pupilY - 14 - gazeRef.current.y * 0.2,
        7,
        4,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        pupilX + 9,
        pupilY + 11,
        2.5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();

      ctx.restore();

      // 6. Render Shockwaves
      shockwavesRef.current = shockwavesRef.current.filter((sw) => {
        sw.radius += 2.8;
        sw.opacity *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${sw.color}${sw.opacity})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.restore();

        return sw.opacity > 0.04 && sw.radius < sw.maxRadius;
      });

      // 7. Render Sparks (Overclock mode)
      sparksRef.current = sparksRef.current.filter((sp) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        sp.life += 1;

        const alpha = Math.max(0, 1 - sp.life / sp.maxLife);
        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        return sp.life < sp.maxLife;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOverclocked]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl transition-all duration-500 overflow-hidden ring-1 ${
        isOverclocked
          ? "ring-rose-500/50 bg-gradient-to-r from-rose-950/30 via-purple-950/20 to-black/80 shadow-[0_0_60px_rgba(244,63,94,0.25)]"
          : "ring-white/[0.04] bg-white/[0.02] hover:bg-white/[0.035] backdrop-blur-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)]"
      }`}
    >
      {/* Background Soft Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.06),transparent_60%)] pointer-events-none"></div>

      <div className="relative p-5 sm:p-7 flex flex-col md:flex-row items-center gap-6">
        {/* Left: The Interactive Organic Iris Entity */}
        <div className="relative flex-shrink-0 flex flex-col items-center group select-none">
          <div
            onClick={handlePoke}
            className="cursor-pointer relative transform transition-transform active:scale-95"
            title={isZh ? "戳一下 Fovea (连续戳 5 下开启超频！)" : "Poke Fovea (Click 5x rapidly for Overclock!)"}
          >
            <canvas
              ref={canvasRef}
              className="drop-shadow-[0_0_28px_rgba(245,158,11,0.3)] transition-all duration-300"
            />
            {/* Playful Poke Hint Pill */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-[var(--text-dim)] group-hover:text-amber-400 transition-colors uppercase whitespace-nowrap bg-white/[0.04] backdrop-blur-md px-2.5 py-0.5 rounded-full ring-1 ring-white/[0.06]">
              {isOverclocked
                ? "⚡ OVERCLOCKED ⚡"
                : isZh
                ? `👆 戳我 (${pokeCount})`
                : `👆 Poke me (${pokeCount})`}
            </div>
          </div>
        </div>

        {/* Right: Dynamic Speech Bubble & Controls */}
        <div className="flex-1 min-w-0 text-center md:text-left space-y-3.5">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-2 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 ring-1 ring-amber-500/30 text-amber-400 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>FOVEA · LIVING CORE</span>
              </span>
              <span className="text-[var(--text-dim)] text-[11px] hidden sm:inline">
                {isOverclocked
                  ? "🔥 TEMP: 98.4°C // OVERLOAD"
                  : "● STATE: ACUITY_FOCUS"}
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full borderless-pill ring-1 ring-black/[0.06] dark:ring-white/[0.06] text-[11px] text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title={soundOn ? "Mute sounds" : "Enable tactile sounds"}
            >
              {soundOn ? <Volume2 size={12} className="text-amber-500 dark:text-amber-400" /> : <VolumeX size={12} />}
              <span>{soundOn ? (isZh ? "音效开" : "Audio On") : isZh ? "静音" : "Muted"}</span>
            </button>
          </div>

          {/* Living Thought Monologue Bubble - Borderless Glass */}
          <div className="relative rounded-2xl bg-black/[0.02] dark:bg-white/[0.025] ring-1 ring-black/[0.06] dark:ring-white/[0.04] p-4 text-xs sm:text-sm text-[var(--text-main)] font-sans leading-relaxed backdrop-blur-md shadow-xs transition-all duration-300">
            <div className="flex items-start space-x-2.5">
              <Sparkles
                size={16}
                className={`flex-shrink-0 mt-0.5 ${
                  isOverclocked ? "text-rose-500 animate-spin" : "text-amber-500 dark:text-amber-400"
                }`}
              />
              <p className="font-medium italic select-text">
                {currentThought}
              </p>
            </div>
          </div>

          {/* Action Row: Ask & Feed - Borderless Floating Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-0.5">
            <button
              onClick={() => openAskFovea(INITIAL_SIGNALS[0])}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-semibold tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95 cursor-pointer"
            >
              <MessageSquareQuote size={13} />
              <span>{isZh ? "找 Fovea 聊聊" : "Talk with Fovea"}</span>
            </button>

            <button
              onClick={handleFeed}
              disabled={isFeeding}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full borderless-pill ring-1 ring-black/[0.06] dark:ring-white/[0.08] hover:ring-amber-500/40 text-[var(--text-main)] font-mono text-xs tracking-wider transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Zap size={13} className="text-amber-500 dark:text-amber-400" />
              <span>{isZh ? "⚡ 投喂今日算力口粮" : "⚡ Feed Compute Snack"}</span>
            </button>

            <button
              onClick={() => handlePoke()}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full borderless-pill ring-1 ring-black/[0.06] dark:ring-white/[0.06] text-[var(--text-dim)] hover:text-[var(--text-main)] font-mono text-xs transition-colors cursor-pointer"
              title={isZh ? "逗弄 Fovea" : "Poke"}
            >
              <RefreshCw size={11} />
              <span>{isZh ? "换个想法" : "Next thought"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
