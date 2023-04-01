import { Pipe, PipeTransform } from '@angular/core';
import { BoardGame } from '../models/collection';

@Pipe({
  name: 'selectedGameFilter'
})
export class selectedGamePipe implements PipeTransform {
  transform(values: BoardGame[], ...args: any[]): BoardGame[] {
    return values
      .filter(v => {
        if (v !== null && v.objectid !== null) {
          if (args[0] === null) {
            return true;
          } else if (v.objectid === args[0][0].objectid) {
            return true
          } else {
              let expIds: string[] = args[0][1].map((a: { objectid: BoardGame; }) => a.objectid);
              return (expIds.includes(v.objectid));
          }
        } else {
          return false;
        }
      })
  }
}
