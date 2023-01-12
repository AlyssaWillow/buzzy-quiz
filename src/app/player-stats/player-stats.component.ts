import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PlayDb } from '../models/play';
import { Players } from '../models/player-selection';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import { FirebaseDataService } from '../services/firebase-data.service';
import { UtilsService } from '../services/utils.service';
import { BoardGame } from '../models/collection';

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
  date1: Date | null = null;
  date2: Date | null = null;
  startDate: Date | null = new Date(0);
  endDate: Date | null = new Date();
  playerWinCount = new Map();
  players: Players[] = [];
  totalGames: number = 0;
  competitiveGames: number = 0;
  coopGames: number = 0;
  semiCoopGames: number = 0;
  bothCol: BoardGame[] = [];
  plays: PlayDb[] = [];
  gamesPlays: {num: number, game: PlayDb}[] = [];
  newGames: string[] = [];

  constructor(private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService) { }

  ngOnInit(): void {
    combineLatest(
      this.firebaseDataService.plays$,
      this.firebaseDataService.players$,
      this.boardGameGeekService.lemanCollection$,
      this.boardGameGeekService.hendricksonCollection$
    ).subscribe(
      ([plays, players, lem, hen]) => {
        this.plays = plays;
        this.getPlayerWins(plays);
        this.players = players;
        lem?.item.forEach((game: BoardGame) => {
          if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
            game.owner = 'own-lem';
            this.bothCol?.push(game);
          } else {
            this.bothCol?.filter(e => { 
              if(e.objectid === game.objectid) {
                game.owner = 'own-bot'
              }
            })
          }
        }); 
        hen?.item.forEach((game: BoardGame) => {
          if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
            game.owner = 'own-hen';
            this.bothCol.push(game);
          } else {
            this.bothCol?.filter(e => { 
              if(e.objectid === game.objectid) {
                game.owner = 'own-bot'
              }
            })
          }
        });
        
        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1);
        this.getMostPlayedGames();
        this.getNewGamePlays();
      });
      this.getMostPlayedGames();
      this.getNewGamePlays();
  }

  getPlayerWins = (plays: PlayDb[]): void => {
    let filteredPlays = plays.filter(ref => {
      let date: Date = new Date(parseInt(ref.date.nanoseconds));  
      if (this.startDate && this.endDate) {
        if (date > this.startDate && date < this.endDate) {
          return true;
        }
      }
      return false;
    });
    this.totalGames = filteredPlays.length;
    this.competitiveGames = filteredPlays.filter(ref => ref.gameType === 'gam-001').length;
    this.coopGames = filteredPlays.filter(ref => ref.gameType === 'gam-002').length;
    this.semiCoopGames = filteredPlays.filter(ref => ref.gameType === 'gam-003').length;
    this.players.forEach(player => {
      this.playerWinCount.set(player.id, 
        filteredPlays.filter(play => play.winners.includes(player.id)).length);
    })
  }

  addStartEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    this.getPlayerWins(this.plays);
    this.getMostPlayedGames();
    this.getNewGamePlays();
  }

  addEndEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    this.getPlayerWins(this.plays);
    this.getMostPlayedGames();
    this.getNewGamePlays();
  }

  getMostPlayedGames = (): void => { 
    let gamesWithPlays: {num: number, game: PlayDb}[] = [];
    let foundGame: string[] = [];
    let filteredPlays = this.plays.filter(ref => {
      let date: Date = new Date(parseInt(ref.date.nanoseconds));  
      if (this.startDate && this.endDate) {
        if (date >= this.startDate && date <= this.endDate) {
          return true;
        }
      }
      return false;
    });

    filteredPlays.forEach(play => {
      if (foundGame.includes(play.gameId)) {
        gamesWithPlays.forEach(game => {
          if (game.game.gameId === play.gameId) {
            game.num += 1;
          }
        })
      } else {
        foundGame.push(play.gameId);
        gamesWithPlays.push({num: 1, game: play})
      }
    })
    gamesWithPlays.sort((a, b) => (a.num < b.num) ? 1 : -1)
    this.gamesPlays = gamesWithPlays;
  }

  getNewGamePlays = () => {
    this.newGames =[];
    let foundGame: string[] = [];
    let filteredPlays = this.plays.filter(ref => {
      let date: Date = new Date(parseInt(ref.date.nanoseconds));  
      if (this.startDate && this.endDate) {
        if (date >= this.startDate && date <= this.endDate) {
          return true;
        }
      }
      return false;
    });

    let previousPlays = this.plays.filter(ref => {
      let date: Date = new Date(parseInt(ref.date.nanoseconds));  
      if (this.startDate) {
        if (date < this.startDate) {
          return true;
        }
      }
      return false;
    });

    previousPlays.forEach(prev => {
      if (!foundGame.includes(prev.gameId)) {
        foundGame.push(prev.gameId);
      }
      if (prev.expansionsUsed) {
        prev.expansionsUsed.forEach(prevEx => {
          if (!foundGame.includes(prevEx)) {
            foundGame.push(prevEx);
          }
        })
      }
    })
    filteredPlays.forEach(play => {
      if (!foundGame.includes(play.gameId)) {
        foundGame.push(play.gameId);
        this.newGames.push(play.gameId);
      }
      if (play.expansionsUsed) {
        play.expansionsUsed.forEach(plEx => {
          if (!foundGame.includes(plEx)) {
            foundGame.push(plEx);
            console.log(plEx);
            this.newGames.push(plEx);
          }
        })
      }
    });
  }
}
