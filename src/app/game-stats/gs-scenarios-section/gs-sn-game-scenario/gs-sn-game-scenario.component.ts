import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BoardGame } from 'src/app/models/collection';
import { nameId } from 'src/app/models/generic';
import { Scenario } from 'src/app/models/play';
import { ScenarioDb, ScenarioGame } from 'src/app/models/scenario';
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
  @Input('last') last: boolean = false;

  scenarioListForGame: ScenarioDb[] = [];
  cycleListForGame: nameId[] = [];

  constructor(public utils: UtilsService,
    private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.getScenarioList(this.scenarioGame.gameId)
    console.log('scenarioGame', this.scenarioGame)
  }

  getScenarioList = (gameId: string): void => {
    let scenarioCol: AngularFirestoreCollection<ScenarioDb> = this.afs.collection('scenarios').doc(gameId).collection('scenarios');
    let scenarios$ = scenarioCol.valueChanges();

    scenarios$.subscribe(scenarios => {
      this.scenarioListForGame = scenarios;
      // this.addZeros(this.scenarioGame, this.scenarioListForGame);
      this.scenarioListForGame.sort((a, b) => (a.order > b.order) ? 1 : -1)
    });

    let cycleCol: AngularFirestoreCollection<nameId> = this.afs.collection('scenarios').doc(gameId).collection('cycle-names');
    let cycles$ = cycleCol.valueChanges();

    cycles$.subscribe(cycles => {
      this.cycleListForGame = cycles;
    });
  }

  // addZeros = (scenarioGame: Scenario, scenarioListForGame: ScenarioDb[]) => {
  //   let found = false;
  //   scenarioListForGame.forEach(allScenario => {
  //     found = false;
  //     scenarioGame.scenarios.forEach(scenario => {
  //       if (scenario.scenarioId === allScenario.id) {
  //         found = true
  //       }
  //     })
  //     if (!found) {
  //       let newFaction: Scenario = {
  //         scenarioId: '',
  //         scenarioName: '',
  //         plays: 0,
  //         wins: 0
  //       }
  //       this.players.forEach(player => {
  //         newFaction.playerCount.push({
  //           playerId: player.id,
  //           count: 0
  //         })
  //       });
  //       scenarioGame.scenarios.push(newFaction)
  //     }

  //   })

  // }

}
