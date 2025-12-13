/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Room } from '@/types';
import {
  createRoomMesh,
  createFurnitureMesh,
  updateFurnitureMesh,
  disposeObject3D,
  getNormalizedMouseCoordinates
} from '@/utils/threeHelpers';
import {
  initScene,
  cleanupScene as cleanupSceneHelper,
  handleResize
} from '@/utils/sceneHelpers';

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
  const furnitureRefs = useRef<Map<string, THREE.Object3D>>(new Map());
  const roomMeshesRef = useRef<THREE.Mesh[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const animationFrameId = useRef<number>(0);

  // Инициализация сцены
  const init = () => {
    if (!containerRef.current) return;

    // Очистка предыдущей сцены
    cleanup();

    // Инициализация новой сцены
    const { scene, camera, renderer, controls } = initScene(containerRef.current, room);
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    // Raycaster
    raycasterRef.current = new THREE.Raycaster();

    // Создание комнаты
    const roomMeshes = createRoomMesh(room);
    roomMeshes.forEach(mesh => scene.add(mesh));
    roomMeshesRef.current = roomMeshes;

    // Создание мебели
    createAllFurniture(scene);

    // Обработчик кликов
    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Анимация
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      // Обновляем LOD системы
      furnitureRefs.current.forEach((object) => {
        if (object instanceof THREE.LOD && cameraRef.current) {
          object.update(cameraRef.current);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  const createAllFurniture = (scene: THREE.Scene) => {
    furnitureRefs.current.clear();
    room.furniture.forEach(furniture => {
      const mesh = createFurnitureMesh(furniture, selectedFurniture === furniture.id);
      furnitureRefs.current.set(furniture.id, mesh);
      scene.add(mesh);
    });
  };

  const handleCanvasClick = (event: MouseEvent) => {
    if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

    const mouse = getNormalizedMouseCoordinates(event, rendererRef.current.domElement);
    raycasterRef.current.setFromCamera(mouse, cameraRef.current);

    const furnitureMeshes = Array.from(furnitureRefs.current.values());
    const intersects = raycasterRef.current.intersectObjects(furnitureMeshes, true); // true для проверки дочерних объектов

    if (intersects.length > 0) {
      // Находим родительскую мебель
      let foundMesh = intersects[0].object;
      while (foundMesh.parent && !furnitureRefs.current.has(foundMesh.userData?.furnitureId)) {
        foundMesh = foundMesh.parent;
      }

      const furnitureId = foundMesh.userData?.furnitureId;
      if (furnitureId) {
        onSelectFurniture(furnitureId);
      }
    } else {
      onSelectFurniture(null);
    }
  };

  const cleanup = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    if (rendererRef.current) {
      rendererRef.current.domElement.removeEventListener('click', handleCanvasClick);
    }

    // Очищаем мебель
    furnitureRefs.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
      disposeObject3D(mesh);
    });
    furnitureRefs.current.clear();

    // Очищаем комнату
    roomMeshesRef.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
      disposeObject3D(mesh);
    });
    roomMeshesRef.current = [];

    cleanupSceneHelper(sceneRef.current, rendererRef.current, containerRef.current, []);
  };

  // Инициализация
  useEffect(() => {
    init();

    const onResize = () => handleResize(containerRef.current, cameraRef.current, rendererRef.current);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cleanup();
    };
  }, []);

  // Обновление мебели при изменении комнаты или выбора
  useEffect(() => {
    if (!sceneRef.current) return;

    // Создаем Set существующих ID мебели
    const existingFurnitureIds = new Set(room.furniture.map(f => f.id));

    // Удаляем старую мебель
    furnitureRefs.current.forEach((object, id) => {
      if (!existingFurnitureIds.has(id)) {
        sceneRef.current?.remove(object);
        disposeObject3D(object);
        furnitureRefs.current.delete(id);
      }
    });

    // Обновляем или добавляем мебель
    room.furniture.forEach(furniture => {
      const isSelected = selectedFurniture === furniture.id;
      const existingObject = furnitureRefs.current.get(furniture.id);

      if (existingObject) {
        // Для простых мешей можно обновить, для моделей лучше пересоздать
        if (furniture.type !== 'model' && existingObject instanceof THREE.Mesh) {
          updateFurnitureMesh(existingObject, furniture, isSelected);
        } else {
          // Пересоздаем модель
          sceneRef.current?.remove(existingObject);
          disposeObject3D(existingObject);

          const newObject = createFurnitureMesh(furniture, isSelected);
          furnitureRefs.current.set(furniture.id, newObject);
          sceneRef.current?.add(newObject);
        }
      } else {
        const newObject = createFurnitureMesh(furniture, isSelected);
        furnitureRefs.current.set(furniture.id, newObject);
        sceneRef.current?.add(newObject);
      }
    });
  }, [room.furniture, selectedFurniture]);

  const recreateRoom = () => {
    if (!sceneRef.current) return;

    // Удаляем старую комнату из сцены
    roomMeshesRef.current.forEach(mesh => {
      sceneRef.current!.remove(mesh);
      disposeObject3D(mesh);
    });
    roomMeshesRef.current = [];

    // Создаем новую комнату
    const roomMeshes = createRoomMesh(room);
    roomMeshes.forEach(mesh => sceneRef.current!.add(mesh));
    roomMeshesRef.current = roomMeshes;
  };

  // Обновление комнаты
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;

    // Обновляем камеру
    cameraRef.current.position.set(room.width * 0.5, room.height * 1.5, room.depth * 2);
    cameraRef.current.lookAt(room.width * 0.5, room.height * 0.5, room.depth * 0.5);

    // Обновляем комнату
    recreateRoom();
  }, [room.width, room.depth, room.height]);

  return (
    <div ref={containerRef} className="w-full h-full" />
  );
}
