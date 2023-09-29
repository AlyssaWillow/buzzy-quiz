export interface PlayerSelection {
    selection: Selection2;
    players: Players;
}

export interface Selection2 {
    player: string;
    id: string;
    groupId: string;
    pick: string[],
    order: number;
}

export interface Players {
    firstName: string;
    lastName: string;
    id: string;
    collection: string[];
    acctId: string;
    color: string;
    permissions: string[];
}

export interface DisplayPlayerSelection {
    player: string;
    id: string;
    playerId: string;
    pick: string[],
    order: number;
}
