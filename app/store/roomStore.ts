import { create } from 'zustand';
import { Room, Furniture } from '@/types';

interface RoomStore {
    room: Room;
    selectedFurniture: string | null;

    setRoom: (room: Room) => void;
    updateRoomDimensions: (dimensions: Partial<Pick<Room, 'width' | 'depth' | 'height'>>) => void;
    addFurniture: (furniture: Furniture) => void;
    updateFurniture: (id: string, updates: Partial<Furniture>) => void;
    deleteFurniture: (id: string) => void;
    setSelectedFurniture: (id: string | null) => void;
    resetRoom: () => void;
}

const INITIAL_ROOM: Room = {
    width: 800,
    depth: 600,
    height: 280,
    furniture: [
        {
            id: '1',
            name: 'Диван',
            type: 'rectangular',
            position: { x: 100, y: 0, z: 100 },
            dimensions: { x: 200, y: 80, z: 80 },
            color: '#8B4513',
            rotation: 45
        },
        {
            id: '2',
            name: 'Стол',
            type: 'cube',
            position: { x: 400, y: 0, z: 300 },
            dimensions: { x: 100, y: 75, z: 100 },
            color: '#D2691E',
            rotation: 0
        },
        {
            id: '3',
            name: 'Кондиционер',
            type: 'model',
            modelType: 'conditioner',
            position: { x: 650, y: 180, z: 50 },
            dimensions: { x: 90, y: 30, z: 40 },
            color: '#D3D3D3',
            rotation: 0
        },
        {
            id: '4',
            name: 'Стул',
            type: 'model',
            modelType: 'chair',
            position: { x: 350, y: 0, z: 400 },
            dimensions: { x: 55, y: 50, z: 55 },
            color: '#9B8C75',
            rotation: 180
        }
    ]
};

export const useRoomStore = create<RoomStore>((set) => ({
    room: INITIAL_ROOM,
    selectedFurniture: null,

    setRoom: (room) => set({ room }),

    updateRoomDimensions: (dimensions) =>
        set((state) => ({
            room: { ...state.room, ...dimensions }
        })),

    addFurniture: (furniture) =>
        set((state) => ({
            room: {
                ...state.room,
                furniture: [...state.room.furniture, furniture]
            }
        })),

    updateFurniture: (id, updates) =>
        set((state) => ({
            room: {
                ...state.room,
                furniture: state.room.furniture.map(item =>
                    item.id === id ? { ...item, ...updates } : item
                )
            }
        })),

    deleteFurniture: (id) =>
        set((state) => ({
            room: {
                ...state.room,
                furniture: state.room.furniture.filter(item => item.id !== id)
            },
            selectedFurniture: state.selectedFurniture === id ? null : state.selectedFurniture
        })),

    setSelectedFurniture: (id) => set({ selectedFurniture: id }),

    resetRoom: () => set({ room: INITIAL_ROOM, selectedFurniture: null })
}));
