import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Players } from '../models/player-selection';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  player!: firebase.firestore.DocumentData;
  id: string | null = '';
  constructor(private afs: AngularFirestore,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.afs.collection('tabletop-syndicate').doc('player-data')
        .collection('player-names', ref => ref.where('acctId', '==', this.id)).valueChanges().subscribe(playerz=>{
          this.player = playerz[0];
        })
    
  }

}
