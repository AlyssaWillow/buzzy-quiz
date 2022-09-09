import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddScenarioComponent } from './add-scenario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    AddScenarioComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule, 
    FormsModule
  ],
  exports: [
    AddScenarioComponent
  ],
})
export class AddScenarioModule { }
