import { PlayDb } from "./play";

export interface playerWin {
    playerId: string;
    games: PlayDb[];
  }
  
export  interface playerWinDisplay {
    playerId: string;
    games: GameWin[];
  }
  
export interface GameWin {
    gameId: string;
    wins: number
  }