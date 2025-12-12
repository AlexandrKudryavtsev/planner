export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Furniture {
    id: string;
    name: string;
    type: 'cube' | 'rectangular';
    position: Vector3;
    dimensions: Vector3; // width, height, depth
    color: string;
    rotation: number; // в градусах
}

export interface Room {
    width: number;
    depth: number;
    height: number;
    furniture: Furniture[];
}

export type ViewMode = '3d' | 'top';