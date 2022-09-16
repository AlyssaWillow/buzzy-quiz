import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCycleComponent } from './add-cycle.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    AddCycleComponent
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
    AddCycleComponent
  ],
})
export class AddCycleModule { }
