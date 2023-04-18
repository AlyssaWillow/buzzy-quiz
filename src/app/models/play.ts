import { Time } from "@angular/common";
import { AllBoardGame, Link, textId } from "./collection";
import { DisplayFactions, Faction, FactionCollection } from "./faction";
import { nameId } from "./generic";
import { ScenarioDb, ScenarioGame, ScenarioPlayDb } from "./scenario";

export interface Play {
    date: Timestamp;
    expansionsUsed: string[];
    factions: PlayFaction[];
    gameId: string;
    gameType: string;
    location: string;
    pick: string;
    scenario: Scenario | undefined;
    winners: string[];
    scores: ScoreDb[];
}

export interface PlayDb {
    id: string;
    order: number,
    date: Timestamp;
    expansionsUsed: string[];
    factions: PlayFaction[];
    customNames: CustomName[];
    gameNotes: string[];
    gameId: string;
    gameType: string;
    location: string;
    pick: string;
    scenario: ScenarioPlayDb | undefined;
    winners: string[];
    scores: ScoreDb[];
}

export interface PlayFaction {
    typeId: string
    factions: PlayerFaction[];
}

export interface Score {
    playerName: string;
    score: string;
}

export interface ScoreDb {
    playerId: string;
    score: string;
}

export interface Expansion {
    gameId: string;
    gameName: string;
}

export interface PlayInstance {
    date: Timestamp;
    scores: ScoreDb[];
    winners: string[];
    pick: string;
    expansionsUsed: Expansion[];
    location: string;
    variant: string;
    scenario: ScenarioPlayDb;
    gameNotes: string;
    factions: PlayFaction[];
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
    gameDetails: GameDetails;
    plays: PlayInstance[];
    playerWins: PlayerWins[];
    scenarios: ScenarioGame[];
    gameImage: string;
    factions: DisplayFactions[];
    expansions: ownedAndUnownedExpansions;
    gameType: string;
    location: string;
    pick: string;
    winners: Wins[];
}

export interface ownedAndUnownedExpansions {
    owned: AllBoardGame[];
    unowned: Link[];
    ownedPromo: AllBoardGame[];
    unownedPromo: Link[];
    ownedFan: AllBoardGame[];
    unownedFan: Link[];
    unownedAcc: Link[];
}

export interface GameDetails {
    id: string;
    description: string;
    yearPublished: number;
    minPlayers: number;
    maxPlayers: number;
    minTime: number;
    maxTime: number;
    boardGameCategory: Link[];
    artist: Link[];
    designer: Link[];
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

export interface PlayerFaction {
    playerId: string;
    factionId: string;
}

export interface CustomName {
    playerId: string;
    name: string;
}

export interface GamePlayerFaction {
    factionTypeId: string;
    gameId: string;
    playerId: string;
    factionId: string;
}

export interface Timestamp {
    seconds: string;
    nanoseconds: string;
}