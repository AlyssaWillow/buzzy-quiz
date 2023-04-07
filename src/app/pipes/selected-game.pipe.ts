import { Pipe, PipeTransform } from '@angular/core';
import { BoardGame } from '../models/collection';
import { factionDb2, factionTypeData } from '../models/faction';
import { nameId } from '../models/generic';

@Pipe({
  name: 'expansionGameFilter'
})
export class expansionPipe implements PipeTransform {
  transform(values: BoardGame[], ...args: any[]): BoardGame[] {
    return values
      .filter(v => {
        if (v !== null && v.objectid !== null) {
          if (args[0] === null) {
            return true;
          } else {
              return (args.includes(v.objectid));
          }
        } else {
          return false;
        }
      })
  }
}

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
          } else if (v.objectid === args[0][0]?.objectid) {
            return true
          } else {
              let expIds: string[] = args[0][1]?.map((a: { objectid: BoardGame; }) => a.objectid);
              return (expIds?.includes(v.objectid));
          }
        } else {
          return false;
        }
      })
  }
}

@Pipe({
  name: 'baseGameFilter'
})
export class basePipe implements PipeTransform {
  transform(values: BoardGame[], ...args: any[]): BoardGame[] {
    return values
      .filter(v => {
        if (v !== null && v.objectid !== null) {
          if (args[0] === null) {
            return true;
          } else {
              return (!args.includes(v.objectid));
          }
        } else {
          return false;
        }
      })
  }
}

@Pipe({
  name: 'specificExpansionFilter'
})
export class specificExpansionsPipe implements PipeTransform {
  transform(values: BoardGame[], ...args: any[]): BoardGame[] {
    return values
      .filter(v => {
        if (v !== null && v.objectid !== null) {
          if (args[0] === null) {
            return true;
          } else {
              return args[0][1].get(args[0][0])?.includes(v.objectid);
          }
        } else {
          return false;
        }
      })
  }
}

@Pipe({
  name: 'factionTypesFilter'
})
export class factionTypesPipe implements PipeTransform {
  transform(values: nameId[], ...args: any[]): nameId[] {
    return values
      .filter(v => {
        if (v !== null) {
          if (args[0] === null) {
            return true;
          } else {
            return args[0][0]
              .filter((f: factionDb2) => f.gameId === args[0][1])
              .map((m: any)=>m.typeId)
              .filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index)
              .includes(v.id);
          }
        } else {
          return false;
        }
      })
  }
}