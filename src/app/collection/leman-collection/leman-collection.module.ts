import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';
import { LemanCollectionComponent } from './leman-collection.component';

@NgModule({
  declarations: [
    LemanCollectionComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ],
  exports: [
    LemanCollectionComponent
  ],
  providers: []
})
export class LemanCollectionModule { }
