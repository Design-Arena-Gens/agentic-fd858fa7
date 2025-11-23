'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/app-providers';
import { useInventoryStore } from '@/store/inventory-store';
import clsx from 'clsx';
import {
  MdDashboard,
  MdInventory2,
  MdPeopleAlt,
  MdReceiptLong,
} from 'react-icons/md';

const navItems = [
  { href: '/', icon: MdDashboard, labelKey: 'dashboard' },
  { href: '/inventory', icon: MdInventory2, labelKey: 'inventory' },
  { href: '/suppliers', icon: MdPeopleAlt, labelKey: 'suppliers' },
  { href: '/sales', icon: MdReceiptLong, labelKey: 'sales' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { t, language } = useTranslation();
  const setLanguage = useInventoryStore((state) => state.setLanguage);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">⚙️</div>
        <div>
          <h1 className="sidebar__title">{t('appName')}</h1>
          <p className="sidebar__subtitle">v1.0</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx('sidebar__nav-item', {
                'sidebar__nav-item--active': isActive,
              })}
            >
              <Icon size={20} />
              <span>{t(item.labelKey as never)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <label className="sidebar__language-label">{t('language')}</label>
        <div className="sidebar__language-buttons">
          <button
            type="button"
            className={clsx('sidebar__language-button', {
              'sidebar__language-button--active': language === 'en',
            })}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={clsx('sidebar__language-button', {
              'sidebar__language-button--active': language === 'ar',
            })}
            onClick={() => setLanguage('ar')}
          >
            ع
          </button>
        </div>
        <p className="sidebar__offline-hint">{t('offlineNotice')}</p>
      </div>
    </aside>
  );
};

