'use client';

import { useState } from 'react';
import { InventoryForm } from '@/components/inventory/inventory-form';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';
import { PageSection } from '@/components/layout/topbar';

export default function InventoryPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const items = useInventoryStore((state) => state.items);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const deleteItem = useInventoryStore((state) => state.deleteItem);

  const editingItem = editingId
    ? items.find((item) => item.id === editingId)
    : undefined;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('inventory')}</h1>
        <input
          className="input"
          style={{ maxWidth: '320px' }}
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <PageSection
        title={editingItem ? t('editItem') : t('addItem')}
        description={t('inventorySummary')}
      >
        <InventoryForm
          defaultItem={editingItem}
          onSubmitSuccess={() => setEditingId(null)}
        />
      </PageSection>

      <PageSection
        title={t('inventory')}
        description={`${items.length} ${t('totalItems')}`}
      >
        <InventoryTable
          items={items}
          suppliers={suppliers}
          searchTerm={searchTerm}
          onEdit={(item) => setEditingId(item.id)}
          onDelete={(id) => {
            if (confirm('Delete item?')) {
              deleteItem(id);
            }
          }}
        />
      </PageSection>
    </div>
  );
}

