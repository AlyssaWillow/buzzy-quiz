import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BoardGame } from 'src/app/models/collection';
import { CycleDb } from 'src/app/models/scenario';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-cycle',
  templateUrl: './add-cycle.component.html',
  styleUrls: ['./add-cycle.component.scss']
})
export class AddCycleComponent implements OnInit {

  @Input('bothCol') bothCol: BoardGame[] = [];
 
  cycleList: CycleDb[] = [];
  numbers: number[] = [...Array(100).keys()]
  cycleId: string = '';
  selectedCycle: CycleDb = {
    id: '',
    name: '',
    display: false,
    order: 0,
    gameId: ''
  }
  cycleName: string = '';
  cycleDisplay: boolean = false;
  deletesEnabled: boolean = false;
  newCycles: CycleDb[] = [];
  newCycleList: CycleDb[] = [];
  cycleOrder: number = 0;
  selectedGame: BoardGame | undefined = undefined;
  cycle: CycleDb = {
    id: '',
    name: '',
    display: false,
    order: 0,
    gameId: ''
  };
  cycleDeleted: boolean = false;
  cycleDeletedName: CycleDb = {
    id: '',
    name: '',
    display: false,
    order: 0,
    gameId: ''
  };
  

  constructor(public utils: UtilsService,
    private afs: AngularFirestore,
    private firebaseDataService: FirebaseDataService) {
  }

  ngOnInit(): void {
    this.firebaseDataService.cycles$.subscribe(cyclez => {
      this.newCycles = cyclez;
    });
  }

  getCycles = (gameId: string): void => {
    if (gameId !== '') {
      this.newCycleList = this.newCycles.filter(ref => ref.gameId === gameId);
      this.newCycleList.sort((a, b) => (a.order > b.order) ? 1 : -1)
    }
  }

  editSelectedCycle = (cycle: CycleDb) => {
    this.cycleId = cycle.id.split('-')[1];
    this.cycleName = cycle.name;
    this.cycleOrder = cycle.order;
    this.cycleDisplay = cycle.display;
  }

  submit = async () => {
    if (this.selectedGame && this.cycleId && this.cycleName) {
      let concatId = this.selectedGame.objectid + '-' + this.cycleId
      const newCycle2: CycleDb = {
        id: concatId,
        name: this.cycleName,
        display: this.cycleDisplay,
        order: this.cycleOrder,
        gameId: (this.selectedGame?.objectid ? this.selectedGame?.objectid: '')
      }

      if (this.selectedGame?.objectid) {
        const newPickRef = this.afs.collection('cycles');
        await newPickRef.doc(this.selectedGame.objectid + '-' + this.cycleId).set(newCycle2);

        this.newCycleList = this.newCycles.filter(ref => ref.gameId === this.selectedGame?.objectid);
      this.newCycleList.sort((a, b) => (a.order > b.order) ? 1 : -1)

        this.cycleId = '';
        this.cycleName = '';
        this.cycleOrder = 0;
        this.cycleDisplay = false;
      }

    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.cycleDeleted = false;
  }

  deleteSelectedCycle = (cycle: CycleDb) => {
    if (cycle && this.deletesEnabled) {
      const pickRef = this.afs.collection('cycles');
      pickRef.doc(cycle.gameId + '-' + this.cycleId).delete().then(() => {
        this.cycleDeletedName = cycle;
        this.cycleDeleted = true;
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
