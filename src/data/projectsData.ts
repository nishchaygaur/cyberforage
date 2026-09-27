import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'audit-platform',
    slug: 'audit-platform',
    title: 'Audit Platform',
    subtitle: 'A secure, web-based audit management platform.',
    description: 'CyberForage Audit Platform is a secure, modern, web-based audit management solution designed to simplify and centralize the end-to-end audit lifecycle, from planning and risk assessment to evidence collection, control evaluation, findings management, reporting, and audit closure.',
    longDescription: 'Engineered for CISOs, compliance auditors, and security engineers. Provides real-time posture assessment, cryptographic evidence hashing, and seamless mapping to SOC2, ISO 27001, and NIST CSF frameworks with automated audit trail verification.',
    accent: 'rose',
    tags: ['AuditManagement', 'Compliance', 'GRC', 'ZeroTrust', 'EvidenceVault'],
    project_url: 'https://audit.cyberforage.space/',
    demo_url: 'https://audit.cyberforage.space/',
    github_url: 'https://audit.cyberforage.space/docs',
    documentation_url: 'https://audit.cyberforage.space/docs',
    featured: true,
    status: 'active',
    category: 'Auditing',
    year: '2026',
    metrics: [
      { label: 'Framework Controls', value: '450+' },
      { label: 'Evidence Encryption', value: 'AES-256-GCM' },
      { label: 'Audit Velocity', value: '3.4x Faster' }
    ]
  },
  {
    id: 'cyberforge',
    slug: 'cyberforge',
    title: 'CyberForge',
    subtitle: 'Advanced Attack Simulation & Defense Lab',
    description: 'A controlled environment for attack simulation, defensive validation, telemetry and detection evaluation.',
    longDescription: 'Simulates modern adversary TTPs (Techniques, Tactics, and Procedures) against target endpoints and networks, generating rich telemetry streams (Sysmon, Zeek, Auditd) to rigorously validate SIEM correlation logic and automated defensive countermeasures.',
    accent: 'purple',
    tags: ['Attack Simulation', 'Defense Lab', 'Telemetry', 'MITRE ATT&CK', 'AdversaryEmulation'],
    project_url: 'https://cyberforage.space',
    demo_url: 'https://cyberforage.space',
    featured: true,
    status: 'active',
    category: 'Attack Simulation',
    year: '2026',
    metrics: [
      { label: 'Simulated Scenarios', value: '42' },
      { label: 'Detection Fidelity', value: '98.7%' },
      { label: 'Adversary TTPs', value: 'MITRE v14' }
    ]
  },
  {
    id: 'pdf-malware-analyzer',
    slug: 'pdf-malware-analyzer',
    title: 'PDF Malware Analyzer',
    subtitle: 'Detects malicious behavior in PDF files.',
    description: 'Analyzes PDF structure, behavior and indicators to identify potential threats using deep structural parsing and signature matching.',
    longDescription: 'Performs deep static inspection on untrusted PDF objects, analyzing JavaScript streams, OpenAction triggers, embedded binaries, and obfuscated shellcode with custom YARA rule compilation and zero sandbox detonation risk.',
    accent: 'rose',
    tags: ['Malware Detection', 'Static Analysis', 'YARA', 'PDF Parser', 'Heuristics'],
    project_url: 'https://pdfanalyzer.cyberforage.space/',
    demo_url: 'https://pdfanalyzer.cyberforage.space/',
    featured: true,
    status: 'active',
    category: 'Malware Analysis',
    year: '2026',
    metrics: [
      { label: 'Parse Time', value: '< 250ms' },
      { label: 'YARA Signatures', value: '1,200+' },
      { label: 'False Positive Rate', value: '0.04%' }
    ]
  },
  {
    id: 'sentinelx',
    slug: 'sentinelx',
    title: 'SentinelX',
    subtitle: 'AI-Powered SOC & Threat Intelligence Platform',
    description: 'Collects, normalizes and analyzes logs, detects threats, enriches with intelligence and maps to MITRE ATT&CK.',
    longDescription: 'An autonomous defensive orchestrator that ingests high-volume telemetry across multi-cloud and on-premise sources. Utilizes fine-tuned security models for threat enrichment, triage reasoning, and automated containment action generation.',
    accent: 'cyan',
    tags: ['Alert', 'Detect', 'Enrich', 'Incident', 'Logs', 'MITRE', 'Risk', 'AI Agent'],
    featured: true,
    status: 'in_development',
    category: 'SOC Platform',
    year: '2026',
    metrics: [
      { label: 'Pipeline Throughput', value: '100k EPS' },
      { label: 'Triage Latency', value: '< 1.8s' },
      { label: 'AI Confidence', value: '96.2%' }
    ]
  }
];
