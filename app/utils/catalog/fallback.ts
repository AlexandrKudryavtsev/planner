import { Furniture } from "@/types";
import { Mesh, BoxGeometry, MeshLambertMaterial, } from 'three';

/**
 *  Модель для fallback
 */
export const createFallbackModel = (furniture: Furniture, isSelected: boolean): Mesh => {
    const geometry = new BoxGeometry(
        furniture.dimensions.x,
        furniture.dimensions.y,
        furniture.dimensions.z
    );

    const material = new MeshLambertMaterial({
        color: isSelected ? 0xff0000 : parseInt(furniture.color.replace('#', '0x')),
        transparent: true,
        opacity: isSelected ? 0.8 : 0.9
    });

    const mesh = new Mesh(geometry, material);
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
