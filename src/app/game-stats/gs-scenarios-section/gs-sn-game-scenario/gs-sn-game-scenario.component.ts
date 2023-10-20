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
  @Input('cycles') newCycles: CycleDb[] = [];
  @Input('last') last: boolean = true;
  @Input('scenarios') newScenarios: ScenarioDb2[] = [];

  scenarioListForGame: ScenarioDb2[] = [];
  cycleListForGame: CycleDb[] = [];

  constructor(public utils: UtilsService) { }

  ngOnInit(): void {
    this.getCycleList(this.scenarioGame.gameId, this.newCycles);
  }

  getCycleList = (gameId: string, cycles: CycleDb[]): void => {
    this.cycleListForGame = cycles.filter(ref => ref.gameId === gameId);
    this.cycleListForGame.sort((a, b) => (a.order > b.order) ? 1 : -1);
  }

  getScenarioList = (cycleId: string): ScenarioDb2[] => {
    return this.newScenarios.filter(ref => ref.gameId === this.scenarioGame.gameId && ref.cycle === cycleId)
                            .sort((a, b) => (a.order > b.order) ? 1 : -1)
  }
}
