import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCountdownComponent } from './add-countdown.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';
import { AddFactionModule } from '../add-faction/add-faction.module';
import { AddScenarioModule } from '../add-scenario/add-scenario.module';



@NgModule({
  declarations: [
    AddCountdownComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule, 
    FormsModule,
    AddFactionModule,
    AddScenarioModule,
    SharedModuleModule
  ],
  exports: [
    AddCountdownComponent
  ],
})
export class AddCountdownModule { }
