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
    lon: -62,
    radius: 2.50,
    category: 'SOC & Defense',
    description: 'Real-time telemetry detection & SIEM correlation pipelines.'
  },
  {
    id: 'node-ai',
    name: 'AI',
    color: 0xc084fc,
    hex: '#C084FC',
    lat: 28,
    lon: 50,
    radius: 2.50,
    category: 'Autonomous Agents',
    description: 'Triage models, anomaly inference & automated containment.'
  },
  {
    id: 'node-research',
    name: 'RESEARCH',
    color: 0x00f0c0,
    hex: '#00F0C0',
    lat: -26,
    lon: -65,
    radius: 2.50,
    category: 'Vulnerabilities & DFIR',
    description: 'Adversary emulation, malware analysis & binary forensics.'
  },
  {
    id: 'node-automation',
    name: 'AUTOMATION',
    color: 0x00f0c0,
    hex: '#00F0C0',
    lat: -22,
    lon: 58,
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

interface PulsingBeaconSprite {
  sprite: THREE.Sprite;
  baseScale: number;
  phase: number;
  speed: number;
  isAi?: boolean;
}

export class CyberGlobeController {
  public group: THREE.Group;

  // Visual Groups
  private globePivot: THREE.Group;
  private sphereContainer: THREE.Group;
  private spherePoints!: THREE.Points;
  private networkLines: THREE.LineSegments | null = null;
  private beaconsGroup: THREE.Group;
  private nodesGroup: THREE.Group;
  private arcsGroup: THREE.Group;
  private ringsGroup: THREE.Group;
  private coreAtmosphereMesh!: THREE.Mesh;
  private coreGlowSprite!: THREE.Sprite;

  // Beacon and Interactive Node tracking
  private nodeMeshes: { mesh: THREE.Mesh; data: OrbitalNodeData; beacon: THREE.Sprite }[] = [];
  private pulsingSprites: PulsingBeaconSprite[] = [];
  private orbitRings: OrbitRingData[] = [];

  // Cached textures
  private cyanBeaconTexture: THREE.CanvasTexture | null = null;
  private purpleBeaconTexture: THREE.CanvasTexture | null = null;

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
    targetBeacon: THREE.Sprite;
    originalColor: number;
  }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.globePivot = new THREE.Group();
    this.sphereContainer = new THREE.Group();
    this.nodesGroup = new THREE.Group();
    this.beaconsGroup = new THREE.Group();
    this.arcsGroup = new THREE.Group();
    this.ringsGroup = new THREE.Group();

    // Uniform forward polar tilt applied to the entire globe system (both rotating sphere and orbital rings)
    this.globePivot.rotation.x = 0.38; // ~22 degrees forward tilt towards viewer
    this.globePivot.rotation.z = 0; // Strict zero side-tilt: ensures orbital rings are 100% mathematically symmetrical

    // 1. Inner volumetric teal atmospheric core glow
    this.createInnerAtmosphereGlow();

    // 2. High-precision latitude concentric-ring sphere point matrix
    this.createSpherePointMatrix();

    // 3. Dynamic larger pulsing beacon dots with glowing core and halo ring
    this.createPulsingNodes();

    // 4. 3 Perfectly aligned, symmetrical orbital rings with traveling photon beads
    this.createOrbitRings();

    // Assemble hierarchy
    this.sphereContainer.add(this.beaconsGroup);
    this.sphereContainer.add(this.nodesGroup);
    this.sphereContainer.add(this.arcsGroup);

    // Both the rotating sphere and stationary orbital rings share the exact same globePivot center & tilt
    this.globePivot.add(this.sphereContainer);
    this.globePivot.add(this.ringsGroup);

    this.group.add(this.globePivot);
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
   * Generates a high-resolution billboard texture with a solid bright core dot
   * and a soft translucent glowing halo ring, matching the exact video aesthetics.
   */
  private getOrCreateBeaconTexture(hexColor: string, isPurple = false): THREE.CanvasTexture {
    if (isPurple && this.purpleBeaconTexture) return this.purpleBeaconTexture;
    if (!isPurple && this.cyanBeaconTexture) return this.cyanBeaconTexture;

    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const cx = size / 2;
      const cy = size / 2;

      // 1. Translucent outer halo aura
      const haloGrad = ctx.createRadialGradient(cx, cy, 16, cx, cy, 54);
      haloGrad.addColorStop(0, `${hexColor}55`); // ~33% opacity
      haloGrad.addColorStop(0.70, `${hexColor}25`); // ~15% opacity
      haloGrad.addColorStop(1.0, `${hexColor}00`);
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 54, 0, Math.PI * 2);
      ctx.fill();

      // 2. Solid bright core dot
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.40, hexColor);
      coreGrad.addColorStop(1.0, hexColor);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    if (isPurple) {
      this.purpleBeaconTexture = tex;
    } else {
      this.cyanBeaconTexture = tex;
    }
    return tex;
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
        coreColor: { value: new THREE.Color(0x023537) }
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
          // Luminous bright center fading out smoothly towards the sphere perimeter
          float coreIntensity = pow(NdotV, 1.4) * 0.36;
          vec3 finalColor = mix(coreColor, glowColor, pow(NdotV, 2.0));
          gl_FragColor = vec4(finalColor, coreIntensity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.coreAtmosphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.sphereContainer.add(this.coreAtmosphereMesh);

    // 2. High-resolution smooth radial sprite centered inside
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0.0, 'rgba(0, 240, 192, 0.40)');
      grad.addColorStop(0.28, 'rgba(0, 200, 175, 0.26)');
      grad.addColorStop(0.55, 'rgba(2, 60, 75, 0.12)');
      grad.addColorStop(0.85, 'rgba(1, 25, 38, 0.02)');
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.coreGlowSprite = new THREE.Sprite(spriteMat);
    this.coreGlowSprite.scale.set(5.1, 5.1, 1);
    this.sphereContainer.add(this.coreGlowSprite);
  }

  /**
   * Creates the uniform latitude-ring concentric dot sphere matching the video reference
   */
  private createSpherePointMatrix() {
    const radius = 2.50;
    const numBands = 38;
    const points: THREE.Vector3[] = [];
    const colors: number[] = [];

    const cyanColor = new THREE.Color(0x00f0c0);

    for (let i = 0; i < numBands; i++) {
      const lat = -Math.PI / 2 + ((i + 1) * Math.PI) / (numBands + 1);
      const r = radius * Math.cos(lat);
      const y = radius * Math.sin(lat);
      const circ = 2 * Math.PI * r;

      // Density tuned so rings appear clearly defined and elegant (~1700 total dots)
      const numPts = Math.max(1, Math.round(circ / 0.158));

      for (let j = 0; j < numPts; j++) {
        // Aligned concentric circles
        const lon = (j * 2 * Math.PI) / numPts;
        const x = r * Math.cos(lon);
        const z = r * Math.sin(lon);

        points.push(new THREE.Vector3(x, y, z));
        colors.push(cyanColor.r, cyanColor.g, cyanColor.b);
      }
    }

    const positions = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      positions[i * 3] = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    // Particle texture: crisp circular bead with soft cyan glow
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, 'rgba(230, 255, 250, 0.95)');
      grad.addColorStop(0.50, 'rgba(0, 240, 192, 0.80)');
      grad.addColorStop(0.78, 'rgba(0, 240, 192, 0.18)');
      grad.addColorStop(1.0, 'rgba(0, 240, 192, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.086,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Vertex & Fragment depth attenuation: front dots are crisp and radiant; back dots maintain soft depth presence
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = 'varying float vFrontFace;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        'gl_PointSize = size;',
        'vec3 vSphereNorm = normalize(mat3(modelViewMatrix) * transformed);\n' +
        'vec3 vViewDir = -normalize(mvPosition.xyz);\n' +
        'float NdotV = dot(vSphereNorm, vViewDir);\n' +
        'vFrontFace = smoothstep(-0.35, 0.65, NdotV);\n' +
        'gl_PointSize = size * (0.75 + 0.40 * vFrontFace);'
      );
      shader.fragmentShader = 'varying float vFrontFace;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        '#include <color_fragment>\n' +
        'diffuseColor.a *= (0.38 + 0.62 * vFrontFace);\n' +
        'if (diffuseColor.a < 0.02) discard;'
      );
    };
    mat.customProgramCacheKey = () => 'cyber-globe-latitude-matrix-v1';

    this.spherePoints = new THREE.Points(geo, mat);
    this.sphereContainer.add(this.spherePoints);
  }

  /**
   * Creates larger, darker glowing beacon dots with concentric halo ring (glow & dim cycle)
   */
  private createPulsingNodes() {
    const cyanTex = this.getOrCreateBeaconTexture('#00F0C0', false);
    const purpleTex = this.getOrCreateBeaconTexture('#C084FC', true);

    // 1. The 4 primary interactive orbital nodes (Security, AI, Research, Automation)
    ORBITAL_NODES.forEach((node) => {
      const pos = this.latLonToVector3(node.lat, node.lon, 2.50);
      const isAi = node.id === 'node-ai';

      const spriteMat = new THREE.SpriteMaterial({
        map: isAi ? purpleTex : cyanTex,
        transparent: true,
        opacity: 0.90,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      const baseScale = 0.46;
      sprite.scale.set(baseScale, baseScale, 1);

      // Invisible hit-test sphere for interaction raycasting
      const hitGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(pos);
      hitMesh.userData = { isNode: true, ...node };

      this.nodesGroup.add(sprite);
      this.nodesGroup.add(hitMesh);

      this.nodeMeshes.push({ mesh: hitMesh, data: node, beacon: sprite });
      this.pulsingSprites.push({
        sprite,
        baseScale,
        phase: Math.random() * Math.PI * 2,
        speed: 1.8 + Math.random() * 0.8,
        isAi
      });
    });

    // 2. ~32 prominent decorative larger beacon dots distributed across the sphere
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
      { lat: 50, lon: -85 },
      { lat: -60, lon: 30 },
      { lat: 72, lon: -50 },
      { lat: -10, lon: -70 },
      { lat: 20, lon: 55 },
      { lat: 35, lon: -10 },
      { lat: -30, lon: 15 },
      { lat: 18, lon: 135 },
      { lat: -45, lon: -75 },
      { lat: 52, lon: 40 },
      { lat: -55, lon: -40 },
      { lat: 8, lon: 90 },
      { lat: -38, lon: 120 }
    ];

    beaconCoords.forEach((coord, idx) => {
      const pos = this.latLonToVector3(coord.lat, coord.lon, 2.50);

      const spriteMat = new THREE.SpriteMaterial({
        map: cyanTex,
        transparent: true,
        opacity: 0.70,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(pos);
      const baseScale = 0.38 + (idx % 3) * 0.06;
      sprite.scale.set(baseScale, baseScale, 1);

      this.beaconsGroup.add(sprite);

      this.pulsingSprites.push({
        sprite,
        baseScale,
        phase: idx * 0.42,
        speed: 1.6 + (idx % 4) * 0.32
      });
    });
  }

  /**
   * Creates the 3 sleek orbital rings matching the video reference
   * Perfectly aligned, concentric, and mathematically symmetrical
   */
  private createOrbitRings() {
    // All 3 orbital rings have uniform, identical radius perfectly framing the 2.50 radius sphere
    const ringRadius = 2.92;
    const ringConfigs = [
      // 1. Ascending Orbit (passing near Research & AI)
      { radius: ringRadius, rot: new THREE.Euler(0.04, 0.04, 0.40), speed: 0.006, color: 0x00f0c0, opacity: 0.35 },
      // 2. Descending Orbit (passing near Security & Automation) - exact mathematical mirror twin
      { radius: ringRadius, rot: new THREE.Euler(0.04, -0.04, -0.40), speed: -0.006, color: 0x00f0c0, opacity: 0.35 },
      // 3. Equatorial Orbit - circles concentric around the globe equator
      { radius: ringRadius, rot: new THREE.Euler(0, 0, 0), speed: 0.005, color: 0x00f0c0, opacity: 0.30 }
    ];

    const segments = 128;
    const coreGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const haloGeo = new THREE.RingGeometry(0.055, 0.115, 24);

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

      // Glowing traveling photon packet
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
      hostile.targetBeacon.material.color.setHex(hostile.originalColor);
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
    const rotSpeed = 0.0022; // Smooth continuous rotation matching the video

    // Rotate core sphere elements around the tilted polar axis
    this.sphereContainer.rotation.y += rotSpeed;

    // Advance traveling photon beads along orbital rings
    this.orbitRings.forEach((ring) => {
      ring.angle += ring.speed;
      ring.bead.position.set(
        Math.cos(ring.angle) * ring.radius,
        0,
        Math.sin(ring.angle) * ring.radius
      );
    });

    // Animate beacon dots: smooth breathing glow and dim cycle (matching video)
    this.pulsingSprites.forEach((item) => {
      const wave = 0.5 + 0.5 * Math.sin(elapsed * item.speed + item.phase);
      const s = item.baseScale * (0.85 + 0.32 * wave);
      item.sprite.scale.set(s, s, 1);
      item.sprite.material.opacity = 0.40 + 0.58 * wave;
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
        hostile.targetBeacon.material.color.setHex(0xf43f5e);
        const meshMat = hostile.targetMesh.material as THREE.MeshBasicMaterial;
        meshMat.color.setHex(0xf43f5e);
        const lineMat = hostile.line.material as THREE.LineBasicMaterial;
        lineMat.opacity = Math.max(0, 0.9 - (hostile.progress - 1.0) * 0.6);
      } else {
        hostile.targetBeacon.material.color.setHex(hostile.originalColor);
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
    if (this.networkLines) {
      this.networkLines.geometry.dispose();
      (this.networkLines.material as THREE.Material).dispose();
    }
    this.coreAtmosphereMesh.geometry.dispose();
    (this.coreAtmosphereMesh.material as THREE.Material).dispose();
    this.coreGlowSprite.material.dispose();

    this.pulsingSprites.forEach((p) => {
      p.sprite.material.dispose();
    });

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

    this.cyanBeaconTexture?.dispose();
    this.purpleBeaconTexture?.dispose();
  }
}
