import { useEffect, useRef, useState } from 'react';
import { Box, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { Layers, Maximize2, Orbit, RefreshCw, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import * as THREE from 'three';
import type { Product } from '../../features/products/productsTypes';

interface Product3DViewerProps {
  product: Product;
  height?: string | object;
}

export function Product3DViewer({ product, height = { base: '320px', md: '440px' } }: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInteracting, setIsInteracting] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  const rotationTarget = useRef({ x: 0.2, y: 0.3 });
  const currentRotation = useRef({ x: 0.2, y: 0.3 });
  const isPointerDown = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 400;
    const h = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(40, width / h, 0.1, 100);
    camera.position.set(0, 0.2, 4.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffdfcb, 3.0);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x75998f, 1.8);
    rimLight.position.set(-3, -1, -3);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0xd47757, 1.8, 6);
    bottomGlow.position.set(0, -1.2, 0.8);
    scene.add(bottomGlow);

    // Studio Turntable Base
    const turntableGeo = new THREE.CylinderGeometry(1.4, 1.45, 0.1, 48);
    const turntableMat = new THREE.MeshStandardMaterial({
      color: 0x22352c,
      roughness: 0.45,
      metalness: 0.3,
    });
    const turntable = new THREE.Mesh(turntableGeo, turntableMat);
    turntable.position.y = -1.1;
    turntable.receiveShadow = true;
    scene.add(turntable);

    // Group for the 3D Product Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Render loop
    const animate = () => {
      currentRotation.current.x += (rotationTarget.current.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (rotationTarget.current.y - currentRotation.current.y) * 0.1;

      if (isRotating && !isPointerDown.current) {
        rotationTarget.current.y += 0.009;
      }

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.x = currentRotation.current.x;
        modelGroupRef.current.rotation.y = currentRotation.current.y;
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const heightVal = container.clientHeight;
      camera.aspect = w / heightVal;
      camera.updateProjectionMatrix();
      renderer.setSize(w, heightVal);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update Geometry Based on Category
  useEffect(() => {
    const group = modelGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
      group.remove(child);
    }

    const cat = product.category.toLowerCase();

    if (cat.includes('jewel')) {
      // Brilliant cut gemstone & ring band
      const gemGeo = new THREE.OctahedronGeometry(0.72, 2);
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0xf5dfc8,
        emissive: 0x3d2716,
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.85,
        opacity: 0.95,
        transparent: true,
        wireframe: isWireframe,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.y = 0.25;
      group.add(gem);

      const bandGeo = new THREE.TorusGeometry(0.85, 0.08, 24, 64);
      const bandMat = new THREE.MeshStandardMaterial({
        color: 0xdeb887,
        metalness: 0.95,
        roughness: 0.1,
        wireframe: isWireframe,
      });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.rotation.x = Math.PI / 2;
      band.position.y = -0.3;
      group.add(band);
    } else if (cat.includes('electr')) {
      // High-precision sleek gadget chassis with screen and camera bezel
      const bodyGeo = new THREE.BoxGeometry(1.2, 1.7, 0.16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x232927,
        metalness: 0.88,
        roughness: 0.25,
        wireframe: isWireframe,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Glass front
      const screenGeo = new THREE.PlaneGeometry(1.08, 1.54);
      const screenMat = new THREE.MeshPhysicalMaterial({
        color: 0x111614,
        emissive: 0x091b15,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        wireframe: isWireframe,
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.z = 0.085;
      group.add(screen);

      // Accent ring
      const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32);
      const lensMat = new THREE.MeshStandardMaterial({
        color: 0xd47757,
        metalness: 0.95,
        roughness: 0.15,
        wireframe: isWireframe,
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0.35, 0.55, 0.09);
      group.add(lens);
    } else if (cat.includes('cloth')) {
      // Sculptural organic mannequin form
      const points: THREE.Vector2[] = [];
      for (let i = 0; i <= 20; i++) {
        const y = (i / 20) * 1.8 - 0.9;
        const x = 0.35 + Math.sin((i / 20) * Math.PI) * 0.28 + (i > 14 ? 0.1 : 0);
        points.push(new THREE.Vector2(x, y));
      }
      const torsoGeo = new THREE.LatheGeometry(points, 32);
      const torsoMat = new THREE.MeshStandardMaterial({
        color: 0xd47757,
        metalness: 0.2,
        roughness: 0.7,
        wireframe: isWireframe,
      });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      group.add(torso);

      // Brass base stand
      const standGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 16);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0xd9b382,
        metalness: 0.9,
        roughness: 0.15,
        wireframe: isWireframe,
      });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = -0.95;
      group.add(stand);
    } else {
      // Artisanal Luxury Box / Curated Monolith
      const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0xf4ede4,
        roughness: 0.35,
        metalness: 0.15,
        clearcoat: 0.6,
        wireframe: isWireframe,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      group.add(boxMesh);

      const ribbonGeo = new THREE.TorusGeometry(0.88, 0.03, 16, 48);
      const ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xd47757,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: isWireframe,
      });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.rotation.x = Math.PI / 4;
      group.add(ribbon);
    }
  }, [product.category, isWireframe]);

  // Handle Zoom change
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 4.2 / zoomLevel;
    }
  }, [zoomLevel]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    setIsInteracting(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const deltaX = e.clientX - pointerStart.current.x;
    const deltaY = e.clientY - pointerStart.current.y;
    pointerStart.current = { x: e.clientX, y: e.clientY };

    rotationTarget.current.y += deltaX * 0.012;
    rotationTarget.current.x += deltaY * 0.009;
    rotationTarget.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, rotationTarget.current.x));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDown.current = false;
    setIsInteracting(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const resetView = () => {
    rotationTarget.current = { x: 0.2, y: 0.3 };
    currentRotation.current = { x: 0.2, y: 0.3 };
    setZoomLevel(1);
  };

  return (
    <Box
      position="relative"
      w="100%"
      h={height}
      borderRadius="2xl"
      bg="radial-gradient(ellipse at 50% 50%, #293d34 0%, #15241e 100%)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 20px 45px rgba(0,0,0,0.25)"
      overflow="hidden"
      cursor={isInteracting ? 'grabbing' : 'grab'}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
      aria-label={`3D inspection view of ${product.title}`}
    >
      <Box ref={mountRef} w="100%" h="100%" />

      {/* Top Left Status */}
      <HStack
        position="absolute"
        top={3}
        left={3}
        spacing={2}
        bg="blackAlpha.600"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="whiteAlpha.150"
        borderRadius="full"
        px={3}
        py={1}
        zIndex={10}
        pointerEvents="auto"
      >
        <Sparkles size={13} color="#d47757" />
        <Text fontSize="10px" fontWeight="800" color="whiteAlpha.900" letterSpacing="0.1em" textTransform="uppercase">
          3D Studio Turntable
        </Text>
      </HStack>

      {/* Top Right Controls */}
      <HStack position="absolute" top={3} right={3} spacing={1.5} zIndex={10} pointerEvents="auto">
        <Tooltip label={isRotating ? 'Pause turntable' : 'Spin turntable'}>
          <IconButton
            aria-label="Toggle turntable rotation"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color={isRotating ? 'accent.500' : 'whiteAlpha.700'}
            backdropFilter="blur(8px)"
            borderRadius="full"
            icon={<Orbit size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              setIsRotating((v) => !v);
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>

        <Tooltip label={isWireframe ? 'View solid' : 'View wireframe'}>
          <IconButton
            aria-label="Toggle wireframe mode"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color={isWireframe ? 'accent.500' : 'whiteAlpha.700'}
            backdropFilter="blur(8px)"
            borderRadius="full"
            icon={<Layers size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              setIsWireframe((v) => !v);
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>

        <Tooltip label="Zoom in">
          <IconButton
            aria-label="Zoom in"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color="whiteAlpha.700"
            backdropFilter="blur(8px)"
            borderRadius="full"
            icon={<ZoomIn size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel((z) => Math.min(z + 0.25, 2.0));
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>

        <Tooltip label="Zoom out">
          <IconButton
            aria-label="Zoom out"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color="whiteAlpha.700"
            backdropFilter="blur(8px)"
            borderRadius="full"
            icon={<ZoomOut size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel((z) => Math.max(z - 0.25, 0.6));
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>

        <Tooltip label="Reset view">
          <IconButton
            aria-label="Reset 3D view"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color="whiteAlpha.700"
            backdropFilter="blur(8px)"
            borderRadius="full"
            icon={<RefreshCw size={13} />}
            onClick={(e) => {
              e.stopPropagation();
              resetView();
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>
      </HStack>

      {/* Bottom Hint */}
      <HStack
        position="absolute"
        bottom={3}
        left="50%"
        transform="translateX(-50%)"
        bg="blackAlpha.700"
        backdropFilter="blur(10px)"
        px={3}
        py={1}
        borderRadius="full"
        border="1px solid"
        borderColor="whiteAlpha.150"
        pointerEvents="none"
        spacing={2}
      >
        <Maximize2 size={11} color="#d47757" />
        <Text fontSize="10px" color="whiteAlpha.800" fontWeight="600">
          Drag to spin 360° • Zoom: {(zoomLevel * 100).toFixed(0)}%
        </Text>
      </HStack>
    </Box>
  );
}
