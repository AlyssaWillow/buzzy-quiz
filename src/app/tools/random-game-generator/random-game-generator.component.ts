import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { BoardGame } from 'src/app/models/collection';
import { PlayDb } from 'src/app/models/play';
import { Players } from 'src/app/models/player-selection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

interface GameWeight {
  'game': BoardGame, 
  'weight': number
}
interface ReturnData {
  'minTime': number,
  'maxTime': number,
  'minPlayers': number,
  'maxPlayers': number,
  'games': BoardGame[]
}
@Component({
  selector: 'tts-random-game-generator',
  templateUrl: './random-game-generator.component.html',
  styleUrls: ['./random-game-generator.component.scss']
})
export class RandomGameGeneratorComponent implements OnInit {
  
  bothCol: BoardGame[] = [];
  plays: PlayDb[] = [];
  players: Players[] = [];
  minTime: number = 0;
  maxTime: number = 0;
  playerCount: number = 4;
  noOfPlayers: number = 4;
  selectedMinPlayTime: number = 0;
  selectedMaxPlayTime: number = 0;
  selectedOwnedBy: string = 'Either';
  numberOfPlayers: number[] = [...Array(100).keys()];
  playTimeSelect: number[] = [...Array(100).keys()];
  ownedBy: string = 'either';
  scenarioBased: boolean = false;
  data: any;
  returnData: ReturnData = {
    'minTime': 0,
    'maxTime': 0,
    'minPlayers': 0,
    'maxPlayers': 0,
    'games': []
  }
  selectedGame: BoardGame = {
    objecttype: null,
    bggRank: 0,
    objectid: null,
    subtype: null,
    collid: '',
    name: {
      text: "",
      sortorder: 0
    },
    sortindex: null,
    yearpublished: null,
    image: '',
    thumbnail: null,
    numplays: 0,
    stats: {
      minplayers: "0", maxplayers: "0", minplaytime: "0", maxplaytime: "0",playingtime: "0", numowned: "0", 
      rating: {
        rating: "0", usersrated: "0", average: "0", bayesaverage: "0", stddev: "0", median: "0", ranks: []
      },
    },
    status: {own: 0, prevowned: 0, fortrade: 0, want: 0, wanttoplay: 0, wanttobuy: 0, 
      wishlist: 0, preordered: 0, lastmodified: ""},
    owner: ''
  };

  constructor(private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService
  ) { }

  ngOnInit(): void {
    combineLatest(
      this.firebaseDataService.plays$,
      this.firebaseDataService.players$,
      this.boardGameGeekService.lemanCollection$,
      this.boardGameGeekService.hendricksonCollection$,
      this.boardGameGeekService.hendricksonOverflow$
    ).subscribe(
      ([plays, players, lem, hen, henOver]) => {
        this.plays = plays;
        this.players = players;
        this.bothCol = [];

        let lemDeDup: string[] = [];
        let henDeDup: string[] = [];

        lem?.item.forEach((game: BoardGame) => {
          if (game.objectid ? !lemDeDup.includes(game.objectid) : false) {
          if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
            if (game?.objectid) {
              lemDeDup.push(game.objectid);
            }
            game.owner = 'own-lem';
            this.bothCol?.push(game);
          } else {
            this.bothCol?.filter(e => { 
              if(e.objectid === game.objectid) {
                e.owner = 'own-bot';
              }
            })
          }
        }
        }); 

        hen?.item.forEach((game: BoardGame) => {
          if (game.objectid ? !henDeDup.includes(game.objectid) : false) {
          if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
            if (game?.objectid) {
              henDeDup.push(game.objectid);
            }
            game.owner = 'own-hen';
            this.bothCol.push(game);
          } else {
            this.bothCol?.filter(e => { 
              if(e.objectid === game.objectid) {
                e.owner = 'own-bot';
              }
            })
          }
        }
        });

        henOver?.item.forEach((game: BoardGame) => {
          if (game.objectid ? !henDeDup.includes(game.objectid) : false) {
          if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
            if (game?.objectid) {
              henDeDup.push(game.objectid);
            }
            game.owner = 'own-hen';
            this.bothCol.push(game);
          } else {
            this.bothCol?.filter(e => { 
              if(e.objectid === game.objectid && e.owner !== 'own-hen') {
                e.owner = 'own-bot';
              }
            })
          }
        }
        });
        
        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1);
        var minMax = this.getMinMax(this.bothCol);
        this.returnData.minTime = minMax['minTime'];
        this.returnData.maxTime = minMax['maxTime'];
        this.returnData.minPlayers = minMax['minPlayers'];
        this.returnData.maxPlayers = minMax['maxPlayers'];
        this.returnData.games = this.getWeight(this.bothCol, this.plays);
        this.setData(this.returnData.games);

        let numberOfPlayers = [...Array(this.returnData.maxPlayers).keys()];
        numberOfPlayers = numberOfPlayers.filter(ref => ref > this.returnData.minPlayers);
        this.numberOfPlayers = numberOfPlayers;

        let playTimeSelect = [...Array(this.returnData.maxTime/10).keys()]
        playTimeSelect = playTimeSelect.filter(ref => ref > this.returnData.minTime/10);
        playTimeSelect = playTimeSelect.map(item => item * 10);
        this.minTime = playTimeSelect[0];
        this.maxTime = playTimeSelect[playTimeSelect.length-1];
        this.playTimeSelect = playTimeSelect;
     
      });
    }
  
  showGame = (): void => {
    var validSelections: BoardGame[] = [];
    
    this.data.forEach((game: BoardGame) => {
      if (this.isValidGame(game, this.minTime, this.maxTime, this.playerCount, this.ownedBy, this.scenarioBased)) {
        validSelections.push(game);
      }
    });
    this.selectedGame = validSelections[Math.floor(Math.random() * validSelections.length)];
  }

  setScenario = (scenario: boolean): void => {
    this.scenarioBased = scenario;
  }
  
  setData = (data2: any) => {
    this.data = data2;
  }

  setMinTime = (time: number): void => {
    this.minTime = time;
  }
  
  setMaxTime = (time: number): void =>{
    this.maxTime = time;
  }
  
  setPlayers = (players: number): void =>{
    this.playerCount = players;
  }
  
  setOwnedBy = (ownedBy2: string): void =>{
    this.ownedBy = ownedBy2;
  }

  getMinMax = (collection: BoardGame[]) => {
    var minMax = {
      'minTime': 100,
      'maxTime': 0,
      'minPlayers': 100,
      'maxPlayers': 0
    }
  
    collection.forEach((game) => {
      if (parseInt(game.stats.minplaytime) < minMax.minTime) {
        minMax.minTime = parseInt(game.stats.minplaytime);
      }
      if (parseInt(game.stats.maxplaytime) > minMax.maxTime) {
        minMax.maxTime = parseInt(game.stats.maxplaytime);
      }
      if (parseInt(game.stats.minplayers ? game.stats.minplayers : "0") < minMax.minPlayers) {
        minMax.minPlayers = parseInt(game?.stats?.minplayers ? game.stats.minplayers : "0");
      }
      if (parseInt(game.stats.maxplayers) > minMax.maxPlayers) {
        minMax.maxPlayers = parseInt(game.stats.maxplayers);
      }
    });
    return minMax;
  }

  getWeight = (collection: BoardGame[], plays: PlayDb[]): BoardGame[] => {
    var max = 0;
    var weight: GameWeight[] = [];
    var collectionCount: {'id': string, 'count': number}[] = [];
    var found = false;
    var inst: GameWeight;
    var finalList:BoardGame[] = [];
  
    plays.forEach((play) => {
      collectionCount.forEach((collCount) => {
        found = false;
          if (collCount.id === play.gameId) {
            collCount.count += 1;
            if (collCount.count > max) {
              max = collCount.count;
            }
            found = true;
          }
        });
        if (!found) {
          collectionCount.push({'id': play.gameId, 'count': 1});
        }
    });

    collection.forEach((play) => {
      found = false;
      collectionCount.forEach((game) => {
        if(game.id === play.objectid) {
          inst = {
            'game': play,
            'weight': max - game.count + 1
          }
          weight.push(inst);
          found = true;
        } 
      });
  
      if(!found) {
        inst = {
          'game': play,
          'weight': max + 1
        }
        weight.push(inst);
      }
    });
  
    weight.forEach((inst) => {
      for (var i = 0; i < inst.weight; i ++) {
        finalList.push(inst.game);
      }
    });
  
    return finalList;
  }

  isValidGame = (game: BoardGame, minTime: number, maxTime: number, playerCount: number, 
    ownedBy: string, scenarioBased: boolean): boolean => {
    var validTime: boolean;
    if (game.stats.minplaytime !== '' && game.stats.maxplaytime !== '') {
      validTime = parseInt(game.stats.minplaytime) >= minTime && parseInt(game.stats.maxplaytime) <= maxTime;
    } else {
      validTime = parseInt(game.stats.playingtime) >= minTime && parseInt(game.stats.playingtime) <= maxTime;
    }
    var validPlayerCount = parseInt(game.stats.minplayers? game.stats.minplayers : "0") 
      <= playerCount && parseInt(game.stats.maxplayers) >= playerCount;
    var validOwner = (ownedBy === "either" || game.owner === ownedBy);
  
    return (validTime && validPlayerCount && validOwner);
  } 
}
