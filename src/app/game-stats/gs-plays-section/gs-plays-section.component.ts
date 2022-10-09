import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from 'src/app/models/player-selection';
import { PlayInstance } from 'src/app/models/play';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gs-plays-section',
  templateUrl: './gs-plays-section.component.html',
  styleUrls: ['./gs-plays-section.component.scss']
})
export class GsPlaysSectionComponent implements OnInit {

  @Input() plays: PlayInstance[] = [];

  players: Players[];
  
  constructor(private firebaseDataService: FirebaseDataService,
    public utils: UtilsService) {
    this.players = []
  }

  ngOnInit(): void {
    this.plays.sort((a, b) => (a.date > b.date) ? 1 : -1)
    this.firebaseDataService.players$.subscribe((players: Players[]) => {
      this.players = players;
    })
  }

}
