'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SummonerData } from '@/app/types';

export default function SummonerStats() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [summoner, setSummoner] = useState<SummonerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      } catch (err: unknown) {
        // Correctly type-checking the error here instead of using 'any'
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
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
      <div className="bg-surface flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="text-on-surface-variant font-body animate-pulse">
          Scanning Riot Servers...
        </p>
      </div>
    );
  }

  if (error || !summoner) {
    return (
      <div className="bg-surface flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="bg-error/10 text-error border-error/30 shadow-glow-defeat mb-4 flex h-16 w-16 items-center justify-center rounded-full border text-2xl font-bold">
          !
        </div>
        <h1 className="font-display text-on-surface mb-2 text-2xl font-bold">
          Summoner Not Found
        </h1>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-surface-low border-outline-variant/30 text-on-surface hover:bg-surface-high rounded-xl border px-6 py-2 transition-colors"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body min-h-screen p-6">
      <nav className="mx-auto mt-4 mb-8 max-w-3xl">
        <button
          onClick={() => router.push('/')}
          className="text-on-surface-variant hover:text-primary flex items-center gap-2 font-medium transition-colors"
        >
          <span>&larr;</span> Back to Search
        </button>
      </nav>

      <main className="mx-auto max-w-3xl space-y-6">
        <section className="bg-surface-low shadow-ambient border-outline-variant/20 flex flex-col items-center gap-6 rounded-2xl border p-6 text-center transition-all md:flex-row md:p-8 md:text-left">
          <div className="relative shrink-0">
            <div className="bg-surface-high border-outline-variant/50 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 shadow-inner">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${summoner.profileIconId}.png`}
                alt="Profile Icon"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="bg-surface-lowest border-outline/50 text-secondary absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border px-4 py-1 text-xs font-bold whitespace-nowrap shadow-md">
              Lvl {summoner.summonerLevel}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="font-display text-on-surface text-3xl font-bold md:text-4xl">
              {summoner.gameName}{' '}
              <span className="text-on-surface-variant/50 text-2xl">
                #{summoner.tagLine}
              </span>
            </h1>
          </div>

          <div className="mt-4 w-full md:mt-0 md:w-auto">
            <button
              onClick={() => router.push(`/live/${summoner.puuid}`)}
              className="bg-surface-high border-outline-variant/30 text-on-surface hover:bg-kinetic-gradient hover:text-on-primary-fixed hover:shadow-glow-victory group flex w-full items-center justify-center gap-3 rounded-xl border px-6 py-4 font-bold transition-all duration-300 hover:border-transparent"
            >
              <span className="bg-error group-hover:bg-on-primary-fixed h-2.5 w-2.5 animate-pulse rounded-full"></span>
              Spectate Live Match
            </button>
          </div>
        </section>

        <section className="bg-surface-low border-outline-variant/20 flex items-center gap-6 rounded-2xl border p-6">
          <div className="bg-surface-high flex h-20 w-20 shrink-0 items-center justify-center rounded-full">
            <span className="text-on-surface-variant text-xs font-bold">
              {summoner.tier}
            </span>
          </div>

          <div>
            <h2 className="font-display text-secondary mb-1 text-sm font-bold tracking-wider uppercase">
              Ranked Solo/Duo
            </h2>
            {summoner.tier === 'UNRANKED' ? (
              <p className="text-on-surface-variant text-2xl font-bold">
                Unranked
              </p>
            ) : (
              <>
                <p className="text-on-surface text-2xl font-bold">
                  {summoner.tier} {summoner.rank}
                </p>
                <p className="text-on-surface-variant mt-1 text-sm font-medium">
                  {summoner.leaguePoints} LP <span className="mx-2">•</span>{' '}
                  {summoner.wins}W {summoner.losses}L{' '}
                  <span className="mx-2">•</span>{' '}
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
