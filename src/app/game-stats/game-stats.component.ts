import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFirestore, 
  AngularFirestoreCollection, 
  AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { DisplayPlayerSelection, Players } from '../home/player-selection';
import { Faction } from '../models/faction';
import { Observable } from 'rxjs';
import { DisplayPlay, GameInstance, Play, PlayInstance, Timestamp, Wins } from '../models/play';
import { Locations } from '../models/locations';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import { BoardGame, GameCollection } from '../models/collection';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent implements OnInit {
  private playerCol: AngularFirestoreCollection<Players>;
  private factionsCol: AngularFirestoreCollection<Faction>;
  private playsCol: AngularFirestoreCollection<Play>;
  private locationCol: AngularFirestoreCollection<Locations>;

  players$: Observable<Players[]>;
  factions$: Observable<Faction[]>;
  plays$: Observable<Play[]>;
  locations$: Observable<Locations[]>;
  lemanCollection$: Observable<GameCollection>;
  hendCollection$: Observable<GameCollection>;

  playData: GameInstance[] = [];
  bothCol: BoardGame[] = [];
  players: Players[];

  constructor(private afs: AngularFirestore,
              private boardGameGeekService: BoardGameGeekService,
              public authenticationService: AuthenticationService) {
    this.playerCol = afs.collection('tabletop-syndicate').doc('player-data').collection('player-names');
    this.playsCol = afs.collection('play-history');
    this.locationCol = afs.collection('tabletop-syndicate').doc('location-data').collection('location-names');
    this.factionsCol = afs.collection('factions');

    this.players$ = this.playerCol.valueChanges();
    this.plays$ = this.playsCol.valueChanges();
    this.locations$ = this.locationCol.valueChanges();
    this.factions$ = this.factionsCol.valueChanges();

    this.boardGameGeekService.getCollections();
    this.lemanCollection$ = this.boardGameGeekService.lemanCollection$;
    this.hendCollection$ = this.boardGameGeekService.hendricksonCollection$

    this.players = [];
  }

  ngOnInit(): void {
    this.plays$.subscribe(plays => {
      this.players$.subscribe(players => {
        this.locations$.subscribe(locations => {
          this.factions$.subscribe(factions => {
            this.players = players;
            this.playData = this.collectGameData(plays, players, locations, factions);
          });
        });
      });
    });
  }

  getGameIdList = (plays: Play[]) => {
    let gameList: string[] = [];
    plays.forEach((play) => {
      if (!gameList.includes(play.gameId)) {
        gameList.push(play.gameId);
      }
    });
    return gameList;
  }

  createNewGamePlay = () => {
    let gamePlay: PlayInstance = {
      date: {
        seconds: '',
        nanoseconds: ''
      },
      scores: [],
      winners: [],
      pick: '',
      expansionsUsed: [],
      location: '',
      variant: '',
      scenario: {
        scenarioId: '',
        scenarioName: '',
        plays: 0,
        wins: 0
      },
      gameNotes: ''
    };
    return gamePlay;
  }
   
  collectGameData = (plays: Play[], players: Players[], locations: Locations[], factions: Faction[]): GameInstance[] => {
    let games: GameInstance[] = [];
    let gameList: string[] = this.getGameIdList(plays);
    let gameInstance: GameInstance;
    let gamePlay: PlayInstance;
  
    gameList.forEach((id) => {
      gameInstance = this.getGameAttributes(id);
      
   
      plays.forEach((play) => {
        gamePlay = this.createNewGamePlay();
        if (id === play.gameId) {
          gamePlay.date = play.date;
          gamePlay.scores = play.scores;
          gamePlay.winners = play.winners;
          gamePlay.pick = play.pick;
          //if (play.scenario?.scenarioId !== undefined) {
          //  gameInstance.scenarios = this.createScenario(gameInstance.scenarios, play);
          //}
          if (play.winners?.length > 0) {
            gameInstance.winners = this.createWinners(gameInstance.winners, play);
          }
          //if (play.factions?.length > 0) {
          //  gameInstance.factions = this.createFactions(gameInstance.factions, play);
          //}
          gameInstance.plays.push(gamePlay);
        }
      });
   
      games.push(gameInstance);
    });
    games.sort((a, b) => (a.gameName > b.gameName) ? 1 : -1)
    return games;
  }

  getGameAttributes = (id: string): GameInstance => {
    let gameInstance: GameInstance = {
      gameId: '',
      gameName: '',
      plays: [],
      playerWins: [],
      scenarios: [],
      gameImage: '',
      factions: [],
      expansionsUsed: [],
      gameType: '',
      location: '',
      pick: '',
      winners: []
    };
    gameInstance.gameId = id;

    this.lemanCollection$.subscribe(lem => {
      this.hendCollection$.subscribe(hen => {

        this.bothCol = lem.item;
        this.bothCol.concat(hen.item);
      });
    });

    this.bothCol.forEach(game => {
      if (game.objectid === id) {
        console.log('match')
        gameInstance.gameImage = game.image;
        gameInstance.gameName = game.name.text;
      }
    });

    return gameInstance;
  }

  createWinners = (winners: Wins[], play: Play): Wins[] => {

    if (winners.length < 4) {
      let win: Wins;
      for (let player of this.players) {
        win = {
          playerId: '',
          playerName: '',
          winCount: 0
        }
        console.log(this.players, player);
        win.playerId = player.id;
        win.playerName = player.firstName;
        winners.push(win);
      }
    }

    for(let winner of play.winners) {
      for(let players of winners) {
        if(players.playerId === winner) {
          players.winCount++;
        }
      }
    }
    winners.sort((a, b) => (a.winCount < b.winCount) ? 1 : -1)
    return winners;
  }

  createFactions = (gameInstance: GameInstance, play: Play): string[] => {
    let winners: string[] = [];
    return winners;
  }
}
