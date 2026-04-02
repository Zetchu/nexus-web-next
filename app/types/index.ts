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
