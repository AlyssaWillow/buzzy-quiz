import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStatsComponent } from './game-stats.component';
import { GsWinsSectionModule } from './gs-wins-section/gs-wins-section.module';
import { GsPlaysSectionModule } from './gs-plays-section/gs-plays-section.module';
import { GsFactionsSectionModule } from './gs-factions-section/gs-factions-section.module';
import { GsScenariosSectionModule } from './gs-scenarios-section/gs-scenarios-section.module';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GsGameDetailsModule } from './gs-game-details/gs-game-details.module';
import { SharedModuleModule } from '../pipes/shared-module/shared-module.module';
import { GsExpansionsModule } from './gs-expansions/gs-expansions.module';



@NgModule({
  declarations: [
    GameStatsComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    SharedModuleModule,
    FormsModule,
    GsWinsSectionModule,
    GsPlaysSectionModule,
    GsFactionsSectionModule,
    GsScenariosSectionModule,
    GsGameDetailsModule,
    GsExpansionsModule
  ],
  exports: [
    GameStatsComponent
  ]
})
export class GameStatsModule { }
