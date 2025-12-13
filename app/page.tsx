'use client';

import { useState } from 'react';
import Room3D from '@/components/Room3D';
import TopView from '@/components/TopView';
import ControlsPanel from '@/components/ControlsPanel';
import { ViewMode } from '@/types';
import { useFurniture } from '@/hooks/useFurniture';
import { useRoom } from '@/hooks/useRoom';
import { Maximize2, Minimize2, Grid3x3 } from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-screen">
        <div className="w-80 flex-shrink-0">
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

        <div className="flex-1 flex flex-col p-6">
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === '3d' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    3D Вид
                  </button>
                  <button
                    onClick={() => setViewMode('top')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'top' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    Вид сверху
                  </button>
                </div>
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
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
    </div>
  );
}
