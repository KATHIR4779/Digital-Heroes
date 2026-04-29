import { createClient } from '@/utils/supabase/server';

export default async function AdminCharitiesPage() {
  const supabase = await createClient();
  const { data: charities } = await supabase.from('charities').select('*');

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Charity Management</h1>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <button className="btn btn-primary" style={{ marginBottom: '2rem' }}>+ Add New Charity</button>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem 0' }}>Charity Name</th>
              <th>Total Contributed</th>
            </tr>
          </thead>
          <tbody>
            {charities?.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={c.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  {c.name}
                </td>
                <td style={{ color: 'var(--color-primary-base)', fontWeight: 600 }}>${c.total_contributed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
