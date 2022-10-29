import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';
import { videoDb } from 'src/app/models/video';
import { Selection2 } from 'src/app/models/player-selection'
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { Timestamp } from 'src/app/models/play';

@Component({
  selector: 'tts-prepare-for-gn',
  templateUrl: './prepare-for-gn.component.html',
  styleUrls: ['./prepare-for-gn.component.scss']
})
export class PrepareForGnComponent implements OnInit {

  videosForGame: videoDb[] = [];
  videosFromDb: videoDb[] = [];
  showViddies: boolean = false;
  constructor(private firebaseDataService: FirebaseDataService,
    public sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    combineLatest(
      this.firebaseDataService.selection$,
      this.firebaseDataService.videos$,
      this.firebaseDataService.plays$
    ).subscribe(
      ([selections, videos, plays]) => {
      this.videosFromDb = videos;
      let idList: string[] = [];

      plays.sort((a, b) => (a.date.seconds < b.date.seconds) ? 1 : -1);
      let recentPlays = plays.slice(0, 30);
      let dateList: string[] = [];

      recentPlays.forEach(rPlay => {
        if (!dateList.includes(rPlay.date.seconds)) {
          dateList.push(rPlay.date.seconds);
        }
      })

      dateList.sort((a, b) => (a < b) ? 1 : -1);
      dateList = dateList.slice(0, 4)

      recentPlays = recentPlays.filter(ref => dateList.includes(ref.date.seconds))
      let recentIds: string[] = [];
      recentPlays.forEach(rPlay => {
        recentIds.push(rPlay.gameId)
        recentIds = [...recentIds, ...rPlay.expansionsUsed]
      })
      
      selections.forEach(sel => {
        sel.pick.forEach(ids=> {
          if (!recentIds.includes(ids)) {
            idList.push(ids)
          }
        })
      })
      console.log('final ids', idList);

      this.getVideoList(idList)
    })
  }

  getVideoList = (idList: string[]): void => {
    // if(idList.length > 0) {
      console.log("ids", idList)
      this.videosForGame = this.videosFromDb.filter(ref => idList.includes(ref.gameId));
      this.videosForGame.sort((a, b) => (a.order > b.order) ? 1 : -1)
    // }
  }
}

