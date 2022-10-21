import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsExpansionsComponent } from './gs-expansions.component';
import { GsEExansionGameModule } from './gs-e-exansion-game/gs-e-exansion-game.module';



@NgModule({
  declarations: [
    GsExpansionsComponent
  ],
  imports: [
    CommonModule,
    GsEExansionGameModule
  ],
  exports: [
    GsExpansionsComponent
  ],
})
export class GsExpansionsModule { }
