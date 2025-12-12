'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Room, Furniture } from '@/types';

interface Room3DProps {
  room: Room;
  selectedFurniture: string | null;
  onSelectFurniture: (id: string | null) => void;
}

export default function Room3D({ room, selectedFurniture, onSelectFurniture }: Room3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const furnitureRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const roomRefs = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Инициализация сцены
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Камера
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      5000
    );
    // Позиционируем камеру так, чтобы видеть всю комнату
    camera.position.set(room.width * 0.5, room.height * 1.5, room.depth * 2);
    camera.lookAt(room.width * 0.5, room.height * 0.5, room.depth * 0.5);
    cameraRef.current = camera;

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Орбитальные контролы
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 2000;
    controlsRef.current = controls;

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(room.width, room.height * 3, room.depth * 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Создание комнаты
    createRoom(scene, room);

    // Анимация
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleClick = (event: MouseEvent) => {
      if (!camera || !renderer || !scene) return;

      const mouse = new THREE.Vector2();
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const furnitureMeshes = Array.from(furnitureRefs.current.values());
      const intersects = raycaster.intersectObjects(furnitureMeshes);

      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const furnitureId = Array.from(furnitureRefs.current.entries())
          .find(([_, m]) => m === mesh)?.[0];
        if (furnitureId) {
          onSelectFurniture(furnitureId);
        }
      } else {
        onSelectFurniture(null);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      roomRefs.current.forEach(mesh => mesh.geometry.dispose());
    };
  }, [onSelectFurniture, room]);

  // Обновление мебели при изменении
  useEffect(() => {
    if (!sceneRef.current || !room) return;

    // Удаляем старую мебель
    furnitureRefs.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    furnitureRefs.current.clear();

    // Добавляем новую мебель
    room.furniture.forEach(furniture => {
      const mesh = createFurnitureMesh(furniture, selectedFurniture === furniture.id);
      furnitureRefs.current.set(furniture.id, mesh);
      sceneRef.current?.add(mesh);
    });
  }, [room, room.furniture, selectedFurniture]);

  // Обновление комнаты при изменении размеров
  useEffect(() => {
    if (!sceneRef.current || !room) return;

    // Удаляем старую комнату
    roomRefs.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    roomRefs.current = [];

    // Обновляем камеру
    if (cameraRef.current) {
      cameraRef.current.position.set(room.width * 0.5, room.height * 1.5, room.depth * 2);
      cameraRef.current.lookAt(room.width * 0.5, room.height * 0.5, room.depth * 0.5);
    }

    // Создаем новую комнату
    createRoom(sceneRef.current, room);
  }, [room.width, room.depth, room.height, room]);

  const createRoom = (scene: THREE.Scene, room: Room) => {
    const wallThickness = 5; // Толщина стен для визуализации

    // 1. ПОЛ - исправленная позиция
    const floorGeometry = new THREE.PlaneGeometry(room.width, room.depth);
    const floorMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(room.width / 2, 0, room.depth / 2); // Центрируем пол
    floor.receiveShadow = true;
    scene.add(floor);
    roomRefs.current.push(floor);

    // 2. Материал для стен
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });

    // 3. СТЕНЫ - позиционируем от пола

    // Задняя стена (Z = 0)
    const backWallGeometry = new THREE.PlaneGeometry(room.width, room.height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(
      room.width / 2,      // Центр по X
      room.height / 2,     // Центр по Y (поднимаем от пола)
      0                    // Передняя грань на Z=0
    );
    // Смещаем на половину толщины чтобы стена была видимой
    backWall.position.z = wallThickness / 2;
    backWall.receiveShadow = true;
    scene.add(backWall);
    roomRefs.current.push(backWall);

    // Передняя стена (Z = room.depth)
    const frontWallGeometry = new THREE.PlaneGeometry(room.width, room.height);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(
      room.width / 2,
      room.height / 2,
      room.depth
    );
    frontWall.position.z = room.depth - wallThickness / 2;
    frontWall.rotation.y = Math.PI; // Разворачиваем на 180°
    frontWall.receiveShadow = true;
    scene.add(frontWall);
    roomRefs.current.push(frontWall);

    // Левая стена (X = 0)
    const leftWallGeometry = new THREE.PlaneGeometry(room.depth, room.height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(
      0,
      room.height / 2,
      room.depth / 2
    );
    leftWall.position.x = wallThickness / 2;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    roomRefs.current.push(leftWall);

    // Правая стена (X = room.width)
    const rightWallGeometry = new THREE.PlaneGeometry(room.depth, room.height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(
      room.width,
      room.height / 2,
      room.depth / 2
    );
    rightWall.position.x = room.width - wallThickness / 2;
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    roomRefs.current.push(rightWall);

    // 4. СЕТКА - размещаем на уровне пола
    const gridSize = Math.max(room.width, room.depth);
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0x888888, 0x888888);
    gridHelper.position.set(room.width / 2, 0.1, room.depth / 2);
    scene.add(gridHelper);
    roomRefs.current.push(gridHelper as THREE.Mesh);

    // 5. Ось координат
    const axesSize = Math.max(room.width, room.depth, room.height) / 2;
    const axesHelper = new THREE.AxesHelper(axesSize);
    axesHelper.position.set(room.width / 2, 0, room.depth / 2);
    scene.add(axesHelper);
    roomRefs.current.push(axesHelper as THREE.Mesh);
  };

  const createFurnitureMesh = (furniture: Furniture, isSelected: boolean) => {
    const geometry = new THREE.BoxGeometry(
      furniture.dimensions.x,
      furniture.dimensions.y,
      furniture.dimensions.z
    );

    const material = new THREE.MeshLambertMaterial({
      color: isSelected ? 0xff0000 : parseInt(furniture.color.replace('#', '0x')),
      transparent: true,
      opacity: isSelected ? 0.8 : 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Позиционируем с учетом того, что мебель стоит на полу (Y = 0)
    mesh.position.set(
      furniture.position.x + furniture.dimensions.x / 2,
      furniture.dimensions.y / 2, // Центр по высоте
      furniture.position.z + furniture.dimensions.z / 2
    );

    mesh.rotation.y = furniture.rotation * (Math.PI / 180);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (isSelected) {
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 2
      });
      const line = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(line);
    }

    return mesh;
  };

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
