import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Lab, ResearchDomain, ResearchArticle, TechTool, SceneMode } from '../types';
import { projectsData as defaultProjects } from '../data/projectsData';
import { labsData as defaultLabs } from '../data/labsData';
import { researchDomains as defaultDomains, researchArticles as defaultArticles } from '../data/researchData';
import { techTools as defaultTools, ecosystemPillars as defaultPillars } from '../data/techStackData';

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
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          hero: { ...DEFAULT_CONTENT.hero, ...(parsed.hero || {}) },
          ecosystem: { ...DEFAULT_CONTENT.ecosystem, ...(parsed.ecosystem || {}) },
          telemetry: { ...DEFAULT_CONTENT.telemetry, ...(parsed.telemetry || {}) },
          contact: {
            ...DEFAULT_CONTENT.contact,
            ...(parsed.contact || {}),
            socialsVisible: {
              ...DEFAULT_SOCIALS_VISIBLE,
              ...(parsed.contact?.socialsVisible || {}),
            },
          },
          sceneConfig: { ...DEFAULT_CONTENT.sceneConfig, ...(parsed.sceneConfig || {}) },
        };
      }
    } catch (err) {
      console.warn('Failed to parse saved site content, using defaults', err);
    }
    return DEFAULT_CONTENT;
  });

  // Save to localStorage whenever content changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (err) {
      console.error('Failed to save site content to localStorage', err);
    }
  }, [content]);

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
        const merged: SiteContent = {
          ...DEFAULT_CONTENT,
          ...parsed,
          hero: { ...DEFAULT_CONTENT.hero, ...(parsed.hero || {}) },
          ecosystem: { ...DEFAULT_CONTENT.ecosystem, ...(parsed.ecosystem || {}) },
          telemetry: { ...DEFAULT_CONTENT.telemetry, ...(parsed.telemetry || {}) },
          contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
          sceneConfig: { ...DEFAULT_CONTENT.sceneConfig, ...(parsed.sceneConfig || {}) },
        };
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
