'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

export default function RouteTranslateHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedLang = localStorage.getItem('global_language') || 'EN';
    if (savedLang === 'EN') return;

    let targetLang = 'en';
    if (savedLang === 'JA') targetLang = 'ja';
    else if (savedLang === 'SI') targetLang = 'si';

    const triggerCombo = () => {
      // 1. Sync cookie for the route
      const cookieVal = savedLang === 'JA' ? '/en/ja' : savedLang === 'SI' ? '/en/si' : '';
      if (cookieVal) {
        document.cookie = `googtrans=${cookieVal}; path=/;`;
      }

      // 2. Select box change trigger
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectEl) {
        if (selectEl.value !== targetLang) {
          selectEl.value = targetLang;
        }
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    // Instant & Micro-task Execution (Delay එක සම්පූර්ණයෙන්ම නැති කිරීමට)
    triggerCombo();
    requestAnimationFrame(triggerCombo);

    // Fast Intervals for dynamic async loaded component content
    const i1 = setTimeout(triggerCombo, 50);
    const i2 = setTimeout(triggerCombo, 150);
    const i3 = setTimeout(triggerCombo, 300);

    // Dynamic Mutation Observer for Async Component Hydration
    const mainEl = document.querySelector('main');
    let observer: MutationObserver | null = null;

    if (mainEl) {
      observer = new MutationObserver(() => {
        triggerCombo();
      });
      observer.observe(mainEl, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(i1);
      clearTimeout(i2);
      clearTimeout(i3);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}