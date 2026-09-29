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
  EyeOff,
  LogOut,
  Terminal,
  Database,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { cyberSound } from '../../audio/cyberSoundEngine';
import { Project, Lab, ResearchArticle, TechTool } from '../../types';
import { GithubIcon, LinkedinIcon, TwitterIcon, DiscordIcon, TelegramIcon, MatrixIcon } from '../icons/BrandIcons';
import {
  authenticateAdmin,
  logoutAdmin,
  isSupabaseConfigured,
  AUTHORIZED_ADMIN_EMAIL,
} from '../../lib/supabase';

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
    isCloudSyncActive,
    syncToSupabase,
  } = useSiteContent();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cyberforage_admin_auth') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [authError, setAuthError] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);

  // Clear all credential fields whenever modal opens or closes
  React.useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setAuthError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  // Cloud Sync State
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string>('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'hero' | 'ecosystem' | 'projects' | 'labs' | 'research' | 'tools' | 'contact' | 'database' | 'backup'
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

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSec = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setAuthError(`Security Cooldown Active: Too many failed attempts. Please retry in ${remainingSec}s.`);
      cyberSound.playAlert();
      return;
    }

    if (!email.trim() || !password) {
      setAuthError('Please enter both administrator email and master password.');
      cyberSound.playAlert();
      return;
    }

    setIsAuthenticating(true);
    setAuthError('');

    try {
      const result = await authenticateAdmin(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cyberforage_admin_auth', 'true');
        // Instantly zero out credentials from memory & DOM (no caching)
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setFailedAttempts(0);
        setLockoutUntil(null);
        cyberSound.playClick();
        cyberSound.speak('Administrator verified. Central command online.');
      } else {
        // Clear password immediately on failed attempt
        setPassword('');
        const nextFails = failedAttempts + 1;
        setFailedAttempts(nextFails);
        if (nextFails >= 5) {
          setLockoutUntil(Date.now() + 30000);
          setAuthError('Security Alert: 5 failed attempts detected. System locked for 30 seconds.');
        } else {
          setAuthError(result.error || 'Access Denied: Invalid administrator credentials.');
        }
        cyberSound.playAlert();
      }
    } catch (err: unknown) {
      setPassword('');
      const msg = err instanceof Error ? err.message : 'Authentication system error';
      setAuthError(msg);
      cyberSound.playAlert();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    sessionStorage.removeItem('cyberforage_admin_auth');
    sessionStorage.removeItem('cyberforage_admin_email');
    setEmail('');
    setPassword('');
    setAuthError('');
    setShowPassword(false);
    cyberSound.playClick();
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setAuthError('');
    setShowPassword(false);
    onClose();
  };

  const handleManualCloudSync = async () => {
    setIsSyncingCloud(true);
    setCloudSyncStatus('Synchronizing content with Supabase database...');
    try {
      const res = await syncToSupabase();
      if (res.success) {
        setCloudSyncStatus('Successfully synchronized with Supabase!');
        triggerSaveNotification('Cloud database updated.');
      } else {
        setCloudSyncStatus(`Sync error: ${res.error || 'Unknown error'}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sync with Supabase';
      setCloudSyncStatus(`Sync error: ${msg}`);
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => setCloudSyncStatus(''), 4000);
    }
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
                      ? isCloudSyncActive
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {isAuthenticated ? (isCloudSyncActive ? 'SUPABASE LIVE' : 'LOCAL ADMIN') : 'AUTH REQUIRED'}
                </span>
                {isAuthenticated && (
                  <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-mono text-[#00F0C0] bg-[#00F0C0]/10 border border-[#00F0C0]/30 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>SUPERADMIN</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Authenticated Admin Console: DEFCON Telemetry, Live Content Management & Supabase Sync
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
                onClick={handleManualCloudSync}
                disabled={isSyncingCloud}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#00F0C0]/15 hover:bg-[#00F0C0]/25 text-[#00F0C0] border border-[#00F0C0]/40 text-xs font-mono transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,192,0.2)] disabled:opacity-50"
                title="Save all changes directly to Supabase cloud database"
              >
                {isSyncingCloud ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Save to Database</span>
                  </>
                )}
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                title="Log out of Admin Session"
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
              onClick={handleClose}
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
                  CENTRAL COMMAND // MASTER ADMIN GATE
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Strict Access Control: Only authorized security administrator may authenticate.
                </p>
              </div>

              <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    ADMINISTRATOR EMAIL
                  </label>
                  <input
                    type="email"
                    name="cyber_admin_identity"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 focus:border-[#00F0C0] text-sm font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono text-slate-300 block">
                      SECURITY MASTER KEY
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] font-mono text-[#00F0C0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="cyber_admin_pass"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 focus:border-[#00F0C0] text-sm font-mono text-white focus:outline-none pr-10"
                    />
                    <div className="absolute right-3 top-2.5 text-slate-400">
                      <Key className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAuthenticating || Boolean(lockoutUntil && Date.now() < lockoutUntil)}
                    className="w-full py-2.5 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] disabled:opacity-50 disabled:cursor-not-allowed text-[#030914] font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,192,0.3)] hover:shadow-[0_0_30px_rgba(0,240,192,0.5)] flex items-center justify-center gap-2"
                  >
                    {isAuthenticating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Authenticate Session</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3 h-3 text-[#00F0C0]" /> Security Clearance:
                </span>
                <span className="text-[#00F0C0] font-semibold">Strict Single-Admin Access</span>
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
                { id: 'database', label: 'Database & Cloud Sync', icon: Database, count: undefined },
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
                          demo_url: 'https://demo.cyberforage.space',
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
                          <label className="text-[10px] text-[#00E5BE] font-bold block mb-1 flex items-center gap-1.5">
                            <ExternalLink className="w-3 h-3 text-[#00F0C0]" />
                            <span>LIVE DEMO URL</span>
                          </label>
                          <input
                            type="text"
                            placeholder="https://demo.cyberforage.space"
                            value={editingProject.demo_url || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">GITHUB REPO URL</label>
                          <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={editingProject.github_url || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                          />
                        </div>
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
                            {(proj.tags || []).map((tag) => (
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
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">{proj.slug}</span>
                            {proj.demo_url && (
                              <a
                                href={proj.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-[#00E5BE] hover:underline px-1.5 py-0.5 rounded bg-[#00F0C0]/10 border border-[#00F0C0]/25"
                                title="Open Live Demo URL"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span>Live Demo</span>
                              </a>
                            )}
                          </div>
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

                  {/* Inline Lab Add/Edit Form */}
                  {editingLab && (
                    <div className="p-5 rounded-xl bg-[#07162C] border border-[#38BDF8]/50 space-y-4 font-mono text-xs shadow-xl animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="font-bold text-white">
                          {isAddingLab ? 'ADD VIRTUAL LAB TESTBED' : `EDIT: ${editingLab.name}`}
                        </span>
                        <button
                          onClick={() => {
                            setEditingLab(null);
                            setIsAddingLab(false);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">LAB NAME</label>
                          <input
                            type="text"
                            value={editingLab.name}
                            onChange={(e) => setEditingLab({ ...editingLab, name: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none focus:border-[#38BDF8]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">SLUG IDENTIFIER</label>
                          <input
                            type="text"
                            value={editingLab.slug}
                            onChange={(e) => setEditingLab({ ...editingLab, slug: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none focus:border-[#38BDF8]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">CATEGORY</label>
                          <select
                            value={editingLab.category}
                            onChange={(e) => setEditingLab({ ...editingLab, category: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          >
                            <option value="Attack Simulation">Attack Simulation</option>
                            <option value="SOC">SOC</option>
                            <option value="Forensics">Forensics</option>
                            <option value="Analysis">Analysis</option>
                            <option value="Networking">Networking</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">DIFFICULTY</label>
                          <select
                            value={editingLab.difficulty}
                            onChange={(e) => setEditingLab({ ...editingLab, difficulty: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">STATUS</label>
                          <select
                            value={editingLab.status}
                            onChange={(e) => setEditingLab({ ...editingLab, status: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          >
                            <option value="available">available</option>
                            <option value="in_testing">in_testing</option>
                            <option value="planned">planned</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">BRIEF DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={editingLab.description}
                          onChange={(e) => setEditingLab({ ...editingLab, description: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">FULL TACTICAL OVERVIEW</label>
                        <textarea
                          rows={3}
                          value={editingLab.fullOverview}
                          onChange={(e) => setEditingLab({ ...editingLab, fullOverview: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">ATTACK VECTORS (Comma-separated)</label>
                          <input
                            type="text"
                            value={editingLab.attackVectors.join(', ')}
                            onChange={(e) =>
                              setEditingLab({
                                ...editingLab,
                                attackVectors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">DEFENSE TECHNIQUES (Comma-separated)</label>
                          <input
                            type="text"
                            value={editingLab.defenseTechniques.join(', ')}
                            onChange={(e) =>
                              setEditingLab({
                                ...editingLab,
                                defenseTechniques: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">SIMULATED LOG LINES (One per line)</label>
                        <textarea
                          rows={3}
                          value={editingLab.simulatedLogs.join('\n')}
                          onChange={(e) =>
                            setEditingLab({
                              ...editingLab,
                              simulatedLogs: e.target.value.split('\n').filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setEditingLab(null);
                            setIsAddingLab(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (isAddingLab) {
                              addLab(editingLab);
                              triggerSaveNotification(`Added lab "${editingLab.name}"`);
                            } else {
                              editLab(editingLab.id, editingLab);
                              triggerSaveNotification(`Updated lab "${editingLab.name}"`);
                            }
                            setEditingLab(null);
                            setIsAddingLab(false);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#38BDF8] text-black font-bold text-xs"
                        >
                          Save Lab
                        </button>
                      </div>
                    </div>
                  )}

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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingLab(lab);
                                setIsAddingLab(false);
                                cyberSound.playClick();
                              }}
                              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                              title="Edit Lab"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Research Articles Module */}
              {activeTab === 'research' && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-base font-bold text-white mb-1">RESEARCH PAPERS & ARTICLES</h3>
                      <p className="text-xs font-mono text-slate-400">
                        Publish, edit, or retire offensive/defensive research whitepapers and MITRE ATT&CK breakdowns.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingArticle(true);
                        setEditingArticle({
                          id: `art-${Date.now()}`,
                          title: 'New Research Paper',
                          category: 'Threat Intelligence',
                          date: 'OCT 2026',
                          readTime: '8 min read',
                          summary: 'Executive briefing analyzing emerging threat vectors and defense postures.',
                          content: [
                            'Detailed technical analysis of the threat scenario and observed behaviors.',
                            'Tactical countermeasures, telemetry signatures, and audit recommendations.',
                          ],
                          keyTakeaways: [
                            'Comprehensive detection coverage across initial access vectors.',
                            'Continuous telemetry auditing and automated containment playbook integration.',
                          ],
                          threatIndicators: [
                            'SHA256: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
                            'IP: 198.51.100.42:8443',
                          ],
                        });
                        cyberSound.playClick();
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#A855F7] hover:bg-[#9333EA] text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Research Paper</span>
                    </button>
                  </div>

                  {/* Inline Article Add/Edit Form */}
                  {editingArticle && (
                    <div className="p-5 rounded-xl bg-[#07162C] border border-[#A855F7]/50 space-y-4 font-mono text-xs shadow-xl animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="font-bold text-white">
                          {isAddingArticle ? 'PUBLISH NEW RESEARCH PAPER' : `EDIT: ${editingArticle.title}`}
                        </span>
                        <button
                          onClick={() => {
                            setEditingArticle(null);
                            setIsAddingArticle(false);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-slate-400 block mb-1">PAPER TITLE</label>
                          <input
                            type="text"
                            value={editingArticle.title}
                            onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none focus:border-[#A855F7]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">CATEGORY</label>
                          <input
                            type="text"
                            value={editingArticle.category}
                            onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                            placeholder="e.g. Adversary Simulation"
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none focus:border-[#A855F7]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">PUBLICATION DATE (e.g. OCT 2026)</label>
                          <input
                            type="text"
                            value={editingArticle.date}
                            onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">READ TIME (e.g. 8 min read)</label>
                          <input
                            type="text"
                            value={editingArticle.readTime}
                            onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">EXECUTIVE SUMMARY</label>
                        <textarea
                          rows={2}
                          value={editingArticle.summary}
                          onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">
                          FULL ARTICLE CONTENT (Paragraphs separated by double newlines)
                        </label>
                        <textarea
                          rows={4}
                          value={editingArticle.content.join('\n\n')}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              content: e.target.value.split('\n\n').filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none font-mono text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">
                            KEY TAKEAWAYS (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={editingArticle.keyTakeaways.join('\n')}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                keyTakeaways: e.target.value.split('\n').filter(Boolean),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">
                            THREAT INDICATORS / IOCs (Optional, one per line)
                          </label>
                          <textarea
                            rows={3}
                            value={(editingArticle.threatIndicators || []).join('\n')}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                threatIndicators: e.target.value.split('\n').filter(Boolean),
                              })
                            }
                            placeholder="SHA256: ...&#10;IP: ..."
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none font-mono text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setEditingArticle(null);
                            setIsAddingArticle(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (isAddingArticle) {
                              addArticle(editingArticle);
                              triggerSaveNotification(`Published paper "${editingArticle.title}"`);
                            } else {
                              editArticle(editingArticle.id, editingArticle);
                              triggerSaveNotification(`Updated paper "${editingArticle.title}"`);
                            }
                            setEditingArticle(null);
                            setIsAddingArticle(false);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#A855F7] text-white font-bold text-xs"
                        >
                          Save Research Paper
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Research Articles List */}
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingArticle(art);
                                setIsAddingArticle(false);
                                cyberSound.playClick();
                              }}
                              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                              title="Edit Article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Tech Stack Tools Module */}
              {activeTab === 'tools' && (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono text-base font-bold text-white mb-1">TECH STACK & DETECTION MATRIX</h3>
                      <p className="text-xs font-mono text-slate-400">
                        Edit frameworks, telemetry engines, and detection agents rendered in the interactive 3D tool matrix.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingTool(true);
                        setEditingTool({
                          id: `tool-${Date.now()}`,
                          name: 'New Tool / Agent',
                          category: 'Detection',
                          description: 'High-throughput telemetry analysis engine for live cluster defense.',
                          defenseRole: 'Adversary behavior tracking and real-time telemetry streaming.',
                          icon: 'terminal',
                          accentColor: '#00F0C0',
                        });
                        cyberSound.playClick();
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] text-black font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Tool</span>
                    </button>
                  </div>

                  {/* Inline Tool Add/Edit Form */}
                  {editingTool && (
                    <div className="p-5 rounded-xl bg-[#07162C] border border-[#00F0C0]/50 space-y-4 font-mono text-xs shadow-xl animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: editingTool.accentColor }}
                          />
                          {isAddingTool ? 'ADD NEW TOOL TO STACK' : `EDIT TOOL: ${editingTool.name}`}
                        </span>
                        <button
                          onClick={() => {
                            setEditingTool(null);
                            setIsAddingTool(false);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">TOOL / SYSTEM NAME</label>
                          <input
                            type="text"
                            value={editingTool.name}
                            onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">CATEGORY</label>
                          <select
                            value={editingTool.category}
                            onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          >
                            <option value="Core">Core</option>
                            <option value="Systems">Systems</option>
                            <option value="Database">Database</option>
                            <option value="Container">Container</option>
                            <option value="VCS">VCS</option>
                            <option value="Detection">Detection</option>
                            <option value="Framework">Framework</option>
                            <option value="Standards">Standards</option>
                            <option value="Infra">Infra</option>
                            <option value="Intelligence">Intelligence</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">ICON IDENTIFIER</label>
                          <select
                            value={editingTool.icon}
                            onChange={(e) => setEditingTool({ ...editingTool, icon: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                          >
                            <option value="terminal">terminal (Terminal)</option>
                            <option value="cpu">cpu (CPU)</option>
                            <option value="database">database (Database)</option>
                            <option value="box">box (Container / Box)</option>
                            <option value="git-branch">git-branch (VCS)</option>
                            <option value="shield-alert">shield-alert (Shield)</option>
                            <option value="target">target (Target)</option>
                            <option value="file-text">file-text (File)</option>
                            <option value="cloud">cloud (Cloud)</option>
                            <option value="brain">brain (AI / Brain)</option>
                            <option value="network">network (Network)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">ACCENT COLOR (HEX)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={editingTool.accentColor.startsWith('#') ? editingTool.accentColor : '#00F0C0'}
                              onChange={(e) => setEditingTool({ ...editingTool, accentColor: e.target.value })}
                              className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                            />
                            <input
                              type="text"
                              value={editingTool.accentColor}
                              onChange={(e) => setEditingTool({ ...editingTool, accentColor: e.target.value })}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none font-mono"
                            />
                            <div className="flex items-center gap-1">
                              {['#00F0C0', '#38BDF8', '#A855F7', '#F43F5E', '#FBBF24', '#10B981'].map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => setEditingTool({ ...editingTool, accentColor: c })}
                                  className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform"
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">TACTICAL DEFENSE ROLE</label>
                        <textarea
                          rows={2}
                          value={editingTool.defenseRole}
                          onChange={(e) => setEditingTool({ ...editingTool, defenseRole: e.target.value })}
                          placeholder="e.g. Adversary emulation scripts, network socket monitors, and telemetry analysis."
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">TOOL DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={editingTool.description}
                          onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                          placeholder="General summary of the tool or engine."
                          className="w-full px-3 py-1.5 rounded-lg bg-[#030A14] border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setEditingTool(null);
                            setIsAddingTool(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (isAddingTool) {
                              addTool(editingTool);
                              triggerSaveNotification(`Added tool "${editingTool.name}"`);
                            } else {
                              editTool(editingTool.id, editingTool);
                              triggerSaveNotification(`Updated tool "${editingTool.name}"`);
                            }
                            setEditingTool(null);
                            setIsAddingTool(false);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#00F0C0] text-black font-bold text-xs"
                        >
                          Save Tool
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tech Tools List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {content.techTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="p-4 rounded-xl bg-[#051124] border border-white/10 flex flex-col justify-between font-mono text-xs group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shadow-[0_0_6px]"
                                style={{ backgroundColor: tool.accentColor, color: tool.accentColor }}
                              />
                              {tool.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                              {tool.category}
                            </span>
                          </div>

                          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                            {tool.defenseRole}
                          </p>

                          <div className="text-[10px] text-slate-500 font-mono">
                            Icon: <span className="text-slate-400">{tool.icon}</span>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="text-[10px] font-mono" style={{ color: tool.accentColor }}>
                            {tool.accentColor}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingTool(tool);
                                setIsAddingTool(false);
                                cyberSound.playClick();
                              }}
                              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                              title="Edit Tool"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete tool "${tool.name}" from stack?`)) {
                                  deleteTool(tool.id);
                                  triggerSaveNotification(`Deleted tool "${tool.name}"`);
                                }
                              }}
                              className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                              title="Delete Tool"
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

              {/* 8. Contact & Socials Module */}
              {activeTab === 'contact' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">COMMS & TRANSMISSION COORDINATES</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Configure recipient email, n8n webhook portal, social channels, and cryptographic identity keys.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-5 font-mono text-xs">
                    {/* Email and n8n */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-slate-400 block">CONTACT EMAIL (DISPATCH TARGET)</label>
                          {content.contact.email && (
                            <a
                              href={`mailto:${content.contact.email}`}
                              className="text-[10px] text-[#00E5BE] hover:underline inline-flex items-center gap-1"
                              title="Test mailto"
                            >
                              <span>Test Mail</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <input
                          type="email"
                          value={content.contact.email}
                          onChange={(e) => updateContact({ email: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-slate-400 block">n8n ACCESS PORTAL URL</label>
                          {content.contact.n8nUrl && (
                            <a
                              href={content.contact.n8nUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                              title="Open Portal"
                            >
                              <span>Open URL</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <input
                          type="url"
                          value={content.contact.n8nUrl}
                          onChange={(e) => updateContact({ n8nUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#07172C] border border-white/10 text-white focus:outline-none focus:border-[#00F0C0]"
                        />
                      </div>
                    </div>

                    {/* Extended Social Channels with Frontend Visibility Toggles */}
                    {(() => {
                      const socialsVisible = {
                        github: true,
                        linkedin: true,
                        twitter: true,
                        discord: true,
                        telegram: true,
                        matrix: true,
                        ...(content.contact.socialsVisible || {}),
                      };

                      const toggleSocial = (key: 'github' | 'linkedin' | 'twitter' | 'discord' | 'telegram' | 'matrix') => {
                        const current = socialsVisible[key] !== false;
                        const next = !current;
                        updateContact({
                          socialsVisible: {
                            ...socialsVisible,
                            [key]: next,
                          },
                        });
                        cyberSound.playClick();
                        triggerSaveNotification(
                          `${key.toUpperCase()} link ${next ? 'enabled (shown on frontend)' : 'disabled (hidden from frontend)'}`
                        );
                      };

                      const setAllSocials = (visible: boolean) => {
                        updateContact({
                          socialsVisible: {
                            github: visible,
                            linkedin: visible,
                            twitter: visible,
                            discord: visible,
                            telegram: visible,
                            matrix: visible,
                          },
                        });
                        cyberSound.playClick();
                        triggerSaveNotification(
                          visible ? 'All social links enabled on frontend' : 'All social links hidden from frontend'
                        );
                      };

                      const activeCount = Object.values(socialsVisible).filter(Boolean).length;

                      return (
                        <div className="space-y-4 pt-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#030B18] border border-white/10">
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-[#00F0C0]" />
                                <span>PUBLIC SOCIAL CHANNELS &amp; FRONTEND VISIBILITY</span>
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Toggle channels ON / OFF. When turned off, they will not be shown on the frontend (Contact card &amp; Footer).
                              </p>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                  activeCount > 0
                                    ? 'bg-[#00F0C0]/10 text-[#00F0C0] border-[#00F0C0]/30'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {activeCount}/6 VISIBLE
                              </span>
                              <button
                                type="button"
                                onClick={() => setAllSocials(true)}
                                className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#00F0C0]/10 hover:bg-[#00F0C0]/20 text-[#00F0C0] border border-[#00F0C0]/30 transition-all cursor-pointer"
                                title="Show all social links on frontend"
                              >
                                Enable All
                              </button>
                              <button
                                type="button"
                                onClick={() => setAllSocials(false)}
                                className="text-[10px] font-mono px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                                title="Hide all social links from frontend"
                              >
                                Disable All
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* GitHub */}
                            <div className={`p-3 rounded-xl border transition-all ${socialsVisible.github ? 'bg-[#07172C]/70 border-white/10' : 'bg-[#050C17]/40 border-rose-500/20'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                  <GithubIcon className="w-3.5 h-3.5 text-white" />
                                  <span>GITHUB URL</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  {content.contact.githubUrl && (
                                    <a
                                      href={content.contact.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#00E5BE] hover:underline inline-flex items-center gap-1"
                                      title="Open link in new tab"
                                    >
                                      <span>Visit</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={socialsVisible.github}
                                    onClick={() => toggleSocial('github')}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer select-none ${
                                      socialsVisible.github
                                        ? 'bg-[#00F0C0]/20 text-[#00F0C0] border-[#00F0C0]/60 shadow-[0_0_8px_rgba(0,240,192,0.25)] hover:bg-[#00F0C0]/30'
                                        : 'bg-rose-950/40 text-rose-400 border-rose-500/40 hover:bg-rose-900/40'
                                    }`}
                                    title={socialsVisible.github ? 'Click to hide GitHub from frontend' : 'Click to show GitHub on frontend'}
                                  >
                                    {socialsVisible.github ? <Eye className="w-3 h-3 text-[#00F0C0]" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                                    <span>{socialsVisible.github ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="url"
                                value={content.contact.githubUrl}
                                onChange={(e) => updateContact({ githubUrl: e.target.value })}
                                placeholder="https://github.com/..."
                                className={`w-full px-3 py-2 rounded-lg bg-[#040A14] border text-white focus:outline-none transition-all ${
                                  socialsVisible.github ? 'border-white/10 focus:border-[#00F0C0]' : 'border-rose-500/20 text-slate-400'
                                }`}
                              />
                              {!socialsVisible.github && (
                                <p className="text-[9px] font-mono text-rose-400/80 mt-1.5 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  <span>Turned OFF: Hidden from frontend contact section &amp; footer.</span>
                                </p>
                              )}
                            </div>

                            {/* LinkedIn */}
                            <div className={`p-3 rounded-xl border transition-all ${socialsVisible.linkedin ? 'bg-[#07172C]/70 border-white/10' : 'bg-[#050C17]/40 border-rose-500/20'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                  <LinkedinIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                                  <span>LINKEDIN URL</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  {content.contact.linkedinUrl && (
                                    <a
                                      href={content.contact.linkedinUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                                      title="Open link in new tab"
                                    >
                                      <span>Visit</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={socialsVisible.linkedin}
                                    onClick={() => toggleSocial('linkedin')}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer select-none ${
                                      socialsVisible.linkedin
                                        ? 'bg-[#00F0C0]/20 text-[#00F0C0] border-[#00F0C0]/60 shadow-[0_0_8px_rgba(0,240,192,0.25)] hover:bg-[#00F0C0]/30'
                                        : 'bg-rose-950/40 text-rose-400 border-rose-500/40 hover:bg-rose-900/40'
                                    }`}
                                    title={socialsVisible.linkedin ? 'Click to hide LinkedIn from frontend' : 'Click to show LinkedIn on frontend'}
                                  >
                                    {socialsVisible.linkedin ? <Eye className="w-3 h-3 text-[#00F0C0]" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                                    <span>{socialsVisible.linkedin ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="url"
                                value={content.contact.linkedinUrl}
                                onChange={(e) => updateContact({ linkedinUrl: e.target.value })}
                                placeholder="https://linkedin.com/in/..."
                                className={`w-full px-3 py-2 rounded-lg bg-[#040A14] border text-white focus:outline-none transition-all ${
                                  socialsVisible.linkedin ? 'border-white/10 focus:border-[#00F0C0]' : 'border-rose-500/20 text-slate-400'
                                }`}
                              />
                              {!socialsVisible.linkedin && (
                                <p className="text-[9px] font-mono text-rose-400/80 mt-1.5 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  <span>Turned OFF: Hidden from frontend contact section &amp; footer.</span>
                                </p>
                              )}
                            </div>

                            {/* Twitter / X */}
                            <div className={`p-3 rounded-xl border transition-all ${socialsVisible.twitter ? 'bg-[#07172C]/70 border-white/10' : 'bg-[#050C17]/40 border-rose-500/20'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                  <TwitterIcon className="w-3.5 h-3.5 text-white" />
                                  <span>TWITTER / X URL</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  {content.contact.twitterUrl && (
                                    <a
                                      href={content.contact.twitterUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#00E5BE] hover:underline inline-flex items-center gap-1"
                                      title="Open link in new tab"
                                    >
                                      <span>Visit</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={socialsVisible.twitter}
                                    onClick={() => toggleSocial('twitter')}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer select-none ${
                                      socialsVisible.twitter
                                        ? 'bg-[#00F0C0]/20 text-[#00F0C0] border-[#00F0C0]/60 shadow-[0_0_8px_rgba(0,240,192,0.25)] hover:bg-[#00F0C0]/30'
                                        : 'bg-rose-950/40 text-rose-400 border-rose-500/40 hover:bg-rose-900/40'
                                    }`}
                                    title={socialsVisible.twitter ? 'Click to hide Twitter/X from frontend' : 'Click to show Twitter/X on frontend'}
                                  >
                                    {socialsVisible.twitter ? <Eye className="w-3 h-3 text-[#00F0C0]" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                                    <span>{socialsVisible.twitter ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="url"
                                value={content.contact.twitterUrl || ''}
                                onChange={(e) => updateContact({ twitterUrl: e.target.value })}
                                placeholder="https://twitter.com/..."
                                className={`w-full px-3 py-2 rounded-lg bg-[#040A14] border text-white focus:outline-none transition-all ${
                                  socialsVisible.twitter ? 'border-white/10 focus:border-[#00F0C0]' : 'border-rose-500/20 text-slate-400'
                                }`}
                              />
                              {!socialsVisible.twitter && (
                                <p className="text-[9px] font-mono text-rose-400/80 mt-1.5 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  <span>Turned OFF: Hidden from frontend contact section &amp; footer.</span>
                                </p>
                              )}
                            </div>

                            {/* Discord */}
                            <div className={`p-3 rounded-xl border transition-all ${socialsVisible.discord ? 'bg-[#07172C]/70 border-white/10' : 'bg-[#050C17]/40 border-rose-500/20'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                  <DiscordIcon className="w-3.5 h-3.5 text-[#818CF8]" />
                                  <span>DISCORD SERVER URL</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  {content.contact.discordUrl && (
                                    <a
                                      href={content.contact.discordUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#818CF8] hover:underline inline-flex items-center gap-1"
                                      title="Open link in new tab"
                                    >
                                      <span>Visit</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={socialsVisible.discord}
                                    onClick={() => toggleSocial('discord')}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer select-none ${
                                      socialsVisible.discord
                                        ? 'bg-[#00F0C0]/20 text-[#00F0C0] border-[#00F0C0]/60 shadow-[0_0_8px_rgba(0,240,192,0.25)] hover:bg-[#00F0C0]/30'
                                        : 'bg-rose-950/40 text-rose-400 border-rose-500/40 hover:bg-rose-900/40'
                                    }`}
                                    title={socialsVisible.discord ? 'Click to hide Discord from frontend' : 'Click to show Discord on frontend'}
                                  >
                                    {socialsVisible.discord ? <Eye className="w-3 h-3 text-[#00F0C0]" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                                    <span>{socialsVisible.discord ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="url"
                                value={content.contact.discordUrl || ''}
                                onChange={(e) => updateContact({ discordUrl: e.target.value })}
                                placeholder="https://discord.gg/..."
                                className={`w-full px-3 py-2 rounded-lg bg-[#040A14] border text-white focus:outline-none transition-all ${
                                  socialsVisible.discord ? 'border-white/10 focus:border-[#00F0C0]' : 'border-rose-500/20 text-slate-400'
                                }`}
                              />
                              {!socialsVisible.discord && (
                                <p className="text-[9px] font-mono text-rose-400/80 mt-1.5 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  <span>Turned OFF: Hidden from frontend contact section &amp; footer.</span>
                                </p>
                              )}
                            </div>

                            {/* Telegram */}
                            <div className={`p-3 rounded-xl border transition-all ${socialsVisible.telegram ? 'bg-[#07172C]/70 border-white/10' : 'bg-[#050C17]/40 border-rose-500/20'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                  <TelegramIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                                  <span>TELEGRAM CHANNEL URL</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  {content.contact.telegramUrl && (
                                    <a
                                      href={content.contact.telegramUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                                      title="Open link in new tab"
                                    >
                                      <span>Visit</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={socialsVisible.telegram}
                                    onClick={() => toggleSocial('telegram')}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer select-none ${
                                      socialsVisible.telegram
                                        ? 'bg-[#00F0C0]/20 text-[#00F0C0] border-[#00F0C0]/60 shadow-[0_0_8px_rgba(0,240,192,0.25)] hover:bg-[#00F0C0]/30'
                                        : 'bg-rose-950/40 text-rose-400 border-rose-500/40 hover:bg-rose-900/40'
                                    }`}
                                    title={socialsVisible.telegram ? 'Click to hide Telegram from frontend' : 'Click to show Telegram on frontend'}
                                  >
                                    {socialsVisible.telegram ? <Eye className="w-3 h-3 text-[#00F0C0]" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                                    <span>{socialsVisible.telegram ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="url"
                                value={content.contact.telegramUrl || ''}
                                onChange={(e) => updateContact({ telegramUrl: e.target.value })}
                                placeholder="https://t.me/..."
                                className={`w-full px-3 py-2 rounded-lg bg-[#040A14] border text-white focus:outline-none transition-all ${
                                  socialsVisible.telegram ? 'border-white/10 focus:border-[#00F0C0]' : 'border-rose-500/20 text-slate-400'
                                }`}
                              />
                              {!socialsVisible.telegram && (
                                <p className="text-[9px] font-mono text-rose-400/80 mt-1.5 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  <span>Turned OFF: Hidden from frontend contact section &amp; footer.</span>
                                </p>
                              )}
                            </div>

                            {/* Matrix */}
                            <div className={`p-3 rounded-xl border transition-all ${socialsVisible.matrix ? 'bg-[#07172C]/70 border-white/10' : 'bg-[#050C17]/40 border-rose-500/20'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                                  <MatrixIcon className="w-3.5 h-3.5 text-[#00F0C0]" />
                                  <span>MATRIX ROOM URL</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  {content.contact.matrixUrl && (
                                    <a
                                      href={content.contact.matrixUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#00E5BE] hover:underline inline-flex items-center gap-1"
                                      title="Open link in new tab"
                                    >
                                      <span>Visit</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={socialsVisible.matrix}
                                    onClick={() => toggleSocial('matrix')}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer select-none ${
                                      socialsVisible.matrix
                                        ? 'bg-[#00F0C0]/20 text-[#00F0C0] border-[#00F0C0]/60 shadow-[0_0_8px_rgba(0,240,192,0.25)] hover:bg-[#00F0C0]/30'
                                        : 'bg-rose-950/40 text-rose-400 border-rose-500/40 hover:bg-rose-900/40'
                                    }`}
                                    title={socialsVisible.matrix ? 'Click to hide Matrix from frontend' : 'Click to show Matrix on frontend'}
                                  >
                                    {socialsVisible.matrix ? <Eye className="w-3 h-3 text-[#00F0C0]" /> : <EyeOff className="w-3 h-3 text-rose-400" />}
                                    <span>{socialsVisible.matrix ? 'ON (VISIBLE)' : 'OFF (HIDDEN)'}</span>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="url"
                                value={content.contact.matrixUrl || ''}
                                onChange={(e) => updateContact({ matrixUrl: e.target.value })}
                                placeholder="https://matrix.to/#/..."
                                className={`w-full px-3 py-2 rounded-lg bg-[#040A14] border text-white focus:outline-none transition-all ${
                                  socialsVisible.matrix ? 'border-white/10 focus:border-[#00F0C0]' : 'border-rose-500/20 text-slate-400'
                                }`}
                              />
                              {!socialsVisible.matrix && (
                                <p className="text-[9px] font-mono text-rose-400/80 mt-1.5 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  <span>Turned OFF: Hidden from frontend contact section &amp; footer.</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Cryptographic PGP */}
                    <div className="pt-2 border-t border-white/[0.08]">
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

              {/* 9. Database & Cloud Sync Module */}
              {activeTab === 'database' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white mb-1">
                      SUPABASE CLOUD DATABASE &amp; LIVE SYNCHRONIZATION
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      Manage real-time PostgreSQL database synchronization, connection parameters, and security policies.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div className={`p-5 rounded-xl border space-y-3 font-mono text-xs ${
                    isCloudSyncActive
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isCloudSyncActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          <Database className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            {isCloudSyncActive ? 'SUPABASE CLOUD DATABASE ONLINE' : 'LOCAL CACHE MODE (AWAITING SUPABASE CONFIG)'}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {isCloudSyncActive
                              ? 'Live bidirectional sync enabled between frontend CMS and Supabase PostgreSQL.'
                              : 'Edits are currently preserved in browser storage. Connect Supabase to publish worldwide.'}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        isCloudSyncActive
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      }`}>
                        {isCloudSyncActive ? 'CONNECTED' : 'STANDBY'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">AUTHORIZED SUPERADMIN:</span>
                        <span className="text-[#00F0C0] font-semibold">Single Master Identity (Enforced)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">SUPABASE ENDPOINT:</span>
                        <span className="text-white font-mono truncate block">
                          {import.meta.env.VITE_SUPABASE_URL || 'Not specified in environment variables'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Cloud Sync Action */}
                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-[#00F0C0]" />
                          <span>Push Current CMS State to Supabase</span>
                        </h4>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          Commits the latest hero copy, projects, virtual labs, research articles, and contact settings to the database.
                        </p>
                      </div>

                      <button
                        onClick={handleManualCloudSync}
                        disabled={isSyncingCloud}
                        className="px-4 py-2.5 rounded-lg bg-[#00F0C0] hover:bg-[#00E5BE] disabled:opacity-50 text-black font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,192,0.2)]"
                      >
                        {isSyncingCloud ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Sync to Database Now</span>
                          </>
                        )}
                      </button>
                    </div>

                    {cloudSyncStatus && (
                      <div className="p-3 rounded-lg bg-[#07172C] border border-[#00F0C0]/30 text-xs font-mono text-[#00F0C0] animate-fadeIn flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{cloudSyncStatus}</span>
                      </div>
                    )}
                  </div>

                  {/* Environment Configuration Guide */}
                  <div className="p-5 rounded-xl bg-[#051124] border border-white/10 space-y-3 font-mono text-xs">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#38BDF8]" />
                      <span>Configuration Keys (Vercel &amp; Local .env)</span>
                    </h4>
                    <p className="text-slate-400">
                      To connect your Supabase database in production on Vercel, navigate to <strong>Project Settings &gt; Environment Variables</strong> and provide:
                    </p>

                    <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-2 text-[11px]">
                      <div>
                        <span className="text-[#38BDF8]">VITE_SUPABASE_URL</span> = <span className="text-slate-300">https://your-project.supabase.co</span>
                      </div>
                      <div>
                        <span className="text-[#38BDF8]">VITE_SUPABASE_ANON_KEY</span> = <span className="text-slate-300">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
                      </div>
                      <div>
                        <span className="text-[#38BDF8]">VITE_ADMIN_EMAIL</span> = <span className="text-slate-300">nishchay.gaur.official@gmail.com</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      A migration file is prepared at <code className="text-[#00F0C0]">supabase/migrations/008_admin_content_sync.sql</code>. Execute it in the Supabase SQL Editor to enforce strict RLS security for <code className="text-white">nishchay.gaur.official@gmail.com</code>.
                    </p>
                  </div>
                </div>
              )}

              {/* 10. Backup & Restore Module */}
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
            <span className={`w-2 h-2 rounded-full ${isCloudSyncActive ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]' : 'bg-cyan-400 shadow-[0_0_6px_#22D3EE]'}`} />
            <span>
              STORAGE: {isCloudSyncActive ? 'Supabase PostgreSQL + Edge Sync' : 'LocalStorage Cache (Awaiting Supabase)'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">
              Clearance: <span className="text-[#00F0C0] font-semibold">SUPERADMIN VERIFIED</span>
            </span>
            <span>Version: <span className="text-[#00F0C0]">3.0-SEC</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
