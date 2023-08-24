import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/compat/firestore';
import { Players } from '../models/player-selection';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/compat';
import { GameGroups } from '../models/gameGroups';
import { PlayDb } from '../models/play';
import { Router } from '@angular/router';
import { GameGroupService } from '../services/game-group.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  player!: firebase.firestore.DocumentData;
  gameGroups!: GameGroups[];
  id: string | null = '';
  constructor(private afs: AngularFirestore,
    private gameGroupService: GameGroupService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.afs.collection('tabletop-syndicate').doc('player-data')
        .collection('player-names', ref => ref.where('acctId', '==', this.id))
        .valueChanges().subscribe(playerz=>{
          this.player = playerz[0];

          this.afs.collection<GameGroups>('game-groups', ref => ref.where('members', 'array-contains', this.player['id']))
              .valueChanges().subscribe(groupz=>{
            this.gameGroups = groupz;
          })

         })
  }

  switchGameGroup = (id: string) => {
    this.gameGroupService.setGameGroup(id);
    this.router.navigate(['/home']);
  }
}
