'use client';

import { ReactNode, useEffect } from 'react';
import { useInventoryStore } from '@/store/inventory-store';
import { dictionaries, TranslationKey } from '@/lib/i18n';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const { language, isHydrated, setHydrated } = useInventoryStore(
    (state) => ({
      language: state.language,
      isHydrated: state.isHydrated,
      setHydrated: state.setHydrated,
    })
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  if (!isHydrated && typeof window !== 'undefined') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return children;
};

export const useTranslation = () => {
  const language = useInventoryStore((state) => state.language);
  return {
    language,
    t: (key: TranslationKey) => dictionaries[language][key],
  };
};
