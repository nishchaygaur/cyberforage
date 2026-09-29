import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Copy, Check, Shield, Globe, Maximize2, AlertCircle, Sparkles } from 'lucide-react';
import { LinkedinIcon } from '../icons/BrandIcons';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface LinkedInProfileEmbedProps {
  url: string;
  vanityName?: string;
  className?: string;
  onExpandModal?: () => void;
}

export const LinkedInProfileEmbed: React.FC<LinkedInProfileEmbedProps> = ({
  url,
  vanityName,
  className = '',
  onExpandModal,
}) => {
  // Extract vanity username from URL if not explicitly provided
  const resolvedVanity = vanityName || (() => {
    try {
      const match = url.match(/linkedin\.com\/in\/([^/?#]+)/i);
      return match ? match[1] : 'nishchay-gaur';
    } catch {
      return 'nishchay-gaur';
    }
  })();

  const [activeView, setActiveView] = useState<'iframe' | 'interactive' | 'badge'>('iframe');
  const [iframeKey, setIframeKey] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load official LinkedIn badge script if in badge view
  useEffect(() => {
    if (activeView === 'badge') {
      const existingScript = document.getElementById('linkedin-badge-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'linkedin-badge-script';
        script.src = 'https://platform.linkedin.com/badges/js/profile.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }, [activeView]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    cyberSound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReloadFrame = () => {
    cyberSound.playClick();
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div
      className={`relative rounded-2xl bg-[#061224]/90 border border-[#0077B5]/40 backdrop-blur-xl shadow-[0_0_40px_rgba(0,119,181,0.2)] overflow-hidden transition-all flex flex-col ${className}`}
    >
      {/* Top Holographic Ambient Glare */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#0077B5]/15 blur-[80px] pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Terminal Titlebar HUD */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-5 border-b border-white/10 bg-[#040C18]/95">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0077B5]/20 border border-[#0077B5]/40 flex items-center justify-center text-[#38BDF8] shadow-[0_0_12px_rgba(0,119,181,0.3)]">
            <LinkedinIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white font-mono tracking-tight">
                LINKEDIN PROFILE IFRAME
              </span>
              <span className="hidden sm:inline-flex text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              in/{resolvedVanity} • Encrypted Identity Relay
            </p>
          </div>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tab buttons */}
          <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => {
                setActiveView('iframe');
                cyberSound.playClick();
              }}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                activeView === 'iframe'
                  ? 'bg-[#0077B5] text-white font-bold shadow-[0_0_10px_rgba(0,119,181,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Iframe
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('interactive');
                cyberSound.playClick();
              }}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                activeView === 'interactive'
                  ? 'bg-[#0077B5] text-white font-bold shadow-[0_0_10px_rgba(0,119,181,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cyber Dossier
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('badge');
                cyberSound.playClick();
              }}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                activeView === 'badge'
                  ? 'bg-[#0077B5] text-white font-bold shadow-[0_0_10px_rgba(0,119,181,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Official Badge
            </button>
          </div>

          {/* Action buttons */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
            title="Copy LinkedIn Profile Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {activeView === 'iframe' && (
            <button
              type="button"
              onClick={handleReloadFrame}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
              title="Reload Iframe"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {onExpandModal && (
            <button
              type="button"
              onClick={() => {
                cyberSound.playClick();
                onExpandModal();
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
              title="Expand Fullscreen Modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberSound.playClick()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077B5]/20 hover:bg-[#0077B5]/35 text-[#38BDF8] border border-[#0077B5]/40 text-[11px] font-mono font-medium transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            <span>Open Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Display Body */}
      <div className="relative z-10 flex-1 min-h-[460px] sm:min-h-[520px] bg-[#02060E] flex flex-col">
        {/* VIEW 1: Live Iframe */}
        {activeView === 'iframe' && (
          <div className="relative flex-1 w-full h-full min-h-[460px] sm:min-h-[520px] flex flex-col">
            {/* Informational Companion Bar */}
            <div className="px-4 py-2 bg-[#051122] border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>Source: <code className="text-[#38BDF8]">{url}</code></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">Notice browser CSP / frame-ancestors policy</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('interactive');
                    cyberSound.playClick();
                  }}
                  className="text-[10px] text-[#00F0C0] hover:underline"
                >
                  View Cyber Card →
                </button>
              </div>
            </div>

            {/* Iframe Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#02060E]/90 backdrop-blur-sm pointer-events-none">
                <div className="w-10 h-10 rounded-full border-2 border-[#0077B5]/30 border-t-[#38BDF8] animate-spin mb-3" />
                <span className="text-xs font-mono text-slate-300">
                  Establishing secure tunnel to LinkedIn...
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  Target: {url}
                </span>
              </div>
            )}

            {/* The Actual LinkedIn Profile Iframe */}
            <iframe
              key={iframeKey}
              src={url}
              title="Nishchay Gaur LinkedIn Profile Frame"
              className="w-full flex-1 min-h-[420px] border-0"
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />

            {/* Bottom CSP Fallback Action Ribbon */}
            <div className="p-3 bg-[#040E1C] border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-[#38BDF8] flex-shrink-0" />
                <span>If your browser displays connection refusal due to LinkedIn X-Frame-Options:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('interactive');
                    cyberSound.playClick();
                  }}
                  className="px-2.5 py-1 rounded bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 text-[#00F0C0] border border-[#00F0C0]/30 transition-all cursor-pointer text-[10px]"
                >
                  Switch to Cyber Dossier
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="px-3 py-1 rounded bg-[#0077B5] hover:bg-[#0088D1] text-white transition-all cursor-pointer text-[10px] font-bold"
                >
                  Direct Connect on LinkedIn ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Cyber Interactive Dossier Card */}
        {activeView === 'interactive' && (
          <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 animate-fadeIn font-mono">
            {/* Card Header Background with Holographic Mesh */}
            <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#07172C] via-[#051122] to-[#040C18] border border-[#0077B5]/40 shadow-xl overflow-hidden mb-6">
              <div
                className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-[#0077B5]/20 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Operator Profile Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0077B5] to-[#041F3D] border-2 border-[#38BDF8] p-1 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-[0_0_25px_rgba(0,119,181,0.5)]">
                    <span className="tracking-wider">NG</span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#051122] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                </div>

                {/* Operator Metadata */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Nishchay Gaur
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0077B5]/20 text-[#38BDF8] border border-[#0077B5]/50 text-[10px] font-semibold">
                      <Shield className="w-3 h-3" />
                      <span>Verified Identity</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px]">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Cyberforage Founder</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    Cybersecurity Researcher • Autonomous AI Security • Threat Detection &amp; Triage Engineering
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[#00E5BE]">
                      <Globe className="w-3 h-3" />
                      <span>India • 500+ Connections</span>
                    </span>
                    <span className="text-slate-600">|</span>
                    <span>Company: <strong className="text-white">Cyberforage</strong></span>
                    <span className="text-slate-600">|</span>
                    <span>Clearance: <strong className="text-emerald-400">SOC Admin Level-5</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Competencies & Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-[#040C18] border border-white/10">
                <span className="text-[10px] text-slate-500 block mb-1">SPECIALIZATION</span>
                <span className="text-xs font-bold text-white block">Adversary Emulation</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  MITRE ATT&amp;CK TTPs &amp; Red-Team tooling
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#040C18] border border-white/10">
                <span className="text-[10px] text-slate-500 block mb-1">DETECTION PLATFORM</span>
                <span className="text-xs font-bold text-[#00F0C0] block">Telemetry &amp; SIEM</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Automated Sigma logic &amp; alert triage
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#040C18] border border-white/10">
                <span className="text-[10px] text-slate-500 block mb-1">AI AUTOMATION</span>
                <span className="text-xs font-bold text-[#A855F7] block">Autonomous Agents</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  n8n security pipelines &amp; LLM responders
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-[11px] text-slate-400">
                <span>Official profile URL: </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#38BDF8] hover:underline"
                >
                  {url}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-all cursor-pointer border border-white/10"
                >
                  {copied ? 'Copied URL!' : 'Copy Profile Link'}
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#0088D1] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,119,181,0.4)] hover:scale-105 active:scale-95"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>Connect with Nishchay on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Official LinkedIn Script Badge */}
        {activeView === 'badge' && (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center flex-1 text-center font-mono">
            <span className="text-xs text-slate-400 mb-4">
              Rendering official LinkedIn JavaScript member profile badge:
            </span>

            {/* Official LinkedIn Embed Target */}
            <div className="p-4 rounded-xl bg-[#040E1C] border border-white/10 flex justify-center w-full max-w-md min-h-[280px]">
              <div
                className="badge-base LI-profile-badge"
                data-locale="en_US"
                data-size="large"
                data-theme="dark"
                data-type="HORIZONTAL"
                data-vanity={resolvedVanity}
                data-version="v1"
              >
                <a
                  className="badge-base__link LI-simple-link text-xs text-[#38BDF8] hover:underline"
                  href={`https://in.linkedin.com/in/${resolvedVanity}?trk=profile-badge`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nishchay Gaur - LinkedIn Member Badge
                </a>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveView('iframe')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to Live Iframe
              </button>
              <span className="text-slate-600">|</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#38BDF8] hover:underline"
              >
                <span>Open direct LinkedIn profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
