import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, DiscordIcon, TelegramIcon, MatrixIcon } from '../icons/BrandIcons';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { useSiteContent } from '../../context/SiteContentContext';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { content } = useSiteContent();
  const contact = content.contact;
  const socialsVisible = {
    github: true,
    linkedin: true,
    twitter: true,
    discord: true,
    telegram: true,
    matrix: true,
    ...(contact?.socialsVisible || {}),
  };

  const scrollToTop = () => {
    cyberSound.playClick();
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (onNavigate && href.startsWith('#')) {
      e.preventDefault();
      cyberSound.playClick();
      onNavigate(href.slice(1));
    }
  };

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Labs', href: '#labs' },
    { label: 'Research', href: '#research' },
    { label: 'Tools', href: '#technologies' },
    { label: 'Architecture', href: '#technologies' },
    { label: 'About', href: '#ecosystem' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-[#02050b] border-t border-white/[0.06] pt-12 pb-10 overflow-hidden" aria-label="Cyberforage Footer">
      {/* Prismatic rainbow accent top razor line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff0055] via-[#00ffaa] via-[#00e5ff] to-transparent opacity-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10">
          {/* Logo & Brand */}
          <a
            href="#home"
            onClick={(e) => handleNavClick('#home', e)}
            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0C0] rounded"
          >
            <div className="inline-flex items-center gap-2.5 select-none">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 transition-transform group-hover:scale-110"
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
              <span className="font-mono font-bold tracking-[0.16em] text-white text-base md:text-lg">
                CYBER<span className="text-[#00F0C0]">FORAGE</span>
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(link.href, e)}
                className="text-xs sm:text-sm font-mono text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Icons & Scroll Top */}
          <div className="flex items-center space-x-2">
            {contact?.githubUrl && socialsVisible.github && (
              <a
                href={contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberSound.playClick()}
                aria-label="GitHub"
                title="GitHub Profile"
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full border border-transparent hover:border-white/15 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}

            {contact?.linkedinUrl && socialsVisible.linkedin && (
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberSound.playClick()}
                aria-label="LinkedIn"
                title="LinkedIn Profile"
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full border border-transparent hover:border-white/15 transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}

            {contact?.twitterUrl && socialsVisible.twitter && (
              <a
                href={contact.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberSound.playClick()}
                aria-label="Twitter / X"
                title="Twitter / X"
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full border border-transparent hover:border-white/15 transition-all"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            )}

            {contact?.discordUrl && socialsVisible.discord && (
              <a
                href={contact.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberSound.playClick()}
                aria-label="Discord"
                title="Discord Community"
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full border border-transparent hover:border-white/15 transition-all"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
            )}

            {contact?.telegramUrl && socialsVisible.telegram && (
              <a
                href={contact.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberSound.playClick()}
                aria-label="Telegram"
                title="Telegram Channel"
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full border border-transparent hover:border-white/15 transition-all"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>
            )}

            {contact?.matrixUrl && socialsVisible.matrix && (
              <a
                href={contact.matrixUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberSound.playClick()}
                aria-label="Matrix"
                title="Matrix Room"
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full border border-transparent hover:border-white/15 transition-all"
              >
                <MatrixIcon className="w-4 h-4 text-[#00F0C0]" />
              </a>
            )}

            <button
              onClick={scrollToTop}
              className="p-2.5 text-slate-400 hover:text-black hover:bg-white rounded-full border border-white/20 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Tagline & Copyright */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p className="tracking-wide text-slate-300">Explore. Build. Defend.</p>
          <p>© 2026 Cyberforage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
