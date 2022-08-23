import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from 'src/app/home/player-selection';
import { PlayInstance } from 'src/app/models/play';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gs-plays-section',
  templateUrl: './gs-plays-section.component.html',
  styleUrls: ['./gs-plays-section.component.scss']
})
export class GsPlaysSectionComponent implements OnInit {

  @Input() plays: PlayInstance[] = [];

  players$: Observable<Players[]>;
  players: Players[];
  private playerCol: AngularFirestoreCollection<Players>;

  
  constructor(public utils: UtilsService,
    private afs: AngularFirestore) {
    this.playerCol = this.afs.collection('tabletop-syndicate').doc('player-data').collection('player-names');
    this.players$ = this.playerCol.valueChanges();
    this.players = [];
     }

  ngOnInit(): void {
    this.players$.subscribe(players => {
      this.players = players;
    });
  }

}
