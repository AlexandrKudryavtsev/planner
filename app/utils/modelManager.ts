import { Furniture } from '@/types';
import * as THREE from 'three';
import { createChairModel } from './catalog/chair';
import { createFallbackModel } from './catalog/fallback';
import { createModernRadiatorLowPolyModel, createModernRadiatorModel } from './catalog/modernRadiator';
import { createOldRadiatorLowPolyModel, createOldRadiatorModel } from './catalog/oldRadiator';
import { createBlackboardModel } from './catalog/blackboard';
import { getStaticPath } from './path';

export interface ModelConfig {
    name: string;
    width: number;
    depth: number;
    height: number;
    price: number;
    preview: string;
    createModel: () => THREE.Object3D;
    createLowPolyModel?: () => THREE.Object3D;
}

export const MODELS: Record<string, ModelConfig> = {
    chair: {
        name: 'Стул',
        width: 55,
        depth: 55,
        height: 80,
        price: 2_000,
        preview: getStaticPath('/furniture-preview/chair.png'),
        createModel: createChairModel,
    },
    modernRadiator: {
        name: 'Современный радиатор',
        width: 100,
        depth: 10,
        height: 100,
        price: 30_000,
        preview: getStaticPath('/furniture-preview/modern-radiator.png'),
        createModel: createModernRadiatorModel,
        createLowPolyModel: createModernRadiatorLowPolyModel
    },
    oldRadiator: {
        name: 'Чугунный радиатор',
        width: 100,
        depth: 20,
        height: 100,
        price: 20_000,
        preview: getStaticPath('/furniture-preview/old-radiator.png'),
        createModel: createOldRadiatorModel,
        createLowPolyModel: createOldRadiatorLowPolyModel
    },
    blackboard: {
        name: 'Классная доска',
        width: 300,
        depth: 20,
        height: 150,
        price: 9_000,
        preview: getStaticPath('/furniture-preview/blackboard.png'),
        createModel: createBlackboardModel,
        createLowPolyModel: createBlackboardModel
    }
};

export const MODEL_IMAGES: Record<string, string> = {
    conditioner: getStaticPath('/furniture-preview/air-conditioner.png'),
    chair: getStaticPath('/furniture-preview/chair.png'),
    modernRadiator: getStaticPath('/furniture-preview/modern-radiator.png'),
    oldRadiator: getStaticPath('/furniture-preview/old-radiator.png'),
    blackboard: getStaticPath('/furniture-preview/blackboard.png')
};

/**
 * Создает 3D модель мебели с LOD
 */
export function createModelMesh(
    furniture: Furniture,
    isSelected: boolean,
    isLowPoly = false
): THREE.Object3D {
    const modelType = furniture.modelType || 'chair';
    const config = MODELS[modelType];

    if (!config) {
        console.warn(`Model ${modelType} not found, using fallback`);
        return createFallbackModel(furniture, isSelected);
    }

    const model = isLowPoly && config.createLowPolyModel
        ? config.createLowPolyModel()
        : config.createModel();

    // Масштабирование к нужным размерам
    const boundingBox = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const scaleX = furniture.dimensions.x / size.x;
    const scaleY = furniture.dimensions.y / size.y;
    const scaleZ = furniture.dimensions.z / size.z;

    model.scale.set(scaleX, scaleY, scaleZ);

    // Позицию
    model.position.set(
        furniture.position.x + furniture.dimensions.x / 2,
        furniture.position.y + furniture.dimensions.y / 2,
        furniture.position.z + furniture.dimensions.z / 2
    );

    // Вращение
    model.rotation.y = furniture.rotation * (Math.PI / 180);

    // Тени
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material instanceof THREE.MeshLambertMaterial) {
                if (furniture.color && furniture.color !== '#000000') {
                    child.material.color.set(furniture.color);
                }
                child.material.transparent = isSelected;
                child.material.opacity = isSelected ? 0.8 : 0.9;
            }
        }
    });

    // Контур выбора
    if (isSelected) {
        const boxHelper = new THREE.BoxHelper(model, 0x99c3fb);
        boxHelper.material.linewidth = 2;
        model.add(boxHelper);
    }

    // LOD система
    const lod = new THREE.LOD();

    // Высокополигональная модель для ближнего расстояния
    const highPolyModel = isLowPoly && config.createLowPolyModel
        ? config.createLowPolyModel()
        : config.createModel();

    highPolyModel.scale.set(scaleX, scaleY, scaleZ);
    highPolyModel.rotation.y = furniture.rotation * (Math.PI / 180);

    // Низкополигональная модель для дальнего расстояния
    const lowPolyModel = config.createLowPolyModel
        ? config.createLowPolyModel()
        : config.createModel();

    lowPolyModel.scale.set(scaleX, scaleY, scaleZ);
    lowPolyModel.rotation.y = furniture.rotation * (Math.PI / 180);

    lod.addLevel(highPolyModel, 0);
    lod.addLevel(lowPolyModel, 1000);

    lod.position.copy(model.position);

    return lod;
}
