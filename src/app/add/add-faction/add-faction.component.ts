import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatFormField } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { Players } from 'src/app/home/player-selection';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { doc, setDoc } from "firebase/firestore"; 
import { Faction, factionDb } from 'src/app/models/faction';
import { nameId } from 'src/app/models/generic';
import { Locations } from 'src/app/models/locations';
import { GamePlayerFaction, Play, PlayerFaction } from 'src/app/models/play';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { FormGroup, FormControl } from '@angular/forms';
import { timeStamp } from 'console';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-faction',
  templateUrl: './add-faction.component.html',
  styleUrls: ['./add-faction.component.scss']
})
export class AddFactionComponent implements OnInit {
  
  lemCollection$: Observable<GameCollection>;
  henCollection$: Observable<GameCollection>;
  factionTypes$: Observable<nameId[]>;

  numbers: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
  bothCol: BoardGame[] = [];
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
  factionDeleted: boolean = false;
  factionDeletedName: factionDb = {
    order: 0,
    id: '',
    typeId: '',
    name: ''
  };

  private factionTypeCol: AngularFirestoreCollection<nameId>;
  

  constructor(private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService,
    private afs: AngularFirestore) { 
    this.boardGameGeekService.getCollections();
    this.henCollection$ = this.boardGameGeekService.hendricksonCollection$;
    this.lemCollection$ = this.boardGameGeekService.lemanCollection$;

    this.factionTypeCol = afs.collection('faction-type-data');

    this.factionTypes$ = this.factionTypeCol.valueChanges();
  }

  ngOnInit(): void {
    
    // this.selectedPlayerFactionList.push(this.selectedPlayerFaction);
    this.boardGameGeekService.getCollections();
    this.lemCollection$.subscribe(lem => {
      this.henCollection$.subscribe(hen => {
        this.bothCol = lem?.item.concat(hen?.item);
        this.bothCol?.sort((a, b) => (a.name.text > b.name.text) ? 1 : -1)
      });
    });
    this.factionTypes$.subscribe(factionTypes => {
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
      let factions: AngularFirestoreCollection<factionDb>;
      factions = this.afs.collection('factions').doc(gId).collection(ftId);
      let factions$ = factions.valueChanges();
      factions$.subscribe(factionz => {
        this.factionList = factionz;
        this.factionList.sort((a, b) => (a.order > b.order) ? 1 : -1)
      })
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
      const newFaction: factionDb = {
        id: concatId,
        name: this.factionName,
        order: (this.selectedOrder ? this.selectedOrder : 0),
        typeId: this.selectedGameType.id
      }

      if (this.selectedGame?.objectid) {
        const pickRef = this.afs.collection('factions').doc(this.selectedGame.objectid).collection(this.selectedGameType.id);
        await pickRef.doc(concatId).set(newFaction)

        this.factionId = '';
        this.factionName = '';
        this.selectedOrder = 0;
      }

    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.factionDeleted = false;
  }

  deleteSelectedFaction = (faction: factionDb) => {
    if (faction && this.deletesEnabled) {
      const pickRef = this.afs.collection('factions').doc(faction.id.split('-')[0]).collection(faction.typeId);
      pickRef.doc(faction.id).delete().then(() => {
        this.factionDeletedName = faction;
        this.factionDeleted = true;
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
