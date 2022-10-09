import { Component, Input, OnInit } from '@angular/core';
import { GameDetails } from 'src/app/models/play';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gs-game-details',
  templateUrl: './gs-game-details.component.html',
  styleUrls: ['./gs-game-details.component.scss']
})
export class GsGameDetailsComponent implements OnInit {
  
  @Input() deets!: GameDetails;

  constructor(public utils: UtilsService) { }

  ngOnInit(): void {
  }

}
