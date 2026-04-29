import { createClient } from '@/utils/supabase/server';

export default async function AdminVerificationsPage() {
  const supabase = await createClient();
  const { data: verifications } = await supabase.from('winner_verifications').select('*');

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Winner Verification</h1>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        {(!verifications || verifications.length === 0) ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>No pending verifications at this time.</p>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem 0' }}>Draw ID</th>
                <th>User ID</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0' }}>{v.draw_id}</td>
                  <td>{v.user_id}</td>
                  <td>{v.status}</td>
                  <td><button className="btn btn-secondary">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
