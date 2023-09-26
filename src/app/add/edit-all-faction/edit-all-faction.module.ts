import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAllFactionComponent } from './edit-all-faction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    EditAllFactionComponent
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
    EditAllFactionComponent
  ],
})
export class EditAllFactionModule { }
