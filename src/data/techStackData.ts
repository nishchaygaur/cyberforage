import { TechTool } from '../types';

export const techTools: TechTool[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'Core',
    description: 'Core language for cybersecurity tooling, automation, and data analysis.',
    icon: 'terminal',
    accentColor: '#38BDF8',
    defenseRole: 'Adversary emulation scripts, SIEM parsers, network socket monitors, and telemetry analysis.'
  },
  {
    id: 'linux',
    name: 'Linux',
    category: 'Systems',
    description: 'Primary operating environment for defense, analysis, and infrastructure.',
    icon: 'cpu',
    accentColor: '#FBBF24',
    defenseRole: 'Kernel auditing with eBPF, secure gateway deployment, and hardened sensor nodes.'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    description: 'Relational database for telemetry, state, and structured logs.',
    icon: 'database',
    accentColor: '#60A5FA',
    defenseRole: 'High-throughput time-series event storage, indicator indexing, and compliance log persistence.'
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'Container',
    description: 'Isolated execution environments for sandbox simulation and tooling.',
    icon: 'box',
    accentColor: '#38BDF8',
    defenseRole: 'Ephemeral malware detonation containers and isolated lab scenario environments.'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'VCS',
    description: 'Open-source code repositories, version control, and CI/CD.',
    icon: 'git-branch',
    accentColor: '#E2E8F0',
    defenseRole: 'Public security research collaboration, automated code security scanning, and release verification.'
  },
  {
    id: 'yara',
    name: 'YARA',
    category: 'Detection',
    description: 'Pattern matching Swiss knife for malware researchers and detection.',
    icon: 'shield-alert',
    accentColor: '#00F0C0',
    defenseRole: 'Hexadecimal and regex signature matching across memory dumps, PDFs, and binary executables.'
  },
  {
    id: 'mitre',
    name: 'MITRE ATT&CK',
    category: 'Framework',
    description: 'MITRE ATT&CK knowledge base of adversary tactics and techniques.',
    icon: 'target',
    accentColor: '#EF4444',
    defenseRole: 'Standardized taxonomy for modeling threat actor behaviors and evaluating defensive detection coverage.'
  },
  {
    id: 'nist',
    name: 'NIST CSF',
    category: 'Standards',
    description: 'NIST Cybersecurity Framework standards and defensive baselines.',
    icon: 'file-text',
    accentColor: '#10B981',
    defenseRole: 'Identify, Protect, Detect, Respond, Recover methodology implementation for enterprise audits.'
  },
  {
    id: 'cloud',
    name: 'Cloud & Zero Trust',
    category: 'Infra',
    description: 'Cloud infrastructure security, IAM, and zero-trust architecture.',
    icon: 'cloud',
    accentColor: '#38BDF8',
    defenseRole: 'Multi-cloud identity governance, least-privilege boundary enforcement, and serverless compute isolation.'
  },
  {
    id: 'ai-ml',
    name: 'AI & ML',
    category: 'Intelligence',
    description: 'Machine learning and LLMs applied to security telemetry and analysis.',
    icon: 'brain',
    accentColor: '#A855F7',
    defenseRole: 'Automated threat categorization, alert triage summarization, and anomalous behavior scoring.'
  }
];

export const ecosystemPillars = [
  {
    id: 'security',
    title: 'Security',
    tagline: 'Defensive Engineering & Research',
    color: '#00F0C0',
    icon: 'shield',
    items: ['SOC & Detection', 'Threat Intelligence', 'DFIR', 'Research'],
    stats: '99.4% Alert Fidelity'
  },
  {
    id: 'ai',
    title: 'AI',
    tagline: 'Intelligent Security Analytics',
    color: '#A855F7',
    icon: 'brain',
    items: ['AI Agents', 'ML Models', 'Security Analytics', 'Automation'],
    stats: '1.2s Triage Acceleration'
  },
  {
    id: 'automation',
    title: 'Automation',
    tagline: 'End-to-End Orchestration',
    color: '#00E5BE',
    icon: 'cog',
    items: ['Workflows', 'Orchestration', 'Data Processing', 'Intelligent Tools'],
    stats: 'Zero-Touch Containment'
  }
];
