import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardGame } from '../models/collection';
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
  lists: listDb[] = [];
  selectedList: string = '';
  players: Players[] = [];

  constructor(public utils: UtilsService,
    private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService) {
  }

  ngOnInit(): void {
    combineLatest(
      this.firebaseDataService.lists$,
      this.firebaseDataService.players$,
      this.boardGameGeekService.lemanCollection$,
      this.boardGameGeekService.hendricksonCollection$,
      this.boardGameGeekService.hendricksonOverflow$
    ).subscribe(
      ([listz, playerz, lem, hen, henOver]) => {
        this.players = playerz;
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

}
