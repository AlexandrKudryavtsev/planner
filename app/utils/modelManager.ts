import { Furniture } from '@/types';
import * as THREE from 'three';

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

function createConditionerModel(): THREE.Object3D {
    const grey = new THREE.MeshLambertMaterial({ color: 0xd9d7d7 });
    const darkGrey = new THREE.MeshLambertMaterial({ color: 0x808287 });
    grey.side = THREE.DoubleSide;
    darkGrey.side = THREE.DoubleSide;

    const airConditioner = new THREE.Mesh();

    // Тело кондиционера
    const roundedRectShape = new THREE.Shape();
    const x = 0, y = 0, width = 0.15, height = 0.6, radius = 0.15;

    roundedRectShape.moveTo(x, y);
    roundedRectShape.lineTo(x + width, y);
    roundedRectShape.lineTo(x + width + radius, y + radius);
    roundedRectShape.quadraticCurveTo(x + width + radius, y + height, x + width / 2, y + height);
    roundedRectShape.lineTo(x + width / 2, y + height);
    roundedRectShape.lineTo(x, y + height);

    const extrudeSettings = {
        steps: 2,
        depth: 1,
        bevelEnabled: false
    };

    const bodyGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const body = new THREE.Mesh(bodyGeometry, grey);
    body.position.set(-0.11, 1.2, 0);
    body.rotation.z += Math.PI;
    airConditioner.add(body);

    // Сетка
    let j = 1.18;
    for (let i = -0.30; i > -0.36; i -= 0.005) {
        const gridHorizontalGeometry = new THREE.BoxGeometry(0.001, 0.025, 0.705);
        const gridHorizontal = new THREE.Mesh(gridHorizontalGeometry, darkGrey);
        gridHorizontal.position.set(i, j, 0.5);
        gridHorizontal.rotation.z += Math.PI / 4;
        airConditioner.add(gridHorizontal);
        j -= 0.005;
    }

    for (let k = 0.15; k < 0.87; k += 0.05) {
        const gridVerticalGeometry = new THREE.BoxGeometry(0.079, 0.025, 0.005);
        const gridVertical = new THREE.Mesh(gridVerticalGeometry, darkGrey);
        gridVertical.position.set(-0.324, 1.148, k);
        gridVertical.rotation.z += Math.PI / 4;
        airConditioner.add(gridVertical);
    }

    // Передняя панель
    const roundedRectShape2 = new THREE.Shape();
    const x2 = 0, y2 = 0, width2 = 0.2, height2 = 0.4, radius2 = 0.15;

    roundedRectShape2.moveTo(x2, y2);
    roundedRectShape2.lineTo(x2 + width2, y2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2, x2 + width2 / 2, y2 + height2);
    roundedRectShape2.lineTo(x2 + width2 / 2, y2 + height2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2 / 4, x2, y2);

    const frontCoverGeometry = new THREE.ExtrudeGeometry(roundedRectShape2, extrudeSettings);
    const frontCover = new THREE.Mesh(frontCoverGeometry, grey);
    frontCover.position.set(-0.2, 1.1, 0);
    frontCover.rotation.z += Math.PI;
    airConditioner.add(frontCover);

    return airConditioner;
}

function createConditionerLowPolyModel(): THREE.Object3D {
    const grey = new THREE.MeshLambertMaterial({ color: 0xd9d7d7 });
    grey.side = THREE.DoubleSide;

    const airConditioner = new THREE.Mesh();

    // Тело кондиционера (упрощенное)
    const roundedRectShape = new THREE.Shape();
    const x = 0, y = 0, width = 0.15, height = 0.6, radius = 0.15;

    roundedRectShape.moveTo(x, y);
    roundedRectShape.lineTo(x + width, y);
    roundedRectShape.lineTo(x + width + radius, y + radius);
    roundedRectShape.quadraticCurveTo(x + width + radius, y + height, x + width / 2, y + height);
    roundedRectShape.lineTo(x + width / 2, y + height);
    roundedRectShape.lineTo(x, y + height);

    const extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: false
    };

    const bodyGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const body = new THREE.Mesh(bodyGeometry, grey);
    body.position.set(-0.11, 1.2, 0);
    body.rotation.z += Math.PI;
    airConditioner.add(body);

    // Передняя панель (упрощенная)
    const roundedRectShape2 = new THREE.Shape();
    const x2 = 0, y2 = 0, width2 = 0.2, height2 = 0.4, radius2 = 0.15;

    roundedRectShape2.moveTo(x2, y2);
    roundedRectShape2.lineTo(x2 + width2, y2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2, x2 + width2 / 2, y2 + height2);
    roundedRectShape2.lineTo(x2 + width2 / 2, y2 + height2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2 / 4, x2, y2);

    const frontCoverGeometry = new THREE.ExtrudeGeometry(roundedRectShape2, extrudeSettings);
    const frontCover = new THREE.Mesh(frontCoverGeometry, grey);
    frontCover.position.set(-0.2, 1.1, 0);
    frontCover.rotation.z += Math.PI;
    airConditioner.add(frontCover);

    return airConditioner;
}

function createChairModel(): THREE.Object3D {
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0xd9d7d7 });
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x9b8c75 });

    const chair = new THREE.Group();

    // Ножки
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 32, 32);

    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.rotation.x += Math.PI / 2;
    leg1.position.z += 0.5 / 2;
    chair.add(leg1);

    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.rotation.x += Math.PI / 2;
    leg2.position.z += 0.5 / 2;
    leg2.position.y += 0.4;
    chair.add(leg2);

    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.rotation.x += Math.PI / 2;
    leg3.position.z += 0.5 / 2;
    leg3.position.x += 0.4;
    chair.add(leg3);

    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.rotation.x += Math.PI / 2;
    leg4.position.z += 0.5 / 2;
    leg4.position.y += 0.4;
    leg4.position.x += 0.4;
    chair.add(leg4);

    const leg5 = new THREE.Mesh(legGeometry, legMaterial);
    leg5.rotation.x += Math.PI / 2;
    leg5.position.z += 0.5 * 3 / 2;
    chair.add(leg5);

    const leg6 = new THREE.Mesh(legGeometry, legMaterial);
    leg6.rotation.x += Math.PI / 2;
    leg6.position.z += 0.5 * 3 / 2;
    leg6.position.x += 0.4;
    chair.add(leg6);

    // Сиденье
    const roundedRectShape = new THREE.Shape();
    const x = 0, y = 0, width = 0.5, height = 0.48, radius = 0.05;

    roundedRectShape.moveTo(x, y + radius);
    roundedRectShape.lineTo(x, y + height - radius);
    roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
    roundedRectShape.lineTo(x + width - radius, y + height);
    roundedRectShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    roundedRectShape.lineTo(x + width, y + radius);
    roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
    roundedRectShape.lineTo(x + radius, y);
    roundedRectShape.quadraticCurveTo(x, y, x, y + radius);

    const extrudeSettings = {
        steps: 2,
        depth: 0.03,
        bevelEnabled: false
    };

    const seatGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const seat = new THREE.Mesh(seatGeometry, woodMaterial);
    seat.position.set(-0.05, -0.04, 0.5);
    chair.add(seat);

    // Спинка
    const roundedRectShape2 = new THREE.Shape();
    const x2 = 0, y2 = 0, width2 = 0.45, height2 = 0.25, radius2 = 0.05;

    roundedRectShape2.moveTo(x2, y2 + radius2);
    roundedRectShape2.lineTo(x2, y2 + height2 - radius2);
    roundedRectShape2.quadraticCurveTo(x2, y2 + height2, x2 + radius2, y2 + height2);
    roundedRectShape2.lineTo(x2 + width2 - radius2, y2 + height2);
    roundedRectShape2.quadraticCurveTo(x2 + width2, y2 + height2, x2 + width2, y2 + height2 - radius2);
    roundedRectShape2.lineTo(x2 + width2, y2 + radius2);
    roundedRectShape2.quadraticCurveTo(x2 + width2, y2, x2 + width2 - radius2, y2);
    roundedRectShape2.lineTo(x2 + radius2, y2);
    roundedRectShape2.quadraticCurveTo(x2, y2, x2, y2 + radius2);

    const backGeometry = new THREE.ExtrudeGeometry(roundedRectShape2, extrudeSettings);
    const back = new THREE.Mesh(backGeometry, woodMaterial);
    back.rotation.x += Math.PI / 2;
    back.position.set(-0.025, 0.03, 0.75);
    chair.add(back);

    return chair;
}

function createChairLowPolyModel(): THREE.Object3D {
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0xd9d7d7 });
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x9b8c75 });

    const chair = new THREE.Group();

    // Ножки (упрощенные)
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8, 8);

    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.rotation.x += Math.PI / 2;
    leg1.position.z += 0.5 / 2;
    chair.add(leg1);

    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.rotation.x += Math.PI / 2;
    leg2.position.z += 0.5 / 2;
    leg2.position.y += 0.4;
    chair.add(leg2);

    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.rotation.x += Math.PI / 2;
    leg3.position.z += 0.5 / 2;
    leg3.position.x += 0.4;
    chair.add(leg3);

    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.rotation.x += Math.PI / 2;
    leg4.position.z += 0.5 / 2;
    leg4.position.y += 0.4;
    leg4.position.x += 0.4;
    chair.add(leg4);

    const leg5 = new THREE.Mesh(legGeometry, legMaterial);
    leg5.rotation.x += Math.PI / 2;
    leg5.position.z += 0.5 * 3 / 2;
    chair.add(leg5);

    const leg6 = new THREE.Mesh(legGeometry, legMaterial);
    leg6.rotation.x += Math.PI / 2;
    leg6.position.z += 0.5 * 3 / 2;
    leg6.position.x += 0.4;
    chair.add(leg6);

    // Сиденье (упрощенное)
    const seatGeometry = new THREE.BoxGeometry(0.5, 0.03, 0.48);
    const seat = new THREE.Mesh(seatGeometry, woodMaterial);
    seat.position.set(0.15, -0.04, 0.5);
    chair.add(seat);

    // Спинка (упрощенная)
    const backGeometry = new THREE.BoxGeometry(0.45, 0.25, 0.03);
    const back = new THREE.Mesh(backGeometry, woodMaterial);
    back.position.set(0.175, 0.1, 0.75);
    chair.add(back);

    return chair;
}

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

    // Создаем модель
    const model = isLowPoly && config.createLowPolyModel 
        ? config.createLowPolyModel() 
        : config.createModel();

    // Масштабируем к нужным размерам
    const boundingBox = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const scaleX = furniture.dimensions.x / size.x;
    const scaleY = furniture.dimensions.y / size.y;
    const scaleZ = furniture.dimensions.z / size.z;

    model.scale.set(scaleX, scaleY, scaleZ);

    // Устанавливаем позицию
    model.position.set(
        furniture.position.x + furniture.dimensions.x / 2,
        furniture.position.y + furniture.dimensions.y / 2,
        furniture.position.z + furniture.dimensions.z / 2
    );

    // Применяем вращение
    model.rotation.y = furniture.rotation * (Math.PI / 180);

    // Настройка теней
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Применяем цвет, если это простой материал
            if (child.material instanceof THREE.MeshLambertMaterial) {
                if (furniture.color && furniture.color !== '#000000') {
                    child.material.color.set(furniture.color);
                }
                child.material.transparent = isSelected;
                child.material.opacity = isSelected ? 0.8 : 0.9;
            }
        }
    });

    // Добавляем контур выбора
    if (isSelected) {
        const boxHelper = new THREE.BoxHelper(model, 0x99c3fb);
        boxHelper.material.linewidth = 2;
        model.add(boxHelper);
    }

    // Создаем LOD систему
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
    lod.addLevel(lowPolyModel, 500);
    
    lod.position.copy(model.position);

    return lod;
}

/**
 * Создает простую модель как fallback
 */
function createFallbackModel(furniture: Furniture, isSelected: boolean): THREE.Mesh {
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
        furniture.position.y + furniture.dimensions.y / 2,
        furniture.position.z + furniture.dimensions.z / 2
    );
    mesh.rotation.y = furniture.rotation * (Math.PI / 180);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}
