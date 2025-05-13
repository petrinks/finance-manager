// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Gerenciador de Finanças Pessoais',
  description: 'Gerencie suas finanças pessoais de forma simples e eficiente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
