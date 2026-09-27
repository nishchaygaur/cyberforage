import React, { useState, useEffect } from 'react';
import { Network, Pause, Play, Filter, ShieldAlert, ChevronDown, ChevronRight, Zap } from 'lucide-react';
import { cyberSound } from '../../audio/cyberSoundEngine';

export interface PacketFrame {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: 'TCP' | 'DNS' | 'TLS1.3' | 'SSH' | 'BGP' | 'ICMP';
  length: number;
  info: string;
  isAnomaly?: boolean;
  hexPreview: string;
  details: {
    srcMac: string;
    dstMac: string;
    ttl: number;
    flags: string;
    windowSize?: number;
    payloadSnippet: string;
  };
}

const INITIAL_PACKETS: PacketFrame[] = [
  {
    id: 1041,
    time: '00:00:01.120',
    source: '192.0.2.45:51240',
    destination: '198.51.100.10:443',
    protocol: 'TLS1.3',
    length: 517,
    info: 'Client Hello, SNI: auth.cyberforage.space, CipherSuites (17)',
    hexPreview: '16 03 01 02 00 01 00 01 fc 03 03 9a 4f 12 7b 33',
    details: {
      srcMac: '00:1a:2b:3c:4d:5e',
      dstMac: '52:54:00:12:34:56',
      ttl: 58,
      flags: '0x02 (DF)',
      windowSize: 64240,
      payloadSnippet: 'ClientHello version=TLS 1.3 (0x0304) supported_groups=x25519',
    },
  },
  {
    id: 1042,
    time: '00:00:01.240',
    source: '10.0.4.15:53211',
    destination: '1.1.1.1:53',
    protocol: 'DNS',
    length: 74,
    info: 'Standard query 0x8f12 A telemetry.cyberforage.space',
    hexPreview: '8f 12 01 00 00 01 00 00 00 00 00 00 09 74 65 6c',
    details: {
      srcMac: '00:1a:2b:3c:4d:5e',
      dstMac: '00:0c:29:4f:8e:35',
      ttl: 64,
      flags: '0x00',
      payloadSnippet: 'DNS Query Class=IN (0x0001) Type=A (Host Address)',
    },
  },
  {
    id: 1043,
    time: '00:00:01.350',
    source: '198.51.100.99:4444',
    destination: '10.0.2.14:49152',
    protocol: 'TCP',
    length: 128,
    info: '[ANOMALY] TCP SYN Flood / Out-of-order beacon frame',
    isAnomaly: true,
    hexPreview: '45 00 00 3c 1c 46 40 00 40 06 b2 e6 c0 a8 01 01',
    details: {
      srcMac: 'fa:16:3e:8a:bc:de',
      dstMac: '52:54:00:12:34:56',
      ttl: 42,
      flags: '0x02 (SYN, ECN-Echo)',
      windowSize: 1024,
      payloadSnippet: 'Correlated with Cobalt Strike default sleep beacon timing',
    },
  },
  {
    id: 1044,
    time: '00:00:01.480',
    source: '203.0.113.88:22',
    destination: '10.0.1.100:54120',
    protocol: 'SSH',
    length: 980,
    info: 'Server: Key Exchange Init (curve25519-sha256@libssh.org)',
    hexPreview: '00 00 03 d4 06 14 38 7b a2 11 09 f4 c2 55 19 01',
    details: {
      srcMac: '52:54:00:12:34:56',
      dstMac: '00:1a:2b:3c:4d:5e',
      ttl: 61,
      flags: '0x18 (PSH, ACK)',
      windowSize: 131072,
      payloadSnippet: 'SSH-2.0-OpenSSH_9.6p1 strict KEX algorithmic consensus',
    },
  },
];

export const LivePacketSniffer: React.FC = () => {
  const [packets, setPackets] = useState<PacketFrame[]>(INITIAL_PACKETS);
  const [isPaused, setIsPaused] = useState(false);
  const [protocolFilter, setProtocolFilter] = useState<'ALL' | 'TCP' | 'DNS' | 'TLS1.3' | 'ANOMALIES'>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(1043);

  // Background packet generator stream
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(Math.random() * 900 + 100))}`;

      const templates: Omit<PacketFrame, 'id' | 'time'>[] = [
        {
          source: `192.168.1.${Math.floor(Math.random() * 200 + 10)}:${Math.floor(Math.random() * 40000 + 1024)}`,
          destination: '198.51.100.1:443',
          protocol: 'TLS1.3',
          length: Math.floor(Math.random() * 400 + 200),
          info: 'Application Data (Encrypted TLS Record, 256-bit AES-GCM)',
          hexPreview: '17 03 03 01 20 48 b9 12 fa 09 88 cd e1 02 44 9a',
          details: {
            srcMac: '00:1a:2b:3c:4d:5e',
            dstMac: '52:54:00:12:34:56',
            ttl: 64,
            flags: '0x18 (PSH, ACK)',
            windowSize: 65535,
            payloadSnippet: 'AEAD Ciphertext payload stream verified',
          },
        },
        {
          source: `10.0.1.${Math.floor(Math.random() * 50 + 2)}:${Math.floor(Math.random() * 50000 + 1024)}`,
          destination: '1.1.1.1:53',
          protocol: 'DNS',
          length: 68,
          info: `Standard query 0x${Math.random().toString(16).slice(2, 6)} A edge-node-${Math.floor(Math.random() * 8)}.cyberforage.space`,
          hexPreview: '3a 14 01 00 00 01 00 00 00 00 00 00 04 65 64 67',
          details: {
            srcMac: '00:1a:2b:3c:4d:5e',
            dstMac: '00:0c:29:4f:8e:35',
            ttl: 64,
            flags: '0x00',
            payloadSnippet: 'DNS Response Cache TTL=300s',
          },
        },
        {
          source: `${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.88:443`,
          destination: '10.0.0.1:443',
          protocol: 'TCP',
          length: 60,
          info: '[ANOMALY] Port Scan: Stealth FIN/NULL scan packet detected',
          isAnomaly: true,
          hexPreview: '45 00 00 28 00 01 00 00 40 06 7c cc 7f 00 00 01',
          details: {
            srcMac: 'aa:bb:cc:dd:ee:ff',
            dstMac: '52:54:00:12:34:56',
            ttl: 38,
            flags: '0x01 (FIN)',
            windowSize: 0,
            payloadSnippet: 'Filtered by Zero-Trust stateful inspection firewall',
          },
        },
      ];

      const chosen = templates[Math.floor(Math.random() * templates.length)];
      const newFrame: PacketFrame = {
        ...chosen,
        id: Math.floor(Math.random() * 90000 + 10000),
        time: timeStr,
      };

      setPackets((prev) => [newFrame, ...prev.slice(0, 11)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filtered = packets.filter((p) => {
    if (protocolFilter === 'ALL') return true;
    if (protocolFilter === 'ANOMALIES') return p.isAnomaly;
    return p.protocol === protocolFilter;
  });

  return (
    <div className="w-full rounded-2xl bg-[#030914] border border-[#00F0C0]/40 overflow-hidden shadow-[0_0_30px_rgba(0,240,192,0.1)] flex flex-col font-mono">
      {/* Sniffer Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#061426] border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#00F0C0] animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">
            Promiscuous Packet Sniffer (Interface: eth0)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            CAPTURE RUNNING
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => {
              cyberSound.playClick();
              setIsPaused(!isPaused);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              isPaused
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          {/* Filters */}
          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/10">
            {(['ALL', 'TCP', 'DNS', 'TLS1.3', 'ANOMALIES'] as const).map((proto) => (
              <button
                key={proto}
                onClick={() => {
                  cyberSound.playClick();
                  setProtocolFilter(proto);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  protocolFilter === proto
                    ? 'bg-[#00F0C0] text-[#040812]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Packet Table Stream */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#050E1A] text-slate-400 border-b border-white/10 text-[11px]">
              <th className="py-2 px-3 w-16">NO.</th>
              <th className="py-2 px-3 w-28">TIME</th>
              <th className="py-2 px-3 w-40">SOURCE</th>
              <th className="py-2 px-3 w-40">DESTINATION</th>
              <th className="py-2 px-3 w-20">PROTO</th>
              <th className="py-2 px-3 w-16">LEN</th>
              <th className="py-2 px-3">INFO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px]">
            {filtered.map((pkt) => {
              const isExpanded = expandedId === pkt.id;
              const rowBg = pkt.isAnomaly
                ? 'bg-rose-950/20 hover:bg-rose-950/30 text-rose-200'
                : pkt.protocol === 'DNS'
                ? 'hover:bg-blue-950/20 text-blue-200'
                : 'hover:bg-white/[0.02] text-slate-300';

              return (
                <React.Fragment key={pkt.id}>
                  <tr
                    onClick={() => {
                      cyberSound.playClick();
                      setExpandedId(isExpanded ? null : pkt.id);
                    }}
                    className={`cursor-pointer transition-colors ${rowBg}`}
                  >
                    <td className="py-2 px-3 font-mono text-slate-500">{pkt.id}</td>
                    <td className="py-2 px-3 text-slate-400">{pkt.time}</td>
                    <td className="py-2 px-3 text-[#38BDF8] truncate max-w-[140px]">{pkt.source}</td>
                    <td className="py-2 px-3 text-emerald-400 truncate max-w-[140px]">{pkt.destination}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          pkt.isAnomaly
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {pkt.protocol}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{pkt.length}</td>
                    <td className="py-2 px-3 flex items-center justify-between">
                      <span className="truncate">{pkt.info}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#00F0C0]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </td>
                  </tr>

                  {/* Dissection Tree for Selected Packet */}
                  {isExpanded && (
                    <tr className="bg-[#02060E] border-y border-[#00F0C0]/30 animate-fadeIn">
                      <td colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Packet Header Breakdown */}
                          <div className="space-y-1 text-xs">
                            <div className="text-[#00F0C0] font-bold text-[11px] uppercase mb-1">
                              Wireshark Packet Dissection
                            </div>
                            <div className="p-2 rounded bg-black/40 border border-white/5 space-y-1">
                              <div>▶ Frame {pkt.id}: {pkt.length} bytes captured on interface eth0</div>
                              <div>▶ Ethernet II, Src: {pkt.details.srcMac}, Dst: {pkt.details.dstMac}</div>
                              <div>▶ Internet Protocol Version 4, Src: {pkt.source}, Dst: {pkt.destination}</div>
                              <div className="pl-4 text-slate-400">TTL: {pkt.details.ttl}, Flags: {pkt.details.flags}</div>
                              <div>▶ Transport: Window Size: {pkt.details.windowSize || 'N/A'}</div>
                              <div className="text-amber-300 pl-4">{pkt.details.payloadSnippet}</div>
                            </div>
                          </div>

                          {/* Raw Hex & ASCII Stream */}
                          <div className="space-y-1">
                            <div className="text-slate-400 font-bold text-[11px] uppercase mb-1">
                              Raw Hex Payload Buffer
                            </div>
                            <pre className="p-2.5 rounded bg-black/60 border border-white/10 text-[11px] text-[#38BDF8] overflow-x-auto">
                              {pkt.hexPreview}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
