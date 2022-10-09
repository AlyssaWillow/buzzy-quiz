import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { BoardGame } from 'src/app/models/collection';
import { cycle, nameId } from 'src/app/models/generic';
import { Scenario } from 'src/app/models/play';
import { CycleDb, ScenarioDb, ScenarioDb2, ScenarioGame } from 'src/app/models/scenario';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gs-sn-game-scenario',
  templateUrl: './gs-sn-game-scenario.component.html',
  styleUrls: ['./gs-sn-game-scenario.component.scss']
})
export class GsSnGameScenarioComponent implements OnInit {

  @Input('scenarioGame') scenarioGame: ScenarioGame = {
    gameId: '',
    cycles: []
  };
  @Input('bothCol') bothCol: BoardGame[] = [];
  @Input('last') last: boolean = true;

  scenarioListForGame: ScenarioDb2[] = [];
  newScenarios: ScenarioDb2[] = [];
  newCycles: CycleDb[] = [];
  cycleListForGame: CycleDb[] = [];

  constructor(public utils: UtilsService,
    private firebaseDataService: FirebaseDataService,
    private afs: AngularFirestore) { }

  ngOnInit(): void {
    combineLatest(this.firebaseDataService.cycles$, this.firebaseDataService.scenarios$).subscribe(
      ([cyclez, scenarioz]) => {
      this.newCycles = cyclez;
      this.newScenarios = scenarioz;
      this.getCycleist(this.scenarioGame.gameId, cyclez);
      });
  }

  getCycleist = (gameId: string, cycles: CycleDb[]): void => {
    this.cycleListForGame = cycles.filter(ref => ref.gameId === gameId);
    this.cycleListForGame.sort((a, b) => (a.order > b.order) ? 1 : -1);
  }

  getScenarioList = (cycleId: string): ScenarioDb2[] => {
    return this.newScenarios.filter(ref => ref.gameId === this.scenarioGame.gameId && ref.cycle === cycleId)
    .sort((a, b) => (a.order > b.order) ? 1 : -1)
  }
}
