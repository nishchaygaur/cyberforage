export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Labs", href: "#labs" },
  { label: "Research", href: "#research" },
  { label: "Tools", href: "#technologies" },
  { label: "About", href: "#ecosystem" },
  { label: "Contact", href: "#contact" },
];

export const SOCIAL_LINKS = {
  github: "https://github.com/nishchaygaur/cyberforage",
};

export interface EcosystemCardData {
  title: string;
  icon: "security" | "ai" | "automation";
  accent: "cyan" | "purple" | "teal";
  items: string[];
}

export const ECOSYSTEM_CARDS: EcosystemCardData[] = [
  {
    title: "Security",
    icon: "security",
    accent: "cyan",
    items: ["SOC & Detection", "Threat Intelligence", "DFIR", "Research"],
  },
  {
    title: "AI",
    icon: "ai",
    accent: "purple",
    items: ["AI Agents", "ML Models", "Security Analytics", "Automation"],
  },
  {
    title: "Automation",
    icon: "automation",
    accent: "teal",
    items: ["Workflows", "Orchestration", "Data Processing", "Intelligent Tools"],
  },
];

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accent: "cyan" | "purple" | "rose";
  workflow?: string[];
  tags?: string[];
}

export const FEATURED_PROJECTS: ProjectData[] = [
  {
    id: "sentinelx",
    title: "SentinelX",
    subtitle: "AI-Powered SOC & Threat Intelligence Platform",
    description:
      "Collects, normalizes and analyzes logs, detects threats, enriches with intelligence and maps to MITRE ATT&CK.",
    accent: "cyan",
    workflow: ["Logs", "Detect", "Alert", "Enrich", "Risk", "MITRE", "Incident"],
  },
  {
    id: "cyberforge",
    title: "CyberForge",
    subtitle: "Advanced Attack Simulation & Defense Lab",
    description:
      "A controlled environment for attack simulation, defensive validation, telemetry and detection evaluation.",
    accent: "purple",
    tags: ["Attack Simulation", "Defense Lab", "Telemetry"],
  },
  {
    id: "pdf-malware-analyzer",
    title: "PDF Malware Analyzer",
    subtitle: "Detects malicious behavior in PDF files.",
    description:
      "Analyzes PDF structure, behavior and indicators to identify potential threats.",
    accent: "rose",
    tags: ["YARA", "Static Analysis", "Malware Detection"],
  },
];

export interface ExplorationDomain {
  title: string;
  description: string;
  icon: "shield" | "target" | "flask" | "brain" | "cloud" | "gear";
  accentColor: string;
}

export const EXPLORATION_DOMAINS: ExplorationDomain[] = [
  {
    title: "Cyber Defense",
    description: "SOC, detection engineering, SIEM, incident response.",
    icon: "shield",
    accentColor: "border-cyan-500/30 text-[#00F0C0]",
  },
  {
    title: "Threat Intelligence",
    description: "Threat analysis, indicators, MITRE ATT&CK, enrichment.",
    icon: "target",
    accentColor: "border-blue-500/30 text-blue-400",
  },
  {
    title: "Security Research",
    description: "Vulnerability research, malware analysis, DFIR.",
    icon: "flask",
    accentColor: "border-purple-500/30 text-purple-400",
  },
  {
    title: "AI × Security",
    description: "AI-assisted analysis, security agents, ML.",
    icon: "brain",
    accentColor: "border-emerald-500/30 text-emerald-400",
  },
  {
    title: "Cloud & Enterprise",
    description: "Identity, endpoint, Zero Trust, Microsoft security.",
    icon: "cloud",
    accentColor: "border-sky-500/30 text-sky-400",
  },
  {
    title: "Automation",
    description: "Security workflows, AI automation, orchestration.",
    icon: "gear",
    accentColor: "border-amber-500/30 text-amber-400",
  },
];

export interface LabItem {
  name: string;
  category: string;
  iconType: "cube" | "shield" | "search" | "bug" | "network";
  accent: "purple" | "teal" | "cyan" | "blue" | "indigo";
}

export const AVAILABLE_LABS: LabItem[] = [
  {
    name: "CyberForge",
    category: "Attack Simulation",
    iconType: "cube",
    accent: "purple",
  },
  {
    name: "Detection Engineering",
    category: "SOC",
    iconType: "shield",
    accent: "teal",
  },
  {
    name: "DFIR",
    category: "Forensics",
    iconType: "search",
    accent: "cyan",
  },
  {
    name: "Malware Analysis",
    category: "Analysis",
    iconType: "bug",
    accent: "blue",
  },
  {
    name: "Network Security",
    category: "Networking",
    iconType: "network",
    accent: "indigo",
  },
];

export interface TechItem {
  name: string;
  category: string;
}

export const TECHNOLOGIES: TechItem[] = [
  { name: "Python", category: "Core" },
  { name: "Linux", category: "Systems" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Docker", category: "Container" },
  { name: "GitHub", category: "VCS" },
  { name: "YARA", category: "Detection" },
  { name: "MITRE", category: "Framework" },
  { name: "NIST", category: "Standards" },
  { name: "Cloud", category: "Infra" },
  { name: "AI", category: "Intelligence" },
];

export interface ArticlePreview {
  category: string;
  title: string;
  description: string;
  date: string;
  imageType: "phishing" | "stealer" | "llm";
}

export const ARTICLE_PREVIEWS: ArticlePreview[] = [
  {
    category: "Threat Intelligence",
    title: "Understanding Modern Phishing Tactics",
    description:
      "A deep dive into current phishing techniques, indicators and detection strategies.",
    date: "May 28, 2025",
    imageType: "phishing",
  },
  {
    category: "Security Research",
    title: "The Rise of Stealer Malware",
    description:
      "Analyzing the latest trends in information stealers and their impact.",
    date: "May 19, 2025",
    imageType: "stealer",
  },
  {
    category: "AI & Security",
    title: "LLMs in Cybersecurity Operations",
    description:
      "How large language models are changing threat detection and response.",
    date: "May 12, 2025",
    imageType: "llm",
  },
];
