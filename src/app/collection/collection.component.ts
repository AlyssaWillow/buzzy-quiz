import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat';
import { CollectionGroups, GameGroups, IdsPlayerCollections, PlayerCollectionGroup } from '../models/gameGroups';
import { Players } from '../models/player-selection';
import { UtilsService } from '../services/utils.service';

interface Playersdd {
  value: number;
  viewValue: string;
}
interface Time {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  display: string = 'ALL';
  numPlayers: number = 0;
  time: number = 0;
  gameGroupPlayers: Players[] = [];
  players: firebase.firestore.DocumentData[] = [];
  playerCollections: IdsPlayerCollections = {
    distinctCollections: [],
    collectionGroups: []
  }
  gameGroupIdFromRoute: string | null = '';
  playerCountList: Playersdd[] = [
    {value: 0, viewValue: 'Any'},
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
    {value: 5, viewValue: '5'},
    {value: 6, viewValue: '6'},
    {value: 7, viewValue: '7'},
    {value: 8, viewValue: '8'},
    {value: 9, viewValue: '9'},
    {value: 10, viewValue: '10'},
    {value: 11, viewValue: '11'},
    {value: 12, viewValue: '12'},
    {value: 13, viewValue: '13'},
    {value: 14, viewValue: '14'},
    {value: 15, viewValue: '15'},
    {value: 16, viewValue: '16'},
    {value: 17, viewValue: '17'},
    {value: 18, viewValue: '18'},
    {value: 19, viewValue: '19'},
    {value: 20, viewValue: '20'},
    {value: 21, viewValue: '21'},
    {value: 22, viewValue: '22'},
    {value: 23, viewValue: '23'},
    {value: 24, viewValue: '24'},
    {value: 25, viewValue: '25'},
    {value: 26, viewValue: '26'},
    {value: 27, viewValue: '27'},
    {value: 28, viewValue: '28'},
    {value: 29, viewValue: '29'},
    {value: 30, viewValue: '30'},
  ];
  timeList: Time[] = [
    {value: 0, viewValue: 'Any'},
    {value: 15, viewValue: '15'},
    {value: 30, viewValue: '30'},
    {value: 45, viewValue: '45'},
    {value: 60, viewValue: '60'},
    {value: 75, viewValue: '75'},
    {value: 90, viewValue: '90'},
    {value: 105, viewValue: '105'},
    {value: 120, viewValue: '120'},
    {value: 135, viewValue: '135'},
    {value: 150, viewValue: '150'},
    {value: 165, viewValue: '165'},
    {value: 180, viewValue: '180'},
    {value: 195, viewValue: '195'},
    {value: 210, viewValue: '210'},
    {value: 225, viewValue: '225'},
    {value: 240, viewValue: '240'},
    {value: 255, viewValue: '255'},
    {value: 270, viewValue: '270'},
    {value: 285, viewValue: '285'},
    {value: 300, viewValue: '300'},
  ];
  collections: CollectionGroups[] = [
    {value: 'ALL', viewValue: 'All'},
    {value: 'LEM', viewValue: 'Leman'},
    {value: 'HEN', viewValue: 'Hendrickson'},
  ];
  gameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';
  gameGroup: GameGroups[] = []

  constructor(public utils: UtilsService,
              private route: ActivatedRoute,
              private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.gameGroupIdFromRoute = this.route.snapshot.paramMap.get('id')
    this.afs.collection<GameGroups>('game-groups', ref => ref.where('id', '==', (this.gameGroupIdFromRoute ? this.gameGroupIdFromRoute : this.gameGroupId)))
    .valueChanges().subscribe(gameGroup =>{
      if (this.gameGroup.sort().join(',') !== gameGroup.sort().join(',')) {
        this.gameGroup = gameGroup
        this.afs.collection('tabletop-syndicate').doc('player-data')
        .collection<Players>('player-names', ref => ref.where('id', 'in', gameGroup[0].members))
        .valueChanges().subscribe(playerz=>{
          if (this.gameGroupPlayers.sort().join(',') !== playerz.sort().join(',')) {
            this.gameGroupPlayers = playerz
            this.playerCollections = this.getDistinctCollections(playerz)
          }
        })  
      }
    })
  }

  getDistinctCollections = (docList: Players[]): IdsPlayerCollections => {
    let collectionGroupz: PlayerCollectionGroup[] = [];
    let idsPlayerCollections: IdsPlayerCollections = {
      distinctCollections: [],
      collectionGroups: []
    }
    idsPlayerCollections.collectionGroups.push({
      collection: [],
      id: 'ALL',
      associatedPlayers: ['All Collections']
    })
    docList.forEach(doc => {
      doc.collection.forEach(collection => {
        if (!idsPlayerCollections.distinctCollections.includes(collection)) {
          idsPlayerCollections.distinctCollections.push(collection)
          collectionGroupz.push({
            collection: collection,
            associatedPlayers: []
          })
        }
      })
      collectionGroupz.forEach(cgz => {
        doc.collection.forEach(collection => {
          if(cgz.collection === collection) {
            cgz.associatedPlayers.push(doc.id)
          }
        })
      })
    })
    collectionGroupz.forEach(cgz => {
      let found = false;
      if (idsPlayerCollections.collectionGroups.length === 0) {
        found = true;
        idsPlayerCollections.collectionGroups.push({
          collection: [cgz.collection],
          associatedPlayers: cgz.associatedPlayers,
          id: ''
        })
      } else {
        idsPlayerCollections.collectionGroups.forEach(ipc=>{
          if (ipc.associatedPlayers.sort().join(',')=== cgz.associatedPlayers.sort().join(',')) {
            found = true;
            ipc.collection.push(cgz.collection)
          }
        })
      }
      if (!found) {
        idsPlayerCollections.collectionGroups.push({
          collection: [cgz.collection],
          associatedPlayers: cgz.associatedPlayers,
          id: ''
        })
      }
    })
    idsPlayerCollections.collectionGroups.forEach(cgz => {
      if (cgz.id === '') {
        cgz.id = cgz.associatedPlayers.join('')
      }
    });
    console.log('PC', idsPlayerCollections)
    return idsPlayerCollections
  }

  formatListOfNames = (players: string[]): string => {
    let count = players.length - 1;
    let rtnStr = ''
    
    if (players[0] === 'All Collections') {
      return players[0]
    }
    players.forEach(player => {
      count--
      rtnStr += this.utils.getPlayerName(player, this.gameGroupPlayers)
      if(count === 0) {
        rtnStr += ' & '
      } else if (count > 0) {
        rtnStr += ', '
      } else {
        rtnStr += "'s Collection"
      }
    })
    return rtnStr
  }

  playerSuffix = (i: number) => {
    if (i === 0) {
      return '';
    } else if (i === 1) {
      return 'Player';
    } else {
      return 'Players';
    }
  }

  minuteSuffix = (i: number) => {
    if (i === 0) {
      return '';
    } else {
      return 'Minutes';
    }
  }

}
