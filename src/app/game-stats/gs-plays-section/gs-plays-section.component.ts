import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { PlayInstance } from 'src/app/models/play';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CycleDb, ScenarioDb2 } from 'src/app/models/scenario';
import { nameId } from 'src/app/models/generic';
import { factionDb3, factionTypeData } from 'src/app/models/faction';

@Component({
  selector: 'app-gs-plays-section',
  templateUrl: './gs-plays-section.component.html',
  styleUrls: ['./gs-plays-section.component.scss']
})
export class GsPlaysSectionComponent implements OnInit {

  @Input() plays: PlayInstance[] = [];
  @Input() factionTypes: factionTypeData[] = [];
  @Input() cycles: CycleDb[] = [];
  @Input() players: Players[] = [];
  @Input() factions: factionDb3[] = [];
  @Input() scenarios: ScenarioDb2[] = [];
  
  expanded: boolean[] = [];
  
  constructor(public utils: UtilsService) { }

  ngOnInit(): void {
    this.plays.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }

  openPlay = (i: number): void => {
    if (this.expanded[i] === undefined) {
      this.expanded[i] = false;
    }
    this.expanded[i] = !this.expanded[i];
  }

}
