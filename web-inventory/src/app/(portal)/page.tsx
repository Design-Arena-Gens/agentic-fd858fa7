'use client';

import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';
import { PageSection } from '@/components/layout/topbar';
import { MdArrowOutward, MdInventory2, MdPeopleAlt } from 'react-icons/md';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { items, suppliers, sales } = useInventoryStore((state) => ({
    items: state.items,
    suppliers: state.suppliers,
    sales: state.sales,
  }));

  const stats = useMemo(() => {
    const lowStock = items.filter((item) => item.quantity <= item.reorderLevel);
    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.quantity * item.pricing.retail,
      0
    );

    const recentSales = sales
      .slice(0, 5)
      .map((sale) => ({
        ...sale,
        createdAt: dayjs(sale.createdAt).format('YYYY-MM-DD HH:mm'),
      }));

    return {
      lowStock,
      totalStock,
      totalValue,
      recentSales,
    };
  }, [items, sales]);

  return (
    <div className="page">
      <div className="card-grid">
        <div className="card">
          <span className="card__title">{t('inventory')}</span>
          <span className="card__value">{items.length}</span>
          <div className="card__trend">
            <MdInventory2 /> {t('totalItems')}
          </div>
        </div>
        <div className="card">
          <span className="card__title">{t('suppliers')}</span>
          <span className="card__value">{suppliers.length}</span>
          <div className="card__trend">
            <MdPeopleAlt /> {t('totalSuppliers')}
          </div>
        </div>
        <div className="card">
          <span className="card__title">{t('quantity')}</span>
          <span className="card__value">{stats.totalStock}</span>
          <div className="card__trend">
            {t('lowStock')}: {stats.lowStock.length}
          </div>
        </div>
        <div className="card">
          <span className="card__title">{t('sales')}</span>
          <span className="card__value">
            {stats.totalValue.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </span>
          <div className="card__trend">
            <MdArrowOutward /> {t('total')}
          </div>
        </div>
      </div>

      <div className="grid-split" style={{ marginTop: '1.75rem' }}>
        <PageSection
          title={t('lowStock')}
          description={stats.lowStock.length ? undefined : t('noData')}
        >
          {stats.lowStock.length ? (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('partNumber')}</th>
                    <th>{t('quantity')}</th>
                    <th>{t('reorderLevel')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStock.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.partNumber}</td>
                      <td>
                        <span className="badge badge-danger">
                          {item.quantity}
                        </span>
                      </td>
                      <td>{item.reorderLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </PageSection>

        <PageSection
          title={t('recentSales')}
          description={!stats.recentSales.length ? t('noData') : undefined}
        >
          {stats.recentSales.length ? (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('invoiceNumber')}</th>
                    <th>{t('customerName')}</th>
                    <th>{t('total')}</th>
                    <th>{t('status')}</th>
                    <th>{t('createdAt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.invoiceNumber}</td>
                      <td>{sale.customerName || '—'}</td>
                      <td>
                        {sale.total.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <span className={`status-pill status-pill--${sale.status}`}>
                          {t(sale.status as never)}
                        </span>
                      </td>
                      <td>{sale.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </PageSection>
      </div>
    </div>
  );
}

