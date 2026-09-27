import { Lab } from '../types';

export const labsData: Lab[] = [
  {
    id: 'cyberforge-lab',
    name: 'CyberForge',
    slug: 'cyberforge-lab',
    description: 'Controlled attack simulation, defensive validation and telemetry evaluation.',
    fullOverview: 'Comprehensive adversary emulation lab modeled after state-sponsored threat actors. Test custom detection rules against realistic credential dumping, lateral movement via WMI/WinRM, and data staging vectors in an isolated cyber testbed.',
    category: 'Attack Simulation',
    difficulty: 'Intermediate',
    status: 'available',
    accent: '#A855F7',
    displayOrder: 1,
    attackVectors: [
      'T1003.001 - OS Credential Dumping: LSASS Memory',
      'T1047 - Windows Management Instrumentation Execution',
      'T1078 - Valid Accounts Domain Enumeration',
      'T1021.002 - Remote Services: SMB/Windows Admin Shares'
    ],
    defenseTechniques: [
      'LSA Protection (RunAsPPL) Hardening',
      'Sysmon Event ID 10 LSASS Process Access Auditing',
      'Network Segmentation & Zero-Trust RPC Filtering',
      'Behavioral Anomaly Detection on Inter-Host Communication'
    ],
    simulatedLogs: [
      '[SIM-EXEC] Initiating credential access emulation vector...',
      '[TELEMETRY] Sysmon Event ID 10: TargetProcessName: C:\\Windows\\System32\\lsass.exe',
      '[SIGMA] Rule "LSASS Read Access Suspicious Handle" matched with score 94',
      '[SOC-ALERT] High severity detection fired -> Triggered automated isolation workflow'
    ]
  },
  {
    id: 'detection-engineering',
    name: 'Detection Engineering',
    slug: 'detection-engineering',
    description: 'Hands-on detection engineering, SIEM rules and threat detection pipelines.',
    fullOverview: 'Build, benchmark, and fine-tune high-fidelity detection engineering pipelines. Formulate Sigma and YARA-L rules, reduce false positives via statistical baseline filters, and evaluate threat detection resilience against evasion techniques.',
    category: 'SOC',
    difficulty: 'Intermediate',
    status: 'available',
    accent: '#00F0C0',
    displayOrder: 2,
    attackVectors: [
      'T1059.001 - PowerShell Obfuscated Payload Execution',
      'T1543.003 - Create or Modify System Process: Windows Service',
      'T1053.005 - Scheduled Task / Job Persistence',
      'T1027 - Obfuscated / Encoded Commands via Base64'
    ],
    defenseTechniques: [
      'PowerShell Script Block Logging (Event ID 4104)',
      'Constrained Language Mode (CLM) Enactment',
      'Correlation Rules for Parent-Child Process Anomalies',
      'SIEM Alert Tuning & Automated Noise Suppression'
    ],
    simulatedLogs: [
      '[PIPELINE] Ingested 14,200 event records from Windows Security channel',
      '[CORRELATION] Match detected: Encoded PowerShell spawning cmd.exe from AppData',
      '[SIGMA-ENGINE] Rule applied: Suspicious PowerShell Encoded Command (ID: 4104)',
      '[TELEMETRY] Generated high-fidelity alert envelope with enriched process lineage'
    ]
  },
  {
    id: 'dfir-lab',
    name: 'DFIR',
    slug: 'dfir-lab',
    description: 'Digital forensics and incident response scenario investigation.',
    fullOverview: 'Step into real breach forensic scenarios. Inspect memory dumps, reconstruct Master File Table (MFT) timelines, decode Windows Registry artifacts (Shimcache, Amcache, UserAssist), and pinpoint threat actor initial access milestones.',
    category: 'Forensics',
    difficulty: 'Advanced',
    status: 'available',
    accent: '#38BDF8',
    displayOrder: 3,
    attackVectors: [
      'T1070.004 - File Deletion & Timestomping Anti-Forensics',
      'T1547.001 - Registry Run Keys / Startup Folder Abuse',
      'T1055 - Process Injection into svchost.exe',
      'T1110 - Brute Force Password Spraying on External Gateway'
    ],
    defenseTechniques: [
      'Volatility3 Memory Image Analysis & VAD Tree Inspection',
      'MFT & USN Journal Timeline Reconstruction',
      'Prefetch & Shimcache Execution Proving',
      'Network Flow & TLS Certificate SNI Forensics'
    ],
    simulatedLogs: [
      '[FORENSICS] Memory image dump triage loaded: win10_enterprise_x64.raw',
      '[VOLATILITY] malfind scan located executable injected memory region in PID 4820',
      '[TIMELINE] Reconstructed initial foothold artifact at 2026-09-12 04:18:22 UTC',
      '[REPORT] Artifact evidence sealed with SHA-256 integrity hash verification'
    ]
  },
  {
    id: 'malware-analysis-lab',
    name: 'Malware Analysis',
    slug: 'malware-analysis-lab',
    description: 'Static and dynamic analysis of suspicious binaries and documents.',
    fullOverview: 'Perform safe reverse engineering and binary analysis of untrusted samples. Extract command-and-control (C2) domains, reverse polymorphic packers, inspect import address tables (IAT), and author robust YARA detection signatures.',
    category: 'Analysis',
    difficulty: 'Advanced',
    status: 'available',
    accent: '#F43F5E',
    displayOrder: 4,
    attackVectors: [
      'T1204.002 - Malicious PDF / Office Document Execution',
      'T1027.002 - Software Packing & Dynamic PE Reconstruction',
      'T1497 - Virtualization / Sandbox Evasion via Hardware Timing',
      'T1071.001 - HTTPS Beaconing to Compromised Web Infrastructure'
    ],
    defenseTechniques: [
      'Disassembly & Decompilation via Ghidra / IDA Pro',
      'API Hooking & Dynamic System Call Tracing',
      'Entropy Analysis & Overlay Stripping',
      'YARA Rule Authoring & Memory Pattern Extraction'
    ],
    simulatedLogs: [
      '[SANDBOX] Ingested binary sample: invoice_sec_triage.pdf',
      '[PARSER] Located embedded stream object containing compressed JavaScript',
      '[YARA] Matched rule "Suspicious_PDF_Embedded_Launch" (Confidence: 99.8%)',
      '[IOC-EXTRACT] Extracted C2 domain: 198.51.100.44:8443 / SSL Issuer spoofed'
    ]
  },
  {
    id: 'network-security-lab',
    name: 'Network Security',
    slug: 'network-security-lab',
    description: 'Network traffic analysis, packet inspection and intrusion detection.',
    fullOverview: 'Analyze raw PCAP packet captures, identify unauthorized port scanning, decrypt rogue TLS handshakes, and configure Zeek & Suricata IDS rules to stop network-borne intrusions before perimeter defense breaches.',
    category: 'Networking',
    difficulty: 'Beginner',
    status: 'available',
    accent: '#10B981',
    displayOrder: 5,
    attackVectors: [
      'T1046 - Network Service Scanning & Discovery',
      'T1048.003 - Exfiltration Over Alternative Protocol (DNS Tunneling)',
      'T1557 - Adversary-in-the-Middle (ARP Spoofing)',
      'T1190 - Exploit Public-Facing Application'
    ],
    defenseTechniques: [
      'Suricata / Snort Signature Match Configuration',
      'Zeek Network Security Monitor Scripting',
      'DNS Query Length Anomaly Detection for Exfiltration Prevention',
      '802.1X Port Security & Dynamic ARP Inspection (DAI)'
    ],
    simulatedLogs: [
      '[SURICATA] Sniffing eth0 live interface: 4,120 pkts/sec',
      '[ALERT] ET SCAN Potential SSH Brute Force Attempt (10.0.8.21 -> 10.0.0.5)',
      '[ZEEK-CONN] Protocol mismatch: High frequency DNS TXT queries detected',
      '[FIREWALL] Rule #402 dynamically engaged: Block source IP for 3600 seconds'
    ]
  }
];
