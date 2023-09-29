import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Players, Selection2 } from '../models/player-selection';
import { factionDb3, factionTypeData } from '../models/faction';
import { nameId, Override, Overrides } from '../models/generic';
import { ListGuide } from '../models/list-guide';
import { Locations } from '../models/locations';
import { PlayDb } from '../models/play';
import { CycleDb, ScenarioDb2, listDb } from '../models/scenario';
import { videoDb } from '../models/video';
import { ListType } from '../models/collection';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {
  
  private playerCol: AngularFirestoreCollection<Players>;
  private factionTypeCol: AngularFirestoreCollection<factionTypeData>;
  private locationCol: AngularFirestoreCollection<nameId>;
  private selectionCol: AngularFirestoreCollection<Selection2>;
  private listGuides: AngularFirestoreCollection<ListGuide>;
  private playsCol: AngularFirestoreCollection<PlayDb>;
  private overrideCol: AngularFirestoreCollection<Override>;
  private factionsCol: AngularFirestoreCollection<factionDb3>;
  private factions2Col: AngularFirestoreCollection<factionDb3>;
  private scenarioCol: AngularFirestoreCollection<ScenarioDb2>;
  private cycleCol: AngularFirestoreCollection<CycleDb>;
  private videoCol: AngularFirestoreCollection<videoDb>;
  private listCol: AngularFirestoreCollection<listDb>;
  private listTypeCol: AngularFirestoreCollection<ListType>;

  public players$: Observable<Players[]>;
  public factionTypes$: Observable<factionTypeData[]>;
  public locations$: Observable<nameId[]>;
  public selection$: Observable<Selection2[]>;
  public listGuides$: Observable<ListGuide[]>;
  public plays$: Observable<PlayDb[]>;
  public plays2$: Observable<DocumentChangeAction<PlayDb>[]> | undefined
  public override$: Observable<Override[]>;
  public factions$: Observable<factionDb3[]>;
  public factions2$: Observable<factionDb3[]>;
  public scenarios$: Observable<ScenarioDb2[]>;
  public cycles$: Observable<CycleDb[]>;
  public videos$: Observable<videoDb[]>;
  public lists$: Observable<listDb[]>;
  public listTypes$: Observable<ListType[]>;
  
  oRide: Overrides = {bases: [],expansions: []}

  private _overrides: BehaviorSubject<Overrides> = new BehaviorSubject(this.oRide);
  public readonly overrides$: Observable<Overrides> = this._overrides.asObservable();
  
  constructor(private afs: AngularFirestore) {
    this.factionTypeCol = afs.collection('faction-type-data');
    this.playerCol = this.afs.collection('tabletop-syndicate').doc('player-data').collection('player-names');
    this.locationCol = afs.collection('tabletop-syndicate').doc('location-data').collection('location-names');
    this.selectionCol = afs.collection('tabletop-syndicate').doc('selection-data').collection('current-picks');
    this.listGuides = this.afs.collection('list-guides');
    this.playsCol = afs.collection('play-history');
    this.overrideCol = afs.collection('overrides');
    this.factionsCol = afs.collection('faction2');
    this.factions2Col = afs.collection('faction2');
    this.scenarioCol = afs.collection('scenarios');
    this.cycleCol = afs.collection('cycles');
    this.videoCol = afs.collection('videos');
    this.listCol = afs.collection('lists');
    this.listTypeCol = afs.collection('listTypes');

    this.factionTypes$ = this.factionTypeCol.valueChanges();
    this.players$ = this.playerCol.valueChanges();
    this.locations$ = this.locationCol.valueChanges();
    this.selection$ = this.selectionCol.valueChanges();
    this.listGuides$ = this.listGuides.valueChanges();
    this.plays$ = this.playsCol.valueChanges();
    this.override$ = this.overrideCol.valueChanges();
    this.factions$ = this.factionsCol.valueChanges();
    this.factions2$ = this.factions2Col.valueChanges();
    this.scenarios$ = this.scenarioCol.valueChanges();
    this.cycles$ = this.cycleCol.valueChanges();
    this.videos$ = this.videoCol.valueChanges();
    this.lists$ = this.listCol.valueChanges();
    this.listTypes$ = this.listTypeCol.valueChanges();
  }

  fetchFactionTypeData = () => { 
    this.factionTypeCol = this.afs.collection('faction-type-data');
    this.factionTypes$ = this.factionTypeCol.valueChanges();
  }

  fetchPlayerNameData = () => { 
    this.playerCol = this.afs.collection('tabletop-syndicate').doc('player-data').collection('player-names');
    this.players$ = this.playerCol.valueChanges();
  }

  fetchLocationData = () => { 
    this.locationCol = this.afs.collection('tabletop-syndicate').doc('location-data').collection('location-names');
    this.locations$ = this.locationCol.valueChanges();
  }

  fetchSelectionData = () => { 
    this.selectionCol = this.afs.collection('tabletop-syndicate').doc('selection-data').collection('current-picks');
    this.selection$ = this.selectionCol.valueChanges();
  }

  fetchListGuideData = () => { 
    this.listGuides = this.afs.collection('list-guides');
    this.listGuides$ = this.listGuides.valueChanges();
  }


  fetchPlayHistoryDataForGroup = (groupId: string) => { 
    this.playsCol = this.afs.collection<PlayDb>('play-history');
    this.plays2$  = this.playsCol.snapshotChanges();

    this.plays2$.pipe(
      map(changes => {
        return changes.map(action => {
          console.log('changes', action)
          const data = action.payload.doc.data() as PlayDb;
          const _id = action.payload.doc.id;
          return { _id, ...data };
         });
      }))

  }

  fetchPlayHistoryData = () => { 
    this.playsCol = this.afs.collection('play-history');
    this.plays$ = this.playsCol.valueChanges();

  }

  fetchFactionData = () => { 
    this.factionsCol = this.afs.collection('faction2');
    this.factions$ = this.factionsCol.valueChanges();
  }

  fetchFaction2Data = () => { 
    this.factions2Col = this.afs.collection('faction2');
    this.factions2$ = this.factions2Col.valueChanges();
  }

  fetchScenarioData = () => { 
    this.scenarioCol = this.afs.collection('scenarios');
    this.scenarios$ = this.scenarioCol.valueChanges();
  }
  fetchCycleData = () => { 
    this.cycleCol = this.afs.collection('cycles');
    this.cycles$ = this.cycleCol.valueChanges();
  } 
  fetchVideoData = () => { 
    this.videoCol = this.afs.collection('videos');
    this.videos$ = this.videoCol.valueChanges();
  }
  fetchListData = () => { 
    this.listCol = this.afs.collection('lists');
    this.lists$ = this.listCol.valueChanges();
  }
  fetchListTypeData = () => { 
    this.listTypeCol = this.afs.collection('listTypes');
    this.listTypes$ = this.listTypeCol.valueChanges();
  }

  fetchExpansionOverrideData = () => { 
    let collectionOverrides: Overrides = {
      bases: [],
      expansions: []
    }
    this.overrideCol = this.afs.collection('overrides');
    this.override$ = this.overrideCol.valueChanges();
    this.override$.subscribe(overrides => {
      overrides.forEach(override => {
        if (override.expansion) {
          collectionOverrides.expansions.push(override.id);
        } else {
          collectionOverrides.bases.push(override.id);
        }
      })
      this._overrides.next(collectionOverrides);
    });
  }
}
