import '@/styles/globals.css';

import { Poppins } from 'next/font/google';

import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Ideas',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

const font = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark'>
      <body className={cn('min-h-screen bg-background antialiased pt-12', font.className)}>
        {/* @ts-expect-error server component */}
        <Navbar />

        {authModal}

        <div className='container mx-auto h-full max-w-7xl pt-12'>{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
