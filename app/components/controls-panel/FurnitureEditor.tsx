import { Furniture, Room } from "@/types";
import { AccordionItem } from "../Accordion";
import { MODEL_IMAGES } from "@/utils/modelManager";
import Image from "next/image";

interface FurnitureEditorProps {
    item: Furniture;
    room: Room;
    onUpdate: (updates: Partial<Furniture>) => void;
    onDelete: () => void;
}

export function FurnitureEditor({ item, room, onUpdate, onDelete }: FurnitureEditorProps) {
    return (
        <AccordionItem title="Редактирование элемента" defaultOpen>
            <div className="space-y-4">
                <FurnitureHeader item={item} />

                <div className="space-y-3">
                    <NameInput
                        value={item.name}
                        onChange={(name) => onUpdate({ name })}
                    />

                    <ColorPicker
                        value={item.color}
                        onChange={(color) => onUpdate({ color })}
                        label={item.type === 'model' ? 'Цвет модели' : 'Цвет объекта'}
                    />

                    <RotationSlider
                        value={item.rotation}
                        onChange={(rotation) => onUpdate({ rotation })}
                    />

                    <DimensionsInputs
                        dimensions={item.dimensions}
                        limits={{
                            x: room.width,
                            y: room.height,
                            z: room.depth
                        }}
                        onChange={(dimensions) => onUpdate({ dimensions })}
                    />

                    <PositionInputs
                        position={item.position}
                        limits={{
                            x: room.width,
                            y: room.height,
                            z: room.depth
                        }}
                        onChange={(position) => onUpdate({ position })}
                    />

                    <DeleteButton
                        onClick={onDelete}
                        label={item.type === 'model' ? 'модель' : 'объект'}
                    />
                </div>
            </div>
        </AccordionItem>
    );
}

function FurnitureHeader({ item }: { item: Furniture }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {item.type === 'model' && MODEL_IMAGES[item.modelType!] && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                            src={MODEL_IMAGES[item.modelType!]}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                </div>
            </div>
        </div>
    );
}

function NameInput({ value, onChange }: { value: string; onChange: (name: string) => void }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
                Название
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
}

function ColorPicker({ value, onChange, label }: {
    value: string;
    onChange: (color: string) => void;
    label: string;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
                Цвет
            </label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 cursor-pointer rounded-lg border border-gray-300"
                />
                <span className="text-xs text-gray-500">{label}</span>
            </div>
        </div>
    );
}

function RotationSlider({ value, onChange }: {
    value: number;
    onChange: (rotation: number) => void;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
                Поворот: {value}°
            </label>
            <input
                type="range"
                min="0"
                max="360"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
        </div>
    );
}

function DimensionsInputs({ dimensions, limits, onChange }: {
    dimensions: { x: number; y: number; z: number };
    limits: { x: number; y: number; z: number };
    onChange: (dimensions: { x: number; y: number; z: number }) => void;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
                Размеры (см)
            </label>
            <div className="grid grid-cols-3 gap-2">
                {(['x', 'y', 'z'] as const).map(axis => (
                    <DimensionInput
                        key={axis}
                        axis={axis}
                        value={dimensions[axis]}
                        max={limits[axis]}
                        onChange={(value) => {
                            const newDimensions = { ...dimensions };
                            newDimensions[axis] = value;
                            onChange(newDimensions);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function PositionInputs({ position, limits, onChange }: {
    position: { x: number; y: number; z: number };
    limits: { x: number; y: number; z: number };
    onChange: (position: { x: number; y: number; z: number }) => void;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
                Позиция (см)
            </label>
            <div className="grid grid-cols-3 gap-2">
                {(['x', 'y', 'z'] as const).map(axis => (
                    <PositionInput
                        key={axis}
                        axis={axis}
                        value={position[axis]}
                        max={limits[axis]}
                        onChange={(value) => {
                            const newPosition = { ...position };
                            newPosition[axis] = value;
                            onChange(newPosition);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function DimensionInput({ axis, value, max, onChange }: {
    axis: 'x' | 'y' | 'z';
    value: number;
    max: number;
    onChange: (value: number) => void;
}) {
    const labels = {
        x: 'Ширина',
        y: 'Высота',
        z: 'Глубина'
    };

    return (
        <div>
            <div className="text-xs text-gray-500 mb-1">{labels[axis]}</div>
            <input
                type="number"
                min="10"
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 10)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center"
            />
        </div>
    );
}

function PositionInput({ axis, value, max, onChange }: {
    axis: 'x' | 'y' | 'z';
    value: number;
    max: number;
    onChange: (value: number) => void;
}) {
    return (
        <div>
            <div className="text-xs text-gray-500 mb-1">{axis.toUpperCase()}</div>
            <input
                type="number"
                min="0"
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center"
            />
        </div>
    );
}

function DeleteButton({ onClick, label }: {
    onClick: () => void;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
        >
            Удалить {label}
        </button>
    );
}
