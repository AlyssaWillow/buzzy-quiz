import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, combineLatest } from 'rxjs';
import { videoDb } from 'src/app/models/video';
import { Selection2 } from 'src/app/models/player-selection'
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { Timestamp } from 'src/app/models/play';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'tts-prepare-for-gn',
  templateUrl: './prepare-for-gn.component.html',
  styleUrls: ['./prepare-for-gn.component.scss']
})
export class PrepareForGnComponent implements OnInit {

  @Input() groupId: string | null = '';

  private selectionCol: AngularFirestoreCollection<Selection2>;
  selection$: Observable<Selection2[]>;
  
  videosForGame: videoDb[] = [];
  videosFromDb: videoDb[] = [];
  showViddies: boolean = false;
  constructor(private firebaseDataService: FirebaseDataService,
              private afs: AngularFirestore,
              public sanitizer: DomSanitizer) {
      this.selectionCol = this.afs.collection('tabletop-syndicate')
                           .doc('selection-data')
                           .collection('current-picks', ref => ref.where('groupId', '==', this.groupId));
    this.selection$ = this.selectionCol.valueChanges();
  }

  ngOnInit(): void {
    this.selectionCol = this.afs.collection('tabletop-syndicate')
                                .doc('selection-data')
                                .collection('current-picks', ref => ref.where('groupId', '==', this.groupId));
    this.selection$ = this.selectionCol.valueChanges();
    combineLatest(
      this.selection$,
      this.firebaseDataService.videos$,
      this.firebaseDataService.plays$
    ).subscribe(
      ([selections, videos, plays]) => {
        console.log('groupId', this.groupId, selections)
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
      let numOfPicks: number = 0;

      selections.forEach(sel => {
        numOfPicks += (sel.pick.length > 0 ? 1 : 0)
      })

      dateList.sort((a, b) => (a < b) ? 1 : -1);
      dateList = dateList.slice(0, numOfPicks)

      recentPlays = recentPlays.filter(ref => dateList.includes(ref.date.seconds))
      let recentIds: string[] = [];
      recentPlays.forEach(rPlay => {
        recentIds.push(rPlay.gameId)
        recentIds = [...recentIds, ...rPlay.expansionsUsed]
      })
      
      let found: boolean = false
      selections.forEach(sel => {
        found = false
        sel.pick.forEach(ids=> {
          if (recentIds.includes(ids)) {
            found = true;
          }
        })
        if (!found) {
        sel.pick.forEach(ids=> {
          if (!recentIds.includes(ids)) {
            idList.push(ids)
          }
        })
      }
      })

      this.getVideoList(idList)
    })
  }

  getVideoList = (idList: string[]): void => {
    this.videosForGame = [];
    if(idList.length > 0) {
      idList.forEach(id => {
        this.videosForGame.push(...this.videosFromDb.filter(ref => ref.gameId === id).sort((a, b) => (a.order > b.order) ? 1 : -1));
      })
    }
  }
}

