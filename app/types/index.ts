export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export type FurnitureType = 'cube' | 'rectangular' | 'model';

export interface Furniture {
    id: string;
    name: string;
    type: FurnitureType;
    position: Vector3;
    dimensions: Vector3;
    color: string;
    rotation: number; // в градусах
    modelType?: string; // 'conditioner', 'chair', etc.
}

export interface Room {
    width: number;
    depth: number;
    height: number;
    furniture: Furniture[];
}

export type ViewMode = '3d' | 'top';

export interface OrderItem {
    id: string;
    name: string;
    type: FurnitureType;
    modelType?: string;
    price?: number;
    dimensions: Vector3;
}

export interface OrderRequest {
    name: string;
    phone: string;
    items: OrderItem[];
    totalPrice: number;
}
