import { Pipe, PipeTransform } from '@angular/core';
import { BoardGame, ListPlayerGame } from '../models/collection';

@Pipe({
  name: 'getGameImageByPlayer'
})
export class ImageByPlayerFilterPipe implements PipeTransform {
  transform(values: ListPlayerGame[], ...args: any[]): string {
    return values
      .filter(v => {
        if (v !== null) {
          if (args[0] === v.playerId) {
            return true;
          }
          return false;
        } else {
          return false;
        }
      })[0].game.image   
     
  }

}
