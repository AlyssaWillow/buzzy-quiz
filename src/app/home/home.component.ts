import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tts-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  prepare = 'Prepare for next game night'
  gamesPlayed = 'Games Played'
}
