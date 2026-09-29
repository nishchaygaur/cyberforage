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
    lat: 36,
    lon: -65,
    radius: 2.50,
    category: 'SOC & Defense',
    description: 'Real-time telemetry detection & SIEM correlation pipelines.'
  },
  {
    id: 'node-ai',
    name: 'AI',
    color: 0xc084fc,
    hex: '#C084FC',
    lat: 32,
    lon: 45,
    radius: 2.50,
    category: 'Autonomous Agents',
    description: 'Triage models, anomaly inference & automated containment.'
  },
  {
    id: 'node-research',
    name: 'RESEARCH',
    color: 0x00f0c0,
    hex: '#00F0C0',
    lat: -28,
    lon: -60,
    radius: 2.50,
    category: 'Vulnerabilities & DFIR',
    description: 'Adversary emulation, malware analysis & binary forensics.'
  },
  {
    id: 'node-automation',
    name: 'AUTOMATION',
    color: 0x00f0c0,
    hex: '#00F0C0',
    lat: -24,
    lon: 60,
    radius: 2.50,
    category: 'Security Orchestration',
    description: 'n8n pipelines, webhook listeners & response orchestration.'
  }
];

interface OrbitRingData {
  group: THREE.Group;
  line: THREE.Line;
  radius: number;
  bead: THREE.Group;
  angle: number;
  speed: number;
}

interface BeaconNode {
  ring: THREE.Mesh;
  core: THREE.Mesh;
  phase: number;
  baseRadius: number;
}

export class CyberGlobeController {
  public group: THREE.Group;

  // Visual Groups
  private spherePoints!: THREE.Points;
  private constellationLines!: THREE.LineSegments;
  private beaconsGroup: THREE.Group;
  private nodesGroup: THREE.Group;
  private arcsGroup: THREE.Group;
  private ringsGroup: THREE.Group;
  private coreAtmosphereMesh!: THREE.Mesh;
  private coreGlowSprite!: THREE.Sprite;

  // Interactive Nodes & Beacons
  private nodeMeshes: { mesh: THREE.Mesh; data: OrbitalNodeData; beacon: THREE.Mesh }[] = [];
  private allBeacons: BeaconNode[] = [];
  private orbitRings: OrbitRingData[] = [];

  // Constellation Line Material
  private constellationMat!: THREE.LineBasicMaterial;

  // Arc & Missile Simulation
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

  constructor() {
    this.group = new THREE.Group();
    this.nodesGroup = new THREE.Group();
    this.beaconsGroup = new THREE.Group();
    this.arcsGroup = new THREE.Group();
    this.ringsGroup = new THREE.Group();

    // 1. Volumetric teal atmospheric core glow
    this.createInnerAtmosphereGlow();

    // 2. High-precision Fibonacci sphere dot cloud
    this.createSpherePointMatrix();

    // 3. Constellation cluster interconnect lines
    this.createConstellationLines();

    // 4. Concentric beacon nodes (◎) matching reference
    this.createBeaconNodes();

    // 5. 3 Sleek orbital rings with traveling photon beads
    this.createOrbitRings();

    // Add children to master group
    this.group.add(this.beaconsGroup);
    this.group.add(this.nodesGroup);
    this.group.add(this.arcsGroup);
    this.group.add(this.ringsGroup);
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

  /**
   * Creates the volumetric teal atmospheric glow inside the sphere
   */
  private createInnerAtmosphereGlow() {
    // 1. Inner sphere volumetric fresnel shader
    const sphereGeo = new THREE.SphereGeometry(2.46, 36, 36);
    const sphereMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x00f0c0) },
        coreColor: { value: new THREE.Color(0x03282b) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform vec3 coreColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float NdotV = max(0.0, dot(vNormal, viewDir));
          // Luminous bright center fading out towards the sphere perimeter
          float coreIntensity = pow(NdotV, 1.4) * 0.38;
          vec3 finalColor = mix(coreColor, glowColor, pow(NdotV, 2.0));
          gl_FragColor = vec4(finalColor, coreIntensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.coreAtmosphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(this.coreAtmosphereMesh);

    // 2. High-resolution smooth radial sprite centered inside
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0.0, 'rgba(0, 240, 192, 0.45)');
      grad.addColorStop(0.28, 'rgba(0, 200, 175, 0.30)');
      grad.addColorStop(0.55, 'rgba(2, 60, 75, 0.15)');
      grad.addColorStop(0.85, 'rgba(1, 25, 38, 0.03)');
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.coreGlowSprite = new THREE.Sprite(spriteMat);
    this.coreGlowSprite.scale.set(5.1, 5.1, 1);
    this.group.add(this.coreGlowSprite);
  }

  /**
   * Creates the uniform Fibonacci sphere dot matrix with 3D depth attenuation
   */
  private createSpherePointMatrix() {
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyanColor = new THREE.Color(0x00f0c0);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 rad
    const radius = 2.50;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // 1 to -1
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * r * radius;
      const z = Math.sin(theta) * r * radius;

      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = y * radius;
      positions[idx + 2] = z;

      colors[idx] = cyanColor.r;
      colors[idx + 1] = cyanColor.g;
      colors[idx + 2] = cyanColor.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High-resolution particle texture: crisp white-cyan bead core with glowing cyan falloff
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, 'rgba(230, 255, 250, 0.95)');
      grad.addColorStop(0.48, 'rgba(0, 240, 192, 0.75)');
      grad.addColorStop(0.75, 'rgba(0, 240, 192, 0.20)');
      grad.addColorStop(1.0, 'rgba(0, 240, 192, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.088,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Vertex & Fragment depth attenuation: front dots are luminous and crisp; back dots maintain clear glowing presence
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = 'varying float vFrontFace;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        'gl_PointSize = size;',
        'vec3 vSphereNorm = normalize(mat3(modelViewMatrix) * transformed);\n' +
        'vec3 vViewDir = -normalize(mvPosition.xyz);\n' +
        'float NdotV = dot(vSphereNorm, vViewDir);\n' +
        'vFrontFace = smoothstep(-0.35, 0.65, NdotV);\n' +
        'gl_PointSize = size * (0.72 + 0.40 * vFrontFace);'
      );
      shader.fragmentShader = 'varying float vFrontFace;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        '#include <color_fragment>\n' +
        'diffuseColor.a *= (0.42 + 0.58 * vFrontFace);\n' +
        'if (diffuseColor.a < 0.02) discard;'
      );
    };
    mat.customProgramCacheKey = () => 'cyber-globe-fibonacci-depth-dots-v2';

    this.spherePoints = new THREE.Points(geo, mat);
    this.group.add(this.spherePoints);
  }

  /**
   * Creates constellation interconnect line segments in localized cyber clusters
   */
  private createConstellationLines() {
    const count = 2200;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const radius = 2.50;

    // Reconstruct point positions
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      pts.push(new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      ));
    }

    // 16 localized cluster centers across the sphere
    const clusterSeeds: THREE.Vector3[] = [];
    for (let s = 0; s < 16; s++) {
      clusterSeeds.push(pts[Math.floor(s * (count / 16))]);
    }

    const linePoints: THREE.Vector3[] = [];
    const connectedPairs = new Set<string>();

    for (const seed of clusterSeeds) {
      // Find nearby points within cluster radius
      const clusterIndices: number[] = [];
      for (let i = 0; i < count; i++) {
        if (seed.distanceTo(pts[i]) < 0.50) {
          clusterIndices.push(i);
        }
      }

      // Connect neighbor pairs within distance threshold
      for (let a = 0; a < clusterIndices.length; a++) {
        let connections = 0;
        for (let b = a + 1; b < clusterIndices.length; b++) {
          const idxA = clusterIndices[a];
          const idxB = clusterIndices[b];
          const dist = pts[idxA].distanceTo(pts[idxB]);
          const pairKey = idxA < idxB ? `${idxA}-${idxB}` : `${idxB}-${idxA}`;

          if (dist > 0.16 && dist < 0.36 && !connectedPairs.has(pairKey)) {
            connectedPairs.add(pairKey);
            linePoints.push(pts[idxA], pts[idxB]);
            connections++;
            if (connections >= 2) break;
          }
        }
        if (linePoints.length >= 320) break; // Limit to ~160 clean line segments
      }
      if (linePoints.length >= 320) break;
    }

    const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
    this.constellationMat = new THREE.LineBasicMaterial({
      color: 0x00f0c0,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.constellationLines = new THREE.LineSegments(geo, this.constellationMat);
    this.group.add(this.constellationLines);
  }

  /**
   * Creates the prominent concentric halo ring beacon nodes (◎)
   */
  private createBeaconNodes() {
    // 1. The 4 primary interactive orbital nodes (Security, AI, Research, Automation)
    ORBITAL_NODES.forEach((node) => {
      const pos = this.latLonToVector3(node.lat, node.lon, 2.50);

      // Inner glowing core bead
      const coreGeo = new THREE.SphereGeometry(0.052, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.95
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);
      coreMesh.userData = { isNode: true, ...node };

      // Outer concentric halo ring (◎)
      const ringGeo = new THREE.RingGeometry(0.088, 0.118, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.80,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));

      this.nodesGroup.add(coreMesh);
      this.beaconsGroup.add(ringMesh);

      this.nodeMeshes.push({ mesh: coreMesh, data: node, beacon: ringMesh });
      this.allBeacons.push({
        ring: ringMesh,
        core: coreMesh,
        phase: Math.random() * Math.PI * 2,
        baseRadius: 0.10
      });
    });

    // 2. ~20 prominent decorative beacon nodes distributed across the sphere
    const beaconCoords = [
      { lat: 55, lon: -20 },
      { lat: 60, lon: 95 },
      { lat: 48, lon: -140 },
      { lat: 25, lon: 110 },
      { lat: 15, lon: -115 },
      { lat: 10, lon: -10 },
      { lat: -5, lon: 20 },
      { lat: -8, lon: 145 },
      { lat: -18, lon: -155 },
      { lat: -42, lon: -12 },
      { lat: -50, lon: 85 },
      { lat: -48, lon: -125 },
      { lat: 68, lon: 15 },
      { lat: 40, lon: 165 },
      { lat: -35, lon: -170 },
      { lat: 2, lon: -80 },
      { lat: -25, lon: -35 },
      { lat: 30, lon: -175 },
      { lat: -15, lon: 175 },
      { lat: 50, lon: -85 }
    ];

    const cyanColor = 0x00f0c0;
    const ringGeo = new THREE.RingGeometry(0.082, 0.112, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const coreGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.90
    });

    beaconCoords.forEach((coord, idx) => {
      const pos = this.latLonToVector3(coord.lat, coord.lon, 2.50);

      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));

      this.beaconsGroup.add(coreMesh);
      this.beaconsGroup.add(ringMesh);

      this.allBeacons.push({
        ring: ringMesh,
        core: coreMesh,
        phase: idx * 0.45,
        baseRadius: 0.095
      });
    });
  }

  /**
   * Creates the 3 sleek orbital rings with traveling glowing beads
   */
  private createOrbitRings() {
    const ringConfigs = [
      { radius: 3.38, rot: new THREE.Euler(0.72, 0.22, -0.52), speed: 0.008, color: 0x00f0c0, opacity: 0.38 },
      { radius: 3.56, rot: new THREE.Euler(-0.62, 0.38, 0.68), speed: -0.006, color: 0x00f0c0, opacity: 0.32 },
      { radius: 3.44, rot: new THREE.Euler(0.30, -0.42, 0.20), speed: 0.007, color: 0x00f0c0, opacity: 0.30 }
    ];

    const segments = 128;
    const coreGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const haloGeo = new THREE.RingGeometry(0.065, 0.135, 24);

    ringConfigs.forEach((cfg) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.copy(cfg.rot);

      // Smooth continuous circle line
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * cfg.radius, 0, Math.sin(theta) * cfg.radius));
      }

      const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending
      });
      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringGroup.add(ringLine);

      // Glowing traveling photon packet with white-hot core and cyan aura
      const beadGroup = new THREE.Group();

      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98,
        blending: THREE.AdditiveBlending
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      beadGroup.add(core);

      const haloMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.lookAt(new THREE.Vector3(0, 0, 1));
      beadGroup.add(halo);

      beadGroup.position.set(cfg.radius, 0, 0);
      ringGroup.add(beadGroup);

      this.ringsGroup.add(ringGroup);

      this.orbitRings.push({
        group: ringGroup,
        line: ringLine,
        radius: cfg.radius,
        bead: beadGroup,
        angle: Math.random() * Math.PI * 2,
        speed: cfg.speed
      });
    });
  }

  /**
   * High-speed data packet arcs connecting nodes
   */
  public triggerAttackSimulation() {
    const colors = [0x00f0c0, 0xc084fc, 0x00f0c0, 0x38bdf8];

    for (let i = 0; i < ORBITAL_NODES.length; i++) {
      const source = ORBITAL_NODES[i];
      const target = ORBITAL_NODES[(i + 1) % ORBITAL_NODES.length];

      const p1 = this.latLonToVector3(source.lat, source.lon, source.radius);
      const p2 = this.latLonToVector3(target.lat, target.lon, target.radius);

      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(3.2);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.50,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(arcGeo, arcMat);
      this.arcsGroup.add(line);
      this.activeArcs.push({
        line,
        progress: 0,
        speed: 0.015 + Math.random() * 0.015,
        curve
      });
    }
  }

  /**
   * Threat intercept missile simulation
   */
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
    const missileGeo = new THREE.SphereGeometry(0.10, 16, 16);
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
    const rotSpeed = 0.0020;

    // Rotate core sphere elements synchronously
    this.spherePoints.rotation.y += rotSpeed;
    this.constellationLines.rotation.y += rotSpeed;
    this.beaconsGroup.rotation.y += rotSpeed;
    this.nodesGroup.rotation.y += rotSpeed;
    this.arcsGroup.rotation.y += rotSpeed;

    // Subtle breathing pulse on constellation lines
    if (this.constellationMat) {
      this.constellationMat.opacity = 0.25 + 0.12 * Math.sin(elapsed * 2.2);
    }

    // Advance traveling photon beads along orbital rings
    this.orbitRings.forEach((ring) => {
      ring.angle += ring.speed;
      ring.bead.position.set(
        Math.cos(ring.angle) * ring.radius,
        0,
        Math.sin(ring.angle) * ring.radius
      );
    });

    // Animate concentric beacon rings (breathing pulse ◎)
    this.allBeacons.forEach((beacon) => {
      const scale = 1.0 + 0.16 * Math.sin(elapsed * 2.8 + beacon.phase);
      beacon.ring.scale.set(scale, scale, 1);
    });

    // Animate normal arc brightness pulses
    this.activeArcs.forEach((arc) => {
      arc.progress = (arc.progress + arc.speed) % 1;
      const lineMat = arc.line.material as THREE.LineBasicMaterial;
      lineMat.opacity = 0.25 + Math.sin(elapsed * 5 + arc.progress * Math.PI) * 0.35;
    });

    // Animate hostile missiles along curve and auto-clean them
    for (let i = this.activeHostileArcs.length - 1; i >= 0; i--) {
      const hostile = this.activeHostileArcs[i];
      hostile.progress += hostile.speed;

      if (hostile.progress < 1.0) {
        const pos = hostile.curve.getPoint(hostile.progress);
        hostile.missile.position.copy(pos);
      } else if (hostile.progress < 2.5) {
        const endPos = hostile.curve.getPoint(1.0);
        hostile.missile.position.copy(endPos);
        const beaconMat = hostile.targetBeacon.material as THREE.MeshBasicMaterial;
        beaconMat.color.setHex(0xf43f5e);
        const meshMat = hostile.targetMesh.material as THREE.MeshBasicMaterial;
        meshMat.color.setHex(0xf43f5e);
        const lineMat = hostile.line.material as THREE.LineBasicMaterial;
        lineMat.opacity = Math.max(0, 0.9 - (hostile.progress - 1.0) * 0.6);
      } else {
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
  }

  public getNodeMeshes(): THREE.Mesh[] {
    return this.nodeMeshes.map(n => n.mesh);
  }

  public getSatelliteMeshes(): THREE.Mesh[] {
    return [];
  }

  public dispose() {
    this.spherePoints.geometry.dispose();
    (this.spherePoints.material as THREE.Material).dispose();
    this.constellationLines.geometry.dispose();
    (this.constellationLines.material as THREE.Material).dispose();
    this.coreAtmosphereMesh.geometry.dispose();
    (this.coreAtmosphereMesh.material as THREE.Material).dispose();
    this.coreGlowSprite.material.dispose();

    this.orbitRings.forEach((r) => {
      r.line.geometry.dispose();
      (r.line.material as THREE.Material).dispose();
      r.bead.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
    });
  }
}
