import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Players } from '../models/player-selection';
import { DisplayFactions, Faction, factionDb2, FactionGame, factionTypeData, PlayerCount } from '../models/faction';
import { combineLatest } from 'rxjs';
import { GameInstance, PlayInstance, PlayerFaction, Wins, PlayDb, GameDetails, ownedAndUnownedExpansions, Expansion } from '../models/play';
import { Overrides } from '../models/generic';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import { AllBoardGame, AllBoardGames, BoardGame, GameCollection, Link } from '../models/collection';
import { Cycle, CycleDb, DisplayScenario, ScenarioDb, ScenarioDb2, ScenarioGame, ScenarioPlayDb } from '../models/scenario';
import { FirebaseDataService } from '../services/firebase-data.service';
import { ListGuide } from '../models/list-guide';
import { UtilsService } from '../services/utils.service';

interface CollectionGroups {
  value: string;
  viewValue: string;
}

interface BaseToGame {
  baseId: string;
  base: AllBoardGame;
  expansions: BaseToExpansion[];
}

interface BaseToExpansion {
  expansionId: number;
  expansion: AllBoardGame;
}


@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent implements OnInit {
  collectionNum: number = 0;
  playData: GameInstance[] = [];
  bothCol: BoardGame[] = [];
  lemCol: BoardGame[] = [];
  henCol: BoardGame[] = [];
  henColOver: BoardGame[] = [];
  newFactions: factionDb2[] = [];
  allFactionTypes: factionTypeData[] = [];
  allCol: AllBoardGame[] = [];
  nonExpansion: BaseToGame[] = [];
  players: Players[] = [];
  listGuides: ListGuide[] = [];
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
  plays: PlayDb[] = [];
  display: string[] = [];
  expansionIds: string[] = [];

  types: CollectionGroups[] = [
    {viewValue: 'Details', value: 'typ-06D'},
    {viewValue: 'Expansions', value: 'typ-07E'},
    {viewValue: 'Wins', value: 'typ-02W'},
    {viewValue: 'Play-history', value: 'typ-05P'},
    {viewValue: 'Factions', value: 'typ-03F'},
    {viewValue: 'Scenarios', value: 'typ-04S'},
  ];

  collectionOverrides: Overrides = {
    bases: [],
    expansions: []
  }

  constructor(private boardGameGeekService: BoardGameGeekService,
              private firebaseDataService: FirebaseDataService,
              private utils: UtilsService,
              public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    combineLatest(
      this.firebaseDataService.factionTypes$,
      this.firebaseDataService.players$,
      this.firebaseDataService.listGuides$,
      this.firebaseDataService.scenarios$,
      this.firebaseDataService.cycles$,
      this.firebaseDataService.factions$,
      this.firebaseDataService.plays$,
      this.firebaseDataService.overrides$
    ).subscribe(
      ([
        factionTypes, 
        players, 
        listGuides, 
        scenarioz, 
        cyclez, 
        factionz, 
        plays, 
        overrides
      ]) => {
        this.plays = plays;
        this.allFactionTypes = factionTypes;
        this.players = players;
        this.listGuides = listGuides;
        this.newScenarios = scenarioz;
        this.newCycles = cyclez;
        this.newFactions = factionz;
        this.collectionOverrides = overrides;
        this.bothCol = [];
        if (this.playData.length === 0) {
          this.bothCol = this.utils.getAggregateCollections();
          this.bothCol.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
          this.getAllGameCollection(this.bothCol);
        }
        
      })
  };

  getAllGameCollection = (both: BoardGame[]) => {
    let idCol: string[] = []
      both.forEach(game => {
        if (game && game.objectid) {
          idCol.push(game.objectid);
        }
      })
      this.boardGameGeekService.getlistOfGames(idCol)
      this.expansionIds = [];
      this.boardGameGeekService.listOfCollection$.subscribe(allCollection => {
        this.allCol = allCollection.item;
        this.allCol?.forEach(game => {
          if (!this.collectionOverrides?.bases.includes(game.id)) {
            if (this.collectionOverrides?.expansions.includes(game.id)) {
              this.expansionIds.push(game.id)
            } else {
  
              if (game && game.link.filter(ref => ref.type === 'boardgamecategory').length > 0) {
                game?.link.filter(ref =>  ref.type === 'boardgamecategory').forEach(category => {
                  if (category.id === 1042) {
                    this.expansionIds.push(game.id)
                  } 
                })
                game?.link.filter(ref => ref.type === 'boardgameexpansion').forEach(category => {
                  if (!category.inbound) {
                    this.expansionIds.push(""+category.id)
                  }
                })
              }
            } 
          }
        })
        
        let baseGame: BaseToGame;
        let newExpansion: BaseToExpansion;
        this.allCol?.forEach(game => {
          this.collectMechanics(game);
          this.collectArtists(game);
          this.collectDesigner(game);
         if ((this.collectionOverrides.bases.includes(game.id) || !this.expansionIds.includes(game.id)) 
         && !this.collectionOverrides.expansions.includes(game.id)) {
          baseGame = {
            baseId: game.id,
            base: game,
            expansions: []
          }
          if (game.link.filter(ref => ref.type == 'boardgameexpansion').length > 0 ) {
            game.link.filter(ref =>  ref.type == 'boardgameexpansion').forEach(expansion => {
              newExpansion = {
                expansionId: expansion.id,
                expansion: {
                  id: "",
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
                  yearpublished: {value: 0}
                }
              }
              baseGame.expansions.push(newExpansion)
            })
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
        this.nonExpansion = this.nonExpansion.filter(a => !this.collectionOverrides.expansions.includes(a.baseId));
      })
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
   
  collectGameData = (bothCol: BaseToGame[], plays: PlayDb[]): GameInstance[] => {
    let games: GameInstance[] = [];
    let gameInstance: GameInstance;
    let gamePlay: PlayInstance;
      
      bothCol.forEach(game => {
        if (game && game.baseId) {
          gameInstance = this.getGameAttributes(game.baseId);
          gameInstance.gameDetails = this.getGameDetails(game)
          gameInstance.winners = this.createEmptyWinners();
          gameInstance.factions = this.createEmptyFactions(game);
          gameInstance.scenarios = this.createEmptyScenarios(game, this.listGuides);
          gameInstance.expansions = this.getDisplayExpansions(game)
          plays.forEach((play) => {
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
    games.sort((a, b) => (a.gameName > b.gameName) ? 1 : -1)
    return games;
  }

  getExpansionsUsed = (ids: string[], bothCol: BaseToExpansion[]): Expansion[] => {
    let expansionList: Expansion[] = [];
    let expansion: Expansion = {
      gameId: '',
      gameName: ''
    }
    bothCol.forEach(expansions => {
      if (ids.includes(expansions.expansionId.toString())) {
        expansionList.push({gameId: expansions.expansion.id, gameName: this.utils.getGameName(expansions.expansion.id, this.bothCol)})
      }
    })
    return expansionList;
  }

  getGameDetails = (game: BaseToGame): GameDetails => {
    let deets: GameDetails = {
      id: game.base.id,
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

    this.bothCol?.forEach(game => {
      if (game?.objectid === id) {
        gameInstance.gameImage = game.image;
        gameInstance.gameName = game.name.text;
      }
    });

    return gameInstance;
  }

  createEmptyWinners = () => {
    let winners: Wins[] = [];
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
    return winners;
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
    game.expansions.forEach(expansion=> {
      ids.push("" + expansion.expansionId);
    });

    
    listGuides.forEach(listGuide => {
      if (ids.includes(listGuide.id) && listGuide.scenarios && listGuide.scenarios.length > 0) {
        validGuides.push(listGuide);
      }
    })
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
    let factions: factionDb2[] = [];
    let typeIds: string[] = [];
    let gameIds: string[] = [];

    ids.push(game.baseId);
    game.expansions.forEach(expansion=> {
      ids.push("" + expansion.expansionId);
    });

    factions = this.newFactions.filter(ref => ids.includes(ref.gameId))

    
    let typeGameMap = new Map();

    factions.forEach(faction => {
      if(!typeGameMap.has(faction.typeId)) {
        typeGameMap.set(faction.typeId, new Set().add(faction.gameId))
      } else {
        typeGameMap.get(faction.typeId).add(faction.gameId)
      }
      if (!typeIds.includes(faction.typeId)) {
        typeIds.push(faction.typeId)
      }
      if (!gameIds.includes(faction.gameId)) {
        gameIds.push(faction.gameId)
      }
    })
    
    typeIds.forEach(typeId => {
      displayFactions.push({
        factionTypeId: typeId,
        factionGame: []
      })
    })

    gameIds.forEach(gameId => {
      displayFactions.forEach(displayFaction => {
        if (typeGameMap.get(displayFaction.factionTypeId).has(gameId)) {

        
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
    let found: boolean = false;
    displayFactions.factionGame.forEach(facGame => {
      if (facGame.gameId === gameId) {
        found = true;
      }
    })

    if (!found) {
      displayFactions.factionGame.push({
        gameId: gameId,
        factions: []
      });
    }
    

    displayFactions.factionGame.forEach(factionGame => {
      if (factionGame.gameId === gameId) {
        this.addEmptyFaction(factionGame.factions,
        this.newFactions.filter(ref => ref.gameId === factionGame.gameId && ref.typeId === displayFactions.factionTypeId));  
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
            this.addFaction(factionGame.factions, faction, 
              this.newFactions.filter(ref => ref.gameId === factionGame.gameId && ref.typeId === displayFactions.factionTypeId));  
        }
      });  
    });
  }

  addEmptyFaction = (factions: Faction[], factionNames: factionDb2[]) => {
      let createdFaction: Faction;
      factionNames.forEach(names => {
        createdFaction = {
          factionId: names.id,
          name: names.name,
          playerCount: this.addAllPlayersToFaction()
        }
        if (createdFaction.name !== '') {
          factions.push(createdFaction);
        }
      })
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

  addFaction = (factions: Faction[], newFaction: PlayerFaction, factionNames: factionDb2[]) => {
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


  collectMechanics(game: AllBoardGame) {
    game.link.filter(ref => ref.type === 'boardgamecategory').forEach(cat => {
      if (!this.mechanicIds.includes(cat.id)) {
        this.mechanicIds.push(cat.id)
        this.mechanics.push(cat);
        this.mechanics.sort((a, b) => (a.value > b.value) ? 1 : -1)
      }
    })
  }

  collectArtists(game: AllBoardGame) {
    game.link.filter(ref => ref.type === 'boardgameartist').forEach(cat => {
      if (!this.artistIds.includes(cat.id)) {
        this.artistIds.push(cat.id)
        this.artists.push(cat);
        this.artists.sort((a, b) => (a.value > b.value) ? 1 : -1)
      }
    })
  }

  collectDesigner(game: AllBoardGame) {
    game.link.filter(ref => ref.type === 'boardgamedesigner').forEach(cat => {
      if (!this.designerIds.includes(cat.id)) {
        this.designerIds.push(cat.id)
        this.designers.push(cat);
        this.designers.sort((a, b) => (a.value > b.value) ? 1 : -1)
      }
    })
  }

  checkMechanics = (links: Link[]): boolean => {
    if (this.displayCategory.length === 0) {
      return true;
    }
    let test: boolean =  links.filter(ref => ref.type === 'boardgamecategory').some(ref => this.displayCategory.includes(ref.id))
    return test;
  }

  checkDesigners = (links: Link[]): boolean => {
    if (this.displayDesigners.length === 0) {
      return true;
    }
    let test: boolean =  links.filter(ref => ref.type === 'boardgamedesigner').some(ref => this.displayDesigners.includes(ref.id))
    return test;
  }

  checkArtists = (links: Link[]): boolean => {
    if (this.displayArtists.length === 0) {
      return true;
    }
    let test: boolean =  links.filter(ref => ref.type === 'boardgameartist').some(ref => this.displayArtists.includes(ref.id))
    return test;
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

    game.expansions.forEach(exp => {
      if (exp.expansion.id.length > 0) {
        ownedIds.push(exp.expansionId);
        expList.owned.push(exp.expansion);
      }
    })

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