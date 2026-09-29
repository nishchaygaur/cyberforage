import React, { useState } from 'react';
import { Mail, Globe, Send, Shield, CheckCircle2, Lock, ArrowRight, Copy, Check, RefreshCw, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, DiscordIcon, TelegramIcon, MatrixIcon } from '../icons/BrandIcons';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Cyber3DCard } from '../ui/Cyber3DCard';
import { useSiteContent } from '../../context/SiteContentContext';

export const ContactSection: React.FC = () => {
  const { content } = useSiteContent();
  const contact = content.contact;
  const contactEmail = contact?.email || 'contact@cyberforage.space';
  const githubUrl = contact?.githubUrl || 'https://github.com/nishchaygaur';
  const linkedinUrl = contact?.linkedinUrl || 'https://www.linkedin.com/in/nishchay-gaur/';
  const twitterUrl = contact?.twitterUrl;
  const discordUrl = contact?.discordUrl;
  const telegramUrl = contact?.telegramUrl;
  const matrixUrl = contact?.matrixUrl;
  const pgpKey = contact?.pgpKey;

  const socialsVisible = {
    github: true,
    linkedin: true,
    twitter: true,
    discord: true,
    telegram: true,
    matrix: true,
    ...(contact?.socialsVisible || {}),
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionStep, setTransmissionStep] = useState(0);
  const [transmissionStepText, setTransmissionStepText] = useState('');
  const [transmittedData, setTransmittedData] = useState<{
    id: string;
    hash: string;
    timestamp: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    mailtoUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Callsign or Operator Name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Secure Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. operator@domain.com).';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Encrypted message payload cannot be empty.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoFillDemo = () => {
    cyberSound.playBlip();
    setFormData({
      name: 'Security Operator #402',
      email: 'operator@cyberforage.space',
      subject: 'Adversary Simulation / Red-Team Telemetry Collaboration',
      message: 'Initiating dispatch regarding the latest detection engineering telemetry pipeline. Requesting coordination on the MITRE ATT&CK coverage benchmark.'
    });
    setErrors({});
  };

  const handleDispatch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) {
      cyberSound.playAlert();
      return;
    }

    setIsTransmitting(true);
    setTransmissionStep(1);
    setTransmissionStepText('Initializing AES-256-GCM cipher envelope...');
    cyberSound.playLaser();

    // Step 2: Hashing
    setTimeout(() => {
      setTransmissionStep(2);
      const randomHex = Array.from({ length: 4 }, () => Math.random().toString(16).slice(2, 6)).join(':');
      setTransmissionStepText(`Computing SHA-256 integrity hash [0x${randomHex}]...`);
    }, 400);

    // Step 3: Routing
    setTimeout(() => {
      setTransmissionStep(3);
      setTransmissionStepText(`Routing encrypted packets to ${contactEmail}...`);
    }, 850);

    // Step 4: Completed
    setTimeout(() => {
      setTransmissionStep(4);
      setTransmissionStepText('Cryptographic ACK verified. Transmission delivered.');

      const dispatchId = `CF-DISP-${Math.floor(1000 + Math.random() * 9000)}`;
      const dispatchHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const timestamp = new Date().toISOString();

      const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
        `[Cyberforage Dispatch ${dispatchId}] ${formData.subject || 'Security Collaboration'}`
      )}&body=${encodeURIComponent(
        `Callsign / Operator: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Topic: ${formData.subject || 'General Inquiry'}\n` +
        `Dispatch ID: ${dispatchId}\n` +
        `Integrity Hash: ${dispatchHash}\n` +
        `Timestamp: ${timestamp}\n\n` +
        `--- MESSAGE PAYLOAD ---\n${formData.message}\n\n` +
        `-----------------------------------------\n` +
        `Dispatched via Cyberforage 3D Interactive Console`
      )}`;

      // Save to localStorage for audit trail
      try {
        const existing = JSON.parse(localStorage.getItem('cyberforage_dispatches') || '[]');
        existing.unshift({
          id: dispatchId,
          hash: dispatchHash,
          timestamp,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        localStorage.setItem('cyberforage_dispatches', JSON.stringify(existing.slice(0, 10)));
      } catch (err) {
        // storage disabled or private browsing
      }

      setTransmittedData({
        id: dispatchId,
        hash: dispatchHash,
        timestamp,
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        mailtoUrl
      });

      setIsTransmitting(false);
      cyberSound.playPulse();

      // Launch mail client directly
      try {
        window.location.href = mailtoUrl;
      } catch (err) {
        // fallback to in-app buttons
      }
    }, 1400);
  };

  const handleCopyPayload = () => {
    if (!transmittedData) return;
    const payloadText =
      `=== CYBERFORAGE DISPATCH [${transmittedData.id}] ===\n` +
      `Timestamp: ${transmittedData.timestamp}\n` +
      `Recipient: ${contactEmail}\n` +
      `Sender Callsign: ${transmittedData.name}\n` +
      `Sender Email: ${transmittedData.email}\n` +
      `Topic: ${transmittedData.subject}\n` +
      `SHA-256 Checksum: ${transmittedData.hash}\n\n` +
      `Payload:\n${transmittedData.message}\n` +
      `==========================================`;

    navigator.clipboard.writeText(payloadText);
    cyberSound.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    cyberSound.playClick();
    setTransmittedData(null);
    setTransmissionStep(0);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <section id="contact" className="relative py-14 sm:py-20 border-t border-white/[0.04] cyber-section-visibility" aria-label="Open Source and Contact">
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
                className="flex flex-wrap items-center gap-2.5 pt-2"
              >
                {githubUrl && socialsVisible.github && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#050E1A] hover:bg-[#00F0C0]/15 border border-[#00F0C0]/40 hover:border-[#00F0C0] text-xs font-mono font-semibold text-white transition-all group shadow-md hover:scale-105 active:scale-95"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                    <ArrowRight className="w-3 h-3 text-[#00F0C0] transition-transform group-hover:translate-x-1" />
                  </a>
                )}

                {linkedinUrl && socialsVisible.linkedin && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#38BDF8]/50 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {twitterUrl && socialsVisible.twitter && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#38BDF8]/50 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <TwitterIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Twitter/X</span>
                  </a>
                )}

                {discordUrl && socialsVisible.discord && (
                  <a
                    href={discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#818CF8]/50 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <DiscordIcon className="w-3.5 h-3.5 text-[#818CF8]" />
                    <span>Discord</span>
                  </a>
                )}

                {telegramUrl && socialsVisible.telegram && (
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#38BDF8]/50 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <TelegramIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Telegram</span>
                  </a>
                )}

                {matrixUrl && socialsVisible.matrix && (
                  <a
                    href={matrixUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-[#00F0C0]/50 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    <MatrixIcon className="w-3.5 h-3.5 text-[#00F0C0]" />
                    <span>Matrix</span>
                  </a>
                )}

                {!(
                  (githubUrl && socialsVisible.github) ||
                  (linkedinUrl && socialsVisible.linkedin) ||
                  (twitterUrl && socialsVisible.twitter) ||
                  (discordUrl && socialsVisible.discord) ||
                  (telegramUrl && socialsVisible.telegram) ||
                  (matrixUrl && socialsVisible.matrix)
                ) && (
                  <span className="text-[11px] font-mono text-slate-500 italic">
                    Public social channels currently toggled offline by administrator.
                  </span>
                )}
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
                    <a href={`mailto:${contactEmail}`} className="hover:underline text-[#00E5BE]">
                      {contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>cyberforage.space</span>
                  </div>
                  {pgpKey && (
                    <div className="flex items-start gap-2 pt-1.5 border-t border-white/5 text-[10px] text-slate-400">
                      <Lock className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="truncate">
                        <span className="text-slate-500 block text-[9px]">PGP FINGERPRINT</span>
                        <span className="text-slate-300 font-mono text-[10px] select-all">{pgpKey}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ transform: 'translateZ(38px)' }} className="pt-2 space-y-2">
                <a
                  href={`mailto:${contactEmail}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 border border-[#00F0C0]/30 hover:border-[#00F0C0] text-xs font-mono font-bold text-[#00F0C0] transition-colors shadow-md hover:scale-105 active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </a>

                {linkedinUrl && socialsVisible.linkedin && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0077B5]/15 hover:bg-[#0077B5]/25 border border-[#0077B5]/40 hover:border-[#38BDF8] text-xs font-mono font-bold text-[#38BDF8] transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Connect on LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8]" />
                  </a>
                )}
              </div>
            </Cyber3DCard>
          </div>
        </div>

        {/* Encrypted Transmission Terminal Form Card */}
        <div className="relative rounded-2xl bg-[#071324]/90 border border-[#00F0C0]/30 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Cyber Ambient Glare Background */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#00F0C0]/10 blur-[90px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Form Header with Quick Test Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F0C0] animate-pulse" />
                <span className="text-xs font-mono tracking-[0.2em] text-[#00E5BE] font-semibold uppercase">
                  SECURE TRANSMISSION CONSOLE
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Send an Encrypted Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Directly route security research, tool feedback, or collaboration dispatches to <span className="text-[#00F0C0] font-mono">{contactEmail}</span>.
              </p>
            </div>

            {!transmittedData && (
              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-[#00F0C0]/15 border border-white/10 hover:border-[#00F0C0]/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer self-start sm:self-auto"
                title="Populate test payload data"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00E5BE]" />
                <span>Fill Demo Payload</span>
              </button>
            )}
          </div>

          {/* View 1: Delivered State */}
          {transmittedData ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#040C18] border border-[#00F0C0]/50 space-y-6 animate-fadeIn shadow-[0_0_30px_rgba(0,240,192,0.15)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00F0C0]/15 border border-[#00F0C0]/40 flex items-center justify-center flex-shrink-0 text-[#00F0C0] shadow-[0_0_20px_rgba(0,240,192,0.3)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight">
                      DISPATCH DELIVERED &amp; PREPARED
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      HTTP 200 / ACK
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Dispatch ID: <span className="text-[#00F0C0] font-bold">{transmittedData.id}</span> | Hash: <span className="text-slate-400">{transmittedData.hash}</span>
                  </p>
                </div>
              </div>

              {/* Payload Summary Terminal Box */}
              <div className="p-4 rounded-xl bg-[#02060E] border border-white/10 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/5">
                  <span>Routing Destination: <span className="text-[#00F0C0]">contact@cyberforage.space</span></span>
                  <span>{new Date(transmittedData.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">From: </span>{transmittedData.name} &lt;{transmittedData.email}&gt;
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-500">Topic: </span>{transmittedData.subject}
                </div>
                <div className="text-slate-300 pt-1 border-t border-white/5">
                  <span className="text-slate-500 block mb-1">Payload Content:</span>
                  <p className="text-slate-200 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">
                    {transmittedData.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* 1. Open in Email App */}
                <a
                  href={transmittedData.mailtoUrl}
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5BE] hover:bg-[#00F0C0] text-[#04131E] text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(0,229,190,0.35)] hover:shadow-[0_0_30px_rgba(0,240,192,0.55)] cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>Open in Mail App (contact@cyberforage.space)</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>

                {/* 2. Copy Payload to Clipboard */}
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 text-xs font-mono font-medium text-white transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Signed Payload'}</span>
                </button>

                {/* 3. Send Another Dispatch */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer ml-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Send Another Dispatch</span>
                </button>
              </div>
            </div>
          ) : (
            /* View 2: Active Transmission Form */
            <form onSubmit={handleDispatch} noValidate className="space-y-5">
              {/* Callsign & Secure Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>CALLSIGN / NAME <span className="text-[#00F0C0]">*</span></span>
                    {errors.name && (
                      <span className="text-rose-400 text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.name}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    placeholder="e.g. Alex Vance"
                    disabled={isTransmitting}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#040A14] border text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-all ${
                      errors.name
                        ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.25)] focus:border-rose-400'
                        : 'border-white/10 focus:border-[#00F0C0] focus:shadow-[0_0_15px_rgba(0,240,192,0.15)]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>SECURE EMAIL <span className="text-[#00F0C0]">*</span></span>
                    {errors.email && (
                      <span className="text-rose-400 text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.email}
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="operator@domain.com"
                    disabled={isTransmitting}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#040A14] border text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.25)] focus:border-rose-400'
                        : 'border-white/10 focus:border-[#00F0C0] focus:shadow-[0_0_15px_rgba(0,240,192,0.15)]'
                    }`}
                  />
                </div>
              </div>

              {/* Topic Subject */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  TRANSMISSION TOPIC (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Security Collaboration / Lab Scenario / GRC Inquiries"
                  disabled={isTransmitting}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#040A14] border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00F0C0] focus:shadow-[0_0_15px_rgba(0,240,192,0.15)] transition-all"
                />
              </div>

              {/* Message Payload */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>ENCRYPTED MESSAGE CONTENT <span className="text-[#00F0C0]">*</span></span>
                  {errors.message && (
                    <span className="text-rose-400 text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.message}
                    </span>
                  )}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  placeholder="Enter transmission payload, vulnerability disclosure notes, or collaboration inquiry..."
                  disabled={isTransmitting}
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#040A14] border text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-all resize-none ${
                    errors.message
                      ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.25)] focus:border-rose-400'
                      : 'border-white/10 focus:border-[#00F0C0] focus:shadow-[0_0_15px_rgba(0,240,192,0.15)]'
                  }`}
                />
              </div>

              {/* Live Transmitting Visual Progress Bar */}
              {isTransmitting && (
                <div className="p-3 rounded-xl bg-[#030914] border border-[#00F0C0]/40 font-mono text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-[#00E5BE]">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00F0C0] animate-ping" />
                      <span>{transmissionStepText}</span>
                    </span>
                    <span>Step {transmissionStep}/4</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00E5BE] to-[#00F0C0] transition-all duration-300"
                      style={{ width: `${transmissionStep * 25}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Bottom Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-[#00F0C0]" />
                  <span>Channel: TLS 1.3 / AES-256-GCM authenticated</span>
                </div>

                <button
                  type="submit"
                  disabled={isTransmitting}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-7 rounded-xl font-mono font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 ${
                    isTransmitting
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                      : 'bg-[#00E5BE] hover:bg-[#00F0C0] text-[#04131E] shadow-[0_0_25px_rgba(0,229,190,0.35)] hover:shadow-[0_0_35px_rgba(0,240,192,0.55)]'
                  }`}
                >
                  <Send className={`w-4 h-4 ${isTransmitting ? 'animate-spin' : ''}`} />
                  <span>{isTransmitting ? 'Encrypting & Transmitting...' : 'Dispatch Transmission'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
