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
    furniture: []
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
