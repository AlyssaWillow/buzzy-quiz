import { Component, Input, OnInit } from '@angular/core';
import { PlayDb } from 'src/app/models/play';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'tts-player-picks',
  templateUrl: './player-picks.component.html',
  styleUrls: ['./player-picks.component.scss']
})
export class PlayerPicksComponent implements OnInit {

  @Input('playerId') playerId: string = '';

  playData: PlayDb[] = [];
  gameNames = new Map();
  constructor(private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService) { }

  ngOnInit(): void {
    this.boardGameGeekService.lemanCollection$.subscribe(lem => {
      lem?.item?.forEach(game => {
        this.gameNames.set(game.objectid, game.name.text)
      })
    });

    this.boardGameGeekService.hendricksonCollection$.subscribe(hen => {
      hen?.item?.forEach(game => {
        this.gameNames.set(game.objectid, game.name.text)
      })
    });
    this.firebaseDataService.plays$.subscribe(plays => {
      this.playData = plays.filter(play => play.pick === this.playerId);
      this.playData.sort((a, b) => (a.date < b.date) ? 1 : -1)
    });
  }

  getName = (gameId: string) => {
    return this.gameNames.get(gameId);
  }

}
