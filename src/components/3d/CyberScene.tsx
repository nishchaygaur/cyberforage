import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CyberGlobeController, OrbitalNodeData } from './CyberGlobe';
import { CyberServerRackController } from './CyberServerRack';
import { CyberArchitectureMeshController, MeshNodeData } from './CyberArchitectureMesh';
import { SceneMode } from '../../types';
import { cyberSound } from '../../audio/cyberSoundEngine';

interface CyberSceneProps {
  mode: SceneMode;
  onSelectNode?: (node: OrbitalNodeData | null) => void;
  onSelectBlade?: (labId: string | null) => void;
  onSelectMeshNode?: (meshNode: MeshNodeData | null) => void;
  onAttackIntercepted?: (msg: string) => void;
  attackTrigger?: number;
  className?: string;
  interactive?: boolean;
}

export const CyberScene: React.FC<CyberSceneProps> = ({
  mode,
  onSelectNode,
  onSelectBlade,
  onSelectMeshNode,
  onAttackIntercepted,
  attackTrigger,
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Controllers
  const globeRef = useRef<CyberGlobeController | null>(null);
  const rackRef = useRef<CyberServerRackController | null>(null);
  const meshRef = useRef<CyberArchitectureMeshController | null>(null);

  // Interaction State
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ x: 0.2, y: 0 });
  const cameraTargetDistance = useRef(mode === 'server' ? 8.5 : 7.2);
  const currentCameraDistance = useRef(7.2);

  // Animation Frame
  const animationFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Handle attack trigger from outside (e.g. CLI or button)
  useEffect(() => {
    if (attackTrigger && attackTrigger > 0 && globeRef.current) {
      const res = globeRef.current.launchHostileMissile();
      cyberSound.playAlert();
      if (onAttackIntercepted) {
        onAttackIntercepted(res.message);
      }
    }
  }, [attackTrigger, onAttackIntercepted]);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return;

    // Dimensions
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // Three.js Core
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040812, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Starfield Background Particles
    const starCount = 650;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 45;
      starPos[i + 1] = (Math.random() - 0.5) * 35;
      starPos[i + 2] = (Math.random() - 0.5) * 40 - 5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Initialize 3D Controllers
    const globe = new CyberGlobeController();
    globeRef.current = globe;
    scene.add(globe.group);

    const rack = new CyberServerRackController();
    rackRef.current = rack;
    rack.group.position.set(0, 0, 0);
    rack.group.visible = false;
    scene.add(rack.group);

    const mesh = new CyberArchitectureMeshController();
    meshRef.current = mesh;
    mesh.group.position.set(0, 0, 0);
    mesh.group.visible = false;
    scene.add(mesh.group);

    // Raycaster for click / hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse & Touch Orbit Handlers
    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraRotation.current.y += deltaX * 0.006;
      cameraRotation.current.x = Math.max(-0.9, Math.min(0.9, cameraRotation.current.x + deltaY * 0.005));

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      // Only zoom 3D scene when Ctrl/Meta is held or in 'free' mode, allowing normal frictionless page scrolling
      if (e.ctrlKey || e.metaKey || mode === 'free') {
        cameraTargetDistance.current = Math.max(4.5, Math.min(14.0, cameraTargetDistance.current + e.deltaY * 0.005));
      }
    };

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!interactive || !isDragging.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      // If user is predominantly swiping horizontally, rotate 3D camera
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        cameraRotation.current.y += deltaX * 0.006;
      } else {
        cameraRotation.current.x = Math.max(-0.9, Math.min(0.9, cameraRotation.current.x + deltaY * 0.005));
      }

      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    // Click Detection for Nodes & Blades
    const onClick = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      if (globe.group.visible) {
        const nodeMeshes = globe.getNodeMeshes();
        const intersects = raycaster.intersectObjects(nodeMeshes);
        if (intersects.length > 0) {
          const clickedNode = intersects[0].object.userData as OrbitalNodeData;
          cyberSound.playClick();
          if (onSelectNode) onSelectNode(clickedNode);
          return;
        }

        const satMeshes = globe.getSatelliteMeshes();
        const satIntersects = raycaster.intersectObjects(satMeshes);
        if (satIntersects.length > 0) {
          const satData = satIntersects[0].object.userData;
          cyberSound.playRadioStatic();
          cyberSound.speakVoice(`Orbital intercept: ${satData.name}`);
          if (onAttackIntercepted) {
            onAttackIntercepted(`[SAT-SIGINT] ${satData.name} (${satData.radius}AU): ${satData.telemetry}`);
          }
          return;
        }
      }

      if (rack.group.visible) {
        const bladeMeshes = rack.getBladeMeshes();
        const intersects = raycaster.intersectObjects(bladeMeshes);
        if (intersects.length > 0) {
          const labData = intersects[0].object.userData.labData;
          cyberSound.playClick();
          rack.selectBlade(labData.id);
          if (onSelectBlade) onSelectBlade(labData.id);
          return;
        }
      }
    };

    // Attach interaction listeners
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: true });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('click', onClick);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver for CPU/GPU efficiency (Modern Web Best Practice)
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(mount);

    // Render Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current || document.hidden) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth distance zoom lerp
      currentCameraDistance.current += (cameraTargetDistance.current - currentCameraDistance.current) * 0.08;

      // Update camera orbital position
      const cx = Math.sin(cameraRotation.current.y) * Math.cos(cameraRotation.current.x) * currentCameraDistance.current;
      const cy = Math.sin(cameraRotation.current.x) * currentCameraDistance.current;
      const cz = Math.cos(cameraRotation.current.y) * Math.cos(cameraRotation.current.x) * currentCameraDistance.current;

      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0, 0);

      // Starfield slow drift
      starField.rotation.y = elapsed * 0.015;

      // Update active controllers
      if (globe.group.visible) globe.update(delta, elapsed);
      if (rack.group.visible) rack.update(delta, elapsed);
      if (mesh.group.visible) mesh.update(delta, elapsed);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('click', onClick);

      globe.dispose();
      rack.dispose();
      mesh.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, [interactive, onSelectBlade, onSelectMeshNode, onSelectNode]);

  // Handle Mode Transitions (Globe <-> Server Rack <-> Mesh <-> Free)
  useEffect(() => {
    if (!globeRef.current || !rackRef.current || !meshRef.current) return;

    if (mode === 'globe') {
      globeRef.current.group.visible = true;
      rackRef.current.group.visible = false;
      meshRef.current.group.visible = false;
      cameraTargetDistance.current = 7.2;
    } else if (mode === 'server') {
      globeRef.current.group.visible = false;
      rackRef.current.group.visible = true;
      meshRef.current.group.visible = false;
      cameraTargetDistance.current = 8.5;
    } else if (mode === 'mesh') {
      globeRef.current.group.visible = false;
      rackRef.current.group.visible = false;
      meshRef.current.group.visible = true;
      cameraTargetDistance.current = 8.0;
    } else if (mode === 'free') {
      globeRef.current.group.visible = true;
      rackRef.current.group.visible = false;
      meshRef.current.group.visible = false;
    }
  }, [mode]);

  return (
    <div ref={mountRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="3D Interactive Cyberforage Visualizer"
      />
    </div>
  );
};
