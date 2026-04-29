import Link from 'next/link';
import { login } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Digital Heroes</Link>
          <h1 style={{ marginTop: '1rem', fontSize: '1.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Enter your credentials to access your account.
          </p>
        </div>

        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              className="input" 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              className="input" 
              required 
              placeholder="••••••••"
            />
          </div>

          {params?.error && (
            <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', textAlign: 'center' }}>
              {params.error}
            </p>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--color-primary-base)' }}>Sign Up</Link>
        </p>
      </div>
    </main>
  );
}
