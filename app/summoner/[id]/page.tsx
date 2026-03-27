'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Updated hooks
import { SummonerData } from '@/app/types';

export default function SummonerStats() {
  const router = useRouter();
  const params = useParams(); // App router handles dynamic URLs this way
  const id = params.id as string;

  const [summoner, setSummoner] = useState<SummonerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback for UI before data loads
  const gameName = id ? decodeURIComponent(id).split('-')[0] : 'Player';
  const tagLine = id ? decodeURIComponent(id).split('-')[1] : 'NA1';

  useEffect(() => {
    if (!id) return;

    const fetchPlayerData = async () => {
      setLoading(true);
      setError('');

      try {
        const [gName, tLine] = decodeURIComponent(id).split('-');

        const res = await fetch(
          `/api/getPlayer?gameName=${encodeURIComponent(gName)}&tagLine=${encodeURIComponent(tLine)}`,
        );
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || 'Failed to fetch player data');

        setSummoner(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  const totalGames = summoner ? summoner.wins + summoner.losses : 0;
  const winRate =
    totalGames > 0 ? Math.round((summoner!.wins / totalGames) * 100) : 0;

  if (loading) {
    return (
      <div className='min-h-screen bg-surface flex flex-col items-center justify-center gap-4'>
        <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
        <p className='text-on-surface-variant font-body animate-pulse'>
          Scanning Riot Servers...
        </p>
      </div>
    );
  }

  if (error || !summoner) {
    return (
      <div className='min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center'>
        <div className='w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4 text-2xl font-bold border border-error/30 shadow-glow-defeat'>
          !
        </div>
        <h1 className='text-2xl font-display font-bold text-on-surface mb-2'>
          Summoner Not Found
        </h1>
        <p className='text-on-surface-variant mb-6'>{error}</p>
        <button
          onClick={() => router.push('/')}
          className='bg-surface-low border border-outline-variant/30 text-on-surface px-6 py-2 rounded-xl hover:bg-surface-high transition-colors'
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-surface p-6 font-body'>
      <nav className='max-w-3xl mx-auto mb-8 mt-4'>
        <button
          onClick={() => router.push('/')}
          className='text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-medium'
        >
          <span>&larr;</span> Back to Search
        </button>
      </nav>

      <main className='max-w-3xl mx-auto space-y-6'>
        <section className='bg-surface-low rounded-2xl p-6 md:p-8 shadow-ambient border border-outline-variant/20 flex flex-col md:flex-row items-center gap-6 text-center md:text-left transition-all'>
          <div className='relative shrink-0'>
            <div className='w-28 h-28 rounded-2xl bg-surface-high border-2 border-outline-variant/50 overflow-hidden flex items-center justify-center shadow-inner'>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${summoner.profileIconId}.png`}
                alt='Profile Icon'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 bg-surface-lowest border border-outline/50 px-4 py-1 rounded-full text-xs font-bold text-secondary shadow-md whitespace-nowrap'>
              Lvl {summoner.summonerLevel}
            </div>
          </div>

          <div className='flex-1'>
            <h1 className='text-3xl md:text-4xl font-display font-bold text-on-surface'>
              {summoner.gameName}{' '}
              <span className='text-on-surface-variant/50 text-2xl'>
                #{summoner.tagLine}
              </span>
            </h1>
          </div>

          <div className='mt-4 md:mt-0 w-full md:w-auto'>
            <button
              onClick={() => router.push(`/live/${summoner.puuid}`)}
              className='w-full bg-surface-high border border-outline-variant/30 text-on-surface font-bold px-6 py-4 rounded-xl hover:bg-kinetic-gradient hover:text-on-primary-fixed hover:border-transparent hover:shadow-glow-victory transition-all duration-300 flex items-center justify-center gap-3 group'
            >
              <span className='w-2.5 h-2.5 rounded-full bg-error animate-pulse group-hover:bg-on-primary-fixed'></span>
              Spectate Live Match
            </button>
          </div>
        </section>

        <section className='bg-surface-low rounded-2xl p-6 border border-outline-variant/20 flex items-center gap-6'>
          <div className='w-20 h-20 bg-surface-high rounded-full flex items-center justify-center shrink-0'>
            <span className='text-on-surface-variant text-xs font-bold'>
              {summoner.tier}
            </span>
          </div>

          <div>
            <h2 className='text-sm font-display font-bold text-secondary uppercase tracking-wider mb-1'>
              Ranked Solo/Duo
            </h2>
            {summoner.tier === 'UNRANKED' ? (
              <p className='text-2xl font-bold text-on-surface-variant'>
                Unranked
              </p>
            ) : (
              <>
                <p className='text-2xl font-bold text-on-surface'>
                  {summoner.tier} {summoner.rank}
                </p>
                <p className='text-on-surface-variant text-sm mt-1 font-medium'>
                  {summoner.leaguePoints} LP <span className='mx-2'>•</span>{' '}
                  {summoner.wins}W {summoner.losses}L{' '}
                  <span className='mx-2'>•</span>{' '}
                  <span
                    className={winRate >= 50 ? 'text-primary' : 'text-error'}
                  >
                    {winRate}% Winrate
                  </span>
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
