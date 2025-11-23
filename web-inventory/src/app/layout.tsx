import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoArabic = Noto_Kufi_Arabic({
  variable: '--font-noto-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Auto Parts Manager',
  description:
    'Offline-ready bilingual inventory, supplier, and sales management for auto parts stores.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable}`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
