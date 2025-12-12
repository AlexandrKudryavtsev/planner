'use client';

import { useState } from 'react';
import Room3D from './components/Room3D';
import TopView from './components/TopView';
import ControlsPanel from './components/ControlsPanel';
import { Furniture, Room, ViewMode } from './types';

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
      name: 'Шкаф',
      type: 'rectangular',
      position: { x: 600, y: 0, z: 50 },
      dimensions: { x: 60, y: 200, z: 120 },
      color: '#696969',
      rotation: 90
    }
  ]
};

export default function Home() {
  const [room, setRoom] = useState<Room>(INITIAL_ROOM);
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);

  const handleAddFurniture = (type: 'cube' | 'rectangular') => {
    const newFurniture: Furniture = {
      id: Date.now().toString(),
      name: `${type === 'cube' ? 'Куб' : 'Параллелепипед'} ${room.furniture.length + 1}`,
      type,
      position: { x: 100, y: 0, z: 100 },
      dimensions: type === 'cube'
        ? { x: 80, y: 80, z: 80 }
        : { x: 120, y: 60, z: 80 },
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      rotation: 0
    };

    setRoom(prev => ({
      ...prev,
      furniture: [...prev.furniture, newFurniture]
    }));
    setSelectedFurniture(newFurniture.id);
  };

  const handleUpdateFurniture = (id: string, updates: Partial<Furniture>) => {
    setRoom(prev => ({
      ...prev,
      furniture: prev.furniture.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const handleDeleteFurniture = (id: string) => {
    setRoom(prev => ({
      ...prev,
      furniture: prev.furniture.filter(item => item.id !== id)
    }));
    if (selectedFurniture === id) {
      setSelectedFurniture(null);
    }
  };

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
            onAddFurniture={handleAddFurniture}
            onUpdateFurniture={handleUpdateFurniture}
            onDeleteFurniture={handleDeleteFurniture}
            setRoom={setRoom}
          />
        </div>
      </div>
    </div>
  );
}
