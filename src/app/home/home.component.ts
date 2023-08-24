import { Component, OnInit } from '@angular/core';
import { GameGroupService } from '../services/game-group.service';

@Component({
  selector: 'tts-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  gameGroupIdFromRoute: string | null = '';
  gameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';
  gameGroup: string|null = 'home';

  constructor(public defaultGameGroupId: GameGroupService) { }

  ngOnInit(): void {
    this.defaultGameGroupId.selectedGameGroup$.subscribe(id => {
      this.gameGroupIdFromRoute = id;
    })
  }
  
  prepare = 'Prepare for next game night'
  gamesPlayed = 'Games Played'
}
