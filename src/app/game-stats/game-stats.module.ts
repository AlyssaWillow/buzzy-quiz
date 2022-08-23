import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStatsComponent } from './game-stats.component';
import { GsWinsSectionModule } from './gs-wins-section/gs-wins-section.module';
import { GsPlaysSectionModule } from './gs-plays-section/gs-plays-section.module';



@NgModule({
  declarations: [
    GameStatsComponent
  ],
  imports: [
    CommonModule,
    GsWinsSectionModule,
    GsPlaysSectionModule
  ],
  exports: [
    GameStatsComponent
  ]
})
export class GameStatsModule { }
