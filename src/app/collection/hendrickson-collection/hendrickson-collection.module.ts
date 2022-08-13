import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HendricksonCollectionComponent } from './hendrickson-collection.component';
import { CollectionFilterPipe } from 'src/app/pipes/collection-filter.pipe';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';

@NgModule({
  declarations: [
    HendricksonCollectionComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ],
  exports: [
    HendricksonCollectionComponent
  ],
  providers: [    
  ]
})
export class HendricksonCollectionModule { }
