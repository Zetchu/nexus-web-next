'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LivePlayerCard } from '../../../components/LivePlayerCard';
import { BanList } from '../../../components/BanList';

export default function LiveMatch() {
  const router = useRouter();
  const params = useParams();
  const puuid = params.puuid as string;

  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!puuid) return;

    const fetchLiveMatch = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/getMatch?puuid=${puuid}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch match');
        if (data.isLive === false) throw new Error(data.message);

        setMatch(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatch();
  }, [puuid]);

  if (loading) {
    return (
      <div className='min-h-screen bg-surface flex flex-col items-center justify-center gap-4'>
        <div className='w-10 h-10 border-4 border-error border-t-transparent rounded-full animate-spin'></div>
        <p className='text-on-surface-variant font-body animate-pulse'>
          Scanning Live Arenas...
        </p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className='min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center'>
        <div className='w-16 h-16 bg-surface-low text-on-surface-variant rounded-full flex items-center justify-center mb-4 text-2xl font-bold'>
          💤
        </div>
        <h1 className='text-2xl font-display font-bold text-on-surface mb-2'>
          No Active Match
        </h1>
        <p className='text-on-surface-variant mb-6'>{error}</p>
        <button
          onClick={() => router.back()}
          className='bg-surface-low border border-outline-variant/30 text-on-surface px-6 py-2 rounded-xl hover:bg-surface-high transition-colors'
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const blueTeam = match.participants.filter((p: any) => p.teamId === 100);
  const redTeam = match.participants.filter((p: any) => p.teamId === 200);

  // 2. Map the ban objects into simple arrays of strings for our BanList component
  const blueBanNames = (
    match.bannedChampions?.filter(
      (b: any) => b.teamId === 100 && b.championName,
    ) || []
  ).map((b: any) => b.championName);
  const redBanNames = (
    match.bannedChampions?.filter(
      (b: any) => b.teamId === 200 && b.championName,
    ) || []
  ).map((b: any) => b.championName);

  const gameMinutes = Math.floor(match.gameLength / 60);

  return (
    <div className='min-h-screen bg-surface p-6 font-body'>
      <nav className='max-w-6xl mx-auto mb-8 mt-4 flex justify-between items-center'>
        <button
          onClick={() => router.back()}
          className='text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-medium'
        >
          <span>&larr;</span> Back to Profile
        </button>
        <div className='text-right'>
          <p className='text-xs text-error font-bold tracking-widest uppercase animate-pulse'>
            Live Now
          </p>
          <p className='text-on-surface font-display font-bold'>
            {match.gameMode} • {gameMinutes} mins
          </p>
        </div>
      </nav>

      <main className='max-w-6xl mx-auto'>
        {/* 3. The new BanList Component */}
        <BanList
          blueBans={blueBanNames}
          redBans={redBanNames}
        />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'>
          {/* BLUE TEAM */}
          <section>
            <div className='mb-4 border-b border-blue-500/30 pb-2'>
              <h2 className='font-display font-bold text-blue-400 text-xl'>
                Blue Team
              </h2>
            </div>
            <div className='flex flex-col gap-3'>
              {blueTeam.map((player: any, idx: number) => (
                // 4. The new LivePlayerCard component
                <LivePlayerCard
                  key={`blue-${idx}`}
                  championName={player.championName}
                  summonerName={player.summonerName}
                  riotId={player.riotId}
                  spell1Name={player.spell1Name}
                  spell2Name={player.spell2Name}
                  primaryRuneIcon={player.primaryRuneIcon}
                  secondaryRuneIcon={player.secondaryRuneIcon}
                  isRedTeam={false}
                />
              ))}
            </div>
          </section>

          {/* RED TEAM */}
          <section>
            <div className='mb-4 border-b border-red-500/30 pb-2 lg:text-right'>
              <h2 className='font-display font-bold text-red-400 text-xl'>
                Red Team
              </h2>
            </div>
            <div className='flex flex-col gap-3'>
              {redTeam.map((player: any, idx: number) => (
                // 5. The new LivePlayerCard component (isRedTeam = true)
                <LivePlayerCard
                  key={`red-${idx}`}
                  championName={player.championName}
                  summonerName={player.summonerName}
                  riotId={player.riotId}
                  spell1Name={player.spell1Name}
                  spell2Name={player.spell2Name}
                  primaryRuneIcon={player.primaryRuneIcon}
                  secondaryRuneIcon={player.secondaryRuneIcon}
                  isRedTeam={true}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
