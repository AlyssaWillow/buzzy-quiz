import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';

@Component({
  selector: 'app-add-all',
  templateUrl: './add-all.component.html',
  styleUrls: ['./add-all.component.scss']
})
export class AddAllComponent implements OnInit {

  subscriptions: any;
  lemCollection$: Observable<GameCollection>;
  henCollection$: Observable<GameCollection>;
  henOverflow$: Observable<GameCollection>;
  expandedIndex = 0;

  bothCol: BoardGame[] = [];

  constructor(private boardGameGeekService: BoardGameGeekService) { 
    this.henCollection$ = this.boardGameGeekService.hendricksonCollection$;
    this.henOverflow$ = this.boardGameGeekService.hendricksonOverflow$;
    this.lemCollection$ = this.boardGameGeekService.lemanCollection$;
  }

  ngOnInit(): void {
    this.subscriptions = combineLatest(
      this.boardGameGeekService.lemanCollection$,
      this.boardGameGeekService.hendricksonCollection$,
      this.boardGameGeekService.hendricksonOverflow$,
      this.boardGameGeekService.unownedCollection$,

    ).subscribe(
      ([lem, hen, henOver, unown]) => {
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
        })

        unown?.item.forEach((game: BoardGame) => {
          if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
            this.bothCol?.push(game);
          }
        }); 
        
        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
