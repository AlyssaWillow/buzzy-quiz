import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Players, Selection2 } from '../models/player-selection';
import { factionDb2, factionTypeData } from '../models/faction';
import { nameId, Override, Overrides } from '../models/generic';
import { ListGuide } from '../models/list-guide';
import { Locations } from '../models/locations';
import { PlayDb } from '../models/play';
import { CycleDb, ScenarioDb2, listDb } from '../models/scenario';
import { videoDb } from '../models/video';

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
  private factionsCol: AngularFirestoreCollection<factionDb2>;
  private scenarioCol: AngularFirestoreCollection<ScenarioDb2>;
  private cycleCol: AngularFirestoreCollection<CycleDb>;
  private videoCol: AngularFirestoreCollection<videoDb>;
  private listCol: AngularFirestoreCollection<listDb>;

  public players$: Observable<Players[]>;
  public factionTypes$: Observable<factionTypeData[]>;
  public locations$: Observable<nameId[]>;
  public selection$: Observable<Selection2[]>;
  public listGuides$: Observable<ListGuide[]>;
  public plays$: Observable<PlayDb[]>;
  public override$: Observable<Override[]>;
  public factions$: Observable<factionDb2[]>;
  public scenarios$: Observable<ScenarioDb2[]>;
  public cycles$: Observable<CycleDb[]>;
  public videos$: Observable<videoDb[]>;
  public lists$: Observable<listDb[]>;
  
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
    this.factionsCol = afs.collection('factions');
    this.scenarioCol = afs.collection('scenarios');
    this.cycleCol = afs.collection('cycles');
    this.videoCol = afs.collection('videos');
    this.listCol = afs.collection('lists');

    this.factionTypes$ = this.factionTypeCol.valueChanges();
    this.players$ = this.playerCol.valueChanges();
    this.locations$ = this.locationCol.valueChanges();
    this.selection$ = this.selectionCol.valueChanges();
    this.listGuides$ = this.listGuides.valueChanges();
    this.plays$ = this.playsCol.valueChanges();
    this.override$ = this.overrideCol.valueChanges();
    this.factions$ = this.factionsCol.valueChanges();
    this.scenarios$ = this.scenarioCol.valueChanges();
    this.cycles$ = this.cycleCol.valueChanges();
    this.videos$ = this.videoCol.valueChanges();
    this.lists$ = this.listCol.valueChanges();
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

  fetchPlayHistoryData = () => { 
    this.playsCol = this.afs.collection('play-history');
    this.plays$ = this.playsCol.valueChanges();
  }

  fetchFactionData = () => { 
    this.factionsCol = this.afs.collection('factions');
    this.factions$ = this.factionsCol.valueChanges();
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
