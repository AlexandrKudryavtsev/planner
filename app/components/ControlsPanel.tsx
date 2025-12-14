'use client';

import { useState, useCallback } from 'react';
import { Room, Furniture, ViewMode } from '@/types';
import { Header } from './controls-panel/Header';
import { RoomSettings } from './controls-panel/RoomSettings';
import { ModelCatalog } from './controls-panel/ModelCatalog';
import { FurnitureEditor } from './controls-panel/FurnitureEditor';

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

  return (
    <div className="bg-white h-full overflow-y-auto border-r border-gray-200 shadow-lg">
      <Header
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      <div className="space-y-2">
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
    </div>
  );
}
