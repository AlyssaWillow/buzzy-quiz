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

@Pipe({
  name: "orderBy",
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], type: "asc" | "desc" = "asc"): any[] {
    return value.sort((a, b) => {
      if (type === "asc") {
        return a.order - b.order;
      } else if (type === "desc") {
        return b.order - a.order;
      }
      return 0;
    });
  }
}
