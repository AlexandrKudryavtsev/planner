'use client';

import { useState } from 'react';
import Room3D from '@/components/Room3D';
import TopView from '@/components/TopView';
import ControlsPanel from '@/components/ControlsPanel';
import { ViewMode } from '@/types';
import { useFurniture } from '@/hooks/useFurniture';
import { useRoom } from '@/hooks/useRoom';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');

  const {
    room,
    selectedFurniture,
    selectedItem,
    handleAddFurniture,
    handleUpdateFurniture,
    handleDeleteFurniture,
    setSelectedFurniture
  } = useFurniture();
  const { handleUpdateRoomDimensions } = useRoom();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-screen">
        <div className="w-100 flex-shrink-0">
          <ControlsPanel
            room={room}
            selectedFurniture={selectedFurniture}
            selectedItem={selectedItem}
            onAddFurniture={handleAddFurniture}
            onUpdateFurniture={handleUpdateFurniture}
            onDeleteFurniture={handleDeleteFurniture}
            onUpdateRoomDimensions={handleUpdateRoomDimensions}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        <div className="flex-1 bg-white overflow-hidden">
          {viewMode === '3d' ? (
            <Room3D
              room={room}
              selectedFurniture={selectedFurniture}
              onSelectFurniture={setSelectedFurniture}
            />
          ) : (
            <TopView
              room={room}
              selectedFurniture={selectedFurniture}
              onSelectFurniture={setSelectedFurniture}
            />
          )}
        </div>
      </div>
    </div>
  );
}
