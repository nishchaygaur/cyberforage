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
import { SceneMode, Lab, SimulatedIncident } from './types';
import { cyberSound } from './audio/cyberSoundEngine';
import { Terminal } from 'lucide-react';

export function App() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('globe');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [attackTrigger, setAttackTrigger] = useState(0);
  const [incident, setIncident] = useState<SimulatedIncident | null>(null);
  const incidentTimersRef = useRef<number[]>([]);

  // Global Keyboard Shortcuts (Ctrl+K or `~` to toggle tactical terminal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || e.key === '`') {
        e.preventDefault();
        cyberSound.playClick();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsTerminalOpen(false);
        setSelectedLab(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup incident timers on unmount
  useEffect(() => {
    return () => {
      incidentTimersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  // Coordinated Automated Attack Simulation Lifecycle (Auto-stops and resets)
  const handleSimulateAttack = () => {
    // Clear any previous active simulation timers
    incidentTimersRef.current.forEach((id) => clearTimeout(id));
    incidentTimersRef.current = [];

    // Increment 3D globe projectile counter
    setAttackTrigger((prev) => prev + 1);

    const targets = [
      { name: 'Tokyo Sentinel', ip: '192.0.2.77', vector: 'Zero-Day Heap Spray', technique: 'T1059.001' },
      { name: 'Frankfurt Core', ip: '198.51.100.12', vector: 'BGP Hijack & Exfil', technique: 'T1557.002' },
      { name: 'Ashburn Mesh', ip: '203.0.113.88', vector: 'Supply Chain Kernel Hook', technique: 'T1542.001' },
      { name: 'London Node', ip: '195.55.12.34', vector: 'Distributed AI Sybil Flood', technique: 'T1498.001' },
    ];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const incidentId = `CF-INC-${Math.floor(1000 + Math.random() * 9000)}`;

    // Phase 1: Inbound Vector (0 - 1800ms)
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

    // Phase 2: Incident Generated (1800ms - 4000ms)
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

    // Phase 3: Automated Containment (4000ms - 6200ms)
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

    // Phase 4: Resolved / Mitigated (6200ms - 9000ms)
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

    // Phase 5: Auto-Stop / Reset to Idle (at 9000ms)
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
  };

  const handleFocusMesh3D = () => {
    setSceneMode('mesh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#040812] text-white flex flex-col relative selection:bg-[#00F0C0]/20 selection:text-[#00F0C0]">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Top Header Navigation */}
      <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section with 3D Cyber Defense Globe */}
        <HeroSection
          onOpenTerminal={() => setIsTerminalOpen(true)}
          sceneMode={sceneMode}
          onSceneModeChange={(mode) => setSceneMode(mode)}
          attackTrigger={attackTrigger}
          onSimulateAttack={handleSimulateAttack}
          incident={incident}
          onDismissIncident={handleDismissIncident}
        />

        {/* The Cyberforage Ecosystem (Security, AI, Automation) */}
        <EcosystemSection />

        {/* Featured Projects (Audit Platform, CyberForge, PDF Analyzer, SentinelX) */}
        <ProjectsSection />

        {/* Cyberforage Labs (5 interactive simulation testbeds) */}
        <LabsSection
          onRunLabSimulation={(lab) => setSelectedLab(lab)}
          onFocusBlade3D={handleFocusBlade3D}
        />

        {/* Research Disciplines & Published Insights */}
        <ResearchSection />

        {/* Tech Stack & Interconnected Security Mesh */}
        <TechStackSection onFocusMesh3D={handleFocusMesh3D} />

        {/* Real-Time Defense Telemetry HUD */}
        <TelemetryHUDSection
          onSimulateAttack={handleSimulateAttack}
          incident={incident}
        />

        {/* Open Source Channels & Encrypted Transmission Terminal */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

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
      />

      {/* Lab Adversary Emulation Sandbox Modal */}
      <LabSimulationModal
        lab={selectedLab}
        onClose={() => setSelectedLab(null)}
      />
    </div>
  );
}

export default App;
