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
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const animationFrameId = useRef<number>(0);

  // Инициализация
  const initScene = () => {
    if (!containerRef.current) return;

    // Очистка предыдущей сцены
    cleanupScene();

    // Создание новой сцены
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

    // Raycaster для кликов
    raycasterRef.current = new THREE.Raycaster();

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(room.width, room.height * 3, room.depth * 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Создание комнаты и мебели
    createRoom(scene, room);
    createAllFurniture(scene);

    // Обработчик кликов
    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Анимация
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  // Создание всей мебели
  const createAllFurniture = (scene: THREE.Scene) => {
    furnitureRefs.current.clear();
    room.furniture.forEach(furniture => {
      const mesh = createFurnitureMesh(furniture, selectedFurniture === furniture.id);
      furnitureRefs.current.set(furniture.id, mesh);
      scene.add(mesh);
    });
  };

  // Обработчик клика по канвасу
  const handleCanvasClick = (event: MouseEvent) => {
    if (!cameraRef.current || !rendererRef.current || !sceneRef.current || !raycasterRef.current) return;

    const mouse = new THREE.Vector2();
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouse, cameraRef.current);

    // Получаем актуальные mesh объекты
    const furnitureMeshes = Array.from(furnitureRefs.current.values());
    const intersects = raycasterRef.current.intersectObjects(furnitureMeshes);

    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      // Находим ID мебели по mesh объекту
      for (const [id, furnitureMesh] of furnitureRefs.current.entries()) {
        if (furnitureMesh === mesh || furnitureMesh.children.includes(mesh)) {
          onSelectFurniture(id);
          return;
        }
      }
    } else {
      onSelectFurniture(null);
    }
  };

  // Очистка сцены
  const cleanupScene = () => {
    // Останавливаем анимацию
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Удаляем обработчик кликов
    if (rendererRef.current) {
      rendererRef.current.domElement.removeEventListener('click', handleCanvasClick);
    }

    // Очищаем мебель
    furnitureRefs.current.forEach(mesh => {
      if (sceneRef.current) {
        sceneRef.current.remove(mesh);
      }
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    furnitureRefs.current.clear();

    // Очищаем комнату
    roomRefs.current.forEach(mesh => {
      if (sceneRef.current) {
        sceneRef.current.remove(mesh);
      }
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    });
    roomRefs.current = [];

    // Удаляем рендерер
    if (containerRef.current && rendererRef.current) {
      const canvas = rendererRef.current.domElement;
      if (canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(canvas);
      }
      rendererRef.current.dispose();
    }
  };

  // Инициализация при монтировании
  useEffect(() => {
    initScene();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupScene();
    };
  }, []); // Только при монтировании/размонтировании

  // Обновление мебели при изменении комнаты или выбора
  useEffect(() => {
    if (!sceneRef.current) return;

    // Обновляем существующую мебель
    furnitureRefs.current.forEach((mesh, id) => {
      const furniture = room.furniture.find(f => f.id === id);
      if (!furniture) {
        // Удаляем мебель, которой больше нет
        sceneRef.current?.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
        furnitureRefs.current.delete(id);
      }
    });

    // Добавляем или обновляем мебель
    room.furniture.forEach(furniture => {
      const isSelected = selectedFurniture === furniture.id;
      const existingMesh = furnitureRefs.current.get(furniture.id);

      if (existingMesh) {
        // Обновляем существующую мебель
        updateFurnitureMesh(existingMesh, furniture, isSelected);
      } else {
        // Создаем новую мебель
        const newMesh = createFurnitureMesh(furniture, isSelected);
        furnitureRefs.current.set(furniture.id, newMesh);
        sceneRef.current?.add(newMesh);
      }
    });
  }, [room.furniture, selectedFurniture]);

  // Обновление комнаты при изменении размеров
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;

    // Обновляем камеру
    cameraRef.current.position.set(room.width * 0.5, room.height * 1.5, room.depth * 2);
    cameraRef.current.lookAt(room.width * 0.5, room.height * 0.5, room.depth * 0.5);

    // Обновляем комнату
    recreateRoom();
  }, [room.width, room.depth, room.height]);

  const recreateRoom = () => {
    if (!sceneRef.current) return;

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

    // Создаем новую комнату
    createRoom(sceneRef.current, room);
  };

  const createRoom = (scene: THREE.Scene, room: Room) => {
    const wallThickness = 5;

    // Пол
    const floorGeometry = new THREE.PlaneGeometry(room.width, room.depth);
    const floorMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(room.width / 2, 0, room.depth / 2);
    floor.receiveShadow = true;
    scene.add(floor);
    roomRefs.current.push(floor);

    // Материал для стен
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });

    // Стены
    const walls = [
      { geometry: new THREE.PlaneGeometry(room.width, room.height), position: [room.width / 2, room.height / 2, 0], rotation: [0, 0, 0], offset: wallThickness / 2 },
      { geometry: new THREE.PlaneGeometry(room.width, room.height), position: [room.width / 2, room.height / 2, room.depth], rotation: [0, Math.PI, 0], offset: -wallThickness / 2 },
      { geometry: new THREE.PlaneGeometry(room.depth, room.height), position: [0, room.height / 2, room.depth / 2], rotation: [0, Math.PI / 2, 0], offset: wallThickness / 2 },
      { geometry: new THREE.PlaneGeometry(room.depth, room.height), position: [room.width, room.height / 2, room.depth / 2], rotation: [0, -Math.PI / 2, 0], offset: -wallThickness / 2 },
    ];

    walls.forEach((wall, index) => {
      const mesh = new THREE.Mesh(wall.geometry, wallMaterial);
      mesh.position.set(
        wall.position[0] + (index >= 2 ? wall.offset : 0),
        wall.position[1],
        wall.position[2] + (index < 2 ? wall.offset : 0)
      );
      mesh.rotation.set(wall.rotation[0], wall.rotation[1], wall.rotation[2]);
      mesh.receiveShadow = true;
      scene.add(mesh);
      roomRefs.current.push(mesh);
    });

    // Сетка
    const gridSize = Math.max(room.width, room.depth);
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0x888888, 0x888888);
    gridHelper.position.set(room.width / 2, 0.1, room.depth / 2);
    scene.add(gridHelper);
    roomRefs.current.push(gridHelper as THREE.Mesh);
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

    mesh.position.set(
      furniture.position.x + furniture.dimensions.x / 2,
      furniture.dimensions.y / 2,
      furniture.position.z + furniture.dimensions.z / 2
    );

    mesh.rotation.y = furniture.rotation * (Math.PI / 180);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Добавляем контур для выбранного объекта
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

  const updateFurnitureMesh = (mesh: THREE.Mesh, furniture: Furniture, isSelected: boolean) => {
    // Обновляем позицию
    mesh.position.set(
      furniture.position.x + furniture.dimensions.x / 2,
      furniture.dimensions.y / 2,
      furniture.position.z + furniture.dimensions.z / 2
    );

    // Обновляем вращение
    mesh.rotation.y = furniture.rotation * (Math.PI / 180);

    // Обновляем материал (цвет и прозрачность)
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => {
        if (m instanceof THREE.MeshLambertMaterial) {
          m.color.set(isSelected ? 0xff0000 : parseInt(furniture.color.replace('#', '0x')));
          m.opacity = isSelected ? 0.8 : 0.9;
          m.transparent = true;
        }
      });
    } else if (mesh.material instanceof THREE.MeshLambertMaterial) {
      mesh.material.color.set(isSelected ? 0xff0000 : parseInt(furniture.color.replace('#', '0x')));
      mesh.material.opacity = isSelected ? 0.8 : 0.9;
      mesh.material.transparent = true;
    }

    // Обновляем контур выбора
    const existingLine = mesh.children.find(child => child instanceof THREE.LineSegments);
    if (isSelected && !existingLine) {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
      const line = new THREE.LineSegments(edges, lineMaterial);
      mesh.add(line);
    } else if (!isSelected && existingLine) {
      mesh.remove(existingLine);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
