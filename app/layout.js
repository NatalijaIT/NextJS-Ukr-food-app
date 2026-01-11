import MainHeader from '@/components/main-header/main-header';
import './globals.css';

export const metadata = {
  title: 'Ukrainian Food',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        data-new-gr-c-s-check-loaded="14.1268.0"
        data-gr-ext-installed=""
      >
        <div id="modal"></div>
        <MainHeader />
        {children}
      </body>
    </html >
  );
}
