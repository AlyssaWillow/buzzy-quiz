import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizControllerComponent } from './quiz-controller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    QuizControllerComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule, 
    FormsModule,
  ],
  exports: [
    QuizControllerComponent
  ],
})
export class QuizControllerModule { }
