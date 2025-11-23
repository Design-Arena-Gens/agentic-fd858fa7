'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Supplier } from '@/types';
import { useInventoryStore } from '@/store/inventory-store';
import { useTranslation } from '@/components/providers/app-providers';

const schema = z.object({
  name: z.string().min(2),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmitSuccess?: () => void;
}

export const SupplierForm = ({
  supplier,
  onSubmitSuccess,
}: SupplierFormProps) => {
  const { t } = useTranslation();
  const addSupplier = useInventoryStore((state) => state.addSupplier);
  const updateSupplier = useInventoryStore((state) => state.updateSupplier);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: supplier?.name ?? '',
      contactName: supplier?.contactName ?? '',
      phone: supplier?.phone ?? '',
      email: supplier?.email ?? '',
      address: supplier?.address ?? '',
      paymentTerms: supplier?.paymentTerms ?? '',
      notes: supplier?.notes ?? '',
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (supplier) {
      updateSupplier(supplier.id, values);
    } else {
      addSupplier(values);
    }
    form.reset();
    onSubmitSuccess?.();
  });

  return (
    <form className="form-grid form-grid-two" onSubmit={handleSubmit}>
      <div>
        <label className="form-label" htmlFor="supplier-name">
          {t('name')}
        </label>
        <input
          id="supplier-name"
          className="input"
          {...form.register('name')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="supplier-contact">
          {t('contactName')}
        </label>
        <input
          id="supplier-contact"
          className="input"
          {...form.register('contactName')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="supplier-phone">
          {t('phone')}
        </label>
        <input
          id="supplier-phone"
          className="input"
          {...form.register('phone')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="supplier-email">
          {t('email')}
        </label>
        <input
          id="supplier-email"
          type="email"
          className="input"
          {...form.register('email')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="supplier-address">
          {t('address')}
        </label>
        <input
          id="supplier-address"
          className="input"
          {...form.register('address')}
        />
      </div>

      <div>
        <label className="form-label" htmlFor="supplier-terms">
          {t('paymentTerms')}
        </label>
        <input
          id="supplier-terms"
          className="input"
          {...form.register('paymentTerms')}
        />
      </div>

      <div className="form-grid" style={{ gridColumn: '1 / -1' }}>
        <label className="form-label" htmlFor="supplier-notes">
          {t('notes')}
        </label>
        <textarea
          id="supplier-notes"
          className="textarea"
          rows={3}
          {...form.register('notes')}
        />
      </div>

      <div style={{ gridColumn: '1 / -1', textAlign: 'end' }}>
        <button type="submit" className="button button--primary">
          {supplier ? t('editSupplier') : t('addSupplier')}
        </button>
      </div>
    </form>
  );
};

