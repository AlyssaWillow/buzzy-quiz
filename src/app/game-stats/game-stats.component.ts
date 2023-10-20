import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Players } from '../models/player-selection';
import { DisplayFactions, Faction, factionDb3, FactionGame, factionTypeData, PlayerCount } from '../models/faction';
import { combineLatest } from 'rxjs';
import { GameInstance, PlayInstance, PlayerFaction, Wins, PlayDb, GameDetails, ownedAndUnownedExpansions, Expansion } from '../models/play';
import { Overrides } from '../models/generic';
import { BaseToExpansion, BaseToGame, CollectionGroups } from '../models/gameStats';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import { AllBoardGame, BoardGame, Link, Rank } from '../models/collection';
import { Cycle, CycleDb, DisplayScenario, ScenarioDb2, ScenarioGame, ScenarioPlayDb } from '../models/scenario';
import { FirebaseDataService } from '../services/firebase-data.service';
import { ListGuide } from '../models/list-guide';
import { UtilsService } from '../services/utils.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameGroupService } from '../services/game-group.service';
import { GameGroups } from '../models/gameGroups';
import { videoDb } from '../models/video';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent implements OnInit {
  gameGroupIdFromRoute: string | null = null;
  playData: GameInstance[] = [];
  bothCol: BoardGame[] = [];
  videos: videoDb[] = [];
  newFactions: factionDb3[] = [];
  allFactionTypes: factionTypeData[] = [];
  allCol: AllBoardGame[] = [];
  nonExpansion: BaseToGame[] = [];
  players: Players[] = [];
  listGuides: ListGuide[] = [];
  subscriptions: any;
  newScenarios: ScenarioDb2[] = [];
  newCycles: CycleDb[] = [];
  selectedGames: string[] = [];
  mechanics: Link[] = [];
  artists: Link[] = [];
  designers: Link[] = [];
  mechanicIds: number[] = [];
  artistIds: number[] = [];
  designerIds: number[] = [];
  displayCategory: number[] = [];
  displayArtists: number[] = [];
  displayDesigners: number[] = [];
  displayOrder: string = "";
  plays: PlayDb[] = [];
  display: string[] = ['typ-06D', 'typ-07E','typ-02W', 'typ-05P','typ-03F', 'typ-04S'];
  expansionIds: string[] = [];

  types: CollectionGroups[] = [
    {viewValue: 'Details', value: 'typ-06D'},
    {viewValue: 'Expansions', value: 'typ-07E'},
    {viewValue: 'Wins', value: 'typ-02W'},
    {viewValue: 'Play-history', value: 'typ-05P'},
    {viewValue: 'Factions', value: 'typ-03F'},
    {viewValue: 'Scenarios', value: 'typ-04S'},
  ];

  gameOrder: CollectionGroups[] = [
    {viewValue: 'Alphabetical', value: 'ord-01a'},
    {viewValue: 'BGG Rank', value: 'ord-02b'},
    {viewValue: 'Release Year', value: 'ord-03y'},
  ]

  collectionOverrides: Overrides = {
    bases: [],
    expansions: []
  }

  constructor(private boardGameGeekService: BoardGameGeekService,
              private firebaseDataService: FirebaseDataService,
              private utils: UtilsService,
              public defaultGameGroupId: GameGroupService,
              public authenticationService: AuthenticationService,
              private afs: AngularFirestore) {
                this.players = [];
               }

  ngOnInit(): void {
    this.defaultGameGroupId.selectedGameGroup$.subscribe(id => {
      this.gameGroupIdFromRoute = id;
    })
    
    this.subscriptions = combineLatest(
      this.firebaseDataService.factionTypes$,
      this.firebaseDataService.listGuides$,
      this.firebaseDataService.scenarios$,
      this.firebaseDataService.cycles$,
      this.firebaseDataService.factions$,
      this.firebaseDataService.overrides$,
      this.firebaseDataService.videos$,
      this.afs.collection<PlayDb>('play-history', ref => ref.where('groupId', '==', this.gameGroupIdFromRoute)).valueChanges(),
      this.afs.collection<GameGroups>('game-groups', ref => ref.where('id', '==', this.gameGroupIdFromRoute)).valueChanges()
    ).subscribe(
      ([factionTypes, listGuides, scenarioz, cyclez, factionz, overrides, videoz, plays, gameGroup]) => {
        this.plays = plays;
        this.allFactionTypes = factionTypes;
        this.videos = videoz;
        this.listGuides = listGuides;
        this.newScenarios = scenarioz;
        this.newCycles = cyclez;
        this.newFactions = factionz;
        this.collectionOverrides = overrides;
        this.afs.collection('tabletop-syndicate')
                .doc('player-data')
                .collection<Players>('player-names', ref => ref.where('id', 'in', gameGroup[0].members))
                .valueChanges().subscribe(playerz=>{
                  this.players = playerz;
                 
        console.log(this.players)
        if (this.bothCol.length === 0 && this.playData.length === 0) {
          this.bothCol = this.utils.getAggregateCollections()
                                   .filter((item, i, arr) => arr.findIndex((t) => t.objectid=== item.objectid) === i)
                                   .sort((a, b) => (a.name.text > b.name.text ? 1 : -1))

          this.sortgames();
          this.getAllGameCollection(this.bothCol);
        }
        
      })
    }) 
    
    this.playData = this.deDupPlays(this.playData)
    this.bothCol = this.deDupBoardGame(this.bothCol)

  };

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.playData = [];
    this.bothCol = [];
    this.gameGroupIdFromRoute = null;
    this.videos = [];
    this.newFactions= [];
    this.allFactionTypes = [];
    this.allCol = [];
    this.nonExpansion = [];
    this.players = [];
    this.listGuides = [];
    this.subscriptions = undefined;
    this.newScenarios = [];
    this.newCycles = [];
    this.selectedGames = [];
    this.mechanics = [];
    this.artists = [];
    this.designers = [];
    this.mechanicIds = [];
    this.artistIds = [];
    this.designerIds = [];
    this.displayCategory = [];
    this.displayArtists = [];
    this.displayDesigners = [];
    this.displayOrder = "";
    this.plays = [];
    this.display= [];
    this.expansionIds = [];
  }

  deDupPlays = (a: GameInstance[]): GameInstance[] => {
    let ids: string[] = [];
    return a.filter((value, index, array) => {
      let bool: boolean = !ids.includes(value.gameId)
      ids.push(value.gameId);
      return bool;
    })
  }

  deDupBoardGame = (a: BoardGame[]): BoardGame[] => {
    a = a.filter((value, index, array) => 
     !array.filter((v, i) => value.objectid == v.objectid && i < index).length);
    return a
  }

  deDupLink = (a: Link[]):Link[] => {
    a = a.filter((value, index, array) => 
     !array.filter((v, i) => value.id == v.id && i < index).length);
    return a
  }

  sortgames = () => {
      if (this.displayOrder === 'ord-01a') {
        this.playData.sort((a, b) => (a.gameName > b.gameName ? 1 : -1))
      } else if (this.displayOrder === 'ord-02b') {
        this.playData.sort((a, b) => ((a.bggRank.toString() == 'Not Ranked'? 99999999999: a.bggRank) - (b.bggRank.toString() == 'Not Ranked'? 0: b.bggRank)))
      } else if (this.displayOrder === 'ord-03y') {
        this.playData.sort((a, b) => ((a.gameDetails.yearPublished? a.gameDetails.yearPublished: 0) > (b.gameDetails.yearPublished? b.gameDetails.yearPublished: 0) ? 1 : -1))
      } else {
        this.playData.sort((a, b) => (a.gameName > b.gameName ? 1 : -1))
      }
    
  }

  getAllGameCollection = (both: BoardGame[]) => {
    let idCol: string[] = both.filter(f => f?.objectid != null && f?.objectid !== undefined).map(m => m?.objectid || '')
    this.boardGameGeekService.getlistOfGames(idCol);
    this.expansionIds = [];
    this.boardGameGeekService.listOfCollection$.subscribe(allCollection => {
      this.allCol = [];
      this.allCol = allCollection.item;
      this.allCol?.forEach(game => {
        if (!this.collectionOverrides?.bases.includes(game.id)) {
          if (this.collectionOverrides?.expansions.includes(game.id)) {
            this.expansionIds.push(game.id)
          } else {
            if (game?.link.filter(ref => ref.type === 'boardgamecategory').length > 0) {
              this.expansionIds.push(...game.link.filter(ref =>  ref.type === 'boardgamecategory')
                                                 .filter(f => f.id === 1042)
                                                 .map(m => ""+m.id))
          
              this.expansionIds.push(...game.link.filter(ref => ref.type === 'boardgameexpansion')
                                                  .filter(f => !f.inbound)
                                                  .map(m => ""+m.id))
            }
          } 
        }
      })
        
      let baseGame: BaseToGame;
      this.allCol?.forEach(game => {
        this.collectMechanics(game);
        this.collectArtists(game);
        this.collectDesigner(game);
        if ((this.collectionOverrides.bases.includes(game.id) || !this.expansionIds.includes(game.id)) && 
            !this.collectionOverrides.expansions.includes(game.id)) {
        baseGame = {
          baseId: game.id,
          base: game,
          expansions: []
        }
        if (game.link.filter(ref => ref.type == 'boardgameexpansion').length > 0 ) {
          baseGame.expansions.push(...game.link.filter(ref =>  ref.type == 'boardgameexpansion')
                                                .map(expansion => {
                                                  return {
                                                    expansionId: expansion.id,
                                                    expansion: {
                                                      id: "",
                                                      bggRank: 0,
                                                      image: "",
                                                      description: "",
                                                      link: [],
                                                      maxplayers: {value: 0},
                                                      maxplaytime: {value: 0},
                                                      minage: {value: 0},
                                                      minplayers: {value: 0},
                                                      minplaytime: {value: 0},
                                                      name: [],
                                                      playingtime: 0,
                                                      poll: [],
                                                      thumbnail: "",
                                                      type: "",
                                                      yearpublished: {value: 0},
                                                      statistics: {
                                                        page:'',
                                                        ratings: {
                                                          usersrated: {value:0},
                                                          average: {value:0},
                                                          bayesaverage: {value:0},
                                                          ranks: {
                                                            rank: []
                                                          },
                                                          stddev: {value:0},
                                                          median: {value:0},
                                                          owned: {value:0},
                                                          trading: {value:0},
                                                          wanting: {value:0},
                                                          wishing: {value:0},
                                                          numcomments: {value:0},
                                                          numweights: {value:0},
                                                          averageweight: {value:0},
                                                        }
                                                      }
                                                    }
                                                  }
                                                }))
        }
        this.nonExpansion.push(baseGame)
        }
      })
  
      this.allCol?.forEach(game => {
        if (this.expansionIds.includes(game.id)) {
          this.nonExpansion.forEach(base => {
            base.expansions.forEach(expansion => {
              if (("" + expansion.expansionId) === game.id) {
                expansion.expansion = game;
              }
            })
          })
        }
      });

      this.playData = [];
      this.playData = this.collectGameData(this.nonExpansion, this.plays);
      this.playData = this.deDupPlays(this.playData)
      this.playData.sort((a, b) => a.gameName > b.gameName ? 1 : -1)
      this.nonExpansion = this.nonExpansion.filter(a => !this.collectionOverrides.expansions.includes(a.baseId));
    })
  }

  getGameIdList = (plays: PlayDb[]) => {
    return Array.from(new Set(...plays.map(m => m.gameId)));
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
      factions: [],
      location: '',
      variant: '',
      scenario: {
        id: '', 
        win: false
      },
      gameNotes: ''
    };
    return gamePlay;
  }
   
  collectGameData = (bothCols: BaseToGame[], plays: PlayDb[]): GameInstance[] => {
    let games: GameInstance[] = [];
    let gameInstance: GameInstance;
    let gamePlay: PlayInstance;
    let playsForGame: PlayDb[] = [];
      
      bothCols.forEach(game => {
        if (game && game.baseId) {
          gameInstance = this.getGameAttributes(game.baseId);
          gameInstance.gameDetails = this.getGameDetails(game)
          gameInstance.winners = this.createEmptyWinners();
          gameInstance.factions = this.createEmptyFactions(game);
          gameInstance.gameDetails.bggRank = this.getRank(game);
          gameInstance.bggRank = this.getRank(game);
          gameInstance.scenarios = this.createEmptyScenarios(game, this.listGuides);
          gameInstance.expansions = this.getDisplayExpansions(game)
          playsForGame = plays.filter(f => (game.baseId === f.gameId))
          playsForGame.forEach((play) => {
            gamePlay = this.createNewGamePlay();
            if (game.baseId === play.gameId) {
              gamePlay.date = play.date;
              gamePlay.scores = play.scores;
              gamePlay.winners = play.winners;
              gamePlay.pick = play.pick;
              gamePlay.expansionsUsed = this.getExpansionsUsed(play.expansionsUsed, game.expansions);
              gamePlay.factions = play.factions;
              if (play.scenario !== undefined) {
                gamePlay.scenario = play.scenario;
              }
              
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
      }
   
      games.push(gameInstance);
    });
    this.sortgames();
    games.sort((a, b) => (a.gameName > b.gameName ? 1 : -1))
    return games;
  }

  getExpansionsUsed = (ids: string[], bothColz: BaseToExpansion[]): Expansion[] => {
    let expansionList: Expansion[] = [];
    expansionList.push(...bothColz.filter(expansions => (ids.includes(expansions.expansionId.toString())))
                                  .map(m=> {
                                    return {
                                            gameId: m.expansion.id, 
                                            gameName: this.utils.getGameName(m.expansion.id, this.bothCol)
                                          }
                                  }))
    
    return expansionList;
  }

  getRank = (game: BaseToGame): number => {
    console.log('rank',game, game.base.bggRank, game.base.statistics.ratings.ranks.rank)
    let rank: number = 99999;
    let gameRankList: Rank[] = this.utils.castRankObjectToList(game.base.statistics.ratings.ranks.rank)
    console.log('rank2', gameRankList)
    
    let bggRank: Rank | undefined = gameRankList?.find(f => f.name === 'boardgame')
console.log('rank3', bggRank)
    if (bggRank !== undefined) {
      rank = bggRank.value
    }
    console.log('rank4', rank)
    return rank

  }

  getGameDetails = (game: BaseToGame): GameDetails => {
    let deets: GameDetails = {
      id: game.base.id,
      bggRank: game.base.bggRank,
      description: game.base.description,
      yearPublished: game.base.yearpublished.value,
      minPlayers: game.base.minplayers.value,
      maxPlayers: game.base.maxplayers.value,
      minTime: game.base.minplaytime.value,
      maxTime: game.base.maxplaytime.value,
      boardGameCategory: game.base.link.filter(ref =>  ref.type === 'boardgamecategory'),
      artist: game.base.link.filter(ref =>  ref.type === 'boardgameartist'),
      designer: game.base.link.filter(ref => ref.type === 'boardgamedesigner'),
    }
    return deets;
  }

  getGameAttributes = (id: string): GameInstance => {
    let gameInstance: GameInstance = {
      gameId: '',
      gameName: '',
      bggRank: 0,
      plays: [],
      playerWins: [],
      scenarios: [],
      gameImage: '',
      factions: [],
      expansions: {
        owned:[],
        unowned:[],
        ownedPromo: [],
        unownedPromo: [],
        ownedFan: [],
        unownedFan: [],
        unownedAcc: []
      },
      gameType: '',
      location: '',
      pick: '',
      winners: [],
      gameDetails: {
        id: '',
        bggRank: 0,
    description: '',
    yearPublished: 0,
    minPlayers: 0,
    maxPlayers: 0,
    minTime: 0,
    maxTime: 0,
    boardGameCategory: [],
    artist: [],
    designer: [],
      }
    };

    gameInstance.gameId = id;
    gameInstance.gameImage = this.bothCol.find(f=> f.objectid === id)?.image || '';
    gameInstance.gameName = this.bothCol.find(f=> f.objectid === id)?.name.text || '';

    return gameInstance;
  }

  createEmptyWinners = () => {
    let winners: Wins[] = [];
    winners.push(...this.players.map(m => { return { playerId: m.id, playerName: m.firstName, winCount: 0 }}));
    return winners;
  }

  createWinners = (winners: Wins[], play: PlayDb): Wins[] => {
    if (winners.length < this.players.length) {
      let win: Wins;
      for (let player of this.players) {
        if (!winners.find(f=> f.playerId === player.id)) {
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
    }

    for(let winner of play.winners) {
      for(let players of winners) {
        if(players.playerId === winner) {
          players.winCount++;
        }
      }
    }
    winners.sort((a, b) => (a.winCount < b.winCount) ? 1 : -1);
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
      let scenarios = this.newScenarios.filter(ref => ref.gameId === displayScenario.gameId);
      scenarios.sort((a, b) => (a.order > b.order) ? 1 : -1)

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
    };
    return displayScenario.cycles;
  }

  addEmptyCycles = (displayScenario: ScenarioGame, gameId: string): Cycle[] =>  {
    let scenarios = this.newScenarios.filter(ref => ref.gameId === gameId);
      scenarios.sort((a, b) => (a.order > b.order) ? 1 : -1)

    let cycleIds: string[] = [];
      scenarios.forEach(scenario => {
        if (!cycleIds.includes(scenario.cycle)) {
          displayScenario.cycles.push({
            cycleId: scenario.cycle,
            scenarios: []
          });
        }
      
        cycleIds.push(scenario.cycle)
        displayScenario.cycles.forEach(cycle => {
          if (cycle.cycleId === scenario.cycle) {
            cycle.scenarios.push({
              scenarioId: scenario.id,
              wins: 0,
              plays: 0
            });
          }
        })
      })
    return displayScenario?.cycles;
  }

  createEmptyScenarios = (game: BaseToGame, listGuides: ListGuide[]): ScenarioGame[] => {
    let displayScenarios: ScenarioGame[] = [];
    let ids: string[] = [];
    let validGuides: ListGuide[] = [];

    ids.push(game.baseId);
    ids.push(...game.expansions.map(m => ""+m.expansionId));

    validGuides.push(...listGuides.filter(listGuide => (ids.includes(listGuide.id) && 
                                                        listGuide.scenarios && 
                                                        listGuide.scenarios.length > 0)));

    let addedIds: string[] = [];
    validGuides.forEach(listGuide => {
      if (ids.includes(listGuide.id) && listGuide.scenarios && listGuide.scenarios.length > 0) {
        listGuide.scenarios.forEach(scenario => {
          if (scenario !== '' && !addedIds.includes(listGuide.id)) {
            addedIds.push(listGuide.id);
            displayScenarios.push({
              gameId: listGuide.id,
              cycles: []
            })
          }
        })
      }
    });

    displayScenarios.forEach(displayScenario => {
      displayScenario.cycles = this.addEmptyCycles(displayScenario, displayScenario.gameId);   
    });
    return displayScenarios;
  }

  createEmptyFactions = (game: BaseToGame): DisplayFactions[] => {
    let displayFactions: DisplayFactions[] = [];
    let ids: string[] = [];
    let combIds: string[] = [];
    let factions: factionDb3[] = [];
    let typeIds: string[] = [];
    let gameIds: string[] = [];

    ids.push(game.baseId);
    ids.push(...game.expansions.map(m => ""+m.expansionId));
    factions = this.newFactions.filter(ref => ids.some(r=> ref.gameId.includes(r)))

    let typeGameMap = new Map<string, string[]>();

    factions.forEach(faction => {
      if(!typeGameMap.has(faction.typeId)) {
        typeGameMap.set(faction.typeId, [...faction.gameId])
      } else {
          typeGameMap?.get(faction.typeId)?.push(...faction.gameId)
      }

      if (!typeIds.includes(faction.typeId)) {
        typeIds.push(faction.typeId)
      }
      faction.gameId.forEach(gameId =>{
        if (!gameIds.includes(gameId)) {
          gameIds.push(gameId)
        }
      })
    })
    displayFactions.push(...typeIds.map(m=> {return {factionTypeId: m, factionGame: []}}))

    gameIds.forEach(gameId => {
      displayFactions.forEach(displayFaction => {
        if (typeGameMap.get(displayFaction.factionTypeId)?.includes(gameId)) {
          if (!combIds.includes(displayFaction.factionTypeId + '-' + gameId)) {
            combIds.push(displayFaction.factionTypeId + '-' + gameId)
            this.addNewFactionGame(displayFaction, gameId);   
          }   
          
        }
      });
    });
    
    return displayFactions;
  }

  addNewFactionGame = (displayFactions: DisplayFactions, gameId: string) => {
    let found: boolean = (displayFactions.factionGame.find(facGame => facGame.gameId === gameId) ? true : false)
    if (!found) {
      displayFactions.factionGame.push({
        gameId: gameId,
        factions: []
      });
    }
    

    displayFactions.factionGame.forEach(factionGame => {
      if (factionGame.gameId === gameId) {
        this.addEmptyFaction(factionGame.factions,
        this.newFactions.filter(ref => ref.gameId.includes(factionGame.gameId) && ref.typeId === displayFactions.factionTypeId));  
      }
    });  
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
    return (typeList.find(factionType => (id === factionType.scenarioId))? true : false)
  }

  doesTypeIdExist = (typeList: DisplayFactions[], id: string): boolean => {
    return (typeList.find(factionType => (id === factionType.factionTypeId)) ? true : false)
  }

  doesCycleIdExist = (id: string, typeList: ScenarioGame): boolean => {
    return (typeList.cycles.find(cycle => (id === cycle.cycleId)) ? true : false)
  }

  doesScenarioGameIdExist = (scenarioGames: ScenarioGame[], id: string): boolean => {
    return (scenarioGames.find(scenarioGame => (id === scenarioGame.gameId)) ? true : false)
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
            this.addFaction(factionGame.factions, faction, 
              this.newFactions.filter(ref => ref.gameId.includes(factionGame.gameId) && ref.typeId === displayFactions.factionTypeId));  
        }
      });  
    });
  }

  addEmptyFaction = (factions: Faction[], factionNames: factionDb3[]) => {
    factions.push(...factionNames.map(names => { return { 
                                      factionId: names.id, 
                                      name: names.name, 
                                      playerCount: this.addAllPlayersToFaction()} })
                                  .filter(f=>(f.name !== '')));
  }

  doesGameIdExist = (typeList: DisplayFactions, id: string): boolean => {
    return (typeList.factionGame.find(factionGame => (id === factionGame.gameId)) ? true : false);
  }

  addAllPlayersToFaction = (): PlayerCount[] => {
    return this.players.map(m=> { return { playerId: m.id, count: 0 }});
  }

  addFaction = (factions: Faction[], newFaction: PlayerFaction, factionNames: factionDb3[]) => {
    if (!this.doesFactionExist(factions, newFaction.factionId)) {
      let createdFaction: Faction = {
        factionId: newFaction.factionId,
        name: '',
        playerCount: this.addAllPlayersToFaction()
      }

      let theName: string | undefined = factionNames.find(f=>f.id === newFaction.factionId)?.name;
      createdFaction.name = (theName ? theName : '');
      factions.push(createdFaction);
    }
    factions.forEach(faction => {
        if (faction.factionId === newFaction.factionId) {
          this.addToFaction(faction, newFaction.playerId);   
        }
    });
  }

  doesFactionExist = (factions: Faction[], id: string): boolean => {
    return (factions.find(faction => (id === faction.factionId)) ? true : false)
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


  collectMechanics(game: AllBoardGame) {
    this.mechanics.push(...game.link.filter(ref => ref.type === 'boardgamecategory'));
    this.mechanics = this.deDupLink(this.mechanics);
    this.mechanics.sort((a, b) => (a.value > b.value) ? 1 : -1)
  }

  collectArtists(game: AllBoardGame) {
    this.artists.push(...game.link.filter(ref => ref.type === 'boardgameartist'));
    this.artists = this.deDupLink(this.artists);
    this.artists.sort((a, b) => (a.value > b.value) ? 1 : -1)
  }

  collectDesigner(game: AllBoardGame) {
    this.designers.push(...game.link.filter(ref => ref.type === 'boardgamedesigner'));
    this.designers = this.deDupLink(this.designers);
    this.designers.sort((a, b) => (a.value > b.value) ? 1 : -1)
  }

  checkMechanics = (links: Link[]): boolean => {
    if (this.displayCategory.length === 0) {
      return true;
    }
    return links.filter(ref => ref.type === 'boardgamecategory').some(ref => this.displayCategory.includes(ref.id))
  }

  checkDesigners = (links: Link[]): boolean => {
    if (this.displayDesigners.length === 0) {
      return true;
    }
    return links.filter(ref => ref.type === 'boardgamedesigner').some(ref => this.displayDesigners.includes(ref.id))
  }

  checkArtists = (links: Link[]): boolean => {
    if (this.displayArtists.length === 0) {
      return true;
    }
    return links.filter(ref => ref.type === 'boardgameartist').some(ref => this.displayArtists.includes(ref.id))
  }

  getDisplayExpansions = (game: BaseToGame): ownedAndUnownedExpansions => {
    let expList: ownedAndUnownedExpansions = {
      owned: [],
      unowned: [],
      ownedPromo: [],
      unownedPromo: [],
      ownedFan: [],
      unownedFan: [],
      unownedAcc: []
    };
    let ownedIds:number[] = []

    let beToE: BaseToExpansion[] = game.expansions.filter(exp => exp.expansion.id.length > 0)
    ownedIds.push(...beToE.map(m => m.expansionId));
    expList.owned.push(...beToE.map(m => m.expansion));

    expList.unowned = game.base.link.filter(ref => ref.type === 'boardgameexpansion' && 
      !ref.inbound && 
      !ownedIds.includes(ref.id) && 
      !ref.value.includes("promo") && 
      !ref.value.includes("Promo") && 
      !ref.value.includes("promos") && 
      !ref.value.includes("Promos") && 
      !ref.value.includes("fan expansion") );

    expList.unownedPromo = game.base.link.filter(ref => ref.type === 'boardgameexpansion' && 
                                                !ref.inbound && 
                                                !ownedIds.includes(ref.id) && 
                                                (ref.value.includes("Promo") || 
                                                 ref.value.includes("promo") || 
                                                 ref.value.includes("Promos") || 
                                                 ref.value.includes("promos")));

    expList.unownedFan = game.base.link.filter(ref => ref.type === 'boardgameexpansion' && 
      !ref.inbound && 
      !ownedIds.includes(ref.id) &&
      ref.value.includes("fan expansion") );

    expList.unownedAcc = game.base.link.filter(ref => ref.type === 'boardgameaccessory' && 
      !ownedIds.includes(ref.id));

    return expList;
  }
}