import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { MockAuthProvider } from '@/hooks/useMockAuth';
import './globals.css';

export const metadata = {
  title: 'Careverse Partners',
  description: 'Careverse Partner Platform — Building the world\'s largest AI-powered care network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <MockAuthProvider>
          {children}
        </MockAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
