'use client';

import { useState } from 'react';
import { OrderItem, Furniture } from '@/types';
import { MODELS } from '@/utils/modelManager';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    furnitureItems: Furniture[];
    userPhone: string;
    onSubmit: () => void;
}

export function OrderModal({
    isOpen,
    onClose,
    furnitureItems,
    userPhone,
    onSubmit
}: OrderModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const formatPhoneNumber = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length !== 11) return phone;

        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
        }
        return phone;
    };

    const orderItems: OrderItem[] = furnitureItems.map(item => {
        const modelConfig = item.modelType ? MODELS[item.modelType] : undefined;
        return {
            id: item.id,
            name: item.name,
            type: item.type,
            modelType: item.modelType,
            price: modelConfig?.price || 0,
            dimensions: item.dimensions
        };
    });

    const totalPrice = orderItems.reduce((sum, item) => sum + (item.price || 0), 0);

    const handleSubmit = () => {
        setIsSubmitting(true);
        onSubmit();
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 3000);
        }, 1000);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setIsSuccess(false);
            onClose();
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isSuccess ? 'Заявка отправлена' : 'Заказ'}
                            </h2>
                            {!isSuccess && (
                                <button
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="text-gray-500 hover:text-gray-700 text-2xl transition-colors disabled:opacity-50"
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="mb-6">
                                    <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-green-100">
                                        <svg
                                            className="w-12 h-12 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="3"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                                    Заявка успешно отправлена!
                                </h3>

                                <p className="text-gray-600 text-center mb-8 max-w-md">
                                    Мы свяжемся с вами по номеру {formatPhoneNumber(userPhone)}
                                    в ближайшее время для подтверждения заказа.
                                </p>

                                <p className="text-sm text-gray-500 text-center">
                                    Это окно закроется автоматически через несколько секунд
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Выбранные товары ({orderItems.length})
                                    </h3>
                                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Размеры (см)</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orderItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {item.name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {Math.round(item.dimensions.x)}×{Math.round(item.dimensions.y)}×{Math.round(item.dimensions.z)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {item.price ? `${item.price.toLocaleString()} ₽` : '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Итого:</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {totalPrice.toLocaleString()} ₽
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || userPhone.replace(/\D/g, '').length !== 11}
                                    className="flex-1 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Отправка...
                                        </span>
                                    ) : (
                                        `Оставить заявку на ${formatPhoneNumber(userPhone)}`
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
