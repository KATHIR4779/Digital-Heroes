import Link from 'next/link';
import CheckoutButton from './CheckoutButton';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?error=Please login to view pricing');
  }

  // Check if they already have an active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single();

  if (subscription?.status === 'active') {
    redirect('/dashboard');
  }

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Choose Your Plan</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}>
            Unlock the monthly draws, enter your scores, and support great charities.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {/* Monthly Plan */}
          <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Monthly Pass</h2>
            <div style={{ fontSize: '3rem', fontWeight: 700, margin: '1rem 0' }}>
              $15<span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>/mo</span>
            </div>
            <ul style={{ margin: '2rem 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, color: 'var(--color-text-secondary)' }}>
              <li>✓ Enter 5 scores monthly</li>
              <li>✓ 10% auto-donated to charity</li>
              <li>✓ Full access to draws</li>
            </ul>
            <CheckoutButton 
              priceId={process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || ''} 
              label="Subscribe Monthly" 
            />
          </div>

          {/* Yearly Plan */}
          <div className="glass-panel" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--color-primary-base)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary-base)', color: '#000', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
              BEST VALUE
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Annual Pass</h2>
            <div style={{ fontSize: '3rem', fontWeight: 700, margin: '1rem 0' }}>
              $150<span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>/yr</span>
            </div>
            <ul style={{ margin: '2rem 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, color: 'var(--color-text-secondary)' }}>
              <li>✓ Save $30 instantly</li>
              <li>✓ Enter 5 scores monthly</li>
              <li>✓ 10% auto-donated to charity</li>
              <li>✓ Full access to draws</li>
            </ul>
            <CheckoutButton 
              priceId={process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || ''} 
              label="Subscribe Annually" 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
