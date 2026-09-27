import React, { useState, useEffect } from 'react';
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
import { SceneMode, Lab, Project } from './types';
import { cyberSound } from './audio/cyberSoundEngine';
import { Terminal } from 'lucide-react';

export function App() {
  const [sceneMode, setSceneMode] = useState<SceneMode>('globe');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [attackTrigger, setAttackTrigger] = useState(0);

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

  const handleSimulateAttack = () => {
    setAttackTrigger((prev) => prev + 1);
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
        <TelemetryHUDSection onSimulateAttack={handleSimulateAttack} />

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
