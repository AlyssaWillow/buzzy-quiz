import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAllComponent } from './add-all.component';
import { AddCycleModule } from '../add-cycle/add-cycle.module';
import { AddPlayModule } from '../add-play/add-play.module';
import { AddFactionModule } from '../add-faction/add-faction.module';
import { AddScenarioModule } from '../add-scenario/add-scenario.module';
import {CdkAccordionModule} from '@angular/cdk/accordion';

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
    CdkAccordionModule
  ],
  exports: [
    AddAllComponent
  ],
})
export class AddAllModule { }
