import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { BoardGame } from 'src/app/models/collection';
import { DisplayFactions, factionDb3, factionTypeData } from 'src/app/models/faction';
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
  @Input() allFactions: factionDb3[] = [];
  @Input() players: Players[] = [];
  @Input() factionTypeData: factionTypeData[] = [];

  constructor(public utils: UtilsService) { }

  ngOnInit(): void {
    this.factionTypeData.sort((a, b) => (a.order > b.order) ? 1 : -1)
    this.players.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);
  }
}
