import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeastPlayedComponent } from './least-played.component';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';



@NgModule({
  declarations: [
    LeastPlayedComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ],
  exports: [
    LeastPlayedComponent
  ],
})
export class LeastPlayedModule { }
