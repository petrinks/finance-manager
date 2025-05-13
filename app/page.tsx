// app/page.tsx
import Dashboard from '@/components/dashboard';
import './globals.css';

export default function Home() {
  return (
    <main className='min-h-screen p-4 md:p-8'>
      <Dashboard />
    </main>
  );
}
