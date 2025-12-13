import {
    Object3D,
    Mesh,
    MeshLambertMaterial,
    Shape,
    ExtrudeGeometry,
    CylinderGeometry
} from 'three';

export const createModernRadiatorModel = (): Object3D => {
    const greyMaterial = new MeshLambertMaterial({ color: 0xeae6ca });
    
    const radiator = new Object3D();

    // Основная секция радиатора
    const roundedRectShape = new Shape();
    const x = 0, y = 0, width = 9.5, height = 75, radius = 2.5; // height = 100 - 25

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
        depth: 2.5,
        bevelEnabled: false
    };

    // Создаем несколько секций радиатора
    for (let i = 5; i <= 85; i += 10) { // Примерная ширина 100см
        const geometry = new ExtrudeGeometry(roundedRectShape, extrudeSettings);
        const mesh = new Mesh(geometry, greyMaterial);
        mesh.position.set(i, 0, 2.5);
        radiator.add(mesh);

        // Добавляем дополнительные элементы для детализации
        const mesh2 = new Mesh(geometry, greyMaterial);
        mesh2.position.set(i, 5, 0);
        radiator.add(mesh2);

        const mesh3 = new Mesh(geometry, greyMaterial);
        mesh3.position.set(i, 5, -2.5);
        mesh3.scale.set(1, 1.05, 1);
        radiator.add(mesh3);

        const mesh4 = new Mesh(geometry, greyMaterial);
        mesh4.position.set(i, 6, -4);
        mesh4.scale.set(1, 1.2, 1);
        radiator.add(mesh4);
    }

    // Трубы (верхняя и нижняя)
    for (const yPos of [5, 87.5]) { // Примерная высота 100см
        const tubeGeometry = new CylinderGeometry(1.67, 1.67, 100, 16); // newDepth/6 ≈ 10/6
        const tube = new Mesh(tubeGeometry, greyMaterial);
        tube.rotation.x += Math.PI / 2;
        tube.rotation.z += Math.PI / 2;
        tube.position.set(50, yPos, 1.67); // newWidth/2
        radiator.add(tube);
    }

    return radiator;
};

export const createModernRadiatorLowPolyModel = (): Object3D => {
    const greyMaterial = new MeshLambertMaterial({ color: 0xeae6ca });
    
    const radiator = new Object3D();

    // Упрощенная основная секция
    const roundedRectShape = new Shape();
    const x = 0, y = 0, width = 9.5, height = 75, radius = 0.25;

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
        steps: 1,
        depth: 2.5,
        bevelEnabled: false
    };

    // Меньше секций для низкополигональной версии
    for (let i = 5; i <= 85; i += 20) {
        const geometry = new ExtrudeGeometry(roundedRectShape, extrudeSettings);
        const mesh = new Mesh(geometry, greyMaterial);
        mesh.position.set(i, 0, 2.5);
        radiator.add(mesh);
    }

    // Упрощенные трубы
    for (const yPos of [1.67, 90]) { // newDepth/6 и newHeight-10
        const tubeGeometry = new CylinderGeometry(1.67, 1.67, 100, 8);
        const tube = new Mesh(tubeGeometry, greyMaterial);
        tube.rotation.x += Math.PI / 2;
        tube.rotation.z += Math.PI / 2;
        tube.position.set(50, yPos, 1.67);
        radiator.add(tube);
    }

    return radiator;


};