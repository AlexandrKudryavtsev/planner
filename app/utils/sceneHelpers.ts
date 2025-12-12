// helpers/scene-helpers.ts
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Room } from '@/types';

export interface SceneObjects {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
}

/**
 * Инициализирует базовую сцену с освещением
 */
export const initScene = (
    container: HTMLDivElement,
    room: Room
): SceneObjects => {
    // Сцена
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Камера
    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        5000
    );
    camera.position.set(room.width * 0.5, room.height * 1.5, room.depth * 2);
    camera.lookAt(room.width * 0.5, room.height * 0.5, room.depth * 0.5);

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Добавляем канвас в контейнер
    container.appendChild(renderer.domElement);

    // Контролы
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 2000;

    // Освещение
    setupLights(scene, room);

    return { scene, camera, renderer, controls };
};

/**
 * Настраивает освещение сцены
 */
export const setupLights = (scene: THREE.Scene, room: Room) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(room.width, room.height * 3, room.depth * 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
};

/**
 * Очищает сцену и освобождает ресурсы
 */
export const cleanupScene = (
    scene: THREE.Scene | null,
    renderer: THREE.WebGLRenderer | null,
    container: HTMLDivElement | null,
    meshes: THREE.Mesh[] = []
) => {
    if (!scene) return;

    meshes.forEach(mesh => {
        scene.remove(mesh);
        disposeMesh(mesh);
    });

    if (renderer && container) {
        const canvas = renderer.domElement;
        if (canvas.parentNode === container) {
            container.removeChild(canvas);
        }

        renderer.dispose();
    }
};

/**
 * Освобождает ресурсы mesh
 */
export const disposeMesh = (mesh: THREE.Mesh) => {
    mesh.geometry.dispose();

    if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
    } else {
        mesh.material.dispose();
    }

    // Очищаем дочерние объекты
    mesh.children.forEach(child => {
        if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
        }
    });
};

/**
 * Обрабатывает изменение размера окна
 */
export const handleResize = (
    container: HTMLDivElement | null,
    camera: THREE.PerspectiveCamera | null,
    renderer: THREE.WebGLRenderer | null
) => {
    if (!container || !camera || !renderer) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
