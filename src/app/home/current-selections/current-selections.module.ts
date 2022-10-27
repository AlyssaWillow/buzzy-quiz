import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrentSelectionsComponent } from './current-selections.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';

@NgModule({
  declarations: [
    CurrentSelectionsComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    DragDropModule,
    FormsModule,
    SharedModuleModule
  ],
  exports: [
    CurrentSelectionsComponent
  ]
})
export class CurrentSelectionsModule { }
