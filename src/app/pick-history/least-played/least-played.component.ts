import { Component, OnInit } from '@angular/core';
import { PlayDb } from 'src/app/models/play';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

interface dispLeastPlayedGames {
  gameId: string;
  gameName: string;
  count: number;
}
@Component({
  selector: 'tts-least-played',
  templateUrl: './least-played.component.html',
  styleUrls: ['./least-played.component.scss']
})
export class LeastPlayedComponent implements OnInit {

  gamePlays: Map<string, dispLeastPlayedGames> = new Map();
  playsList:dispLeastPlayedGames[] = [];
  iteration: boolean = true;
  constructor(private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService) { }

  ngOnInit(): void {
    this.boardGameGeekService.lemanCollection$.subscribe(lem => {
      lem?.item?.forEach(game => {
        if (game?.objectid) {
          this.gamePlays.set(game.objectid, {
            count: 0,
            gameId: game.objectid,
            gameName: game.name.text
          })
        }
      })
    });

    this.boardGameGeekService.hendricksonCollection$.subscribe(hen => {
      hen?.item?.forEach(game => {
        if (game?.objectid) {
          this.gamePlays.set(game.objectid, {
            count: 0,
            gameId: game.objectid,
            gameName: game.name.text
          })
        }
      })
    });

    this.boardGameGeekService.hendricksonOverflow$.subscribe(hen => {
      hen?.item?.forEach(game => {
        if (game?.objectid) {
          this.gamePlays.set(game.objectid, {
            count: 0,
            gameId: game.objectid,
            gameName: game.name.text
          })
        }
      })
    });
    this.firebaseDataService.plays$.subscribe(plays => {
      if (this.iteration) {
      let game: dispLeastPlayedGames | undefined;
      plays.forEach(play => {
        game = {
          gameId: '',
          gameName: '',
          count: 0
        };
          game = this.gamePlays.get(play.gameId);
          if (game !== undefined) {
            game.count++;
            this.gamePlays.set(play.gameId, game);
          }
      })
      this.playsList = [...this.gamePlays.values()];
      this.playsList.sort((a, b) => (a.gameName < b.gameName) ? 1 : -1)
      this.playsList.sort((a, b) => (a.count > b.count) ? 1 : -1)
      this.iteration = false;
    }
    });
  }


}
