import { Component, OnInit } from '@angular/core';
import { Players } from '../models/player-selection';
import { FirebaseDataService } from '../services/firebase-data.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-pick-history',
  templateUrl: './pick-history.component.html',
  styleUrls: ['./pick-history.component.scss']
})
export class PickHistoryComponent implements OnInit {

  players: Players[] = [];
  constructor(private firebaseDataService: FirebaseDataService,
    public utils: UtilsService) { 
    
  }

  ngOnInit(): void {
    this.firebaseDataService.players$.subscribe(players => {
      this.players = players;
    });
  }

}
