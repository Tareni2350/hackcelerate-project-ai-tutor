
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistrar } from '@/components/layout/service-worker-registrar';
import { ThemeProvider } from '@/components/theme-provider'; // Added ThemeProvider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Tutor - Personalized Learning',
  description: 'Your AI-Powered Personalized Tutor',
  manifest: '/manifest.json',
  themeColor: [ 
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' }, // Updated to match new theme
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },  // Updated to match new theme
  ],
  icons: { 
    icon: 'https://placehold.co/192x192.png?text=AI',
    apple: 'https://placehold.co/180x180.png?text=AI',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning */}
      <head>
        {/* The manifest link is automatically added by Next.js via metadata.manifest */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ServiceWorkerRegistrar />
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
