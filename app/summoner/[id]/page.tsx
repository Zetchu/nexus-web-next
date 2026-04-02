'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SummonerData, MatchData } from '@/app/types';

export default function SummonerStats() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Standard safe initialization for Next.js SSR
  const [summoner, setSummoner] = useState<SummonerData | null>(null);
  const [matches, setMatches] = useState<MatchData[] | null>(null);
  const [masteries, setMasteries] = useState<any[] | null>(null);
  const [champDict, setChampDict] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const decodedId = decodeURIComponent(id);
        const lastHyphenIndex = decodedId.lastIndexOf('-');
        const gName = decodedId.substring(0, lastHyphenIndex);
        const tLine = decodedId.substring(lastHyphenIndex + 1);

        // 1. CHECK CACHE FIRST (Runs safely on client side)
        let localDict: Record<string, string> = {};
        const cachedDict = localStorage.getItem('riot_champ_dict');
        if (cachedDict) {
          localDict = JSON.parse(cachedDict);
          setChampDict(localDict);
        }

        const cachedData = localStorage.getItem('riot_profile_cache');
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          if (
            parsedCache.summoner &&
            parsedCache.summoner.gameName.toLowerCase() ===
              gName.toLowerCase() &&
            parsedCache.summoner.tagLine.toLowerCase() === tLine.toLowerCase()
          ) {
            setSummoner(parsedCache.summoner);
            setMatches(parsedCache.matches);
            setMasteries(parsedCache.masteries);

            if (!cachedDict) {
              fetch(
                'https://ddragon.leagueoflegends.com/cdn/16.6.1/data/en_US/champion.json',
              )
                .then((res) => res.json())
                .then((data) => {
                  const dict: Record<string, string> = {};
                  Object.values(data.data).forEach((champ: any) => {
                    dict[champ.key] = champ.id;
                  });
                  setChampDict(dict);
                  localStorage.setItem('riot_champ_dict', JSON.stringify(dict));
                });
            }

            // Turn off skeleton instantly
            setLoading(false);
            return;
          }
        }

        // 2. FALLBACK: Fetch everything from Riot APIs
        if (!cachedDict) {
          const ddragonRes = await fetch(
            'https://ddragon.leagueoflegends.com/cdn/16.6.1/data/en_US/champion.json',
          );
          const ddragonData = await ddragonRes.json();
          const dict: Record<string, string> = {};
          Object.values(ddragonData.data).forEach((champ: any) => {
            dict[champ.key] = champ.id;
          });
          setChampDict(dict);
          localStorage.setItem('riot_champ_dict', JSON.stringify(dict));
        }

        const playerRes = await fetch(
          `/api/getPlayer?gameName=${encodeURIComponent(gName)}&tagLine=${encodeURIComponent(tLine)}`,
        );
        const playerData = await playerRes.json();
        if (!playerRes.ok)
          throw new Error(playerData.error || 'Failed to fetch player');

        setSummoner(playerData);

        const [matchesRes, masteryRes] = await Promise.all([
          fetch(`/api/getMatches?puuid=${playerData.puuid}&start=0&count=15`),
          fetch(`/api/getMastery?puuid=${playerData.puuid}`),
        ]);

        const newMatches = matchesRes.ok ? await matchesRes.json() : [];
        const newMasteries = masteryRes.ok ? await masteryRes.json() : [];

        setMatches(newMatches);
        setMasteries(newMasteries);

        localStorage.setItem(
          'riot_profile_cache',
          JSON.stringify({
            summoner: playerData,
            matches: newMatches,
            masteries: newMasteries,
          }),
        );
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const aggregatedStats = useMemo(() => {
    if (!matches || matches.length === 0) return null;

    let wins = 0;
    let kills = 0,
      deaths = 0,
      assists = 0;
    const champMap: Record<
      string,
      { games: number; wins: number; k: number; d: number; a: number }
    > = {};
    const roleMap: Record<string, number> = {};

    matches.forEach((match) => {
      if (match.win) wins++;
      kills += match.kills;
      deaths += match.deaths;
      assists += match.assists;

      const role = match.teamPosition || 'FILL';
      roleMap[role] = (roleMap[role] || 0) + 1;

      const champ = match.championName;
      if (!champMap[champ])
        champMap[champ] = { games: 0, wins: 0, k: 0, d: 0, a: 0 };
      champMap[champ].games++;
      if (match.win) champMap[champ].wins++;
      champMap[champ].k += match.kills;
      champMap[champ].d += match.deaths;
      champMap[champ].a += match.assists;
    });

    return {
      total: matches.length,
      wins,
      losses: matches.length - wins,
      winRate: Math.round((wins / matches.length) * 100),
      kda: ((kills + assists) / Math.max(1, deaths)).toFixed(2),
      avgKills: (kills / matches.length).toFixed(1),
      avgDeaths: (deaths / matches.length).toFixed(1),
      avgAssists: (assists / matches.length).toFixed(1),
      topChamps: Object.entries(champMap)
        .sort((a, b) => b[1].games - a[1].games)
        .slice(0, 3),
      topRoles: Object.entries(roleMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2),
    };
  }, [matches]);

  if (loading)
    return (
      <div className="bg-surface font-body text-on-surface min-h-screen p-6">
        <nav className="mx-auto mt-4 mb-8 max-w-4xl">
          <div className="bg-surface-variant h-6 w-32 animate-pulse rounded-md"></div>
        </nav>

        <main className="mx-auto max-w-4xl space-y-6">
          <section className="bg-surface-low border-outline-variant/20 flex flex-col items-center gap-6 rounded-2xl border p-8 md:flex-row">
            <div className="bg-surface-high h-24 w-24 shrink-0 animate-pulse rounded-2xl"></div>
            <div className="flex flex-1 flex-col items-center gap-3 md:items-start">
              <div className="bg-surface-high h-10 w-64 animate-pulse rounded-lg"></div>
              <div className="bg-surface-variant h-5 w-40 animate-pulse rounded-md"></div>
            </div>
            <div className="bg-surface-high h-12 w-40 animate-pulse rounded-xl"></div>
          </section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="bg-surface-low border-outline-variant/20 flex h-72 flex-col items-center justify-center gap-4 rounded-2xl border p-6">
              <div className="bg-surface-variant h-4 w-24 animate-pulse rounded-md"></div>
              <div className="bg-surface-high h-32 w-32 animate-pulse rounded-full"></div>
              <div className="bg-surface-variant mt-2 h-5 w-32 animate-pulse rounded-md"></div>
            </div>

            <div className="bg-surface-low border-outline-variant/20 h-72 rounded-2xl border p-6 md:col-span-2">
              <div className="bg-surface-variant mb-6 h-4 w-32 animate-pulse rounded-md"></div>
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border-outline-variant/10 flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-high h-10 w-10 animate-pulse rounded-full"></div>
                      <div className="space-y-2">
                        <div className="bg-surface-high h-4 w-24 animate-pulse rounded-md"></div>
                        <div className="bg-surface-variant h-3 w-16 animate-pulse rounded-md"></div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="bg-surface-high h-4 w-20 animate-pulse rounded-md"></div>
                      <div className="bg-surface-variant h-3 w-12 animate-pulse rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-low border-outline-variant/20 h-48 rounded-2xl border p-6 md:col-span-3">
              <div className="bg-surface-variant mb-6 h-4 w-40 animate-pulse rounded-md"></div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-surface-lowest border-outline-variant/10 flex flex-col items-center gap-2 rounded-xl border p-4"
                  >
                    <div className="bg-surface-high h-16 w-16 animate-pulse rounded-lg"></div>
                    <div className="bg-surface-high h-4 w-20 animate-pulse rounded-md"></div>
                    <div className="bg-surface-variant h-3 w-16 animate-pulse rounded-md"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );

  if (error || !summoner)
    return (
      <div className="text-error p-10 text-center">{error || 'Not Found'}</div>
    );

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen p-6">
      <nav className="mx-auto mt-4 mb-8 max-w-4xl">
        <button
          onClick={() => router.push('/')}
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          &larr; Back to Search
        </button>
      </nav>

      <main className="mx-auto max-w-4xl space-y-6">
        <section className="bg-surface-low border-outline-variant/20 flex flex-col items-center gap-6 rounded-2xl border p-8 md:flex-row">
          <div className="border-outline-variant/50 h-24 w-24 overflow-hidden rounded-2xl border-2">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/profileicon/${summoner.profileIconId}.png`}
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
            <p className="text-primary mt-1 font-bold">
              Level {summoner.summonerLevel} • {summoner.tier} {summoner.rank}
            </p>
          </div>
          <button
            onClick={() => router.push(`/live/${summoner.puuid}`)}
            className="bg-primary text-surface-lowest hover:bg-primary-container rounded-xl px-6 py-3 font-bold transition-all"
          >
            Spectate Live
          </button>
        </section>

        {aggregatedStats && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="bg-surface-low border-outline-variant/20 flex flex-col items-center justify-center rounded-2xl border p-6">
              <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-wider uppercase">
                Last 15 Games
              </h3>
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div className="border-error/20 absolute inset-0 rounded-full border-8"></div>
                <div
                  className="border-primary absolute inset-0 rounded-full border-8"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% ${aggregatedStats.winRate}%, 0 ${aggregatedStats.winRate}%)`,
                  }}
                ></div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {aggregatedStats.winRate}%
                  </div>
                  <div className="text-on-surface-variant text-xs">
                    {aggregatedStats.wins}W {aggregatedStats.losses}L
                  </div>
                </div>
              </div>
              <div className="border-outline-variant/10 mt-4 w-full border-b pb-4 text-center">
                <div className="font-bold">{aggregatedStats.kda}:1 KDA</div>
                <div className="text-on-surface-variant text-sm">
                  {aggregatedStats.avgKills} /{' '}
                  <span className="text-error">
                    {aggregatedStats.avgDeaths}
                  </span>{' '}
                  / {aggregatedStats.avgAssists}
                </div>
              </div>

              <div className="mt-4 flex w-full flex-col items-center text-center">
                <div className="text-on-surface-variant mb-2 text-[10px] font-bold tracking-wider uppercase">
                  Preferred Roles
                </div>
                <div className="flex gap-4">
                  {aggregatedStats.topRoles.map(([role, count]) => (
                    <div key={role} className="flex flex-col items-center">
                      <div className="bg-surface-high border-outline-variant/20 text-secondary rounded-lg border px-3 py-1 text-xs font-bold">
                        {role === 'UTILITY' ? 'SUPPORT' : role}
                      </div>
                      <span className="text-on-surface-variant mt-1 text-[10px]">
                        {count} Games
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-surface-low border-outline-variant/20 rounded-2xl border p-6 md:col-span-2">
              <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-wider uppercase">
                Most Played (Recent)
              </h3>
              <div className="flex flex-col gap-3">
                {aggregatedStats.topChamps.map(([champName, stats]: any) => {
                  const winRate = Math.round((stats.wins / stats.games) * 100);
                  const kda = (
                    (stats.k + stats.a) /
                    Math.max(1, stats.d)
                  ).toFixed(2);

                  return (
                    <div
                      key={champName}
                      className="border-outline-variant/10 flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${champName}.png`}
                          className="h-10 w-10 rounded-full"
                          alt={champName}
                        />
                        <div>
                          <div className="font-bold">{champName}</div>
                          <div className="text-on-surface-variant text-xs">
                            {stats.games} games played
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${winRate >= 50 ? 'text-primary' : 'text-error'}`}
                        >
                          {winRate}% Win Rate
                        </div>
                        <div className="text-on-surface-variant text-xs">
                          {kda} KDA
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-surface-low border-outline-variant/20 rounded-2xl border p-6 md:col-span-3">
              <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-wider uppercase">
                Lifetime Top Mastery
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {masteries?.map((mastery, index) => {
                  const champName =
                    champDict[mastery.championId.toString()] || 'Unknown';
                  return (
                    <div
                      key={mastery.championId}
                      className="bg-surface-lowest border-outline-variant/10 relative flex flex-col items-center rounded-xl border p-4"
                    >
                      {index === 0 && (
                        <span className="absolute -top-3 text-xl">👑</span>
                      )}
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${champName}.png`}
                        className={`h-16 w-16 rounded-lg shadow-md ${index === 0 ? 'ring-2 ring-yellow-500' : ''}`}
                        alt={champName}
                      />
                      <div className="mt-3 font-bold">{champName}</div>
                      <div className="text-secondary text-sm font-medium">
                        {(mastery.championPoints / 1000).toFixed(0)}k pts
                      </div>
                      <div className="text-on-surface-variant mt-1 text-xs">
                        Level {mastery.championLevel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
