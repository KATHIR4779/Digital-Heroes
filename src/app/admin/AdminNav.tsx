'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signout } from '../login/actions';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard & Draws', exact: true },
    { href: '/admin/users', label: 'Users & Subscriptions', exact: false },
    { href: '/admin/charities', label: 'Charities', exact: false },
    { href: '/admin/verifications', label: 'Winner Verification', exact: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', 
                display: 'block', 
                background: isActive ? 'var(--color-primary-subtle)' : 'transparent', 
                color: isActive ? 'var(--color-primary-base)' : 'inherit',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <form action={signout} style={{ marginTop: '2rem' }}>
        <button type="submit" className="btn btn-secondary" style={{ width: '100%', border: '1px solid var(--color-error)', color: 'var(--color-error)' }}>
          Sign Out
        </button>
      </form>
    </div>
  );
}
