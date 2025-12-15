'use client';

import { useState, useCallback, useEffect } from 'react';
import { Room, Furniture, ViewMode } from '@/types';
import { Header } from './controls-panel/Header';
import { RoomSettings } from './controls-panel/RoomSettings';
import { ModelCatalog } from './controls-panel/ModelCatalog';
import { FurnitureEditor } from './controls-panel/FurnitureEditor';
import { OrderModal } from './controls-panel/OrderModal';

interface ControlsPanelProps {
  room: Room;
  selectedFurniture: string | null;
  selectedItem: Furniture | undefined;
  onAddFurniture: (type: 'cube' | 'rectangular' | 'model', modelType?: string) => void;
  onUpdateFurniture: (id: string, updates: Partial<Furniture>) => void;
  onDeleteFurniture: (id: string) => void;
  onUpdateRoomDimensions: (dimension: 'width' | 'depth' | 'height', value: number) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ControlsPanel({
  room,
  selectedItem,
  onAddFurniture,
  onUpdateFurniture,
  onDeleteFurniture,
  onUpdateRoomDimensions,
  viewMode,
  onViewModeChange
}: ControlsPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModelCatalogOpen, setIsModelCatalogOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; phone: string } | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('planner_user');
    if (storedUserData) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleUpdateFurniture = useCallback((updates: Partial<Furniture>) => {
    if (selectedItem) {
      onUpdateFurniture(selectedItem.id, updates);
    }
  }, [selectedItem, onUpdateFurniture]);

  const handleDeleteFurniture = useCallback(() => {
    if (selectedItem) {
      onDeleteFurniture(selectedItem.id);
    }
  }, [selectedItem, onDeleteFurniture]);

  const handleAddFurniture = useCallback((type: 'cube' | 'rectangular' | 'model', modelType?: string) => {
    onAddFurniture(type, modelType);
    setIsModelCatalogOpen(false);
  }, [onAddFurniture]);

  const handleOrderSubmit = useCallback(() => {
    console.log('Order submitted:', {
      user: userData,
      items: room.furniture,
      totalItems: room.furniture.length
    });
  }, [userData, room.furniture]);

  return (
    <>
      <div className="bg-white h-full overflow-y-auto border-r border-gray-200 shadow-lg flex flex-col">
        <Header
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {selectedItem && (
            <FurnitureEditor
              item={selectedItem}
              room={room}
              onUpdate={handleUpdateFurniture}
              onDelete={handleDeleteFurniture}
            />
          )}
          <ModelCatalog
            onAddFurniture={handleAddFurniture}
            isOpen={isModelCatalogOpen}
            onToggle={() => setIsModelCatalogOpen(!isModelCatalogOpen)}
          />
          <RoomSettings
            room={room}
            onUpdateRoomDimensions={onUpdateRoomDimensions}
          />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            disabled={room.furniture.length === 0}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Заказать
          </button>
        </div>
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        furnitureItems={room.furniture}
        userPhone={userData?.phone || ''}
        onSubmit={handleOrderSubmit}
      />
    </>
  );
}
