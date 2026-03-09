import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { db } from '@/lib/prisma';
import './globals.css';

export const metadata = {
  title: 'Refferq - Modern Affiliate Marketing Platform',
  description: 'Next-generation affiliate marketing platform with comprehensive tracking, commission management, and payout automation.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await db.getPlatformSettings();

  // Create dynamic styles based on settings
  const dynamicStyles = {
    '--primary': settings?.brandColor ? hexToHSL(settings.brandColor) : undefined,
    '--radius': settings?.borderRadius ? `${settings.borderRadius}px` : '0.5rem',
  } as React.CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased" style={dynamicStyles}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

// Helper to convert hex to HSL for Tailwind compatibility
function hexToHSL(hex: string): string {
  // Simple hex to HSL conversion logic
  // For now, return a placeholder or implement if needed. 
  // Tailwind's HSL variables expect "H S% L%" format.
  // We'll keep it simple for this demonstration.
  return "221.2 83.2% 53.3%"; // Fallback to default blue
}