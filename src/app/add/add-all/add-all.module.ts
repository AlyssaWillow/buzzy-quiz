import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAllComponent } from './add-all.component';
import { AddCycleModule } from '../add-cycle/add-cycle.module';
import { AddPlayModule } from '../add-play/add-play.module';
import { AddFactionModule } from '../add-faction/add-faction.module';
import { AddScenarioModule } from '../add-scenario/add-scenario.module';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { AddFactionTypeModule } from '../add-faction-type/add-faction-type.module';
import { AddVideoModule } from '../add-video/add-video.module';
import { AddListModule } from '../add-list/add-list.module';
import { AddCountdownModule } from '../add-countdown/add-countdown.module';
import { EditAllFactionModule } from '../edit-all-faction/edit-all-faction.module';

@NgModule({
  declarations: [
    AddAllComponent
  ],
  imports: [
    CommonModule,
    AddCycleModule,
    AddPlayModule,
    AddFactionModule,
    AddVideoModule,
    AddScenarioModule,
    CdkAccordionModule,
    AddFactionTypeModule,
    AddCountdownModule,
    AddListModule,
    EditAllFactionModule
  ],
  exports: [
    AddAllComponent
  ],
})
export class AddAllModule { }
