import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFirestore, 
  AngularFirestoreCollection, 
  AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { DisplayPlayerSelection, Players } from '../home/player-selection';
import { DisplayFactions, Faction, FactionCollection, FactionGame, PlayerCount } from '../models/faction';
import { Observable } from 'rxjs';
import { DisplayPlay, GameInstance, Play, PlayInstance, Timestamp, PlayerFaction, Wins, Scenario, PlayDb } from '../models/play';
import { Locations } from '../models/locations';
import { nameId } from '../models/generic';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import { BoardGame, GameCollection } from '../models/collection';
import { Cycle, DisplayScenario, ScenarioDb, ScenarioGame, ScenarioPlayDb } from '../models/scenario';


interface CollectionGroups {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent implements OnInit {
  private playerCol: AngularFirestoreCollection<Players>;
  private factionsCol: AngularFirestoreCollection<Faction>;
  private playsCol: AngularFirestoreCollection<PlayDb>;
  private locationCol: AngularFirestoreCollection<Locations>;

  players$: Observable<Players[]>;
  factions$: Observable<Faction[]>;
  plays$: Observable<PlayDb[]>;
  locations$: Observable<Locations[]>;
  lemanCollection$: Observable<GameCollection>;
  hendCollection$: Observable<GameCollection>;

  playData: GameInstance[] = [];
  bothCol: BoardGame[] = [];
  players: Players[];

  display: string = 'typ-01A';

  types: CollectionGroups[] = [
    {viewValue: 'All', value: 'typ-01A'},
    {viewValue: 'Wins', value: 'typ-02W'},
    {viewValue: 'Play-history', value: 'typ-05P'},
    {viewValue: 'Factions', value: 'typ-03F'},
    {viewValue: 'Scenarios', value: 'typ-04S'},
  ];

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
      this.playData = this.collectGameData(plays);
    });
    this.players$.subscribe(players => {
      this.players = players;
    });
    this.locations$.subscribe(locations => {
      
    });
    this.factions$.subscribe(factions => {
        
    });

    this.lemanCollection$.subscribe(lem => {
      this.hendCollection$.subscribe(hen => {
        this.bothCol = lem?.item.concat(hen?.item);
      });
    });
  }

  getGameIdList = (plays: PlayDb[]) => {
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
        seconds: '0',
        nanoseconds: '0'
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
   
  collectGameData = (plays: PlayDb[]): GameInstance[] => {
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
          if (play.scenario?.id !== undefined && play.scenario?.id !== '') {
           gameInstance.scenarios = this.createScenarios(gameInstance.scenarios, play);
          }
          if (play.winners?.length > 0) {
            gameInstance.winners = this.createWinners(gameInstance.winners, play);
          }
          if (play.factions?.length > 0) {
           gameInstance.factions = this.createFactions(gameInstance.factions, play);
          }
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

    this.bothCol?.forEach(game => {
      if (game?.objectid === id) {
        gameInstance.gameImage = game.image;
        gameInstance.gameName = game.name.text;
      }
    });

    return gameInstance;
  }

  createWinners = (winners: Wins[], play: PlayDb): Wins[] => {

    if (winners.length < 4) {
      let win: Wins;
      for (let player of this.players) {
        win = {
          playerId: '',
          playerName: '',
          winCount: 0
        }
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

  createScenarios = (displayScenarios: ScenarioGame[], play: PlayDb): ScenarioGame[] =>  {
    if (play.scenario) {
      if (!this.doesScenarioGameIdExist(displayScenarios, play.scenario.id.split("-")[0])) {
        let newScenarioGame: ScenarioGame = {
          gameId: play.scenario.id.split("-")[0],
          cycles: []
        }
        displayScenarios.push(newScenarioGame);
      }
      displayScenarios.forEach(displayScenario => {
          if (displayScenario.gameId === play.scenario?.id.split("-")[0]) {
            displayScenario.cycles = this.addCycles(displayScenario, play.scenario);   
          }
      });
    };
    return displayScenarios;
  }

  addCycles = (displayScenario: ScenarioGame, playScenario: ScenarioPlayDb): Cycle[] =>  {
    if (playScenario) {
      let scenarioCol: AngularFirestoreCollection<ScenarioDb>;
      let scenarios$: Observable<ScenarioDb[]>;

      scenarioCol = this.afs.collection('scenarios').doc(playScenario.id.split("-")[0]).collection('scenarios');
      scenarios$ = scenarioCol.valueChanges();

      scenarios$.subscribe(scenarios => { 
        scenarios.forEach(scenario => {
          if (scenario.id === playScenario.id) {
            if(!this.doesCycleIdExist(scenario.cycle, displayScenario)) {
              let newCycle: Cycle = {
                cycleId: scenario.cycle,
                scenarios: []
              }
              displayScenario.cycles.push(newCycle)
            }
            displayScenario.cycles.forEach(cycle => {
              if (cycle.cycleId === scenario.cycle) {
                if(!this.doesScenarioIdExist(cycle.scenarios, playScenario.id)) {
                  let newScenario: DisplayScenario = {
                    scenarioId: playScenario.id,
                    wins: 0,
                    plays: 0
                  }
                  cycle.scenarios.push(newScenario)
                }
                cycle.scenarios.forEach(scenario2 => {
                  if (scenario2.scenarioId === playScenario.id) {
                    scenario2.plays++;
                    if (playScenario.win) {
                      scenario2.wins++;
                    }
                  }
                })
              }
            })
          }
          
        })

      }); 
    };
    return displayScenario.cycles;
  }

  createFactions = (displayFactions: DisplayFactions[], play: PlayDb): DisplayFactions[] => {
    play.factions.forEach(playFaction => {
      if (!this.doesTypeIdExist(displayFactions, playFaction.typeId)) {
        let newDisplayFactions: DisplayFactions = {
          factionTypeId: playFaction.typeId,
          factionGame: []
        }
        displayFactions.push(newDisplayFactions);
      }
      displayFactions.forEach(displayFaction => {
          if (displayFaction.factionTypeId === playFaction.typeId) {
            this.addFactionGame(displayFaction, playFaction.factions, displayFaction);   
          }
      });
    });

    return displayFactions;
  }

  doesScenarioIdExist = (typeList: DisplayScenario[], id: string): boolean => {
    let found = false;
    typeList.forEach(factionType => {
        if (id === factionType.scenarioId) {
          found = true;
        }
    });
    return found;
  }

  doesTypeIdExist = (typeList: DisplayFactions[], id: string): boolean => {
    let found = false;
    typeList.forEach(factionType => {
        if (id === factionType.factionTypeId) {
          found = true;
        }
    });
    return found;
  }

  doesCycleIdExist = (id: string, typeList: ScenarioGame): boolean => {
    let found = false;
    typeList.cycles.forEach(cycle => {
        if (id === cycle.cycleId) {
          found = true;
        }
    });
    return found;
  }

  doesScenarioGameIdExist = (ScenarioGames: ScenarioGame[], id: string): boolean => {
    let found = false;
    ScenarioGames.forEach(ScenarioGame => {
        if (id === ScenarioGame.gameId) {
          found = true;
        }
    });
    return found;
  }

  addFactionGame = (displayFactions: DisplayFactions, playFaction: PlayerFaction[], displayFaction: DisplayFactions) => {
    playFaction?.forEach(faction => {
      if (!this.doesGameIdExist(displayFactions, faction.factionId.split('-')[0])) {
        let newGameFactions: FactionGame = {
          gameId: faction.factionId.split('-')[0],
          factions: []
        }
        displayFactions.factionGame.push(newGameFactions);
      }
      displayFactions.factionGame.forEach(factionGame => {
        if (factionGame.gameId === faction.factionId.split('-')[0]) {
          let factionCol: AngularFirestoreCollection<nameId>;
          let factions$: Observable<nameId[]>;
          factionCol = this.afs.collection('factions').doc(factionGame.gameId).collection(displayFaction.factionTypeId);
          factions$ = factionCol.valueChanges();
          factions$.subscribe(factionNames => {
            this.addFaction(factionGame.factions, faction, factionNames);  
          }); 
        }
      });  
    });
  }

  doesGameIdExist = (typeList: DisplayFactions, id: string): boolean => {
    let found = false;
    typeList.factionGame.forEach(factionGame => {
        if (id === factionGame.gameId) {
          found = true;
        }
    });
    return found;
  }

  addAllPlayersToFaction = (): PlayerCount[] => {
    let playerCountList: PlayerCount[] = [];
    let playerCount: PlayerCount;
    this.players.forEach(player => {
      playerCount = {
        playerId: player.id,
        count: 0
      }
      playerCountList.push(playerCount);
    });

    return playerCountList;
  }

  addFaction = (factions: Faction[], newFaction: PlayerFaction, factionNames: nameId[]) => {
    if (!this.doesFactionExist(factions, newFaction.factionId)) {
      let createdFaction: Faction = {
        factionId: newFaction.factionId,
        name: '',
        playerCount: this.addAllPlayersToFaction()
      }
      factionNames.forEach(names => {
        if (names.id === newFaction.factionId) {
          createdFaction.name = names.name;
        }
      })
      factions.push(createdFaction);
    }
    factions.forEach(faction => {
        if (faction.factionId === newFaction.factionId) {
          this.addToFaction(faction, newFaction.playerId);   
        }
    });
  }

  doesFactionExist = (factions: Faction[], id: string): boolean => {
    let found = false;
    factions.forEach(faction => {
        if (id === faction.factionId) {
          found = true;
        }
    });
    return found;
  }

  addToFaction = (factionList: Faction, playerId: string) => {
    let playerFound = false;
      playerFound = false;
      factionList.playerCount.forEach(playerCount => {
        if(playerCount.playerId === playerId) {
          playerCount.count++;
          playerFound = true;
        }
      });
      if (!playerFound) {
        let newPlayer: PlayerCount = {
          playerId: playerId,
          count: 1
        }
        factionList.playerCount.push(newPlayer);
      }
  }
}
