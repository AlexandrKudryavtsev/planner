import {
    Object3D,
    Mesh,
    MeshLambertMaterial,
    Shape,
    ExtrudeGeometry,
    BoxGeometry
} from 'three';

export const createBlackboardModel = (): Object3D => {
    // Материалы
    const frameMaterial = new MeshLambertMaterial({ color: 0xCCCCCC }); // серый - рамка
    const boardMaterial = new MeshLambertMaterial({ color: 0x000000 }); // черный - доска

    const blackboard = new Object3D();

    // Основная рамка доски
    const createFrameShape = () => {
        const shape = new Shape();
        const x = 0, y = 0;
        const width = 8;
        const height = 4;
        const radius = 0.25;

        // Закругленный прямоугольник
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.quadraticCurveTo(x, y + height, x + radius, y + height);
        shape.lineTo(x + width - radius, y + height);
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        shape.lineTo(x + width, y + radius);
        shape.quadraticCurveTo(x + width, y, x + width - radius, y);
        shape.lineTo(x + radius, y);
        shape.quadraticCurveTo(x, y, x, y + radius);

        return shape;
    };

    // Настройки экструзии для рамки
    const extrudeSettings = {
        steps: 2,
        depth: 0.2,
        bevelEnabled: false
    };

    // 1. Основная рамка
    const frameShape = createFrameShape();
    const frameGeometry = new ExtrudeGeometry(frameShape, extrudeSettings);
    const frame = new Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 1.2, 0); // относительное позиционирование
    blackboard.add(frame);

    // 2. Сама доска
    const boardWidth = 8 - 8 / 11; // width - width/11
    const boardHeight = 4 - 4 / 8;  // height - height/8
    const boardGeometry = new BoxGeometry(boardWidth, boardHeight, 0.2);
    const board = new Mesh(boardGeometry, boardMaterial);
    board.position.set(4, 3.2, 0.07); // в центре рамки
    blackboard.add(board);

    // 3. Нижняя полка для мела
    const shelfGeometry = new BoxGeometry(8, 4 / 50, 0.33); // width, height/50, depth
    const shelf = new Mesh(shelfGeometry, frameMaterial);
    shelf.position.set(4, 1.0, -0.095); // под доской
    blackboard.add(shelf);

    // 4. Боковые направляющие для полки
    const guideGeometry = new BoxGeometry(8, 4 / 50, 0.25);

    // Левая направляющая
    const leftGuide = new Mesh(guideGeometry, frameMaterial);
    leftGuide.rotation.x = Math.PI / 2; // поворот на 90 градусов
    leftGuide.position.set(4, 1.1, 0.03);
    blackboard.add(leftGuide);

    // Правая направляющая
    const rightGuide = new Mesh(guideGeometry, frameMaterial);
    rightGuide.rotation.x = Math.PI / 2;
    rightGuide.position.set(4, 1.1, -0.22);
    blackboard.add(rightGuide);

    return blackboard;
};

export const createBlackboardLowPolyModel = (): Object3D => {
    const frameMaterial = new MeshLambertMaterial({ color: 0xCCCCCC });
    const boardMaterial = new MeshLambertMaterial({ color: 0x000000 });

    const blackboard = new Object3D();

    // Рамка
    const frameGeometry = new BoxGeometry(8, 4, 0.2);
    const frame = new Mesh(frameGeometry, frameMaterial);
    frame.position.set(4, 2, 0);
    blackboard.add(frame);

    // Доска
    const boardGeometry = new BoxGeometry(7.27, 3.5, 0.1)
    const board = new Mesh(boardGeometry, boardMaterial);
    board.position.set(4, 2, 0.06);
    blackboard.add(board);

    // Полка
    const shelfGeometry = new BoxGeometry(8, 0.08, 0.33);
    const shelf = new Mesh(shelfGeometry, frameMaterial);
    shelf.position.set(4, 0.4, -0.1);
    blackboard.add(shelf);

    return blackboard;
};
