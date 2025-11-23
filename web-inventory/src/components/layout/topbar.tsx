'use client';

import { PropsWithChildren, useMemo } from 'react';
import { MdSearch, MdDownload, MdUpload } from 'react-icons/md';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';

interface TopbarProps {
  onSearch?: (value: string) => void;
  searchValue?: string;
  title: string;
  actionArea?: React.ReactNode;
}

export const Topbar = ({
  onSearch,
  searchValue,
  title,
  actionArea,
}: TopbarProps) => {
  const { t } = useTranslation();
  const { items, suppliers, sales } = useInventoryStore((state) => ({
    items: state.items,
    suppliers: state.suppliers,
    sales: state.sales,
  }));

  const stats = useMemo(
    () => ({
      items: items.length,
      suppliers: suppliers.length,
      sales: sales.length,
    }),
    [items.length, suppliers.length, sales.length]
  );

  return (
    <header className="topbar">
      <div>
        <h2 className="topbar__title">{title}</h2>
        <p className="topbar__subtitle">
          {stats.items} {t('inventory')}, {stats.suppliers} {t('suppliers')}
        </p>
      </div>
      <div className="topbar__controls">
        {onSearch && (
          <div className="topbar__search">
            <MdSearch size={20} />
            <input
              type="search"
              placeholder={t('searchPlaceholder')}
              value={searchValue}
              onChange={(event) => onSearch(event.target.value)}
            />
          </div>
        )}
        <div className="topbar__actions">
          <button type="button" className="button button--ghost">
            <MdDownload size={18} />
            {t('exportData')}
          </button>
          <button type="button" className="button button--ghost">
            <MdUpload size={18} />
            {t('importData')}
          </button>
          {actionArea}
        </div>
      </div>
    </header>
  );
};

export const PageSection = ({
  children,
  title,
  description,
}: PropsWithChildren<{ title: string; description?: string }>) => (
  <section className="page-section">
    <div className="page-section__header">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
    <div>{children}</div>
  </section>
);

