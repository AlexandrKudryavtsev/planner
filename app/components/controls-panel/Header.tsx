import { ViewMode } from "@/types";
import { Grid3x3, HousePlug, Maximize2, Minimize2 } from "lucide-react";

interface HeaderProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

export function Header({ viewMode, onViewModeChange, isFullscreen, onToggleFullscreen }: HeaderProps) {
    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <HousePlug className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Симулятор</h2>
                    <p className="text-sm text-gray-500">Расставь мебель, как у себя дома!</p>
                </div>
            </div>

            <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

            <FullscreenButton
                isFullscreen={isFullscreen}
                onToggleFullscreen={onToggleFullscreen}
            />
        </div>
    );
}

function ViewModeToggle({ viewMode, onViewModeChange }: Pick<HeaderProps, 'viewMode' | 'onViewModeChange'>) {
    return (
        <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
                onClick={() => onViewModeChange('3d')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === '3d' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                3D Вид
            </button>
            <button
                onClick={() => onViewModeChange('top')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'top' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
            >
                <Grid3x3 className="w-4 h-4" />
                Вид сверху
            </button>
        </div>
    );
}

function FullscreenButton({ isFullscreen, onToggleFullscreen }: Pick<HeaderProps, 'isFullscreen' | 'onToggleFullscreen'>) {
    return (
        <button
            onClick={onToggleFullscreen}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
        >
            {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-gray-600" />
            ) : (
                <Maximize2 className="w-4 h-4 text-gray-600" />
            )}
            <span className="text-sm text-gray-700">
                {isFullscreen ? 'Выйти из полноэкрана' : 'Полноэкранный режим'}
            </span>
        </button>
    );
}
