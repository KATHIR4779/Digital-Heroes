'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard & Draws', exact: true },
    { href: '/admin/users', label: 'Users & Subscriptions', exact: false },
    { href: '/admin/charities', label: 'Charities', exact: false },
    { href: '/admin/verifications', label: 'Winner Verification', exact: false },
  ];

  return (
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
  );
}
