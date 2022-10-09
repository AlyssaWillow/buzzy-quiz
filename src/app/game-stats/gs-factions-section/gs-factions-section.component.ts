import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { DisplayFactions, Faction, FactionCollection, factionDb, factionDb2, factionTypeData } from 'src/app/models/faction';
import { PlayDb } from 'src/app/models/play';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gs-factions-section',
  templateUrl: './gs-factions-section.component.html',
  styleUrls: ['./gs-factions-section.component.scss']
})
export class GsFactionsSectionComponent implements OnInit {

  @Input() bothCol: BoardGame[] = [];
  @Input() factions: DisplayFactions[] = [];
  @Input() allFactions: factionDb2[] = [];

  factionTypeData: factionTypeData[];
  players: Players[];

  constructor(public utils: UtilsService,
    private firebaseDataService: FirebaseDataService) {
  

    this.factionTypeData = [];
    this.players = [];
  }

  ngOnInit(): void {
    this.firebaseDataService.factionTypes$.subscribe(factionTypeData => {
      this.factionTypeData = factionTypeData;
      this.factionTypeData.sort((a, b) => (a.order > b.order) ? 1 : -1)
    });

    this.firebaseDataService.players$.subscribe(players => {
      this.players = players;
    });
  }
}
