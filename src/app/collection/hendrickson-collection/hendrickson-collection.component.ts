import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameCollection } from 'src/app/models/collection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';

@Component({
  selector: 'app-hendrickson-collection',
  templateUrl: './hendrickson-collection.component.html',
  styleUrls: ['./hendrickson-collection.component.scss']
})
export class HendricksonCollectionComponent implements OnInit {
    @Input('player-count') players: number | undefined;
    @Input('time') time: number | undefined;
    collection$: Observable<GameCollection>;
    constructor(private boardGameGeekService: BoardGameGeekService) { 
      this.boardGameGeekService.getCollections();
      this.collection$ = this.boardGameGeekService.hendricksonCollection$;
    }
  
    ngOnInit(): void {
      this.boardGameGeekService.getCollections();
    }
  
  }
  