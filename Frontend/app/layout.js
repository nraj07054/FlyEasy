import './globals.css';

export const metadata = {
  title: 'FlightFinder - AI-Powered Flight Card Offers & Coupons',
  description: 'Find the best credit card offers and coupon codes for flights across all aggregators using natural language',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
