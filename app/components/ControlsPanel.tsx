'use client';

import { useState } from 'react';
import { Room, Furniture } from '@/types';
import { MODELS } from '@/utils/modelManager';
import { AccordionItem } from './Accordion';
import { Search, Ruler, Package, Settings } from 'lucide-react';
import Image from 'next/image';

interface ControlsPanelProps {
  room: Room;
  selectedFurniture: string | null;
  selectedItem: Furniture | undefined;
  onAddFurniture: (type: 'cube' | 'rectangular' | 'model', modelType?: string) => void;
  onUpdateFurniture: (id: string, updates: Partial<Furniture>) => void;
  onDeleteFurniture: (id: string) => void;
  onUpdateRoomDimensions: (dimension: 'width' | 'depth' | 'height', value: number) => void;
}

const MODEL_IMAGES: Record<string, string> = {
  conditioner: '/furniture-preview/air-conditioner.png',
  chair: '/furniture-preview/chair.png',
  modernRadiator: '/furniture-preview/modern-radiator.png',
  oldRadiator: '/furniture-preview/old-radiator.png',
  blackboard: '/furniture-preview/blackboard.png'
};

export default function ControlsPanel({
  room,
  selectedItem,
  onAddFurniture,
  onUpdateFurniture,
  onDeleteFurniture,
  onUpdateRoomDimensions
}: ControlsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModels = Object.entries(MODELS).filter(([key, config]) =>
    config.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white h-full overflow-y-auto border-r border-gray-200 shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Planner</h2>
            <p className="text-sm text-gray-500">Попробуй мебель!</p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Настройка комнаты */}
          <AccordionItem title="Настройка комнаты" defaultOpen>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Ruler className="w-4 h-4" />
                <span className="text-sm font-medium">Размеры (см)</span>
              </div>
              {(['width', 'depth', 'height'] as const).map(dim => (
                <div key={dim} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-600">
                      {dim === 'width' && 'Ширина'}
                      {dim === 'depth' && 'Глубина'}
                      {dim === 'height' && 'Высота'}
                    </label>
                    <span className="text-sm font-semibold text-blue-600">{room[dim]} см</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="10"
                    value={room[dim]}
                    onChange={(e) => onUpdateRoomDimensions(dim, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Каталог моделей */}
          <AccordionItem title="Каталог моделей">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск моделей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Доступные модели</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {filteredModels.map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => onAddFurniture('model', key)}
                    className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                  >
                    <div className="aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={MODEL_IMAGES[key]}
                        alt={config.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 block truncate">
                      {config.name}
                    </span>
                    <span className="text-xs text-gray-500 block mt-1">
                      {config.width}×{config.depth}×{config.height} см
                    </span>
                  </button>
                ))}
              </div>

              {filteredModels.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Ничего не найдено
                </div>
              )}
            </div>
          </AccordionItem>

          {/* Редактирование элемента */}
          {selectedItem && (
            <AccordionItem title="Редактирование элемента" defaultOpen>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedItem.type === 'model' && MODEL_IMAGES[selectedItem.modelType!] && (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={MODEL_IMAGES[selectedItem.modelType!]}
                          alt={selectedItem.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedItem.name}</h4>
                    </div>
                  </div>
                  {selectedItem.type === 'model' && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      3D Модель
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Название
                    </label>
                    <input
                      type="text"
                      value={selectedItem.name}
                      onChange={(e) => onUpdateFurniture(selectedItem.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Цвет
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={selectedItem.color}
                        onChange={(e) => onUpdateFurniture(selectedItem.id, { color: e.target.value })}
                        className="w-10 h-10 cursor-pointer rounded-lg border border-gray-300"
                      />
                      <span className="text-xs text-gray-500">
                        {selectedItem.type === 'model' ? 'Цвет модели' : 'Цвет объекта'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Поворот: {selectedItem.rotation}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedItem.rotation}
                      onChange={(e) => onUpdateFurniture(selectedItem.id, { rotation: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Размеры (см)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['x', 'y', 'z'] as const).map(axis => (
                        <div key={axis}>
                          <div className="text-xs text-gray-500 mb-1">
                            {axis === 'x' && 'Ширина'}
                            {axis === 'y' && 'Высота'}
                            {axis === 'z' && 'Глубина'}
                          </div>
                          <input
                            type="number"
                            min="10"
                            max={axis === 'x' ? room.width : axis === 'z' ? room.depth : room.height}
                            value={selectedItem.dimensions[axis]}
                            onChange={(e) => {
                              const newDimensions = { ...selectedItem.dimensions };
                              newDimensions[axis] = parseInt(e.target.value) || 10;
                              onUpdateFurniture(selectedItem.id, { dimensions: newDimensions });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Позиция (см)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['x', 'y', 'z'] as const).map(axis => (
                        <div key={axis}>
                          <div className="text-xs text-gray-500 mb-1">
                            {axis.toUpperCase()}
                          </div>
                          <input
                            type="number"
                            min="0"
                            max={axis === 'x' ? room.width : axis === 'z' ? room.depth : room.height}
                            value={selectedItem.position[axis]}
                            onChange={(e) => {
                              const newPosition = { ...selectedItem.position };
                              newPosition[axis] = parseInt(e.target.value) || 0;
                              onUpdateFurniture(selectedItem.id, { position: newPosition });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteFurniture(selectedItem.id)}
                    className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Удалить {selectedItem.type === 'model' ? 'модель' : 'объект'}
                  </button>
                </div>
              </div>
            </AccordionItem>
          )}
        </div>
      </div>
    </div>
  );
}
