'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LivePlayerCard } from '../../../components/LivePlayerCard';
import { BanList } from '../../../components/BanList';

interface LiveBan {
  championName?: string;
  teamId: number;
}

interface LiveParticipant {
  teamId: number;
  championName: string;
  summonerName: string;
  riotId?: string;
  spell1Name?: string;
  spell2Name?: string;
  primaryRuneIcon?: string;
  secondaryRuneIcon?: string;
}

interface LiveMatchData {
  isLive: boolean;
  message?: string;
  gameMode: string;
  gameLength: number;
  bannedChampions?: LiveBan[];
  participants: LiveParticipant[];
}

export default function LiveMatch() {
  const router = useRouter();
  const params = useParams();
  const puuid = params.puuid as string;

  const [match, setMatch] = useState<LiveMatchData | null>(null);
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatch();
  }, [puuid]);

  if (loading) {
    return (
      <div className="bg-surface flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="border-error h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="text-on-surface-variant font-body animate-pulse">
          Scanning Live Arenas...
        </p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="bg-surface flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="bg-surface-low text-on-surface-variant mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
          💤
        </div>
        <h1 className="font-display text-on-surface mb-2 text-2xl font-bold">
          No Active Match
        </h1>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-surface-low border-outline-variant/30 text-on-surface hover:bg-surface-high rounded-xl border px-6 py-2 transition-colors"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const blueTeam = match.participants.filter(
    (p: LiveParticipant) => p.teamId === 100,
  );
  const redTeam = match.participants.filter(
    (p: LiveParticipant) => p.teamId === 200,
  );

  const blueBanNames = (
    match.bannedChampions?.filter(
      (b: LiveBan) => b.teamId === 100 && b.championName,
    ) || []
  ).map((b: LiveBan) => b.championName as string);

  const redBanNames = (
    match.bannedChampions?.filter(
      (b: LiveBan) => b.teamId === 200 && b.championName,
    ) || []
  ).map((b: LiveBan) => b.championName as string);

  const gameMinutes = Math.floor(match.gameLength / 60);

  return (
    <div className="bg-surface font-body min-h-screen p-6">
      <nav className="mx-auto mt-4 mb-8 flex max-w-6xl items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-on-surface-variant hover:text-primary flex items-center gap-2 font-medium transition-colors"
        >
          <span>&larr;</span> Back to Profile
        </button>
        <div className="text-right">
          <p className="text-error animate-pulse text-xs font-bold tracking-widest uppercase">
            Live Now
          </p>
          <p className="text-on-surface font-display font-bold">
            {match.gameMode} • {gameMinutes} mins
          </p>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl">
        {/* 3. The new BanList Component */}
        <BanList blueBans={blueBanNames} redBans={redBanNames} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* BLUE TEAM */}
          <section>
            <div className="mb-4 border-b border-blue-500/30 pb-2">
              <h2 className="font-display text-xl font-bold text-blue-400">
                Blue Team
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {blueTeam.map((player: LiveParticipant, idx: number) => (
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
            <div className="mb-4 border-b border-red-500/30 pb-2 lg:text-right">
              <h2 className="font-display text-xl font-bold text-red-400">
                Red Team
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {redTeam.map((player: LiveParticipant, idx: number) => (
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
