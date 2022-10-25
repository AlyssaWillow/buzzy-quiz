import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { DisplayPlayerSelection, Players, Selection } from '../../models/player-selection';
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
  private selectionCol: AngularFirestoreCollection<Selection>;
  selection$: Observable<Selection[]>;
  selectionData: DisplayPlayerSelection[] = [];
  selectionData2: DisplayPlayerSelection[] = [];
  p011: string = '';
  p012: string = '';
  p013: string = '';
  p014: string = '';
  edit = false;
  bothCol: BoardGame[] = [];
  players: Players[] = [];

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
      this.boardGameGeekService.hendricksonCollection$
    ).subscribe(
      ([lem, hen]) => {
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
        
        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
      });
  }

  createSelectionData = (selections: Selection[], players: Players[]): DisplayPlayerSelection[]  => {
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

  updatePicks = async (): Promise<void> => {
    this.selectionData.forEach(async pick => {
        this.selectionData2.forEach(async pick2 => {
          if (pick.playerId === pick2.playerId && pick.pick !== pick2.pick) {
            const pickRef = this.afs.collection('tabletop-syndicate')
                                    .doc('selection-data')
                                    .collection('current-picks')
                                    .doc(pick.playerId);
            await pickRef.update({ "pick": pick.pick }).then(
              this.bot.makeBotTalkGameUpdate(pick.playerId, pick.pick, this.bothCol, this.players)
            )
          }
        });
    });

    this.selectionData2.forEach(async (order2, index) => {
      const pickRef = this.afs.collection('tabletop-syndicate')
                              .doc('selection-data')
                              .collection('current-picks')
                              .doc(order2.playerId);
      await pickRef.update({ "order": (index+1) });
    }); 
    
    this.disableEdit();
  }
  
   
  enableEdit = () => {
    this.edit = true;
  }
  disableEdit = () => {
    this.edit = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectionData2, event.previousIndex, event.currentIndex);
  }
}
