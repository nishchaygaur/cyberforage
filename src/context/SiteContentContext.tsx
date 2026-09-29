import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Lab, ResearchDomain, ResearchArticle, TechTool, SceneMode } from '../types';
import { projectsData as defaultProjects } from '../data/projectsData';
import { labsData as defaultLabs } from '../data/labsData';
import { researchDomains as defaultDomains, researchArticles as defaultArticles } from '../data/researchData';
import { techTools as defaultTools, ecosystemPillars as defaultPillars } from '../data/techStackData';
import { isSupabaseConfigured, loadContentFromSupabase, saveContentToSupabase } from '../lib/supabase';

export interface HeroContent {
  brandPrefix: string;
  brandSuffix: string;
  badge: string;
  motto: string;
  description: string;
  metrics: { label: string; color: string }[];
  primaryAccent: string;
}

export interface EcosystemContent {
  sectionTag: string;
  title: string;
  description: string;
  pillars: typeof defaultPillars;
}

export interface TelemetrySettings {
  defconLevel: number;
  broadcastAlert: string;
  isAlertActive: boolean;
}

export interface ContactSocialVisibility {
  github: boolean;
  linkedin: boolean;
  twitter: boolean;
  discord: boolean;
  telegram: boolean;
  matrix: boolean;
}

export interface ContactSettings {
  email: string;
  n8nUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  discordUrl?: string;
  telegramUrl?: string;
  matrixUrl?: string;
  pgpKey: string;
  socialsVisible?: ContactSocialVisibility;
}

export interface Scene3DConfig {
  defaultMode: SceneMode;
  rotationSpeed: number;
  primaryGlow: string;
  secondaryGlow: string;
}

export interface SiteContent {
  hero: HeroContent;
  ecosystem: EcosystemContent;
  projects: Project[];
  labs: Lab[];
  researchDomains: ResearchDomain[];
  researchArticles: ResearchArticle[];
  techTools: TechTool[];
  telemetry: TelemetrySettings;
  contact: ContactSettings;
  sceneConfig: Scene3DConfig;
}

const DEFAULT_CONTENT: SiteContent = {
  hero: {
    brandPrefix: 'CYBER',
    brandSuffix: 'FORAGE',
    badge: 'CYBERSECURITY / RESEARCH / AI / AUTOMATION',
    motto: 'Explore. Build. Defend.',
    description: 'A technology ecosystem for cybersecurity, security research, intelligent automation and defensive engineering.',
    metrics: [
      { label: 'Real tools', color: '#00F0C0' },
      { label: 'Practical security', color: '#38BDF8' },
      { label: 'Open source', color: '#A855F7' },
    ],
    primaryAccent: '#00F0C0',
  },
  ecosystem: {
    sectionTag: 'THE CYBERFORAGE ECOSYSTEM',
    title: 'More Than Just Projects',
    description: 'Cyberforage brings together security, AI and automation into a unified ecosystem — building tools, labs and research for a safer digital world.',
    pillars: defaultPillars,
  },
  projects: defaultProjects,
  labs: defaultLabs,
  researchDomains: defaultDomains,
  researchArticles: defaultArticles,
  techTools: defaultTools,
  telemetry: {
    defconLevel: 5,
    broadcastAlert: 'DEFCON 5: Nominal defensive perimeter active across all nodes.',
    isAlertActive: false,
  },
  contact: {
    email: 'contact@cyberforage.space',
    n8nUrl: 'https://n8nrequest.cyberforage.space/',
    githubUrl: 'https://github.com/nishchaygaur',
    linkedinUrl: 'https://www.linkedin.com/in/nishchay-gaur/',
    twitterUrl: 'https://twitter.com/cyberforage',
    discordUrl: 'https://discord.gg/cyberforage',
    telegramUrl: 'https://t.me/cyberforage',
    matrixUrl: 'https://matrix.to/#/@nishchay:matrix.org',
    pgpKey: '4A79 F82D 9C1B 33E4 8802  DAF6 5E21 00C8 99B7 12FA',
    socialsVisible: {
      github: true,
      linkedin: true,
      twitter: true,
      discord: true,
      telegram: true,
      matrix: true,
    },
  },
  sceneConfig: {
    defaultMode: 'globe',
    rotationSpeed: 1.0,
    primaryGlow: '#00F0C0',
    secondaryGlow: '#38BDF8',
  },
};

const STORAGE_KEY = 'cyberforage_cms_content_v1';

const DEFAULT_SOCIALS_VISIBLE: ContactSocialVisibility = {
  github: true,
  linkedin: true,
  twitter: true,
  discord: true,
  telegram: true,
  matrix: true,
};

interface SiteContentContextValue {
  content: SiteContent;
  updateHero: (data: Partial<HeroContent>) => void;
  updateEcosystem: (data: Partial<EcosystemContent>) => void;
  updateProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  editProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateLabs: (labs: Lab[]) => void;
  addLab: (lab: Lab) => void;
  editLab: (id: string, updated: Partial<Lab>) => void;
  deleteLab: (id: string) => void;
  addArticle: (article: ResearchArticle) => void;
  editArticle: (id: string, updated: Partial<ResearchArticle>) => void;
  deleteArticle: (id: string) => void;
  updateDomain: (id: string, updated: Partial<ResearchDomain>) => void;
  addTool: (tool: TechTool) => void;
  editTool: (id: string, updated: Partial<TechTool>) => void;
  deleteTool: (id: string) => void;
  updateTelemetry: (data: Partial<TelemetrySettings>) => void;
  updateContact: (data: Partial<ContactSettings>) => void;
  updateSceneConfig: (data: Partial<Scene3DConfig>) => void;
  resetToDefaults: () => void;
  exportConfigJson: () => string;
  importConfigJson: (jsonStr: string) => boolean;
  isCloudSyncActive: boolean;
  syncToSupabase: (overrideContent?: SiteContent) => Promise<{ success: boolean; error?: string }>;
}

export function normalizeSiteContent(raw: unknown): SiteContent {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_CONTENT;
  }

  const data = raw as Partial<SiteContent> & { [key: string]: any };

  // 1. Hero
  const rawHero: any = data.hero || {};
  const hero: HeroContent = {
    brandPrefix: typeof rawHero.brandPrefix === 'string' ? rawHero.brandPrefix : DEFAULT_CONTENT.hero.brandPrefix,
    brandSuffix: typeof rawHero.brandSuffix === 'string' ? rawHero.brandSuffix : DEFAULT_CONTENT.hero.brandSuffix,
    badge: typeof rawHero.badge === 'string' ? rawHero.badge : DEFAULT_CONTENT.hero.badge,
    motto: typeof rawHero.motto === 'string' ? rawHero.motto : DEFAULT_CONTENT.hero.motto,
    description: typeof rawHero.description === 'string' ? rawHero.description : DEFAULT_CONTENT.hero.description,
    primaryAccent: typeof rawHero.primaryAccent === 'string' ? rawHero.primaryAccent : DEFAULT_CONTENT.hero.primaryAccent,
    metrics: Array.isArray(rawHero.metrics) && rawHero.metrics.length > 0
      ? rawHero.metrics.map((m: any) => ({
          label: String(m?.label || 'Security'),
          color: String(m?.color || '#00F0C0'),
        }))
      : DEFAULT_CONTENT.hero.metrics,
  };

  // 2. Ecosystem
  const rawEco: any = data.ecosystem || {};
  const rawPillars = Array.isArray(rawEco.pillars) && rawEco.pillars.length > 0
    ? rawEco.pillars
    : DEFAULT_CONTENT.ecosystem.pillars;

  const normalizedPillars = rawPillars.map((p: any, idx: number) => {
    const defaultPillar = DEFAULT_CONTENT.ecosystem.pillars[idx] || DEFAULT_CONTENT.ecosystem.pillars[0];

    // Extract or construct items array safely
    let items: string[] = [];
    if (Array.isArray(p.items) && p.items.length > 0) {
      items = p.items.map((it: any) => String(it).trim()).filter(Boolean);
    } else if (p.id === 'security-research') {
      items = ['Threat Intelligence', 'Vulnerability Research', 'Tradecraft Profiling', 'Adversary Analysis'];
    } else if (p.id === 'tools-engineering') {
      items = ['Detection Engineering', 'Security Parsers', 'Defensive Tooling', 'CI/CD Scanning'];
    } else if (p.id === 'hands-on-labs') {
      items = ['Interactive Scenarios', 'Attack Simulations', 'SOC Exercises', 'Live Telemetry'];
    } else {
      const candidates = [p.subtitle, p.badge, p.stat].filter(
        (c) => typeof c === 'string' && c.trim().length > 0 && c.length < 50
      );
      items = candidates.length > 0 ? (candidates as string[]) : defaultPillar.items;
    }

    return {
      id: String(p.id || defaultPillar.id),
      title: String(p.title || defaultPillar.title),
      tagline: String(p.tagline || p.subtitle || defaultPillar.tagline),
      color: String(p.color || p.accentColor || defaultPillar.color),
      icon: String(p.icon || defaultPillar.icon),
      items: items.length > 0 ? items : defaultPillar.items,
      stats: String(p.stats || p.stat || defaultPillar.stats),
    };
  });

  const ecosystem: EcosystemContent = {
    sectionTag: typeof rawEco.sectionTag === 'string' ? rawEco.sectionTag : DEFAULT_CONTENT.ecosystem.sectionTag,
    title: typeof rawEco.title === 'string' ? rawEco.title : DEFAULT_CONTENT.ecosystem.title,
    description: typeof rawEco.description === 'string' ? rawEco.description : DEFAULT_CONTENT.ecosystem.description,
    pillars: normalizedPillars,
  };

  // 3. Projects
  const rawProjects = Array.isArray(data.projects) && data.projects.length > 0
    ? data.projects
    : DEFAULT_CONTENT.projects;

  const projects: Project[] = rawProjects.map((p: any, idx: number) => {
    const defProj = DEFAULT_CONTENT.projects[idx] || DEFAULT_CONTENT.projects[0];
    const tags = Array.isArray(p.tags) && p.tags.length > 0 ? p.tags.map(String) : defProj.tags;
    const metrics = Array.isArray(p.metrics) && p.metrics.length > 0
      ? p.metrics.map((m: any) => ({ label: String(m?.label || ''), value: String(m?.value || '') }))
      : (defProj.metrics || [{ label: 'Status', value: 'Active' }, { label: 'Coverage', value: '100%' }, { label: 'Audit', value: 'A+' }]);

    return {
      id: String(p.id || defProj.id),
      slug: String(p.slug || p.id || defProj.slug),
      title: String(p.title || defProj.title),
      subtitle: String(p.subtitle || p.tagline || defProj.subtitle),
      description: String(p.description || defProj.description),
      longDescription: String(p.longDescription || p.description || defProj.longDescription || ''),
      accent: ['rose', 'purple', 'cyan', 'emerald'].includes(p.accent) ? p.accent : defProj.accent,
      tags,
      project_url: p.project_url || p.demo_url || defProj.project_url,
      demo_url: p.demo_url || p.project_url || defProj.demo_url,
      github_url: p.github_url || p.githubUrl || defProj.github_url,
      documentation_url: p.documentation_url || defProj.documentation_url,
      featured: typeof p.featured === 'boolean' ? p.featured : defProj.featured,
      status: p.status || defProj.status,
      category: p.category || defProj.category,
      metrics,
      year: p.year || defProj.year,
    };
  });

  // 4. Labs
  const rawLabs = Array.isArray(data.labs) && data.labs.length > 0
    ? data.labs
    : DEFAULT_CONTENT.labs;

  const labs: Lab[] = rawLabs.map((l: any, idx: number) => {
    const defLab = DEFAULT_CONTENT.labs[idx] || DEFAULT_CONTENT.labs[0];
    const attackVectors = Array.isArray(l.attackVectors) && l.attackVectors.length > 0 ? l.attackVectors.map(String) : defLab.attackVectors;
    const defenseTechniques = Array.isArray(l.defenseTechniques) && l.defenseTechniques.length > 0 ? l.defenseTechniques.map(String) : defLab.defenseTechniques;
    const simulatedLogs = Array.isArray(l.simulatedLogs) && l.simulatedLogs.length > 0 ? l.simulatedLogs.map(String) : defLab.simulatedLogs;

    return {
      id: String(l.id || defLab.id),
      name: String(l.name || l.title || defLab.name),
      slug: String(l.slug || l.id || defLab.slug),
      description: String(l.description || defLab.description),
      fullOverview: String(l.fullOverview || l.description || defLab.fullOverview),
      category: l.category || defLab.category,
      difficulty: l.difficulty || defLab.difficulty,
      status: l.status || defLab.status,
      attackVectors,
      defenseTechniques,
      simulatedLogs,
      accent: String(l.accent || defLab.accent || '#00F0C0'),
      displayOrder: typeof l.displayOrder === 'number' ? l.displayOrder : (idx + 1),
    };
  });

  // 5. Research Domains
  const rawDomains = Array.isArray(data.researchDomains) && data.researchDomains.length > 0
    ? data.researchDomains
    : DEFAULT_CONTENT.researchDomains;

  const researchDomains: ResearchDomain[] = rawDomains.map((d: any, idx: number) => {
    const defDom = DEFAULT_CONTENT.researchDomains[idx] || DEFAULT_CONTENT.researchDomains[0];
    return {
      id: String(d.id || defDom.id),
      title: String(d.title || defDom.title),
      description: String(d.description || defDom.description),
      color: String(d.color || defDom.color),
      topics: Array.isArray(d.topics) && d.topics.length > 0 ? d.topics.map(String) : defDom.topics,
      icon: String(d.icon || defDom.icon),
    };
  });

  // 6. Research Articles
  const rawArticles = Array.isArray(data.researchArticles) && data.researchArticles.length > 0
    ? data.researchArticles
    : DEFAULT_CONTENT.researchArticles;

  const researchArticles: ResearchArticle[] = rawArticles.map((a: any, idx: number) => {
    const defArt = DEFAULT_CONTENT.researchArticles[idx] || DEFAULT_CONTENT.researchArticles[0];
    return {
      id: String(a.id || defArt.id),
      title: String(a.title || defArt.title),
      category: String(a.category || defArt.category),
      date: String(a.date || defArt.date),
      readTime: String(a.readTime || defArt.readTime),
      summary: String(a.summary || defArt.summary),
      content: Array.isArray(a.content) && a.content.length > 0 ? a.content.map(String) : defArt.content,
      keyTakeaways: Array.isArray(a.keyTakeaways) && a.keyTakeaways.length > 0 ? a.keyTakeaways.map(String) : defArt.keyTakeaways,
      threatIndicators: Array.isArray(a.threatIndicators) ? a.threatIndicators.map(String) : defArt.threatIndicators,
    };
  });

  // 7. Tech Tools
  const rawTools = Array.isArray(data.techTools) && data.techTools.length > 0
    ? data.techTools
    : DEFAULT_CONTENT.techTools;

  const techTools: TechTool[] = rawTools.map((t: any, idx: number) => {
    const defTool = DEFAULT_CONTENT.techTools[idx] || DEFAULT_CONTENT.techTools[0];
    return {
      id: String(t.id || defTool.id),
      name: String(t.name || defTool.name),
      category: t.category || defTool.category,
      description: String(t.description || defTool.description),
      icon: String(t.icon || defTool.icon),
      accentColor: String(t.accentColor || defTool.accentColor),
      defenseRole: String(t.defenseRole || defTool.defenseRole),
    };
  });

  // 8. Telemetry
  const rawTel: any = data.telemetry || {};
  const telemetry: TelemetrySettings = {
    defconLevel: typeof rawTel.defconLevel === 'number' ? rawTel.defconLevel : DEFAULT_CONTENT.telemetry.defconLevel,
    broadcastAlert: String(rawTel.broadcastAlert || DEFAULT_CONTENT.telemetry.broadcastAlert),
    isAlertActive: Boolean(rawTel.isAlertActive),
  };

  // 9. Contact
  const rawContact: any = data.contact || {};
  const contact: ContactSettings = {
    email: String(rawContact.email || DEFAULT_CONTENT.contact.email),
    n8nUrl: String(rawContact.n8nUrl || DEFAULT_CONTENT.contact.n8nUrl),
    githubUrl: String(rawContact.githubUrl || DEFAULT_CONTENT.contact.githubUrl),
    linkedinUrl: String(rawContact.linkedinUrl || DEFAULT_CONTENT.contact.linkedinUrl),
    twitterUrl: rawContact.twitterUrl || DEFAULT_CONTENT.contact.twitterUrl,
    discordUrl: rawContact.discordUrl || DEFAULT_CONTENT.contact.discordUrl,
    telegramUrl: rawContact.telegramUrl || DEFAULT_CONTENT.contact.telegramUrl,
    matrixUrl: rawContact.matrixUrl || DEFAULT_CONTENT.contact.matrixUrl,
    pgpKey: String(rawContact.pgpKey || DEFAULT_CONTENT.contact.pgpKey),
    socialsVisible: {
      ...DEFAULT_SOCIALS_VISIBLE,
      ...(rawContact.socialsVisible || {}),
    },
  };

  // 10. Scene Config
  const rawScene: any = data.sceneConfig || {};
  const sceneConfig: Scene3DConfig = {
    defaultMode: rawScene.defaultMode || DEFAULT_CONTENT.sceneConfig.defaultMode,
    rotationSpeed: typeof rawScene.rotationSpeed === 'number' ? rawScene.rotationSpeed : DEFAULT_CONTENT.sceneConfig.rotationSpeed,
    primaryGlow: String(rawScene.primaryGlow || DEFAULT_CONTENT.sceneConfig.primaryGlow),
    secondaryGlow: String(rawScene.secondaryGlow || DEFAULT_CONTENT.sceneConfig.secondaryGlow),
  };

  return {
    hero,
    ecosystem,
    projects,
    labs,
    researchDomains,
    researchArticles,
    techTools,
    telemetry,
    contact,
    sceneConfig,
  };
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return normalizeSiteContent(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Failed to parse saved site content, using defaults', err);
    }
    return DEFAULT_CONTENT;
  });

  const isInitialLoadDoneRef = React.useRef<boolean>(false);
  const isCloudSyncActive = isSupabaseConfigured();

  // Load latest content from Supabase if configured
  useEffect(() => {
    let isMounted = true;
    if (isSupabaseConfigured()) {
      loadContentFromSupabase()
        .then((remoteData) => {
          if (!isMounted) return;
          if (remoteData) {
            setContent(normalizeSiteContent(remoteData));
          }
        })
        .finally(() => {
          if (isMounted) {
            isInitialLoadDoneRef.current = true;
          }
        });
    } else {
      isInitialLoadDoneRef.current = true;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage and auto-sync to Supabase if authenticated
  useEffect(() => {
    // Prevent unhydrated local state from overwriting Supabase before remote fetch completes
    if (!isInitialLoadDoneRef.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (err) {
      console.error('Failed to save site content to localStorage', err);
    }

    if (isSupabaseConfigured() && sessionStorage.getItem('cyberforage_admin_auth') === 'true') {
      const timer = setTimeout(() => {
        saveContentToSupabase(content).catch((err) => {
          console.warn('Auto-save to Supabase failed:', err);
        });
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [content]);

  const syncToSupabase = async (overrideContent?: SiteContent) => {
    const dataToSave = overrideContent || content;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // Ignored
    }
    return await saveContentToSupabase(dataToSave);
  };

  const updateHero = (data: Partial<HeroContent>) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...data },
    }));
  };

  const updateEcosystem = (data: Partial<EcosystemContent>) => {
    setContent((prev) => ({
      ...prev,
      ecosystem: { ...prev.ecosystem, ...data },
    }));
  };

  const updateProjects = (projects: Project[]) => {
    setContent((prev) => ({ ...prev, projects }));
  };

  const addProject = (project: Project) => {
    setContent((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
  };

  const editProject = (id: string, updated: Partial<Project>) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateLabs = (labs: Lab[]) => {
    setContent((prev) => ({ ...prev, labs }));
  };

  const addLab = (lab: Lab) => {
    setContent((prev) => ({
      ...prev,
      labs: [lab, ...prev.labs],
    }));
  };

  const editLab = (id: string, updated: Partial<Lab>) => {
    setContent((prev) => ({
      ...prev,
      labs: prev.labs.map((l) => (l.id === id ? { ...l, ...updated } : l)),
    }));
  };

  const deleteLab = (id: string) => {
    setContent((prev) => ({
      ...prev,
      labs: prev.labs.filter((l) => l.id !== id),
    }));
  };

  const addArticle = (article: ResearchArticle) => {
    setContent((prev) => ({
      ...prev,
      researchArticles: [article, ...prev.researchArticles],
    }));
  };

  const editArticle = (id: string, updated: Partial<ResearchArticle>) => {
    setContent((prev) => ({
      ...prev,
      researchArticles: prev.researchArticles.map((a) => (a.id === id ? { ...a, ...updated } : a)),
    }));
  };

  const deleteArticle = (id: string) => {
    setContent((prev) => ({
      ...prev,
      researchArticles: prev.researchArticles.filter((a) => a.id !== id),
    }));
  };

  const updateDomain = (id: string, updated: Partial<ResearchDomain>) => {
    setContent((prev) => ({
      ...prev,
      researchDomains: prev.researchDomains.map((d) => (d.id === id ? { ...d, ...updated } : d)),
    }));
  };

  const addTool = (tool: TechTool) => {
    setContent((prev) => ({
      ...prev,
      techTools: [tool, ...prev.techTools],
    }));
  };

  const editTool = (id: string, updated: Partial<TechTool>) => {
    setContent((prev) => ({
      ...prev,
      techTools: prev.techTools.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    }));
  };

  const deleteTool = (id: string) => {
    setContent((prev) => ({
      ...prev,
      techTools: prev.techTools.filter((t) => t.id !== id),
    }));
  };

  const updateTelemetry = (data: Partial<TelemetrySettings>) => {
    setContent((prev) => ({
      ...prev,
      telemetry: { ...prev.telemetry, ...data },
    }));
  };

  const updateContact = (data: Partial<ContactSettings>) => {
    setContent((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...data,
        socialsVisible: {
          ...DEFAULT_SOCIALS_VISIBLE,
          ...(prev.contact.socialsVisible || {}),
          ...(data.socialsVisible || {}),
        },
      },
    }));
  };

  const updateSceneConfig = (data: Partial<Scene3DConfig>) => {
    setContent((prev) => ({
      ...prev,
      sceneConfig: { ...prev.sceneConfig, ...data },
    }));
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
    setContent(DEFAULT_CONTENT);
  };

  const exportConfigJson = () => {
    return JSON.stringify(content, null, 2);
  };

  const importConfigJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        const merged = normalizeSiteContent(parsed);
        setContent(merged);
        return true;
      }
    } catch (err) {
      console.error('Failed to import JSON configuration', err);
    }
    return false;
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        updateHero,
        updateEcosystem,
        updateProjects,
        addProject,
        editProject,
        deleteProject,
        updateLabs,
        addLab,
        editLab,
        deleteLab,
        addArticle,
        editArticle,
        deleteArticle,
        updateDomain,
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
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextValue => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return ctx;
};
