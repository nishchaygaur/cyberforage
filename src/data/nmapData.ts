export interface NmapPort {
  port: number;
  protocol: 'tcp' | 'udp';
  state: 'open' | 'filtered' | 'closed' | 'open|filtered';
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
  category: 'Gateway' | 'Database' | 'SCADA / ICS' | 'Cloud Edge' | 'Hostile Node' | 'Subnet CIDR';
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
  udpPorts: NmapPort[];
  traceroute: NmapTracerouteHop[];
  isSubnet?: boolean;
  discoveredHosts?: { ip: string; hostname: string; latency: number; openPortsCount: number }[];
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
    udpPorts: [
      {
        port: 53,
        protocol: 'udp',
        state: 'open',
        service: 'domain',
        version: 'dnsmasq 2.89',
        banner: 'Recursive DNS resolver active',
      },
      {
        port: 67,
        protocol: 'udp',
        state: 'open|filtered',
        service: 'dhcps',
        version: 'ISC DHCP Server 4.4.3',
      },
      {
        port: 123,
        protocol: 'udp',
        state: 'open',
        service: 'ntp',
        version: 'Chrony NTP v4.3',
      },
      {
        port: 161,
        protocol: 'udp',
        state: 'open',
        service: 'snmp',
        version: 'SNMPv2c (community: public)',
      },
      {
        port: 51820,
        protocol: 'udp',
        state: 'open',
        service: 'wireguard',
        version: 'WireGuard VPN Kernel Interface',
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
    udpPorts: [
      {
        port: 123,
        protocol: 'udp',
        state: 'open',
        service: 'ntp',
        version: 'Systemd-timesyncd NTP',
      },
      {
        port: 161,
        protocol: 'udp',
        state: 'filtered',
        service: 'snmp',
        version: 'Restricted by iptables',
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
    udpPorts: [
      {
        port: 502,
        protocol: 'udp',
        state: 'open',
        service: 'modbus',
        version: 'Modbus UDP Daemon',
      },
      {
        port: 2222,
        protocol: 'udp',
        state: 'open',
        service: 'ethernet-ip',
        version: 'CIP I/O Messaging Port',
      },
      {
        port: 47808,
        protocol: 'udp',
        state: 'open',
        service: 'bacnet',
        version: 'BACnet Building Automation Protocol',
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
    udpPorts: [
      {
        port: 443,
        protocol: 'udp',
        state: 'open',
        service: 'quic',
        version: 'HTTP/3 Cloudflare Edge QUIC Protocol',
      },
      {
        port: 53,
        protocol: 'udp',
        state: 'open',
        service: 'domain',
        version: 'Cloudflare Anycast DNS (1.1.1.1 backend)',
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
    udpPorts: [
      {
        port: 69,
        protocol: 'udp',
        state: 'open',
        service: 'tftp',
        version: 'TFTP Server (unauthenticated download)',
      },
      {
        port: 514,
        protocol: 'udp',
        state: 'open',
        service: 'syslog',
        version: 'Syslog daemon tap',
      },
      {
        port: 1900,
        protocol: 'udp',
        state: 'open',
        service: 'upnp',
        version: 'SSDP / MiniUPnPd reflection agent',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.92 ms', address: '192.168.1.1', host: 'gateway.local' },
      { hop: 2, rtt: '11.4 ms', address: '198.51.100.1', host: 'darknet-transit-as99.net' },
      { hop: 3, rtt: '34.2 ms', address: '198.51.100.99', host: 'apt-beacon-04.darknet.ru' },
    ],
  },
  {
    id: 'scanme',
    name: 'Official Nmap Diagnostic Target',
    ip: '45.33.32.156',
    hostname: 'scanme.nmap.org',
    description: 'Official test machine set up by Gordon Lyon (Fyodor) and the Nmap project for diagnostic scans.',
    category: 'Cloud Edge',
    latencyMs: 38.5,
    os: {
      deviceType: 'General Purpose Server',
      running: 'Linux 5.X | 6.X (Ubuntu Linux)',
      osCpe: 'cpe:/o:canonical:ubuntu_linux:20.04',
      osDetails: 'Linux 5.4.0-105-generic #119-Ubuntu SMP x86_64',
      uptime: '382 days, 14:10:02',
      tcpSequence: 'Difficulty=256 (Good luck!)',
    },
    ports: [
      {
        port: 22,
        protocol: 'tcp',
        state: 'open',
        service: 'ssh',
        version: 'OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)',
        banner: 'SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.13',
        scripts: [
          {
            name: 'ssh-hostkey',
            output: '2048 ac:00:a0:1a:82:ff:a7:f3:99:ea:27:1d:4a:22:a0:80 (RSA)\n256 20:41:59:2e:8e:5b:ab:44:95:0b:15:60:b4:13:e2:8f (ECDSA)\n256 43:d2:9c:23:4b:57:aa:e2:58:31:54:b1:ca:ab:82:67 (ED25519)',
          },
        ],
      },
      {
        port: 80,
        protocol: 'tcp',
        state: 'open',
        service: 'http',
        version: 'Apache httpd 2.4.7 ((Ubuntu))',
        banner: 'HTTP/1.1 200 OK\nDate: Mon, 29 Sep 2026 UTC\nServer: Apache/2.4.7 (Ubuntu)\nContent-Type: text/html',
        scripts: [
          {
            name: 'http-title',
            output: 'Go ahead and ScanMe!',
          },
          {
            name: 'http-server-header',
            output: 'Apache/2.4.7 (Ubuntu)',
          },
        ],
      },
      {
        port: 9929,
        protocol: 'tcp',
        state: 'open',
        service: 'nping-echo',
        version: 'Nping echo',
        banner: 'Nping echo server running on port 9929',
      },
      {
        port: 31337,
        protocol: 'tcp',
        state: 'open',
        service: 'Elite',
        version: 'tcpwrapped',
        banner: 'Elite service wrapped connection',
      },
    ],
    udpPorts: [
      {
        port: 123,
        protocol: 'udp',
        state: 'open|filtered',
        service: 'ntp',
        version: 'NTP v4',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.45 ms', address: '192.168.1.1', host: 'gateway.local' },
      { hop: 2, rtt: '2.10 ms', address: '10.200.0.1', host: 'isp-gateway.net' },
      { hop: 3, rtt: '14.8 ms', address: '172.30.12.1', host: 'linode-router.net' },
      { hop: 4, rtt: '38.5 ms', address: '45.33.32.156', host: 'scanme.nmap.org' },
    ],
  },
  {
    id: 'dns-cloudflare',
    name: 'Cloudflare Fast Anycast Resolver',
    ip: '1.1.1.1',
    hostname: 'one.one.one.one',
    description: 'Cloudflare Privacy-first 1.1.1.1 recursive DNS resolver, DoH API, and DoT endpoint.',
    category: 'Cloud Edge',
    latencyMs: 3.2,
    os: {
      deviceType: 'Anycast DNS Cluster / Edge Router',
      running: 'Linux 5.X (Cloudflare Edge OS)',
      osCpe: 'cpe:/o:linux:linux_kernel:5',
      osDetails: 'Linux 5.15 Anycast BGP Edge Routing Cluster',
      uptime: '1240 days, 08:22:15',
      tcpSequence: 'Difficulty=260 (Good luck!)',
    },
    ports: [
      {
        port: 53,
        protocol: 'tcp',
        state: 'open',
        service: 'domain',
        version: 'Cloudflare DNS Resolver (DoH/DoT/BGP)',
        banner: 'Cloudflare Anycast DNS v1.1.1.1',
        scripts: [
          {
            name: 'dns-nsid',
            output: 'Cloudflare Edge POP: Ashburn (IAD)',
          },
          {
            name: 'dns-cache-snoop',
            output: 'Recursive caching enabled; latency: 0.12ms',
          },
        ],
      },
      {
        port: 80,
        protocol: 'tcp',
        state: 'open',
        service: 'http',
        version: 'cloudflare',
        banner: 'HTTP/1.1 301 Moved Permanently\nServer: cloudflare\nLocation: https://1.1.1.1/',
        scripts: [
          {
            name: 'http-server-header',
            output: 'cloudflare',
          },
          {
            name: 'http-title',
            output: '301 Moved Permanently',
          },
        ],
      },
      {
        port: 443,
        protocol: 'tcp',
        state: 'open',
        service: 'ssl/https',
        version: 'cloudflare (TLSv1.3)',
        banner: 'TLS 1.3 / Strict-Transport-Security: max-age=31536000\nServer: cloudflare\nContent-Type: application/dns-message',
        scripts: [
          {
            name: 'ssl-cert',
            output: 'Subject: CN=cloudflare-dns.com\nIssuer: DigiCert Global Root G2\nValid: 2026-01-01 to 2027-01-01',
          },
          {
            name: 'http-title',
            output: '1.1.1.1 — The free app that makes your Internet faster.',
          },
        ],
      },
      {
        port: 853,
        protocol: 'tcp',
        state: 'open',
        service: 'domain-s',
        version: 'DNS-over-TLS (DoT)',
        banner: 'RFC 7858 DNS over TLS on port 853',
      },
    ],
    udpPorts: [
      {
        port: 53,
        protocol: 'udp',
        state: 'open',
        service: 'domain',
        version: 'Cloudflare Recursive DNS',
      },
      {
        port: 123,
        protocol: 'udp',
        state: 'open',
        service: 'ntp',
        version: 'Cloudflare Time Services (time.cloudflare.com)',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.41 ms', address: '192.168.1.1', host: 'gateway.local' },
      { hop: 2, rtt: '1.85 ms', address: '10.200.0.1', host: 'edge-gw.net' },
      { hop: 3, rtt: '3.20 ms', address: '1.1.1.1', host: 'one.one.one.one' },
    ],
  },
  {
    id: 'dns-google',
    name: 'Google Public Anycast DNS',
    ip: '8.8.8.8',
    hostname: 'dns.google',
    description: 'Google Anycast Recursive DNS Resolver and RFC 8484 DNS-over-HTTPS (DoH) engine.',
    category: 'Cloud Edge',
    latencyMs: 4.1,
    os: {
      deviceType: 'Anycast DNS Resolver / Borg Cluster',
      running: 'Linux 5.X (Google Production Kernel)',
      osCpe: 'cpe:/o:google:linux:5',
      osDetails: 'Google Production OS (Borg Containerized Edge Infrastructure)',
      uptime: '1580 days, 19:44:31',
      tcpSequence: 'Difficulty=265 (Good luck!)',
    },
    ports: [
      {
        port: 53,
        protocol: 'tcp',
        state: 'open',
        service: 'domain',
        version: 'Google Public DNS (BGP Anycast)',
        banner: 'Google Anycast DNS Cluster',
        scripts: [
          {
            name: 'dns-nsid',
            output: 'gns-iad',
          },
          {
            name: 'dns-cache-snoop',
            output: 'Recursive caching enabled; Google Anycast mesh',
          },
        ],
      },
      {
        port: 443,
        protocol: 'tcp',
        state: 'open',
        service: 'ssl/https',
        version: 'HTTPServer2 (Google DoH Endpoint)',
        banner: 'HTTP/2 200 OK\nServer: scaffolding on HTTPServer2\nContent-Type: application/dns-message',
        scripts: [
          {
            name: 'ssl-cert',
            output: 'Subject: CN=dns.google\nIssuer: Google Trust Services LLC\nValid: 2026-01-01 to 2027-01-01',
          },
        ],
      },
      {
        port: 853,
        protocol: 'tcp',
        state: 'open',
        service: 'domain-s',
        version: 'DNS-over-TLS (RFC 7858)',
        banner: 'Google DNS over TLS daemon',
      },
    ],
    udpPorts: [
      {
        port: 53,
        protocol: 'udp',
        state: 'open',
        service: 'domain',
        version: 'Google Public DNS Anycast',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.41 ms', address: '192.168.1.1', host: 'gateway.local' },
      { hop: 2, rtt: '1.92 ms', address: '10.200.0.1', host: 'edge-gw.net' },
      { hop: 3, rtt: '4.10 ms', address: '8.8.8.8', host: 'dns.google' },
    ],
  },
];

/**
 * Filter ports based on port range preset, protocol, and optional custom CLI port spec (-p)
 */
export function filterPortsForScan(
  target: NmapTargetPreset,
  scanType: '-sS' | '-sT' | '-sU',
  portPreset: 'top20' | 'top100' | 'web' | 'database' | 'all',
  customPortSpec?: string
): NmapPort[] {
  const isUdp = scanType === '-sU';
  const basePorts = isUdp ? target.udpPorts : target.ports;

  // Custom port specification (-p 80,443 or -p 22 or -p 21,22,80,443,8080)
  if (customPortSpec && customPortSpec.trim() && !['top20', 'top100', 'web', 'database', 'all'].includes(customPortSpec)) {
    const rawList = customPortSpec
      .replace(/^-p\s*/, '')
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0 && n <= 65535);

    if (rawList.length > 0) {
      const wellKnownServiceMap: Record<number, string> = {
        21: 'ftp',
        22: 'ssh',
        23: 'telnet',
        25: 'smtp',
        53: 'domain',
        80: 'http',
        110: 'pop3',
        111: 'rpcbind',
        135: 'msrpc',
        139: 'netbios-ssn',
        143: 'imap',
        443: 'ssl/https',
        445: 'microsoft-ds',
        587: 'submission',
        853: 'domain-s',
        993: 'imaps',
        995: 'pop3s',
        1433: 'ms-sql-s',
        1521: 'oracle',
        3306: 'mysql',
        3389: 'ms-wbt-server',
        5432: 'postgresql',
        6379: 'redis',
        8080: 'http-proxy',
        8443: 'https-alt',
        9000: 'cslistener',
        9929: 'nping-echo',
        27017: 'mongodb',
        31337: 'Elite',
      };

      return rawList.map((pNum) => {
        const found = basePorts.find((p) => p.port === pNum);
        if (found) return found;
        return {
          port: pNum,
          protocol: isUdp ? 'udp' : 'tcp',
          state: 'closed',
          service: wellKnownServiceMap[pNum] || 'unknown',
          version: 'Connection refused (Port closed)',
        };
      });
    }
  }

  if (portPreset === 'web') {
    const webPortNumbers = [80, 443, 8000, 8080, 8443, 8888];
    const filtered = basePorts.filter((p) => webPortNumbers.includes(p.port));
    if (filtered.length === 0) {
      return [
        {
          port: 80,
          protocol: isUdp ? 'udp' : 'tcp',
          state: 'closed',
          service: 'http',
          version: 'Connection refused (No HTTP listener on this host)',
        },
      ];
    }
    return filtered;
  }

  if (portPreset === 'database') {
    const dbPortNumbers = [1433, 1521, 3306, 5432, 6379, 9100, 27017];
    const filtered = basePorts.filter((p) => dbPortNumbers.includes(p.port));
    if (filtered.length === 0) {
      return [
        {
          port: 3306,
          protocol: isUdp ? 'udp' : 'tcp',
          state: 'closed',
          service: 'mysql',
          version: 'Connection refused (No database listener on this host)',
        },
      ];
    }
    return filtered;
  }

  if (portPreset === 'top20') {
    const top20Numbers = [21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 993, 995, 1723, 3306, 3389, 5900, 8080];
    const filtered = basePorts.filter((p) => top20Numbers.includes(p.port));
    return filtered;
  }

  if (portPreset === 'all') {
    return basePorts;
  }

  return basePorts;
}

/**
 * Synthesizes a realistic CIDR Subnet Scan (e.g. 192.168.1.0/24 or 10.0.0.0/24)
 */
export function synthesizeSubnetTarget(cidrInput: string): NmapTargetPreset {
  const baseSubnet = cidrInput.split('/')[0].split('.').slice(0, 3).join('.');

  const hosts = [
    { ip: `${baseSubnet}.1`, hostname: 'gateway.lan', latency: 0.82, openPortsCount: 4 },
    { ip: `${baseSubnet}.12`, hostname: 'storage-nas.lan', latency: 1.45, openPortsCount: 3 },
    { ip: `${baseSubnet}.45`, hostname: 'db-cluster.lan', latency: 2.15, openPortsCount: 5 },
    { ip: `${baseSubnet}.105`, hostname: 'workstation-dev.lan', latency: 3.84, openPortsCount: 2 },
  ];

  return {
    id: `subnet-${cidrInput.replace(/[^a-zA-Z0-9]/g, '_')}`,
    name: `Subnet: ${cidrInput}`,
    ip: cidrInput,
    hostname: `${cidrInput} (4 Hosts Active)`,
    description: `Multi-host ARP/ICMP ping sweep discovering active nodes across ${cidrInput}.`,
    category: 'Subnet CIDR',
    isSubnet: true,
    discoveredHosts: hosts,
    latencyMs: 1.84,
    os: {
      deviceType: 'Multi-host Subnet Segment',
      running: 'Mixed OS Environment (Linux, BSD, Embedded)',
      osCpe: 'cpe:/o:mixed:multi_os',
      osDetails: 'Mixed network segment (4 alive hosts responding to ARP probes)',
      uptime: 'Variable per node',
      tcpSequence: 'Multiple distinct IP ID stacks',
    },
    ports: [
      {
        port: 22,
        protocol: 'tcp',
        state: 'open',
        service: 'ssh',
        version: 'OpenSSH 9.3p1 (Discovered on .1 and .45)',
      },
      {
        port: 80,
        protocol: 'tcp',
        state: 'open',
        service: 'http',
        version: 'nginx 1.24.0 (Discovered on .1 Gateway)',
      },
      {
        port: 443,
        protocol: 'tcp',
        state: 'open',
        service: 'ssl/https',
        version: 'nginx 1.24.0 (TLS 1.3)',
      },
      {
        port: 445,
        protocol: 'tcp',
        state: 'open',
        service: 'microsoft-ds',
        version: 'Samba 4.17 (Discovered on .12 storage-nas)',
      },
      {
        port: 3306,
        protocol: 'tcp',
        state: 'open',
        service: 'mysql',
        version: 'MySQL 8.0.35 (Discovered on .45 db-cluster)',
      },
    ],
    udpPorts: [
      {
        port: 53,
        protocol: 'udp',
        state: 'open',
        service: 'domain',
        version: 'dnsmasq 2.89 (.1)',
      },
      {
        port: 123,
        protocol: 'udp',
        state: 'open',
        service: 'ntp',
        version: 'NTP v4 across subnet',
      },
    ],
    traceroute: [
      { hop: 1, rtt: '0.45 ms', address: `${baseSubnet}.254`, host: 'switch-vlan.local' },
      { hop: 2, rtt: '1.25 ms', address: `${baseSubnet}.1`, host: 'gateway.lan' },
    ],
  };
}

/**
 * Dynamically synthesizes a realistic Nmap target preset for any arbitrary custom IP or domain.
 */
export function synthesizeCustomTarget(targetInput: string): NmapTargetPreset {
  const cleanInput = targetInput.trim() || '192.168.1.100';

  if (cleanInput.includes('/')) {
    return synthesizeSubnetTarget(cleanInput);
  }

  let hash = 0;
  for (let i = 0; i < cleanInput.length; i++) {
    hash = (hash << 5) - hash + cleanInput.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const tcpPool: { port: number; service: string; version: string; cve?: { id: string; severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; title: string; cvss: number } }[] = [
    { port: 22, service: 'ssh', version: 'OpenSSH 9.2p1 Debian' },
    { port: 80, service: 'http', version: 'Apache/2.4.57 (Unix)' },
    { port: 443, service: 'ssl/https', version: 'nginx/1.22.1 (TLS 1.3)' },
    { port: 3306, service: 'mysql', version: 'MySQL 8.0.33 Community' },
    { port: 5432, service: 'postgresql', version: 'PostgreSQL DB 14.8' },
    { port: 6379, service: 'redis', version: 'Redis standalone 7.0.12' },
    { port: 8080, service: 'http-proxy', version: 'Node.js Express / Envoy' },
    { port: 8443, service: 'https-alt', version: 'Tomcat/9.0.75' },
    {
      port: 21,
      service: 'ftp',
      version: 'ProFTPD 1.3.5',
      cve: {
        id: 'CVE-2015-3306',
        severity: 'HIGH',
        title: 'ProFTPD mod_copy Command Execution Vulnerability',
        cvss: 8.5,
      },
    },
    {
      port: 9000,
      service: 'cslistener',
      version: 'Golang Microservice Agent v1.4',
    },
  ];

  // Pick 3-5 open ports deterministically based on input hash
  const numPorts = 3 + (absHash % 4);
  const selectedTcpPorts: NmapPort[] = [];

  for (let i = 0; i < numPorts; i++) {
    const item = tcpPool[(absHash + i * 3) % tcpPool.length];
    if (!selectedTcpPorts.some((p) => p.port === item.port)) {
      selectedTcpPorts.push({
        port: item.port,
        protocol: 'tcp',
        state: 'open',
        service: item.service,
        version: item.version,
        banner: `${item.service} server ready on ${cleanInput}`,
        scripts: [
          {
            name: `${item.service}-banner`,
            output: `TCP Handshake ACK received on port ${item.port}. TLS/Plaintext banner verified.`,
          },
        ],
        cveList: item.cve ? [item.cve] : undefined,
      });
    }
  }

  // Ensure port order
  selectedTcpPorts.sort((a, b) => a.port - b.port);

  // UDP pool
  const udpPool: NmapPort[] = [
    { port: 53, protocol: 'udp', state: 'open', service: 'domain', version: 'Unbound DNS 1.17' },
    { port: 123, protocol: 'udp', state: 'open', service: 'ntp', version: 'ntpd 4.2.8' },
    { port: 161, protocol: 'udp', state: 'open', service: 'snmp', version: 'NET-SNMP 5.9' },
  ];

  return {
    id: `custom-${absHash}`,
    name: `Host: ${cleanInput}`,
    ip: cleanInput.includes('.') ? cleanInput : `192.168.${(absHash % 250) + 1}.50`,
    hostname: cleanInput.includes('.') ? cleanInput : `${cleanInput}.local`,
    description: `Custom target resolved and fingerprinted via heuristic SYN analysis.`,
    category: 'Gateway',
    latencyMs: +(4 + (absHash % 28) + 0.35).toFixed(2),
    os: {
      deviceType: 'General Purpose Linux Server',
      running: 'Linux 5.X | 6.X',
      osCpe: 'cpe:/o:linux:linux_kernel:5.15',
      osDetails: `Linux 5.15.0-x86_64-generic (Heuristic Stack Fingerprint for ${cleanInput})`,
      uptime: `${14 + (absHash % 90)} days, 08:14:02`,
      tcpSequence: `Difficulty=${240 + (absHash % 20)} (Good luck!)`,
    },
    ports: selectedTcpPorts,
    udpPorts: udpPool,
    traceroute: [
      { hop: 1, rtt: '0.45 ms', address: '192.168.1.1', host: 'gateway.local' },
      { hop: 2, rtt: `${(3 + (absHash % 8)).toFixed(2)} ms`, address: '10.200.0.1', host: 'isp-transit.net' },
      { hop: 3, rtt: `${(10 + (absHash % 20)).toFixed(2)} ms`, address: cleanInput, host: cleanInput },
    ],
  };
}

/**
 * Universal Target Resolver
 */
export function resolveTarget(input: string): NmapTargetPreset {
  const trimmed = input.trim();
  if (!trimmed) return NMAP_PRESETS[0];

  // Match preset ID directly
  const byId = NMAP_PRESETS.find((p) => p.id === trimmed.toLowerCase());
  if (byId) return byId;

  // Match preset IP or Hostname
  const byIpOrHost = NMAP_PRESETS.find(
    (p) =>
      p.ip.toLowerCase() === trimmed.toLowerCase() ||
      p.hostname.toLowerCase() === trimmed.toLowerCase() ||
      p.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (byIpOrHost) return byIpOrHost;

  // Subnet CIDR check
  if (trimmed.includes('/')) {
    return synthesizeSubnetTarget(trimmed);
  }

  // Synthesize for custom host
  return synthesizeCustomTarget(trimmed);
}
