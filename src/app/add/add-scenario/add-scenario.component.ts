import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardGame } from 'src/app/models/collection';
import { cycle } from 'src/app/models/generic';
import { UtilsService } from 'src/app/services/utils.service';
import { CycleDb, ScenarioDb, ScenarioDb2 } from 'src/app/models/scenario';
import { ListGuide } from 'src/app/models/list-guide';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-scenario',
  templateUrl: './add-scenario.component.html',
  styleUrls: ['./add-scenario.component.scss']
})
export class AddScenarioComponent implements OnInit {
  
  
  @Input('bothCol') bothCol: BoardGame[] = [];

  numbers: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
  cycleList: cycle[] = [];

  scenarioId: string = '';
  newScenarios: ScenarioDb2[] = [];
  newCycles: CycleDb[] = [];
  seletedNewScenarioList: ScenarioDb2[] = [];
  selectedCycle: cycle = {
    id: '',
    name: '',
    display: false
  }
  scenarioName: string = '';
  deletesEnabled: boolean = false;
  selectedOrder: number = 0;
  selectedGame: BoardGame | undefined = undefined;
  selectedExpansions: BoardGame[] | undefined = undefined;
  cycle: cycle = {
    id: '',
    name: '',
    display: false
  };
  scenarioList: ScenarioDb[] = [];
  scenarioDeleted: boolean = false;
  
  cycleSubscription: any;
  scenariosSubscription: any;
  scenarioDeletedName: ScenarioDb = {
    order: 0,
    id: '',
    name: '',
    cycle: ''
  };
  

  constructor(public utils: UtilsService,
    public authenticationService: AuthenticationService,
    private firebaseDataService: FirebaseDataService,
    private router: Router,
    private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.authenticationService.userData.subscribe(user => {
      if (!user) {
        this.router.navigate(['/home']);
      }
    })
    this.scenariosSubscription = this.firebaseDataService.scenarios$.subscribe(scenarioz => {
      this.newScenarios = scenarioz;
    });

    this.cycleSubscription = this.firebaseDataService.cycles$.subscribe(cyclez => {
      this.newCycles = cyclez;
    });
  }

  ngOnDestroy() {
    this.cycleSubscription.unsubscribe();
    this.scenariosSubscription.unsubscribe();
  }

  getScenarios = (gameId: string): void => {
    if (gameId !== '') {
      this.cycleList = this.newCycles.filter(ref => ref.gameId === gameId);
      this.newCycles.sort((a, b) => (a.order > b.order) ? 1 : -1)

      this.seletedNewScenarioList = this.newScenarios.filter(ref => ref.gameId === gameId);
      this.seletedNewScenarioList.sort((a, b) => (a.order > b.order) ? 1 : -1)
    }
  }

  setFactonDate = (order: number, id: string, cycle: string, name: string) => {
    this.scenarioId = id;
    this.scenarioName = name;
    this.selectedOrder = order;
    this.cycleList.forEach(cycles => {
      if (cycle === cycles.id) {
        this.selectedCycle = cycles;
      }
    })
  }

  submit = async () => {
    if (this.selectedGame && this.scenarioId && this.scenarioName && this.selectedCycle) {
      let concatId = this.selectedGame.objectid + '-' + this.scenarioId

      const newScenario2: ScenarioDb2 = {
        id: concatId,
        name: this.scenarioName,
        gameId: (this.selectedGame  && this.selectedGame.objectid ? this.selectedGame?.objectid : ''),
        order: (this.selectedOrder ? this.selectedOrder : 0),
        cycle: (this.selectedCycle ? this.selectedCycle.id : '')
      }

      if (this.selectedGame?.objectid) {
        const newPickRef = this.afs.collection('scenarios');
        await newPickRef.doc(this.selectedGame.objectid + '-' + this.selectedCycle.id.split('-')[1] +'-'+ this.scenarioId)
        .set(newScenario2).then(then => {
          this.updateGuideList(newScenario2);
          }
        )
        this.seletedNewScenarioList = this.newScenarios.filter(ref => ref.gameId === this.selectedGame?.objectid);
        this.seletedNewScenarioList.sort((a, b) => (a.order > b.order) ? 1 : -1)

        this.scenarioId = '';
        this.scenarioName = '';
        this.selectedOrder = 0;
        this.selectedCycle = {
          id: '',
          name: '',
          display: false
        }
      }

    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.scenarioDeleted = false;
  }

  deleteSelectedScenario = (scenario: ScenarioDb) => {
    if (scenario && this.deletesEnabled && this.selectedGame) {
      const pickRef = this.afs.collection('scenarios');
      pickRef.doc(this.selectedGame.objectid + '-' + this.selectedCycle.id.split('-')[1] +'-'+ this.scenarioId).delete().then(() => {
        this.scenarioDeletedName = scenario;
        this.scenarioDeleted = true;
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }

  updateGuideList = (newScenario: ScenarioDb) => {
    let found: boolean = false;
    let needsToBeUpdated: boolean = true;
    let updateListGuide: ListGuide;
    this.firebaseDataService.listGuides$.subscribe(async listGuide => {
      listGuide.forEach(guide => {
        if (guide.id === newScenario.id.split('-')[0]) {
          updateListGuide = guide;
          found = true;
            if (guide.scenarios) {
              needsToBeUpdated = false;
            }
        }
      })
      if (needsToBeUpdated) {
        const pickRef = this.afs.collection('list-guides');
        if (found) {
          updateListGuide.scenarios = [];
          await pickRef.doc(newScenario.id.split('-')[0]).set(updateListGuide)
        } else {
          let newListGuide: ListGuide = {
            id: newScenario.id.split('-')[0],
            factions: [],
            scenarios: [
              newScenario.cycle
            ],
          }
          await pickRef.doc(newScenario.id.split('-')[0]).set(newListGuide)
        }
      }
    });

  }
}
