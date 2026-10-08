import React, { useRef, useState, useCallback } from 'react';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface Cyber3DCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  accent?: 'cyan' | 'purple' | 'rose' | 'emerald' | 'sky' | 'amber';
  customColor?: string;
  maxTilt?: number;
  glareOpacity?: number;
  glowOnHover?: boolean;
  perspective?: number;
  lift?: number;
  onClick?: () => void;
  playSound?: boolean;
}

export const Cyber3DCard: React.FC<Cyber3DCardProps> = ({
  children,
  className = '',
  style = {},
  accent = 'cyan',
  customColor,
  maxTilt = 18,
  glareOpacity = 0.28,
  glowOnHover = true,
  perspective = 1100,
  lift = 18,
  onClick,
  playSound = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef<number | null>(null);

  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      return `${r}, ${g}, ${b}`;
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
    return '0, 240, 192';
  };

  const getAccentColors = () => {
    if (customColor) {
      const rgb = hexToRgb(customColor);
      return {
        glow: `rgba(${rgb}, 0.4)`,
        border: `rgba(${rgb}, 0.55)`,
        glare: `rgba(${rgb}, 0.28)`,
      };
    }

    switch (accent) {
      case 'purple':
        return {
          glow: 'rgba(168, 85, 247, 0.4)',
          border: 'rgba(168, 85, 247, 0.5)',
          glare: 'rgba(168, 85, 247, 0.25)',
        };
      case 'rose':
        return {
          glow: 'rgba(244, 63, 94, 0.4)',
          border: 'rgba(244, 63, 94, 0.5)',
          glare: 'rgba(244, 63, 94, 0.25)',
        };
      case 'emerald':
        return {
          glow: 'rgba(16, 185, 129, 0.4)',
          border: 'rgba(16, 185, 129, 0.5)',
          glare: 'rgba(16, 185, 129, 0.25)',
        };
      case 'sky':
        return {
          glow: 'rgba(56, 189, 248, 0.4)',
          border: 'rgba(56, 189, 248, 0.5)',
          glare: 'rgba(56, 189, 248, 0.25)',
        };
      case 'amber':
        return {
          glow: 'rgba(251, 191, 36, 0.4)',
          border: 'rgba(251, 191, 36, 0.5)',
          glare: 'rgba(251, 191, 36, 0.25)',
        };
      case 'cyan':
      default:
        return {
          glow: 'rgba(0, 240, 192, 0.4)',
          border: 'rgba(0, 240, 192, 0.5)',
          glare: 'rgba(0, 240, 192, 0.25)',
        };
    }
  };

  const colors = getAccentColors();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (-maxTilt to +maxTilt)
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Calculate glare percentage position
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setRotate({ x: rotateX, y: rotateY });
      setGlarePosition({ x: glareX, y: glareY });
    });
  }, [maxTilt]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (playSound) cyberSound.playBlip();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rafId.current) cancelAnimationFrame(rafId.current);
    // Smooth reset
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      style={{ perspective: `${perspective}px`, ...style }}
      className="relative w-full h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateZ(${lift}px) scale3d(1.025, 1.025, 1.025)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s ease, border-color 0.3s ease',
          boxShadow: isHovered && glowOnHover
            ? `${(-rotate.y * 1.5).toFixed(1)}px ${(rotate.x * 1.5).toFixed(1)}px 35px ${colors.glow}, 0 0 15px rgba(0, 0, 0, 0.8)`
            : '0 4px 20px rgba(0, 0, 0, 0.4)',
          borderColor: isHovered ? colors.border : undefined,
        }}
        className={`relative rounded-2xl bg-gradient-to-b from-[#0d1526]/95 via-[#080d19]/95 to-[#03060c]/98 border border-white/[0.08] backdrop-blur-xl overflow-hidden transition-all duration-300 ${className}`}
      >
        {/* Theme 1 Prismatic Rainbow Razor Top Edge */}
        <div
          className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#ff0055] via-[#ffaa00] via-[#00ffaa] via-[#00e5ff] to-[#8b5cf6] z-30 transition-all duration-300 ${
            isHovered ? 'opacity-100 shadow-[0_0_12px_rgba(0,229,255,0.8),0_0_24px_rgba(255,0,85,0.6)] h-[2.5px]' : 'opacity-60 shadow-[0_0_6px_rgba(0,229,255,0.3)]'
          }`}
        />

        {/* Holographic Mouse Glare Layer */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, ${colors.glare}, transparent 75%)`,
              opacity: glareOpacity,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Cyber HUD Corner Highlights on Hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <div
              className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-all duration-300"
              style={{ borderColor: colors.border }}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-all duration-300"
              style={{ borderColor: colors.border }}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-all duration-300"
              style={{ borderColor: colors.border }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-all duration-300"
              style={{ borderColor: colors.border }}
            />
          </div>
        )}

        {/* 3D Content Container with preserve-3d */}
        <div style={{ transformStyle: 'preserve-3d' }} className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
};
