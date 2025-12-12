// helpers/three-helpers.ts
import { Furniture, Room } from '@/types';
import * as THREE from 'three';

/**
 * Создает 3D комнату с полом, стенами и сеткой
 */
export const createRoomMesh = (room: Room, wallThickness = 5) => {
    const meshes: THREE.Mesh[] = [];

    // Материал для стен
    const wallMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    // Стены
    const walls = [
        {
            geometry: new THREE.PlaneGeometry(room.width, room.height),
            position: [room.width / 2, room.height / 2, 0] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            offset: wallThickness / 2
        },
        {
            geometry: new THREE.PlaneGeometry(room.width, room.height),
            position: [room.width / 2, room.height / 2, room.depth] as [number, number, number],
            rotation: [0, Math.PI, 0] as [number, number, number],
            offset: -wallThickness / 2
        },
        {
            geometry: new THREE.PlaneGeometry(room.depth, room.height),
            position: [0, room.height / 2, room.depth / 2] as [number, number, number],
            rotation: [0, Math.PI / 2, 0] as [number, number, number],
            offset: wallThickness / 2
        },
        {
            geometry: new THREE.PlaneGeometry(room.depth, room.height),
            position: [room.width, room.height / 2, room.depth / 2] as [number, number, number],
            rotation: [0, -Math.PI / 2, 0] as [number, number, number],
            offset: -wallThickness / 2
        },
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
        meshes.push(mesh);
    });

    // Сетка (пол) - делаем на 20% больше комнаты
    const margin = 0.2; // 20% запас
    const gridSize = Math.max(room.width, room.depth) * (1 + margin);
    const gridHelper = new THREE.GridHelper(
        gridSize,
        20,
        0x888888,
        0x888888
    );
    // Опускаем сетку чуть ниже (y = -0.1), чтобы стены стояли на ней
    gridHelper.position.set(room.width / 2, -0.1, room.depth / 2);
    meshes.push(gridHelper as unknown as THREE.Mesh);

    return meshes;
};

/**
 * Создает 3D mesh для мебели с возможностью выделения
 */
export const createFurnitureMesh = (
    furniture: Furniture,
    isSelected: boolean
): THREE.Mesh => {
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

    // Мебель стоит на сетке (y = 0 для начала координат мебели)
    mesh.position.set(
        furniture.position.x + furniture.dimensions.x / 2,
        furniture.dimensions.y / 2, // Центр по высоте находится на половине высоты мебели
        furniture.position.z + furniture.dimensions.z / 2
    );

    mesh.rotation.y = furniture.rotation * (Math.PI / 180);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Добавляем контур для выбранного объекта
    if (isSelected) {
        addSelectionOutline(mesh);
    }

    return mesh;
};

/**
 * Обновляет существующий mesh мебели
 */
export const updateFurnitureMesh = (
    mesh: THREE.Mesh,
    furniture: Furniture,
    isSelected: boolean
) => {
    // Обновляем позицию
    mesh.position.set(
        furniture.position.x + furniture.dimensions.x / 2,
        furniture.dimensions.y / 2, // Центр по высоте
        furniture.position.z + furniture.dimensions.z / 2
    );

    // Обновляем вращение
    mesh.rotation.y = furniture.rotation * (Math.PI / 180);

    // Обновляем материал (цвет и прозрачность)
    updateMeshMaterial(mesh, furniture, isSelected);

    // Обновляем контур выбора
    if (isSelected) {
        const existingLine = mesh.children.find(child => child instanceof THREE.LineSegments);
        if (!existingLine) {
            addSelectionOutline(mesh);
        }
    } else {
        removeSelectionOutline(mesh);
    }
};

/**
 * Добавляет контур выделения к mesh
 */
export const addSelectionOutline = (mesh: THREE.Mesh) => {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 2
    });
    const line = new THREE.LineSegments(edges, lineMaterial);
    mesh.add(line);
    return line;
};

/**
 * Удаляет контур выделения из mesh
 */
export const removeSelectionOutline = (mesh: THREE.Mesh) => {
    const line = mesh.children.find(child => child instanceof THREE.LineSegments);
    if (line) {
        mesh.remove(line);
        line.geometry.dispose();
        (line.material as THREE.LineBasicMaterial).dispose();
    }
};

/**
 * Обновляет материал mesh
 */
export const updateMeshMaterial = (
    mesh: THREE.Mesh,
    furniture: Furniture,
    isSelected: boolean
) => {
    const color = isSelected ? 0xff0000 : parseInt(furniture.color.replace('#', '0x'));
    const opacity = isSelected ? 0.8 : 0.9;

    if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => {
            if (m instanceof THREE.MeshLambertMaterial) {
                m.color.set(color);
                m.opacity = opacity;
                m.transparent = true;
            }
        });
    } else if (mesh.material instanceof THREE.MeshLambertMaterial) {
        mesh.material.color.set(color);
        mesh.material.opacity = opacity;
        mesh.material.transparent = true;
    }
};

/**
 * Правильно удаляет mesh из сцены
 */
export const disposeMesh = (mesh: THREE.Mesh) => {
    mesh.geometry.dispose();

    if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
    } else {
        mesh.material.dispose();
    }

    // Удаляем дочерние объекты (например, контуры выделения)
    mesh.children.forEach(child => {
        if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
        }
    });
};

/**
 * Рассчитывает нормализованные координаты мыши для Raycaster
 */
export const getNormalizedMouseCoordinates = (
    event: MouseEvent,
    element: HTMLElement
): THREE.Vector2 => {
    const rect = element.getBoundingClientRect();
    return new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
};
