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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TabletopSyndicate';
  constructor(private firebaseData: FirebaseDataService,
    private afs: AngularFirestore,
    private boardGameGeekService: BoardGameGeekService) {
  }
  ngOnInit(): void {
    this.firebaseData.fetchFactionTypeData();
    this.firebaseData.fetchPlayerNameData();
    this.firebaseData.fetchLocationData();
    this.firebaseData.fetchListGuideData();
    this.firebaseData.fetchPlayHistoryData();
    this.firebaseData.fetchExpansionOverrideData();
    this.firebaseData.fetchFactionData();
    this.firebaseData.fetchScenarioData();
    this.firebaseData.fetchCycleData();
    this.boardGameGeekService.getCollections();
  }
}