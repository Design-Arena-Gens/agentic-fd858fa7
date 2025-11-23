'use client';

import dayjs from 'dayjs';
import { useTranslation } from '@/components/providers/app-providers';
import { Sale } from '@/types';
import { MdDeleteOutline } from 'react-icons/md';

interface SalesTableProps {
  sales: Sale[];
  onDelete: (id: string) => void;
}

export const SalesTable = ({ sales, onDelete }: SalesTableProps) => {
  const { t } = useTranslation();

  if (!sales.length) {
    return <div className="empty-state">{t('noData')}</div>;
  }

  return (
    <div className="responsive-table table-wrapper">
      <table>
        <thead>
          <tr>
            <th>{t('invoiceNumber')}</th>
            <th>{t('customerName')}</th>
            <th>{t('paymentMethod')}</th>
            <th>{t('status')}</th>
            <th>{t('subtotal')}</th>
            <th>{t('taxRate')}</th>
            <th>{t('total')}</th>
            <th>{t('createdAt')}</th>
            <th>{t('dueDate')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.invoiceNumber}</td>
              <td>{sale.customerName || '—'}</td>
              <td>{sale.paymentMethod}</td>
              <td>
                <span className={`status-pill status-pill--${sale.status}`}>
                  {t(sale.status as never)}
                </span>
              </td>
              <td>
                {sale.subtotal.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>{Math.round(sale.taxRate * 100)}%</td>
              <td>
                {sale.total.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>{dayjs(sale.createdAt).format('YYYY-MM-DD')}</td>
              <td>{sale.dueDate || '—'}</td>
              <td>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => onDelete(sale.id)}
                >
                  <MdDeleteOutline size={18} />
                  {t('remove')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

