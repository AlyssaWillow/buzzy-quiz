import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { now } from 'd3';
import { BoardGame, ListType } from 'src/app/models/collection';
import { Players } from 'src/app/models/player-selection';
import { CycleDb, PlayerList, listDb } from 'src/app/models/scenario';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit {

  @Input('bothCol') bothCol: BoardGame[] = [];

  startYear: number = 2016;
  thisYear: number = new Date().getFullYear();
  yearList: number[] = [...Array(this.thisYear - this.startYear + 1).keys()]
  
  selectedDate: number = this.thisYear;
  lists: listDb[] = [];
  selectedName: string = '';
  typeName: string = '';
  typeId: string = '';
  order: number = 0;
  listTypes: ListType[] =[];
  listDeleted: boolean = false;
  selectedListList: PlayerList[] = [];
  deletesEnabled: boolean = false;
  addAListType: boolean = false;
  players: Players[] = [];
  listDeletedName: listDb = {
    listId: '',
    year: this.thisYear,
    name: '',
    lists: []
  };

  

  constructor(public utils: UtilsService,
    private afs: AngularFirestore,
    private firebaseDataService: FirebaseDataService) {
  }

  ngOnInit(): void {
    this.firebaseDataService.lists$.subscribe(listz => {
      this.lists = listz;
    });
    this.firebaseDataService.listTypes$.subscribe(listTypez => {
      this.listTypes = listTypez;
    });
    this.firebaseDataService.players$.subscribe(playerz => {
      this.players = playerz;
    });
    this.yearList = this.addToDateList(this.yearList);
  }

  deleteableType = (id: string) => {
    let deleteable: boolean = true;
    this.lists.forEach(list => {
      if (id === list.name) {
        deleteable = false
      }
    })
    return deleteable
  }

  addToDateList = (numberOfYears: number[]) => {
    let years: number[] = [];
    numberOfYears.forEach(year => {
      years.push(year + this.startYear)

    })
    return years;
  }

  addlistsRow = () => { 
    this.order = this.order + 1;
    this.players.forEach(player => {
    this.selectedListList.push({
      playerId: player.id,
      gameId: '',
      order: this.order,
      notes: ''
    })
    })
    this.selectedListList.sort((a, b) => (a.playerId > b.playerId) ? 1 : -1)
    this.selectedListList.sort((a, b) => (a.order > b.order) ? 1 : -1)
  }

  removeListRow = () => {
    this.selectedListList = this.selectedListList.filter(obj => {return obj.order !== this.order});
    if(this.order > 1) {
      this.order = this.order - 1;
    }
    
    this.selectedListList.sort((a, b) => (a.playerId > b.playerId) ? 1 : -1)
    this.selectedListList.sort((a, b) => (a.order > b.order) ? 1 : -1)
  }

  editSelectedList = (list: listDb) => {
    this.selectedDate = list.year;
    this.selectedName = list.name;
    this.selectedListList = list.lists
  }

  editSelectedListType = (list: ListType) => {
    this.typeId = list.id;
    this.typeName = list.name;
  }

  submit = async () => {
    if (this.selectedDate) {
      let concatId = this.selectedDate + '-' + this.selectedName
      const newList2: listDb = {
        listId: concatId,
        year: this.selectedDate,
        name: this.selectedName,
        lists: this.selectedListList
      };

      if (this.selectedDate) {
        const newPickRef = this.afs.collection('lists');
        await newPickRef.doc(this.selectedDate + '-' + this.selectedName).set(newList2);

        this.selectedDate = this.thisYear;
        this.selectedName = '';
        this.selectedListList = [];

        this.order = 1;
      }

    }
  }

  submitType = async () => {
    if (this.typeName) {
      let concatId = '';
      if (this.typeId === '') {
        concatId = this.typeName + '-' + Math.floor(Math.random() * 1000)
      } else {
        concatId = this.typeId
      }
      const newList2: ListType = {
        id: concatId,
        name: this.typeName
      };

      if (this.selectedDate) {
        const newPickRef = this.afs.collection('listTypes');
        await newPickRef.doc(concatId).set(newList2);

        this.typeName = '';
        this.typeId = ''
      }

    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled;
    this.listDeleted = false;
  }

  addListType = () => {
    this.addAListType = !this.addAListType;
  }

  deleteSelectedList = (list: listDb) => {
    if (list && this.deletesEnabled) {
      const pickRef = this.afs.collection('lists');
      pickRef.doc(this.selectedDate+ '-' + this.selectedName).delete().then(() => {
        this.listDeletedName = list;
        this.listDeleted = true;
        this.order = 1;
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }

  deleteSelectedListType = (list: ListType) => {
    if (list) {
      const pickRef = this.afs.collection('listTypes');
      pickRef.doc(list.id).delete().then(() => {
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }
}
