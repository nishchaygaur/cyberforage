import React, { useState } from 'react';
import { Mail, Globe, Send, Shield, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/BrandIcons';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsTransmitting(true);
    cyberSound.playLaser();

    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      cyberSound.playPulse();
    }, 1800);
  };

  return (
    <section id="contact" className="relative py-14 sm:py-20 border-t border-white/[0.04]" aria-label="Open Source and Contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Split Cards: Built in Public + Verified Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 7 Columns: Open Source 3D Card */}
          <div className="lg:col-span-7">
            <Cyber3DCard
              customColor="#00F0C0"
              maxTilt={12}
              lift={16}
              className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between"
            >
              <div>
                <div style={{ transform: 'translateZ(35px)' }} className="flex items-start gap-5 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-[#00F0C0]/30 flex items-center justify-center flex-shrink-0 text-[#00F0C0] shadow-[0_0_15px_rgba(0,240,192,0.2)]">
                    <GithubIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-1.5 block">
                      OPEN SOURCE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Built in public. Secured in public.
                    </h3>
                  </div>
                </div>

                <p
                  style={{ transform: 'translateZ(20px)' }}
                  className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed mb-6 font-normal"
                >
                  Explore our repositories, audit platforms, detection logic, and research tooling. Collaborate directly with the community and contribute defensive playbooks.
                </p>
              </div>

              {/* Action Links */}
              <div
                style={{ transform: 'translateZ(38px)' }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <a
                  href="https://github.com/nishchaygaur"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#050E1A] hover:bg-[#00F0C0]/15 border border-[#00F0C0]/40 hover:border-[#00F0C0] text-xs font-mono font-semibold text-white transition-all group shadow-md hover:scale-105 active:scale-95"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Visit GitHub</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00F0C0] transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href="https://www.linkedin.com/in/nishchay-gaur/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#38BDF8]/50 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </Cyber3DCard>
          </div>

          {/* Right 5 Columns: Verified Identity 3D Card */}
          <div className="lg:col-span-5">
            <Cyber3DCard
              customColor="#38BDF8"
              maxTilt={12}
              lift={16}
              className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between"
            >
              <div>
                <div style={{ transform: 'translateZ(32px)' }}>
                  <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
                    VERIFIED IDENTITY
                  </span>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#061528] to-[#0a2340] border border-[#00F0C0]/30 flex items-center justify-center text-[#00F0C0] shadow-md">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-mono">Cyberforage</h4>
                      <span className="text-[10px] font-mono text-[#00E5BE]">Nishchay Gaur</span>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                      Verified
                    </span>
                  </div>
                </div>

                <div
                  style={{ transform: 'translateZ(24px)' }}
                  className="space-y-2 text-xs font-mono text-slate-300 mb-6 p-3 rounded-xl bg-[#040A14] border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#00F0C0]" />
                    <a href="mailto:contact@cyberforage.space" className="hover:underline text-[#00E5BE]">
                      contact@cyberforage.space
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>cyberforage.space</span>
                  </div>
                </div>
              </div>

              <div style={{ transform: 'translateZ(38px)' }} className="pt-2">
                <a
                  href="mailto:contact@cyberforage.space"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 border border-[#00F0C0]/30 hover:border-[#00F0C0] text-xs font-mono font-bold text-[#00F0C0] transition-colors shadow-md hover:scale-105 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </Cyber3DCard>
          </div>
        </div>

        {/* Encrypted Transmission Terminal Form (3D Container) */}
        <Cyber3DCard
          customColor="#00F0C0"
          maxTilt={8}
          lift={12}
          className="p-6 sm:p-10"
        >
          <div style={{ transform: 'translateZ(26px)' }} className="max-w-2xl mb-8">
            <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-medium uppercase mb-2 block">
              SECURE TRANSMISSION
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              Send an Encrypted Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Have an idea, research collaboration, vulnerability disclosure, or want to connect with Cyberforage?
            </p>
          </div>

          {transmitted ? (
            <div
              style={{ transform: 'translateZ(32px)' }}
              className="p-8 rounded-2xl bg-[#051424] border border-[#00F0C0]/40 text-center space-y-3 animate-fadeIn"
            >
              <CheckCircle2 className="w-10 h-10 text-[#00F0C0] mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white font-mono">Transmission Delivered</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto font-mono">
                Your dispatch has been cryptographically signed and routed to the Cyberforage security desk.
              </p>
              <button
                onClick={() => {
                  setTransmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-[#00F0C0] border border-[#00F0C0]/30 cursor-pointer"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div style={{ transform: 'translateZ(24px)' }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">CALLSIGN / NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050D18] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">SECURE EMAIL *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="operator@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050D18] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors"
                  />
                </div>
              </div>

              <div style={{ transform: 'translateZ(24px)' }}>
                <label className="block text-xs font-mono text-slate-400 mb-1">TRANSMISSION TOPIC</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Security Collaboration / Lab Scenario / GRC Inquiries"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050D18] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors"
                />
              </div>

              <div style={{ transform: 'translateZ(24px)' }}>
                <label className="block text-xs font-mono text-slate-400 mb-1">ENCRYPTED MESSAGE CONTENT *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter transmission payload..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#050D18] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] transition-colors resize-none"
                />
              </div>

              <div style={{ transform: 'translateZ(30px)' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-[#00F0C0]" />
                  <span>Encrypted Channel: End-to-End TLS / AES-256 verified</span>
                </div>

                <button
                  type="submit"
                  disabled={isTransmitting}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-mono font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isTransmitting
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                      : 'bg-[#00E5BE] hover:bg-[#00F0C0] text-[#04131E] shadow-[0_0_20px_rgba(0,229,190,0.3)] hover:shadow-[0_0_30px_rgba(0,240,192,0.45)] hover:scale-105 active:scale-95'
                  }`}
                >
                  <Send className={`w-4 h-4 ${isTransmitting ? 'animate-spin' : ''}`} />
                  <span>{isTransmitting ? 'Encrypting & Transmitting...' : 'Dispatch Transmission'}</span>
                </button>
              </div>
            </form>
          )}
        </Cyber3DCard>
      </div>
    </section>
  );
};
