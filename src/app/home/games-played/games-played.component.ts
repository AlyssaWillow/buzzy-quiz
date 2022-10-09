import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AllBoardGames } from 'src/app/models/collection';
import { PlayDb } from 'src/app/models/play';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';

interface GamesPlayedByPlayer {
  gameId: string;
  gameName: string;
  totalPlays: number;
  mattPlays: number;
  kellyPlays: number;
  jenPlays: number;
  alyssaPlays: number;
}

@Component({
  selector: 'tts-games-played',
  templateUrl: './games-played.component.html',
  styleUrls: ['./games-played.component.scss']
})
export class GamesPlayedComponent implements OnInit {
  gameNames = new Map();

  gamesPlayed: GamesPlayedByPlayer[] = [];

  constructor(private firebaseDataService: FirebaseDataService,
    private boardGameGeekService: BoardGameGeekService) { 
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
      this.gamesPlayed = this.collectPlayData(plays);
    });
    
  }

  ngOnInit(): void {

  }

  collectPlayData = (plays: PlayDb[]): GamesPlayedByPlayer[] => {
    let playsList: GamesPlayedByPlayer[] = [];
    let playGame: GamesPlayedByPlayer;
    let ids: string[] = [];

    plays.forEach(play => {
      if (!ids.includes(play.gameId)) {
        ids.push(play.gameId)
        playGame = {
          gameId: play.gameId,
          gameName: this.getName(play.gameId),
          totalPlays: 1, 
          mattPlays: this.addToPlayerPicks(play.pick, 'p011', 0), 
          kellyPlays: this.addToPlayerPicks(play.pick, 'p012', 0), 
          jenPlays: this.addToPlayerPicks(play.pick, 'p013', 0), 
          alyssaPlays: this.addToPlayerPicks(play.pick, 'p014', 0)
        }
        playsList.push(playGame);
      } else {
        playsList.map(gp => gp.gameId === play.gameId ? {...playsList, 
          totalPlays: gp.totalPlays++,
          mattPlays: (play.pick === 'p011' ? gp.mattPlays++ : gp.mattPlays),
          kellyPlays: (play.pick === 'p012' ? gp.kellyPlays++ : gp.kellyPlays),
          jenPlays: (play.pick === 'p013' ? gp.jenPlays++ : gp.jenPlays),
          alyssaPlays: (play.pick === 'p014' ? gp.alyssaPlays++ : gp.alyssaPlays)
        } : gp);
      }
      play.expansionsUsed?.forEach(exp => {
        if (!ids.includes(exp)) {
          ids.push(exp)
          playGame = {
            gameId: exp,
            gameName: this.getName(exp),
            totalPlays: 1, 
            mattPlays: this.addToPlayerPicks(play.pick, 'p011', 0), 
            kellyPlays: this.addToPlayerPicks(play.pick, 'p012', 0), 
            jenPlays: this.addToPlayerPicks(play.pick, 'p013', 0), 
            alyssaPlays: this.addToPlayerPicks(play.pick, 'p014', 0)
          }
          playsList.push(playGame);
        } else {
          playsList.map(gp => gp.gameId === exp ? {...playsList, 
            totalPlays: gp.totalPlays++,
            mattPlays: (play.pick === 'p011' ? gp.mattPlays++ : gp.mattPlays),
            kellyPlays: (play.pick === 'p012' ? gp.kellyPlays++ : gp.kellyPlays),
            jenPlays: (play.pick === 'p013' ? gp.jenPlays++ : gp.jenPlays),
            alyssaPlays: (play.pick === 'p014' ? gp.alyssaPlays++ : gp.alyssaPlays)
          } : gp);
        }
      })
    })
    playsList.sort((a, b) => (a.gameName > b.gameName) ? 1 : -1)
    return playsList;
  }

  addToPlayerPicks = (playerId: string, id: string, plays: number): number => {
    if (playerId == id) { 
      return (plays + 1);
    }else{
      return plays;
    }
  }

  getName = (gameId: string) => {
    return this.gameNames.get(gameId);
  }

}
