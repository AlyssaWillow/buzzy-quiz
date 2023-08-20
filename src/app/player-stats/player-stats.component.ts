import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PlayDb } from '../models/play';
import { Players } from '../models/player-selection';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import { FirebaseDataService } from '../services/firebase-data.service';
import { UtilsService } from '../services/utils.service';
import { BoardGame } from '../models/collection';
import { CycleDb, ScenarioDb, ScenarioDb2 } from '../models/scenario';
import { GameWin, playerWin, playerWinDisplay } from '../models/analytics';

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
  playerWinGames: playerWin[] = [];
  playerWinGamesDisplay: playerWinDisplay[] = [];
  players: Players[] = [];
  totalGames: number = 0;
  competitiveGames: number = 0;
  coopGames: number = 0;
  semiCoopGames: number = 0;
  bothCol: BoardGame[] = [];
  plays: PlayDb[] = [];
  scenariosFromDb: ScenarioDb2[] = [];
  cycleFromDb: CycleDb[] = [];
  gamesPlays: {num: number, game: PlayDb}[] = [];
  newGames: string[] = [];
  newScenarios: string[] = [];

  constructor(private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService) { }

  ngOnInit(): void {
    combineLatest(
      this.firebaseDataService.plays$,
      this.firebaseDataService.players$,
      this.firebaseDataService.scenarios$,
      this.firebaseDataService.cycles$,
      this.boardGameGeekService.lemanCollection$,
      this.boardGameGeekService.hendricksonCollection$,
      this.boardGameGeekService.hendricksonOverflow$
    ).subscribe(
      ([plays, players, scenarios, cycles, lem, hen, henOver]) => {
        this.plays = plays;
        this.scenariosFromDb = scenarios;
        this.cycleFromDb = cycles;
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

        henOver?.item.forEach((game: BoardGame) => {
          if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
            game.owner = 'own-hen';
            this.bothCol.push(game);
          } else {
            this.bothCol?.filter(e => { 
              if(e.objectid === game.objectid && game.owner !== 'own-hen') {
                game.owner = 'own-bot'
              }
            })
          }
        });
        
        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1);
        this.getMostPlayedGames();
        this.getNewGamePlays();
        this.getNewScenarios();
      });
      this.getMostPlayedGames();
      this.getNewGamePlays();
      this.getNewScenarios();

  }

  getPlayerWins = (plays: PlayDb[]): void => {
    this.playerWinGames = []
    this.playerWinGamesDisplay = []
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
      this.playerWinCount.set(player.id, filteredPlays.filter(play => play.winners.includes(player.id)).length);
      this.playerWinGames.push({playerId: player.id, games: filteredPlays.filter(play => play.winners.includes(player.id))})
    })
    this.playerWinGames.forEach(playerGame1 => {
      let pgd: playerWinDisplay = {playerId: playerGame1.playerId, games: []};
      let foundGames: string[] = [];

      playerGame1.games.forEach(game=> {
        if (!foundGames.includes(game.gameId)) {
          let newGame: GameWin = {
            gameId: game.gameId,
            wins: 1
          }
          pgd.games.push(newGame)
          foundGames.push(game.gameId)
        } else {
          pgd.games.filter(f=> f.gameId === game.gameId)[0].wins += 1
        }
      })
      pgd.games.sort((a, b) => (a.wins > b.wins) ? -1 : 1)
      this.playerWinGamesDisplay.push(pgd)
    })
  }

  addStartEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    this.getPlayerWins(this.plays);
    this.getMostPlayedGames();
    this.getNewGamePlays();
    this.getNewScenarios();
  }

  addEndEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDate = event.value;
    this.getPlayerWins(this.plays);
    this.getMostPlayedGames();
    this.getNewGamePlays();
    this.getNewScenarios();
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
    let foundGame: string[] = ["68448", "303554", "171672", "184921", "199792", "259996", "280136", "224517", 
    "270844", "198522", "205059", "206547", "241533", "229987","167791", "255681", "218127", "247030", "230123", 
    "202825", "226297", "231965", "220308", "237182", "241386", "272637", "233247", "253344","286096", "315708",
    "266192","195421", "129090","279254","156129","265736","284760","242684","194594","268201","281332","291794",
    "244271","146508","256874","16992","2381","160499","926","13","150376","198740","113924","131357", "301255"];
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
            this.newGames.push(plEx);
          }
        })
      }
    });
  }

  getNewScenarios = () => {
    this.newScenarios =[];
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
      if (prev?.scenario?.id) {
        if (!foundGame.includes(prev.scenario.id)) {
          foundGame.push(prev.scenario.id);
        }
      }
    })
    filteredPlays.forEach(play => {
      if (play?.scenario?.id) {
        if (!foundGame.includes(play.scenario.id)) {
          foundGame.push(play.scenario.id);
          this.newScenarios.push(play.scenario.id);
        }
      }
    });
  }
}
