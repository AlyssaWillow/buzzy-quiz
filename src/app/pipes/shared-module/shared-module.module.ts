import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionFilterPipe } from '../collection-filter.pipe';
import { ReplaceTextPipe } from '../replace-text.pipe';
import { basePipe, expansionPipe, factionTypesPipe, selectedGamePipe, specificExpansionsPipe } from '../selected-game.pipe';
import { ImageByPlayerFilterPipe } from '../getGameImageByPlayer-filter.pipe';



@NgModule({
  declarations: [
    CollectionFilterPipe,
    ReplaceTextPipe,
    selectedGamePipe,
    basePipe,
    expansionPipe,
    specificExpansionsPipe,
    factionTypesPipe,
    ImageByPlayerFilterPipe
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
    ImageByPlayerFilterPipe
  ]
})
export class SharedModuleModule { }
