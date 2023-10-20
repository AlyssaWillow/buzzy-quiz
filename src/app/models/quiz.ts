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
  }

  export interface buzzIn {
    gameCode: string;
    player: string;
    timestamp: Date;
    questionNumber: number;
 }