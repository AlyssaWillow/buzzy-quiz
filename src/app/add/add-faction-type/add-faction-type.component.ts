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
import { factionTypeData } from 'src/app/models/faction';


@Component({
  selector: 'app-add-faction-type',
  templateUrl: './add-faction-type.component.html',
  styleUrls: ['./add-faction-type.component.scss']
})
export class AddFactionTypeComponent implements OnInit {
  numbers: number[] = [...Array(100).keys()]
  factionTypeList: factionTypeData[] = [];
  deletesEnabled: boolean = false;
  factionType: factionTypeData = {
    id: '',
    name: '',
    order: 0
  };
  factionTypeDeleted: boolean = false;
  factionTypeDeletedName: factionTypeData = {
    id: '',
    name: '',
    order: 0
  };
  

  constructor(private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService,
    private afs: AngularFirestore) { 
  }

  ngOnInit(): void {
    this.getCycles();
  }

  getCycles = (): void => {
      let factionTypes: AngularFirestoreCollection<factionTypeData> = this.afs.collection('faction-type-data');
      let factionTypes$ = factionTypes.valueChanges();
      factionTypes$.subscribe(factionTypez => {
        this.factionTypeList = factionTypez;
      })
  }

  editSelectedCycle = (factionType: factionTypeData) => {
    this.factionType.id = factionType.id;
    this.factionType.name = factionType.name;
    this.factionType.order = factionType.order
  }

  submit = async () => {
    if (this.factionType.id !== '' && this.factionType.name !== '' && this.factionType.order !== 0) {
      const pickRef = this.afs.collection('faction-type-data');
      let concatId = 'fac-' + this.factionType.id;
      await pickRef.doc(concatId).set(this.factionType)

      this.factionType.id = '';
      this.factionType.name = '';
      this.factionType.order = 0;
    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.factionTypeDeleted = false;
  }

  deleteSelectedCycle = (factionType: factionTypeData) => {
    if (factionType && this.deletesEnabled) {
      const pickRef = this.afs.collection('faction-type-data');
      pickRef.doc(factionType.id).delete().then(() => {
        this.factionTypeDeletedName = factionType;
        this.factionTypeDeleted = true;
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
