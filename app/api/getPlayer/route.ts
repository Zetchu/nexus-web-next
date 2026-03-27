import { LeagueEntry } from '@/app/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract query parameters in the App Router
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: 'Missing gameName or tagLine' },
      { status: 400 },
    );
  }

  const API_KEY = process.env.RIOT_API_KEY;

  try {
    const headers = { 'X-Riot-Token': API_KEY as string };

    // --- HOP 1: Get PUUID ---
    const accountUrl = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
    const accountRes = await fetch(accountUrl, { headers });

    if (!accountRes.ok) {
      return NextResponse.json(
        { error: 'Player not found in Riot system' },
        { status: accountRes.status },
      );
    }

    const accountData = await accountRes.json();
    const puuid = accountData.puuid;

    // --- HOPS 2 & 3: Parallel Fetching ---
    const platform = 'eun1';
    const [summonerRes, leagueRes] = await Promise.all([
      fetch(
        `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
        { headers },
      ),
      fetch(
        `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
        { headers },
      ),
    ]);

    if (!summonerRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch summoner profile' },
        { status: summonerRes.status },
      );
    }

    const summonerData = await summonerRes.json();
    let soloQueue: LeagueEntry | null = null;

    if (leagueRes.ok) {
      const leagueData = await leagueRes.json();
      soloQueue = leagueData.find(
        (queue: LeagueEntry) => queue.queueType === 'RANKED_SOLO_5x5',
      );
    }

    return NextResponse.json(
      {
        puuid: puuid,
        gameName: accountData.gameName,
        tagLine: accountData.tagLine,
        summonerLevel: summonerData.summonerLevel,
        profileIconId: summonerData.profileIconId,
        tier: soloQueue ? soloQueue.tier : 'UNRANKED',
        rank: soloQueue ? soloQueue.rank : '',
        leaguePoints: soloQueue ? soloQueue.leaguePoints : 0,
        wins: soloQueue ? soloQueue.wins : 0,
        losses: soloQueue ? soloQueue.losses : 0,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server error while fetching player data' },
      { status: 500 },
    );
  }
}
