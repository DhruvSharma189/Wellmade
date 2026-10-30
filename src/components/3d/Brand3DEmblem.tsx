import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import * as THREE from 'three';

export function Brand3DEmblem() {
  const mountRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const size = 38;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff3e6, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffb78f, 2.5);
    dirLight.position.set(2, 3, 2);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x739c93, 1.4);
    rimLight.position.set(-2, -2, -1);
    scene.add(rimLight);

    const geometry = new THREE.BoxGeometry(1.25, 1.25, 1.25);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xd47757, metalness: 0.8, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x243e33, metalness: 0.85, roughness: 0.25 }),
      new THREE.MeshStandardMaterial({ color: 0xf5dfc8, metalness: 0.95, roughness: 0.15 }),
      new THREE.MeshStandardMaterial({ color: 0xbd5e40, metalness: 0.75, roughness: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0x365446, metalness: 0.8, roughness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xe8a87c, metalness: 0.85, roughness: 0.2 }),
    ];

    const cube = new THREE.Mesh(geometry, materials);
    cube.rotation.x = 0.55;
    cube.rotation.y = 0.65;
    scene.add(cube);
    meshRef.current = cube;

    let rotSpeed = 0.015;
    const animate = () => {
      if (cube) {
        const targetSpeed = isHovered.current ? 0.06 : 0.015;
        rotSpeed += (targetSpeed - rotSpeed) * 0.1;
        cube.rotation.y += rotSpeed;
        cube.rotation.x += rotSpeed * 0.5;
      }
      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return (
    <Box
      ref={mountRef}
      w="38px"
      h="38px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="12px"
      bg="whiteAlpha.100"
      border="1px solid"
      borderColor="whiteAlpha.200"
      boxShadow="0 4px 14px rgba(0,0,0,0.2)"
      overflow="hidden"
      onPointerEnter={() => {
        isHovered.current = true;
      }}
      onPointerLeave={() => {
        isHovered.current = false;
      }}
      cursor="pointer"
      transition="transform 0.2s ease, border-color 0.2s ease"
      _hover={{ transform: 'scale(1.08)', borderColor: 'accent.500' }}
      title="WELLMADE 3D Kinetic Emblem"
    />
  );
}
