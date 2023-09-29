import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BoardGame } from 'src/app/models/collection';
import { factionDb3 } from 'src/app/models/faction';
import { nameId } from 'src/app/models/generic';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { ListGuide } from 'src/app/models/list-guide';
import { PlayDb } from 'src/app/models/play';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Players } from 'src/app/models/player-selection';
import { SearchBoardGame } from 'src/app/models/searchReults';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';

@Component({
  selector: 'app-add-faction',
  templateUrl: './add-faction.component.html',
  styleUrls: ['./add-faction.component.scss']
})
export class AddFactionComponent implements OnInit {
  
  @Input('bothCol') bothCol: BoardGame[] = [];
  bothCol2: SearchBoardGame[] = [];

  selectedFactionType: nameId[] = [];
  gameTypes: nameId[] = [];
  factionTypes: nameId[] = [];
  editFaction: factionDb3 = {
    typeId: '',
    gameId: [],
    id: '',
    name: ''
  };
  factionName: string = '';
  deletesEnabled: boolean = false;
  selectedGame: string[] = [];
  selectedExpansions: BoardGame[] | undefined = undefined;
  newFactions: factionDb3[] = [];
  seletedNewFactionList: factionDb3[] = [];
  newFactions2: factionDb3[] = [];
  seletedNewFactionList2: factionDb3[] = [];
  additionalGameIds: string[] = [];
  

  filterSelectedGameIds: string[] = [];
  filterSelectedFactionTypeIds: string[] = [];
  overwritesEnabled: boolean = false;
  searchString: string = '';
  
  
  factionDeleted: boolean = false;
  
  newPlays: PlayDb[] = [];
  selectedPlays: PlayDb[] = [];

  permissions: string[] = [];
  
  subscriptionFaction: any;
  subscriptionFactionTypes: any;
  factionDeletedName: factionDb3 = {
    id: '',
    gameId: [],
    typeId: '',
    name: ''
  };

  private factionsCol: AngularFirestoreCollection<factionDb3>;
  private playsCol: AngularFirestoreCollection<factionDb3>;

  constructor(public utils: UtilsService,
              public authenticationService: AuthenticationService,
              private afs: AngularFirestore,
              private bggService: BoardGameGeekService,
              private firebaseDataService: FirebaseDataService) {
    this.factionsCol = afs.collection('faction2');
    this.playsCol = afs.collection('play-history');
  }

  ngOnInit(): void {
    // this.selectedPlayerFactionList.push(this.selectedPlayerFaction);
    this.subscriptionFactionTypes = this.firebaseDataService.factionTypes$.subscribe(factionTypes => {
      this.factionTypes = factionTypes.sort((a, b) => a.name > b.name ? 1 : -1);
    });

    this.subscriptionFaction = this.firebaseDataService.factions2$.subscribe(factionz => {
      this.seletedNewFactionList = factionz;
      this.seletedNewFactionList2 = factionz;
      
      this.seletedNewFactionList2.sort((a, b) => a.name > b.name ? 1 : -1)
      this.seletedNewFactionList2.sort((a, b) => (this.utils.getGameName(a.gameId[0], this.bothCol) > 
                                                  this.utils.getGameName(b.gameId[0], this.bothCol)) ? 1 : -1)
      this.seletedNewFactionList2.sort((a, b) => (this.utils.getFactionTypeName(this.factionTypes, a.typeId) > 
                                                 this.utils.getFactionTypeName(this.factionTypes, b.typeId) ? 1 : -1))
    });

    this.firebaseDataService.plays$.subscribe(plays => {
      this.newPlays = plays.filter(f => f.factions.length > 0);
    })

    this.authenticationService.userData.subscribe(user => {
      this.afs.collection('tabletop-syndicate').doc('player-data')
          .collection<Players>('player-names', ref => ref.where('acctId', '==', user?.uid))
          .valueChanges().subscribe(playerz=>{
            this.permissions = playerz[0].permissions;
      })
    })
  this.getFactions2();
  }

  ngOnDestroy() {
    this.subscriptionFaction.unsubscribe();
    this.subscriptionFactionTypes.unsubscribe();
  }

  getAdditionalGames = () => {
    if (this.searchString?.length > 0) {
      this.bggService.searchGames(this.searchString);
      this.bggService.search$.subscribe(s=>{
        this.bothCol2 = s;
      })
    }
  }

  getFactions2 = (): void => {
    this.seletedNewFactionList2 = this.seletedNewFactionList;
    this.selectedPlays = this.newPlays;

    if (this.filterSelectedGameIds !== undefined && this.filterSelectedGameIds?.length > 0) {
      this.seletedNewFactionList2 = this.seletedNewFactionList2.filter(ref => { 
        let found = false
        this.filterSelectedGameIds.forEach(game => {
          if(ref.gameId.includes(game)) {
            found = true;
          }
        })
        return found;
      });
    }

    this.seletedNewFactionList2 = this.seletedNewFactionList2.filter(ref => 
                  (this.filterSelectedFactionTypeIds !== undefined && this.filterSelectedFactionTypeIds.length > 0 ? this.filterSelectedFactionTypeIds.includes(ref.typeId) : true));
    
    this.seletedNewFactionList2.sort((a, b) => a.name > b.name ? 1 : -1)
    this.seletedNewFactionList2.sort((a, b) => (this.utils.getGameName(a.gameId[0], this.bothCol) > 
                                                this.utils.getGameName(b.gameId[0], this.bothCol)) ? 1 : -1)
    this.seletedNewFactionList2.sort((a, b) => (this.utils.getFactionTypeName(this.factionTypes, a.typeId) > 
                                                             this.utils.getFactionTypeName(this.factionTypes, b.typeId) ? 1 : -1))

    this.selectedPlays = this.selectedPlays.filter(ref=> 
                  (this.filterSelectedGameIds?.length > 0 ? this.filterSelectedGameIds.includes(ref.gameId) : true));
  }

  setFacton = (faction: factionDb3) => {
    this.editFaction = faction;
  }

  submit = async () => {
    if (this.permissions.includes('admin') && 
        this.editFaction.gameId.length > 0 && 
        this.editFaction.typeId !== undefined && 
        this.editFaction.typeId !== '',
        this.editFaction.name !== undefined && 
        this.editFaction.name !== '') {

      if (this.editFaction?.id !== '') {
        if (this.additionalGameIds?.length > 0) {
          this.editFaction.gameId = this.editFaction.gameId.concat(this.additionalGameIds);
        }
        const newPickRef = this.afs.collection('faction2');
        await newPickRef.doc(this.editFaction.id)
        .set(this.editFaction).then(() => {
          console.info("Document successfully added!");
          this.editFaction = {
            id: '',
            gameId: [],
            typeId: '',
            name: ''
          };
          this.overwritesEnabled = false;
          this.additionalGameIds = [];
          this.searchString = '';
          this.getFactions2();
        })
      } else {
        if (this.additionalGameIds?.length > 0) {
          this.editFaction.gameId = this.editFaction.gameId.concat(this.additionalGameIds);
        }
        const pickRef = this.afs.collection('faction2');
        await pickRef.add(this.editFaction).then(() => {
          console.info("Document successfully added!");
        }).then((doc) => {
          this.afs.collection<factionDb3>('faction2', ref => ref.where('id', '==', ''))
            .snapshotChanges().subscribe(factionzz=>{
              factionzz.forEach(faction => {
                this.editFaction.id = faction.payload.doc.id;
                pickRef.doc(faction.payload.doc.id).set(this.editFaction).then(() => {
                console.info("Document successfully added!");
                this.editFaction = {
                  id: '',
                  gameId: [],
                  typeId: '',
                  name: ''
                };
                this.overwritesEnabled = false;
                this.additionalGameIds = [];
                this.searchString = '';
                this.getFactions2();
              }).catch((error) => {
                console.error("Error adding document: ", error);
              });
          })
        })
      })
    }

    }
  }

  updateGuideList = (newFaction: factionDb3) => {
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

  deleteSelectedFaction = (faction: factionDb3) => {
    if (faction && this.deletesEnabled && this.permissions.includes('admin')) {
      const pickRef = this.afs.collection('faction2');
      pickRef.doc(faction.id).delete().then(() => {
        this.factionDeletedName = faction;
        this.factionDeleted = true;
        console.info("Document successfully deleted!",);
        this.getFactions2();
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
