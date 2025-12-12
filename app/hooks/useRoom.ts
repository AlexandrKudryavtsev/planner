import { useRoomStore } from '@/store/roomStore';

export const useRoom = () => {
    const { room, updateRoomDimensions, setRoom, resetRoom } = useRoomStore();

    const handleUpdateRoomDimensions = (
        dimension: 'width' | 'depth' | 'height',
        value: number
    ) => {
        updateRoomDimensions({ [dimension]: value });
    };

    return {
        room,
        handleUpdateRoomDimensions,
        setRoom,
        resetRoom
    };
};