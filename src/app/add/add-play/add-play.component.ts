import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatFormField } from '@angular/material/form-field';
import { combineLatest, Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { AllBoardGame, BoardGame } from 'src/app/models/collection';
import { nameId } from 'src/app/models/generic';
import { CustomName, GamePlayerFaction, PlayDb, PlayerFaction, PlayFaction, ScoreDb, Timestamp } from 'src/app/models/play';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CycleDb, ScenarioDb, ScenarioDb2, ScenarioPlayDb } from 'src/app/models/scenario';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { factionDb2 } from 'src/app/models/faction';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';

@Component({
  selector: 'app-add-play',
  templateUrl: './add-play.component.html',
  styleUrls: ['./add-play.component.scss']
})
export class AddPlayComponent implements OnInit {
  @Input('bothCol') bothCol: BoardGame[] = [];
  allCol: AllBoardGame[] = [];
  gameTypes$: Observable<nameId[]>;
  expansionIds: string[] = [];
  expansionIdMap: Map<string, number[]> = new Map();

  numbers: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
  gamePlayedOrder: number = 0;
  selectedId: number = 0
  players: Players[] = [];
  locations: nameId[] = [];
  gameTypes: nameId[] = [];
  plays: PlayDb[] = [];
  factions: factionDb2[] = [];
  factionTypes: nameId[] = [];
  dateMatchIds: string[] = [];
  existingIds: string[] = [];
  scenarioList: ScenarioDb[] = [];
  selectedGame: BoardGame | undefined = undefined;
  selectedExpansions: BoardGame[] | undefined = undefined;
  selectedScenarioGame: string = '';
  selectedGameType: nameId = {
    id: '',
    name: ''
  };
  edit: string = '';
  picker: MatFormField | undefined = undefined;
  selectedLocation: nameId | undefined = undefined;
  selectedPick: Players | undefined = undefined;
  selectedScenario: ScenarioPlayDb = {
    id: '',
    win: false
  }
  cycles: CycleDb[] = [];
  gameNotesList: {note: string}[] = [];
  scenarios: ScenarioDb2[] = [];
  selectedWinners: Players[] | undefined = undefined;
  selectedDate: Date | null = null;
  selectedFactionGame: string[] = [];
  selectedPlayerNameList: CustomName[] = [];
  selectedOrder: number = 0;
  selectedPlayerFaction: GamePlayerFaction = {
    gameId: '',
    playerId: '',
    factionId: '',
    factionTypeId: ''
  };
  selectedPlayerFactionList: GamePlayerFaction[] = [];
  selectedPlayerScoresList: ScoreDb[] = [];
  factionList: nameId[][] = [];

  containsFactions: boolean = false;
  containsScores: boolean = false;
  containsGameNotes: boolean = false;
  containsCustomNames: boolean = false;
  containsScenario: boolean = false;
  addFactionShow: boolean = false;
  addScenarioShow: boolean = false;
  overwritesEnabled: boolean = false;

  private gameTypeCol: AngularFirestoreCollection<nameId>;

  playDeleted: boolean = false;
  playDeletedName: PlayDb = {
    date: {
      seconds: '',
      nanoseconds: ''
    },
    id: '',
    order: 0,
    expansionsUsed: [],
    factions: [],
    customNames: [],
    gameNotes: [],
    gameId: '',
    gameType: '',
    location: '',
    pick: '',
    scenario: undefined,
    winners: [],
    scores: []
  };
  
  deletesEnabled: boolean = false;
  

  constructor(public utils: UtilsService,
    private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService,
    private afs: AngularFirestore) { 
    this.gameTypeCol = afs.collection('game-type-data');
    this.gameTypes$ = this.gameTypeCol.valueChanges();
  }

  ngOnInit(): void {
    combineLatest(
      this.firebaseDataService.cycles$,
      this.firebaseDataService.players$,
      this.firebaseDataService.locations$,
      this.firebaseDataService.plays$,
      this.firebaseDataService.scenarios$,
      this.firebaseDataService.factions$
    ).subscribe(
      ([cyclez, playerz, locationz, playz, scenarioz, factionz]) => {
      this.cycles = cyclez;
      this.players = playerz;
      this.locations = locationz;
      this.plays = playz;
      this.scenarios = scenarioz;
      this.factions = factionz;
      this.getExpansionIds(this.bothCol);
      });

      this.boardGameGeekService.listOfCollection$.subscribe(allCollection => {
        this.allCol = allCollection.item;
        this.allCol.filter(f => f.type === "boardgame").forEach(base => {
          if (!this.expansionIdMap.has(base.id)) {
            this.expansionIdMap.set(base.id, base.link.filter(f => f.type === 'boardgameexpansion').map(m => m.id));
          } else {
            this.expansionIdMap.get(base.id)?.push(...base.link.filter(f => f.type === 'boardgameexpansion').map(m => m.id))
          }
        });
      });
      this.getSpecificExpansionIdMap(this.bothCol);
    this.selectedPlayerFactionList;
    this.selectedPlayerScoresList;
    
    this.gameTypes$.subscribe(gameTypes => {
      this.gameTypes = gameTypes;
    });
    this.firebaseDataService.factionTypes$.subscribe(factionTypes => {
      this.factionTypes = factionTypes;
    });
  }
  getExpansionIds = (both: BoardGame[]) => {
    let idCol: string[] = [];
        both.forEach(game => {
          if (game && game.objectid) {
            idCol.push(game.objectid);
          }
        })
        this.boardGameGeekService.getlistOfGames(idCol);
        this.boardGameGeekService.listOfCollection$.subscribe(allCollection => {
          this.allCol = allCollection.item;
          this.expansionIds = allCollection.item
                              .filter(f => f.link.find(f => ''+f.id === '1042'))
                              .map(m => m.id);
        });
  }

  getSpecificExpansionIdMap = (both: BoardGame[]) => {
    let idCol: string[] = [];
    both.forEach(game => {
      if (game && game.objectid) {
        idCol.push(game.objectid);
      }
    })
    this.boardGameGeekService.getlistOfGames(idCol);
    this.boardGameGeekService.listOfCollection$.subscribe(allCollection => {
      this.allCol = allCollection.item;
      this.allCol.filter(f => f.type === "boardgame").forEach(base => {
        if (!this.expansionIdMap.has(base.id)) {
          this.expansionIdMap.set(base.id, base.link.filter(f => f.type === 'boardgameexpansion').map(m => m.id));
        } else {
          this.expansionIdMap.get(base.id)?.push(...base.link.filter(f => f.type === 'boardgameexpansion').map(m => m.id))
        }
      });
    });
  }

  getGames = (): BoardGame[] => {
    let boardGameList: BoardGame[] = [];
    if (this.selectedGame) {
      boardGameList.push(this.selectedGame)
    }
    if (this.selectedExpansions) {
      boardGameList.concat(this.selectedExpansions);
    }
    return boardGameList;
  }

  getFactions = (gameId: string, i: number, factionTypeId: string): void => {
    let gId: string = '';
    let ftId: string = '';

    if (this.selectedPlayerFactionList[i] && this.selectedPlayerFactionList[i].gameId) {
      gId = this.selectedPlayerFactionList[i].gameId;
    } else if (gameId !== '') {
      gId = gameId;
    }
   
    if (this.selectedPlayerFactionList[i] && this.selectedPlayerFactionList[i].factionTypeId) {
      ftId =  this.selectedPlayerFactionList[i].factionTypeId;
    } else if (factionTypeId !== '') {
      ftId = factionTypeId;
    }
    this.factionList[i] = this.factions.filter(ref => ref.gameId === gId && ref.typeId === ftId);
  }

  getScenarios = (gameId: string): void => {
    let gId: string = '';

    if (this.selectedScenarioGame && this.selectedScenarioGame) {
      gId = this.selectedScenarioGame;
    } else if (gameId !== '') {
      gId = gameId;
    }

    this.scenarioList = this.scenarios.filter(ref => ref.gameId === gId);
  }

  additionalFaction = (): void => {
    let newInstance: GamePlayerFaction = {
      gameId: '',
      playerId: '',
      factionId: '',
      factionTypeId: ''
    };
    this.selectedPlayerFactionList.push(newInstance);
  }

  additionalScore = (): void => {
    let newInstance: ScoreDb = {
      playerId: '',
      score: ''
    };
    this.selectedPlayerScoresList.push(newInstance);
  }

  additionalName = (): void => {
    let newInstance: CustomName = {
      playerId: '',
      name: ''
    };
    this.selectedPlayerNameList.push(newInstance);
  }

  additionalGameNote = (): void => {
    this.gameNotesList.push({note: ''});
  }
  
  showFactions = () => {
    if (this.selectedGame !== undefined && this.selectedGame !== null) {
      this.players.forEach(player => {
        this.selectedPlayerFactionList.push({
          gameId: "" + this.selectedGame?.objectid,
          playerId: player.id,
          factionId: '',
          factionTypeId: ''
        })
      })
      this.containsFactions = !this.containsFactions;
    }
  }

  showScores = () => {
    if (this.selectedGame !== undefined && this.selectedGame !== null) {
    this.players.forEach(player => {
      this.selectedPlayerScoresList.push({
        playerId: player.id,
        score: ''
      })
    })
    this.containsScores = !this.containsScores;
  }
  }

  showCustomNames = () => {
    if (this.selectedGame !== undefined && this.selectedGame !== null) {
    this.players.forEach(player => {
      this.selectedPlayerNameList.push({
        playerId: player.id,
        name: ''
      })
    })
    this.containsCustomNames = !this.containsCustomNames;
  }
  }

  showGameNotes = () => {
    if (this.selectedGame !== undefined && this.selectedGame !== null) {
    if (this.gameNotesList.length === 0) {
      this.gameNotesList.push({note: ''});
    }
    this.containsGameNotes = !this.containsGameNotes;
  }
  }

  submit = async () => {
    let gameId: string = (this.selectedGame?.objectid ? this.selectedGame.objectid : '')
    let typeId: string = (this.selectedGameType?.id ? this.selectedGameType.id : '')
    let locationId: string = (this.selectedLocation ? this.selectedLocation.id : '')
    let pickId: string = (this.selectedPick?.id ? this.selectedPick?.id : '')
    let seconds: number =  (this.selectedDate ? this.selectedDate.valueOf() : 0)
    let tmeStmp: Timestamp = {
      nanoseconds: seconds.toString(),
      seconds: (seconds / 1000).toString(),
    }
    let id: string = this.utils.getDateHyphenYYYYMMDD(this.selectedDate ) + '-'
        + this.selectedId
    if (gameId !== '' && typeId !== '' && locationId !== '' && pickId !== '' && seconds > 0) {
      const docData: PlayDb = {
        date: tmeStmp,
        order: this.selectedOrder,
        id: id,
        expansionsUsed: this.createExpansions(this.selectedExpansions),
        factions: (this.containsFactions ? this.createFactions(this.selectedPlayerFactionList) : []),
        gameId: gameId,
        customNames: (this.containsCustomNames ? this.selectedPlayerNameList : []),
        gameType: typeId,
        location: locationId,
        pick: pickId,
        gameNotes: (this.containsGameNotes ? this.gameNotesList.map(m => m.note) : []),
        scenario: (this.containsScenario ? this.createScenario(this.selectedScenario.id, this.selectedScenario.win) : {id: '', win: false}),
        winners: this.createWinners(this.selectedWinners),
        scores: (this.containsScores ? this.selectedPlayerScoresList : [])
      };
      const pickRef = this.afs.collection('play-history');
      await pickRef.doc(id).set(docData).then(() => {
        this.selectedGame = undefined;
        this.selectedExpansions = undefined;
        this.selectedScenarioGame = '';
        this.selectedGameType = {
          id: '',
          name: ''
        };
        this.picker = undefined;
        this.selectedLocation = undefined;
        this.selectedPick = undefined;
        this.selectedScenario = {
          id: '',
          win: false
        }
        this.gameNotesList = [];
        this.selectedPlayerNameList = [];
      this.selectedWinners = undefined;
      this.selectedFactionGame = [];
      this.selectedOrder = 0;
      this.selectedPlayerFaction = {
        gameId: '',
        playerId: '',
        factionId: '',
        factionTypeId: ''
      };
      this.selectedPlayerFactionList = [];
      this.selectedPlayerScoresList = [];
      this.containsFactions = false;
      this.containsGameNotes = false;
      this.containsGameNotes = false;
      this.containsScores = false;
      this.containsScenario = false;
      this.addFactionShow = false;
      this.addScenarioShow = false;
        console.info("Document successfully added!");
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
    }
  }

  createExpansions = (expansions: BoardGame[] | undefined): string[] => {
    let expansionIds: string[] = [];
    expansions?.forEach(expansion => {
      if (expansion?.objectid) {
        expansionIds.push(expansion.objectid);
      }
    })
    return expansionIds;
  }

  createFactions = (selectedPlayerFactionList: GamePlayerFaction[]): PlayFaction[] => {
    let factionList: PlayFaction[] = [];
    let playFaction: PlayFaction = {
      typeId: '',
      factions: []
    }
    selectedPlayerFactionList?.forEach(faction => {
      if (!this.doesFactionTypeExist(factionList, faction.factionTypeId)) {
        factionList.push({
          typeId: faction.factionTypeId,
          factions: []
        });
      }
      factionList.forEach(factionType => {
        if (factionType.typeId === faction.factionTypeId) {
          factionType.factions.push({
            playerId: faction.playerId,
            factionId: faction.factionId
          })
        }
      })
    })
    return factionList;
  }

  createWinners = (selectedWinners: Players[] | undefined): string[] => {
    let winners: string[] = [];
    selectedWinners?.forEach(selected => {
      winners.push(selected.id);
    })
    return winners;
  }
  createScenario = (id: string, win: boolean) => {
    let dbScenario: ScenarioPlayDb = {
      id: id,
      win: win
    }
    return dbScenario;
  }
  doesFactionTypeExist = (factionList: PlayFaction[], id: string): boolean => {
    let found = false;
    factionList.forEach(factionGame => {
        if (id === factionGame.typeId) {
          found = true;
        }
    });
    return found;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }

  showAddFactions = () => {
    this.addFactionShow = !this.addFactionShow;
  }

  showAddScenario = () => {
    this.addScenarioShow = !this.addScenarioShow;
  }

  showScenario = () => {
    this.selectedScenarioGame = "" + this.selectedGame?.objectid;
    this.getScenarios(this.selectedScenarioGame);
    this.containsScenario = !this.containsScenario;
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.playDeleted = false;
  }

  enableOverwrite = (): void => {
    this.overwritesEnabled = !this.overwritesEnabled;
  }

  convertNumber = (str: string): number => {
    return Number(str);
  }

  setPlayData = (play: PlayDb): void => {
    // LOCATION
    this.locations.forEach(location => {
      if (location.id === play.location) {
        this.selectedLocation = location;
      }
    })

    // ID
    this.selectedId = Number(play.id.split('-')[3]);

    // ORDER
    this.selectedOrder = play.order;

    // GAME
    this.bothCol.forEach(game => {
      if (game.objectid === play.gameId) {
        this.selectedGame = game;
      }
    })

    // PICK
    this.players.forEach(player => {
      if (player.id === play.pick) {
        this.selectedPick = player;
      }
    })

    // PLAYERS
    this.players.forEach(player => {
      if (play.winners.includes(player.id)) {
        if (this.selectedWinners === undefined) {
          this.selectedWinners = []
        }
        this.selectedWinners.push(player);
      }
    })

    // GAME TYPE
    this.gameTypes.forEach(type => {
      if (type.id === play.gameType) {
        this.selectedGameType = type;
      }
    })
   
    // EXPANSIONS
    this.bothCol.forEach(game => {
      if (play.expansionsUsed.includes((game ? (game.objectid !== null ? game.objectid : '') : ''))) {
        if (this.selectedExpansions === undefined) {
          this.selectedExpansions = [];
        }
        this.selectedExpansions.push(game);
      }
    })

    // NOTES
    if (play.gameNotes?.length > 0) {
      this.containsGameNotes = true;
    }
    this.gameNotesList = play.gameNotes.map(m => ({note: m}));

    // SCORES
    if (play.scores?.length > 0) {
      this.containsScores = true;
    }
    this.selectedPlayerScoresList = play.scores;

    // CUSTOM NAMES
    if (play.customNames?.length > 0) {
      this.containsCustomNames = true;
    }
    this.selectedPlayerNameList = play.customNames;
    
    // SCENARIO
    if (play.scenario && play.scenario?.id !== '') {
      this.containsScenario = true;
      this.selectedScenarioGame = play.scenario.id.split("-")[0];
      this.getScenarios(play.scenario.id.split("-")[0]);
      this.selectedScenario.id = play.scenario.id;
      this.selectedScenario.win = play.scenario.win;
    }

    // FACTIONS
    let eye = -1;
    if (play.factions?.length > 0) {
      this.containsFactions = true;
      this.selectedPlayerFactionList = [];

      play.factions.forEach(factionType => {
        factionType.factions.forEach(faction => {
          let gamePlayerFaction: GamePlayerFaction = {
            factionTypeId: factionType.typeId,
            gameId: faction.factionId.split('-')[0],
            playerId: faction.playerId,
            factionId: faction.factionId
          }
          eye++;
          this.getFactions(gamePlayerFaction.gameId, eye, gamePlayerFaction.factionTypeId)
          this.selectedPlayerFactionList.push(gamePlayerFaction);
        })
      })
    }
   
  }

  deleteSelectedPlay = (play: PlayDb): void => {
    if (play && this.deletesEnabled) {
      const pickRef = this.afs.collection('play-history');
      pickRef.doc(play.id).delete().then(() => {
        this.playDeletedName = play;
        this.playDeleted = true;
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }

  dateMatch = (play: PlayDb, selectedDate: Date): boolean => {
    this.existingIds.push(play.id)
    let match: boolean = false;
    let date1 = new Date(Number(play.date.seconds) * 1000);
    match = (date1.getFullYear() === selectedDate.getFullYear() 
      && date1.getMonth() === selectedDate.getMonth()
      && date1.getDate() === selectedDate.getDate());
    this.dateMatchIds.push(play.id)
    return match;
  }

  getWinnersNames = (players: string[]): string => {
    let str: string = '';
    players.forEach((player, i) => {
      str += this.utils.getPlayerName(player, this.players)
      if (i + 1 < players.length) {
        str += ', '
      }
    })

    return str;
  }

  removeFactionRow = (): void => {
    this.selectedPlayerFactionList.pop()
  }

  
  removeScoreRow = (): void => {
    this.selectedPlayerScoresList.pop()
  }

  removeNamesRow = (): void => {
    this.selectedPlayerNameList.pop()
  }

  removeGameNotesRow = (): void => {
    this.gameNotesList.pop()
  }
}
