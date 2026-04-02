import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  // Note: Mastery uses the platform routing (eun1, euw1, na1, etc.)
  const platform = 'eun1';

  if (!puuid)
    return NextResponse.json({ error: 'Missing puuid' }, { status: 400 });

  const API_KEY = process.env.RIOT_API_KEY;

  try {
    const res = await fetch(
      `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3`,
      { headers: { 'X-Riot-Token': API_KEY as string } },
    );

    if (!res.ok) throw new Error('Failed to fetch mastery');

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Mastery Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
