import { Room } from "@/types";
import { Ruler } from "lucide-react";
import { AccordionItem } from "../Accordion";

interface RoomSettingsProps {
    room: Room;
    onUpdateRoomDimensions: (dimension: 'width' | 'depth' | 'height', value: number) => void;
}

export function RoomSettings({ room, onUpdateRoomDimensions }: RoomSettingsProps) {
    return (
        <AccordionItem title="Настройка комнаты" defaultOpen>
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Ruler className="w-4 h-4" />
                    <span className="text-sm font-medium">Размеры (см)</span>
                </div>
                {(['width', 'depth', 'height'] as const).map(dim => (
                    <DimensionSlider
                        key={dim}
                        dimension={dim}
                        value={room[dim]}
                        onChange={(value) => onUpdateRoomDimensions(dim, value)}
                    />
                ))}
            </div>
        </AccordionItem>
    );
}

interface DimensionSliderProps {
    dimension: 'width' | 'depth' | 'height';
    value: number;
    onChange: (value: number) => void;
}

function DimensionSlider({ dimension, value, onChange }: DimensionSliderProps) {
    const labels = {
        width: 'Ширина',
        depth: 'Глубина',
        height: 'Высота'
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm text-gray-600">{labels[dimension]}</label>
                <span className="text-sm font-semibold text-blue-600">{value} см</span>
            </div>
            <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
        </div>
    );
}
