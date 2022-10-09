export interface PlayerSelection {
    selection: Selection;
    players: Players;
}

export interface Selection {
    player: string;
    pick: string,
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
    pick: string,
    order: number;
}
