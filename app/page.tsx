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
    <div className="bg-surface selection:bg-primary/30 flex min-h-screen flex-col items-center justify-center p-6">
      <div className="bg-surface-low border-outline-variant/20 shadow-ambient w-full max-w-md rounded-2xl border p-8 transition-all">
        <div className="mb-8 text-center">
          <h1 className="font-display mb-2 text-3xl font-bold tracking-tight">
            <span className="bg-kinetic-gradient bg-clip-text text-transparent">
              Nexus Tracker
            </span>
          </h1>
          <p className="text-on-surface-variant font-body text-sm">
            Enter a Riot ID to check live match status.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              placeholder="Faker#KR1"
              className="bg-surface-lowest border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-primary font-body w-full rounded-xl border px-5 py-4 text-lg transition-all outline-none focus:ring-1"
            />
          </div>

          {error && (
            <p className="text-error animate-pulse text-center text-sm font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-primary text-on-primary-fixed hover:bg-primary-container hover:shadow-glow-victory focus:ring-primary focus:ring-offset-surface mt-2 w-full rounded-xl py-4 text-lg font-bold transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2"
          >
            Locate Summoner
          </button>
        </form>
      </div>
    </div>
  );
}
