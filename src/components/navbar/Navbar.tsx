import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Volume2, VolumeX, Menu, X, ArrowUpRight, Network, Sliders, ChevronDown, Layers } from 'lucide-react';
import { GithubIcon } from '../icons/BrandIcons';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { useSiteContent } from '../../context/SiteContentContext';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenCtf?: () => void;
  onOpenAiScanner?: () => void;
  onOpenNmap?: () => void;
  onOpenAudioConsole?: () => void;
  onOpenAdmin?: () => void;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTerminal,
  onOpenCtf,
  onOpenAiScanner,
  onOpenNmap,
  onOpenAudioConsole,
  onOpenAdmin,
  activeSection = 'home',
  onNavigate,
}) => {
  const { content } = useSiteContent();
  const defconLevel = content.telemetry?.defconLevel || 5;
  const [isAudioMuted, setIsAudioMuted] = useState(cyberSound.isMuted);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    if (toolsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toolsDropdownOpen]);

  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'scroll()');

    let rafId: number | null = null;
    let currentProgress = 0;
    let targetProgress = 0;

    const updateProgress = () => {
      // High-performance smooth lerp interpolation (GPU compositor target)
      currentProgress += (targetProgress - currentProgress) * 0.35;
      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
      }

      const scaleStr = `scaleX(${currentProgress})`;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = scaleStr;
      }
      if (progressGlowRef.current) {
        progressGlowRef.current.style.transform = scaleStr;
      }

      if (currentProgress !== targetProgress) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        rafId = null;
      }
    };

    const handleScroll = () => {
      const isOver20 = window.scrollY > 20;
      if (scrolledRef.current !== isOver20) {
        scrolledRef.current = isOver20;
        setScrolled(isOver20);
      }

      // If browser doesn't have native scroll-driven animations, use smooth RAF lerp
      if (!supportsScrollTimeline) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        targetProgress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
        if (!rafId) {
          rafId = requestAnimationFrame(updateProgress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);


  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (onNavigate && href.startsWith('#')) {
      e.preventDefault();
      cyberSound.playClick();
      onNavigate(href.slice(1));
      setMobileMenuOpen(false);
    }
  };

  const handleAudioToggle = () => {
    if (onOpenAudioConsole) {
      onOpenAudioConsole();
    } else {
      const muted = cyberSound.toggleMute();
      setIsAudioMuted(muted);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'Projects', href: '#projects' },
    { label: 'Labs', href: '#labs' },
    { label: 'Research', href: '#research' },
    { label: 'Tools', href: '#technologies' },
    { label: 'Telemetry', href: '#telemetry' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none`}
    >
      <div
        className={`max-w-7xl w-full mx-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 pointer-events-auto flex items-center justify-between gap-1.5 sm:gap-2.5 relative overflow-visible ${
          scrolled
            ? 'bg-[#030610]/92 backdrop-blur-2xl border border-white/[0.14] shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(0,240,192,0.1)]'
            : 'bg-[#030610]/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Subtle top prismatic hairline accent */}
        <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#00e5ff]/60 via-[#ff0055]/50 to-transparent pointer-events-none rounded-t-full" />
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick('#home', e)}
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0] rounded-full flex-shrink-0"
        >
          <div className="inline-flex items-center gap-1.5 select-none">
            {/* Cyberforage Hexagonal Logo */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <path
                d="M16 2L28 8.9282V23.0718L16 30L4 23.0718V8.9282L16 2Z"
                stroke="#00F0C0"
                strokeWidth="2"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(0,240,192,0.6)]"
              />
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
            <span className="font-mono font-bold tracking-[0.14em] text-white text-xs sm:text-sm md:text-base">
              CYBER<span className="text-[#00F0C0]">FORAGE</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-white/[0.05] border border-white/10 text-[8px] font-mono tracking-widest text-slate-300 font-semibold">
              3D
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links - Compact Theme 1 Capsule Pills */}
        <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(link.href, e)}
                onMouseEnter={() => cyberSound.playBlip()}
                className={`relative px-2 xl:px-2.5 py-0.5 xl:py-1 text-[11px] xl:text-xs font-mono font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/[0.09] border border-white/15 shadow-[0_0_12px_rgba(255,255,255,0.06)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#ff0055] via-[#00ffaa] to-[#00e5ff] animate-pulse" />
                  )}
                  <span>{link.label}</span>
                </span>
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Utilities - Compact, Zero-Overflow Cluster */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* Tactical Simulations & Tools Hub Dropdown */}
          <div className="relative" ref={toolsDropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                cyberSound.playClick();
                setToolsDropdownOpen(!toolsDropdownOpen);
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full border text-[11px] sm:text-xs font-mono font-medium transition-all cursor-pointer ${
                toolsDropdownOpen
                  ? 'bg-white/15 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
              }`}
              title="Tactical Cyber Tools, Simulations & Portals"
              aria-expanded={toolsDropdownOpen}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#ff0055] via-[#00ffaa] to-[#00e5ff] animate-pulse" />
              <span className="font-semibold tracking-wide">Simulations</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[9px] font-mono text-slate-300">4</span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                  toolsDropdownOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-2xl bg-[#040814]/98 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(0,240,192,0.15)] p-2 z-[9999] flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 border-b border-white/[0.08] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#ff0055] via-[#00ffaa] to-[#00e5ff] animate-pulse" />
                    <span>Tactical Simulations</span>
                  </span>
                  <span className="text-[#00F0C0] font-semibold text-[9px]">4 READY</span>
                </div>

                {/* CTF Arena Mini-Challenge */}
                {onOpenCtf && (
                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      onOpenCtf();
                      setToolsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs font-mono text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#F43F5E] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-rose-300 group-hover:text-rose-200">CTF Arena</span>
                        <span className="text-[10px] text-slate-400">SOC Defender Challenge</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      60s
                    </span>
                  </button>
                )}

                {/* Sentinel AI Threat Scanner & CVE Lookup */}
                {onOpenAiScanner && (
                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      onOpenAiScanner();
                      setToolsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs font-mono text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sky-300 group-hover:text-sky-200">Sentinel AI</span>
                        <span className="text-[10px] text-slate-400">Threat & CVE Triage</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                      AI
                    </span>
                  </button>
                )}

                {/* Live Nmap Network Scanner */}
                {onOpenNmap && (
                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      onOpenNmap();
                      setToolsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs font-mono text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-emerald-300 group-hover:text-emerald-200">Live Nmap</span>
                        <span className="text-[10px] text-slate-400">Port Reconnaissance</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      SCAN
                    </span>
                  </button>
                )}

                {/* Request n8n Access */}
                <a
                  href="https://n8nrequest.cyberforage.space/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    cyberSound.playClick();
                    setToolsDropdownOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-mono text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer group border-t border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#00F0C0] shadow-[0_0_8px_#00F0C0] flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#00F0C0]">Request n8n</span>
                      <span className="text-[10px] text-slate-400">Automation Workflows</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#00E5BE] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* CMS Admin Panel if onOpenAdmin */}
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      cyberSound.playLaser();
                      onOpenAdmin();
                      setToolsDropdownOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs font-mono text-amber-300 hover:text-white hover:bg-amber-500/15 transition-all cursor-pointer group border-t border-white/5 mt-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-amber-300">Root CMS Admin</span>
                        <span className="text-[10px] text-slate-400">Live Telemetry & Content</span>
                      </div>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight uppercase ${
                        defconLevel === 1
                          ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_8px_#F43F5E]'
                          : defconLevel === 2
                          ? 'bg-orange-500 text-white shadow-[0_0_8px_#F97316]'
                          : defconLevel === 3
                          ? 'bg-yellow-500 text-black'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      D-{defconLevel}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cyber Terminal Button - Compact Theme 1 High-Contrast White Pill CTA */}
          <button
            onClick={() => {
              cyberSound.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => cyberSound.playBlip()}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full bg-white text-[#020408] hover:bg-slate-100 font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.35)] hover:shadow-[0_0_20px_rgba(0,240,192,0.4)] hover:scale-105 active:scale-95 flex-shrink-0"
            title="Open Interactive Cyber Terminal Console (~)"
          >
            <Terminal className="w-3.5 h-3.5 text-[#020408]" />
            <span className="font-bold">Console</span>
          </button>

          {/* Audio Synthesizer Toggle - Compact Rounded-Full Pill */}
          <button
            onClick={handleAudioToggle}
            className={`w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center rounded-full border transition-all cursor-pointer flex-shrink-0 ${
              !isAudioMuted
                ? 'bg-white/[0.08] border-white/30 text-[#00F0C0] shadow-[0_0_10px_rgba(0,240,192,0.25)]'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
            title={!isAudioMuted ? 'Mute Cyber Audio' : 'Enable Cyber Synthesizer Sound FX'}
            aria-label={!isAudioMuted ? 'Mute Cyber Audio' : 'Enable Cyber Synthesizer Sound FX'}
          >
            {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* GitHub link - Compact Rounded-Full Pill */}
          <a
            href="https://github.com/nishchaygaur"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberSound.playClick()}
            className="w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-full border border-white/10 hover:border-white/20 transition-all flex-shrink-0"
            title="GitHub Repositories"
            aria-label="GitHub Repositories"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Hamburger - Compact Rounded-Full Pill */}
          <button
            onClick={() => {
              cyberSound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden w-7 h-7 sm:w-7.5 sm:h-7.5 flex items-center justify-center text-slate-400 hover:text-white rounded-full border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.08] cursor-pointer flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slideout Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050D1A]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(link.href, e)}
                className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs font-mono text-slate-200 hover:text-[#00F0C0] hover:border-[#00F0C0]/30 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <a
              href="https://n8nrequest.cyberforage.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 rounded-lg border border-[#00F0C0]/40 bg-[#00F0C0]/10 text-xs font-mono font-semibold text-[#00F0C0]"
            >
              <span>Request n8n Access</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            {onOpenNmap && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenNmap();
                }}
                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[#10B981]/10 border border-[#10B981]/40 text-xs font-mono text-emerald-300"
              >
                <Network className="w-4 h-4 text-emerald-400" />
                <span>Launch Live Nmap Scanner</span>
              </button>
            )}
            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs font-mono text-amber-300"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Open Root CMS Admin (DEFCON {defconLevel})</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[#071322] border border-white/10 text-xs font-mono text-[#00F0C0]"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Cyber Terminal</span>
            </button>
          </div>
        </div>
      )}

      {/* Real-Time Cyber Scroll Progress Line (Prismatic Spectrum Refraction) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/[0.04] pointer-events-none overflow-visible">
        {/* Ambient bloom aura */}
        <div
          ref={progressGlowRef}
          className="cyber-scroll-progress-line absolute inset-0 h-full bg-gradient-to-r from-[#ff0055] via-[#ffaa00] via-[#00ffaa] via-[#00e5ff] to-[#8b5cf6] blur-[4px] opacity-80 pointer-events-none"
        />
        {/* Crisp laser line */}
        <div
          ref={progressBarRef}
          className="cyber-scroll-progress-line relative w-full h-full bg-gradient-to-r from-[#ff0055] via-[#ffaa00] via-[#00ffaa] via-[#00e5ff] to-[#8b5cf6] shadow-[0_0_12px_rgba(0,229,255,0.8)]"
        >
          {/* Leading laser spark beacon */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#00F0C0,0_0_20px_#ff0055]" />
        </div>
      </div>
    </header>
  );
};
