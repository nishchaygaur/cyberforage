export interface NmapPort {
  port: number;
  protocol: 'tcp' | 'udp';
  state: 'open' | 'filtered' | 'closed';
  service: string;
  version: string;
  banner?: string;
  cveList?: {
    id: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    cvss: number;
  }[];
  scripts?: {
    name: string;
    output: string;
  }[];
}

export interface NmapTracerouteHop {
  hop: number;
  rtt: string;
  address: string;
  host?: string;
}

export interface NmapTargetPreset {
  id: string;
  name: string;
  ip: string;
  hostname: string;
  description: string;
  category: 'Gateway' | 'Database' | 'SCADA / ICS' | 'Cloud Edge' | 'Hostile Node';
  os: {
    deviceType: string;
    running: string;
    osCpe: string;
    osDetails: string;
    uptime: string;
    tcpSequence: string;
  };
  latencyMs: number;
  ports: NmapPort[];
  traceroute: NmapTracerouteHop[];
}

export const NMAP_PRESETS: NmapTargetPreset[] = [
  {
    id: 'gateway',
    name: 'Perimeter Defense Gateway',
    ip: '192.168.1.1',
    hostname: 'gateway.cyberforage.internal',
    description: 'Hardware edge router and stateful packet firewall protecting internal research subnet.',
    category: 'Gateway',
    latencyMs: 0.82,
    os: {
      deviceType: 'Router / Firewall',
      running: 'Linux 6.1 (Debian 12 Bookworm)',
      osCpe: 'cpe:/o:linux:linux_kernel:6.1',
      osDetails: 'Linux 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1',
      uptime: '42 days, 16:24:11',
      tcpSequence: 'Difficulty=254 (Good luck!)',
    },
    ports: [
      {
        port: 22,
        protocol: 'tcp',
        state: 'open',
        service: 'ssh',
        version: 'OpenSSH 9.3p1 Debian 1',
        banner: 'SSH-2.0-OpenSSH_9.3p1 Debian-1ubuntu3.3',
        scripts: [
          {
            name: 'ssh-hostkey',
            output: '256 7a:2b:88:41:9f:02:11:cc:99 (ED25519)\n256 a1:b4:9c:88:76:44:aa:bb:cc (ECDSA)',
          },
          {
            name: 'ssh-auth-methods',
            output: 'Supported authentication: publickey',
          },
        ],
      },
      {
        port: 53,
        protocol: 'tcp',
        state: 'open',
        service: 'domain',
        version: 'dnsmasq 2.89',
        banner: 'dnsmasq-2.89 (Cache: 4096 records)',
        scripts: [
          {
            name: 'dns-cache-snoop',
            output: 'DNS Cache snooping enabled. Response time: 0.44ms',
          },
        ],
      },
      {
        port: 80,
        protocol: 'tcp',
        state: 'open',
        service: 'http',
        version: 'nginx 1.24.0',
        banner: 'Server: nginx/1.24.0',
        scripts: [
          {
            name: 'http-title',
            output: '301 Moved Permanently -> https://gateway.cyberforage.internal/',
          },
        ],
      },
      {
        port: 443,
        protocol: 'tcp',
        state: 'open',
        service: 'ssl/https',
        version: 'nginx 1.24.0 (TLSv1.3)',
        banner: 'TLS 1.3 / Strict-Transport-Security: max-age=31536000',
        scripts: [
          {
            name: 'ssl-cert',
            output: 'Subject: CN=gateway.cyberforage.internal\nIssuer: Cyberforage Internal Root CA\nValidity: Not after 2028-12-31',
          },
          {
            name: 'http-security-headers',
            output: 'HSTS: max-age=31536000; includeSubDomains\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff',
          },
        ],
      },
      {
        port: 8080,
        protocol: 'tcp',
        state: 'open',
        service: 'http-proxy',
        version: 'Traefik Proxy 2.10.7',
        banner: 'Traefik Reverse Proxy API / Dashboard',
        scripts: [
          {
            name: 'http-auth',
            output: 'HTTP 401 Unauthorized: Basic realm="Traefik Bastion"',
          },
        ],
      },
      {
        port: 179,
        protocol: 'tcp',
        state: 'filtered',
        service: 'bgp',
        version: 'Babel / BGP Border Gateway',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.41 ms', address: '192.168.1.254', host: 'switch-agg-01.local' },
      { hop: 2, rtt: '0.82 ms', address: '192.168.1.1', host: 'gateway.cyberforage.internal' },
    ],
  },
  {
    id: 'database',
    name: 'Secure Telemetry & Auth Cluster',
    ip: '10.0.0.45',
    hostname: 'cluster-master.db.corp',
    description: 'Enterprise data tier running encrypted PostgreSQL, MySQL replication, and Redis cache.',
    category: 'Database',
    latencyMs: 1.45,
    os: {
      deviceType: 'General Purpose Server',
      running: 'Linux 5.15 (Ubuntu 22.04 LTS)',
      osCpe: 'cpe:/o:canonical:ubuntu_linux:22.04',
      osDetails: 'Linux 5.15.0-105-generic #115-Ubuntu SMP',
      uptime: '189 days, 04:12:09',
      tcpSequence: 'Difficulty=260 (Good luck!)',
    },
    ports: [
      {
        port: 22,
        protocol: 'tcp',
        state: 'open',
        service: 'ssh',
        version: 'OpenSSH 8.9p1 Ubuntu 3ubuntu0.7',
        banner: 'SSH-2.0-OpenSSH_8.9p1',
      },
      {
        port: 3306,
        protocol: 'tcp',
        state: 'open',
        service: 'mysql',
        version: 'MySQL Community Server 8.0.35',
        banner: 'Protocol 10 / Salt: 0x9f4a21e7',
        scripts: [
          {
            name: 'mysql-info',
            output: 'Protocol: 10\nVersion: 8.0.35\nAuth Plugin: caching_sha2_password\nStatus: SSL Active',
          },
        ],
      },
      {
        port: 5432,
        protocol: 'tcp',
        state: 'open',
        service: 'postgresql',
        version: 'PostgreSQL DB 15.4 (Ubuntu 15.4-1.pgdg22.04+1)',
        scripts: [
          {
            name: 'ssl-cert',
            output: 'Subject: CN=db.corp.internal\nTLS Cipher: TLS_AES_256_GCM_SHA384',
          },
        ],
      },
      {
        port: 6379,
        protocol: 'tcp',
        state: 'open',
        service: 'redis',
        version: 'Redis key-value store 7.2.1',
        banner: 'Redis 7.2.1 64 bit standalone',
        scripts: [
          {
            name: 'redis-info',
            output: 'requirepass: active\nConnected clients: 18\nUsed memory: 412.8M\nKeyspace: 1,489,201 keys',
          },
        ],
      },
      {
        port: 9100,
        protocol: 'tcp',
        state: 'open',
        service: 'prometheus',
        version: 'Prometheus Node Exporter 1.6.1',
        scripts: [
          {
            name: 'http-title',
            output: 'Node Exporter Metrics [CPU: 14%, RAM: 38%]',
          },
        ],
      },
      {
        port: 27017,
        protocol: 'tcp',
        state: 'filtered',
        service: 'mongodb',
        version: 'MongoDB Enterprise Database',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.35 ms', address: '10.0.0.1', host: 'core-vlan-gateway.corp' },
      { hop: 2, rtt: '1.45 ms', address: '10.0.0.45', host: 'cluster-master.db.corp' },
    ],
  },
  {
    id: 'scada',
    name: 'Industrial SCADA / ICS PLC Controller',
    ip: '172.16.42.100',
    hostname: 'plc-s7-1500.ot.facility',
    description: 'Operational Technology substation with Siemens S7Comm PLC & Schneider Modbus TCP actuators.',
    category: 'SCADA / ICS',
    latencyMs: 7.85,
    os: {
      deviceType: 'Industrial Controller / Embedded RTOS',
      running: 'Siemens SIMATIC S7 / VxWorks 7.0',
      osCpe: 'cpe:/o:siemens:simatic_s7_firmware:2.9',
      osDetails: 'SIMATIC S7-1500 CPU 1516F-3 PN/DP (Firmware v2.9.2)',
      uptime: '412 days, 11:02:44',
      tcpSequence: 'Difficulty=198 (Predictable)',
    },
    ports: [
      {
        port: 80,
        protocol: 'tcp',
        state: 'open',
        service: 'http',
        version: 'Siemens SIMATIC Web Server 2.9',
        banner: 'SIMATIC S7-1500 Diagnostics Portal',
        scripts: [
          {
            name: 'http-title',
            output: 'Siemens SIMATIC S7-1500 CPU 1516F-3 PN/DP Diagnostics',
          },
        ],
      },
      {
        port: 102,
        protocol: 'tcp',
        state: 'open',
        service: 'iso-tsap',
        version: 'Siemens S7Comm Industrial Protocol',
        banner: 'System: SIMATIC S7-1500 / Module 6ES7 516-3FN02-0AB0',
        scripts: [
          {
            name: 's7-info',
            output: 'Module: CPU 1516F-3 PN/DP\nHardware: 6ES7 516-3FN02-0AB0\nFirmware: 2.9.2\nPLC Mode: RUN\nSafety Function: OK',
          },
        ],
      },
      {
        port: 502,
        protocol: 'tcp',
        state: 'open',
        service: 'modbus',
        version: 'Modbus TCP / Schneider Electric M340',
        banner: 'Unit ID: 1, Device: Schneider Premium/M340',
        scripts: [
          {
            name: 'modbus-discover',
            output: 'Slave ID: 1\nDevice: Schneider Electric Modicon M340\nMemory Map: Holding Registers 40001-40250 available without auth',
          },
        ],
        cveList: [
          {
            id: 'CVE-2022-45788',
            severity: 'HIGH',
            title: 'Schneider Electric Modicon Insecure Authentication Bypass',
            cvss: 7.8,
          },
        ],
      },
      {
        port: 44818,
        protocol: 'tcp',
        state: 'open',
        service: 'ethernet-ip',
        version: 'Rockwell Automation CIP Ethernet/IP',
        scripts: [
          {
            name: 'enip-info',
            output: 'Vendor: Rockwell Automation/Allen-Bradley\nProduct: 1756-EN2T/A EtherNet/IP Bridge',
          },
        ],
      },
      {
        port: 21,
        protocol: 'tcp',
        state: 'filtered',
        service: 'ftp',
        version: 'Embedded FTP diagnostics',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.85 ms', address: '172.16.1.1', host: 'it-ot-firewall-dmz.local' },
      { hop: 2, rtt: '3.40 ms', address: '172.16.42.1', host: 'scada-zone-gateway.ot' },
      { hop: 3, rtt: '7.85 ms', address: '172.16.42.100', host: 'plc-s7-1500.ot.facility' },
    ],
  },
  {
    id: 'cloud_edge',
    name: 'Production Cloud Perimeter & API',
    ip: '104.21.78.14',
    hostname: 'perimeter.cyberforage.space',
    description: 'High-availability global edge proxy with Cloudflare WAF, HTTP/3, and DDoS mitigation.',
    category: 'Cloud Edge',
    latencyMs: 12.35,
    os: {
      deviceType: 'Cloud Edge Anycast Proxy',
      running: 'Linux / Hardened Cloudflare OS',
      osCpe: 'cpe:/o:linux:linux_kernel',
      osDetails: 'Cloudflare Edge Anycast Node (IAD POP)',
      uptime: 'Unknown (Layer 7 Proxy)',
      tcpSequence: 'Difficulty=260 (Good luck!)',
    },
    ports: [
      {
        port: 80,
        protocol: 'tcp',
        state: 'open',
        service: 'http',
        version: 'Cloudflare Edge Proxy (HTTP/1.1)',
        scripts: [
          {
            name: 'http-title',
            output: '301 Moved Permanently -> https://cyberforage.space/',
          },
        ],
      },
      {
        port: 443,
        protocol: 'tcp',
        state: 'open',
        service: 'ssl/https',
        version: 'Cloudflare HTTP/3 Quic & TLS 1.3',
        scripts: [
          {
            name: 'ssl-cert',
            output: 'Subject: CN=cyberforage.space\nIssuer: Google Trust Services LLC\nALPN: h3, h2, http/1.1',
          },
          {
            name: 'http-waf-detect',
            output: 'Cloudflare WAF / Bot Management active. Zero anomalies triggered.',
          },
        ],
      },
      {
        port: 2222,
        protocol: 'tcp',
        state: 'open',
        service: 'ssh',
        version: 'OpenSSH 9.6p1 (Bastion Gateway)',
        scripts: [
          {
            name: 'ssh-auth-methods',
            output: 'Public Key + FIDO2 Hardware Token required',
          },
        ],
      },
      {
        port: 8443,
        protocol: 'tcp',
        state: 'filtered',
        service: 'https-alt',
        version: 'Cloudflare Admin Socket',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '1.12 ms', address: '192.168.1.1', host: 'local-router.home' },
      { hop: 2, rtt: '4.85 ms', address: '10.244.0.1', host: 'isp-pop-node.net' },
      { hop: 3, rtt: '12.35 ms', address: '104.21.78.14', host: 'perimeter.cyberforage.space' },
    ],
  },
  {
    id: 'hostile_node',
    name: 'Suspicious Adversary Honeypot Node',
    ip: '198.51.100.99',
    hostname: 'apt-beacon-04.darknet.ru',
    description: 'Quarantined honeypot simulating a compromised legacy Linux server with known vulnerabilities.',
    category: 'Hostile Node',
    latencyMs: 34.2,
    os: {
      deviceType: 'Compromised Host / Honeypot',
      running: 'Linux 2.6.X / 3.X (Red Hat / CentOS 5)',
      osCpe: 'cpe:/o:redhat:enterprise_linux:5',
      osDetails: 'Linux 2.6.18-194.el5 #1 SMP (Outdated)',
      uptime: '1,280 days, 22:10:04',
      tcpSequence: 'Difficulty=120 (Trivial prediction)',
    },
    ports: [
      {
        port: 21,
        protocol: 'tcp',
        state: 'open',
        service: 'ftp',
        version: 'vsftpd 2.3.4 (Backdoored)',
        banner: '220 (vsFTPd 2.3.4)',
        cveList: [
          {
            id: 'CVE-2011-2523',
            severity: 'CRITICAL',
            title: 'vsftpd 2.3.4 Smiley Face Backdoor RCE (Root shell on port 6200)',
            cvss: 9.8,
          },
        ],
        scripts: [
          {
            name: 'ftp-vsftpd-backdoor',
            output: 'VULNERABLE: vsftpd 2.3.4 smiley face backdoor is PRESENT. Triggering username with :) spawns root bind shell.',
          },
        ],
      },
      {
        port: 22,
        protocol: 'tcp',
        state: 'open',
        service: 'ssh',
        version: 'Cowrie SSH Honeypot 0.9.1',
        banner: 'SSH-2.0-OpenSSH_5.3 (Emulated)',
      },
      {
        port: 445,
        protocol: 'tcp',
        state: 'open',
        service: 'microsoft-ds',
        version: 'Samba smbd 3.0.20-Debian',
        cveList: [
          {
            id: 'CVE-2007-2447',
            severity: 'CRITICAL',
            title: 'Samba 3.0.20 "Username map script" Command Execution',
            cvss: 9.8,
          },
        ],
        scripts: [
          {
            name: 'samba-vuln-cve-2007-2447',
            output: 'VULNERABLE: Remote code execution verified via MS-RPC username shell metacharacters.',
          },
        ],
      },
      {
        port: 4444,
        protocol: 'tcp',
        state: 'open',
        service: 'metasploit-payload',
        version: 'Metasploit Meterpreter Reverse Shell Listener',
        cveList: [
          {
            id: 'ALERT-SHELL-ACTIVE',
            severity: 'CRITICAL',
            title: 'Live interactive socket detected on classic Metasploit port 4444',
            cvss: 10.0,
          },
        ],
      },
      {
        port: 8888,
        protocol: 'tcp',
        state: 'open',
        service: 'http',
        version: 'Python SimpleHTTP/0.6 Python/3.9.2',
        banner: 'Directory listing: /loot_exfil/',
        scripts: [
          {
            name: 'http-dir-listing',
            output: 'Found index of /loot_exfil/: password_dump.txt, credentials.kdbx, shadow.bak',
          },
        ],
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.92 ms', address: '192.168.1.1', host: 'gateway.local' },
      { hop: 2, rtt: '11.4 ms', address: '198.51.100.1', host: 'darknet-transit-as99.net' },
      { hop: 3, rtt: '34.2 ms', address: '198.51.100.99', host: 'apt-beacon-04.darknet.ru' },
    ],
  },
];

/**
 * Dynamically synthesizes a realistic Nmap target preset for any arbitrary custom IP or domain.
 */
export function synthesizeCustomTarget(targetInput: string): NmapTargetPreset {
  const cleanInput = targetInput.trim() || '192.168.1.100';
  let hash = 0;
  for (let i = 0; i < cleanInput.length; i++) {
    hash = (hash << 5) - hash + cleanInput.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const portPool = [
    { port: 22, service: 'ssh', version: 'OpenSSH 9.0p1' },
    { port: 80, service: 'http', version: 'nginx 1.22.1' },
    { port: 443, service: 'ssl/https', version: 'nginx 1.22.1 (TLS 1.3)' },
    { port: 3306, service: 'mysql', version: 'MySQL 8.0.32' },
    { port: 5432, service: 'postgresql', version: 'PostgreSQL 14.6' },
    { port: 6379, service: 'redis', version: 'Redis 6.2.7' },
    { port: 8080, service: 'http-proxy', version: 'Node.js Express / Envoy' },
    { port: 9000, service: 'cslistener', version: 'Custom Golang Daemon' },
  ];

  // Pick 3-5 open ports deterministically based on input hash
  const numPorts = 3 + (absHash % 3);
  const selectedPorts: NmapPort[] = [];

  for (let i = 0; i < numPorts; i++) {
    const item = portPool[(absHash + i) % portPool.length];
    if (!selectedPorts.some((p) => p.port === item.port)) {
      selectedPorts.push({
        port: item.port,
        protocol: 'tcp',
        state: 'open',
        service: item.service,
        version: item.version,
        banner: `${item.service} server ready on ${cleanInput}`,
        scripts: [
          {
            name: `${item.service}-banner`,
            output: `Probe response verified: 200 OK from port ${item.port}`,
          },
        ],
      });
    }
  }

  // Add 1 filtered port
  selectedPorts.push({
    port: 21,
    protocol: 'tcp',
    state: 'filtered',
    service: 'ftp',
    version: 'Filtered by host firewall (iptables)',
  });

  return {
    id: `custom-${absHash}`,
    name: `Target: ${cleanInput}`,
    ip: cleanInput.includes('.') ? cleanInput : `192.168.${(absHash % 250) + 1}.50`,
    hostname: cleanInput.includes('.') ? cleanInput : `${cleanInput}.local`,
    description: `User-specified scan target resolved on local / remote segment.`,
    category: 'Gateway',
    latencyMs: +(5 + (absHash % 25) + 0.35).toFixed(2),
    os: {
      deviceType: 'General Purpose Linux',
      running: 'Linux 5.X | 6.X',
      osCpe: 'cpe:/o:linux:linux_kernel:5.15',
      osDetails: 'Linux 5.15.0-x86_64-generic (Heuristic Stack Fingerprint)',
      uptime: `${12 + (absHash % 80)} days, 08:14:02`,
      tcpSequence: 'Difficulty=258 (Good luck!)',
    },
    ports: selectedPorts,
    traceroute: [
      { hop: 1, rtt: '0.45 ms', address: '192.168.1.1', host: 'gateway.local' },
      { hop: 2, rtt: `${(4 + (absHash % 10)).toFixed(2)} ms`, address: '10.200.0.1', host: 'isp-hop.net' },
      { hop: 3, rtt: `${(12 + (absHash % 15)).toFixed(2)} ms`, address: cleanInput, host: cleanInput },
    ],
  };
}
