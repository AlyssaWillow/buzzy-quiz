import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatFormField } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { doc, setDoc } from "firebase/firestore"; 
import { Faction, factionDb, factionDb2 } from 'src/app/models/faction';
import { nameId } from 'src/app/models/generic';
import { Locations } from 'src/app/models/locations';
import { GamePlayerFaction, Play, PlayerFaction } from 'src/app/models/play';
import { FormGroup, FormControl } from '@angular/forms';
import { timeStamp } from 'console';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { ListGuide } from 'src/app/models/list-guide';

@Component({
  selector: 'app-add-faction',
  templateUrl: './add-faction.component.html',
  styleUrls: ['./add-faction.component.scss']
})
export class AddFactionComponent implements OnInit {
  
  @Input('bothCol') bothCol: BoardGame[] = [];

  numbers: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
  41,42,43,44,45,46,47,48,49,50]
  selectedFactionType: nameId[] = [];
  gameTypes: nameId[] = [];
  factionTypes: nameId[] = [];
  factionId: string = '';
  factionName: string = '';
  deletesEnabled: boolean = false;
  selectedOrder: number = 0;
  selectedGame: BoardGame | undefined = undefined;
  selectedExpansions: BoardGame[] | undefined = undefined;
  selectedGameType: nameId = {
    id: '',
    name: ''
  };
  factionList: factionDb[] = [];
  newFactions: factionDb2[] = [];
  seletedNewFactionList: factionDb2[] = [];
  factionDeleted: boolean = false;
  factionDeletedName: factionDb = {
    order: 0,
    id: '',
    typeId: '',
    name: ''
  };

  constructor(public utils: UtilsService,
              private afs: AngularFirestore,
              private firebaseDataService: FirebaseDataService) {
  }

  ngOnInit(): void {
    // this.selectedPlayerFactionList.push(this.selectedPlayerFaction);

    this.firebaseDataService.factions$.subscribe(factionz => {
      this.newFactions = factionz;
    });

    this.firebaseDataService.factionTypes$.subscribe(factionTypes => {
      this.factionTypes = factionTypes;
    });
  }

  getFactions = (gameId: string, factionTypeId: string): void => {
    let gId: string = '';
    let ftId: string = '';

    if (this.selectedGame && this.selectedGame.objectid) {
      gId = this.selectedGame.objectid;
    } else if (gameId !== '') {
      gId = gameId;
    }
   
    if (this.selectedGameType?.id) {
      ftId = this.selectedGameType.id;
    } else if (factionTypeId !== '') {
      ftId = factionTypeId;
    }

    if (gId !== '' && ftId !== '') {
      this.seletedNewFactionList = this.newFactions.filter(ref => ref.gameId === gId && ref.typeId === ftId);
      this.seletedNewFactionList.sort((a, b) => (a.order > b.order) ? 1 : -1)
    }
  }

  setFactonDate = (order: number, id: string, name: string) => {
    this.factionId = id;
    this.factionName = name;
    this.selectedOrder = order
  }

  submit = async () => {
    if (this.selectedGame && this.factionId && this.factionName) {
      let concatId = this.selectedGame.objectid + '-' + this.factionId

      if (this.selectedGame?.objectid) {
        const newNewFaction: factionDb2 = {
          id: concatId,
          name: this.factionName,
          gameId: this.selectedGame.objectid,
          order: (this.selectedOrder ? this.selectedOrder : 0),
          typeId: this.selectedGameType.id
        }
        const newPickRef = this.afs.collection('factions');
        await newPickRef.doc(this.selectedGame.objectid + '-' + this.selectedGameType.id.split('-')[1] + '-' + this.factionId)
        .set(newNewFaction);
        
      this.seletedNewFactionList = this.newFactions.filter(ref => ref.gameId === this.selectedGame?.objectid && ref.typeId === this.selectedGameType.id);
      this.seletedNewFactionList.sort((a, b) => (a.order > b.order) ? 1 : -1)
        this.factionId = '';
        this.factionName = '';
        this.selectedOrder = 0;
      }

    }
  }

  updateGuideList = (newFaction: factionDb) => {
    let found: boolean = false;
    let needsToBeUpdated: boolean = true;
    let updateListGuide: ListGuide;
    this.firebaseDataService.listGuides$.subscribe(async listGuide => {
      listGuide.forEach(guide => {
        if (guide.id === newFaction.id.split('-')[0]) {
          updateListGuide = guide;
          found = true;
          guide.factions.forEach(faction => {
            if (faction === newFaction.typeId) {
              needsToBeUpdated = false;
            }
          })
        }
      })
      if (needsToBeUpdated) {
        const pickRef = this.afs.collection('list-guides');
        if (found) {
          updateListGuide.factions.push(newFaction.typeId)
          await pickRef.doc(newFaction.id.split('-')[0]).set(updateListGuide)
        } else {
          let newListGuide: ListGuide = {
            id: newFaction.id.split('-')[0],
            factions: [
              newFaction.typeId
            ],
            scenarios: []
          }
          await pickRef.doc(newFaction.id.split('-')[0]).set(newListGuide)
        }
      }
    });

  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.factionDeleted = false;
  }

  deleteSelectedFaction = (faction: factionDb) => {
    if (faction && this.deletesEnabled && this.selectedGame?.objectid) {
      const pickRef = this.afs.collection('factions');
      pickRef.doc(this.selectedGame.objectid + '-' + this.selectedGameType.id.split('-')[1] + '-' + faction.id.split('-')[1]).delete().then(() => {
        this.factionDeletedName = faction;
        this.factionDeleted = true;
        console.info("Document successfully deleted!",);
        this.seletedNewFactionList = this.newFactions.filter(ref => ref.gameId === this.selectedGame?.objectid && ref.typeId === this.selectedGameType.id);
        this.seletedNewFactionList.sort((a, b) => (a.order > b.order) ? 1 : -1)
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
