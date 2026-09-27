"use client";

import React, { useEffect, useRef, useState } from "react";
import { isSoundEnabled, toggleSound, playPokeSound } from "@/utils/foveaAudio";

interface AudioVisualizerButtonProps {
  onToggle?: (newState: boolean) => void;
  className?: string;
  isZh?: boolean;
}

export const AudioVisualizerButton: React.FC<AudioVisualizerButtonProps> = ({
  onToggle,
  className = "",
  isZh = false,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 36;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      timeRef.current += dt * (isHovered ? 4.0 : 2.0);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const t = timeRef.current;

      if (soundOn) {
        // 1. Outer subtle audio ring
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? "rgba(245, 158, 11, 0.45)" : "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 2. Dynamic Sine Wave Filaments (Audio Equalizer Ring)
        const numSegments = 32;
        ctx.beginPath();
        for (let i = 0; i <= numSegments; i++) {
          const angle = (i / numSegments) * Math.PI * 2;
          const wave = Math.sin(angle * 4 + t * 2.8) * (isHovered ? 2.8 : 1.8);
          const r = 9.5 + wave;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = isHovered ? "#fbbf24" : "#f59e0b";
        ctx.lineWidth = 1.4;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = isHovered ? 8 : 4;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 3. Central Pulsing Core Dot
        const corePulse = 2.2 + Math.sin(t * 4.5) * 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // 4. Dancing Micro-Dots on Orbit
        for (let i = 0; i < 3; i++) {
          const dotAngle = t * 1.5 + (i * Math.PI * 2) / 3;
          const dx = cx + Math.cos(dotAngle) * 14;
          const dy = cy + Math.sin(dotAngle) * 14;
          ctx.beginPath();
          ctx.arc(dx, dy, 1, 0, Math.PI * 2);
          ctx.fillStyle = "#06b6d4";
          ctx.fill();
        }
      } else {
        // Muted State: Clean Dim Ring with Diagonal Slash
        ctx.beginPath();
        ctx.arc(cx, cy, 11, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - 7, cy - 7);
        ctx.lineTo(cx + 7, cy + 7);
        ctx.strokeStyle = "rgba(244, 63, 94, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [soundOn, isHovered]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleSound();
    setSoundOn(next);
    if (next) playPokeSound();
    onToggle?.(next);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-9 h-9 rounded-full borderless-pill ring-1 ring-white/[0.08] hover:ring-amber-500/40 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 ${className}`}
      title={
        soundOn
          ? isZh
            ? "触觉合成音效：已开启（点击静音）"
            : "Tactile Audio Synth: ON (Click to mute)"
          : isZh
          ? "触觉合成音效：已静音（点击开启）"
          : "Tactile Audio Synth: MUTED (Click to enable)"
      }
    >
      <canvas ref={canvasRef} className="pointer-events-none block" />
    </button>
  );
};
