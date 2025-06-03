export interface Team {
  teamApiId: number;
  teamFifaApiId: number;
  teamLongName: string;
  teamShortName: string;
}

export interface League {
  id: string;
  leagueId: number;
  name: string;
  countryId: number;
}

export interface Match {
  id: string;
  matchApiId: number;
  countryId: number;
  leagueId: number;
  season: string | null;
  stage: number;
  date: string;
  homeTeamApiId: number;
  awayTeamApiId: number;
  homeTeamGoal: number;
  awayTeamGoal: number;
  b365h: number | null;
  b365d: number | null;
  b365a: number | null;
  bwh: number | null;
  bwd: number | null;
  bwa: number | null;
  iwh: number | null;
  iwd: number | null;
  iwa: number | null;
}

export interface MatchWithDetails {
  match: Match;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
}

export interface Country {
  countryId: number;
  name: string;
}
