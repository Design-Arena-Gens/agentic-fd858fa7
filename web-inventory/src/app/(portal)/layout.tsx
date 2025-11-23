import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">{children}</main>
    </div>
  );
}

