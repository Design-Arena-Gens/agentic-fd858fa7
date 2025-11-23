'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InventoryItem } from '@/types';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';

const schema = z.object({
  name: z.string().min(2),
  partNumber: z.string().min(1),
  compatibleModels: z.string().min(1),
  barcode: z.string().min(1),
  supplierId: z.string().optional(),
  location: z.string().min(1),
  quantity: z.coerce.number().int().nonnegative(),
  reorderLevel: z.coerce.number().int().nonnegative(),
  purchasePrice: z.coerce.number().nonnegative(),
  wholesalePrice: z.coerce.number().nonnegative(),
  retailPrice: z.coerce.number().nonnegative(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface InventoryFormProps {
  defaultItem?: InventoryItem;
  onSubmitSuccess?: () => void;
}

export const InventoryForm = ({
  defaultItem,
  onSubmitSuccess,
}: InventoryFormProps) => {
  const { t } = useTranslation();
  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const suppliers = useInventoryStore((state) => state.suppliers);

  const defaultValues = useMemo<FormValues>(
    () => ({
      name: defaultItem?.name ?? '',
      partNumber: defaultItem?.partNumber ?? '',
      compatibleModels: defaultItem?.compatibleModels ?? '',
      barcode: defaultItem?.barcode ?? '',
      supplierId: defaultItem?.supplierId,
      location: defaultItem?.location ?? '',
      quantity: defaultItem?.quantity ?? 0,
      reorderLevel: defaultItem?.reorderLevel ?? 0,
      purchasePrice: defaultItem?.pricing.purchase ?? 0,
      wholesalePrice: defaultItem?.pricing.wholesale ?? 0,
      retailPrice: defaultItem?.pricing.retail ?? 0,
      notes: defaultItem?.notes ?? '',
    }),
    [defaultItem]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode: 'onSubmit',
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (defaultItem) {
      updateItem(defaultItem.id, {
        ...values,
        pricing: {
          purchase: values.purchasePrice,
          wholesale: values.wholesalePrice,
          retail: values.retailPrice,
        },
      });
    } else {
      addItem({
        ...values,
        pricing: {
          purchase: values.purchasePrice,
          wholesale: values.wholesalePrice,
          retail: values.retailPrice,
        },
      });
    }

    form.reset();
    onSubmitSuccess?.();
  });

  return (
    <form className="form-grid form-grid-two" onSubmit={handleSubmit}>
      <div>
        <label className="form-label" htmlFor="name">
          {t('name')}
        </label>
        <input
          id="name"
          className="input"
          {...form.register('name')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="partNumber">
          {t('partNumber')}
        </label>
        <input
          id="partNumber"
          className="input"
          {...form.register('partNumber')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="compatibleModels">
          {t('compatibleModels')}
        </label>
        <input
          id="compatibleModels"
          className="input"
          {...form.register('compatibleModels')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="barcode">
          {t('barcode')}
        </label>
        <input
          id="barcode"
          className="input"
          {...form.register('barcode')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="supplierId">
          {t('supplier')}
        </label>
        <select
          id="supplierId"
          className="select"
          {...form.register('supplierId')}
        >
          <option value="">{t('selectItem')}</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label" htmlFor="location">
          {t('location')}
        </label>
        <input
          id="location"
          className="input"
          {...form.register('location')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="quantity">
          {t('quantity')}
        </label>
        <input
          id="quantity"
          type="number"
          min={0}
          className="input"
          {...form.register('quantity', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="reorderLevel">
          {t('reorderLevel')}
        </label>
        <input
          id="reorderLevel"
          type="number"
          min={0}
          className="input"
          {...form.register('reorderLevel', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="purchasePrice">
          {t('purchasePrice')}
        </label>
        <input
          id="purchasePrice"
          type="number"
          min={0}
          step="0.01"
          className="input"
          {...form.register('purchasePrice', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="wholesalePrice">
          {t('wholesalePrice')}
        </label>
        <input
          id="wholesalePrice"
          type="number"
          min={0}
          step="0.01"
          className="input"
          {...form.register('wholesalePrice', { valueAsNumber: true })}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="retailPrice">
          {t('retailPrice')}
        </label>
        <input
          id="retailPrice"
          type="number"
          min={0}
          step="0.01"
          className="input"
          {...form.register('retailPrice', { valueAsNumber: true })}
        />
      </div>

      <div className="form-grid" style={{ gridColumn: '1 / -1' }}>
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

      <div style={{ gridColumn: '1 / -1', textAlign: 'end' }}>
        <button type="submit" className="button button--primary">
          {defaultItem ? t('editItem') : t('addItem')}
        </button>
      </div>
    </form>
  );
};
