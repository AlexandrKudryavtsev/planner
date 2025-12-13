import { MODEL_IMAGES, MODELS } from "@/utils/modelManager";
import Image from "next/image";
import { useState } from "react";
import { AccordionItem } from "../Accordion";
import { Search } from "lucide-react";

interface ModelCatalogProps {
    onAddFurniture: (type: 'cube' | 'rectangular' | 'model', modelType?: string) => void;
}

export function ModelCatalog({ onAddFurniture }: ModelCatalogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredModels = Object.entries(MODELS).filter(([_, config]) =>
        config.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AccordionItem title="Каталог моделей">
            <div className="space-y-4">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Поиск моделей..."
                />

                <ModelGrid models={filteredModels} onSelect={onAddFurniture} />
            </div>
        </AccordionItem>
    );
}

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
}

interface ModelGridProps {
    models: [string, typeof MODELS[keyof typeof MODELS]][];
    onSelect: (type: 'cube' | 'rectangular' | 'model', modelType?: string) => void;
}

function ModelGrid({ models, onSelect }: ModelGridProps) {
    if (models.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 text-sm">
                Ничего не найдено
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {models.map(([key, config]) => (
                <ModelCard
                    key={key}
                    id={key}
                    config={config}
                    onSelect={() => onSelect('model', key)}
                />
            ))}
        </div>
    );
}

interface ModelCardProps {
    id: string;
    config: typeof MODELS[keyof typeof MODELS];
    onSelect: () => void;
}

function ModelCard({ id, config, onSelect }: ModelCardProps) {
    return (
        <button
            onClick={onSelect}
            className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
        >
            <div className="aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden">
                <Image
                    src={MODEL_IMAGES[id]}
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
    );
}
