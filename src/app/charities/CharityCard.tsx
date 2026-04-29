'use client';

import { useState } from 'react';
import { updateCharitySettings } from '../dashboard/actions';
import { useRouter } from 'next/navigation';

export default function CharityCard({ charity, isLoggedIn, isSelected, currentPercentage }: any) {
  const [percentage, setPercentage] = useState(currentPercentage || 10);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelect = async () => {
    if (!isLoggedIn) {
      router.push('/login?error=Please login to select a charity');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('charityId', charity.id);
    formData.append('percentage', percentage.toString());

    await updateCharitySettings(formData);
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '200px', width: '100%', position: 'relative' }}>
        <img 
          src={charity.image_url || 'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?w=800&q=80'} 
          alt={charity.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {isSelected && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--color-primary-base)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
            CURRENTLY SUPPORTING
          </div>
        )}
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{charity.name}</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
          {charity.description}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <label htmlFor={`perc-${charity.id}`}>Contribution: {percentage}%</label>
              <span style={{ color: 'var(--color-text-secondary)' }}>Min 10%</span>
            </div>
            <input 
              id={`perc-${charity.id}`}
              type="range" 
              min="10" 
              max="100" 
              value={percentage} 
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary-base)' }}
            />
          </div>
          <button 
            onClick={handleSelect} 
            className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`} 
            disabled={loading}
          >
            {loading ? 'Updating...' : isSelected ? 'Update Contribution' : 'Support This Charity'}
          </button>
        </div>
      </div>
    </div>
  );
}
