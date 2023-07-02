import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatsComponent } from './player-stats.component';

@NgModule({
  declarations: [
    PlayerStatsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlayerStatsComponent
  ]
})
export class PlayerStatsModule { }
