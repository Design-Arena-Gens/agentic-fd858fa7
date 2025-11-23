'use client';

import { SalesForm } from '@/components/sales/sales-form';
import { SalesTable } from '@/components/sales/sales-table';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';
import { PageSection } from '@/components/layout/topbar';

export default function SalesPage() {
  const { t } = useTranslation();
  const sales = useInventoryStore((state) => state.sales);
  const deleteSale = useInventoryStore((state) => state.deleteSale);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('sales')}</h1>
      </div>

      <PageSection title={t('addSale')} description={t('sales')}>
        <SalesForm />
      </PageSection>

      <PageSection
        title={t('recentSales')}
        description={`${sales.length} ${t('sales')}`}
      >
        <SalesTable
          sales={sales}
          onDelete={(id) => {
            if (confirm('Delete invoice?')) {
              deleteSale(id);
            }
          }}
        />
      </PageSection>
    </div>
  );
}

