import { createClient } from '@/utils/supabase/server';
import { simulateDraw, publishDraw } from './actions';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const { data: draws } = await supabase.from('draws').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Draw Management Engine</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Run New Draw</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Simulating a draw will generate winning numbers and calculate the prize pools. It will not be visible to users until published.
        </p>
        <form action={simulateDraw}>
          <button type="submit" className="btn btn-primary">Simulate Random Draw</button>
        </form>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Draws</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {draws?.map((draw) => (
          <div key={draw.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Draw ID: {draw.id.slice(0,8)}...</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.5rem 0' }}>
                Winning Numbers: {draw.winning_numbers?.join(', ') || 'N/A'}
              </div>
              <div>
                Pool: <span style={{ color: 'var(--color-primary-base)' }}>${draw.total_pool}</span> | 
                Status: <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: draw.status === 'published' ? 'var(--color-primary-subtle)' : 'rgba(255,255,255,0.1)', borderRadius: '4px', marginLeft: '0.5rem' }}>{draw.status}</span>
              </div>
            </div>
            
            {draw.status === 'simulated' && (
              <form action={async () => { 'use server'; await publishDraw(draw.id); }}>
                <button type="submit" className="btn btn-secondary">Publish to Users</button>
              </form>
            )}
            {draw.status === 'published' && (
              <button className="btn btn-secondary" disabled>Published</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
