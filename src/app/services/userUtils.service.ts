import { Injectable } from '@angular/core';
import { Players } from '../models/player-selection';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserUtilsService {

  constructor(private afs: AngularFirestore) {
  }

  getPlayerInformation = (id: string): Players => {
    this.afs.collection('tabletop-syndicate').doc('player-data')
    .collection<Players>('player-names', ref => ref.where('acctId', '==', id))
    .valueChanges().subscribe(playerz=>{
      console.log(playerz)
      return playerz[0];
    })
    let player: Players = {
      firstName: '',
      lastName: '',
      id: '',
      acctId: '',
      color: '',
      collection: [],
      permissions: []
    }
    return player
    }
}
