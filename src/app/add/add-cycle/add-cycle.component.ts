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

@Component({
  selector: 'app-add-cycle',
  templateUrl: './add-cycle.component.html',
  styleUrls: ['./add-cycle.component.scss']
})
export class AddCycleComponent implements OnInit {

 
  lemCollection$: Observable<GameCollection>;
  henCollection$: Observable<GameCollection>;

  bothCol: BoardGame[] = [];
  cycleList: nameId[] = [];

  cycleId: string = '';
  selectedCycle: nameId = {
    id: '',
    name: ''
  }
  cycleName: string = '';
  deletesEnabled: boolean = false;
  selectedGame: BoardGame | undefined = undefined;
  cycle: nameId = {
    id: '',
    name: ''
  };
  cycleDeleted: boolean = false;
  cycleDeletedName: nameId = {
    id: '',
    name: ''
  };
  

  constructor(private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService,
    private afs: AngularFirestore) { 
    this.henCollection$ = this.boardGameGeekService.hendricksonCollection$;
    this.lemCollection$ = this.boardGameGeekService.lemanCollection$;
  }

  ngOnInit(): void {
    this.boardGameGeekService.getCollections();
    this.lemCollection$.subscribe(lem => {
      this.bothCol = this.bothCol.concat(lem?.item);
      this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
    });
    this.henCollection$.subscribe(hen => {
      this.bothCol = this.bothCol.concat(hen?.item);
      this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
    });
  }

  getCycles = (gameId: string): void => {
    if (gameId !== '') {
      let cycle: AngularFirestoreCollection<nameId> = this.afs.collection('scenarios').doc(gameId).collection('cycle-names');
      let cycles$ = cycle.valueChanges();
      cycles$.subscribe(cyclez => {
        this.cycleList = cyclez;
      })
    }
  }

  editSelectedCycle = (cycle: nameId) => {
    this.cycleId = cycle.id;
    this.cycleName = cycle.name;
  }

  submit = async () => {
    if (this.selectedGame && this.cycleId && this.cycleName) {
      let concatId = this.selectedGame.objectid + '-' + this.cycleId
      const newCycle: nameId = {
        id: concatId,
        name: this.cycleName
      }

      if (this.selectedGame?.objectid) {
        const pickRef = this.afs.collection('scenarios').doc(this.selectedGame.objectid).collection('cycle-names');
        await pickRef.doc(concatId).set(newCycle)

        this.cycleId = '';
        this.cycleName = '';
      }

    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.cycleDeleted = false;
  }

  deleteSelectedCycle = (cycle: nameId) => {
    if (cycle && this.deletesEnabled) {
      const pickRef = this.afs.collection('scenarios').doc(cycle.id.split('-')[0]).collection('cycle-names');
      pickRef.doc(cycle.id).delete().then(() => {
        this.cycleDeletedName = cycle;
        this.cycleDeleted = true;
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
