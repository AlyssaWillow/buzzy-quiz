import { stringLength } from "@firebase/util";

export interface Faction {
    factionId: string;
    name: string;
    playerCount: PlayerCount[];
}

interface PlayerCount {
    playerId: string;
    playerName: string;
    count: number;
}

export interface Name {
    playerId: string;
    name: string;
}