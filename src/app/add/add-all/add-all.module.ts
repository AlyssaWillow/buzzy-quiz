import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAllComponent } from './add-all.component';
import { AddCycleModule } from '../add-cycle/add-cycle.module';
import { AddPlayModule } from '../add-play/add-play.module';
import { AddFactionModule } from '../add-faction/add-faction.module';
import { AddScenarioModule } from '../add-scenario/add-scenario.module';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { AddFactionTypeModule } from '../add-faction-type/add-faction-type.module';

@NgModule({
  declarations: [
    AddAllComponent
  ],
  imports: [
    CommonModule,
    AddCycleModule,
    AddPlayModule,
    AddFactionModule,
    AddScenarioModule,
    CdkAccordionModule,
    AddFactionTypeModule
  ],
  exports: [
    AddAllComponent
  ],
})
export class AddAllModule { }
