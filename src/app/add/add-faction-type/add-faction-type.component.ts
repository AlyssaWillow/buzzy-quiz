import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatFormField } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { doc, setDoc } from "firebase/firestore"; 
import { nameId } from 'src/app/models/generic';
import { Locations } from 'src/app/models/locations';
import { FormGroup, FormControl } from '@angular/forms';
import { timeStamp } from 'console';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UtilsService } from 'src/app/services/utils.service';
import { factionTypeData } from 'src/app/models/faction';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';


@Component({
  selector: 'app-add-faction-type',
  templateUrl: './add-faction-type.component.html',
  styleUrls: ['./add-faction-type.component.scss']
})
export class AddFactionTypeComponent implements OnInit {
  numbers: number[] = [...Array(100).keys()]
  factionTypeList: factionTypeData[] = [];
  deletesEnabled: boolean = false;
  subscriptionFactionTypes: any;
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
  

  constructor(public utils: UtilsService,
    private afs: AngularFirestore,
    private firebaseDataService: FirebaseDataService) { 
  }

  ngOnInit(): void {
    this.getCycles();
  }

  ngOnDestroy() {
    this.subscriptionFactionTypes.unsubscribe();
  }

  getCycles = (): void => {
      let factionTypes: AngularFirestoreCollection<factionTypeData> = this.afs.collection('faction-type-data');
      let factionTypes$ = factionTypes.valueChanges();
      this.subscriptionFactionTypes = this.firebaseDataService.factionTypes$.subscribe(factionTypez => {
        this.factionTypeList = factionTypez;
      })
  }

  editSelectedCycle = (factionType: factionTypeData) => {
    this.factionType.id = factionType.id.split('-')[1];
    this.factionType.name = factionType.name;
    this.factionType.order = factionType.order
  }

  submit = async () => {
    if (this.factionType.id !== '' && this.factionType.name !== '' && this.factionType.order !== 0) {
      const pickRef = this.afs.collection('faction-type-data');
      let concatId = 'fac-' + this.factionType.id;
      this.factionType.id = concatId;
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
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
