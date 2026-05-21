import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: '6SIX9INE — Against All Odds',
  description: 'Premium streetwear brand. Against All Odds. Shop exclusive drops, tops, masks, and longsleeves.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
