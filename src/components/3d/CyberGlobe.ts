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
  private continentPoints!: THREE.Points;
  private ring1!: THREE.Line;
  private ring2!: THREE.Line;
  private nodesGroup: THREE.Group;
  private arcsGroup: THREE.Group;
  private nodeMeshes: { mesh: THREE.Mesh; data: OrbitalNodeData; beacon: THREE.Mesh }[] = [];
  private activeArcs: { line: THREE.Line; progress: number; speed: number; curve: THREE.QuadraticBezierCurve3 }[] = [];
  private activeHostileArcs: {
    line: THREE.Line;
    missile: THREE.Mesh;
    progress: number;
    speed: number;
    curve: THREE.QuadraticBezierCurve3;
    targetNode: OrbitalNodeData;
    targetMesh: THREE.Mesh;
    targetBeacon: THREE.Mesh;
    originalColor: number;
  }[] = [];
  private lastAttackTime: number = 0;
  private satellitesGroup: THREE.Group;
  private radarSweepMesh: THREE.Mesh | null = null;
  private radarBeamLine: THREE.Line | null = null;
  private satelliteMeshes: {
    mesh: THREE.Mesh;
    name: string;
    radius: number;
    speed: number;
    angle: number;
    telemetry: string;
  }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.nodesGroup = new THREE.Group();
    this.arcsGroup = new THREE.Group();
    this.satellitesGroup = new THREE.Group();

    this.createCoreGlobe();
    this.createContinentMatrix();
    this.createOrbitRings();
    this.createOrbitalNodes();
    this.createRadarSweep();
    this.createOrbitingSatellites();

    this.group.add(this.nodesGroup);
    this.group.add(this.arcsGroup);
    this.group.add(this.satellitesGroup);

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

  private isLandCoordinates(lat: number, lon: number): boolean {
    // Normalize longitude to -180..180
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;

    // Antarctica
    if (lat <= -62) return true;

    // Greenland & Arctic Islands
    if (lat >= 60 && lat <= 84 && lon >= -73 && lon <= -12) return true;

    // North America & Central America
    if (lat >= 8 && lat <= 72 && lon >= -168 && lon <= -52) {
      if (lat < 30 && lon < -105 && lon > -120) return true; // Mexico / Baja
      if (lat < 26 && lon < -98 && lon > -105) return false; // Gulf of Mexico
      if (lat > 52 && lon > -85 && lon < -65 && lat < 63) return false; // Hudson Bay
      return true;
    }

    // Caribbean
    if (lat >= 10 && lat <= 26 && lon >= -85 && lon <= -59) return true;

    // Hawaii & Pacific Island Chains
    if (lat >= 18 && lat <= 23 && lon >= -161 && lon <= -154) return true; // Hawaii
    if (lat >= -22 && lat <= -12 && lon >= -176 && lon <= -148) return true; // Polynesia / Tahiti / Samoa / Tonga
    if (lat >= 4 && lat <= 16 && lon >= 140 && lon <= 173) return true; // Micronesia / Guam / Marshall Islands
    if (lat >= 51 && lat <= 55 && (lon <= -165 || lon >= 170)) return true; // Aleutian Islands

    // South America
    if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) {
      if (lat < -40 && lon > -60) return false;
      if (lat > 5 && lon > -50) return false;
      return true;
    }

    // Europe, Scandinavia, UK & Mediterranean
    if (lat >= 35 && lat <= 72 && lon >= -11 && lon <= 45) {
      if (lat < 45 && lon < -5) return true; // Iberia
      if (lat > 55 && lon > 5 && lon < 30) return true; // Scandinavia / Baltic
      if (lat > 50 && lat < 60 && lon >= -11 && lon <= 2) return true; // UK & Ireland
      if (lat >= 36 && lat <= 46 && lon >= 6 && lon <= 19) return true; // Italy
      return true;
    }

    // Africa & Madagascar
    if (lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52) {
      if (lat > 15 && lon > 35 && lat < 30 && lon < 45) return false; // Red Sea
      if (lat < -10 && lon > 43 && lon < 51) return true; // Madagascar
      return true;
    }

    // Asia (India, China, SE Asia, Siberia, Middle East)
    if (lat >= 1 && lat <= 78 && lon >= 40 && lon <= 180) {
      if (lat < 10 && lon < 95 && lon > 60) return false; // Indian ocean south of India
      if (lat > 65 && lon > 170) return true; // Chukotka
      if (lat >= 7 && lat <= 35 && lon >= 68 && lon <= 92) return true; // India
      return true;
    }

    // Japan & Sakhalin
    if (lat >= 30 && lat <= 52 && lon >= 128 && lon <= 147) return true;

    // Indonesia, Philippines, Malaysia, Taiwan
    if (lat >= -11 && lat <= 25 && lon >= 95 && lon <= 135) {
      if (lat > 5 && lon > 118 && lon < 127) return true; // Philippines
      if (lat > 20 && lat < 26 && lon > 119 && lon < 123) return true; // Taiwan
      if (lat > -9 && lat < 6 && lon > 95 && lon < 120) return true; // Sumatra / Java / Borneo
      return true;
    }

    // Australia & New Zealand & Pacific Islands
    if (lat >= -44 && lat <= -10 && lon >= 112 && lon <= 155) return true;
    if (lat >= -47 && lat <= -34 && lon >= 165 && lon <= 179) return true; // New Zealand
    if (lat >= -22 && lat <= 0 && lon >= 140 && lon <= 180) return true; // Melanesia / Fiji

    return false;
  }

  private createCoreGlobe() {
    // Dark cyber core - rendered in opaque pass to reliably occlude back hemisphere dots
    const coreGeo = new THREE.SphereGeometry(2.45, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x020814,
      depthWrite: true,
      depthTest: true
    });
    this.coreSphere = new THREE.Mesh(coreGeo, coreMat);
    this.coreSphere.renderOrder = 0;
    this.group.add(this.coreSphere);
  }

  private createContinentMatrix() {
    // Full isotropic Fibonacci Golden Spiral coverage guaranteeing dots ALL OVER THE ENTIRE GLOBE
    // Base lattice covers 100% of the sphere (land + oceans) with vibrant, clearly visible glowing dots
    const baseCount = 22000;
    const extraLandCount = 4000;
    const totalCount = baseCount + extraLandCount;

    const positions = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);

    const landColor1 = new THREE.Color(0x00f0c0); // Radiant neon cyber cyan
    const landColor2 = new THREE.Color(0x38bdf8); // Sky blue cyber glow
    const landColor3 = new THREE.Color(0xffffff); // Brilliant diamond pearl white
    const oceanColor1 = new THREE.Color(0x00f0ff); // Electric vivid cyber cyan
    const oceanColor2 = new THREE.Color(0x38bdf8); // Luminous electric cyber blue
    const oceanColor3 = new THREE.Color(0x67e8f9); // High-luminance sky cyan
    const diamondWhite = new THREE.Color(0xffffff); // Brilliant diamond sparkle

    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399963 rad (Golden Angle)

    let idx = 0;

    // 1. Base Layer: Uniform high-density dots all over the entire globe (100% spherical coverage)
    for (let i = 0; i < baseCount; i++) {
      const yNorm = 1 - (i / (baseCount - 1)) * 2; // from 1 to -1
      const theta = goldenAngle * i;

      const lat = Math.asin(Math.max(-1, Math.min(1, yNorm))) * (180 / Math.PI);
      const lon = ((((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI) * (180 / Math.PI);

      const isLand = this.isLandCoordinates(lat, lon);
      // Continents are slightly elevated for 3D relief, oceans form a crisp base sphere
      const radius = isLand ? 2.535 : 2.50;

      // Canonical 3D spherical projection matching latLonToVector3
      const pos = this.latLonToVector3(lat, lon, radius);

      positions[idx] = pos.x;
      positions[idx + 1] = pos.y;
      positions[idx + 2] = pos.z;

      if (isLand) {
        // High-contrast neon gradients for continents
        const latMix = (Math.sin(lat * 0.08) + 1) * 0.5;
        const ptColor = landColor1.clone().lerp(landColor2, latMix);
        if (i % 6 === 0) {
          ptColor.lerp(landColor3, 0.75); // Radiant diamond pearl sparkle
        } else if (i % 3 === 0) {
          ptColor.lerp(oceanColor3, 0.4);
        }
        colors[idx] = ptColor.r;
        colors[idx + 1] = ptColor.g;
        colors[idx + 2] = ptColor.b;
      } else {
        // Vibrant, luminous cyber ocean dots spanning the entire globe
        const oceanMix = (Math.sin(lat * 0.06 + theta * 1.2) + 1) * 0.5;
        const ptColor = oceanColor1.clone().lerp(oceanColor2, oceanMix);
        if (i % 7 === 0) {
          ptColor.lerp(diamondWhite, 0.7); // Diamond white sparkle accent
        } else if (i % 3 === 0) {
          ptColor.lerp(oceanColor3, 0.5); // Radiant icy cyan accent
        } else {
          ptColor.lerp(landColor1, 0.4); // Electric cyber turquoise
        }
        colors[idx] = ptColor.r;
        colors[idx + 1] = ptColor.g;
        colors[idx + 2] = ptColor.b;
      }

      idx += 3;
    }

    // 2. Extra Continent Layer: Adds intense high-definition detail to all continents
    let landPointsFound = 0;
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    while (landPointsFound < extraLandCount) {
      const u = pseudoRandom();
      const v = pseudoRandom();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1); // 0 to PI

      const lat = 90 - (phi * 180) / Math.PI;
      const lon = (theta * 180) / Math.PI - 180;

      if (this.isLandCoordinates(lat, lon)) {
        const radius = 2.54;
        const pos = this.latLonToVector3(lat, lon, radius);

        positions[idx] = pos.x;
        positions[idx + 1] = pos.y;
        positions[idx + 2] = pos.z;

        const ptColor = landColor1.clone().lerp(landColor3, pseudoRandom() * 0.65);
        colors[idx] = ptColor.r;
        colors[idx + 1] = ptColor.g;
        colors[idx + 2] = ptColor.b;

        idx += 3;
        landPointsFound++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High-resolution particle texture with crisp bead core and clean cyber falloff
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.42, 'rgba(255, 255, 255, 1.0)'); // Solid sharp bead core
      grad.addColorStop(0.72, 'rgba(255, 255, 255, 0.55)'); // Subtle cyber halo
      grad.addColorStop(0.95, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.078,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.continentPoints = new THREE.Points(geo, mat);
    this.continentPoints.renderOrder = 10;
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

  private createRadarSweep() {
    // 60-degree radar fan sector
    const sweepGeo = new THREE.CircleGeometry(3.4, 32, 0, Math.PI / 3);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x00f0c0,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.radarSweepMesh = new THREE.Mesh(sweepGeo, sweepMat);
    this.radarSweepMesh.rotation.x = Math.PI / 2; // Flat on equator XZ plane
    this.group.add(this.radarSweepMesh);

    // Leading edge tactical beam line
    const beamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(3.4, 0, 0),
    ]);
    const beamMat = new THREE.LineBasicMaterial({
      color: 0x00f0c0,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    this.radarBeamLine = new THREE.Line(beamGeo, beamMat);
    this.group.add(this.radarBeamLine);
  }

  private createOrbitingSatellites() {
    const satellites = [
      { name: 'Tokyo Sentinel-Sat 1', radius: 3.4, speed: 0.008, angle: 0, color: 0x00f0c0, telemetry: 'SIGINT Intercept: 14.250 GHz | 0xDEADBEEF encrypted telemetry frame ACK' },
      { name: 'Frankfurt Aegis-Sat 2', radius: 3.6, speed: -0.006, angle: Math.PI * 0.7, color: 0xa855f7, telemetry: 'Zero-Trust Key Exchange: Quantum entropy seed 0x7A9B valid' },
      { name: 'Ashburn Relay-Sat 3', radius: 3.5, speed: 0.005, angle: Math.PI * 1.4, color: 0x38bdf8, telemetry: 'BGP Space-Relay: 42 autonomous systems synced, 0 route leaks' },
    ];

    satellites.forEach((sat) => {
      const satGroup = new THREE.Group();

      // Satellite core bus (cube)
      const busGeo = new THREE.BoxGeometry(0.12, 0.12, 0.16);
      const busMat = new THREE.MeshBasicMaterial({ color: sat.color });
      const busMesh = new THREE.Mesh(busGeo, busMat);
      satGroup.add(busMesh);

      // Solar arrays (wings)
      const solarGeo = new THREE.PlaneGeometry(0.3, 0.1);
      const solarMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const wing1 = new THREE.Mesh(solarGeo, solarMat);
      wing1.position.set(0.2, 0, 0);
      const wing2 = new THREE.Mesh(solarGeo, solarMat);
      wing2.position.set(-0.2, 0, 0);
      satGroup.add(wing1);
      satGroup.add(wing2);

      busMesh.userData = {
        isSatellite: true,
        name: sat.name,
        telemetry: sat.telemetry,
        radius: sat.radius,
      };

      this.satellitesGroup.add(satGroup);
      this.satelliteMeshes.push({
        mesh: busMesh,
        name: sat.name,
        radius: sat.radius,
        speed: sat.speed,
        angle: sat.angle,
        telemetry: sat.telemetry,
      });
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

  public launchHostileMissile(targetName?: string): { message: string; targetNode: string } {
    let targetNode = ORBITAL_NODES.find(n => n.name.toLowerCase() === targetName?.toLowerCase());
    if (!targetNode) {
      targetNode = ORBITAL_NODES[Math.floor(Math.random() * ORBITAL_NODES.length)];
    }

    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12
    ).normalize().multiplyScalar(7.5);

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

    // Glowing hostile projectile head
    const missileGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const missileMat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      transparent: true,
      opacity: 1
    });
    const missile = new THREE.Mesh(missileGeo, missileMat);
    missile.position.copy(startPos);
    this.arcsGroup.add(missile);

    const nodeItem = this.nodeMeshes.find(n => n.data.id === targetNode!.id);
    const targetMesh = nodeItem ? nodeItem.mesh : this.nodeMeshes[0].mesh;
    const targetBeacon = nodeItem ? nodeItem.beacon : this.nodeMeshes[0].beacon;
    const originalColor = targetNode.color;

    this.activeHostileArcs.push({
      line: hostileLine,
      missile,
      progress: 0,
      speed: 0.02,
      curve,
      targetNode,
      targetMesh,
      targetBeacon,
      originalColor
    });

    return {
      message: `Simulated attack [Vector T1059.001] intercepted at Node ${targetNode.name}!`,
      targetNode: targetNode.name
    };
  }

  public clearHostileArcs() {
    this.activeHostileArcs.forEach((hostile) => {
      const beaconMat = hostile.targetBeacon.material as THREE.MeshBasicMaterial;
      beaconMat.color.setHex(hostile.originalColor);
      const meshMat = hostile.targetMesh.material as THREE.MeshBasicMaterial;
      meshMat.color.setHex(hostile.originalColor);

      this.arcsGroup.remove(hostile.line);
      this.arcsGroup.remove(hostile.missile);
      hostile.line.geometry.dispose();
      (hostile.line.material as THREE.Material).dispose();
      hostile.missile.geometry.dispose();
      (hostile.missile.material as THREE.Material).dispose();
    });
    this.activeHostileArcs = [];
  }

  public update(delta: number, elapsed: number) {
    // Synchronized gentle rotation across all elements
    const rotSpeed = 0.0020;
    this.coreSphere.rotation.y += rotSpeed;
    this.continentPoints.rotation.y += rotSpeed;
    this.nodesGroup.rotation.y += rotSpeed;
    this.arcsGroup.rotation.y += rotSpeed;

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

    // Animate normal arc brightness pulses
    this.activeArcs.forEach((arc) => {
      arc.progress = (arc.progress + arc.speed) % 1;
      const lineMat = arc.line.material as THREE.LineBasicMaterial;
      lineMat.opacity = 0.3 + Math.sin(elapsed * 6 + arc.progress * Math.PI) * 0.4;
    });

    // Animate hostile missiles along curve and auto-clean them
    for (let i = this.activeHostileArcs.length - 1; i >= 0; i--) {
      const hostile = this.activeHostileArcs[i];
      hostile.progress += hostile.speed;

      if (hostile.progress < 1.0) {
        // Traveling along curve towards target
        const pos = hostile.curve.getPoint(hostile.progress);
        hostile.missile.position.copy(pos);
      } else if (hostile.progress < 2.5) {
        // Impact at target node - flash red beacon
        const endPos = hostile.curve.getPoint(1.0);
        hostile.missile.position.copy(endPos);
        const beaconMat = hostile.targetBeacon.material as THREE.MeshBasicMaterial;
        beaconMat.color.setHex(0xf43f5e);
        const meshMat = hostile.targetMesh.material as THREE.MeshBasicMaterial;
        meshMat.color.setHex(0xf43f5e);
        const lineMat = hostile.line.material as THREE.LineBasicMaterial;
        lineMat.opacity = Math.max(0, 0.9 - (hostile.progress - 1.0) * 0.6);
      } else {
        // Auto-cleanup and restore node original defense color
        const beaconMat = hostile.targetBeacon.material as THREE.MeshBasicMaterial;
        beaconMat.color.setHex(hostile.originalColor);
        const meshMat = hostile.targetMesh.material as THREE.MeshBasicMaterial;
        meshMat.color.setHex(hostile.originalColor);

        this.arcsGroup.remove(hostile.line);
        this.arcsGroup.remove(hostile.missile);
        hostile.line.geometry.dispose();
        (hostile.line.material as THREE.Material).dispose();
        hostile.missile.geometry.dispose();
        (hostile.missile.material as THREE.Material).dispose();

        this.activeHostileArcs.splice(i, 1);
      }
    }

    // Radar sweep rotation
    if (this.radarSweepMesh) {
      this.radarSweepMesh.rotation.z -= 0.02;
    }
    if (this.radarBeamLine) {
      this.radarBeamLine.rotation.y += 0.02;
    }

    // Animate orbiting satellites
    this.satelliteMeshes.forEach((sat) => {
      sat.angle += sat.speed;
      const parent = sat.mesh.parent;
      if (parent) {
        parent.position.set(
          Math.cos(sat.angle) * sat.radius,
          Math.sin(sat.angle * 1.5) * 0.45,
          Math.sin(sat.angle) * sat.radius
        );
        parent.rotation.y += 0.015;
      }
    });
  }

  public getNodeMeshes(): THREE.Mesh[] {
    return this.nodeMeshes.map(n => n.mesh);
  }

  public getSatelliteMeshes(): THREE.Mesh[] {
    return this.satelliteMeshes.map(s => s.mesh);
  }

  public dispose() {
    this.coreSphere.geometry.dispose();
    (this.coreSphere.material as THREE.Material).dispose();
    this.continentPoints.geometry.dispose();
    (this.continentPoints.material as THREE.Material).dispose();
    this.ring1.geometry.dispose();
    (this.ring1.material as THREE.Material).dispose();
    this.ring2.geometry.dispose();
    (this.ring2.material as THREE.Material).dispose();
  }
}
