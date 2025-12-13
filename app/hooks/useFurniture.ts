import { useCallback } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Furniture, FurnitureType } from '@/types';
import { MODELS } from '@/utils/modelManager';

export const useFurniture = () => {
    const {
        room,
        selectedFurniture,
        addFurniture,
        updateFurniture,
        deleteFurniture,
        setSelectedFurniture
    } = useRoomStore();

    const selectedItem = room.furniture.find(f => f.id === selectedFurniture);

    const handleAddFurniture = useCallback((type: FurnitureType, modelType?: string) => {
        let newFurniture: Furniture;
        
        if (type === 'model' && modelType) {
            const config = MODELS[modelType];
            if (!config) {
                console.error(`Model ${modelType} not found`);
                return;
            }
            
            newFurniture = {
                id: Date.now().toString(),
                name: config.name,
                type: 'model',
                modelType: modelType,
                position: { x: 100, y: 0, z: 100 },
                dimensions: { 
                    x: config.width, 
                    y: config.height, 
                    z: config.depth 
                },
                color: '#FFFFFF',
                rotation: 0
            };
        } else {
            newFurniture = {
                id: Date.now().toString(),
                name: `${type === 'cube' ? 'Куб' : 'Параллелепипед'} ${room.furniture.length + 1}`,
                type,
                position: { x: 100, y: 0, z: 100 },
                dimensions: type === 'cube'
                    ? { x: 80, y: 80, z: 80 }
                    : { x: 120, y: 60, z: 80 },
                color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
                rotation: 0
            };
        }

        addFurniture(newFurniture);
        setSelectedFurniture(newFurniture.id);
    }, [room.furniture.length, addFurniture, setSelectedFurniture]);

    const handleUpdateFurniture = useCallback((id: string, updates: Partial<Furniture>) => {
        updateFurniture(id, updates);
    }, [updateFurniture]);

    const handleDeleteFurniture = useCallback((id: string) => {
        deleteFurniture(id);
    }, [deleteFurniture]);

    const handleAddModel = useCallback((modelType: string) => {
        handleAddFurniture('model', modelType);
    }, [handleAddFurniture]);

    const handleAddCube = useCallback(() => {
        handleAddFurniture('cube');
    }, [handleAddFurniture]);

    const handleAddRectangular = useCallback(() => {
        handleAddFurniture('rectangular');
    }, [handleAddFurniture]);

    return {
        room,
        selectedFurniture,
        selectedItem,
        handleAddFurniture,
        handleUpdateFurniture,
        handleDeleteFurniture,
        setSelectedFurniture,
        handleAddModel,
        handleAddCube,
        handleAddRectangular
    };
};
