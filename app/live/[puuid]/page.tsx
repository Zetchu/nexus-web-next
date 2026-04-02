'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  tier?: string;
  rank?: string;
  winRate?: number;
  totalGames?: number;
  masteryPoints?: number;
  masteryLevel?: number;
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

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!puuid) return;

    if (hasFetched.current) return;
    hasFetched.current = true;

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

  const ROLES = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

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
        <BanList blueBans={blueBanNames} redBans={redBanNames} />

        {/* --- NEW FACE-OFF LAYOUT --- */}
        <div className="mt-12 flex flex-col gap-6">
          {/* Header Row (Desktop Only) */}
          <div className="border-outline-variant/20 hidden items-center justify-between border-b px-4 pb-2 lg:flex">
            <h2 className="font-display w-1/2 text-xl font-bold text-blue-400">
              Blue Team
            </h2>
            <h2 className="font-display w-1/2 text-right text-xl font-bold text-red-400">
              Red Team
            </h2>
          </div>

          {/* Map through the 5 roles */}
          {ROLES.map((role, idx) => {
            const bluePlayer = blueTeam[idx];
            const redPlayer = redTeam[idx];

            return (
              <div
                key={role}
                className="bg-surface-low border-outline-variant/10 relative flex flex-col items-center gap-4 rounded-2xl border p-4 lg:flex-row lg:gap-8 lg:border-none lg:bg-transparent lg:p-0"
              >
                {/* Blue Side */}
                <div className="w-full lg:w-1/2">
                  {bluePlayer ? (
                    <LivePlayerCard
                      championName={bluePlayer.championName}
                      summonerName={bluePlayer.summonerName}
                      riotId={bluePlayer.riotId}
                      spell1Name={bluePlayer.spell1Name}
                      spell2Name={bluePlayer.spell2Name}
                      primaryRuneIcon={bluePlayer.primaryRuneIcon}
                      secondaryRuneIcon={bluePlayer.secondaryRuneIcon}
                      isRedTeam={false}
                      tier={bluePlayer.tier}
                      rank={bluePlayer.rank}
                      winRate={bluePlayer.winRate}
                      totalGames={bluePlayer.totalGames}
                      masteryPoints={bluePlayer.masteryPoints}
                      masteryLevel={bluePlayer.masteryLevel}
                    />
                  ) : (
                    <div className="border-outline-variant/30 text-on-surface-variant flex h-22 items-center justify-center rounded-xl border border-dashed text-sm">
                      Connecting...
                    </div>
                  )}
                </div>

                {/* Red Side */}
                <div className="w-full lg:w-1/2">
                  {redPlayer ? (
                    <LivePlayerCard
                      championName={redPlayer.championName}
                      summonerName={redPlayer.summonerName}
                      riotId={redPlayer.riotId}
                      spell1Name={redPlayer.spell1Name}
                      spell2Name={redPlayer.spell2Name}
                      primaryRuneIcon={redPlayer.primaryRuneIcon}
                      secondaryRuneIcon={redPlayer.secondaryRuneIcon}
                      isRedTeam={true}
                      tier={redPlayer.tier}
                      rank={redPlayer.rank}
                      winRate={redPlayer.winRate}
                      totalGames={redPlayer.totalGames}
                      masteryPoints={redPlayer.masteryPoints}
                      masteryLevel={redPlayer.masteryLevel}
                    />
                  ) : (
                    <div className="border-outline-variant/30 text-on-surface-variant flex h-22 items-center justify-center rounded-xl border border-dashed text-sm">
                      Connecting...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
