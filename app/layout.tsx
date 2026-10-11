import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'phoneG - Coin Buy & Coin Send Application',
  description: 'phoneG is a mobile-first fintech app for buying, sending, and managing digital coins securely with real-time Firebase backend.',
  openGraph: {
    title: 'phoneG - Coin Buy & Coin Send Application',
    description: 'phoneG is a mobile-first fintech app for buying, sending, and managing digital coins securely with real-time Firebase backend.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'phoneG - Coin Buy & Coin Send Application',
    description: 'phoneG is a mobile-first fintech app for buying, sending, and managing digital coins securely with real-time Firebase backend.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
