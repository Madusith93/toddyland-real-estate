'use client';

import { useState, useEffect } from 'react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const [language, setLanguage] = useState<string>('EN');
  const [currency, setCurrency] = useState<string>('LKR');
  const [unit, setUnit] = useState<string>('M2');

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      setLanguage(localStorage.getItem('global_language') || 'EN');
      setCurrency(localStorage.getItem('global_currency') || 'LKR');
      setUnit(localStorage.getItem('global_unit') || 'M2');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveChanges = () => {
    localStorage.setItem('global_language', language);
    localStorage.setItem('global_currency', currency);
    localStorage.setItem('global_unit', unit);

    if (typeof document !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      const domain = hostname.includes('.') ? `.${hostname.split('.').slice(-2).join('.')}` : hostname;

      // 1. Clear existing cookies
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      if (!isLocalhost) {
        document.cookie = `googtrans=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      }

      let cookieValue = '';
      let googleLangCode = 'en';

      if (language === 'JA') {
        cookieValue = '/en/ja';
        googleLangCode = 'ja';
      } else if (language === 'SI') {
        cookieValue = '/en/si';
        googleLangCode = 'si';
      }

      // 2. Set new translation cookie
      if (cookieValue) {
        document.cookie = `googtrans=${cookieValue}; path=/;`;
        if (!isLocalhost) {
          document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
        }
      }

      // 3. Trigger Google Translate Dropdown if present
      const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleSelect) {
        googleSelect.value = googleLangCode;
        googleSelect.dispatchEvent(new Event('change'));
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('preferencesChanged'));
    }

    onClose();

    // Refresh page to apply translation smoothly
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]">
      {/* notranslate class prevents Google from translating the Modal UI */}
      <div className="bg-white rounded-2xl p-6 w-[480px] relative shadow-xl text-slate-900 transition-all notranslate">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-semibold text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          Global <span className="text-red-600">Preferences</span>
        </h2>

        {/* LANGUAGE */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 block mb-2">LANGUAGE</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'EN', name: 'English (EN)' },
              { id: 'JA', name: '日本語 (JA)' },
              { id: 'SI', name: 'සිංහල (SI)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLanguage(item.id)}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  language === item.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* UNIT SYSTEM */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 block mb-2">UNIT SYSTEM</label>
          <div className="flex gap-2">
            {[
              { id: 'M2', name: 'Square Meter (m²)' },
              { id: 'SQFT', name: 'Square Feet (sqft)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setUnit(item.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                  unit === item.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* CURRENCY */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-400 block mb-2">CURRENCY</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'LKR', name: 'LKR (Rs.)' },
              { id: 'USD', name: 'USD ($)' },
              { id: 'JPY', name: 'JPY (¥)' },
              { id: 'EUR', name: 'EUR (€)' },
              { id: 'GBP', name: 'GBP (£)' },
              { id: 'AUD', name: 'AUD (A$)' },
              { id: 'SGD', name: 'SGD (S$)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrency(item.id)}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  currency === item.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}