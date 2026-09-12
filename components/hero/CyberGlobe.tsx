"use client";

import React, { useEffect, useRef } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  alpha: number;
  size: number;
}

export const CyberGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Generate sphere points
    const sphereRadius = Math.min(width, height) * 0.40;
    const numPoints = 850;
    const points: Point3D[] = [];

    for (let i = 0; i < numPoints; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.cos(phi);
      const z = sphereRadius * Math.sin(phi) * Math.sin(theta);

      // Continent-like clustering / cluster highlights
      const isCluster = (i % 6 === 0);
      points.push({
        x,
        y,
        z,
        baseRadius: sphereRadius,
        alpha: isCluster ? 0.95 : 0.4 + Math.random() * 0.4,
        size: isCluster ? 2.3 : 1.1 + Math.random() * 0.8,
      });
    }

    // Orbital ring points
    const ring1Radius = sphereRadius * 1.35;
    const ring2Radius = sphereRadius * 1.45;

    let rotationY = 0;
    let rotationX = 0.22;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      const isLight =
        typeof document !== "undefined" &&
        document.documentElement.getAttribute("data-theme") === "light";

      if (!prefersReducedMotion) {
        rotationY += 0.0035;
      }

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // 1. Draw central atmospheric glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.1,
        centerX,
        centerY,
        sphereRadius * 1.2
      );
      if (isLight) {
        glowGrad.addColorStop(0, "rgba(13, 148, 136, 0.15)");
        glowGrad.addColorStop(0.5, "rgba(13, 148, 136, 0.05)");
        glowGrad.addColorStop(1, "rgba(248, 250, 252, 0)");
      } else {
        glowGrad.addColorStop(0, "rgba(0, 240, 192, 0.18)");
        glowGrad.addColorStop(0.5, "rgba(0, 240, 192, 0.06)");
        glowGrad.addColorStop(1, "rgba(4, 8, 18, 0)");
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Project and draw sphere points
      const projectedPoints: { sx: number; sy: number; z: number; alpha: number; size: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Rotate around Y axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective scale
        const fov = 450;
        const scale = fov / (fov + z2);
        const sx = centerX + x1 * scale;
        const sy = centerY + y2 * scale;

        projectedPoints.push({
          sx,
          sy,
          z: z2,
          alpha: p.alpha * (0.3 + (z2 + sphereRadius) / (2 * sphereRadius) * 0.7),
          size: p.size * scale,
        });
      }

      // Sort points from back to front for depth
      projectedPoints.sort((a, b) => a.z - b.z);

      // Connect forward points with faint lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedPoints.length; i += 6) {
        const p1 = projectedPoints[i];
        if (p1.z < 0) continue; // only front hemisphere

        for (let j = i + 1; j < Math.min(i + 8, projectedPoints.length); j++) {
          const p2 = projectedPoints[j];
          if (p2.z < 0) continue;

          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const distSq = dx * dx + dy * dy;

          if (distSq < 1600) {
            const lineAlpha = (1 - Math.sqrt(distSq) / 40) * (isLight ? 0.35 : 0.25);
            ctx.strokeStyle = isLight
              ? `rgba(13, 148, 136, ${lineAlpha})`
              : `rgba(0, 240, 192, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();
          }
        }
      }

      // Draw particle dots
      for (let i = 0; i < projectedPoints.length; i++) {
        const p = projectedPoints[i];
        if (p.z > 0) {
          // Front hemisphere - high-contrast teal in light mode, cyan in dark mode
          ctx.fillStyle = isLight
            ? `rgba(13, 148, 136, ${Math.min(1, p.alpha * 1.15)})`
            : `rgba(0, 240, 192, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Extra glow on larger nodes
          if (p.size > 2.0) {
            ctx.fillStyle = isLight
              ? `rgba(13, 148, 136, 0.25)`
              : `rgba(0, 240, 192, 0.3)`;
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, p.size * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Back hemisphere - slate in light mode, dimmer dark cyan in dark mode
          ctx.fillStyle = isLight
            ? `rgba(100, 116, 139, ${p.alpha * 0.4})`
            : `rgba(0, 180, 150, ${p.alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(0.7, p.size * 0.8), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Orbital Rings
      // Ring 1 (tilted)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.35);
      ctx.scale(1, 0.35);
      ctx.strokeStyle = isLight ? "rgba(13, 148, 136, 0.35)" : "rgba(0, 240, 192, 0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, ring1Radius, 0, Math.PI * 2);
      ctx.stroke();

      // Ring 1 nodes
      const ring1Angle = rotationY * 1.5;
      const r1x = Math.cos(ring1Angle) * ring1Radius;
      const r1y = Math.sin(ring1Angle) * ring1Radius;
      ctx.fillStyle = isLight ? "#0D9488" : "#00F0C0";
      ctx.beginPath();
      ctx.arc(r1x, r1y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Ring 2 (counter-tilted)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(0.45);
      ctx.scale(1, 0.28);
      ctx.strokeStyle = isLight ? "rgba(2, 132, 199, 0.3)" : "rgba(0, 240, 192, 0.15)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, ring2Radius, 0, Math.PI * 2);
      ctx.stroke();

      const ring2Angle = -rotationY * 1.2 + Math.PI;
      const r2x = Math.cos(ring2Angle) * ring2Radius;
      const r2y = Math.sin(ring2Angle) * ring2Radius;
      ctx.fillStyle = isLight ? "#0284C7" : "#38BDF8";
      ctx.beginPath();
      ctx.arc(r2x, r2y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[480px] lg:max-w-[560px] mx-auto flex items-center justify-center">
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 240, 192, 0.15) 0%, rgba(56, 189, 248, 0.05) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* HTML5 Canvas Globe */}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10 block"
        aria-label="Interactive 3D cyber network globe visualization"
      />

      {/* Floating Badges matching the reference image layout */}
      {/* 1. SECURITY: Top slightly left */}
      <div className="absolute top-[10%] left-[28%] z-20 pointer-events-none transform -translate-x-1/2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
            SECURITY
          </span>
        </div>
      </div>

      {/* 2. AI: Top Right */}
      <div className="absolute top-[22%] right-[8%] z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shadow-[0_0_6px_#A855F7]" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
            AI
          </span>
        </div>
      </div>

      {/* 3. RESEARCH: Bottom Left */}
      <div className="absolute bottom-[30%] left-[10%] z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
            RESEARCH
          </span>
        </div>
      </div>

      {/* 4. AUTOMATION: Bottom Right */}
      <div className="absolute bottom-[16%] right-[5%] z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#071322]/90 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE] shadow-[0_0_6px_#00E5BE]" />
          <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-200">
            AUTOMATION
          </span>
        </div>
      </div>
    </div>
  );
};
