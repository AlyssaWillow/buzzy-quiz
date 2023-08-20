import { Component, Input, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { DisplayPlayerSelection, Players, Selection2 } from '../../models/player-selection';
import { AuthenticationService } from '../../services/authentication.service';
import { AngularFirestore, 
  AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { BoardGame } from 'src/app/models/collection';
import { UtilsService } from 'src/app/services/utils.service';
import { BotService } from 'src/app/services/bot.service';
import { XMLParser } from 'fast-xml-parser';
import { GameGroups } from 'src/app/models/gameGroups';

const options = {
  ignoreAttributes : false,
  attributeNamePrefix : "",
  parseTagValue: true,
  alwaysCreateTextNode: false,
  trimValues: true,
  textNodeName: "text"
};

@Component({
  selector: 'tts-current-selections',
  templateUrl: './current-selections.component.html',
  styleUrls: ['./current-selections.component.scss']
})
export class CurrentSelectionsComponent implements OnInit {
  
  @Input() groupId: string | null = '';
  
  private selectionCol: AngularFirestoreCollection<Selection2>;
  private playersCol: AngularFirestoreCollection<Players>;
  selection$: Observable<Selection2[]>;
  players$: Observable<Players[]>;

  selectionData: DisplayPlayerSelection[] = [];
  selectionData2: DisplayPlayerSelection[] = [];
  user: string = '';
  p011: string = '';
  p012: string = '';
  p013: string = '';
  p014: string = '';
  edit: boolean = false;
  reset: boolean = false;
  bothCol: BoardGame[] = [];
  players: Players[] = [];
  postIt: boolean = true;
  gameGroup: GameGroups[] = [];
  distinctCollections:string[] = [];

  baseUrl1: string = 'https://boardgamegeek.com/xmlapi/collection/';
  suffix1: string = '?own=1';

  genericCollection: BoardGame[] = [];

  private _genericCollection: BehaviorSubject<BoardGame[]> = new BehaviorSubject(this.genericCollection);
  public readonly genericCollection$: Observable<BoardGame[]> = this._genericCollection.asObservable();

  constructor(private afs: AngularFirestore,
      private firebaseDataService: FirebaseDataService,
      private boardGameGeekService: BoardGameGeekService,
      public utils: UtilsService,
      private bot: BotService,
      public authenticationService: AuthenticationService) {
        console.log('asdfasdfadsf', this.groupId)
    this.selectionCol = this.afs.collection('tabletop-syndicate')
                           .doc('selection-data')
                           .collection('current-picks', ref => ref.where('groupId', '==', this.groupId));
    this.selection$ = this.selectionCol.valueChanges();

    this.playersCol = this.afs.collection('tabletop-syndicate')
                              .doc('player-data')
                              .collection('player-names', ref => ref.where('groupId', '==', this.groupId));
    this.players$ = this.playersCol.valueChanges();

    this.players$.subscribe(players => {
      this.players = players;
      this.selection$.subscribe(select => {
        this.selectionData = this.createSelectionData(select, players);
        this.selectionData2 = this.createSelectionData(select, players);
      });
    });
  }
  ngOnInit(): void {
    this.afs.collection<GameGroups>('game-groups', ref => ref.where('id', '==', this.groupId))
    .valueChanges().subscribe(gameGroup =>{
      if (this.gameGroup.sort().join(',') !== gameGroup.sort().join(',')) {
        this.gameGroup = gameGroup
        this.afs.collection('tabletop-syndicate').doc('player-data')
        .collection<Players>('player-names', ref => ref.where('id', 'in', gameGroup[0].members))
        .valueChanges().subscribe(playerz=>{
          this.players = playerz;
          this.selection$.subscribe(select => {
            this.selectionData = this.createSelectionData(select, playerz);
            this.selectionData2 = this.createSelectionData(select, playerz);
          });
        })  
      }
    })

    this.playersCol = this.afs.collection('tabletop-syndicate')
                              .doc('player-data')
                              .collection('player-names', ref => ref.where('groupId', '==', this.groupId));
    this.players$ = this.playersCol.valueChanges();
           
    this.players$.subscribe(players => {
      this.players = players;
      this.selection$.subscribe(select => {
        this.selectionData = this.createSelectionData(select, players);
        this.selectionData2 = this.createSelectionData(select, players);
      });
    });
    
    this.selectionCol = this.afs.collection('tabletop-syndicate')
                                .doc('selection-data')
                                .collection('current-picks', ref => ref.where('groupId', '==', this.groupId));
    this.selection$ = this.selectionCol.valueChanges();
    this.firebaseDataService.players$.subscribe(players => {
      this.players = players;
      players.forEach(plyr => {
        plyr.collection.forEach(coll => {
        if (!this.distinctCollections.includes(coll)) {
          this.distinctCollections.push(coll)
        }
      })
      })
      
    this.getSpecificCollections(this.distinctCollections)
      this.authenticationService.userData.subscribe(user => {
        if (user) {
          this.players.forEach(playr => {
            if (playr.acctId === user.uid) {
              this.user = playr.id
            }
          });
        }
      });
      this.selection$.subscribe(select => {
        this.selectionData = this.createSelectionData(select, players);
        this.selectionData2 = this.createSelectionData(select, players);
      });
    });

    this.getSpecificCollections(this.distinctCollections)

   
  }

  createSelectionData = (selections: Selection2[], players: Players[]): DisplayPlayerSelection[]  => {
    let dispList: DisplayPlayerSelection[] = [];
    let disp: DisplayPlayerSelection;
    let name: string;
    if (selections && players) {
      for (let selection of selections) {
        name = '';
        for (let player of players) {
          if (selection.player === player.id) {
            name = player.firstName
          }
        }
        disp = {
          order: selection.order,
          playerId: selection.player,
          id: selection.id,
          player: name,
          pick: selection.pick
        }
        dispList.push(disp);
        
      } 
      dispList.sort(function (a, b) {
        return a.order - b.order;
      });
    }
    return dispList;
  }

  getSpecificCollections = (bggIds: string[]) => {
    bggIds.forEach(id => {
      this._genericCollection.next(this.getCollectionGames(id));
    })
    this.genericCollection$.subscribe(col => {
      this.bothCol = col
    })
  }

  
  getCollectionGames(id: string): any {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const parser = new XMLParser(options);
            if (this._genericCollection?.getValue()) { 
              this._genericCollection.next(this._genericCollection.getValue()
                                                                  .concat(parser.parse(xhr.response).items.item)
                                                                  .sort((a, b) => (a.name.text > b.name.text) ? 1 : -1));
            } else {
              
              this._genericCollection.next(parser.parse(xhr.response).items.item);
            }
            return parser.parse(xhr.response).items.item;
          } else {
              console.error('error', xhr.response);
              return undefined;
          }
      }
    }
    xhr.open("GET", this.baseUrl1 + id + this.suffix1, true);
    xhr.send();
  }

  updatePicks = async (index: number): Promise<void> => {
    if (this.selectionData[index].playerId === this.selectionData2[index].playerId 
      && this.selectionData[index].pick !== this.selectionData2[index].pick) {
      const pickRef = this.afs.collection('tabletop-syndicate')
                              .doc('selection-data')
                              .collection('current-picks')
                              .doc(this.selectionData[index].id);
      await pickRef.update({ "pick": this.selectionData[index].pick }).then(() => {
        if(this.postIt) {
          this.bot.makeBotTalkGameUpdate(this.selectionData[index].playerId, 
            this.selectionData[index].pick, this.bothCol, this.players)
        }
      })
    }
        
    this.disableEdit();
  }

  resetOrder = async (): Promise<void> => {
    let postOnce: boolean = true;
    this.selectionData2.forEach(async (order2, index) => {
      const pickRef = this.afs.collection('tabletop-syndicate')
                              .doc('selection-data')
                              .collection('current-picks')
                              .doc(order2.id);
      await pickRef.update({ 
        "order": (index+1),
        "pick": []
      });
    }); 

    if (this.postIt) {
      this.selection$.subscribe(select => {
        if (postOnce) {
          postOnce = false;
          this.bot.makeBotTalkOrderUpdate(this.createSelectionData(select, this.players), this.players);
        }
      });
    }
    
    this.disableEdit();
  }
  
   
  enableEdit = () => {
    this.edit = true;
  }
  disableEdit = () => {
    this.edit = false;
    this.reset = false;
  }
  enableResetOrder = () => {
    this.reset = true;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectionData2, event.previousIndex, event.currentIndex);
  }
}
