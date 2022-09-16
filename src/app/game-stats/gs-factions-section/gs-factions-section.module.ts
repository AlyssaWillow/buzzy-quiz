import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsFactionsSectionComponent } from './gs-factions-section.component';
import { GsFnGameFactionModule } from './gs-fn-game-faction/gs-fn-game-faction.module';



@NgModule({
  declarations: [
    GsFactionsSectionComponent
  ],
  imports: [
    CommonModule,
    GsFnGameFactionModule
  ],
  exports: [
    GsFactionsSectionComponent
  ],
})
export class GsFactionsSectionModule { }
