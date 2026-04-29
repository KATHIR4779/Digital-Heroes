import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { submitScore, deleteScore } from './actions';
import ScoreForm from './ScoreForm'; // Client component for score form

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const isActive = subscription?.status === 'active';

  // Fetch scores
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('played_date', { ascending: false });

  // Fetch profile and selected charity
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(*)')
    .eq('id', user.id)
    .single();

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>Welcome, {profile?.full_name || 'Golfer'}</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Manage your scores and track your impact.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1rem 2rem', border: `1px solid ${isActive ? 'var(--color-primary-base)' : 'var(--color-error)'}` }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Subscription Status</div>
            <div style={{ fontWeight: 700, color: isActive ? 'var(--color-primary-base)' : 'var(--color-error)' }}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </div>
            {!isActive && (
              <Link href="/pricing" style={{ fontSize: '0.875rem', textDecoration: 'underline', marginTop: '0.5rem', display: 'block' }}>
                Renew Now
              </Link>
            )}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Column - Scores */}
          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              Your Latest Scores
              <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                {scores?.length || 0} / 5 Active
              </span>
            </h2>
            
            {isActive ? (
              <div style={{ marginBottom: '2rem' }}>
                <ScoreForm />
              </div>
            ) : (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                Please activate your subscription to enter scores for the monthly draw.
              </div>
            )}

            <div>
              {scores && scores.length > 0 ? (
                <ul style={{ listStyle: 'none' }}>
                  {scores.map((s) => (
                    <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>{s.score} pts</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{s.played_date}</div>
                      </div>
                      <form action={async (formData: FormData) => { 'use server'; await deleteScore(s.id); }}>
                        <button type="submit" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Remove</button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No scores entered yet. Log your latest round!</p>
              )}
            </div>
          </section>

          {/* Right Column - Charity & Impact */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Charity Impact</h2>
              {profile?.charities ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    {profile.charities.image_url && (
                      <img src={profile.charities.image_url} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{profile.charities.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-base)' }}>{profile.charity_contribution_percentage}% Contribution</div>
                    </div>
                  </div>
                  <Link href="/charities" className="btn btn-secondary" style={{ width: '100%' }}>Change Charity</Link>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>You haven't selected a charity yet. Make your game count!</p>
                  <Link href="/charities" className="btn btn-primary" style={{ width: '100%' }}>Select Charity</Link>
                </div>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Participation</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Total Draws Entered</span>
                <span style={{ fontWeight: 600 }}>0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Total Winnings</span>
                <span style={{ fontWeight: 600, color: 'var(--color-accent-base)' }}>$0.00</span>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} disabled>View History</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
