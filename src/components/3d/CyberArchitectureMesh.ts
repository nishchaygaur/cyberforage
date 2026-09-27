import * as THREE from 'three';

export interface MeshNodeData {
  id: string;
  name: string;
  role: string;
  color: number;
  hex: string;
  position: THREE.Vector3;
  status: string;
  throughput: string;
}

export const ARCHITECTURE_NODES: MeshNodeData[] = [
  {
    id: 'defense-core',
    name: 'Defense Core',
    role: 'Active Enforcement & Shielding',
    color: 0x00f0c0,
    hex: '#00F0C0',
    position: new THREE.Vector3(-2.8, 0, 0),
    status: 'ACTIVE',
    throughput: '450 kpps'
  },
  {
    id: 'threat-stream',
    name: 'Threat Stream',
    role: 'Real-Time Telemetry & Zeek/Sysmon',
    color: 0x38bdf8,
    hex: '#38BDF8',
    position: new THREE.Vector3(0, 2.2, 0),
    status: 'INGESTING',
    throughput: '12.8 Gbps'
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    role: 'Autonomous Triage & Response Mesh',
    color: 0xa855f7,
    hex: '#A855F7',
    position: new THREE.Vector3(2.8, -0.6, 0),
    status: 'REASONING',
    throughput: '98.4% Confidence'
  }
];

export class CyberArchitectureMeshController {
  public group: THREE.Group;
  private nodeObjects: { group: THREE.Group; core: THREE.Mesh; halo: THREE.Mesh; data: MeshNodeData }[] = [];
  private conduitPipes: THREE.Line[] = [];
  private packetParticles: THREE.Points;
  private packetCount = 120;

  constructor() {
    this.group = new THREE.Group();
    this.createNodes();
    this.createConduits();
    this.packetParticles = this.createFlowingPackets();
    this.group.add(this.packetParticles);
  }

  private createNodes() {
    ARCHITECTURE_NODES.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(node.position);

      // Core Polyhedron
      const coreGeo = new THREE.DodecahedronGeometry(0.55, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: node.color,
        wireframe: false
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.userData = { isMeshNode: true, nodeData: node };
      nodeGroup.add(core);

      // Wireframe Outer Cage
      const cageGeo = new THREE.WireframeGeometry(new THREE.DodecahedronGeometry(0.78, 1));
      const cageMat = new THREE.LineBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.4
      });
      const cage = new THREE.LineSegments(cageGeo, cageMat);
      nodeGroup.add(cage);

      // Outer Pulsing Glow Halo
      const haloGeo = new THREE.RingGeometry(0.85, 1.05, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.lookAt(new THREE.Vector3(0, 0, 10));
      nodeGroup.add(halo);

      this.group.add(nodeGroup);
      this.nodeObjects.push({ group: nodeGroup, core, halo, data: node });
    });
  }

  private createConduits() {
    // Triangular closed circuit between Defense Core, Threat Stream, and AI Automation
    const pairs = [
      [ARCHITECTURE_NODES[0].position, ARCHITECTURE_NODES[1].position],
      [ARCHITECTURE_NODES[1].position, ARCHITECTURE_NODES[2].position],
      [ARCHITECTURE_NODES[2].position, ARCHITECTURE_NODES[0].position]
    ];

    pairs.forEach(([p1, p2], idx) => {
      // Main Conduit Line
      const pts = [p1, p2];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: idx === 0 ? 0x00f0c0 : idx === 1 ? 0x38bdf8 : 0xa855f7,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(geo, mat);
      this.group.add(line);
      this.conduitPipes.push(line);

      // Outer glow boundary
      const dashGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const dashMat = new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.25,
        gapSize: 0.2,
        transparent: true,
        opacity: 0.4
      });
      const dashLine = new THREE.Line(dashGeo, dashMat);
      dashLine.computeLineDistances();
      this.group.add(dashLine);
    });
  }

  private createFlowingPackets(): THREE.Points {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.packetCount * 3);
    const colors = new Float32Array(this.packetCount * 3);

    for (let i = 0; i < this.packetCount; i++) {
      // Random starting position between nodes
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      colors[i * 3] = 0.0;
      colors[i * 3 + 1] = 0.94;
      colors[i * 3 + 2] = 0.75;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geo, mat);
  }

  public update(delta: number, elapsed: number) {
    // Rotate nodes
    this.nodeObjects.forEach((item, index) => {
      item.core.rotation.y += 0.015;
      item.core.rotation.x += 0.01;

      const scale = 1 + Math.sin(elapsed * 2.5 + index * 2) * 0.15;
      item.halo.scale.set(scale, scale, 1);
    });

    // Animate flowing packet particles along triangular loop
    const pos = this.packetParticles.geometry.attributes.position.array as Float32Array;
    const n0 = ARCHITECTURE_NODES[0].position;
    const n1 = ARCHITECTURE_NODES[1].position;
    const n2 = ARCHITECTURE_NODES[2].position;
    const waypoints = [n0, n1, n2];

    for (let i = 0; i < this.packetCount; i++) {
      const idx = i * 3;
      const t = (elapsed * 0.4 + i / this.packetCount) % 3;
      const segment = Math.floor(t);
      const frac = t - segment;

      const start = waypoints[segment];
      const end = waypoints[(segment + 1) % 3];

      pos[idx] = THREE.MathUtils.lerp(start.x, end.x, frac) + (Math.sin(elapsed * 4 + i) * 0.08);
      pos[idx + 1] = THREE.MathUtils.lerp(start.y, end.y, frac) + (Math.cos(elapsed * 4 + i) * 0.08);
      pos[idx + 2] = THREE.MathUtils.lerp(start.z, end.z, frac) + (Math.sin(elapsed * 2 + i) * 0.08);
    }
    this.packetParticles.geometry.attributes.position.needsUpdate = true;

    // Gentle camera orbit of the mesh
    this.group.rotation.y = Math.sin(elapsed * 0.3) * 0.2;
  }

  public dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }
}
