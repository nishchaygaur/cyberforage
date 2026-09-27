import * as THREE from 'three';

export interface OrbitalNodeData {
  id: string;
  name: string;
  color: number;
  hex: string;
  lat: number;
  lon: number;
  radius: number;
  category: string;
  description: string;
}

export const ORBITAL_NODES: OrbitalNodeData[] = [
  {
    id: 'node-security',
    name: 'SECURITY',
    color: 0x00f0c0,
    hex: '#00F0C0',
    lat: 38,
    lon: -77,
    radius: 3.2,
    category: 'SOC & Defense',
    description: 'Real-time telemetry detection & SIEM correlation pipelines.'
  },
  {
    id: 'node-ai',
    name: 'AI',
    color: 0xa855f7,
    hex: '#A855F7',
    lat: 48,
    lon: 2,
    radius: 3.3,
    category: 'Autonomous Agents',
    description: 'Triage models, anomaly inference & automated containment.'
  },
  {
    id: 'node-research',
    name: 'RESEARCH',
    color: 0x38bdf8,
    hex: '#38BDF8',
    lat: 1.3,
    lon: 103.8,
    radius: 3.25,
    category: 'Vulnerabilities & DFIR',
    description: 'Adversary emulation, malware analysis & binary forensics.'
  },
  {
    id: 'node-automation',
    name: 'AUTOMATION',
    color: 0x00e5be,
    hex: '#00E5BE',
    lat: -33.8,
    lon: 151.2,
    radius: 3.2,
    category: 'Security Orchestration',
    description: 'n8n pipelines, webhook listeners & response orchestration.'
  }
];

export class CyberGlobeController {
  public group: THREE.Group;
  private coreSphere!: THREE.Mesh;
  private wireSphere!: THREE.LineSegments;
  private shieldHex!: THREE.Mesh;
  private continentPoints!: THREE.Points;
  private ring1!: THREE.Line;
  private ring2!: THREE.Line;
  private nodesGroup: THREE.Group;
  private arcsGroup: THREE.Group;
  private nodeMeshes: { mesh: THREE.Mesh; data: OrbitalNodeData; beacon: THREE.Mesh }[] = [];
  private activeArcs: { line: THREE.Line; progress: number; speed: number; curve: THREE.QuadraticBezierCurve3 }[] = [];
  private lastAttackTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.nodesGroup = new THREE.Group();
    this.arcsGroup = new THREE.Group();

    this.createCoreGlobe();
    this.createContinentMatrix();
    this.createOrbitRings();
    this.createDefenseShield();
    this.createOrbitalNodes();

    this.group.add(this.nodesGroup);
    this.group.add(this.arcsGroup);

    // Initial attack simulation arcs
    this.triggerAttackSimulation();
  }

  private latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  private createCoreGlobe() {
    // Dark cyber core
    const coreGeo = new THREE.SphereGeometry(2.5, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x040d1a,
      transparent: true,
      opacity: 0.92
    });
    this.coreSphere = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreSphere);

    // Outer wireframe grid
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(2.52, 28, 28));
    this.wireSphere = new THREE.LineSegments(
      wireGeo,
      new THREE.LineBasicMaterial({
        color: 0x00f0c0,
        transparent: true,
        opacity: 0.12
      })
    );
    this.group.add(this.wireSphere);
  }

  private createContinentMatrix() {
    // Generate holographic continent dot clusters
    const count = 3800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseColor = new THREE.Color(0x00f0c0);
    const altColor = new THREE.Color(0x38bdf8);

    let idx = 0;
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution with cluster density masking
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.54;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // Color variation across latitudes
      const mixRatio = Math.sin(phi * 3) * 0.5 + 0.5;
      const pointColor = baseColor.clone().lerp(altColor, mixRatio);

      colors[idx] = pointColor.r;
      colors[idx + 1] = pointColor.g;
      colors[idx + 2] = pointColor.b;

      idx += 3;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.5, 'rgba(0, 240, 192, 0.8)');
      grad.addColorStop(1, 'rgba(0, 240, 192, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.continentPoints = new THREE.Points(geo, mat);
    this.group.add(this.continentPoints);
  }

  private createOrbitRings() {
    // Ring 1 - Equator tilt
    const ring1Geo = new THREE.BufferGeometry();
    const ring1Pts: THREE.Vector3[] = [];
    const segments = 90;
    const r1 = 3.4;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      ring1Pts.push(new THREE.Vector3(Math.cos(a) * r1, Math.sin(a) * 0.4, Math.sin(a) * r1));
    }
    ring1Geo.setFromPoints(ring1Pts);
    this.ring1 = new THREE.Line(
      ring1Geo,
      new THREE.LineBasicMaterial({
        color: 0x00f0c0,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending
      })
    );
    this.group.add(this.ring1);

    // Ring 2 - Polar orbit
    const ring2Geo = new THREE.BufferGeometry();
    const ring2Pts: THREE.Vector3[] = [];
    const r2 = 3.6;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      ring2Pts.push(new THREE.Vector3(Math.sin(a) * 0.5, Math.cos(a) * r2, Math.sin(a) * r2));
    }
    ring2Geo.setFromPoints(ring2Pts);
    this.ring2 = new THREE.Line(
      ring2Geo,
      new THREE.LineDashedMaterial({
        color: 0xa855f7,
        dashSize: 0.2,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      })
    );
    this.ring2.computeLineDistances();
    this.group.add(this.ring2);
  }

  private createDefenseShield() {
    // Hexagonal shield outer layer
    const shieldGeo = new THREE.IcosahedronGeometry(2.78, 2);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00f0c0,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    this.shieldHex = new THREE.Mesh(shieldGeo, shieldMat);
    this.group.add(this.shieldHex);
  }

  private createOrbitalNodes() {
    ORBITAL_NODES.forEach((node) => {
      const pos = this.latLonToVector3(node.lat, node.lon, node.radius);

      // Core Node Diamond / Octahedron
      const nodeGeo = new THREE.OctahedronGeometry(0.14, 0);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: node.color,
        wireframe: false
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { isNode: true, ...node };

      // Outer Beacon Ring
      const beaconGeo = new THREE.RingGeometry(0.18, 0.24, 18);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(pos);
      beacon.lookAt(new THREE.Vector3(0, 0, 0));

      // Connecting stalk to surface
      const surfacePos = this.latLonToVector3(node.lat, node.lon, 2.5);
      const stalkGeo = new THREE.BufferGeometry().setFromPoints([surfacePos, pos]);
      const stalkMat = new THREE.LineBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.5
      });
      const stalk = new THREE.Line(stalkGeo, stalkMat);

      this.nodesGroup.add(nodeMesh);
      this.nodesGroup.add(beacon);
      this.nodesGroup.add(stalk);

      this.nodeMeshes.push({ mesh: nodeMesh, data: node, beacon });
    });
  }

  public triggerAttackSimulation() {
    // Generate attack bezier curves from external vector into defense nodes
    const colors = [0xf43f5e, 0xa855f7, 0x00f0c0, 0x38bdf8];

    // Connect pairs of orbital nodes with high-speed cyber packet arcs
    for (let i = 0; i < ORBITAL_NODES.length; i++) {
      const source = ORBITAL_NODES[i];
      const target = ORBITAL_NODES[(i + 1) % ORBITAL_NODES.length];

      const p1 = this.latLonToVector3(source.lat, source.lon, source.radius);
      const p2 = this.latLonToVector3(target.lat, target.lon, target.radius);

      // Midpoint elevated above globe
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(4.1);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(arcGeo, arcMat);
      this.arcsGroup.add(line);
      this.activeArcs.push({
        line,
        progress: 0,
        speed: 0.015 + Math.random() * 0.02,
        curve
      });
    }
  }

  public launchHostileMissile(): { message: string; severity: 'high' | 'critical' | 'mitigated' } {
    // Create red inbound attack vector that strikes the shield and gets neutralized
    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    ).normalize().multiplyScalar(7.5);

    const targetNode = ORBITAL_NODES[Math.floor(Math.random() * ORBITAL_NODES.length)];
    const targetPos = this.latLonToVector3(targetNode.lat, targetNode.lon, targetNode.radius);

    const mid = startPos.clone().add(targetPos).multiplyScalar(0.5);
    mid.multiplyScalar(1.2);

    const curve = new THREE.QuadraticBezierCurve3(startPos, mid, targetPos);
    const points = curve.getPoints(50);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const hostileLine = new THREE.Line(geo, mat);
    this.arcsGroup.add(hostileLine);

    // Auto cleanup after 3.5s
    setTimeout(() => {
      this.arcsGroup.remove(hostileLine);
      geo.dispose();
      mat.dispose();
    }, 3500);

    return {
      message: `Simulated attack [Vector T1059.001] intercepted at Node ${targetNode.name}!`,
      severity: 'critical'
    };
  }

  public update(delta: number, elapsed: number) {
    // Gentle rotation
    this.coreSphere.rotation.y += 0.002;
    this.wireSphere.rotation.y += 0.0025;
    this.continentPoints.rotation.y += 0.002;
    this.nodesGroup.rotation.y += 0.002;
    this.arcsGroup.rotation.y += 0.002;

    // Counter rotate shield for radar hologram effect
    this.shieldHex.rotation.y -= 0.0015;
    this.shieldHex.rotation.x = Math.sin(elapsed * 0.4) * 0.05;

    // Pulse orbit rings
    this.ring1.rotation.z += 0.003;
    this.ring2.rotation.x += 0.0025;

    // Animate node beacons (pulse scale & rotation)
    this.nodeMeshes.forEach((item, index) => {
      const scale = 1 + Math.sin(elapsed * 3 + index) * 0.2;
      item.beacon.scale.set(scale, scale, 1);
      item.mesh.rotation.y += 0.02;
      item.mesh.rotation.x += 0.015;
    });

    // Animate arc brightness pulses
    this.activeArcs.forEach((arc) => {
      arc.progress = (arc.progress + arc.speed) % 1;
      const lineMat = arc.line.material as THREE.LineBasicMaterial;
      lineMat.opacity = 0.3 + Math.sin(elapsed * 6 + arc.progress * Math.PI) * 0.4;
    });
  }

  public getNodeMeshes(): THREE.Mesh[] {
    return this.nodeMeshes.map(n => n.mesh);
  }

  public dispose() {
    this.coreSphere.geometry.dispose();
    (this.coreSphere.material as THREE.Material).dispose();
    this.wireSphere.geometry.dispose();
    (this.wireSphere.material as THREE.Material).dispose();
    this.shieldHex.geometry.dispose();
    (this.shieldHex.material as THREE.Material).dispose();
    this.continentPoints.geometry.dispose();
    (this.continentPoints.material as THREE.Material).dispose();
    this.ring1.geometry.dispose();
    (this.ring1.material as THREE.Material).dispose();
    this.ring2.geometry.dispose();
    (this.ring2.material as THREE.Material).dispose();
  }
}
