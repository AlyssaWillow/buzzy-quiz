import { stringLength } from "@firebase/util";

export interface FactionCollection {
    typeId: string
    factions: Faction[];
}

export interface Faction {
    factionId: string;
    name: string;
    playerCount: PlayerCount[];
}

export interface PlayerCount {
    playerId: string;
    count: number;
}

export interface Name {
    playerId: string;
    name: string;
}

export interface factionTypeData {
    id: string;
    name: string;
    order: number;
}

export interface DisplayFactions {
    factionTypeId: string;
    factionGame: FactionGame[];
}

export interface FactionGame {
    gameId: string;
    factions: Faction[];
}