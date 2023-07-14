import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameGroups } from '../models/gameGroups';
import { Players } from '../models/player-selection';

@Component({
  selector: 'tts-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() page: string | null = null;
  
  gameGroup: GameGroups[] = [];
  pageName: string | null= 'Welcome!';
  gameGroupIdFromRoute: string | null = '';
  gameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';
  color: string | null = 'RD';

  constructor(public authenticationService: AuthenticationService,
    public router: Router,
    private route: ActivatedRoute,
              private afs: AngularFirestore) {
    }

  ngOnInit(): void {
    if (this.page === 'home') {
      this.gameGroupIdFromRoute = this.route.snapshot.paramMap.get('id')
      this.afs.collection<GameGroups>('game-groups', ref => ref.where('id', '==', (this.gameGroupIdFromRoute ? this.gameGroupIdFromRoute : this.gameGroupId)))
      .valueChanges().subscribe(gameGroup =>{
          console.log('jhjkhkj', gameGroup[0].name)
          this.pageName = gameGroup[0].name
      })

    } else {
      this.pageName = this.page
    }

    this.authenticationService.userData.subscribe(user => {
      this.afs.collection('tabletop-syndicate').doc('player-data')
          .collection<Players>('player-names', ref => ref.where('acctId', '==', user?.uid))
          .valueChanges().subscribe(playerz=>{
            this.color = playerz[0].color;
      })
    })
  }
}
