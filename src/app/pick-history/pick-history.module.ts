import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickHistoryComponent } from './pick-history.component';
import { GamesPlayedModule } from '../home/games-played/games-played.module';
import { PlayerPicksModule } from './player-picks/player-picks.module';
import { LeastPlayedModule } from './least-played/least-played.module';



@NgModule({
  declarations: [
    PickHistoryComponent
  ],
  imports: [
    CommonModule,
    GamesPlayedModule,
    PlayerPicksModule,
    LeastPlayedModule
  ],
  exports: [
    PickHistoryComponent
  ],
})
export class PickHistoryModule { }
