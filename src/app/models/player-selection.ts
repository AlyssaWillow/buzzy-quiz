export interface PlayerSelection {
    selection: Selection2;
    players: Players;
}

export interface Selection2 {
    player: string;
    pick: string[],
    order: number;
}

export interface Players {
    firstName: string;
    lastName: string;
    id: string;
}

export interface DisplayPlayerSelection {
    player: string;
    playerId: string;
    pick: string[],
    order: number;
}
