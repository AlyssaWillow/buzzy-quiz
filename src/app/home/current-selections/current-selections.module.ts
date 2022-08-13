import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrentSelectionsComponent } from './current-selections.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    CurrentSelectionsComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule,
    FormsModule
  ],
  exports: [
    CurrentSelectionsComponent
  ]
})
export class CurrentSelectionsModule { }
