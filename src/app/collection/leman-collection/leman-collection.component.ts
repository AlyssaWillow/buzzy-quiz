import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';

@Component({
  selector: 'app-leman-collection',
  templateUrl: './leman-collection.component.html',
  styleUrls: ['./leman-collection.component.scss']
})
export class LemanCollectionComponent implements OnInit {
  @Input('player-count') players: number | undefined;
  @Input('time') time: number | undefined;
  collection$: Observable<GameCollection>;

  constructor(private boardGameGeekService: BoardGameGeekService) { 
    this.boardGameGeekService.getCollections();
    this.collection$ = this.boardGameGeekService.lemanCollection$;
  }

  ngOnInit(): void {
    this.boardGameGeekService.getCollections();
  }

}

