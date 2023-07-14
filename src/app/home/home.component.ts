import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameGroups } from '../models/gameGroups';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import { FirebaseDataService } from '../services/firebase-data.service';
import { UtilsService } from '../services/utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tts-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gameGroupIdFromRoute: string | null = '';
  gameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';
  gameGroup: string|null = 'home';

  constructor(public route: ActivatedRoute,
    private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.gameGroupIdFromRoute = this.route.snapshot.paramMap.get('id')
  }
  
  prepare = 'Prepare for next game night'
  gamesPlayed = 'Games Played'
}
