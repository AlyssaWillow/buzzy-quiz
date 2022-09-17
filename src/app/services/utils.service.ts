import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from '../home/player-selection';
import { BoardGame } from '../models/collection';
import { factionTypeData } from '../models/faction';
import { nameId } from '../models/generic';
import { Timestamp } from '../models/play';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private afs: AngularFirestore) {
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

  getGameName = (id: string, gameCollection: BoardGame[]): string => {
    for(let game of gameCollection) {
      if (game?.objectid === id) {
        return game.name.text;
      }
    }
    return '';
}

getCycleName = (id: string, cycleList: nameId[]): string => {
  for(let cycle of cycleList) {
    if (cycle?.id === id) {
      return cycle.name;
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
}
