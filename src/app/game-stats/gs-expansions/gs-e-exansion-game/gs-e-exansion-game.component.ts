import { Component, Input, OnInit } from '@angular/core';
import { AllBoardGame } from 'src/app/models/collection';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'tts-gs-e-exansion-game',
  templateUrl: './gs-e-exansion-game.component.html',
  styleUrls: ['./gs-e-exansion-game.component.scss']
})
export class GsEExansionGameComponent implements OnInit {

  @Input() game: AllBoardGame = {
    id: '',
    image: '',
    description: '',
    link: [],
    maxplayers: {value:0},
    maxplaytime: {value:0},
    minage: {value:0},
    minplayers: {value:0},
    minplaytime: {value:0},
    name: [],
    playingtime: 0,
    poll: [],
    thumbnail: '',
    type: '',
    yearpublished: {value:0}
  };
  @Input() last: boolean = false;
  constructor(public utils: UtilsService) { }

  ngOnInit(): void {
  }

}
