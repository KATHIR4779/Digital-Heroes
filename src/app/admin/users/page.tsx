import { createClient } from '@/utils/supabase/server';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from('profiles').select('*');
  const { data: subs } = await supabase.from('subscriptions').select('*');

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Users & Subscriptions</h1>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem 0' }}>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => {
              const sub = subs?.find(s => s.user_id === user.id);
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0' }}>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td style={{ color: sub?.status === 'active' ? 'var(--color-primary-base)' : 'var(--color-text-secondary)' }}>
                    {sub?.status || 'inactive'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
