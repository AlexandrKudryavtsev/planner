import {
    Object3D,
    Group,
    MeshLambertMaterial,
    CylinderGeometry,
    Mesh,
    Shape,
    ExtrudeGeometry,
    BoxGeometry
} from 'three';

export const createChairModel = (): Object3D => {
    const legMaterial = new MeshLambertMaterial({ color: 0xd9d7d7 });
    const woodMaterial = new MeshLambertMaterial({ color: 0x9b8c75 });

    const chair = new Group();

    // Ножки
    const legGeometry = new CylinderGeometry(0.02, 0.02, 0.5, 32, 32);

    const leg1 = new Mesh(legGeometry, legMaterial);
    leg1.rotation.x += Math.PI / 2;
    leg1.position.z += 0.5 / 2;
    chair.add(leg1);

    const leg2 = new Mesh(legGeometry, legMaterial);
    leg2.rotation.x += Math.PI / 2;
    leg2.position.z += 0.5 / 2;
    leg2.position.y += 0.4;
    chair.add(leg2);

    const leg3 = new Mesh(legGeometry, legMaterial);
    leg3.rotation.x += Math.PI / 2;
    leg3.position.z += 0.5 / 2;
    leg3.position.x += 0.4;
    chair.add(leg3);

    const leg4 = new Mesh(legGeometry, legMaterial);
    leg4.rotation.x += Math.PI / 2;
    leg4.position.z += 0.5 / 2;
    leg4.position.y += 0.4;
    leg4.position.x += 0.4;
    chair.add(leg4);

    const leg5 = new Mesh(legGeometry, legMaterial);
    leg5.rotation.x += Math.PI / 2;
    leg5.position.z += 0.5 * 3 / 2;
    chair.add(leg5);

    const leg6 = new Mesh(legGeometry, legMaterial);
    leg6.rotation.x += Math.PI / 2;
    leg6.position.z += 0.5 * 3 / 2;
    leg6.position.x += 0.4;
    chair.add(leg6);

    // Сиденье
    const roundedRectShape = new Shape();
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

    const seatGeometry = new ExtrudeGeometry(roundedRectShape, extrudeSettings);
    const seat = new Mesh(seatGeometry, woodMaterial);
    seat.position.set(-0.05, -0.04, 0.5);
    chair.add(seat);

    // Спинка
    const roundedRectShape2 = new Shape();
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

    const backGeometry = new ExtrudeGeometry(roundedRectShape2, extrudeSettings);
    const back = new Mesh(backGeometry, woodMaterial);
    back.rotation.x += Math.PI / 2;
    back.position.set(-0.025, 0.03, 0.75);
    chair.add(back);

    chair.rotateX(Math.PI / 2);
    chair.rotateY(Math.PI);

    return chair;
}

export const createChairLowPolyModel = (): Object3D => {
    const legMaterial = new MeshLambertMaterial({ color: 0xd9d7d7 });
    const woodMaterial = new MeshLambertMaterial({ color: 0x9b8c75 });

    const chair = new Group();

    // Ножки
    const legGeometry = new CylinderGeometry(0.02, 0.02, 0.5, 8, 8);

    const leg1 = new Mesh(legGeometry, legMaterial);
    leg1.rotation.x += Math.PI / 2;
    leg1.position.z += 0.5 / 2;
    chair.add(leg1);

    const leg2 = new Mesh(legGeometry, legMaterial);
    leg2.rotation.x += Math.PI / 2;
    leg2.position.z += 0.5 / 2;
    leg2.position.y += 0.4;
    chair.add(leg2);

    const leg3 = new Mesh(legGeometry, legMaterial);
    leg3.rotation.x += Math.PI / 2;
    leg3.position.z += 0.5 / 2;
    leg3.position.x += 0.4;
    chair.add(leg3);

    const leg4 = new Mesh(legGeometry, legMaterial);
    leg4.rotation.x += Math.PI / 2;
    leg4.position.z += 0.5 / 2;
    leg4.position.y += 0.4;
    leg4.position.x += 0.4;
    chair.add(leg4);

    const leg5 = new Mesh(legGeometry, legMaterial);
    leg5.rotation.x += Math.PI / 2;
    leg5.position.z += 0.5 * 3 / 2;
    chair.add(leg5);

    const leg6 = new Mesh(legGeometry, legMaterial);
    leg6.rotation.x += Math.PI / 2;
    leg6.position.z += 0.5 * 3 / 2;
    leg6.position.x += 0.4;
    chair.add(leg6);

    // Сиденье
    const seatGeometry = new BoxGeometry(0.5, 0.03, 0.48);
    const seat = new Mesh(seatGeometry, woodMaterial);
    seat.position.set(0.15, -0.04, 0.5);
    chair.add(seat);

    // Спинка
    const backGeometry = new BoxGeometry(0.45, 0.25, 0.03);
    const back = new Mesh(backGeometry, woodMaterial);
    back.position.set(0.175, 0.1, 0.75);
    chair.add(back);

    chair.rotateX(Math.PI / 2)
    chair.rotateY(Math.PI);

    return chair;
}
