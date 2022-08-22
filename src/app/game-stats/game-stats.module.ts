import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStatsComponent } from './game-stats.component';
import { GsWinsSectionModule } from './gs-wins-section/gs-wins-section.module';



@NgModule({
  declarations: [
    GameStatsComponent
  ],
  imports: [
    CommonModule,
    GsWinsSectionModule
  ],
  exports: [
    GameStatsComponent
  ]
})
export class GameStatsModule { }
