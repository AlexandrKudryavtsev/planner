import {
    Object3D,
    MeshLambertMaterial,
    Mesh,
    Shape,
    ExtrudeGeometry,
    BoxGeometry,
    DoubleSide
} from 'three';

export const createConditionerModel = (): Object3D => {
    const grey = new MeshLambertMaterial({ color: 0xd9d7d7 });
    const darkGrey = new MeshLambertMaterial({ color: 0x808287 });
    grey.side = DoubleSide;
    darkGrey.side = DoubleSide;

    const airConditioner = new Mesh();

    // Тело кондиционера
    const roundedRectShape = new Shape();
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

    const bodyGeometry = new ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const body = new Mesh(bodyGeometry, grey);
    body.position.set(-0.11, 1.2, 0);
    body.rotation.z += Math.PI;
    airConditioner.add(body);

    // Сетка
    let j = 1.18;
    for (let i = -0.30; i > -0.36; i -= 0.005) {
        const gridHorizontalGeometry = new BoxGeometry(0.001, 0.025, 0.705);
        const gridHorizontal = new Mesh(gridHorizontalGeometry, darkGrey);
        gridHorizontal.position.set(i, j, 0.5);
        gridHorizontal.rotation.z += Math.PI / 4;
        airConditioner.add(gridHorizontal);
        j -= 0.005;
    }

    for (let k = 0.15; k < 0.87; k += 0.05) {
        const gridVerticalGeometry = new BoxGeometry(0.079, 0.025, 0.005);
        const gridVertical = new Mesh(gridVerticalGeometry, darkGrey);
        gridVertical.position.set(-0.324, 1.148, k);
        gridVertical.rotation.z += Math.PI / 4;
        airConditioner.add(gridVertical);
    }

    // Передняя панель
    const roundedRectShape2 = new Shape();
    const x2 = 0, y2 = 0, width2 = 0.2, height2 = 0.4, radius2 = 0.15;

    roundedRectShape2.moveTo(x2, y2);
    roundedRectShape2.lineTo(x2 + width2, y2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2, x2 + width2 / 2, y2 + height2);
    roundedRectShape2.lineTo(x2 + width2 / 2, y2 + height2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2 / 4, x2, y2);

    const frontCoverGeometry = new ExtrudeGeometry(roundedRectShape2, extrudeSettings);
    const frontCover = new Mesh(frontCoverGeometry, grey);
    frontCover.position.set(-0.2, 1.1, 0);
    frontCover.rotation.z += Math.PI;
    airConditioner.add(frontCover);

    airConditioner.rotateZ(Math.PI / 2)

    return airConditioner;
}

export const createConditionerLowPolyModel = (): Object3D => {
    const grey = new MeshLambertMaterial({ color: 0xd9d7d7 });
    grey.side = DoubleSide;

    const airConditioner = new Mesh();

    // Тело кондиционера
    const roundedRectShape = new Shape();
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

    const bodyGeometry = new ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const body = new Mesh(bodyGeometry, grey);
    body.position.set(-0.11, 1.2, 0);
    body.rotation.z += Math.PI;
    airConditioner.add(body);

    // Передняя панель
    const roundedRectShape2 = new Shape();
    const x2 = 0, y2 = 0, width2 = 0.2, height2 = 0.4, radius2 = 0.15;

    roundedRectShape2.moveTo(x2, y2);
    roundedRectShape2.lineTo(x2 + width2, y2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2, x2 + width2 / 2, y2 + height2);
    roundedRectShape2.lineTo(x2 + width2 / 2, y2 + height2);
    roundedRectShape2.quadraticCurveTo(x2 + width2 + radius2, y2 + height2 / 4, x2, y2);

    const frontCoverGeometry = new ExtrudeGeometry(roundedRectShape2, extrudeSettings);
    const frontCover = new Mesh(frontCoverGeometry, grey);
    frontCover.position.set(-0.2, 1.1, 0);
    frontCover.rotation.z += Math.PI;
    airConditioner.add(frontCover);

    airConditioner.rotateZ(Math.PI / 2)
    return airConditioner;
}
