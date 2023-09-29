import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BoardGame } from 'src/app/models/collection';
import { GameInstance } from 'src/app/models/play';
import { videoDb } from 'src/app/models/video';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';

@Component({
  selector: 'app-gs-videos',
  templateUrl: './gs-videos.component.html',
  styleUrls: ['./gs-videos.component.scss']
})
export class GsVideosComponent implements OnInit {

  @Input() game: GameInstance = {
    gameId: '',
    bggRank: 0,
    gameName: '',
    gameDetails: {id: '', description: '', yearPublished: 0, minPlayers: 0, maxPlayers: 0, minTime: 0,
    maxTime: 0, boardGameCategory: [], artist: [], designer: [], bggRank: 0},
    plays: [],
    playerWins: [],
    scenarios: [],
    gameImage: '',
    factions: [],
    expansions: {owned: [], unowned: [], ownedPromo: [],  unownedPromo: [], ownedFan: [], unownedFan: [], unownedAcc:[]},
    gameType: '',
    location: '',
    pick: '',
    winners: []
  };
  videosForGame: videoDb[] = [];
  videosFromDb: videoDb[] = [];
  showViddies: boolean = false;
  constructor(private firebaseDataService: FirebaseDataService,
    public sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.firebaseDataService.videos$.subscribe(ref => {
      this.videosFromDb = ref;
      let idList: string[] = [];
    idList.push(this.game.gameId);
    this.game.expansions.owned.forEach(exp => {
      idList.push(exp.id)
    })
    this.getVideoList(idList)
    })
  }

  getVideoList = (idList: string[]): void => {
    if(idList.length > 0) {
      this.videosForGame = this.videosFromDb.filter(ref => idList.includes(ref.gameId));
      this.videosForGame.sort((a, b) => (a.order > b.order) ? 1 : -1)
    }
  }

  toggleViddies = (): void => {
    this.showViddies = !this.showViddies
  }
}
