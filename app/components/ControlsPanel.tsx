'use client';

import { Room, Furniture } from '@/types';

interface ControlsPanelProps {
  room: Room;
  selectedFurniture: string | null;
  selectedItem: Furniture | undefined;
  onAddFurniture: (type: 'cube' | 'rectangular') => void;
  onUpdateFurniture: (id: string, updates: Partial<Furniture>) => void;
  onDeleteFurniture: (id: string) => void;
  onUpdateRoomDimensions: (dimension: 'width' | 'depth' | 'height', value: number) => void;
}

export default function ControlsPanel({
  room,
  selectedItem,
  onAddFurniture,
  onUpdateFurniture,
  onDeleteFurniture,
  onUpdateRoomDimensions
}: ControlsPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Управление</h2>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Размеры комнаты (см)</h3>
          {(['width', 'depth', 'height'] as const).map(dim => (
            <div key={dim} className="space-y-1">
              <label className="block text-sm text-gray-600">
                {dim === 'width' && 'Ширина'}
                {dim === 'depth' && 'Глубина'}
                {dim === 'height' && 'Высота'}
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={room[dim]}
                onChange={(e) => onUpdateRoomDimensions(dim, parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>100</span>
                <span className="font-medium">{room[dim]} см</span>
                <span>1000</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-3">Добавить мебель</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => onAddFurniture('cube')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Куб
            </button>
            <button
              onClick={() => onAddFurniture('rectangular')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Параллелепипед
            </button>
          </div>
        </div>

        {selectedItem && (
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold text-gray-700">Редактирование: {selectedItem.name}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Название</label>
                <input
                  type="text"
                  value={selectedItem.name}
                  onChange={(e) => onUpdateFurniture(selectedItem.id, { name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Цвет</label>
                <input
                  type="color"
                  value={selectedItem.color}
                  onChange={(e) => onUpdateFurniture(selectedItem.id, { color: e.target.value })}
                  className="w-full h-10"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Поворот (°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedItem.rotation}
                  onChange={(e) => onUpdateFurniture(selectedItem.id, { rotation: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm">{selectedItem.rotation}°</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['x', 'y', 'z'] as const).map(axis => (
                  <div key={axis}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {axis === 'x' && 'Ширина'}
                      {axis === 'y' && 'Высота'}
                      {axis === 'z' && 'Глубина'}
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={selectedItem.dimensions[axis]}
                      onChange={(e) => {
                        const newDimensions = { ...selectedItem.dimensions };
                        newDimensions[axis] = parseInt(e.target.value) || 10;
                        onUpdateFurniture(selectedItem.id, { dimensions: newDimensions });
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['x', 'y', 'z'] as const).map(axis => (
                  <div key={axis}>
                    <label className="block text-sm text-gray-600 mb-1">
                      Позиция {axis.toUpperCase()}
                    </label>
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
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => onDeleteFurniture(selectedItem.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Статистика</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Всего объектов: {room.furniture.length}</div>
            <div>Выбрано: {selectedItem ? selectedItem.name : 'нет'}</div>
            <div className="text-xs text-gray-500 mt-2">
              Используйте мышь для вращения в 3D виде
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
