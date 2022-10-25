import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import * as xml2js from 'xml2js';
import { Observable, tap, catchError, retry, throwError, map, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GameCollection, BoardGame, AllBoardGames, AllBoardGame } from '../models/collection'; 
import { UtilsService } from './utils.service';
import { Players } from '../models/player-selection';

const botId: string = 'c474e678c86fa0c4ab1eb996b6';
const groupId: string = '40449537';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

interface PostData {
  text: string;
  bot_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class BotService {
  //{"text" : "Your message here", "bot_id" : "c474e678c86fa0c4ab1eb996b6"}' https://api.groupme.com/v3/bots/post
  url: string = 'https://api.groupme.com/v3/bots/post';
  botId: string = 'c474e678c86fa0c4ab1eb996b6'


  postData: PostData =  {
    text: "", 
    bot_id: this.botId
  }

  constructor(private http: HttpClient,
    private utils: UtilsService) { }



  makeBotTalkGameUpdate = (user: string, gameIds: string[], bothCol: BoardGame[], players: Players[]): any => {
    let words: string = "A syndicate member has made their pick! " + this.utils.getPlayerName(user, players) + " has picked"
    gameIds.forEach((ref, index) => {
      words += " " + this.utils.getGameName(ref, bothCol);
      if (gameIds.length > 2 && gameIds.length > index + 2) {
        words += ","
      }

      if (gameIds.length > 1 && gameIds.length === index + 2) {
        words += " &"
      }
    
    })
    this.postData.text = words;
    return this.http.post<PostData>(this.url, {"text" : words, "bot_id" : this.botId}).subscribe(ref => {
      console.log('posted', ref)
    })

  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 200) {
      console.log('successful');
    }
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  
}