import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionFilterPipe, OrderByPipe } from '../collection-filter.pipe';
import { ReplaceTextPipe } from '../replace-text.pipe';
import { basePipe, expansionPipe, factionTypesPipe, selectedGamePipe, specificExpansionsPipe } from '../selected-game.pipe';
import { gameWinsByPlayer } from '../game-wins-by-player.pipe';



@NgModule({
  declarations: [
    CollectionFilterPipe,
    ReplaceTextPipe,
    selectedGamePipe,
    basePipe,
    expansionPipe,
    specificExpansionsPipe,
    factionTypesPipe,
    OrderByPipe,
    gameWinsByPlayer
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
    OrderByPipe,
    gameWinsByPlayer
  ]
})
export class SharedModuleModule { }
