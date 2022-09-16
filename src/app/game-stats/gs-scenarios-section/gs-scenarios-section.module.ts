import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsScenariosSectionComponent } from './gs-scenarios-section.component';
import { GsSnGameScenarioComponent } from './gs-sn-game-scenario/gs-sn-game-scenario.component';
import { GsSnGameScenarioModule } from './gs-sn-game-scenario/gs-sn-game-scenario.module';



@NgModule({
  declarations: [
    GsScenariosSectionComponent
  ],
  imports: [
    CommonModule,
    GsSnGameScenarioModule
  ],
  exports: [
    GsScenariosSectionComponent
  ],
})
export class GsScenariosSectionModule { }
