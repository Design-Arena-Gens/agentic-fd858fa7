'use client';

import Barcode from 'react-barcode';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { InventoryItem, Supplier } from '@/types';
import { useTranslation } from '@/components/providers/app-providers';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';

interface InventoryTableProps {
  items: InventoryItem[];
  suppliers: Supplier[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
}

export const InventoryTable = ({
  items,
  suppliers,
  onEdit,
  onDelete,
  searchTerm = '',
}: InventoryTableProps) => {
  const { t } = useTranslation();

  const normalized = searchTerm.trim().toLowerCase();
  const filtered = normalized
    ? items.filter((item) => {
        const haystack = [
          item.name,
          item.partNumber,
          item.barcode,
          item.compatibleModels,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalized);
      })
    : items;

  const supplierMap = suppliers.reduce<Record<string, Supplier>>(
    (map, supplier) => {
      map[supplier.id] = supplier;
      return map;
    },
    {}
  );

  if (!filtered.length) {
    return (
      <div className="empty-state">
        <p>{t('noData')}</p>
      </div>
    );
  }

  return (
    <div className="responsive-table table-wrapper">
      <table>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('partNumber')}</th>
            <th>{t('compatibleModels')}</th>
            <th>{t('barcode')}</th>
            <th>{t('supplier')}</th>
            <th>{t('location')}</th>
            <th>{t('quantity')}</th>
            <th>{t('reorderLevel')}</th>
            <th>{t('retailPrice')}</th>
            <th>{t('updatedAt')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => {
            const lowStock = item.quantity <= item.reorderLevel;
            return (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  {item.notes && (
                    <div className="text-soft" style={{ fontSize: '0.75rem' }}>
                      {item.notes}
                    </div>
                  )}
                </td>
                <td>{item.partNumber}</td>
                <td>{item.compatibleModels}</td>
                <td>
                  <Barcode
                    value={item.barcode}
                    background="transparent"
                    height={40}
                    width={1.6}
                    displayValue={false}
                  />
                  <div className="text-soft" style={{ fontSize: '0.7rem' }}>
                    {item.barcode}
                  </div>
                </td>
                <td>
                  {item.supplierId
                    ? supplierMap[item.supplierId]?.name ?? '—'
                    : '—'}
                </td>
                <td>{item.location}</td>
                <td>
                  <span
                    className={clsx('badge', {
                      'badge-danger': lowStock,
                      'badge-success': !lowStock,
                    })}
                  >
                    {item.quantity}
                  </span>
                </td>
                <td>{item.reorderLevel}</td>
                <td>
                  {item.pricing.retail.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>{dayjs(item.updatedAt).format('YYYY-MM-DD')}</td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => onEdit(item)}
                    >
                      <MdEdit size={18} />
                      {t('editItem')}
                    </button>
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => onDelete(item.id)}
                    >
                      <MdDeleteOutline size={18} />
                      {t('deleteItem')}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

