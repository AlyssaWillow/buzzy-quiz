import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameGroups } from 'src/app/models/gameGroups';
import { PlayDb } from 'src/app/models/play';
import { Players } from 'src/app/models/player-selection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

interface GamesPlayedByPlayer {
  gameId: string;
  gameName: string;
  totalPlays: number;
  playerGames: PlayerGame[];
}

interface PlayerGame {
  picks: number;
  player: Players;
}

@Component({
  selector: 'tts-games-played',
  templateUrl: './games-played.component.html',
  styleUrls: ['./games-played.component.scss']
})
export class GamesPlayedComponent implements OnInit {

  @Input() groupId: string | null = '';
  
  gameNames = new Map();
  gamesPlayed: GamesPlayedByPlayer[] = [];
  players: Players[] = [];
  gameGroup: GameGroups[] = [];

  constructor(private afs: AngularFirestore,
              private boardGameGeekService: BoardGameGeekService,
              private utils: UtilsService) { }

  ngOnInit(): void {
    this.afs.collection<GameGroups>('game-groups', ref => ref.where('id', '==', this.groupId))
    .valueChanges().subscribe(gameGroup =>{
      if (this.gameGroup.sort().join(',') !== gameGroup.sort().join(',')) {
        this.gameGroup = gameGroup
        this.afs.collection('tabletop-syndicate').doc('player-data')
        .collection<Players>('player-names', ref => ref.where('id', 'in', gameGroup[0].members))
        .valueChanges().subscribe(playerz=>{
          this.players = playerz.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);
        })  
      }
    })
    this.afs.collection<PlayDb>('play-history', ref => ref.where('groupId', '==', this.groupId))
            .valueChanges()
            .subscribe(plays => {
              let listOfIds: string[] = plays.map(m => m.gameId);
              listOfIds.push(...plays.map(m=> m.expansionsUsed).flat())
              this.boardGameGeekService.getlistOfGames(listOfIds);
              this.boardGameGeekService.listOfCollection$.subscribe(s=> {
                s.item.map(m=> {
                  this.gameNames.set(m.id, this.utils.castName2ObjectToList(m.name).find(f=> f.type === 'primary')?.value)
                })
              this.gamesPlayed = this.collectPlayData(plays);
              })
            })
  }

  collectPlayData = (plays: PlayDb[]): GamesPlayedByPlayer[] => {
    let playsList: GamesPlayedByPlayer[] = [];
    let playGame: GamesPlayedByPlayer;
    let ids: string[] = [];
console.log('this.gameNames', this.gameNames)
    plays.forEach(play => {
      if (!ids.includes(play.gameId)) {
        ids.push(play.gameId)
        playGame = {
          gameId: play.gameId,
          gameName: this.getName(play.gameId),
          totalPlays: 1, 
          playerGames:[]
        }
        this.players.forEach(p=>{
          playGame.playerGames.push({player: p, picks: this.addToPlayerPicks(play.pick, p.id, 0)})
        })
        playsList.push(playGame);
      } else {
        playsList.map(gp => gp.gameId === play.gameId ? {...playsList, 
          totalPlays: gp.totalPlays++,
          playerGames: gp.playerGames.map(pg => pg.player.id === play.pick ? {...gp.playerGames, 
            player: pg.player,
            picks: pg.picks++
          } : pg)
        } : gp);
      }
      play.expansionsUsed?.forEach(exp => {
        if (!ids.includes(exp)) {
          ids.push(exp)
          playGame = {
            gameId: exp,
            gameName: this.getName(exp),
            totalPlays: 1, 
            playerGames:[]
        }
        this.players.forEach(p=>{
          playGame.playerGames.push({player: p, picks: this.addToPlayerPicks(play.pick, p.id, 0)})
        })
          playsList.push(playGame);
        } else {

          playsList.map(gp => gp.gameId === exp ? {...playsList, 
            totalPlays: gp.totalPlays++,
            playerGames: gp.playerGames.map(pg => pg.player.id === play.pick ? {...gp.playerGames, 
              player: pg.player,
              picks: pg.picks++
            } : pg)
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
    } else {
      return plays;
    }
  }

  getName = (gameId: string) => {
    return this.gameNames.get(gameId);
  }
}