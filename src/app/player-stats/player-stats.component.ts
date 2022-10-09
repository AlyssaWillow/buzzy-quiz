import { Component, OnInit } from '@angular/core';
import { PlayDb } from '../models/play';
import { Players } from '../models/player-selection';
import { FirebaseDataService } from '../services/firebase-data.service';

interface playerWin {
  playerId: string;
  wins: number;
}

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit {

  playerWinCount = new Map();
  players: Players[] = [];
  totalGames: number = 0;

  constructor(private firebaseDataService: FirebaseDataService) { }

  ngOnInit(): void {
    this.firebaseDataService.players$.subscribe(players => {
      this.players = players;
    });
    this.firebaseDataService.plays$.subscribe(plays => {
      this.getPlayerWins(plays);
    });
  }

  getPlayerWins = (plays: PlayDb[]): void => {
    this.totalGames = plays.length;
    this.players.forEach(player => {
      this.playerWinCount.set(player.id, 
        plays.filter(play => play.winners.includes(player.id)).length);
    })
  }

}
