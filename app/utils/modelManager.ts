import { Furniture } from '@/types';
import * as THREE from 'three';
import { createConditionerLowPolyModel, createConditionerModel } from './catalog/conditioner';
import { createChairLowPolyModel, createChairModel } from './catalog/chair';
import { createFallbackModel } from './catalog/fallback';

export interface ModelConfig {
    name: string;
    width: number;
    depth: number;
    height: number;
    createModel: () => THREE.Object3D;
    createLowPolyModel?: () => THREE.Object3D;
}

export const MODELS: Record<string, ModelConfig> = {
    conditioner: {
        name: 'Кондиционер',
        width: 90,
        depth: 40,
        height: 30,
        createModel: createConditionerModel,
        createLowPolyModel: createConditionerLowPolyModel
    },
    chair: {
        name: 'Стул',
        width: 55,
        depth: 55,
        height: 50,
        createModel: createChairModel,
        createLowPolyModel: createChairLowPolyModel
    }
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
