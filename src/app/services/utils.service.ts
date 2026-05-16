import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Players } from '../home/player-selection';

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
}
