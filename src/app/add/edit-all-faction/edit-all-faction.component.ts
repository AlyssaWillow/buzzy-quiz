import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatFormField } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { doc, setDoc } from "firebase/firestore"; 
import { factionDb3 } from 'src/app/models/faction';
import { nameId } from 'src/app/models/generic';
import { Locations } from 'src/app/models/locations';
import { GamePlayerFaction, Play, PlayDb, PlayerFaction } from 'src/app/models/play';
import { FormGroup, FormControl } from '@angular/forms';
import { timeStamp } from 'console';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { ListGuide } from 'src/app/models/list-guide';

@Component({
  selector: 'app-edit-all-faction',
  templateUrl: './edit-all-faction.component.html',
  styleUrls: ['./edit-all-faction.component.scss']
})
export class EditAllFactionComponent implements OnInit {
  
  @Input('bothCol') bothCol: BoardGame[] = [];

  selectedFactionType: nameId[] = [];
  newIds: string[]=[];
  gameDoneIds: string[]=[];
  gameTypes: nameId[] = [];
  factionTypes: nameId[] = [];
  factionId: string = '';
  factionName: string = '';
  deletesEnabled: boolean = false;
  selectedOrder: number = 0;
  selectedGameIds: string[] = [];
  selectedGameTypeIds: string[] = [];
  selectedGame: BoardGame | undefined = undefined;
  selectedExpansions: BoardGame[] | undefined = undefined;
  selectedGameType: nameId = {
    id: '',
    name: ''
  };
  newFactions: factionDb3[] = [];
  newFactions2: factionDb3[] = [];
  seletedNewFactionList: factionDb3[] = [];
  seletedNewFactionList2: factionDb3[] = [];
  factionDeleted: boolean = false;
  newPlays: PlayDb[] = [];
  selectedPlays: PlayDb[] = [];
  
  subscriptionFaction: any;

  subscriptionFactionTypes: any;
  
  private factionsCol: AngularFirestoreCollection<factionDb3>;
  private playsCol: AngularFirestoreCollection<factionDb3>;

  constructor(public utils: UtilsService,
              private afs: AngularFirestore,
              private firebaseDataService: FirebaseDataService) {
                
    this.factionsCol = afs.collection('faction2');
    this.playsCol = afs.collection('play-history');
  }

  ngOnInit(): void {
    // this.selectedPlayerFactionList.push(this.selectedPlayerFaction);
    
    this.factionsCol.snapshotChanges().subscribe(facts => {
      this.newIds = [];
      facts.forEach(fact => {
        this.newIds.push(fact.payload.doc.id)
      });
    })

    this.factionsCol.valueChanges().subscribe(facts => {
      this.newFactions2 = facts;
    })


    this.firebaseDataService.plays$.subscribe(plays => {
      this.gameDoneIds = [];
      this.newPlays = plays.filter(f => f.factions.length > 0);
    })

    

    this.subscriptionFactionTypes = this.firebaseDataService.factionTypes$.subscribe(factionTypes => {
      this.factionTypes = factionTypes;
    });

  this.getFactions2();
    
  }

  getFactions2 = (): void => {
    this.seletedNewFactionList2 = this.newFactions2;
    this.selectedPlays = this.newPlays;

    if (this.selectedGameIds !== undefined && this.selectedGameIds?.length > 0) {
      this.seletedNewFactionList2 = this.seletedNewFactionList2.filter(ref => { 
        let found = false
        this.selectedGameIds.forEach(game => {
          if(ref.gameId.includes(game)) {
            console.log('ref', ref)
            found = true;
          }
        })
        return found;
      });
    }

    this.seletedNewFactionList2 = this.seletedNewFactionList2.filter(ref => 
                  (this.selectedGameTypeIds !== undefined && this.selectedGameTypeIds.length > 0 ? this.selectedGameTypeIds.includes(ref.typeId) : true));
    this.seletedNewFactionList2.sort((a, b) => a.name < b.name ? 1 : -1)
    this.seletedNewFactionList2.sort((a, b) => (this.utils.getFactionTypeName(this.factionTypes, a.typeId) > 
                                               this.utils.getFactionTypeName(this.factionTypes, b.typeId) ? 1 : -1))

    this.selectedPlays = this.selectedPlays.filter(ref=> 
                  (this.selectedGameIds?.length > 0 ? this.selectedGameIds.includes(ref.gameId) : true));
  }

  viewUpdate = async (fac: factionDb3) => {
   
    console.log('newFac', "" + fac.id + '-' + fac.typeId.split('-')[1], fac)
  };

  commitUpdate = async (fac: factionDb3) => {

    let id: string = ("" + fac.id + '-' + fac.typeId.split('-')[1])
    fac.id = id;
    console.log('newFac', id, fac)
    const pickRef = this.afs.collection('faction2');
    await pickRef.doc(id)
                 .set(fac)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
  };

  commitPlayUpdate = async (pla: PlayDb) => {
    pla.factions.forEach(f=>{
      f.factions.forEach(g=> {
        g.factionId += '-' + f.typeId.split('-')[1]
      })
    })
    console.log('newPla', pla.factions, pla)
    const pickRef = this.afs.collection('play-history');
    await pickRef.doc(pla.id)
                 .set(pla)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
  };

  viewPlayUpdate = async (pla: PlayDb) => {
    let tempGame = pla
    tempGame.factions.forEach(f=>{
      f.factions.forEach(g=> {
        console.log('newPla', f.typeId, g.factionId + '-' + f.typeId.split('-')[1])
      })
    })
    console.log('newPla', tempGame.factions, tempGame)
  };

  ngOnDestroy() {
    this.subscriptionFaction.unsubscribe();
    this.subscriptionFactionTypes.unsubscribe();
  }

  getFactions = (gameId: string, factionTypeId: string): void => {
    let gId: string = '';
    let ftId: string = '';

    if (this.selectedGame !== undefined && this.selectedGame.objectid) {
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
      this.seletedNewFactionList = this.newFactions.filter(ref => ref.gameId.includes(gId) && ref.typeId === ftId);
    }
  }
}
