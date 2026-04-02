export interface SummonerData {
  puuid: string;
  gameName: string;
  tagLine: string;
  summonerLevel: number;
  profileIconId: number;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface LeagueEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface MatchData {
  matchId: string;
  gameDuration: number;
  championName: string;
  teamPosition: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  cs: number;
  visionScore: number;
  tiltScore: number;
  tiltModifiers: string[];
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

  // --- The Fun Stuff ---
  guessedRole: 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';
  tier: string; // e.g., "DIAMOND"
  rank: string; // e.g., "II"
  winRate: number; // e.g., 55
  championMastery: number; // e.g., 150000
  tags: string[]; // e.g., ["OTP", "Hot Streak", "Smurf"]
  premadeGroupId?: number; // Matches them with their duo
}
