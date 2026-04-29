import { createClient } from '@/utils/supabase/server';
import CharityCard from './CharityCard';

export default async function CharitiesPage() {
  const supabase = await createClient();
  
  // Get charities
  const { data: charities } = await supabase.from('charities').select('*').order('name');
  
  // Get user profile to see current selection
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  
  if (user) {
    const { data } = await supabase.from('profiles').select('selected_charity_id, charity_contribution_percentage').eq('id', user.id).single();
    profile = data;
  }

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Charity Partners</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
            A minimum of 10% of your subscription goes directly to the charity of your choice. You can increase this at any time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {charities?.map((charity) => (
            <CharityCard 
              key={charity.id} 
              charity={charity} 
              isLoggedIn={!!user}
              isSelected={profile?.selected_charity_id === charity.id}
              currentPercentage={profile?.selected_charity_id === charity.id ? profile?.charity_contribution_percentage : 10}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
