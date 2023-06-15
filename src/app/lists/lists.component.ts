import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardGame, ListContent, ListType, Selections, displayHeader, displayLists } from '../models/collection';
import { Players } from '../models/player-selection';
import { listDb, PlayerList } from '../models/scenario';

import { BoardGameGeekService } from '../services/board-game-geek.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from '../services/utils.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  bothCol: BoardGame[] = [];
  listTypes: ListType[] = [];
  lists: listDb[] = [];
  selectedList: string = '';
  players: Players[] = [];
  subscriptions: any;
  displayList: displayLists = {
    header: [],
    content: []
  };

  constructor(public utils: UtilsService,
    private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService) {
  }

  ngOnInit(): void {
    this.subscriptions = combineLatest(
      this.firebaseDataService.lists$,
      this.firebaseDataService.listTypes$,
      this.firebaseDataService.players$,
      this.boardGameGeekService.lemanCollection$,
      this.boardGameGeekService.hendricksonCollection$,
      this.boardGameGeekService.hendricksonOverflow$
    ).subscribe(
      ([listz, listTypez,playerz, lem, hen, henOver]) => {
        this.players = playerz;
        this.listTypes = listTypez;
        this.lists = listz;
        this.lists?.sort((a, b) => (a.year > b.year) ? 1 : -1)
        this.lists?.sort((a, b) => (a.name > b.name) ? 1 : -1)

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
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getList = () => {
    let selected: listDb[] = this.lists.filter(f => f.listId == this.selectedList)
    let playerIds: string[] = [];
    let order: number = 0;
    let ranks: number[] = [];
    let selections: Selections[] = [];
    let listContent: ListContent[] = [];
    let displayHeaders: displayHeader[] = [];
    if (selected.length == 1) {
      console.log(selected[0])

      selected[0].lists.forEach(list => {
        if (!playerIds.includes(list.playerId)) {
          playerIds.push(list.playerId)
        }
        playerIds?.sort((a, b) => (a > b) ? 1 : -1)
      });
      playerIds.forEach(player => {
        displayHeaders.push({
          order: order,
          playerId: player
        })
        order++;
      })
      this.displayList.header = displayHeaders
      selected[0].lists.forEach(list => {

        //  ListContent {
      //   rank: number;
      //   selections: Selections[];
      // }
      
      // Selections {
      //   player: displayHeader;
      //   gameId: string;
      //notes
      //   previous: number
      // }

        if (!ranks.includes(list.order)) {
          listContent.push({
            rank: list.order,
            selections: []
          })
        }
        ranks.push(list.order)
        listContent.find(f => f.rank == list.order)?.selections.push({
          player: displayHeaders.find(f=> { return f.playerId === list.playerId}),
          gameId: list.gameId,
          notes: list.notes,
          previous: 0
        })
        listContent.find(f => f.rank == list.order)?.selections.sort((a, b) => (a > b) ? 1 : -1)
        listContent?.sort((a, b) => (a.rank > b.rank) ? 1 : -1)
        console.log(listContent)
      });
      this.displayList.content = listContent;
    }
  }
}
