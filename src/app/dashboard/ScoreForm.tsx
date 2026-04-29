'use client';

import { useRef } from 'react';
import { submitScore } from './actions';

export default function ScoreForm() {
  return (
    <form action={submitScore} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
      <div style={{ flex: 1 }}>
        <label htmlFor="score" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Stableford Score</label>
        <input 
          type="number" 
          id="score" 
          name="score" 
          min="1" 
          max="45" 
          required 
          className="input" 
          placeholder="e.g. 36"
        />
      </div>
      <div style={{ flex: 1 }}>
        <label htmlFor="date" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Date Played</label>
        <input 
          type="date" 
          id="date" 
          name="date" 
          required 
          className="input" 
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Add Score
      </button>
    </form>
  );
}
