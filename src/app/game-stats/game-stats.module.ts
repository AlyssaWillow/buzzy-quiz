import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStatsComponent } from './game-stats.component';



@NgModule({
  declarations: [
    GameStatsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GameStatsComponent
  ]
})
export class GameStatsModule { }
