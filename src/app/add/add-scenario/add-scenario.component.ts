import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatFormField } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { Players } from 'src/app/home/player-selection';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { doc, setDoc } from "firebase/firestore"; 
import { nameId } from 'src/app/models/generic';
import { Locations } from 'src/app/models/locations';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FormGroup, FormControl } from '@angular/forms';
import { timeStamp } from 'console';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UtilsService } from 'src/app/services/utils.service';
import { ScenarioDb } from 'src/app/models/scenario';

@Component({
  selector: 'app-add-scenario',
  templateUrl: './add-scenario.component.html',
  styleUrls: ['./add-scenario.component.scss']
})
export class AddScenarioComponent implements OnInit {
  
  lemCollection$: Observable<GameCollection>;
  henCollection$: Observable<GameCollection>;

  numbers: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
  bothCol: BoardGame[] = [];
  cycleList: nameId[] = [];

  scenarioId: string = '';
  selectedCycle: nameId = {
    id: '',
    name: ''
  }
  scenarioName: string = '';
  deletesEnabled: boolean = false;
  selectedOrder: number = 0;
  selectedGame: BoardGame | undefined = undefined;
  selectedExpansions: BoardGame[] | undefined = undefined;
  cycle: nameId = {
    id: '',
    name: ''
  };
  scenarioList: ScenarioDb[] = [];
  scenarioDeleted: boolean = false;
  scenarioDeletedName: ScenarioDb = {
    order: 0,
    id: '',
    name: '',
    cycle: ''
  };
  

  constructor(private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService,
    private afs: AngularFirestore) { 
    this.boardGameGeekService.getCollections();
    this.henCollection$ = this.boardGameGeekService.hendricksonCollection$;
    this.lemCollection$ = this.boardGameGeekService.lemanCollection$;
  }

  ngOnInit(): void {
    this.boardGameGeekService.getCollections();
    this.lemCollection$.subscribe(lem => {
      this.henCollection$.subscribe(hen => {
        this.bothCol = lem?.item.concat(hen?.item);
        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
      });
    });
  }

  getScenarios = (gameId: string): void => {
    if (gameId !== '') {
      let scenario: AngularFirestoreCollection<ScenarioDb> = this.afs.collection('scenarios').doc(gameId).collection('scenarios');
      let scenarios$ = scenario.valueChanges();
      scenarios$.subscribe(scenarioz => {
        this.scenarioList = scenarioz;
      })

      let cycle: AngularFirestoreCollection<nameId> = this.afs.collection('scenarios').doc(gameId).collection('cycle-names');
      let cycles$ = cycle.valueChanges();
      cycles$.subscribe(cyclez => {
        this.cycleList = cyclez;
      })
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
      const newScenario: ScenarioDb = {
        id: concatId,
        name: this.scenarioName,
        order: (this.selectedOrder ? this.selectedOrder : 0),
        cycle: (this.selectedCycle ? this.selectedCycle.id : '')
      }

      if (this.selectedGame?.objectid) {
        const pickRef = this.afs.collection('scenarios').doc(this.selectedGame.objectid).collection('scenarios');
        await pickRef.doc(concatId).set(newScenario)

        this.scenarioId = '';
        this.scenarioName = '';
        this.selectedOrder = 0;
        this.selectedCycle = {
          id: '',
          name: ''
        }
      }

    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.scenarioDeleted = false;
  }

  deleteSelectedScenario = (scenario: ScenarioDb) => {
    if (scenario && this.deletesEnabled) {
      const pickRef = this.afs.collection('scenarios').doc(scenario.id.split('-')[0]).collection('scenarios');
      pickRef.doc(scenario.id).delete().then(() => {
        this.scenarioDeletedName = scenario;
        this.scenarioDeleted = true;
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
