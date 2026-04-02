import React from 'react';
import { useRouter } from 'next/navigation';
import { SummonerData } from '@/app/types';

interface ProfileHeaderProps {
  summoner: SummonerData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ summoner }) => {
  const router = useRouter();

  // Safely calculate the win rate only if the player has played ranked games
  const totalGames = (summoner.wins || 0) + (summoner.losses || 0);
  const winRate =
    totalGames > 0
      ? Math.round(((summoner.wins || 0) / totalGames) * 100)
      : null;

  return (
    <section className="bg-surface-low border-outline-variant/20 flex flex-col items-center gap-6 rounded-2xl border p-8 md:flex-row">
      <div className="border-outline-variant/50 h-24 w-24 overflow-hidden rounded-2xl border-2">
        {/* Note: Reverted to 14.6.1 so the image loads correctly! */}
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${summoner.profileIconId}.png`}
          alt="Icon"
        />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h1 className="font-display text-4xl font-bold">
          {summoner.gameName}{' '}
          <span className="text-on-surface-variant/50 text-2xl">
            #{summoner.tagLine}
          </span>
        </h1>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <p className="text-primary font-bold">
            Level {summoner.summonerLevel} • {summoner.tier} {summoner.rank}
            {/* Only show LP if they are actually ranked */}
            {summoner.tier !== 'UNRANKED' &&
              summoner.leaguePoints !== undefined && (
                <span> • {summoner.leaguePoints} LP</span>
              )}
          </p>

          {/* Only show Win Rate and W/L if they have games played */}
          {winRate !== null && (
            <>
              <span className="text-outline-variant hidden md:inline">•</span>
              <p className="text-on-surface-variant text-sm font-medium">
                <span className="text-blue-400">{summoner.wins}W</span>{' '}
                <span className="text-red-400">{summoner.losses}L</span> (Win
                Rate {winRate}%)
              </p>
            </>
          )}
        </div>
      </div>
      <button
        onClick={() => router.push(`/live/${summoner.puuid}`)}
        className="bg-primary text-surface-lowest hover:bg-primary-container rounded-xl px-6 py-3 font-bold transition-all"
      >
        Spectate Live
      </button>
    </section>
  );
};
