'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { SupplierForm } from '@/components/suppliers/supplier-form';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';
import { PageSection } from '@/components/layout/topbar';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';

export default function SuppliersPage() {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const suppliers = useInventoryStore((state) => state.suppliers);
  const deleteSupplier = useInventoryStore((state) => state.deleteSupplier);

  const editingSupplier = editingId
    ? suppliers.find((supplier) => supplier.id === editingId)
    : undefined;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{t('suppliers')}</h1>
      </div>

      <PageSection
        title={editingSupplier ? t('editSupplier') : t('addSupplier')}
        description={t('suppliers')}
      >
        <SupplierForm
          supplier={editingSupplier}
          onSubmitSuccess={() => setEditingId(null)}
        />
      </PageSection>

      <PageSection
        title={t('suppliers')}
        description={`${suppliers.length} ${t('totalSuppliers')}`}
      >
        {suppliers.length ? (
          <div className="responsive-table table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('contactName')}</th>
                  <th>{t('phone')}</th>
                  <th>{t('email')}</th>
                  <th>{t('paymentTerms')}</th>
                  <th>{t('createdAt')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <strong>{supplier.name}</strong>
                      {supplier.address && (
                        <div
                          className="text-soft"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {supplier.address}
                        </div>
                      )}
                    </td>
                    <td>{supplier.contactName || '—'}</td>
                    <td>{supplier.phone || '—'}</td>
                    <td>{supplier.email || '—'}</td>
                    <td>{supplier.paymentTerms || '—'}</td>
                    <td>{dayjs(supplier.createdAt).format('YYYY-MM-DD')}</td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <button
                          type='button'
                          className='button button--ghost'
                          onClick={() => setEditingId(supplier.id)}
                        >
                          <MdEdit size={18} />
                          {t('editSupplier')}
                        </button>
                        <button
                          type='button'
                          className='button button--ghost'
                          onClick={() => {
                            if (
                              confirm(
                                `${t('deleteItem')} ${supplier.name}?`
                              )
                            ) {
                              deleteSupplier(supplier.id);
                            }
                          }}
                        >
                          <MdDeleteOutline size={18} />
                          {t('remove')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">{t('noData')}</div>
        )}
      </PageSection>
    </div>
  );
}

