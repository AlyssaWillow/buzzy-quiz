import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from '../home/player-selection';
import { BoardGame } from '../models/collection';
import { factionTypeData } from '../models/faction';
import { Timestamp } from '../models/play';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  players$: Observable<Players[]>;
  factionType$: Observable<factionTypeData[]>;

  private playerCol: AngularFirestoreCollection<Players>;
  private factionTypeCol: AngularFirestoreCollection<factionTypeData>;

  constructor(private afs: AngularFirestore) {
    this.playerCol = this.afs.collection('tabletop-syndicate').doc('player-data').collection('player-names');
    this.factionTypeCol = this.afs.collection('faction-type-data');

    this.players$ = this.playerCol.valueChanges();
    this.factionType$ = this.factionTypeCol.valueChanges();
  }

  getPlayerName = (id: string, players: Players[]): string => {
      for(let player of players) {
        if (player.id === id) {
          return player.firstName;
        }
      }
      return '';
  }

  getGameName = (id: string, gameCollection: BoardGame[]): string => {
    for(let game of gameCollection) {
      if (game.objectid === id) {
        return game.name.text;
      }
    }
    return '';
}

getGameImage = (id: string, gameCollection: BoardGame[]): string => {
  for(let game of gameCollection) {
    if (game.objectid === id) {
      return game.image;
    }
  }
  return '';
}

  getFactionTypeName = (id: string): string => {
    this.factionType$.subscribe((factionTypes: factionTypeData[]) => {
      for(let factionType of factionTypes) {
        if (factionType.id === id) {
          return factionType.name;
        }
      }
      return ''
    });
    return '';
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
      dateStr += '0' + (dater.getDate() + 1);
    } else {
      dateStr += (dater.getDate() + 1);
    }
    dateStr += '/';
    dateStr += dater.getFullYear();
    return dateStr;
  }
}
