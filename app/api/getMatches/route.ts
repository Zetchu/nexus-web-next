import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  // Note: Match-V5 uses large routing regions (europe, americas, asia).
  const region = 'europe';

  if (!puuid) {
    return NextResponse.json({ error: 'Missing puuid' }, { status: 400 });
  }

  // 1. Parse parameters safely
  let start = parseInt(searchParams.get('start') || '0', 10);
  let count = parseInt(searchParams.get('count') || '15', 10);

  // Validate and clamp to protect Riot Rate Limits
  if (isNaN(start) || start < 0) start = 0;
  if (isNaN(count) || count < 1) count = 15;
  count = Math.min(count, 15);

  const API_KEY = process.env.RIOT_API_KEY;

  try {
    // 1. Fetch Match IDs
    const idsUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&type=ranked`;
    const idsResponse = await fetch(idsUrl, {
      headers: { 'X-Riot-Token': API_KEY as string },
    });

    if (!idsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch match IDs' },
        { status: idsResponse.status },
      );
    }

    const matchIds = await idsResponse.json();
    const cleanData = [];

    // 2. Fetch individual match data sequentially to respect rate limits
    for (const matchId of matchIds) {
      // Small buffer to prevent hitting 429 Rate Limits from Riot
      await new Promise((resolve) => setTimeout(resolve, 50));

      const matchUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
      const matchRes = await fetch(matchUrl, {
        headers: { 'X-Riot-Token': API_KEY as string },
      });

      const match = await matchRes.json();

      // Find our specific player in the match
      // Using 'any' here temporarily to avoid massive Riot interface definitions
      const participant = match.info.participants.find(
        (p: { puuid: string }) => p.puuid === puuid,
      );

      // Push clean, lightweight data to the frontend
      cleanData.push({
        matchId: match.metadata.matchId,
        gameDuration: match.info.gameDuration,
        championName: participant.championName,
        teamPosition: participant.teamPosition, // e.g., "TOP", "JUNGLE"
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        win: participant.win,
        cs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
        visionScore: participant.visionScore,
      });
    }

    return NextResponse.json(cleanData, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    return NextResponse.json(
      { error: 'Server error processing matches' },
      { status: 500 },
    );
  }
}
