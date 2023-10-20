import { Component, Input, OnInit } from '@angular/core';
import { Players } from 'src/app/models/player-selection';
import { BoardGame } from 'src/app/models/collection';
import { Scenario } from 'src/app/models/play';
import { CycleDb, ScenarioDb2, ScenarioGame } from 'src/app/models/scenario';

@Component({
  selector: 'app-gs-scenarios-section',
  templateUrl: './gs-scenarios-section.component.html',
  styleUrls: ['./gs-scenarios-section.component.scss']
})
export class GsScenariosSectionComponent implements OnInit {

  @Input() scenarios: ScenarioGame[] = [];
  @Input() bothCol: BoardGame[] = [];
  @Input() cycles: CycleDb[] = [];
  @Input('scenarioDb') scenarioDb: ScenarioDb2[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
