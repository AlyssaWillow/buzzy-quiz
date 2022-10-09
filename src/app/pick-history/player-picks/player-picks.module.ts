import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerPicksComponent } from './player-picks.component';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';



@NgModule({
  declarations: [
    PlayerPicksComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ],
  exports: [
    PlayerPicksComponent
  ],
})
export class PlayerPicksModule { }
