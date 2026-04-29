import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: 'var(--color-bg-elevated)', borderRight: '1px solid var(--color-border)', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', paddingLeft: '1rem' }}>Admin Control</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'block', background: 'var(--color-primary-subtle)', color: 'var(--color-primary-base)' }}>Dashboard & Draws</Link>
          <Link href="/admin/users" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'block' }}>Users & Subscriptions</Link>
          <Link href="/admin/charities" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'block' }}>Charities</Link>
          <Link href="/admin/verifications" style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'block' }}>Winner Verification</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
