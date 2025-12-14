'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disabled = useMemo(() => !formData.name.trim() || formData.phone.replace(/\D/g, '').length !== 11, [formData.name, formData.phone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      let phoneValue = value.replace(/\D/g, '');
      if (phoneValue.length > 0) {
        if (phoneValue[0] !== '7' && phoneValue[0] !== '8') {
          phoneValue = '7' + phoneValue;
        }
        if (phoneValue.length > 1) {
          phoneValue = '+' + phoneValue[0] + ' ' + phoneValue.substring(1, 4) + ' ' + phoneValue.substring(4, 7) + ' ' + phoneValue.substring(7, 9) + ' ' + phoneValue.substring(9, 11);
        } else {
          phoneValue = '+' + phoneValue;
        }
      }
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) {
      return;
    }

    setIsSubmitting(true);

    const userData = {
      name: formData.name.trim(),
      phone: formData.phone.replace(/\D/g, '').replace(/^8/, '7')
    };

    localStorage.setItem('planner_user', JSON.stringify(userData));

    setTimeout(() => {
      router.push('/simulator');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Симулятор</h1>
            <p className="text-gray-600">Войдите, чтобы начать планирование мебели</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ваше имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Номер телефона
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="+7 999 123 45 67"
                maxLength={18}
              />
              <p className="mt-2 text-sm text-gray-500">
                Формат: +7 XXX XXX XX XX
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || disabled}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Вход...' : 'Начать планирование'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
