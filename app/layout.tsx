import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Meal Planner',
  description: 'Plan meals with your household'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
