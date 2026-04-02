import { NextResponse } from 'next/server';

interface DDragonItem {
  key: string;
  id: string;
}

interface MatchBan {
  championId: number;
  teamId: number;
}

interface MatchParticipant {
  championId: number;
  spell1Id: number;
  spell2Id: number;
  perks?: {
    perkIds?: number[];
    perkSubStyle?: number;
  };
  [key: string]: unknown;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  if (!puuid)
    return NextResponse.json({ error: 'Missing puuid' }, { status: 400 });

  const API_KEY = process.env.RIOT_API_KEY;

  try {
    const headers = { 'X-Riot-Token': API_KEY as string };
    const platform = 'eun1'; // Change to match your server if needed

    // 1. Fetch the live game data (Reverted back to by-summoner!)
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

    // Add specific catching for Rate Limits
    if (matchRes.status === 429)
      throw new Error('Riot API Rate Limit Exceeded. Try again in a moment.');
    if (!matchRes.ok)
      throw new Error(
        `Failed to fetch match data (Status: ${matchRes.status})`,
      );

    const matchData = await matchRes.json();

    // 2. Fetch Ranked Data for all 10 players SEQUENTIALLY to avoid Rate Limits
    const participantsWithRanks = [];
    for (const player of matchData.participants) {
      try {
        // Add a 100ms delay between players.
        // 1 Spectator + 10 Ranks + 10 Masteries = 21 requests.
        // Riot's dev limit is 20 per second! This delay prevents crashing.
        await new Promise((resolve) => setTimeout(resolve, 100));

        const leagueUrl = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${player.puuid}`;
        const masteryUrl = `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${player.puuid}/by-champion/${player.championId}`;

        const [leagueRes, masteryRes] = await Promise.all([
          fetch(leagueUrl, { headers }),
          fetch(masteryUrl, { headers }),
        ]);

        let tier = 'UNRANKED';
        let rank = '';
        let winRate = 0;
        let totalGames = 0;

        if (leagueRes.ok) {
          const leagueData = await leagueRes.json();
          const soloQ = leagueData.find(
            (entry: any) => entry.queueType === 'RANKED_SOLO_5x5',
          );

          if (soloQ) {
            tier = soloQ.tier;
            rank = soloQ.rank;
            totalGames = soloQ.wins + soloQ.losses;
            winRate = Math.round((soloQ.wins / totalGames) * 100);
          }
        }

        let masteryPoints = 0;
        let masteryLevel = 0;

        if (masteryRes.ok) {
          const masteryData = await masteryRes.json();
          masteryPoints = masteryData.championPoints || 0;
          masteryLevel = masteryData.championLevel || 0;
        }

        participantsWithRanks.push({
          ...player,
          tier,
          rank,
          winRate,
          totalGames,
          masteryPoints,
          masteryLevel,
        });
      } catch (err) {
        participantsWithRanks.push({
          ...player,
          tier: 'UNRANKED',
          rank: '',
          winRate: 0,
          totalGames: 0,
          masteryPoints: 0,
          masteryLevel: 0,
        });
      }
    }

    // 3. Dynamically Fetch Data Dragon Dictionaries
    // Fetches the exact current patch automatically so you never get 403s again!
    const versionRes = await fetch(
      'https://ddragon.leagueoflegends.com/api/versions.json',
    );
    const versions = await versionRes.json();
    const PATCH = versions[0];

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

    const championList = Object.values(ddragonData.data) as DDragonItem[];
    const spellList = Object.values(spellsData.data) as DDragonItem[];

    // 4. Map the Ban List
    const enrichedBans = matchData.bannedChampions.map((b: MatchBan) => {
      const champ = championList.find((c) => parseInt(c.key) === b.championId);
      return { ...b, championName: champ ? champ.id : null };
    });

    // 5. Enrich the Participants
    const enrichedParticipants = participantsWithRanks.map(
      (p: MatchParticipant) => {
        const champ = championList.find(
          (c) => parseInt(c.key) === p.championId,
        );
        const spell1 = spellList.find((s) => parseInt(s.key) === p.spell1Id);
        const spell2 = spellList.find((s) => parseInt(s.key) === p.spell2Id);

        let primaryIcon = '';
        let secondaryIcon = '';

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
      },
    );

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
