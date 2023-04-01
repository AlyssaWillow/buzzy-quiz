import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPlayComponent } from './add-play.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddFactionModule } from '../add-faction/add-faction.module';
import { AddScenarioModule } from '../add-scenario/add-scenario.module';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';



@NgModule({
  declarations: [
    AddPlayComponent
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
    AddPlayComponent
  ],
})
export class AddPlayModule { }
