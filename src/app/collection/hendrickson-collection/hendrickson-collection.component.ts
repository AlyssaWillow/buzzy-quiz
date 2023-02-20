import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';

@Component({
  selector: 'app-hendrickson-collection',
  templateUrl: './hendrickson-collection.component.html',
  styleUrls: ['./hendrickson-collection.component.scss']
})
export class HendricksonCollectionComponent implements OnInit {
    @Input('player-count') players: number | undefined;
    @Input('time') time: number | undefined;
    
    bothCol: BoardGame[] = [];

    constructor(private boardGameGeekService: BoardGameGeekService) { 
    }
  
    ngOnInit(): void {
      this.boardGameGeekService.getCollections();
      combineLatest(
        this.boardGameGeekService.hendricksonCollection$,
        this.boardGameGeekService.hendricksonOverflow$
      ).subscribe(
        ([hen, henOver]) => {
          if (hen && henOver) {
            hen?.item.forEach((game: BoardGame) => {
              if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
                this.bothCol.push(game);
              }
            });
    
            henOver?.item.forEach((game: BoardGame) => {
              if (!this.bothCol?.find(e => e.objectid === game.objectid)) {
                this.bothCol.push(game);
              }
            })
            
            this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
          }
        });
    }
  
  }
  