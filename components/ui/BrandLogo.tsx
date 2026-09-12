import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = 28,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* Outer Hexagon with subtle glow */}
        <path
          d="M16 2L28 8.9282V23.0718L16 30L4 23.0718V8.9282L16 2Z"
          stroke="#00F0C0"
          strokeWidth="2"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(0,240,192,0.6)]"
        />
        {/* Inner Geometric Shield & Circuit Core */}
        <path
          d="M16 6L23 10.0416V18.125L16 22.1666L9 18.125V10.0416L16 6Z"
          stroke="#00F0C0"
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
          opacity="0.6"
        />
        <circle cx="16" cy="14" r="3" fill="#00F0C0" />
        <line x1="16" y1="17" x2="16" y2="22" stroke="#00F0C0" strokeWidth="1.5" />
        <line x1="13.5" y1="12.5" x2="9" y2="10" stroke="#00F0C0" strokeWidth="1.5" />
        <line x1="18.5" y1="12.5" x2="23" y2="10" stroke="#00F0C0" strokeWidth="1.5" />
      </svg>
      {showText && (
        <span className="font-sans font-bold tracking-[0.16em] text-white text-base md:text-lg">
          CYBERFORAGE
        </span>
      )}
    </div>
  );
};
