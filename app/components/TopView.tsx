'use client';

import { Room } from '@/types';

interface TopViewProps {
  room: Room;
  selectedFurniture: string | null;
  onSelectFurniture: (id: string | null) => void;
}

export default function TopView({ room, selectedFurniture, onSelectFurniture }: TopViewProps) {
  const scale = 0.8;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isFurniture = target.closest('[data-furniture]') !== null;
    const isLegend = target.closest('[data-legend]') !== null;

    if (!isFurniture && !isLegend) {
      onSelectFurniture(null);
    }
  };

  return (
    <div
      className="relative w-full h-full bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="relative">
        <div
          className="relative border-2 border-gray-800 bg-gradient-to-b from-gray-100 to-gray-200"
          style={{
            width: `${room.width * scale}px`,
            height: `${room.depth * scale}px`,
          }}
        >
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: Math.floor(room.width / 100) }).map((_, i) => (
              <div
                key={`x-${i}`}
                className="absolute w-px bg-gray-400 h-full"
                style={{ left: `${(i + 1) * 100 * scale}px` }}
              />
            ))}
            {Array.from({ length: Math.floor(room.depth / 100) }).map((_, i) => (
              <div
                key={`z-${i}`}
                className="absolute h-px bg-gray-400 w-full"
                style={{ top: `${(i + 1) * 100 * scale}px` }}
              />
            ))}
          </div>

          {room.furniture.map(furniture => {
            const isSelected = selectedFurniture === furniture.id;

            return (
              <div
                key={furniture.id}
                data-furniture="true"
                className={`absolute cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-red-500 ring-offset-2 z-10' : ''
                  }`}
                style={{
                  left: `${furniture.position.x * scale}px`,
                  top: `${furniture.position.z * scale}px`,
                  width: `${furniture.dimensions.x * scale}px`,
                  height: `${furniture.dimensions.z * scale}px`,
                  transform: `rotate(${furniture.rotation}deg)`,
                  transformOrigin: 'center',
                  backgroundColor: furniture.color,
                  opacity: isSelected ? 0.9 : 0.8,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFurniture(furniture.id);
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    {furniture.name}
                  </span>
                </div>

                <div className="absolute -top-6 left-0 text-xs text-gray-700 whitespace-nowrap">
                  {Math.round(furniture.dimensions.x)}×{Math.round(furniture.dimensions.z)} см
                </div>
              </div>
            );
          })}

          <div className="absolute -bottom-8 left-0 text-sm text-gray-600">
            ← {room.width} см →
          </div>
          <div className="absolute -right-8 top-0 text-sm text-gray-600 transform -rotate-90 origin-center">
            ↑ {room.depth} см ↓
          </div>
        </div>
      </div>
    </div>
  );
}