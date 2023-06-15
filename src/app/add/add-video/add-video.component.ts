import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardGame } from 'src/app/models/collection';
import { videoDb } from 'src/app/models/video';
import { nameId } from 'src/app/models/generic';
import { ListGuide } from 'src/app/models/list-guide';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

 
  @Input('bothCol') bothCol: BoardGame[] = [];

  numbers: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
  41,42,43,44,45,46,47,48,49,50]
  selectedVideoType: nameId[] = [];
  gameTypes: nameId[] = [];
  videoTypes: nameId[] = [];
  videoId: string = '';
  videoDescription: string = '';
  deletesEnabled: boolean = false;
  selectedOrder: number = 0;
  selectedGame: BoardGame | undefined = undefined;
  selectedExpansions: BoardGame[] | undefined = undefined;
  videoList: videoDb[] = [];
  newVideos: videoDb[] = [];
  seletedNewVideoList: videoDb[] = [];
  subscriptions: any;
  videoDeleted: boolean = false;
  videoDeletedDescription: videoDb = {
    gameId: '',
    order: 0,
    id: '',
    description: ''
  };

  constructor(public utils: UtilsService,
              private afs: AngularFirestore,
              private firebaseDataService: FirebaseDataService) {
  }

  ngOnInit(): void {
    // this.selectedPlayerVideoList.push(this.selectedPlayerVideo);

    this.subscriptions = this.firebaseDataService.videos$.subscribe(videoz => {
      this.newVideos = videoz;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getVideos = (gameId: string): void => {
    let gId: string = '';

    if (this.selectedGame && this.selectedGame.objectid) {
      gId = this.selectedGame.objectid;
    } else if (gameId !== '') {
      gId = gameId;
    }

    if (gId !== '') {
      this.seletedNewVideoList = this.newVideos.filter(ref => ref.gameId === gId);
      this.seletedNewVideoList.sort((a, b) => (a.order > b.order) ? 1 : -1)
    }
  }

  setVideoData = (order: number, id: string, description: string) => {
    this.videoId = id;
    this.videoDescription = description;
    this.selectedOrder = order
  }

  submit = async () => {
    if (this.selectedGame && this.videoId && this.videoDescription) {
      let concatId = this.selectedGame.objectid + '-' + this.videoId

      if (this.selectedGame?.objectid) {
        const newNewVideo: videoDb = {
          id: this.videoId,
          description: this.videoDescription,
          gameId: this.selectedGame.objectid,
          order: (this.selectedOrder ? this.selectedOrder : 0)
        }
        const newPickRef = this.afs.collection('videos');
        await newPickRef.doc(this.selectedGame.objectid + '-' + this.videoId)
        .set(newNewVideo).catch((error) => {
          console.error("Error adding document: ", error);
        });
        
      this.seletedNewVideoList = this.newVideos.filter(ref => ref.gameId === this.selectedGame?.objectid);
      this.seletedNewVideoList.sort((a, b) => (a.order > b.order) ? 1 : -1)
        this.videoId = '';
        this.videoDescription = '';
        this.selectedOrder = 0;
      }

    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.videoDeleted = false;
  }

  deleteSelectedVideo = (video: videoDb) => {
    if (video && this.deletesEnabled) {
      const pickRef = this.afs.collection('videos');
      pickRef.doc(video.id).delete().then(() => {
        this.videoDeletedDescription = video;
        this.videoDeleted = true;
        console.info("Document successfully deleted!");
      }).catch((error) => {
        console.error("Error removing document: ", error);
      });
    }
  }
}
