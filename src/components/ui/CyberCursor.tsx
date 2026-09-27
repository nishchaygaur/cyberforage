import React, { useEffect, useState, useRef } from 'react';

export const CyberCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const ringPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only activate custom cursor on devices that support hover (non-touch)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer') ||
          target.closest('canvas')
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp loop for the trailing outer reticle
    const render = () => {
      const ease = 0.18;
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * ease;

      const ringEl = document.getElementById('cyber-cursor-ring');
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${
          isClicked ? 0.8 : isHovered ? 1.45 : 1
        })`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible, isHovered, isClicked]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Central Laser Pip (Instant response) */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none transition-colors duration-150"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
          backgroundColor: isHovered ? '#00F0C0' : '#00E5BE',
          boxShadow: isHovered
            ? '0 0 10px #00F0C0, 0 0 20px rgba(0, 240, 192, 0.6)'
            : '0 0 6px rgba(0, 229, 190, 0.8)',
        }}
      />

      {/* Trailing Sci-Fi Crosshair Reticle (Smooth lerp) */}
      <div
        id="cyber-cursor-ring"
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none transition-opacity duration-200"
        style={{
          border: isHovered
            ? '1.5px solid rgba(0, 240, 192, 0.9)'
            : '1px solid rgba(0, 240, 192, 0.35)',
          boxShadow: isHovered
            ? '0 0 15px rgba(0, 240, 192, 0.4), inset 0 0 10px rgba(0, 240, 192, 0.2)'
            : 'none',
        }}
      >
        {/* 4 Precision Crosshair Corner Ticks */}
        <span
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 transition-colors"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.6)' }}
        />
        <span
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 transition-colors"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.6)' }}
        />
        <span
          className="absolute -left-1 top-1/2 -translate-y-1/2 h-0.5 w-1.5 transition-colors"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.6)' }}
        />
        <span
          className="absolute -right-1 top-1/2 -translate-y-1/2 h-0.5 w-1.5 transition-colors"
          style={{ backgroundColor: isHovered ? '#00F0C0' : 'rgba(0, 240, 192, 0.6)' }}
        />

        {/* Tactical Crosshair Dot in Reticle Center when locked */}
        {isHovered && (
          <div className="absolute inset-1.5 rounded-full border border-[#00F0C0]/30 animate-ping pointer-events-none" />
        )}
      </div>
    </div>
  );
};
