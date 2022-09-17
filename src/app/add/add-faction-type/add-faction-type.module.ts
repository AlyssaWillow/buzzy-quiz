import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFactionTypeComponent } from './add-faction-type.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    AddFactionTypeComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule, 
    FormsModule
  ],
  exports: [
    AddFactionTypeComponent
  ],
})
export class AddFactionTypeModule { }
