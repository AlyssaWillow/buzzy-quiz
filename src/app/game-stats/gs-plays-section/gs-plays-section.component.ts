import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { PlayInstance } from 'src/app/models/play';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CycleDb, ScenarioDb2 } from 'src/app/models/scenario';
import { nameId } from 'src/app/models/generic';
import { factionDb3 } from 'src/app/models/faction';

@Component({
  selector: 'app-gs-plays-section',
  templateUrl: './gs-plays-section.component.html',
  styleUrls: ['./gs-plays-section.component.scss']
})
export class GsPlaysSectionComponent implements OnInit {

  @Input() plays: PlayInstance[] = [];

  players: Players[];
  cycles: CycleDb[] = [];
  expanded: boolean[] = [];
  factionTypes: nameId[] = [];
  factions: nameId[] = [];
  scenarios: ScenarioDb2[] = [];
  
  constructor(private firebaseDataService: FirebaseDataService,
    public utils: UtilsService) {
    this.players = []
  }

  ngOnInit(): void {
    this.plays.sort((a, b) => (a.date > b.date) ? 1 : -1);
    this.firebaseDataService.players$.subscribe((players: Players[]) => {
      this.players = players;
    })
    this.firebaseDataService.cycles$.subscribe((cycles: CycleDb[]) => {
      this.cycles = cycles;
    })
    this.firebaseDataService.factionTypes$.subscribe((factionType: nameId[]) => {
      this.factionTypes = factionType;
    })
    this.firebaseDataService.factions$.subscribe((factions: nameId[]) => {
      this.factions = factions;
    })
    this.firebaseDataService.scenarios$.subscribe((scenarios: ScenarioDb2[]) => {
      this.scenarios = scenarios;
    })
  }

  openPlay = (i: number): void => {
    if (this.expanded[i] === undefined) {
      this.expanded[i] = false;
    }
    this.expanded[i] = !this.expanded[i];
  }

}
