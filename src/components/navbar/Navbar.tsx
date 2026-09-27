import React, { useState, useEffect } from 'react';
import { Terminal, Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../icons/BrandIcons';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenCtf?: () => void;
  onOpenAiScanner?: () => void;
  onOpenAudioConsole?: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTerminal,
  onOpenCtf,
  onOpenAiScanner,
  onOpenAudioConsole,
  activeSection = 'home',
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((window.scrollY / docHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#040812]/85 backdrop-blur-md border-b border-white/[0.08] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-[#040812]/50 backdrop-blur-sm border-b border-white/[0.04] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={() => cyberSound.playClick()}
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0] rounded"
        >
          <div className="inline-flex items-center gap-2.5 select-none">
            {/* Cyberforage Hexagonal Logo */}
            <svg
              width="28"
              height="28"
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
            <span className="font-mono font-bold tracking-[0.18em] text-white text-base md:text-lg">
              CYBER<span className="text-[#00F0C0]">FORAGE</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#00F0C0]/10 border border-[#00F0C0]/25 text-[10px] font-mono text-[#00E5BE]">
              3D
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => cyberSound.playClick()}
                onMouseEnter={() => cyberSound.playBlip()}
                className={`relative px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                  isActive ? 'text-[#00F0C0]' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-3 right-3 h-[2px] bg-[#00F0C0] rounded-full shadow-[0_0_8px_#00F0C0]"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* n8n Access Portal Link */}
          <a
            href="https://n8nrequest.cyberforage.space/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberSound.playClick()}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#00F0C0]/30 bg-[#00F0C0]/5 px-3 py-1.5 text-xs font-mono font-semibold text-[#00F0C0] transition-all hover:border-[#00F0C0] hover:bg-[#00F0C0]/10 hover:shadow-[0_0_15px_rgba(0,240,192,0.2)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
            <span>Request n8n</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00E5BE]" />
          </a>

          {/* CTF Challenge Button */}
          {onOpenCtf && (
            <button
              onClick={() => {
                cyberSound.playClick();
                onOpenCtf();
              }}
              onMouseEnter={() => cyberSound.playBlip()}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-mono transition-all shadow-sm"
              title="Launch SOC Defender CTF Mini-Challenge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>CTF Arena</span>
            </button>
          )}

          {/* AI Threat Scanner Button */}
          {onOpenAiScanner && (
            <button
              onClick={() => {
                cyberSound.playClick();
                onOpenAiScanner();
              }}
              onMouseEnter={() => cyberSound.playBlip()}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-sky-300 hover:text-white text-xs font-mono transition-all shadow-sm"
              title="Launch Sentinel AI Threat Triage"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
              <span>Sentinel AI</span>
            </button>
          )}

          {/* Cyber Terminal Button */}
          <button
            onClick={() => {
              cyberSound.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => cyberSound.playBlip()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#071322] hover:bg-[#0b1d33] border border-white/10 hover:border-[#00F0C0]/50 text-slate-300 hover:text-[#00F0C0] text-xs font-mono transition-all cursor-pointer shadow-sm"
            title="Open Interactive Cyber Terminal Console (~)"
          >
            <Terminal className="w-3.5 h-3.5 text-[#00F0C0]" />
            <span className="hidden md:inline font-semibold">Terminal</span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              !isAudioMuted
                ? 'bg-[#00F0C0]/10 border-[#00F0C0]/40 text-[#00F0C0] shadow-[0_0_12px_rgba(0,240,192,0.2)]'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
            title={!isAudioMuted ? 'Mute Cyber Audio' : 'Enable Cyber Synthesizer Sound FX'}
          >
            {!isAudioMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/nishchaygaur"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberSound.playClick()}
            className="p-2 text-slate-400 hover:text-[#00F0C0] hover:bg-white/5 rounded-lg transition-colors"
            title="GitHub Repositories"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => {
              cyberSound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                onClick={() => {
                  cyberSound.playClick();
                  setMobileMenuOpen(false);
                }}
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

      {/* Real-Time Cyber Scroll Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04] pointer-events-none overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00F0C0] via-[#38BDF8] to-[#A855F7] transition-all duration-75 ease-out shadow-[0_0_10px_#00F0C0]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
};
