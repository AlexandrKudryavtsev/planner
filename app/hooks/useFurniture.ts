import { useCallback } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Furniture } from '@/types';

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

    const handleAddFurniture = useCallback((type: 'cube' | 'rectangular') => {
        const newFurniture: Furniture = {
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

        addFurniture(newFurniture);
        setSelectedFurniture(newFurniture.id);
    }, [room.furniture.length, addFurniture, setSelectedFurniture]);

    const handleUpdateFurniture = useCallback((id: string, updates: Partial<Furniture>) => {
        updateFurniture(id, updates);
    }, [updateFurniture]);

    const handleDeleteFurniture = useCallback((id: string) => {
        deleteFurniture(id);
    }, [deleteFurniture]);

    return {
        room,
        selectedFurniture,
        selectedItem,
        handleAddFurniture,
        handleUpdateFurniture,
        handleDeleteFurniture,
        setSelectedFurniture
    };
};