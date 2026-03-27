'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Updated for App Router

export default function Home() {
  const router = useRouter();
  const [riotId, setRiotId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!riotId.includes('#')) {
      setError('Please include your tagline (e.g., Player#NA1)');
      return;
    }

    const [gameName, tagLine] = riotId.split('#');

    if (!gameName || !tagLine) {
      setError('Invalid format. Use GameName#TagLine');
      return;
    }

    router.push(
      `/summoner/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`,
    );
  };

  return (
    <div className='min-h-screen bg-surface flex flex-col items-center justify-center p-6 selection:bg-primary/30'>
      <div className='w-full max-w-md bg-surface-low border border-outline-variant/20 rounded-2xl p-8 shadow-ambient transition-all'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-display font-bold tracking-tight mb-2'>
            <span className='bg-kinetic-gradient text-transparent bg-clip-text'>
              Nexus Tracker
            </span>
          </h1>
          <p className='text-on-surface-variant text-sm font-body'>
            Enter a Riot ID to check live match status.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className='flex flex-col gap-4'
        >
          <div className='relative'>
            <input
              type='text'
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              placeholder='Faker#KR1'
              className='w-full bg-surface-lowest border border-outline-variant/30 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body text-lg'
            />
          </div>

          {error && (
            <p className='text-error text-sm text-center font-medium animate-pulse'>
              {error}
            </p>
          )}

          <button
            type='submit'
            className='w-full mt-2 bg-primary text-on-primary-fixed font-bold text-lg py-4 rounded-xl hover:bg-primary-container hover:shadow-glow-victory focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface outline-none transition-all duration-300'
          >
            Locate Summoner
          </button>
        </form>
      </div>
    </div>
  );
}
