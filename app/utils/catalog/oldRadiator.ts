import {
    Object3D,
    Mesh,
    MeshLambertMaterial,
    Shape,
    ExtrudeGeometry,
    CylinderGeometry,
    Path
} from 'three';

export const createOldRadiatorModel = (): Object3D => {
    const greyMaterial = new MeshLambertMaterial({ color: 0xeae6ca });
    const radiator = new Object3D();

    const DEPTH = 20;
    const SECTION_WIDTH = DEPTH; // ширина секции = глубина радиатора
    const SECTION_SPACING = 5; // расстояние между секциями
    const HEIGHT = 100; // стандартная высота

    const createSectionShape = (height: number) => {
        const shape = new Shape();
        const x = 0, y = 0;
        const width = SECTION_WIDTH;
        const radius = 2.5;

        // Основной контур
        shape.moveTo(x, y + radius);
        shape.lineTo(x, y + height - radius);
        shape.quadraticCurveTo(x, y + height, x + radius, y + height);
        shape.lineTo(x + width - radius, y + height);
        shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        shape.lineTo(x + width, y + radius);
        shape.quadraticCurveTo(x + width, y, x + width - radius, y);
        shape.lineTo(x + radius, y);
        shape.quadraticCurveTo(x, y, x, y + radius);

        const addHoleColumn = (xOffset: number) => {
            // Верхнее отверстие
            const hole1 = new Path();
            hole1.moveTo(xOffset, height * 0.16);
            hole1.absarc(xOffset, height * 0.23, DEPTH / 8, 0, Math.PI, false);
            shape.holes.push(hole1);

            // Среднее отверстие
            const hole2 = new Path();
            hole2.moveTo(xOffset, height * 0.49);
            hole2.absarc(xOffset, height * 0.56, DEPTH / 8, 0, Math.PI, false);
            shape.holes.push(hole2);

            // Нижнее отверстие
            const hole3 = new Path();
            hole3.moveTo(xOffset, height * 0.82);
            hole3.absarc(xOffset, height * 0.89, DEPTH / 8, 0, Math.PI, false);
            shape.holes.push(hole3);
        };

        // Три столбца отверстий
        addHoleColumn(DEPTH / 6);      // левый
        addHoleColumn(DEPTH / 2);      // центральный
        addHoleColumn(0.85 * DEPTH);   // правый

        return shape;
    };

    // Настройки экструзии
    const extrudeSettings = {
        steps: 2,
        depth: 4.5, // толщина секции
        bevelEnabled: false
    };

    // Создаем секции радиатора
    const sectionCount = 20; // примерное количество для ширины 100см

    for (let i = 0; i < sectionCount; i++) {
        const sectionShape = createSectionShape(HEIGHT);
        const geometry = new ExtrudeGeometry(sectionShape, extrudeSettings);
        const section = new Mesh(geometry, greyMaterial);

        // Позиционируем секцию
        section.position.set(i * SECTION_SPACING + 2.5, HEIGHT / 20, DEPTH);
        section.rotation.y = Math.PI / 2; // поворачиваем на 90 градусов
        radiator.add(section);
    }

    // Трубы (верхняя и нижняя)
    const createPipe = (yPosition: number, width: number) => {
        // Основная труба
        const mainPipeGeometry = new CylinderGeometry(DEPTH / 12, DEPTH / 12, width, 16);
        const mainPipe = new Mesh(mainPipeGeometry, greyMaterial);
        mainPipe.rotation.x = Math.PI / 2;
        mainPipe.rotation.z = Math.PI / 2;
        mainPipe.position.set(width / 2, yPosition, DEPTH / 2);
        radiator.add(mainPipe);

        // Декоративные кольца
        const ringGeometry1 = new CylinderGeometry(DEPTH / 8, DEPTH / 8, width - 2.5, 6);
        const ring1 = new Mesh(ringGeometry1, greyMaterial);
        ring1.rotation.x = Math.PI / 2;
        ring1.rotation.z = Math.PI / 2;
        ring1.position.set(width / 2, yPosition, DEPTH / 2);
        radiator.add(ring1);

        const ringGeometry2 = new CylinderGeometry(DEPTH / 7, DEPTH / 7, width - 5, 16);
        const ring2 = new Mesh(ringGeometry2, greyMaterial);
        ring2.rotation.x = Math.PI / 2;
        ring2.rotation.z = Math.PI / 2;
        ring2.position.set(width / 2, yPosition, DEPTH / 2);
        radiator.add(ring2);
    };

    // Ширина радиатора
    const totalWidth = sectionCount * SECTION_SPACING + 2.5;

    // Создаем трубы
    createPipe(10, totalWidth); // нижняя труба
    createPipe(HEIGHT, totalWidth); // верхняя труба

    return radiator;
};

export const createOldRadiatorLowPolyModel = (): Object3D => {
    const greyMaterial = new MeshLambertMaterial({ color: 0xeae6ca });
    const radiator = new Object3D();

    const DEPTH = 20;
    const HEIGHT = 100;
    const SECTION_SPACING = 10; // меньше секций для low poly
    const sectionCount = 10; // меньше секций

    // Упрощенная форма секции (без отверстий)
    const createSimpleSectionShape = (height: number) => {
        const shape = new Shape();
        const x = 0, y = 0;
        const width = DEPTH;
        const radius = 2.5;

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

    const extrudeSettings = {
        steps: 1,
        depth: 4.5,
        bevelEnabled: false
    };

    // Создаем упрощенные секции
    for (let i = 0; i < sectionCount; i++) {
        const sectionShape = createSimpleSectionShape(HEIGHT);
        const geometry = new ExtrudeGeometry(sectionShape, extrudeSettings);
        const section = new Mesh(geometry, greyMaterial);

        section.position.set(i * SECTION_SPACING + 5, HEIGHT / 20, DEPTH);
        section.rotation.y = Math.PI / 2;
        radiator.add(section);
    }

    // Упрощенные трубы
    const totalWidth = sectionCount * SECTION_SPACING + 5;

    // Нижняя труба
    const bottomPipeGeometry = new CylinderGeometry(DEPTH / 12, DEPTH / 12, totalWidth, 8);
    const bottomPipe = new Mesh(bottomPipeGeometry, greyMaterial);
    bottomPipe.rotation.x = Math.PI / 2;
    bottomPipe.rotation.z = Math.PI / 2;
    bottomPipe.position.set(totalWidth / 2, 10, DEPTH / 2);
    radiator.add(bottomPipe);

    // Верхняя труба
    const topPipeGeometry = new CylinderGeometry(DEPTH / 12, DEPTH / 12, totalWidth, 8);
    const topPipe = new Mesh(topPipeGeometry, greyMaterial);
    topPipe.rotation.x = Math.PI / 2;
    topPipe.rotation.z = Math.PI / 2;
    topPipe.position.set(totalWidth / 2, HEIGHT, DEPTH / 2);
    radiator.add(topPipe);

    return radiator;
};
