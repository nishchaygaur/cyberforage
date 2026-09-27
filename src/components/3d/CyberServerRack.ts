import * as THREE from 'three';
import { labsData } from '../../data/labsData';

export interface ServerBladeItem {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  accent: string;
  group: THREE.Group;
  baseZ: number;
  targetZ: number;
  isSelected: boolean;
  leds: THREE.Mesh[];
}

export class CyberServerRackController {
  public group: THREE.Group;
  public blades: ServerBladeItem[] = [];
  private framePillars: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.createRackFrame();
    this.createServerBlades();
  }

  private createRackFrame() {
    // 4 Corner vertical glowing pillars
    const pillarGeo = new THREE.BoxGeometry(0.12, 5.5, 0.12);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0x00f0c0,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    const positions = [
      [-2.4, 0, -1.2],
      [2.4, 0, -1.2],
      [-2.4, 0, 1.2],
      [2.4, 0, 1.2]
    ];

    positions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, y, z);
      this.group.add(pillar);
      this.framePillars.push(pillar);
    });

    // Top & Bottom chassis panels
    const panelGeo = new THREE.BoxGeometry(5.0, 0.15, 2.6);
    const panelMat = new THREE.MeshBasicMaterial({
      color: 0x071526,
      transparent: true,
      opacity: 0.85
    });

    const topPanel = new THREE.Mesh(panelGeo, panelMat);
    topPanel.position.set(0, 2.7, 0);
    this.group.add(topPanel);

    const bottomPanel = new THREE.Mesh(panelGeo, panelMat);
    bottomPanel.position.set(0, -2.7, 0);
    this.group.add(bottomPanel);

    // Subtle rack wireframe boundary
    const boundaryGeo = new THREE.WireframeGeometry(new THREE.BoxGeometry(5.0, 5.6, 2.6));
    const boundaryLine = new THREE.LineSegments(
      boundaryGeo,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15
      })
    );
    this.group.add(boundaryLine);
  }

  private createServerBlades() {
    const spacing = 0.95;
    const startY = 1.9;

    labsData.forEach((lab, index) => {
      const bladeGroup = new THREE.Group();
      const y = startY - index * spacing;
      bladeGroup.position.set(0, y, 0);

      const colorHex = parseInt(lab.accent.replace('#', '0x'), 16);

      // Main Blade Casing
      const bladeGeo = new THREE.BoxGeometry(4.6, 0.72, 2.2);
      const bladeMat = new THREE.MeshBasicMaterial({
        color: 0x05101d,
        transparent: true,
        opacity: 0.95
      });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.userData = { isBlade: true, labId: lab.id, labData: lab };
      bladeGroup.add(bladeMesh);

      // Blade Edge Neon Accent Strip (Front face)
      const stripGeo = new THREE.BoxGeometry(4.58, 0.08, 0.04);
      const stripMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        blending: THREE.AdditiveBlending
      });
      const topStrip = new THREE.Mesh(stripGeo, stripMat);
      topStrip.position.set(0, 0.32, 1.11);
      bladeGroup.add(topStrip);

      const bottomStrip = new THREE.Mesh(stripGeo, stripMat);
      bottomStrip.position.set(0, -0.32, 1.11);
      bladeGroup.add(bottomStrip);

      // Front Bezel Grill lines
      const grillCount = 6;
      for (let g = 0; g < grillCount; g++) {
        const grillGeo = new THREE.BoxGeometry(1.6, 0.03, 0.02);
        const grillMat = new THREE.MeshBasicMaterial({
          color: 0x102a4a,
          transparent: true,
          opacity: 0.7
        });
        const grill = new THREE.Mesh(grillGeo, grillMat);
        grill.position.set(-0.8, -0.18 + g * 0.07, 1.11);
        bladeGroup.add(grill);
      }

      // Front Status LED Indicators
      const leds: THREE.Mesh[] = [];
      const ledColors = [0x00f0c0, colorHex, 0x38bdf8, 0x10b981];
      ledColors.forEach((c, li) => {
        const ledGeo = new THREE.BoxGeometry(0.06, 0.06, 0.04);
        const ledMat = new THREE.MeshBasicMaterial({
          color: c,
          blending: THREE.AdditiveBlending
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(1.4 + li * 0.15, 0.1, 1.12);
        bladeGroup.add(led);
        leds.push(led);
      });

      // Front Cyber Badge Display screen
      const screenGeo = new THREE.PlaneGeometry(0.8, 0.35);
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#07162b';
        ctx.fillRect(0, 0, 128, 64);
        ctx.strokeStyle = lab.accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, 124, 60);
        ctx.fillStyle = lab.accent;
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`LAB 0${index + 1}`, 12, 26);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText(lab.category.toUpperCase().slice(0, 11), 12, 48);
      }
      const screenTex = new THREE.CanvasTexture(canvas);
      const screenMat = new THREE.MeshBasicMaterial({
        map: screenTex,
        transparent: true,
        opacity: 0.95
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0.65, 0, 1.12);
      bladeGroup.add(screen);

      this.group.add(bladeGroup);
      this.blades.push({
        id: lab.id,
        name: lab.name,
        category: lab.category,
        difficulty: lab.difficulty,
        accent: lab.accent,
        group: bladeGroup,
        baseZ: 0,
        targetZ: 0,
        isSelected: false,
        leds
      });
    });
  }

  public selectBlade(labId: string | null) {
    this.blades.forEach((blade) => {
      if (blade.id === labId) {
        blade.isSelected = true;
        blade.targetZ = 0.85; // Slide forward out of rack
      } else {
        blade.isSelected = false;
        blade.targetZ = 0;
      }
    });
  }

  public update(delta: number, elapsed: number) {
    // Smooth lerp for blades sliding out
    this.blades.forEach((blade, i) => {
      blade.group.position.z += (blade.targetZ - blade.group.position.z) * 0.12;

      // Blinking LEDs
      blade.leds.forEach((led, ledIdx) => {
        const blinkSpeed = 4 + ledIdx * 2.5 + i;
        const isOn = Math.sin(elapsed * blinkSpeed) > 0;
        (led.material as THREE.MeshBasicMaterial).opacity = isOn ? 1 : 0.2;
      });
    });

    // Gentle chassis breathing rotation
    this.group.rotation.y = Math.sin(elapsed * 0.5) * 0.15;
  }

  public getBladeMeshes(): THREE.Mesh[] {
    const list: THREE.Mesh[] = [];
    this.blades.forEach((b) => {
      b.group.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.isBlade) {
          list.push(child);
        }
      });
    });
    return list;
  }

  public dispose() {
    // Recursive disposal
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
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
