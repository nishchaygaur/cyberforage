import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  X,
  Maximize2,
  Minimize2,
  Check,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Save,
  Globe,
  Radio,
  Layers,
  FlaskConical,
  BookOpen,
  Cpu,
  Mail,
  Zap,
  Sliders,
  ExternalLink,
  Eye,
  LogOut,
  Terminal,
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Project, Lab, ResearchArticle, TechTool } from '../../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const {
    content,
    updateHero,
    updateEcosystem,
    addProject,
    editProject,
    deleteProject,
    addLab,
    editLab,
    deleteLab,
    addArticle,
    editArticle,
    deleteArticle,
    addTool,
    editTool,
    deleteTool,
    updateTelemetry,
    updateContact,
    updateSceneConfig,
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
  } = useSiteContent();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cyberforage_admin_auth') === 'true';
  });
  const [callsign, setCallsign] = useState('root');
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hero' | 'ecosystem' | 'projects' | 'labs' | 'research' | 'tools' | 'contact' | 'backup'
  >('overview');

  // Sub-modal / Inline Edit States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [isAddingLab, setIsAddingLab] = useState(false);

  const [editingArticle, setEditingArticle] = useState<ResearchArticle | null>(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);

  const [editingTool, setEditingTool] = useState<TechTool | null>(null);
  const [isAddingTool, setIsAddingTool] = useState(false);

  const [importJsonText, setImportJsonText] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const triggerSaveNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    cyberSound.playBlip();
    setTimeout(() => setSaveSuccessMsg(''), 2500);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passphrase === 'cyberforage-sec-2026' || passphrase === 'admin' || passphrase === 'root') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cyberforage_admin_auth', 'true');
      setAuthError('');
      cyberSound.playClick();
      cyberSound.speak('Root credentials verified. Central command online.');
    } else {
      setAuthError('Access Denied: Invalid Security Passkey.');
      cyberSound.playAlert();
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('cyberforage_admin_auth', 'true');
    setAuthError('');
    cyberSound.playClick();
    cyberSound.speak('Demo operator access granted.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cyberforage_admin_auth');
    cyberSound.playClick();
  };

  const handleExport = () => {
    const data = exportConfigJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberforage_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSaveNotification('Configuration exported successfully.');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importConfigJson(importJsonText);
    if (ok) {
      triggerSaveNotification('Site configuration restored from backup!');
      setImportJsonText('');
    } else {
      alert('Invalid JSON structure. Please verify format.');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all site content to original factory defaults? All manual edits will be reverted.')) {
      resetToDefaults();
      triggerSaveNotification('Factory defaults restored.');
      cyberSound.playPulse();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-panel-title"
    >
      <div
        className={`w-full bg-[#030914]/98 border border-[#00F0C0]/40 rounded-2xl shadow-[0_0_60px_rgba(0,240,192,0.2)] flex flex-col overflow-hidden transition-all duration-300 ${
          isMaximized ? 'h-[96vh] max-w-[98vw]' : 'h-[90vh] max-h-[880px] max-w-6xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#050E1C] border-b border-white/[0.08] select-none">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#00F0C0]/15 border border-[#00F0C0]/40 text-[#00F0C0] shadow-[0_0_15px_rgba(0,240,192,0.3)]">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="admin-panel-title" className="text-sm sm:text-base font-bold text-white font-mono tracking-wider">
                  CYBERFORAGE <span className="text-[#00F0C0]">ADMIN CMS</span> // v3.0
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isAuthenticated
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {isAuthenticated ? 'ROOT ACCESS' : 'AUTH REQUIRED'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Full Frontend Content Management, Telemetry DEFCON Control, & Live Persistence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccessMsg && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#00F0C0]/15 text-[#00F0C0] border border-[#00F0C0]/40 text-xs font-mono animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                <span>{saveSuccessMsg}</span>
              </span>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#02060F]">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#051122] border border-white/10 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#00F0C0]/10 border border-[#00F0C0]/30 flex items-center justify-center mx-auto text-[#00F0C0] shadow-[0_0_20px_rgba(0,240,192,0.2)]">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-mono text-lg font-bold text-white tracking-wide">
                  CENTRAL COMMAND AUTHENTICATION
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Authenticate with security passkey to edit site content and trigger broadcast bulletins.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">OPERATOR CALLSIGN</label>
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 focus:border-[#00F0C0] text-sm font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">SECURITY PASSKEY</label>
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter passkey (e.g. cyberforage-sec-2026)"
                    className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 focus:border-[#00F0C0] text-sm font-mono text-white focus:outline-none"
                  />
                </div>

                {authError && (
                  <div className="flex items-center gap-2 p-2 rounded bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] text-[#030914] font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,192,0.3)] hover:shadow-[0_0_30px_rgba(0,240,192,0.5)]"
                  >
                    Authenticate Session
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Quick Demo 1-Click Access</span>
                  </button>
                </div>
              </form>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-500 text-center">
                Default Credentials: User: <span className="text-slate-300">root</span> | Pass: <span className="text-slate-300">cyberforage-sec-2026</span>
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard: Navigation Rail & Active Editor Screen */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#02060F]">
            {/* Left Vertical Nav Rail */}
            <div className="w-full md:w-60 bg-[#040C1A] border-r border-white/[0.08] p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto select-none flex-shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 px-3 py-1.5 hidden md:block">
                CONTENT MODULES
              </span>

              {[
                { id: 'overview', label: 'Overview & DEFCON', icon: Radio, count: undefined },
                { id: 'hero', label: 'Hero & Motto', icon: Globe, count: undefined },
                { id: 'ecosystem', label: 'Ecosystem Pillars', icon: Layers, count: content.ecosystem.pillars.length },
                { id: 'projects', label: 'Projects Manager', icon: Layers, count: content.projects.length },
                { id: 'labs', label: 'Virtual Labs', icon: FlaskConical, count: content.labs.length },
                { id: 'research', label: 'Research Papers', icon: BookOpen, count: content.researchArticles.length },
                { id: 'tools', label: 'Tech Stack Tools', icon: Cpu, count: content.techTools.length },
                { id: 'contact', label: 'Comms & Socials', icon: Mail, count: undefined },
                { id: 'backup', label: 'Backup & Restore', icon: Sliders, count: undefined },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      cyberSound.playBlip();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#00F0C0]/15 text-[#00F0C0] border border-[#00F0C0]/40 font-bold shadow-[0_0_15px_rgba(0,240,192,0.15)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Editor Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* 1. Overview & DEFCON Module */}
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">
                      DEFENSE GRID TELEMETRY & DEFCON CONTROL
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      Manage live threat levels, emergency bulletins, and review real-time CMS statistics.
                    </p>
                  </div>

                  {/* DEFCON Level Radio Buttons */}
                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4">
                    <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider block">
                      GLOBAL DEFCON THREAT READINESS LEVEL
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { level: 5, label: 'DEFCON 5', sub: 'Nominal', color: '#10B981' },
                        { level: 4, label: 'DEFCON 4', sub: 'Heightened Watch', color: '#38BDF8' },
                        { level: 3, label: 'DEFCON 3', sub: 'Active Monitoring', color: '#FBBF24' },
                        { level: 2, label: 'DEFCON 2', sub: 'Elevated Threat', color: '#F97316' },
                        { level: 1, label: 'DEFCON 1', sub: 'Maximum Breach Alert', color: '#F43F5E' },
                      ].map((def) => {
                        const isSelected = content.telemetry.defconLevel === def.level;
                        return (
                          <button
                            key={def.level}
                            onClick={() => {
                              updateTelemetry({ defconLevel: def.level });
                              triggerSaveNotification(`DEFCON set to Level ${def.level}`);
                            }}
                            className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white/10 shadow-lg'
                                : 'bg-black/30 border-white/5 opacity-70 hover:opacity-100'
                            }`}
                            style={{ borderColor: isSelected ? def.color : 'rgba(255,255,255,0.1)' }}
                          >
                            <span className="text-xs font-bold block" style={{ color: def.color }}>
                              {def.label}
                            </span>
                            <span className="text-[10px] text-slate-300 block">{def.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Emergency Broadcast Banner */}
                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                        EMERGENCY BROADCAST ALERT BANNER
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                        <input
                          type="checkbox"
                          checked={content.telemetry.isAlertActive}
                          onChange={(e) => {
                            updateTelemetry({ isAlertActive: e.target.checked });
                            triggerSaveNotification(
                              e.target.checked ? 'Broadcast banner activated!' : 'Broadcast banner deactivated.'
                            );
                          }}
                          className="w-4 h-4 rounded accent-[#00F0C0] cursor-pointer"
                        />
                        <span>Broadcast Active</span>
                      </label>
                    </div>

                    <textarea
                      rows={2}
                      value={content.telemetry.broadcastAlert}
                      onChange={(e) => updateTelemetry({ broadcastAlert: e.target.value })}
                      placeholder="Enter emergency bulletin announcement (e.g. Critical Zero-Day Patch Required)..."
                      className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 focus:border-[#00F0C0] text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Quick Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#051124] border border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">PROJECTS ACTIVE</span>
                      <span className="text-2xl font-bold font-mono text-[#00F0C0]">{content.projects.length}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#051124] border border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">VIRTUAL LABS</span>
                      <span className="text-2xl font-bold font-mono text-[#38BDF8]">{content.labs.length}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#051124] border border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">RESEARCH PAPERS</span>
                      <span className="text-2xl font-bold font-mono text-[#A855F7]">{content.researchArticles.length}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#051124] border border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">TECH TOOLS</span>
                      <span className="text-2xl font-bold font-mono text-emerald-400">{content.techTools.length}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Hero Section Module */}
              {activeTab === 'hero' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">HERO SECTION COPY & BRANDING</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Customize top title, brand tagline, hero motto, and metrics ticker.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">BRAND PREFIX (White)</label>
                        <input
                          type="text"
                          value={content.hero.brandPrefix}
                          onChange={(e) => updateHero({ brandPrefix: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">BRAND SUFFIX (Accent Cyan)</label>
                        <input
                          type="text"
                          value={content.hero.brandSuffix}
                          onChange={(e) => updateHero({ brandSuffix: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">TOP CATEGORY CHIP TEXT</label>
                      <input
                        type="text"
                        value={content.hero.badge}
                        onChange={(e) => updateHero({ badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">HERO MOTTO / SUBTITLE</label>
                      <input
                        type="text"
                        value={content.hero.motto}
                        onChange={(e) => updateHero({ motto: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">LEAD DESCRIPTION PARAGRAPH</label>
                      <textarea
                        rows={3}
                        value={content.hero.description}
                        onChange={(e) => updateHero({ description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Ecosystem Module */}
              {activeTab === 'ecosystem' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">ECOSYSTEM PILLARS</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Configure the 3 core pillars: Security, AI, and Automation.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">SECTION TITLE</label>
                      <input
                        type="text"
                        value={content.ecosystem.title}
                        onChange={(e) => updateEcosystem({ title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">SECTION DESCRIPTION</label>
                      <textarea
                        rows={2}
                        value={content.ecosystem.description}
                        onChange={(e) => updateEcosystem({ description: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Projects Manager Module (CRUD) */}
              {activeTab === 'projects' && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-base font-bold text-white mb-1">FEATURED PROJECTS MANAGER</h3>
                      <p className="text-xs font-mono text-slate-400">
                        Create, modify, or retire engineering projects and live repo links.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingProject(true);
                        setEditingProject({
                          id: `proj-${Date.now()}`,
                          slug: `new-project-${Date.now().toString().slice(-4)}`,
                          title: 'New Security Project',
                          subtitle: 'Innovative Defense Tooling',
                          description: 'Description of the newly created cyber project.',
                          accent: 'cyan',
                          tags: ['Security', 'OpenSource'],
                          github_url: 'https://github.com/nishchaygaur',
                          featured: true,
                          status: 'active',
                          category: 'Auditing',
                        });
                        cyberSound.playClick();
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] text-black font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {/* Inline Project Add/Edit Form */}
                  {editingProject && (
                    <div className="p-5 rounded-xl bg-[#07162C] border border-[#00F0C0]/50 space-y-4 font-mono text-xs shadow-xl animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="font-bold text-white">
                          {isAddingProject ? 'ADD NEW PROJECT' : `EDIT: ${editingProject.title}`}
                        </span>
                        <button
                          onClick={() => {
                            setEditingProject(null);
                            setIsAddingProject(false);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">PROJECT TITLE</label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">CATEGORY</label>
                          <select
                            value={editingProject.category}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          >
                            <option value="Auditing">Auditing</option>
                            <option value="Attack Simulation">Attack Simulation</option>
                            <option value="Malware Analysis">Malware Analysis</option>
                            <option value="SOC Platform">SOC Platform</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">GITHUB REPO URL</label>
                          <input
                            type="text"
                            value={editingProject.github_url || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">TAGS (Comma-separated)</label>
                          <input
                            type="text"
                            value={editingProject.tags.join(', ')}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setEditingProject(null);
                            setIsAddingProject(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (isAddingProject) {
                              addProject(editingProject);
                              triggerSaveNotification(`Added project "${editingProject.title}"`);
                            } else {
                              editProject(editingProject.id, editingProject);
                              triggerSaveNotification(`Updated project "${editingProject.title}"`);
                            }
                            setEditingProject(null);
                            setIsAddingProject(false);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#00F0C0] text-black font-bold text-xs"
                        >
                          Save Project
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Projects List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {content.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-[#051124] border border-white/10 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-white">{proj.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono">
                              {proj.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                            {proj.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {proj.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00F0C0]/10 text-[#00F0C0] border border-[#00F0C0]/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                          <span className="text-[10px] text-slate-500">{proj.slug}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProject(proj);
                                setIsAddingProject(false);
                                cyberSound.playClick();
                              }}
                              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete project "${proj.title}"?`)) {
                                  deleteProject(proj.id);
                                  triggerSaveNotification(`Deleted project "${proj.title}"`);
                                }
                              }}
                              className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Virtual Labs Manager (CRUD) */}
              {activeTab === 'labs' && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-base font-bold text-white mb-1">VIRTUAL LABS TESTBEDS</h3>
                      <p className="text-xs font-mono text-slate-400">
                        Configure hands-on attack scenarios, difficulty levels, and simulated forensic logs.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingLab(true);
                        setEditingLab({
                          id: `lab-${Date.now()}`,
                          slug: `lab-${Date.now().toString().slice(-4)}`,
                          name: 'New Defense Scenario',
                          description: 'Interactive sandbox emulation scenario.',
                          fullOverview: 'Detailed tactical breakdown of the exercise.',
                          category: 'Attack Simulation',
                          difficulty: 'Intermediate',
                          status: 'available',
                          attackVectors: ['Buffer Overflow', 'Privilege Escalation'],
                          defenseTechniques: ['Memory ASLR', 'Auditd Tracking'],
                          simulatedLogs: ['[LOG] Simulation ready.'],
                          accent: '#00F0C0',
                          displayOrder: content.labs.length + 1,
                        });
                        cyberSound.playClick();
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-black font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Lab</span>
                    </button>
                  </div>

                  {/* Labs List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {content.labs.map((lab) => (
                      <div
                        key={lab.id}
                        className="p-4 rounded-xl bg-[#051124] border border-white/10 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-white">{lab.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono">
                              {lab.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                            {lab.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                          <span className="text-[10px] text-slate-500">{lab.category}</span>
                          <button
                            onClick={() => {
                              if (confirm(`Delete lab "${lab.name}"?`)) {
                                deleteLab(lab.id);
                                triggerSaveNotification(`Deleted lab "${lab.name}"`);
                              }
                            }}
                            className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                            title="Delete Lab"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Research Articles Module */}
              {activeTab === 'research' && (
                <div className="space-y-6 max-w-5xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">RESEARCH VECTORS & ARTICLES</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Manage MITRE ATT&CK research papers and whitepapers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {content.researchArticles.map((art) => (
                      <div
                        key={art.id}
                        className="p-4 rounded-xl bg-[#051124] border border-white/10 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-white">{art.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-mono">
                              {art.readTime}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                            {art.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                          <span className="text-[10px] text-slate-500">{art.category}</span>
                          <button
                            onClick={() => {
                              if (confirm(`Delete article "${art.title}"?`)) {
                                deleteArticle(art.id);
                                triggerSaveNotification(`Deleted article "${art.title}"`);
                              }
                            }}
                            className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Tech Stack Tools Module */}
              {activeTab === 'tools' && (
                <div className="space-y-6 max-w-5xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">TECH STACK TOOLS</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Edit frameworks, database engines, and detection agents shown in the interactive tool matrix.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {content.techTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="p-4 rounded-xl bg-[#051124] border border-white/10 space-y-2 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tool.accentColor }} />
                            {tool.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                          {tool.defenseRole}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Contact & Socials Module */}
              {activeTab === 'contact' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">COMMS & TRANSMISSION COORDINATES</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Configure recipient email, n8n webhook portal, and social links.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4 font-mono text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">CONTACT EMAIL (DISPATCH TARGET)</label>
                      <input
                        type="email"
                        value={content.contact.email}
                        onChange={(e) => updateContact({ email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">n8n ACCESS PORTAL URL</label>
                      <input
                        type="url"
                        value={content.contact.n8nUrl}
                        onChange={(e) => updateContact({ n8nUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">GITHUB PROFILE / ORG URL</label>
                        <input
                          type="url"
                          value={content.contact.githubUrl}
                          onChange={(e) => updateContact({ githubUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">LINKEDIN URL</label>
                        <input
                          type="url"
                          value={content.contact.linkedinUrl}
                          onChange={(e) => updateContact({ linkedinUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">PGP KEY FINGERPRINT</label>
                      <input
                        type="text"
                        value={content.contact.pgpKey}
                        onChange={(e) => updateContact({ pgpKey: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. Backup & Restore Module */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">BACKUP, RESTORE & FACTORY RESET</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Export full CMS configuration to JSON, restore from backup, or reset to original code defaults.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Export */}
                    <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-3">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-[#00F0C0]" /> Export Content Backup
                      </span>
                      <p className="text-xs font-mono text-slate-400">
                        Download a complete JSON snapshot containing all hero copy, projects, labs, and tools.
                      </p>
                      <button
                        onClick={handleExport}
                        className="w-full py-2 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] text-black font-mono text-xs font-bold transition-all cursor-pointer"
                      >
                        Download .json Backup
                      </button>
                    </div>

                    {/* Reset to defaults */}
                    <div className="p-5 rounded-xl bg-[#051124] border border-rose-500/30 space-y-3">
                      <span className="font-mono text-xs font-bold text-rose-400 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Reset Factory Defaults
                      </span>
                      <p className="text-xs font-mono text-slate-400">
                        Clear local browser modifications and revert the entire site back to pristine codebase defaults.
                      </p>
                      <button
                        onClick={handleReset}
                        className="w-full py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-all cursor-pointer"
                      >
                        Revert All to Defaults
                      </button>
                    </div>
                  </div>

                  {/* Import JSON */}
                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-3 font-mono text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#38BDF8]" /> Import Content from JSON
                    </span>
                    <textarea
                      rows={5}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder="Paste exported JSON content here to restore..."
                      className="w-full p-3 rounded-lg bg-[#07172C] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#38BDF8]"
                    />
                    <button
                      onClick={handleImport}
                      disabled={!importJsonText.trim()}
                      className="px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] disabled:opacity-50 text-black font-bold transition-all cursor-pointer"
                    >
                      Apply & Restore JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#050E1C] border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0C0] shadow-[0_0_6px_#00F0C0]" />
            <span>STORAGE: LocalStorage CMS Active</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Passkey: <span className="text-white">cyberforage-sec-2026</span></span>
            <span>Version: <span className="text-[#00F0C0]">3.0-SEC</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
