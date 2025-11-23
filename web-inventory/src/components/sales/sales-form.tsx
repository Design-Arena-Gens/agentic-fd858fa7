'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';
import dayjs from 'dayjs';

const lineItemSchema = z.object({
  inventoryId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative().optional(),
});

const saleSchema = z.object({
  invoiceNumber: z.string().min(1),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  paymentMethod: z.string().min(1),
  status: z.enum(['paid', 'unpaid', 'pending']),
  taxRate: z.coerce.number().nonnegative(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(lineItemSchema).min(1),
});

type SaleFormValues = z.infer<typeof saleSchema>;

const defaultValues: SaleFormValues = {
  invoiceNumber: '',
  customerName: '',
  customerPhone: '',
  paymentMethod: 'cash',
  status: 'paid',
  taxRate: 0,
  dueDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
  notes: '',
  items: [
    {
      inventoryId: '',
      quantity: 1,
      price: 0,
      discount: 0,
    },
  ],
};

export const SalesForm = () => {
  const { t } = useTranslation();
  const addSale = useInventoryStore((state) => state.addSale);
  const inventory = useInventoryStore((state) => state.items);

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema) as any,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchedItems =
    useWatch({
      control: form.control,
      name: 'items',
    }) ?? [];
  const taxRate =
    useWatch({
      control: form.control,
      name: 'taxRate',
    }) ?? 0;

  useEffect(() => {
    const lastItem = fields[fields.length - 1];
    if (lastItem && !lastItem.inventoryId && inventory[0]) {
      form.setValue(
        `items.${fields.length - 1}.inventoryId`,
        inventory[0].id
      );
      form.setValue(
        `items.${fields.length - 1}.price`,
        inventory[0].pricing.retail
      );
    }
  }, [fields, inventory, form]);

  const totals = watchedItems.reduce(
    (acc, item) => {
      const lineSubtotal =
        item.quantity * (item.price - (item.discount ?? 0));
      acc.subtotal += lineSubtotal;
      return acc;
    },
    { subtotal: 0 }
  );
  const total = totals.subtotal + totals.subtotal * (taxRate / 100);

  const onSubmit = form.handleSubmit((values) => {
    addSale({
      ...values,
      taxRate: values.taxRate / 100,
    });
    form.reset(defaultValues);
  });

  if (!inventory.length) {
    return <div className="empty-state">{t('emptyInventory')}</div>;
  }

  return (
    <form className="form-grid" style={{ gap: '1.5rem' }} onSubmit={onSubmit}>
      <div className="form-grid form-grid-two">
        <div>
          <label className="form-label" htmlFor="invoice-number">
            {t('invoiceNumber')}
          </label>
          <input
            id="invoice-number"
            className="input"
            {...form.register('invoiceNumber')}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="customer-name">
            {t('customerName')}
          </label>
          <input
            id="customer-name"
            className="input"
            {...form.register('customerName')}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="customer-phone">
            {t('customerPhone')}
          </label>
          <input
            id="customer-phone"
            className="input"
            {...form.register('customerPhone')}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="paymentMethod">
            {t('paymentMethod')}
          </label>
          <select
            id="paymentMethod"
            className="select"
            {...form.register('paymentMethod')}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="pos">POS</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="status">
            {t('status')}
          </label>
          <select
            id="status"
            className="select"
            {...form.register('status')}
          >
            <option value="paid">{t('paid')}</option>
            <option value="unpaid">{t('unpaid')}</option>
            <option value="pending">{t('pending')}</option>
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="taxRate">
            {t('taxRate')}
          </label>
          <input
            id="taxRate"
            type="number"
            step="0.01"
            min={0}
            className="input"
            {...form.register('taxRate', { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="dueDate">
            {t('dueDate')}
          </label>
          <input
            id="dueDate"
            type="date"
            className="input"
            {...form.register('dueDate')}
          />
        </div>
      </div>

      <div className="page-section">
        <div className="page-section__header">
          <h3>{t('sales')}</h3>
          <p>{t('addLineItem')}</p>
        </div>
        <div className="form-grid" style={{ gap: '1rem' }}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="form-grid form-grid-two"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div>
                <label className="form-label">
                  {t('inventoryItem')}
                </label>
                <select
                  className="select"
                  {...form.register(`items.${index}.inventoryId`)}
                  onChange={(event) => {
                    const inventoryId = event.target.value;
                    const selected = inventory.find(
                      (item) => item.id === inventoryId
                    );
                    if (selected) {
                      form.setValue(
                        `items.${index}.price`,
                        selected.pricing.retail
                      );
                    }
                  }}
                >
                  <option value="">{t('selectItem')}</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.partNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">{t('quantityShort')}</label>
                <input
                  type="number"
                  min={1}
                  className="input"
                  {...form.register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <label className="form-label">{t('unitPrice')}</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="input"
                  {...form.register(`items.${index}.price`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <label className="form-label">{t('discount')}</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="input"
                  {...form.register(`items.${index}.discount`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', textAlign: 'end' }}>
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => remove(index)}
                  >
                    {t('remove')}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="button button--ghost"
            onClick={() =>
              append({
                inventoryId: inventory[0]?.id ?? '',
                price: inventory[0]?.pricing.retail ?? 0,
                quantity: 1,
                discount: 0,
              })
            }
          >
            {t('addLineItem')}
          </button>
        </div>
      </div>

      <div className="page-section">
        <div className="form-grid">
          <label className="form-label" htmlFor="notes">
            {t('notes')}
          </label>
          <textarea
            id="notes"
            className="textarea"
            rows={3}
            {...form.register('notes')}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem',
            gap: '1rem',
          }}
        >
          <div className="card" style={{ minWidth: '200px' }}>
            <span className="card__title">{t('subtotal')}</span>
            <span className="card__value">
              {totals.subtotal.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="card" style={{ minWidth: '200px' }}>
            <span className="card__title">{t('total')}</span>
            <span className="card__value">
              {total.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <button type="submit" className="button button--primary">
            {t('addSale')}
          </button>
        </div>
      </div>
    </form>
  );
};
