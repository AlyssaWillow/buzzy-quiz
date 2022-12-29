import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatsComponent } from './player-stats.component';
import { PsPieModule } from './ps-pie/ps-pie.module';
import { PsWinsByWeekModule } from './ps-wins-by-week/ps-wins-by-week.module';



@NgModule({
  declarations: [
    PlayerStatsComponent
  ],
  imports: [
    CommonModule,
    PsPieModule,
    PsWinsByWeekModule
  ],
  exports: [
    PlayerStatsComponent
  ]
})
export class PlayerStatsModule { }
