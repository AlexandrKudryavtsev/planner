import { Furniture, Room } from '@/types';
import * as THREE from 'three';
import { createModelMesh } from '@/utils/modelManager';

/**
 * Создает 3D комнату с полом и двумя смежными стенами
 */
export const createRoomMesh = (room: Room, wallThickness = 15) => {
    const meshes: THREE.Mesh[] = [];

    const wallMaterial = new THREE.MeshLambertMaterial({
        color: '#CFCFCF',
        side: THREE.DoubleSide
    });

    const floorMaterial = new THREE.MeshLambertMaterial({
        color: '#A29983',
        side: THREE.DoubleSide
    });

    const floorGeometry = new THREE.PlaneGeometry(room.width, room.depth);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2; 
    floorMesh.position.set(room.width / 2, 0, room.depth / 2);
    floorMesh.receiveShadow = true;
    meshes.push(floorMesh);

    const backWallGeometry = new THREE.PlaneGeometry(room.width, room.height);
    const backWallMesh = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWallMesh.position.set(
        room.width / 2,
        room.height / 2,
        0
    );
    backWallMesh.receiveShadow = true;
    meshes.push(backWallMesh);

    const leftWallGeometry = new THREE.PlaneGeometry(room.depth, room.height);
    const leftWallMesh = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWallMesh.position.set(
        0,
        room.height / 2,
        room.depth / 2
    );
    leftWallMesh.rotation.y = Math.PI / 2;
    leftWallMesh.receiveShadow = true;
    meshes.push(leftWallMesh);

    const wallThicknessGeometry = new THREE.BoxGeometry(wallThickness, room.height, room.depth);
    const leftWallThicknessMesh = new THREE.Mesh(wallThicknessGeometry, wallMaterial);
    leftWallThicknessMesh.position.set(
        wallThickness / 2,
        room.height / 2,
        room.depth / 2
    );
    leftWallThicknessMesh.receiveShadow = true;
    meshes.push(leftWallThicknessMesh);

    const backWallThicknessGeometry = new THREE.BoxGeometry(room.width, room.height, wallThickness);
    const backWallThicknessMesh = new THREE.Mesh(backWallThicknessGeometry, wallMaterial);
    backWallThicknessMesh.position.set(
        room.width / 2,
        room.height / 2,
        wallThickness / 2
    );
    backWallThicknessMesh.receiveShadow = true;
    meshes.push(backWallThicknessMesh);

    return meshes;
};

/**
 * Создает 3D mesh для мебели с поддержкой моделей
 */
export const createFurnitureMesh = (
    furniture: Furniture,
    isSelected: boolean
): THREE.Object3D => {
    if (furniture.type === 'model' && furniture.modelType) {
        const mesh = createModelMesh(furniture, isSelected, false);
        mesh.traverse((child) => {
            child.userData = { ...child.userData, furnitureId: furniture.id };
        });
        return mesh;
    }

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
    mesh.userData = { furnitureId: furniture.id };

    mesh.position.set(
        furniture.position.x + furniture.dimensions.x / 2,
        furniture.dimensions.y / 2,
        furniture.position.z + furniture.dimensions.z / 2
    );
    mesh.rotation.y = furniture.rotation * (Math.PI / 180);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (isSelected) {
        addSelectionOutline(mesh);
    }

    return mesh;
};

/**
 * Обновляет существующий mesh мебели
 */
export const updateFurnitureMesh = (
    mesh: THREE.Object3D,
    furniture: Furniture,
    isSelected: boolean
) => {
    if (furniture.type === 'model') {
        return; // TODO: Пока просто возвращаем, в реальности нужно пересоздать
    }

    if (mesh instanceof THREE.Mesh) {
        mesh.position.set(
            furniture.position.x + furniture.dimensions.x / 2,
            furniture.dimensions.y / 2,
            furniture.position.z + furniture.dimensions.z / 2
        );
        mesh.rotation.y = furniture.rotation * (Math.PI / 180);

        mesh.userData = { ...mesh.userData, furnitureId: furniture.id };

        updateMeshMaterial(mesh, furniture, isSelected);

        if (isSelected) {
            const existingLine = mesh.children.find(child => child instanceof THREE.LineSegments);
            if (!existingLine) {
                addSelectionOutline(mesh);
            }
        } else {
            removeSelectionOutline(mesh);
        }
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
 * Освобождает ресурсы Object3D
 */
export const disposeObject3D = (object: THREE.Object3D) => {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose();

            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else {
                child.material.dispose();
            }
        }

        if (child instanceof THREE.LineSegments) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
        }

        if (child instanceof THREE.BoxHelper) {
            child.geometry.dispose();
            child.material.dispose();
        }
    });
};

/**
 * Освобождает ресурсы mesh (обратная совместимость)
 */
export const disposeMesh = (mesh: THREE.Mesh | THREE.Object3D) => {
    if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose();

        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
        } else {
            mesh.material.dispose();
        }

        mesh.children.forEach(child => {
            if (child instanceof THREE.LineSegments) {
                child.geometry.dispose();
                (child.material as THREE.Material).dispose();
            }
        });
    } else {
        disposeObject3D(mesh);
    }
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
