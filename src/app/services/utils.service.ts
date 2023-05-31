import { Injectable } from '@angular/core';
import { Players } from '../models/player-selection';
import { BoardGame, GameCollection, Link, ListType, textId } from '../models/collection';
import { cycle, nameId } from '../models/generic';
import { Timestamp } from '../models/play';
import { CycleDb, ScenarioDb2 } from '../models/scenario';
import { factionDb2 } from '../models/faction';
import { BoardGameGeekService } from './board-game-geek.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  idCol: string[] = [];
  collections: BoardGame[] = [];
  lemanCollection: BoardGame[] = [];
  hendricksonCollection: BoardGame[] = [];
  hendricksonOverflowCollection: BoardGame[] = [];

  constructor(private boardGameGeekService: BoardGameGeekService) {
  }

  getPlayerName = (id: string, players: Players[]): string => {
    let name: string = '';
      for(let player of players) {
        if (player?.id === id) {
          name = player.firstName;
        }
      }
      return name;
  }

  getOwnerName = (id: string): string => {
    let name: string = '';
    if (id === 'own-lem') {
      name = 'Leman';
    } else if (id === 'own-hen') {
      name = 'Hendrickson';
    } else if (id === 'own-bot') {
      name = 'Both'
    }
    return name;
  }

  getOwnerId = (name: string): string => {
    let id: string = '';
    if (name.toLocaleLowerCase() === 'leman') {
      id = 'own-lem';
    } else if (name.toLocaleLowerCase() === 'hendrickson' ||
               name.toLocaleLowerCase() === 'hendricksonOverflow') {
      id = 'own-hen';
    } else if (name.toLocaleLowerCase() === 'both') {
      id = 'own-bot'
    }
    return name;
  }

  getGameName = (id: string, gameCollection: BoardGame[]): string => {
    for(let game of gameCollection) {
      if (game?.objectid === id) {
        return game.name.text;
      } else if (id === "349998") {
        return "Tapestry: Arts & Architecture";
      }
    }
    return '';
}

getScenarioName = (id: string, scenariosFromDb: ScenarioDb2[]): string => {
  for(let scenario of scenariosFromDb) {
    if (scenario?.id === id) {
      return scenario.name;
    }
  }
  return '';
}

getCycleName = (id: string, cycleList: CycleDb[]): string => {
  for(let cycle of cycleList) {
    if (cycle?.id === id) {
      return (cycle.display ? cycle.name : '');
    }
  }
  return '';
}

getCycleNameAlwaysDisplay = (id: string, cycleList: CycleDb[], scenariosFromDb: ScenarioDb2[]): string => {
  for(let scenario of scenariosFromDb) {
    if (scenario?.id === id) {
      for(let cycle of cycleList) {
        if (cycle?.id === scenario.cycle) {
          return cycle.name;
        }
      }
    }
  }
  return '';
}


getFactionName = (id: string, factionList: nameId[]): string => {
  for(let faction of factionList) {
    if (faction?.id === id) {
      return faction.name;
    }
  }
  return '';
}

getListTypeName = (id: string, listTypes: ListType[]): string => {
  for(let listType of listTypes) {
    if (listType?.id === id) {
      return listType.name;
    }
  }
  return '';
}

getGameImage = (id: string, gameCollection: BoardGame[]): string => {
  for(let game of gameCollection) {
    if (game?.objectid === id) {
      return game.image;
    }
  }
  return '';
}

getGameYear = (id: string, gameCollection: BoardGame[]): string | null => {
  for(let game of gameCollection) {
    if (game?.objectid === id) {
      return game?.yearpublished;
    }
  }
  return '';
}

  getFactionTypeName = (list: nameId[], id: string): string => {
      for(let factionType of list) {
        if (factionType?.id === id) {
          return factionType.name;
        }
      }
      return ''
  }

  getDate = (date: Timestamp): string => {
    let dater: Date = new Date(parseInt(date.seconds) * 1000);
    let dateStr: string = '';
    if (dater.getMonth() + 1 < 10) {
      dateStr += '0' + (dater.getMonth() + 1);
    } else {
      dateStr += (dater.getMonth() + 1);
    }
    dateStr += '/';
    if (dater.getDate() + 1 < 10) {
      dateStr += '0' + (dater.getDate());
    } else {
      dateStr += (dater.getDate());
    }
    dateStr += '/';
    dateStr += dater.getFullYear();
    return dateStr;
  }

  getDateHyphen = (date: Timestamp): string => {
    let dater: Date = new Date(parseInt(date.seconds) * 1000);
    let dateStr: string = '';
    if (dater.getMonth() + 1 < 10) {
      dateStr += '0' + (dater.getMonth() + 1);
    } else {
      dateStr += (dater.getMonth() + 1);
    }
    dateStr += '-';
    if (dater.getDate() + 1 < 10) {
      dateStr += '0' + (dater.getDate());
    } else {
      dateStr += (dater.getDate());
    }
    dateStr += '-';
    dateStr += dater.getFullYear();
    return dateStr;
  }

  getDateHyphenYYYYMMDD = (date: Date | null): string => {
    let dateStr: string = '';
    if (date) {
      dateStr += date.getFullYear();
      dateStr += '-';
      if (date.getMonth() + 1 < 10) {
        dateStr += '0' + (date.getMonth() + 1);
      } else {
        dateStr += (date.getMonth() + 1);
      }
      dateStr += '-';
      if (date.getDate() < 10) {
        dateStr += '0' + (date.getDate());
      } else {
        dateStr += (date.getDate());
      }
    }
   
    return dateStr;
  }

  timestampToDate = (seconds: Timestamp): Date => {
    return new Date(Number(seconds.seconds));
  }

  castToTypeIdObject = (typeList: textId[]): textId => {
    return <textId><any> typeList;
  }

  castToTypeIdObjectLink = (typeList: Link[]): Link => {
    return <Link><any> typeList;
  }

  castLinkObjectToList = (typeList: any): Link[] => {
    if (typeList.length !== undefined && typeList.length > 0) {
      return typeList;
    } else {
      let list: Link[] = [];
      list.push(typeList);
      return list;
    }
  }

  setGameIds = (both: BoardGame[]): void => {
      both.forEach(game => {
        if (game && game.objectid && !this.idCol.includes(game.objectid)) {
          this.idCol.push(game.objectid);
        }
      })
  }

  getGameIds = (): string[] => {
    return this.idCol;
  }

  setCollections = (col: GameCollection, owner: string): void => {
    if (this.getOwnerId(owner) === 'own-lem') {
      this.lemanCollection = col?.item;
    } else if (this.getOwnerId(owner) === 'own-hen') {
      this.hendricksonCollection = col?.item;
    } else if (this.getOwnerId(owner) === 'henOver') {
      this.hendricksonOverflowCollection = col?.item;
    }
  }

  aggregateCollections = (col: GameCollection, owner: string): void => {
    this.setCollections(col, owner);

    col?.item?.forEach(game => {
      if (!this.collections?.find(e => e.objectid === game.objectid)) {
        game.owner = this.getOwnerId(owner);
        this.collections?.push(game);
      } else {
        this.collections?.find(e => { 
          if(e.objectid === game.objectid && game.owner !== this.getOwnerId(owner)) {
            game.owner = 'own-bot'
          }
        })
      }
    }); 
    this.collections?.sort((a, b) => (a.name.text < b.name.text) ? 1 : -1)
  }

  getAggregateCollections = (): BoardGame[] => {
    return this.collections;
  }
}
