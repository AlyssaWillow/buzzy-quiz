import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';

@Component({
  selector: 'app-add-all',
  templateUrl: './add-all.component.html',
  styleUrls: ['./add-all.component.scss']
})
export class AddAllComponent implements OnInit {

  
  lemCollection$: Observable<GameCollection>;
  henCollection$: Observable<GameCollection>;
  expandedIndex = 0;

  bothCol: BoardGame[] = [];

  constructor(private boardGameGeekService: BoardGameGeekService) { 
    this.henCollection$ = this.boardGameGeekService.hendricksonCollection$;
    this.lemCollection$ = this.boardGameGeekService.lemanCollection$;
  }

  ngOnInit(): void {
    this.lemCollection$.subscribe(lem => {
      lem?.item.forEach(game => {
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
      this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
    });
  
    this.henCollection$.subscribe(hen => {
      hen?.item.forEach(game => {
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

 


}
