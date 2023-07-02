import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { DisplayPlayerSelection, Players, Selection2 } from '../../models/player-selection';
import { AuthenticationService } from '../../services/authentication.service';
import { AngularFirestore, 
  AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { BoardGame } from 'src/app/models/collection';
import { UtilsService } from 'src/app/services/utils.service';
import { BotService } from 'src/app/services/bot.service';

@Component({
  selector: 'tts-current-selections',
  templateUrl: './current-selections.component.html',
  styleUrls: ['./current-selections.component.scss']
})
export class CurrentSelectionsComponent implements OnInit {
  private selectionCol: AngularFirestoreCollection<Selection2>;
  selection$: Observable<Selection2[]>;
  selectionData: DisplayPlayerSelection[] = [];
  selectionData2: DisplayPlayerSelection[] = [];
  p011: string = '';
  p012: string = '';
  p013: string = '';
  p014: string = '';
  edit: boolean = false;
  reset: boolean = false;
  bothCol: BoardGame[] = [];
  players: Players[] = [];
  postIt: boolean = true;

  constructor(private afs: AngularFirestore,
      private firebaseDataService: FirebaseDataService,
      private boardGameGeekService: BoardGameGeekService,
      public utils: UtilsService,
      private bot: BotService,
      public authenticationService: AuthenticationService) {
    this.selectionCol = afs.collection('tabletop-syndicate').doc('selection-data').collection('current-picks');
    this.selection$ = this.selectionCol.valueChanges();
    this.firebaseDataService.players$.subscribe(players => {
      this.players = players;
      this.selection$.subscribe(select => {
      this.selectionData = this.createSelectionData(select, players);
      this.selectionData2 = this.createSelectionData(select, players);
    });
    });
  }
  ngOnInit(): void {
    combineLatest(
      this.boardGameGeekService.lemanCollection$,
      this.boardGameGeekService.hendricksonCollection$,
      this.boardGameGeekService.hendricksonOverflow$
    ).subscribe(
      ([lem, hen, henOver]) => {
        console.log(this.afs.collection('tabletop-syndicate').doc('selection-data'))
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

        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
      });
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

  updatePicks = async (index: number): Promise<void> => {
    if (this.selectionData[index].playerId === this.selectionData2[index].playerId 
      && this.selectionData[index].pick !== this.selectionData2[index].pick) {
      const pickRef = this.afs.collection('tabletop-syndicate')
                              .doc('selection-data')
                              .collection('current-picks')
                              .doc(this.selectionData[index].playerId);
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
                              .doc(order2.playerId);
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
