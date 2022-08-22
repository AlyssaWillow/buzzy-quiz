import { Injectable } from '@angular/core';
import { Players } from '../home/player-selection';
import { Timestamp } from '../models/play';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getPlayerName = (id: string, players: Players[]): string => {
    for(let player of players) {
      if (player.id === id) {
        return player.firstName;
      }
    }
    return ''
  }


  getDate = (date: Timestamp): string => {
    console.log(date.seconds)
    let dater: Date = new Date(parseInt(date.seconds) * 1000);
    console.log(dater)
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
