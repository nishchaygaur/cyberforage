import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/navbar/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { EcosystemSection } from './components/sections/EcosystemSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { LabsSection } from './components/sections/LabsSection';
import { ResearchSection } from './components/sections/ResearchSection';
import { TechStackSection } from './components/sections/TechStackSection';
import { TelemetryHUDSection } from './components/sections/TelemetryHUDSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/footer/Footer';
import { CyberTerminalModal } from './components/terminal/CyberTerminalModal';
import { LabSimulationModal } from './components/modals/LabSimulationModal';
import { SOCDefenderModal } from './components/ctf/SOCDefenderModal';
import { SentinelThreatScannerModal } from './components/ai/SentinelThreatScannerModal';
import { BinaryHexInspectorModal } from './components/inspector/BinaryHexInspectorModal';
import { ThreatIntelGraphModal } from './components/research/ThreatIntelGraphModal';
import { MatrixBreachOverlay } from './components/easteregg/MatrixBreachOverlay';
import { CyberAudioConsole } from './components/audio/CyberAudioConsole';
import { CyberScrollHUD } from './components/navigation/CyberScrollHUD';
import { LiveNmapModal } from './components/nmap/LiveNmapModal';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { SceneMode, Lab, SimulatedIncident } from './types';
import { cyberSound } from './audio/cyberSoundEngine';
import { Terminal, Volume2 } from 'lucide-react';

export function App() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('globe');
  const [activeSection, setActiveSection] = useState('home');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isNmapOpen, setIsNmapOpen] = useState(false);
  const [nmapTarget, setNmapTarget] = useState('192.168.1.1');
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [attackTrigger, setAttackTrigger] = useState(0);
  const [incident, setIncident] = useState<SimulatedIncident | null>(null);
  const incidentTimersRef = useRef<number[]>([]);

  // 9 High-Impact Feature Modals + Full CMS Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCtfOpen, setIsCtfOpen] = useState(false);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [sentinelCve, setSentinelCve] = useState<string>('CVE-2024-6387');
  const [isBinaryInspectorOpen, setIsBinaryInspectorOpen] = useState(false);
  const [selectedBinary, setSelectedBinary] = useState('libmalware_loader.elf');
  const [isThreatGraphOpen, setIsThreatGraphOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isAudioConsoleOpen, setIsAudioConsoleOpen] = useState(false);

  // Easter Egg tracking buffers (Matrix keywords and Konami code)
  const keyBufferRef = useRef('');
  const konamiIndexRef = useRef(0);
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Track AudioContext state for Chrome Web Audio Autoplay Policy Compliance
  const [audioState, setAudioState] = useState<string>(() => cyberSound.getAudioState());
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);

  // Auto-play / Tactical Welcome Sequence (strictly ONCE per page load)
  useEffect(() => {
    // 1. Subscribe to Web Audio state changes (detects 'running' when autoplay succeeds or unlocks)
    const unsubscribe = cyberSound.onStateChange((state) => {
      setAudioState(state);
      if (state === 'running') {
        setHasInteractedAudio(true);
      }
    });

    // 2. Trigger tactical welcome sequence on initial mount
    cyberSound.triggerWelcomeSequence().catch(() => {});

    // 3. Unlock Web Audio immediately on first qualifying user gesture (click, tap, keypress)
    const gestureEvents = ['click', 'pointerdown', 'keydown', 'touchstart'];
    const handleGesture = () => {
      cyberSound.unlockAudio();
      setHasInteractedAudio(true);
      gestureEvents.forEach((type) => {
        window.removeEventListener(type, handleGesture);
      });
    };

    gestureEvents.forEach((type) => {
      window.addEventListener(type, handleGesture, { passive: true, once: true });
    });

    return () => {
      unsubscribe();
      gestureEvents.forEach((type) => {
        window.removeEventListener(type, handleGesture);
      });
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Admin Panel hotkey (Ctrl+Shift+A or Alt+A)
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        cyberSound.playLaser();
        setIsAdminOpen((prev) => !prev);
        return;
      }

      // Tactical Terminal hotkeys
      if ((e.ctrlKey && e.key === 'k') || e.key === '`') {
        e.preventDefault();
        cyberSound.playClick();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsTerminalOpen(false);
        setIsAdminOpen(false);
        setSelectedLab(null);
        setIsCtfOpen(false);
        setIsAiScannerOpen(false);
        setIsBinaryInspectorOpen(false);
        setIsThreatGraphOpen(false);
        setIsMatrixOpen(false);
        setIsAudioConsoleOpen(false);
        setIsNmapOpen(false);
      }

      // Keyword Easter Egg Buffer ("matrix", "hack", "cyberforage")
      keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-15);
      if (
        keyBufferRef.current.includes('matrix') ||
        keyBufferRef.current.includes('hack') ||
        keyBufferRef.current.includes('cyberforage')
      ) {
        setIsMatrixOpen(true);
        keyBufferRef.current = '';
      }

      // Konami Code Tracker
      if (e.key === konamiSequence[konamiIndexRef.current]) {
        konamiIndexRef.current++;
        if (konamiIndexRef.current === konamiSequence.length) {
          setIsMatrixOpen(true);
          konamiIndexRef.current = 0;
        }
      } else {
        konamiIndexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Section Spy via IntersectionObserver for Smooth HUD and Navigation Sync
  useEffect(() => {
    const sectionIds = ['home', 'ecosystem', 'projects', 'labs', 'research', 'technologies', 'telemetry', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topVisible = visibleEntries[0].target.id;
          setActiveSection(topVisible);
        }
      },
      {
        rootMargin: '-15% 0px -35% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      if (window.scrollY < 120) {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Cleanup incident timers on unmount
  useEffect(() => {
    return () => {
      incidentTimersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Coordinated Automated Attack Simulation Lifecycle (Auto-stops and resets)
  const handleSimulateAttack = () => {
    incidentTimersRef.current.forEach((id) => clearTimeout(id));
    incidentTimersRef.current = [];

    setAttackTrigger((prev) => prev + 1);

    const targets = [
      { name: 'Tokyo Sentinel', ip: '192.0.2.77', vector: 'Zero-Day Heap Spray', technique: 'T1059.001' },
      { name: 'Frankfurt Core', ip: '198.51.100.12', vector: 'BGP Hijack & Exfil', technique: 'T1557.002' },
      { name: 'Ashburn Mesh', ip: '203.0.113.88', vector: 'Supply Chain Kernel Hook', technique: 'T1542.001' },
      { name: 'London Node', ip: '195.55.12.34', vector: 'Distributed AI Sybil Flood', technique: 'T1498.001' },
    ];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const incidentId = `CF-INC-${Math.floor(1000 + Math.random() * 9000)}`;

    setIncident({
      id: incidentId,
      stage: 'inbound',
      targetNode: target.name,
      targetIp: target.ip,
      vector: target.vector,
      technique: target.technique,
      severity: 'HIGH',
      message: `Hostile vector detected en route to ${target.name}. Calculating telemetry vectors...`,
      progress: 20,
      timestamp: new Date().toLocaleTimeString(),
    });

    const t1 = window.setTimeout(() => {
      setIncident((prev) =>
        prev
          ? {
              ...prev,
              stage: 'incident_generated',
              severity: 'CRITICAL',
              message: `Breach alert: ${prev.vector} payload active at ${prev.targetIp}. Initiating automated containment playbooks.`,
              progress: 55,
            }
          : null
      );
    }, 1800);

    const t2 = window.setTimeout(() => {
      setIncident((prev) =>
        prev
          ? {
              ...prev,
              stage: 'containing',
              severity: 'ELEVATED',
              message: `Zero-Trust microsegmentation engaged. Sandboxing compromised sockets and rolling crypto keys.`,
              progress: 85,
            }
          : null
      );
    }, 4000);

    const t3 = window.setTimeout(() => {
      setIncident((prev) =>
        prev
          ? {
              ...prev,
              stage: 'resolved',
              severity: 'NOMINAL',
              message: `Threat neutralized. Defense perimeter restored. Threat signatures compiled to SIEM.`,
              progress: 100,
            }
          : null
      );
    }, 6200);

    const t4 = window.setTimeout(() => {
      setIncident(null);
    }, 9000);

    incidentTimersRef.current = [t1, t2, t3, t4];
  };

  const handleDismissIncident = () => {
    incidentTimersRef.current.forEach((id) => clearTimeout(id));
    incidentTimersRef.current = [];
    setIncident(null);
  };

  const handleFocusBlade3D = (labId: string) => {
    setSceneMode('server');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    cyberSound.playLaser();
  };

  const handleFocusMesh3D = () => {
    setSceneMode('mesh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    cyberSound.playLaser();
  };

  const handleSectionNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#040812] text-white flex flex-col relative selection:bg-[#00F0C0]/20 selection:text-[#00F0C0]">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Top Header Navigation */}
      <Navbar
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenCtf={() => setIsCtfOpen(true)}
        onOpenAiScanner={() => setIsAiScannerOpen(true)}
        onOpenNmap={() => setIsNmapOpen(true)}
        onOpenAudioConsole={() => setIsAudioConsoleOpen((prev) => !prev)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
        onNavigate={handleSectionNavigate}
      />

      {/* Main Content Sections (Standard Vertical Scroll) */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section with 3D Cyber Defense Globe & Satellite Intercepts */}
        <HeroSection
          onOpenTerminal={() => setIsTerminalOpen(true)}
          sceneMode={sceneMode}
          onSceneModeChange={(mode) => setSceneMode(mode)}
          attackTrigger={attackTrigger}
          onSimulateAttack={handleSimulateAttack}
          incident={incident}
          onDismissIncident={handleDismissIncident}
          onOpenNmap={() => setIsNmapOpen(true)}
          onOpenAudioConsole={() => setIsAudioConsoleOpen(true)}
        />

        {/* The Cyberforage Ecosystem (Security, AI, Automation) */}
        <EcosystemSection />

        {/* Featured Projects with Binary Hex Inspector Integration */}
        <ProjectsSection
          onInspectBinary={(binName) => {
            setSelectedBinary(binName);
            setIsBinaryInspectorOpen(true);
          }}
        />

        {/* Cyberforage Labs (5 interactive simulation testbeds) */}
        <LabsSection
          onRunLabSimulation={(lab) => setSelectedLab(lab)}
          onFocusBlade3D={handleFocusBlade3D}
        />

        {/* Research Disciplines & MITRE ATT&CK Threat Intel Graph */}
        <ResearchSection onOpenThreatGraph={() => setIsThreatGraphOpen(true)} />

        {/* Tech Stack & Interconnected Security Mesh */}
        <TechStackSection onFocusMesh3D={handleFocusMesh3D} />

        {/* Real-Time Defense Telemetry HUD with Wireshark Live Packet Sniffer */}
        <TelemetryHUDSection
          onSimulateAttack={handleSimulateAttack}
          incident={incident}
        />

        {/* Open Source Channels & Encrypted Transmission Terminal */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleSectionNavigate} />

      {/* Tactical Floating Scroll-To-Top and Desktop Quick-Scroll Rail */}
      <CyberScrollHUD
        activeSection={activeSection}
        onSectionChange={handleSectionNavigate}
      />

      {/* Floating Tactical Terminal Button (Quick Launch) */}
      <button
        onClick={() => {
          cyberSound.playClick();
          setIsTerminalOpen(true);
        }}
        onMouseEnter={() => cyberSound.playBlip()}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#071322]/90 hover:bg-[#0c1f38] border border-[#00F0C0]/40 hover:border-[#00F0C0] text-[#00F0C0] font-mono text-xs font-semibold backdrop-blur-md shadow-[0_0_20px_rgba(0,240,192,0.25)] hover:shadow-[0_0_30px_rgba(0,240,192,0.45)] transition-all cursor-pointer group"
        title="Open Cyber Terminal Console (~ or Ctrl+K)"
      >
        <Terminal className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span className="hidden sm:inline">Tactical CLI</span>
        <span className="text-[10px] px-1 rounded bg-[#00F0C0]/15 border border-[#00F0C0]/30 hidden md:inline">
          ~
        </span>
      </button>



      {/* Interactive Cyber Terminal Console Modal */}
      <CyberTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onModeChange={(mode) => setSceneMode(mode)}
        onSimulateAttack={handleSimulateAttack}
        onOpenCtf={() => setIsCtfOpen(true)}
        onOpenAiScanner={(cve) => {
          if (cve) setSentinelCve(cve);
          setIsAiScannerOpen(true);
        }}
        onOpenBinaryInspector={() => {
          setSelectedBinary('audit_engine.elf');
          setIsBinaryInspectorOpen(true);
        }}
        onOpenThreatGraph={() => setIsThreatGraphOpen(true)}
        onOpenMatrix={() => setIsMatrixOpen(true)}
        onOpenAudioConsole={() => setIsAudioConsoleOpen(true)}
        onOpenNmap={(target) => {
          if (target) setNmapTarget(target);
          setIsNmapOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Lab Adversary Emulation Sandbox Modal */}
      <LabSimulationModal
        lab={selectedLab}
        onClose={() => setSelectedLab(null)}
      />

      {/* 1. 60-Second SOC Defender CTF Challenge Modal */}
      <SOCDefenderModal
        isOpen={isCtfOpen}
        onClose={() => setIsCtfOpen(false)}
      />

      {/* 2. Sentinel Core AI Threat Intelligence Triage Modal */}
      <SentinelThreatScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        initialCve={sentinelCve}
      />

      {/* 3. Interactive Binary & Hex Opcode Inspector Modal */}
      <BinaryHexInspectorModal
        isOpen={isBinaryInspectorOpen}
        onClose={() => setIsBinaryInspectorOpen(false)}
        binaryName={selectedBinary}
      />

      {/* 4. Threat Intel Dossier & Attack Graph Modal */}
      <ThreatIntelGraphModal
        isOpen={isThreatGraphOpen}
        onClose={() => setIsThreatGraphOpen(false)}
        onOpenAiScanner={(cve) => {
          if (cve) setSentinelCve(cve);
          setIsAiScannerOpen(true);
        }}
      />

      {/* 5. Matrix Code Rain Zero-Day Breach Easter Egg Overlay */}
      <MatrixBreachOverlay
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />

      {/* 6. Cyber Soundscape & Audio Console HUD */}
      <CyberAudioConsole
        isOpen={isAudioConsoleOpen}
        onClose={() => setIsAudioConsoleOpen(false)}
      />

      {/* 7. Live Nmap Network Port Scanner & Vulnerability Engine Modal */}
      <LiveNmapModal
        isOpen={isNmapOpen}
        onClose={() => setIsNmapOpen(false)}
        initialTarget={nmapTarget}
      />

      {/* 8. Full Functional Cyberforage Root CMS & Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Google Chrome Web Audio Autoplay Policy Interactive Activator */}
      {audioState === 'suspended' && !hasInteractedAudio && (
        <aside
          aria-label="Tactical Audio Activation"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all animate-bounce duration-1000"
        >
          <button
            onClick={() => {
              cyberSound.unlockAudio();
              setHasInteractedAudio(true);
            }}
            className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#050D1A]/95 border border-[#00F0C0]/60 text-[#00F0C0] font-mono text-xs font-bold tracking-wider backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,192,0.35)] hover:border-[#00F0C0] hover:bg-[#00F0C0]/15 hover:shadow-[0_0_35px_rgba(0,240,192,0.6)] transition-all cursor-pointer"
            title="Click to activate tactical soundscape"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0C0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F0C0]"></span>
            </span>
            <Volume2 className="w-4 h-4 text-[#00F0C0] group-hover:scale-110 transition-transform" />
            <span>TACTICAL AUDIO STANDBY // CLICK TO ACTIVATE</span>
          </button>
        </aside>
      )}
    </div>
  );
}

export default App;
