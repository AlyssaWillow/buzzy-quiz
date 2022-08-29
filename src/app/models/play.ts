import { DisplayFactions, Faction, FactionCollection } from "./faction";

export interface Play {
    date: Timestamp;
    expansionsUsed: string[];
    factions: PlayFaction[];
    gameId: string;
    gameType: string;
    location: string;
    pick: string;
    scenario: Scenario;
    winners: string[];
    scores: Score[];
}

export interface PlayFaction {
    typeId: string
    factions: playerFaction[];
}

export interface Score {
    playerName: string;
    score: string;
}

export interface Expansion {
    gameId: string;
    gameName: string;
}

export interface PlayInstance {
    date: Timestamp;
    scores: Score[];
    winners: string[];
    pick: string;
    expansionsUsed: Expansion[];
    location: string;
    variant: string;
    scenario: Scenario;
    gameNotes: string;
}

export interface PlayerWins {
    playerId: string;
    playerName: string;
    wins: number;
}

export interface Scenario {
    scenarioId: string;
    scenarioName: string;
    plays: number;
    wins: number;
}

export interface GameInstance {
    gameId: string;
    gameName: string;
    plays: PlayInstance[];
    playerWins: PlayerWins[];
    scenarios: Scenario[];
    gameImage: string;
    factions: DisplayFactions[]
    expansionsUsed: Expansion[];
    gameType: string;
    location: string;
    pick: string;
    winners: Wins[];
}

export interface Wins {
    playerId: string;
    playerName: string;
    winCount: number;
}

export interface DisplayPlay {
    date: Timestamp;
    expansionsUsed: string[];
    factions: DisplayPlayerFaction[];
    gameId: string;
    gameType: string;
    location: string;
    pick: string;
    winners: string[];
}

export interface DisplayPlayerFaction {
    playerId: string;
    playerName: string;
    faction: Faction;
}

export interface playerFaction {
    playerId: string;
    factionId: string;
}

export interface Timestamp {
    seconds: string;
    nanoseconds: string;
}