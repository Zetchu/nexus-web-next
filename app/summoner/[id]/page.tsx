'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SummonerData, MatchData } from '@/app/types';
import { ProfileHeader } from '@/components/ProfileHeader/ProfileHeader';
import { RecentForm } from '@/components/RecentForm/RecentForm';
import { MostPlayed } from '@/components/MostPlayed/MostPlayed';
import { TopMastery } from '@/components/TopMastery/TopMastery';

interface DDragonChamp {
  key: string;
  id: string;
}

export default function SummonerStats() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Standard safe initialization for Next.js SSR
  const [summoner, setSummoner] = useState<SummonerData | null>(null);
  const [matches, setMatches] = useState<MatchData[] | null>(null);
  const [masteries, setMasteries] = useState<
    | { championId: number; championPoints: number; championLevel: number }[]
    | null
  >(null);
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
                .then((data: { data: Record<string, DDragonChamp> }) => {
                  const dict: Record<string, string> = {};
                  Object.values(data.data).forEach((champ) => {
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
          const ddragonData = (await ddragonRes.json()) as {
            data: Record<string, DDragonChamp>;
          };
          const dict: Record<string, string> = {};
          Object.values(ddragonData.data).forEach((champ) => {
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
        {/* 1. Profile Header */}
        <ProfileHeader summoner={summoner} />

        {aggregatedStats && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 2. Recent Form */}
            <RecentForm
              winRate={aggregatedStats.winRate}
              wins={aggregatedStats.wins}
              losses={aggregatedStats.losses}
              kda={aggregatedStats.kda}
              avgKills={aggregatedStats.avgKills}
              avgDeaths={aggregatedStats.avgDeaths}
              avgAssists={aggregatedStats.avgAssists}
              topRoles={aggregatedStats.topRoles}
            />

            {/* 3. Most Played */}
            <MostPlayed topChamps={aggregatedStats.topChamps} />

            {/* 4. Top Mastery */}
            <TopMastery masteries={masteries || []} champDict={champDict} />
          </div>
        )}
      </main>
    </div>
  );
}
