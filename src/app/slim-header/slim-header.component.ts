import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameGroups } from '../models/gameGroups';
import { Players } from '../models/player-selection';

@Component({
  selector: 'tts-slim-header',
  templateUrl: './slim-header.component.html',
  styleUrls: ['./slim-header.component.scss']
})
export class SlimHeaderComponent implements OnInit {
  @Input() inputSideNav!: MatDrawer;
  
  gameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';
  gameGroup: GameGroups[] = [];
  groupId: string | null = null;
  pageName: string = 'Welcome!';
  color: string | null = 'GY';

  constructor(public authenticationService: AuthenticationService,
              public router: Router,
              private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.afs.collection<GameGroups>('game-groups', ref => ref.where('id', '==', (this.groupId ? this.groupId : this.gameGroupId)))
    .valueChanges().subscribe(gameGroup =>{
      this.gameGroup = gameGroup 
      this.pageName = gameGroup[0].name;
    })

    this.authenticationService.userData.subscribe(user => {
      this.afs.collection('tabletop-syndicate').doc('player-data')
          .collection<Players>('player-names', ref => ref.where('acctId', '==', user?.uid))
          .valueChanges().subscribe(playerz=>{
            this.color = playerz[0].color;
      })
    })
  }

  login = () => {
    this.router.navigate(['/login']);
  }
}
