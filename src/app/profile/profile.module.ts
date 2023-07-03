import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { PlayerStatsModule } from '../player-stats/player-stats.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    PlayerStatsModule,
    RouterModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
