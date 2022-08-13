import { Pipe, PipeTransform } from '@angular/core';
import { BoardGame } from '../models/collection';

@Pipe({
  name: 'collectionFilter'
})
export class CollectionFilterPipe implements PipeTransform {

  transform(values: BoardGame[], ...args: any[]): BoardGame[] {
    return values
      .filter(v => {
        if (v !== null && v.stats !== null && v.stats.minplayers !== null ) {
          if (args[0] === 0) {
            return true;
          }
          return v.stats.minplayers <= args[0];
        } else {
          return false;
        }
      })
      .filter(v => {
        if (v !== null && v.stats !== null && v.stats.minplayers !== null ) {
          if (args[0] === 0) {
            return true;
          }
          return v.stats.maxplayers >= args[0]
        } else {
          return false;
        }
      })
      .filter(v => {
        if (v !== null && v.stats !== null && v.stats.minplayers !== null ) {
          if (args[1] === 0) {
            return true;
          }
          return v.stats.minplaytime <= args[1]
        } else {
          return false;
        }
      })
      .filter(v => {
        if (v !== null && v.stats !== null && v.stats.minplayers !== null ) {
          if (args[1] === 0) {
            return true;
          }
          return v.stats.maxplaytime >= args[1]
        } else {
          return false;
        }
      });
  }

}
