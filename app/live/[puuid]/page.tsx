'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

        // Handle the 404 scenario gracefully
        if (data.isLive === false) {
          throw new Error(data.message);
        }

        setMatch(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatch();
  }, [puuid]);

  // Loading State
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

  // Not in Game / Error State
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

  // Filter players into their teams (100 = Blue, 200 = Red)
  const blueTeam = match.participants.filter((p: any) => p.teamId === 100);
  const redTeam = match.participants.filter((p: any) => p.teamId === 200);

  // Filter Bans
  const blueBans =
    match.bannedChampions?.filter(
      (b: any) => b.teamId === 100 && b.championName,
    ) || [];
  const redBans =
    match.bannedChampions?.filter(
      (b: any) => b.teamId === 200 && b.championName,
    ) || [];

  const gameMinutes = Math.floor(match.gameLength / 60);

  return (
    <div className='min-h-screen bg-surface p-6 font-body'>
      {/* Header Navigation */}
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
        {/* --- THE BAN ROW --- */}
        {(blueBans.length > 0 || redBans.length > 0) && (
          <div className='flex justify-between items-center bg-surface-low rounded-xl p-4 mb-8 border border-outline-variant/20 shadow-ambient'>
            <div className='flex gap-2'>
              {blueBans.map((ban: any, idx: number) => (
                <div
                  key={`b-${idx}`}
                  className='relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden grayscale opacity-70 border border-blue-900/50'
                >
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${ban.championName}.png`}
                    alt='ban'
                  />
                  <div className='absolute inset-0 bg-red-500/20'></div>
                  <div className='absolute top-1/2 left-0 w-full h-0.5 bg-red-500 -rotate-45 transform -translate-y-1/2'></div>
                </div>
              ))}
            </div>
            <p className='text-xs font-display text-on-surface-variant uppercase tracking-widest px-4'>
              Bans
            </p>
            <div className='flex gap-2'>
              {redBans.map((ban: any, idx: number) => (
                <div
                  key={`r-${idx}`}
                  className='relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden grayscale opacity-70 border border-red-900/50'
                >
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${ban.championName}.png`}
                    alt='ban'
                  />
                  <div className='absolute inset-0 bg-red-500/20'></div>
                  <div className='absolute top-1/2 left-0 w-full h-0.5 bg-red-500 -rotate-45 transform -translate-y-1/2'></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- THE ARENA BOARD --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* BLUE TEAM */}
          <section>
            <div className='mb-4 border-b border-blue-500/30 pb-2'>
              <h2 className='font-display font-bold text-blue-400 text-xl'>
                Blue Team
              </h2>
            </div>
            <div className='flex flex-col gap-3'>
              {blueTeam.map((player: any, idx: number) => (
                <div
                  key={idx}
                  className='bg-surface-low border border-blue-900/30 p-3 rounded-xl flex items-center gap-3'
                >
                  {/* Champion Icon */}
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${player.championName}.png`}
                    alt={player.championName}
                    className='w-12 h-12 rounded-lg object-cover bg-surface-lowest'
                  />

                  {/* Spells & Runes Block */}
                  <div className='flex gap-1'>
                    <div className='flex flex-col gap-1'>
                      {player.spell1Name && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${player.spell1Name}.png`}
                          className='w-5 h-5 rounded'
                          alt='spell1'
                        />
                      )}
                      {player.spell2Name && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${player.spell2Name}.png`}
                          className='w-5 h-5 rounded'
                          alt='spell2'
                        />
                      )}
                    </div>
                    <div className='flex flex-col gap-1 bg-surface-lowest rounded-md p-0.5'>
                      {player.primaryRuneIcon && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/img/${player.primaryRuneIcon}`}
                          className='w-5 h-5 rounded-full'
                          alt='rune1'
                        />
                      )}
                      {player.secondaryRuneIcon && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/img/${player.secondaryRuneIcon}`}
                          className='w-4 h-4 rounded-full mx-auto opacity-80'
                          alt='rune2'
                        />
                      )}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className='ml-2'>
                    <p className='text-on-surface font-bold text-sm truncate max-w-[140px]'>
                      {player.riotId
                        ? `${player.riotId.split('#')[0]}`
                        : player.summonerName}
                    </p>
                    <p className='text-on-surface-variant text-xs'>
                      {player.championName}
                    </p>
                  </div>
                </div>
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
                <div
                  key={idx}
                  className='bg-surface-low border border-red-900/30 p-3 rounded-xl flex items-center lg:flex-row-reverse lg:text-right gap-3'
                >
                  {/* Champion Icon */}
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${player.championName}.png`}
                    alt={player.championName}
                    className='w-12 h-12 rounded-lg object-cover bg-surface-lowest'
                  />

                  {/* Spells & Runes Block */}
                  <div className='flex gap-1'>
                    <div className='flex flex-col gap-1'>
                      {player.spell1Name && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${player.spell1Name}.png`}
                          className='w-5 h-5 rounded'
                          alt='spell1'
                        />
                      )}
                      {player.spell2Name && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${player.spell2Name}.png`}
                          className='w-5 h-5 rounded'
                          alt='spell2'
                        />
                      )}
                    </div>
                    <div className='flex flex-col gap-1 bg-surface-lowest rounded-md p-0.5'>
                      {player.primaryRuneIcon && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/img/${player.primaryRuneIcon}`}
                          className='w-5 h-5 rounded-full'
                          alt='rune1'
                        />
                      )}
                      {player.secondaryRuneIcon && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/img/${player.secondaryRuneIcon}`}
                          className='w-4 h-4 rounded-full mx-auto opacity-80'
                          alt='rune2'
                        />
                      )}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className='mr-2'>
                    <p className='text-on-surface font-bold text-sm truncate max-w-[140px]'>
                      {player.riotId
                        ? `${player.riotId.split('#')[0]}`
                        : player.summonerName}
                    </p>
                    <p className='text-on-surface-variant text-xs'>
                      {player.championName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
