import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { homedir } from 'os';
import { AuthenticationService } from '../services/authentication.service';
import { GameGroups, IdsPlayerCollections, PlayerCollectionGroup } from '../models/gameGroups';
import { Players } from '../models/player-selection';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'tts-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  nav = [
    {
      external: false,
      value: '/home',
      disp: 'Home',
      restricted: false,
      collectionDependant: false
    },
    {
      external: false,
      value: '/game-stats',
      disp: 'Game Stats',
      restricted: false,
      collectionDependant: false
    }, 
    {
      external: false,
      value: '/analytics',
      disp: 'Analytics',
      restricted: false,
      collectionDependant: false
    }, 
    {
      external: false,
      value: '/tools',
      disp: 'Tools',
      restricted: false,
      collectionDependant: false
    }, 
    {
      external: false,
      value: '/collection',
      disp: 'Collection',
      restricted: false,
      collectionDependant: true
    }, 
    {
      external: false,
      value: '/pick-history',
      disp: 'Pick History',
      restricted: false,
      collectionDependant: false
    }, 
    {
      external: false,
      value: '/lists',
      disp: 'Lists',
      restricted: false,
      collectionDependant: false
    },
    {
      external: false,
      value: '/shirts',
      disp: 'Convention Shirt History',
      restricted: true,
      collectionDependant: false
    },
    {
      external: false,
      value: '/add',
      disp: 'Add / Edit',
      restricted: true,
      collectionDependant: false
    }
  ]
  hasCollections: boolean = false;
  gameGroupPlayers: Players[] = [];
  players: firebase.firestore.DocumentData[] = [];
  playerCollections: IdsPlayerCollections = {
    distinctCollections: [],
    collectionGroups: []
  }
  gameGroupIdFromRoute: string | null = '';
  
  gameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';
  gameGroup: GameGroups[] = []

  constructor(public authenticationService: AuthenticationService,
    public utils: UtilsService,
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
            this.getDistinctCollections(playerz)
          }
        })  
      }
    })
  }

  getDistinctCollections = (docList: Players[]): void => {
    docList.forEach(doc => {
      doc.collection.forEach(collection => {
       this.hasCollections = true
      })
    });
  }

}
