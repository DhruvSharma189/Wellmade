import { useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Flex, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { Layers, Maximize2, Moon, Orbit, RefreshCw, Sun, Zap } from 'lucide-react';
import * as THREE from 'three';

export type ShowcaseModelType = 'monolith' | 'chrono' | 'vessel';
export type LightingTheme = 'terracotta' | 'studio' | 'midnight';

export function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ShowcaseModelType>('monolith');
  const [isRotating, setIsRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightingTheme, setLightingTheme] = useState<LightingTheme>('terracotta');
  const [isInteracting, setIsInteracting] = useState(false);

  // References to keep THREE scene objects between renders without re-mounting
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // Rotation & interaction state
  const rotationTarget = useRef({ x: 0.25, y: -0.4 });
  const currentRotation = useRef({ x: 0.25, y: -0.4 });
  const isPointerDown = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const autoRotateSpeed = useRef(0.008);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xffb288, 3.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0x7da4a0, 1.8);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const pointLight = new THREE.PointLight(0xe26a45, 2.5, 8);
    pointLight.position.set(0, 1.5, 1.2);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // --- Studio Pedestal Disc ---
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.15, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1d2e27,
      roughness: 0.6,
      metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.35;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const pedestalRingGeo = new THREE.TorusGeometry(1.68, 0.02, 16, 64);
    const pedestalRingMat = new THREE.MeshStandardMaterial({
      color: 0xd47757,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xd47757,
      emissiveIntensity: 0.35,
    });
    const pedestalRing = new THREE.Mesh(pedestalRingGeo, pedestalRingMat);
    pedestalRing.rotation.x = Math.PI / 2;
    pedestalRing.position.y = -1.27;
    scene.add(pedestalRing);

    // --- Dust Particles ---
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe8a87c,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // --- Model Group ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation interpolation
      currentRotation.current.x += (rotationTarget.current.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (rotationTarget.current.y - currentRotation.current.y) * 0.1;

      if (isRotating && !isPointerDown.current) {
        rotationTarget.current.y += autoRotateSpeed.current;
      }

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.x = currentRotation.current.x;
        modelGroupRef.current.rotation.y = currentRotation.current.y;
        // Subtle floating bob
        modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      }

      // Rotate particle cloud gently
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
      }

      // Pulse accent light
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 2.2 + Math.sin(elapsedTime * 2.5) * 0.6;
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update 3D Model when activeModel or isWireframe changes
  useEffect(() => {
    const group = modelGroupRef.current;
    if (!group) return;

    // Clear previous children
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

    const materialCommon = {
      wireframe: isWireframe,
      metalness: 0.65,
      roughness: 0.28,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    };

    if (activeModel === 'monolith') {
      // 1. Faceted sculptural monolith (Icosahedron + surrounding orbital ring)
      const coreGeo = new THREE.IcosahedronGeometry(0.95, 0);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0xd47757, // terracotta warm
        emissive: 0x241108,
        ...materialCommon,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.castShadow = true;
      group.add(coreMesh);

      // Orbital outer ring
      const ringGeo = new THREE.TorusGeometry(1.4, 0.04, 24, 72);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xf5dfc8,
        metalness: 0.9,
        roughness: 0.15,
        wireframe: isWireframe,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      ringMesh.rotation.y = Math.PI / 6;
      group.add(ringMesh);

      // Floating satellites
      for (let i = 0; i < 3; i++) {
        const satGeo = new THREE.OctahedronGeometry(0.18, 0);
        const satMat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x98a886 : 0xf2ede4,
          metalness: 0.8,
          roughness: 0.2,
          wireframe: isWireframe,
        });
        const satMesh = new THREE.Mesh(satGeo, satMat);
        const angle = (i * Math.PI * 2) / 3;
        satMesh.position.set(Math.cos(angle) * 1.5, Math.sin(angle * 2) * 0.4, Math.sin(angle) * 1.5);
        group.add(satMesh);
      }
    } else if (activeModel === 'chrono') {
      // 2. Precision Chrono Timepiece Ring & floating core
      const outerTorusGeo = new THREE.TorusGeometry(1.1, 0.16, 28, 64);
      const outerTorusMat = new THREE.MeshStandardMaterial({
        color: 0x1f342a, // dark graphite green
        metalness: 0.85,
        roughness: 0.2,
        wireframe: isWireframe,
      });
      const outerTorus = new THREE.Mesh(outerTorusGeo, outerTorusMat);
      group.add(outerTorus);

      // Inner gold ring
      const innerTorusGeo = new THREE.TorusGeometry(0.8, 0.05, 20, 64);
      const innerTorusMat = new THREE.MeshStandardMaterial({
        color: 0xe5aa68, // gold
        metalness: 0.95,
        roughness: 0.1,
        wireframe: isWireframe,
      });
      const innerTorus = new THREE.Mesh(innerTorusGeo, innerTorusMat);
      innerTorus.rotation.y = Math.PI / 4;
      group.add(innerTorus);

      // Floating gem jewel in center
      const gemGeo = new THREE.OctahedronGeometry(0.48, 1);
      const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0xd47757,
        transmission: 0.3,
        opacity: 0.95,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1,
        wireframe: isWireframe,
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      group.add(gem);
    } else if (activeModel === 'vessel') {
      // 3. Contemporary Vessel / Flask
      const points: THREE.Vector2[] = [];
      for (let deg = 0; deg <= 180; deg += 10) {
        const rad = (Math.PI / 180) * deg;
        const x = 0.5 + Math.sin(rad) * 0.45;
        const y = (deg - 90) * 0.012;
        points.push(new THREE.Vector2(x, y));
      }
      const latheGeo = new THREE.LatheGeometry(points, 32);
      const latheMat = new THREE.MeshPhysicalMaterial({
        color: 0xf3eee4,
        roughness: 0.4,
        metalness: 0.15,
        clearcoat: 0.8,
        wireframe: isWireframe,
      });
      const lathe = new THREE.Mesh(latheGeo, latheMat);
      lathe.scale.set(0.9, 0.9, 0.9);
      group.add(lathe);

      // Polished copper neck
      const neckGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
      const neckMat = new THREE.MeshStandardMaterial({
        color: 0xd47757,
        metalness: 0.9,
        roughness: 0.18,
        wireframe: isWireframe,
      });
      const neck = new THREE.Mesh(neckGeo, neckMat);
      neck.position.y = 1.15;
      group.add(neck);
    }
  }, [activeModel, isWireframe]);

  // Update Lighting theme
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !ambientLightRef.current || !pointLightRef.current) return;

    if (lightingTheme === 'terracotta') {
      ambientLightRef.current.color.setHex(0xfff4e8);
      ambientLightRef.current.intensity = 1.2;
      keyLightRef.current.color.setHex(0xffb085);
      keyLightRef.current.intensity = 3.2;
      fillLightRef.current.color.setHex(0x6e9a93);
      pointLightRef.current.color.setHex(0xe26a45);
    } else if (lightingTheme === 'studio') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.6;
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.5;
      fillLightRef.current.color.setHex(0xd0e0e3);
      pointLightRef.current.color.setHex(0xffd180);
    } else if (lightingTheme === 'midnight') {
      ambientLightRef.current.color.setHex(0x1a2621);
      ambientLightRef.current.intensity = 0.8;
      keyLightRef.current.color.setHex(0xe26a45);
      keyLightRef.current.intensity = 2.4;
      fillLightRef.current.color.setHex(0x2f6055);
      pointLightRef.current.color.setHex(0x5cb89a);
    }
  }, [lightingTheme]);

  // Pointer interactions for dragging and rotating
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

    rotationTarget.current.y += deltaX * 0.01;
    rotationTarget.current.x += deltaY * 0.008;

    // Limit pitch to prevent flipping upside down
    rotationTarget.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationTarget.current.x));
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
    rotationTarget.current = { x: 0.25, y: -0.4 };
    currentRotation.current = { x: 0.25, y: -0.4 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.4, 5.2);
    }
  };

  return (
    <Box
      position="relative"
      w="100%"
      h={{ base: '340px', md: '440px' }}
      borderRadius="24px"
      bg="radial-gradient(ellipse at 50% 40%, rgba(212, 119, 87, 0.14), rgba(18, 29, 24, 0.85) 75%)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)"
      overflow="hidden"
      cursor={isInteracting ? 'grabbing' : 'grab'}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
      role="region"
      aria-label="Interactive 3D product showcase"
    >
      {/* 3D WebGL Canvas Container */}
      <Box ref={mountRef} w="100%" h="100%" />

      {/* Top Left Badge: Interactive 3D Lab */}
      <HStack
        position="absolute"
        top={4}
        left={4}
        spacing={2}
        bg="blackAlpha.600"
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="full"
        px={3}
        py={1.5}
        zIndex={10}
        pointerEvents="auto"
      >
        <Box w="6px" h="6px" borderRadius="full" bg="accent.500" animation="pulse 2s infinite" />
        <Text fontSize="10px" fontWeight="800" letterSpacing="0.14em" color="whiteAlpha.900" textTransform="uppercase">
          WELLMADE 3D LAB
        </Text>
        <Badge colorScheme="orange" variant="solid" fontSize="9px" borderRadius="full" px={1.5}>
          WebGL
        </Badge>
      </HStack>

      {/* Top Right Controls: Rotation, Wireframe, Lighting Theme */}
      <HStack position="absolute" top={4} right={4} spacing={1.5} zIndex={10} pointerEvents="auto">
        <Tooltip label={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}>
          <IconButton
            aria-label="Toggle rotation"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color={isRotating ? 'accent.500' : 'whiteAlpha.700'}
            backdropFilter="blur(10px)"
            borderRadius="full"
            icon={<Orbit size={15} />}
            onClick={(e) => {
              e.stopPropagation();
              setIsRotating((v) => !v);
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>

        <Tooltip label={isWireframe ? 'View solid' : 'View holographic wireframe'}>
          <IconButton
            aria-label="Toggle wireframe"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color={isWireframe ? 'accent.500' : 'whiteAlpha.700'}
            backdropFilter="blur(10px)"
            borderRadius="full"
            icon={<Layers size={15} />}
            onClick={(e) => {
              e.stopPropagation();
              setIsWireframe((v) => !v);
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>

        <Tooltip label={`Lighting: ${lightingTheme}`}>
          <IconButton
            aria-label="Cycle lighting"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color="whiteAlpha.800"
            backdropFilter="blur(10px)"
            borderRadius="full"
            icon={lightingTheme === 'terracotta' ? <Sun size={15} /> : lightingTheme === 'studio' ? <Zap size={15} /> : <Moon size={15} />}
            onClick={(e) => {
              e.stopPropagation();
              setLightingTheme((curr) => (curr === 'terracotta' ? 'studio' : curr === 'studio' ? 'midnight' : 'terracotta'));
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>

        <Tooltip label="Reset camera angle">
          <IconButton
            aria-label="Reset view"
            size="sm"
            variant="ghost"
            bg="blackAlpha.600"
            color="whiteAlpha.700"
            backdropFilter="blur(10px)"
            borderRadius="full"
            icon={<RefreshCw size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              resetView();
            }}
            _hover={{ bg: 'whiteAlpha.200', color: 'white' }}
          />
        </Tooltip>
      </HStack>

      {/* Model Selector Pills at Bottom */}
      <Flex
        position="absolute"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        bg="blackAlpha.700"
        backdropFilter="blur(14px)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="full"
        p={1}
        gap={1}
        zIndex={10}
        pointerEvents="auto"
        maxW="92%"
      >
        <Button
          size="xs"
          borderRadius="full"
          variant={activeModel === 'monolith' ? 'solid' : 'ghost'}
          bg={activeModel === 'monolith' ? 'accent.500' : 'transparent'}
          color={activeModel === 'monolith' ? 'graphite.900' : 'whiteAlpha.800'}
          fontWeight="700"
          fontSize="11px"
          px={3}
          onClick={(e) => {
            e.stopPropagation();
            setActiveModel('monolith');
          }}
          _hover={{ bg: activeModel === 'monolith' ? 'accent.600' : 'whiteAlpha.200' }}
        >
          01 Monolith
        </Button>
        <Button
          size="xs"
          borderRadius="full"
          variant={activeModel === 'chrono' ? 'solid' : 'ghost'}
          bg={activeModel === 'chrono' ? 'accent.500' : 'transparent'}
          color={activeModel === 'chrono' ? 'graphite.900' : 'whiteAlpha.800'}
          fontWeight="700"
          fontSize="11px"
          px={3}
          onClick={(e) => {
            e.stopPropagation();
            setActiveModel('chrono');
          }}
          _hover={{ bg: activeModel === 'chrono' ? 'accent.600' : 'whiteAlpha.200' }}
        >
          02 Chrono Ring
        </Button>
        <Button
          size="xs"
          borderRadius="full"
          variant={activeModel === 'vessel' ? 'solid' : 'ghost'}
          bg={activeModel === 'vessel' ? 'accent.500' : 'transparent'}
          color={activeModel === 'vessel' ? 'graphite.900' : 'whiteAlpha.800'}
          fontWeight="700"
          fontSize="11px"
          px={3}
          onClick={(e) => {
            e.stopPropagation();
            setActiveModel('vessel');
          }}
          _hover={{ bg: activeModel === 'vessel' ? 'accent.600' : 'whiteAlpha.200' }}
        >
          03 Design Vessel
        </Button>
      </Flex>

      {/* Floating 3D Interaction Hint */}
      <HStack
        position="absolute"
        bottom={4}
        left={4}
        spacing={1.5}
        color="whiteAlpha.500"
        fontSize="10px"
        display={{ base: 'none', md: 'flex' }}
        pointerEvents="none"
      >
        <Maximize2 size={12} />
        <Text>Drag to orbit in 3D</Text>
      </HStack>
    </Box>
  );
}
