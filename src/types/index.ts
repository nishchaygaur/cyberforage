export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  accent: 'rose' | 'purple' | 'cyan' | 'emerald';
  tags: string[];
  project_url?: string;
  demo_url?: string;
  github_url?: string;
  documentation_url?: string;
  featured: boolean;
  status: 'active' | 'in_development' | 'archived';
  category: 'Auditing' | 'Attack Simulation' | 'Malware Analysis' | 'SOC Platform';
  metrics?: { label: string; value: string }[];
  year?: string;
}

export interface Lab {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullOverview: string;
  category: 'Attack Simulation' | 'SOC' | 'Forensics' | 'Analysis' | 'Networking';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'available' | 'in_testing' | 'planned';
  attackVectors: string[];
  defenseTechniques: string[];
  simulatedLogs: string[];
  accent: string;
  displayOrder: number;
}

export interface ResearchDomain {
  id: string;
  title: string;
  description: string;
  color: string;
  topics: string[];
  icon: string;
}

export interface ResearchArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  threatIndicators?: string[];
}

export interface TechTool {
  id: string;
  name: string;
  category: 'Core' | 'Systems' | 'Database' | 'Container' | 'VCS' | 'Detection' | 'Framework' | 'Standards' | 'Infra' | 'Intelligence';
  description: string;
  icon: string;
  accentColor: string;
  defenseRole: string;
}

export type SceneMode = 'globe' | 'server' | 'mesh' | 'free';

export interface SimulatedIncident {
  id: string;
  stage: 'idle' | 'inbound' | 'incident_generated' | 'containing' | 'resolved';
  targetNode: string;
  targetIp: string;
  vector: string;
  technique: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ELEVATED' | 'NOMINAL' | 'RESOLVED';
  message: string;
  progress: number;
  timestamp: string;
}
