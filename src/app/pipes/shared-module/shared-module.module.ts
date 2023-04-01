import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionFilterPipe } from '../collection-filter.pipe';
import { ReplaceTextPipe } from '../replace-text.pipe';
import { selectedGamePipe } from '../selected-game.pipe';



@NgModule({
  declarations: [
    CollectionFilterPipe,
    ReplaceTextPipe,
    selectedGamePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CollectionFilterPipe,
    ReplaceTextPipe,
    selectedGamePipe
  ]
})
export class SharedModuleModule { }
