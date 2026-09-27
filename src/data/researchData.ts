import { ResearchDomain, ResearchArticle } from '../types';

export const researchDomains: ResearchDomain[] = [
  {
    id: 'cyber-defense',
    title: 'Cyber Defense',
    description: 'SOC, detection engineering, SIEM, incident response.',
    color: '#00F0C0',
    icon: 'shield',
    topics: ['SOC Architecture', 'Detection Engineering', 'SIEM Correlation', 'Incident Triage', 'Playbook Automation']
  },
  {
    id: 'threat-intelligence',
    title: 'Threat Intelligence',
    description: 'Threat analysis, indicators, MITRE ATT&CK, enrichment.',
    color: '#60A5FA',
    icon: 'crosshair',
    topics: ['Adversary Profiling', 'MITRE ATT&CK Mapping', 'IoC Feeds & STIX/TAXII', 'Campaign Tracking', 'Telemetry Enrichment']
  },
  {
    id: 'security-research',
    title: 'Security Research',
    description: 'Vulnerability research, malware analysis, DFIR.',
    color: '#C084FC',
    icon: 'flask-conical',
    topics: ['Binary Reverse Engineering', 'Zero-Day Vulnerability Triage', 'DFIR Investigation', 'Sandbox Detonation', 'Fuzzing']
  },
  {
    id: 'ai-security',
    title: 'AI × Security',
    description: 'AI-assisted analysis, security agents, ML.',
    color: '#34D399',
    icon: 'cpu',
    topics: ['Agentic Security Workflows', 'Fine-Tuned LLM Triage', 'Anomaly Detection Models', 'Adversarial AI Defense', 'Automated Remediation']
  },
  {
    id: 'cloud-enterprise',
    title: 'Cloud & Enterprise',
    description: 'Identity, endpoint, Zero Trust, Microsoft security.',
    color: '#38BDF8',
    icon: 'cloud',
    topics: ['Zero Trust Architecture', 'Entra ID & IAM Hardening', 'Kubernetes Security', 'Cloud Threat Hunting', 'Posture Management']
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Security workflows, AI automation, orchestration.',
    color: '#FBBF24',
    icon: 'settings',
    topics: ['SOAR Pipeline Engineering', 'n8n Security Pipelines', 'Automated Containment', 'Webhook Ingestion', 'Telemetry Normalization']
  }
];

export const researchArticles: ResearchArticle[] = [
  {
    id: 'understanding-modern-phishing',
    title: 'Understanding Modern Phishing Tactics',
    category: 'Threat Intelligence',
    date: 'May 28, 2025',
    readTime: '6 min read',
    summary: 'A deep dive into current phishing techniques, adversary-in-the-middle (AiTM) proxies, session token exfiltration, and practical detection strategies.',
    content: [
      'Modern phishing has evolved far beyond rudimentary credential harvesting pages. Today\'s threat actors employ sophisticated Adversary-in-the-Middle (AiTM) proxy frameworks (such as Evilginx3 and Muraena) that sit transparently between the victim and legitimate authentication identity providers.',
      'By proxying the authentication handshake in real time, attackers bypass standard Multi-Factor Authentication (MFA) mechanisms by intercepting the authenticated session cookies and OAuth access tokens post-verification.',
      'Effective defense requires shifting from legacy domain reputation blocks to continuous token binding, FIDO2 WebAuthn cryptographic verification, and behavioral analysis on concurrent session IPs across geographic bounds.'
    ],
    keyTakeaways: [
      'AiTM frameworks proxy legitimate login pages to harvest session tokens in real time.',
      'Traditional OTP/SMS-based MFA is insufficient against modern proxy infrastructures.',
      'FIDO2/WebAuthn credentials provide cryptographic resistance to origin spoofing.',
      'Conditional access policies must evaluate continuous token anomalies and IP telemetry.'
    ],
    threatIndicators: [
      'Rapid IP change between authentication and subsequent session activity',
      'Missing device health signals in session token claims',
      'HTTP referrers pointing to freshly registered bulletproof hosted domains'
    ]
  },
  {
    id: 'rise-of-stealer-malware',
    title: 'The Rise of Stealer Malware',
    category: 'Security Research',
    date: 'May 19, 2025',
    readTime: '8 min read',
    summary: 'Analyzing the latest trends in information stealers (RedLine, Lumma, Vidar), their in-memory obfuscation, browser database decryption, and enterprise impact.',
    content: [
      'Information stealers have become the vanguard of enterprise intrusion. Rather than deploying noisier ransomware initially, threat actors leverage commodity stealers to silently harvest credentials, cryptocurrency wallets, VPN profiles, and browser session caches.',
      'Modern variants utilize sophisticated anti-analysis tricks: dynamic API resolving via hashing, execution delays tied to mouse movement, and direct NT syscalls to evade endpoint detection and response (EDR) user-mode hooks.',
      'Extracted logs are bundled into compressed archives and exfiltrated over Telegram Bot APIs, encrypted Discord webhooks, or obscure custom C2 protocols, feeding directly into darknet criminal marketplaces within minutes.'
    ],
    keyTakeaways: [
      'Stealer logs represent the primary vector fueling modern corporate initial access brokers.',
      'Browser master key decryption in DPAPI is targeted within milliseconds of execution.',
      'EDR bypasses rely heavily on unhooked direct system calls and stealthy memory injection.',
      'Enterprise defense requires prompt session invalidation and strict credential hygiene.'
    ],
    threatIndicators: [
      'Access to %LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data',
      'Unusual outbound connections to api.telegram.org from non-browser binaries',
      'Dynamic loading of crypt32.dll and vaultcli.dll from temp folder executions'
    ]
  },
  {
    id: 'llms-in-cybersecurity-operations',
    title: 'LLMs in Cybersecurity Operations',
    category: 'AI & Security',
    date: 'May 12, 2025',
    readTime: '10 min read',
    summary: 'How large language models and autonomous AI agents are changing threat detection, alert correlation, automated triage, and defensive orchestration.',
    content: [
      'The convergence of Generative AI and defensive security operations offers a monumental paradigm shift for overburdened Security Operations Centers (SOCs). Tier-1 alert fatigue has long been the primary bottleneck in incident response.',
      'By grounding specialized LLMs with structured telemetry schemas, MITRE ATT&CK taxonomies, and internal network asset graph databases, defensive systems can perform instantaneous root-cause analysis on anomalous event chains.',
      'Crucially, production implementations must employ deterministic guardrails and human-in-the-loop verification for destructive containment actions, ensuring automated response speed without unintended collateral disruption.'
    ],
    keyTakeaways: [
      'Autonomous security agents drastically compress mean-time-to-triage (MTTT) from hours to seconds.',
      'Retrieval-Augmented Generation (RAG) tied to live SIEM telemetry minimizes hallucination risk.',
      'Fine-tuned models excel at de-obfuscating malicious PowerShell, bash, and macro scripts.',
      'Security architectures must maintain defensive isolation to avoid indirect prompt injections.'
    ],
    threatIndicators: [
      'Adversarial prompt injection attempts embedded within HTTP User-Agent strings or DNS queries',
      'Model extraction probing patterns against external AI inference endpoints'
    ]
  }
];
