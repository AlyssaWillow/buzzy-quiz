import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from './models/player-selection';
import { GameCollection, AllBoardGames, AllBoardGame, BoardGame } from './models/collection';
import { factionTypeData, Faction } from './models/faction';
import { nameId } from './models/generic';
import { Locations } from './models/locations';
import { GameInstance, PlayDb } from './models/play';
import { BoardGameGeekService } from './services/board-game-geek.service';
import { FirebaseDataService } from './services/firebase-data.service';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TabletopSyndicate';
  constructor(private firebaseData: FirebaseDataService,
    private afs: AngularFirestore,
    private boardGameGeekService: BoardGameGeekService,
    private utils: UtilsService) {
  }
  ngOnInit(): void {
    this.firebaseData.fetchFactionTypeData();
    this.firebaseData.fetchPlayerNameData();
    this.firebaseData.fetchLocationData();
    this.firebaseData.fetchSelectionData();
    this.firebaseData.fetchListGuideData();
    this.firebaseData.fetchPlayHistoryData();
    this.firebaseData.fetchExpansionOverrideData();
    this.firebaseData.fetchFactionData();
    this.firebaseData.fetchFaction2Data();
    this.firebaseData.fetchScenarioData();
    this.firebaseData.fetchCycleData();
    this.firebaseData.fetchVideoData();
    this.firebaseData.fetchListData();
    this.boardGameGeekService.getCollections();
    this.boardGameGeekService.hendricksonCollection$.subscribe(hen => {
      this.utils.aggregateCollections(hen, 'hendrickson');
    });
    this.boardGameGeekService.hendricksonOverflow$.subscribe(hen => {
      this.utils.aggregateCollections(hen, 'hendrickson');
    });
    this.boardGameGeekService.lemanCollection$.subscribe(leman => {
      this.utils.aggregateCollections(leman, 'leman');
    });
  }
}