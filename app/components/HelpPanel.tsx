'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface HelpPanelProps {
    viewMode: '3d' | 'top';
}

export function HelpPanel({ viewMode }: HelpPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeCategory, setActiveCategory] = useState<'basics' | 'controls' | 'editing'>('basics');

    if (isCollapsed) {
        return (
            <div className="absolute top-4 right-4 z-20">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="bg-white rounded-l-lg shadow-lg p-3 hover:bg-gray-50 transition-colors flex items-center gap-2 border border-r-0 border-gray-200"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                </button>
            </div>
        );
    }

    return (
        <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-xl border border-gray-200 w-80">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Помощь</h3>
                </div>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Свернуть"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="p-4">
                <div className="flex gap-2 mb-4">
                    <TabButton
                        isActive={activeCategory === 'basics'}
                        onClick={() => setActiveCategory('basics')}
                    >
                        Основы
                    </TabButton>
                    <TabButton
                        isActive={activeCategory === 'editing'}
                        onClick={() => setActiveCategory('editing')}
                    >
                        Мебель
                    </TabButton>
                    <TabButton
                        isActive={activeCategory === 'controls'}
                        onClick={() => setActiveCategory('controls')}
                    >
                        Управление
                    </TabButton>
                </div>

                <div className="space-y-4">
                    {activeCategory === 'basics' && <BasicsHelp />}
                    {activeCategory === 'editing' && <EditingHelp />}
                    {activeCategory === 'controls' && <ControlsHelp viewMode={viewMode} />}
                </div>
            </div>
        </div>
    );
}

function TabButton({
    children,
    isActive,
    onClick
}: {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 text-sm rounded transition-colors ${isActive
                ? 'bg-blue-100 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            {children}
        </button>
    );
}

function BasicsHelp() {
    return (
        <div className="space-y-3">
            <HelpItem
                title="Переключение вида"
                description="Используйте кнопки '3D вид' и 'Вид сверху' для смены режима просмотра"
            />
            <HelpItem
                title="Добавление мебели"
                description="Выберите модель из каталога в левой панели, чтобы добавить её в комнату"
            />
            <HelpItem
                title="Выделение объекта"
                description="Кликните на любой объект в комнате для его выделения и редактирования"
            />
        </div>
    );
}

interface ControlsHelpProps {
    viewMode: '3d' | 'top';
}

function ControlsHelp({ viewMode }: ControlsHelpProps) {
    if (viewMode === '3d') {
        return (
            <div className="space-y-3">
                <HelpItem
                    title="Вращение камеры"
                    description="Зажмите левую кнопку мыши и двигайте мышь для вращения камеры"
                />
                <HelpItem
                    title="Приближение/отдаление"
                    description="Используйте колесико мыши для изменения масштаба"
                />
                <HelpItem
                    title="Перемещение камеры"
                    description="Зажмите правую кнопку мыши для перемещения камеры"
                />
                <HelpItem
                    title="Выбор мебели"
                    description="Кликните левой кнопкой мыши на мебель для её выделения"
                />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <HelpItem
                title="Вид сверху"
                description="Отображает комнату в top виде. Каждая клетка сетки = 100 см"
            />
            <HelpItem
                title="Перемещение мебели"
                description="Кликните на мебель для выделения, затем используйте поля 'Позиция' в левой панели"
            />
            <HelpItem
                title="Изменение размеров"
                description="Используйте поля 'Размеры' для изменения ширины, высоты и глубины мебели"
            />
        </div>
    );
}

function EditingHelp() {
    return (
        <div className="space-y-3">
            <HelpItem
                title="Изменение положения мебели"
                description="1. Выделите мебель кликом 2. В левой панели измените значения X, Y, Z в разделе 'Позиция'"
            />
            <HelpItem
                title="Изменение размеров"
                description="Используйте поля 'Ширина', 'Высота', 'Глубина' в разделе 'Размеры'"
            />
            <HelpItem
                title="Поворот мебели"
                description="Используйте слайдер 'Поворот' для вращения мебели вокруг вертикальной оси"
            />
            <HelpItem
                title="Удаление мебели"
                description="Выделите мебель и нажмите красную кнопку 'Удалить' внизу панели редактирования"
            />
        </div>
    );
}

function HelpItem({ title, description }: { title: string; description: string }) {
    return (
        <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}
