import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatsComponent } from './player-stats.component';
import { PsPieModule } from './ps-pie/ps-pie.module';



@NgModule({
  declarations: [
    PlayerStatsComponent
  ],
  imports: [
    CommonModule,
    PsPieModule
  ],
  exports: [
    PlayerStatsComponent
  ]
})
export class PlayerStatsModule { }
