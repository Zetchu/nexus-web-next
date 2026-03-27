import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  if (!puuid)
    return NextResponse.json({ error: 'Missing puuid' }, { status: 400 });

  const API_KEY = process.env.RIOT_API_KEY;

  try {
    const headers = { 'X-Riot-Token': API_KEY as string };
    const platform = 'eun1';

    // 1. Fetch the live game data
    const matchRes = await fetch(
      `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`,
      { headers },
    );

    if (matchRes.status === 404) {
      return NextResponse.json(
        { isLive: false, message: 'Summoner is not currently in a match.' },
        { status: 200 },
      );
    }
    if (!matchRes.ok) throw new Error('Failed to fetch match data');

    const matchData = await matchRes.json();

    // 2. Fetch Data Dragon Dictionaries in Parallel (Extremely Fast)
    const PATCH = '16.6.1';
    const [ddragonRes, spellsRes, runesRes] = await Promise.all([
      fetch(
        `https://ddragon.leagueoflegends.com/cdn/${PATCH}/data/en_US/champion.json`,
      ),
      fetch(
        `https://ddragon.leagueoflegends.com/cdn/${PATCH}/data/en_US/summoner.json`,
      ),
      fetch(
        `https://ddragon.leagueoflegends.com/cdn/${PATCH}/data/en_US/runesReforged.json`,
      ),
    ]);

    const ddragonData = await ddragonRes.json();
    const spellsData = await spellsRes.json();
    const runesData = await runesRes.json();

    const championList = Object.values(ddragonData.data) as any[];
    const spellList = Object.values(spellsData.data) as any[];

    // 3. Map the Ban List
    const enrichedBans = matchData.bannedChampions.map((b: any) => {
      const champ = championList.find((c) => parseInt(c.key) === b.championId);
      return { ...b, championName: champ ? champ.id : null };
    });

    // 4. Enrich the Participants (Spells & Runes)
    const enrichedParticipants = matchData.participants.map((p: any) => {
      const champ = championList.find((c) => parseInt(c.key) === p.championId);
      const spell1 = spellList.find((s) => parseInt(s.key) === p.spell1Id);
      const spell2 = spellList.find((s) => parseInt(s.key) === p.spell2Id);

      let primaryIcon = '';
      let secondaryIcon = '';

      // Find Rune Image Paths
      const primaryKeystoneId = p.perks?.perkIds?.[0];
      const secondaryStyleId = p.perks?.perkSubStyle;

      for (const tree of runesData) {
        if (tree.id === secondaryStyleId) secondaryIcon = tree.icon;
        for (const slot of tree.slots) {
          for (const rune of slot.runes) {
            if (rune.id === primaryKeystoneId) primaryIcon = rune.icon;
          }
        }
      }

      return {
        ...p,
        championName: champ ? champ.id : 'Unknown',
        spell1Name: spell1 ? spell1.id : '',
        spell2Name: spell2 ? spell2.id : '',
        primaryRuneIcon: primaryIcon,
        secondaryRuneIcon: secondaryIcon,
      };
    });

    return NextResponse.json(
      {
        isLive: true,
        gameId: matchData.gameId,
        gameMode: matchData.gameMode,
        gameLength: matchData.gameLength,
        bannedChampions: enrichedBans,
        participants: enrichedParticipants,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Match API Error:', error);
    return NextResponse.json(
      { error: 'Server error while fetching live match' },
      { status: 500 },
    );
  }
}
