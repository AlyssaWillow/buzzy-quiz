import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionFilterPipe } from '../collection-filter.pipe';
import { ReplaceTextPipe } from '../replace-text.pipe';



@NgModule({
  declarations: [
    CollectionFilterPipe,
    ReplaceTextPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CollectionFilterPipe,
    ReplaceTextPipe
  ]
})
export class SharedModuleModule { }
