import { Pipe, PipeTransform } from '@angular/core';
import { BoardGame } from '../models/collection';
import { factionDb3, factionTypeData } from '../models/faction';
import { nameId } from '../models/generic';
import { GameWin, playerWinDisplay } from '../models/analytics';

@Pipe({
  name: 'gameWinsByPlayer'
})
export class gameWinsByPlayer implements PipeTransform {
  transform(values: playerWinDisplay[], id: string): GameWin[] {
    console.log(id)
    return values.filter(v => v.playerId === id)[0]?.games
  }
}