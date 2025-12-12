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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Планировщик мебели</h1>
        <p className="text-gray-600 mt-2">Расставляйте мебель в 3D комнате</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-4 py-2 rounded-lg ${viewMode === '3d' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  3D Вид
                </button>
                <button
                  onClick={() => setViewMode('top')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'top' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                >
                  Вид сверху
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Комната: {room.width}×{room.depth}×{room.height} см
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg h-[600px] overflow-hidden">
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

        <div className="lg:w-1/4">
          <ControlsPanel
            room={room}
            selectedFurniture={selectedFurniture}
            selectedItem={selectedItem}
            onAddFurniture={handleAddFurniture}
            onUpdateFurniture={handleUpdateFurniture}
            onDeleteFurniture={handleDeleteFurniture}
            onUpdateRoomDimensions={handleUpdateRoomDimensions}
          />
        </div>
      </div>
    </div>
  );
}
