import { Component, Input, OnInit } from '@angular/core';
import { AllBoardGame } from 'src/app/models/collection';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'tts-gs-e-exansion-game',
  templateUrl: './gs-e-exansion-game.component.html',
  styleUrls: ['./gs-e-exansion-game.component.scss']
})
export class GsEExansionGameComponent {

  @Input() game: AllBoardGame = {
    id: '',
    image: '',
    bggRank: 0,
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
    yearpublished: {value:0},
    statistics: {
      page:'',
      ratings: {
        usersrated: {value:0},
        average: {value:0},
        bayesaverage: {value:0},
        ranks: {
          rank: []
        },
        stddev: {value:0},
        median: {value:0},
        owned: {value:0},
        trading: {value:0},
        wanting: {value:0},
        wishing: {value:0},
        numcomments: {value:0},
        numweights: {value:0},
        averageweight: {value:0},
      }
    }
  };
  @Input() last: boolean = false;
  constructor(public utils: UtilsService) { }

}
