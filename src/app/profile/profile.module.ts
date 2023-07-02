import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { PlayerStatsModule } from '../player-stats/player-stats.module';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    PlayerStatsModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
