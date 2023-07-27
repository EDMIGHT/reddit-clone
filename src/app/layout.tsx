import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

import { Poppins } from 'next/font/google';

export const metadata = {
  title: 'Ideas',
  description: 'A Reddit clone built with Next.js and TypeScript.',
};

const font = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark'>
      <body className={cn('min-h-screen bg-background antialiased pt-12', font.className)}>
        <Navbar />
        <div className='container max-w-7xl mx-auto h-full pt-12'>{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
