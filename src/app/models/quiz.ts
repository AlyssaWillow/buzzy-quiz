export interface QuizMaster {
    gameCode: string;
    players: QuizPlayers[];
  }
  
  export interface QuizPlayers {
    name: string;
    id: string;
    score: number;
  }
  
  export  interface QuizController {
    question: string;
    playerName: string;
    gameCode: string;
    points: number;
  }

  export interface buzzIn {
    gameCode: string;
    player: string;
    timestamp: timestamp;
    questionNumber: number;
 }

 interface timestamp {
  nanoseconds: number;
  seconds: number;
 }