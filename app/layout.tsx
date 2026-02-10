import { ReactNode } from 'react';
import MainHeader from '@/components/main-header/main-header';
import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'Ukrainian Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <div id="modal"></div>
          <MainHeader />
          {children}
        </Providers>
      </body>
    </html >
  );
}
