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
import { CyberSlideControls, SlideSectionItem } from './components/navigation/CyberSlideControls';
import { LiveNmapModal } from './components/nmap/LiveNmapModal';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { SceneMode, Lab, SimulatedIncident } from './types';
import { cyberSound } from './audio/cyberSoundEngine';
import { Terminal } from 'lucide-react';

const SECTIONS: SlideSectionItem[] = [
  { id: 'home', shortLabel: 'MISSION', fullLabel: 'Mission Control', code: '01' },
  { id: 'ecosystem', shortLabel: 'ECOSYSTEM', fullLabel: 'Ecosystem Pillars', code: '02' },
  { id: 'projects', shortLabel: 'PROJECTS', fullLabel: 'Active Projects', code: '03' },
  { id: 'labs', shortLabel: 'LABS', fullLabel: 'Virtual Testbeds', code: '04' },
  { id: 'research', shortLabel: 'RESEARCH', fullLabel: 'Research Vectors', code: '05' },
  { id: 'technologies', shortLabel: 'TECH STACK', fullLabel: 'Tool Architecture', code: '06' },
  { id: 'telemetry', shortLabel: 'TELEMETRY', fullLabel: 'Defense Telemetry', code: '07' },
  { id: 'contact', shortLabel: 'DISPATCH', fullLabel: 'Secure Dispatch', code: '08' },
];

export function App() {
  const [viewMode, setViewMode] = useState<'slide' | 'vertical'>('slide');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [sceneMode, setSceneMode] = useState<SceneMode>('globe');

  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isTransitioningRef = useRef(false);

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
  const [isBinaryInspectorOpen, setIsBinaryInspectorOpen] = useState(false);
  const [selectedBinary, setSelectedBinary] = useState('libmalware_loader.elf');
  const [isThreatGraphOpen, setIsThreatGraphOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isAudioConsoleOpen, setIsAudioConsoleOpen] = useState(false);

  // Easter Egg tracking buffers (Matrix keywords and Konami code)
  const keyBufferRef = useRef('');
  const konamiIndexRef = useRef(0);
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  const slideProgress = activeSectionIndex / (SECTIONS.length - 1);

  const handleNavigateToIndex = (index: number) => {
    const boundedIndex = Math.min(SECTIONS.length - 1, Math.max(0, index));
    setActiveSectionIndex(boundedIndex);
    const targetSection = SECTIONS[boundedIndex];
    setActiveSection(targetSection.id);

    if (viewMode === 'vertical') {
      if (targetSection.id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetSection.id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    const idx = SECTIONS.findIndex((s) => s.id === sectionId);
    if (idx !== -1) {
      handleNavigateToIndex(idx);
    }
  };

  const handleSlideStep = (step: number) => {
    const nextIdx = activeSectionIndex + step;
    if (nextIdx >= 0 && nextIdx < SECTIONS.length) {
      cyberSound.playBlip();
      handleNavigateToIndex(nextIdx);
    }
  };

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

      // Slide navigation keys when no modal is open and not typing
      if (viewMode === 'slide') {
        const activeEl = document.activeElement;
        const isInput =
          activeEl instanceof HTMLInputElement ||
          activeEl instanceof HTMLTextAreaElement ||
          (activeEl instanceof HTMLElement && activeEl.isContentEditable);

        const isAnyModalOpen =
          isTerminalOpen ||
          isAdminOpen ||
          isCtfOpen ||
          isAiScannerOpen ||
          isBinaryInspectorOpen ||
          isThreatGraphOpen ||
          isMatrixOpen ||
          isAudioConsoleOpen ||
          isNmapOpen ||
          selectedLab !== null;

        if (!isInput && !isAnyModalOpen) {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            handleSlideStep(1);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            handleSlideStep(-1);
          } else if (e.key === 'Home') {
            e.preventDefault();
            handleNavigateToIndex(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            handleNavigateToIndex(SECTIONS.length - 1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    viewMode,
    activeSectionIndex,
    isTerminalOpen,
    isAdminOpen,
    isCtfOpen,
    isAiScannerOpen,
    isBinaryInspectorOpen,
    isThreatGraphOpen,
    isMatrixOpen,
    isAudioConsoleOpen,
    isNmapOpen,
    selectedLab,
  ]);

  // Wheel listener: Slides to left on scrolling down while viewport stays in the same place
  useEffect(() => {
    if (viewMode !== 'slide') return;

    let wheelAccumulator = 0;
    let transitionTimeout: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if any modal is open
      if (
        isTerminalOpen ||
        isAdminOpen ||
        isCtfOpen ||
        isAiScannerOpen ||
        isBinaryInspectorOpen ||
        isThreatGraphOpen ||
        isMatrixOpen ||
        isAudioConsoleOpen ||
        isNmapOpen ||
        selectedLab !== null
      ) {
        return;
      }

      const currentSlideEl = slideRefs.current[activeSectionIndex];
      const deltaY = e.deltaY;

      // Check if current slide has internal scrollable space
      if (currentSlideEl) {
        const hasScrollableContent = currentSlideEl.scrollHeight > currentSlideEl.clientHeight + 10;
        if (hasScrollableContent) {
          const isAtTop = currentSlideEl.scrollTop <= 8;
          const isAtBottom =
            currentSlideEl.scrollTop + currentSlideEl.clientHeight >= currentSlideEl.scrollHeight - 12;

          // If scrolling down and not yet at bottom of section, let it scroll internally
          if (deltaY > 0 && !isAtBottom) {
            return;
          }
          // If scrolling up and not yet at top of section, let it scroll internally
          if (deltaY < 0 && !isAtTop) {
            return;
          }
        }
      }

      // Check boundary conditions:
      if (activeSectionIndex === 0 && deltaY < 0) {
        return;
      }
      if (activeSectionIndex === SECTIONS.length - 1 && deltaY > 0) {
        return;
      }

      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      wheelAccumulator += deltaY;

      if (Math.abs(wheelAccumulator) > 35) {
        e.preventDefault();
        const direction = wheelAccumulator > 0 ? 1 : -1;
        wheelAccumulator = 0;
        isTransitioningRef.current = true;

        setActiveSectionIndex((prev) => {
          const nextIndex = Math.min(SECTIONS.length - 1, Math.max(0, prev + direction));
          if (nextIndex !== prev) {
            cyberSound.playBlip();
            setActiveSection(SECTIONS[nextIndex].id);
          }
          return nextIndex;
        });

        if (transitionTimeout) clearTimeout(transitionTimeout);
        transitionTimeout = window.setTimeout(() => {
          isTransitioningRef.current = false;
        }, 700);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (transitionTimeout) clearTimeout(transitionTimeout);
    };
  }, [
    viewMode,
    activeSectionIndex,
    isTerminalOpen,
    isAdminOpen,
    isCtfOpen,
    isAiScannerOpen,
    isBinaryInspectorOpen,
    isThreatGraphOpen,
    isMatrixOpen,
    isAudioConsoleOpen,
    isNmapOpen,
    selectedLab,
  ]);

  // Touch Swipe Gesture Listener
  useEffect(() => {
    if (viewMode !== 'slide') return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (
        isTerminalOpen ||
        isAdminOpen ||
        isCtfOpen ||
        isAiScannerOpen ||
        isBinaryInspectorOpen ||
        isThreatGraphOpen ||
        isMatrixOpen ||
        isAudioConsoleOpen ||
        isNmapOpen ||
        selectedLab !== null
      ) {
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Horizontal swipe (dominant)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX < 0) {
          handleSlideStep(1);
        } else {
          handleSlideStep(-1);
        }
      }
      // Vertical swipe on sections that don't need scroll
      else if (Math.abs(diffY) > 75) {
        const currentSlideEl = slideRefs.current[activeSectionIndex];
        if (currentSlideEl) {
          const isAtTop = currentSlideEl.scrollTop <= 5;
          const isAtBottom =
            currentSlideEl.scrollTop + currentSlideEl.clientHeight >= currentSlideEl.scrollHeight - 10;
          if (diffY < 0 && isAtBottom) {
            handleSlideStep(1);
          } else if (diffY > 0 && isAtTop) {
            handleSlideStep(-1);
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewMode, activeSectionIndex, isTerminalOpen, isAdminOpen, isCtfOpen, isAiScannerOpen, isBinaryInspectorOpen, isThreatGraphOpen, isMatrixOpen, isAudioConsoleOpen, isNmapOpen, selectedLab]);

  // Global Anchor Click Interceptor (smoothly slides to target section)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const id = href.slice(1);
        const sectionIdx = SECTIONS.findIndex((s) => s.id === id);
        if (sectionIdx !== -1) {
          e.preventDefault();
          cyberSound.playClick();
          handleNavigateToIndex(sectionIdx);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [viewMode]);

  // Section Spy in Vertical Mode
  useEffect(() => {
    if (viewMode !== 'vertical') return;

    const sectionIds = SECTIONS.map((s) => s.id);
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
          const foundIdx = SECTIONS.findIndex((s) => s.id === topVisible);
          if (foundIdx !== -1) setActiveSectionIndex(foundIdx);
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
        setActiveSectionIndex(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [viewMode]);

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
    handleNavigateToIndex(0);
    cyberSound.playLaser();
  };

  const handleFocusMesh3D = () => {
    setSceneMode('mesh');
    handleNavigateToIndex(0);
    cyberSound.playLaser();
  };

  return (
    <div className="min-h-screen bg-[#040812] text-white flex flex-col relative selection:bg-[#00F0C0]/20 selection:text-[#00F0C0] overflow-x-hidden">
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
        onNavigate={handleNavigateToSection}
        slideProgress={viewMode === 'slide' ? slideProgress : undefined}
      />

      {/* Main Content Sections: Horizontal Slide Deck or Classic Vertical */}
      {viewMode === 'slide' ? (
        <main className="flex-1 w-full h-screen overflow-hidden relative">
          {/* Horizontal Slide Track */}
          <div
            ref={trackRef}
            className="flex flex-row h-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              width: `${SECTIONS.length * 100}vw`,
              transform: `translateX(-${activeSectionIndex * 100}vw)`,
            }}
          >
            {/* Section 0: Home */}
            <div
              id="home"
              ref={(el) => {
                slideRefs.current[0] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 0 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <HeroSection
                onOpenTerminal={() => setIsTerminalOpen(true)}
                sceneMode={sceneMode}
                onSceneModeChange={(mode) => setSceneMode(mode)}
                attackTrigger={attackTrigger}
                onSimulateAttack={handleSimulateAttack}
                incident={incident}
                onDismissIncident={handleDismissIncident}
                onOpenNmap={() => setIsNmapOpen(true)}
              />
            </div>

            {/* Section 1: Ecosystem */}
            <div
              id="ecosystem"
              ref={(el) => {
                slideRefs.current[1] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 1 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="min-h-full flex flex-col justify-center">
                <EcosystemSection />
              </div>
            </div>

            {/* Section 2: Projects */}
            <div
              id="projects"
              ref={(el) => {
                slideRefs.current[2] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 2 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="min-h-full flex flex-col justify-center">
                <ProjectsSection
                  onInspectBinary={(binName) => {
                    setSelectedBinary(binName);
                    setIsBinaryInspectorOpen(true);
                  }}
                />
              </div>
            </div>

            {/* Section 3: Labs */}
            <div
              id="labs"
              ref={(el) => {
                slideRefs.current[3] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 3 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="min-h-full flex flex-col justify-center">
                <LabsSection
                  onRunLabSimulation={(lab) => setSelectedLab(lab)}
                  onFocusBlade3D={handleFocusBlade3D}
                />
              </div>
            </div>

            {/* Section 4: Research */}
            <div
              id="research"
              ref={(el) => {
                slideRefs.current[4] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 4 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="min-h-full flex flex-col justify-center">
                <ResearchSection onOpenThreatGraph={() => setIsThreatGraphOpen(true)} />
              </div>
            </div>

            {/* Section 5: Technologies */}
            <div
              id="technologies"
              ref={(el) => {
                slideRefs.current[5] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 5 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="min-h-full flex flex-col justify-center">
                <TechStackSection onFocusMesh3D={handleFocusMesh3D} />
              </div>
            </div>

            {/* Section 6: Telemetry */}
            <div
              id="telemetry"
              ref={(el) => {
                slideRefs.current[6] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 6 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="min-h-full flex flex-col justify-center">
                <TelemetryHUDSection
                  onSimulateAttack={handleSimulateAttack}
                  incident={incident}
                />
              </div>
            </div>

            {/* Section 7: Contact & Transmission + Footer */}
            <div
              id="contact"
              ref={(el) => {
                slideRefs.current[7] = el;
              }}
              className={`w-screen h-screen flex-shrink-0 relative overflow-y-auto overflow-x-hidden cyber-slide-pane transition-all duration-700 ${
                activeSectionIndex === 7 ? 'opacity-100 scale-100' : 'opacity-30 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="min-h-full flex flex-col justify-between">
                <ContactSection />
                <Footer onNavigate={handleNavigateToSection} />
              </div>
            </div>
          </div>

          {/* Tactical On-Screen Slide HUD & Controls */}
          <CyberSlideControls
            sections={SECTIONS}
            activeIndex={activeSectionIndex}
            onPrev={() => handleSlideStep(-1)}
            onNext={() => handleSlideStep(1)}
            onSelectIndex={(idx) => handleNavigateToIndex(idx)}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode((prev) => (prev === 'slide' ? 'vertical' : 'slide'))}
          />
        </main>
      ) : (
        <>
          <main className="flex-1 flex flex-col pb-20">
            <HeroSection
              onOpenTerminal={() => setIsTerminalOpen(true)}
              sceneMode={sceneMode}
              onSceneModeChange={(mode) => setSceneMode(mode)}
              attackTrigger={attackTrigger}
              onSimulateAttack={handleSimulateAttack}
              incident={incident}
              onDismissIncident={handleDismissIncident}
              onOpenNmap={() => setIsNmapOpen(true)}
            />
            <EcosystemSection />
            <ProjectsSection
              onInspectBinary={(binName) => {
                setSelectedBinary(binName);
                setIsBinaryInspectorOpen(true);
              }}
            />
            <LabsSection
              onRunLabSimulation={(lab) => setSelectedLab(lab)}
              onFocusBlade3D={handleFocusBlade3D}
            />
            <ResearchSection onOpenThreatGraph={() => setIsThreatGraphOpen(true)} />
            <TechStackSection onFocusMesh3D={handleFocusMesh3D} />
            <TelemetryHUDSection
              onSimulateAttack={handleSimulateAttack}
              incident={incident}
            />
            <ContactSection />
          </main>
          <Footer onNavigate={handleNavigateToSection} />

          {/* Tactical Mode Switcher & Navigation when in vertical view */}
          <CyberSlideControls
            sections={SECTIONS}
            activeIndex={activeSectionIndex}
            onPrev={() => handleSlideStep(-1)}
            onNext={() => handleSlideStep(1)}
            onSelectIndex={(idx) => handleNavigateToIndex(idx)}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode((prev) => (prev === 'slide' ? 'vertical' : 'slide'))}
          />
        </>
      )}

      {/* Tactical Floating Scroll-To-Top and Desktop Quick-Scroll Rail */}
      <CyberScrollHUD
        activeSection={activeSection}
        onSectionChange={handleNavigateToSection}
        slideProgress={slideProgress}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((prev) => (prev === 'slide' ? 'vertical' : 'slide'))}
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
        onOpenAiScanner={() => setIsAiScannerOpen(true)}
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
    </div>
  );
}

export default App;
