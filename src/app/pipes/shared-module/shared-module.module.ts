import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionFilterPipe, OrderByPipe } from '../collection-filter.pipe';
import { ReplaceTextPipe } from '../replace-text.pipe';
import { basePipe, expansionPipe, factionTypesPipe, selectedGamePipe, specificExpansionsPipe } from '../selected-game.pipe';



@NgModule({
  declarations: [
    CollectionFilterPipe,
    ReplaceTextPipe,
    selectedGamePipe,
    basePipe,
    expansionPipe,
    specificExpansionsPipe,
    factionTypesPipe,
    OrderByPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CollectionFilterPipe,
    ReplaceTextPipe,
    selectedGamePipe,
    expansionPipe,
    basePipe,
    specificExpansionsPipe,
    factionTypesPipe,
    OrderByPipe
  ]
})
export class SharedModuleModule { }
