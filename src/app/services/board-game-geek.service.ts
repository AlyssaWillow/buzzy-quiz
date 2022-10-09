import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import * as xml2js from 'xml2js';
import { Observable, tap, catchError, retry, throwError, map, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GameCollection, BoardGame, AllBoardGames, AllBoardGame } from '../models/collection'; 

const options = {
  ignoreAttributes : false,
  attributeNamePrefix : "",
  parseTagValue: true,
  alwaysCreateTextNode: false,
  trimValues: true,
  textNodeName: "text"
};

@Injectable({
  providedIn: 'root'
})
export class BoardGameGeekService implements OnInit {
  baseUrl1: string = 'https://boardgamegeek.com/xmlapi/collection/';
  baseUrl2: string = 'https://boardgamegeek.com/xmlapi2/collection?username=';
  leman: string = 'Bluexeclipse';
  hendrickson: string = 'sammysandwich';
  suffix1: string = '?own=1';
  suffix2: string = '&stats=1&own=1';


  lemanCollection: GameCollection = {
    totalitems: 0,
    termsofuse: '',
    pubdate: '',
    item: []
  };

  hendricksonCollection: GameCollection = {
    totalitems: 0,
    termsofuse: '',
    pubdate: '',
    item: []
  };

  listOfCollection: AllBoardGames = {
    termsofuse: null,
    boardgame: []
  };

  listOfExpansion: AllBoardGame[] = [];

  private _lemanCollection: BehaviorSubject<GameCollection> = new BehaviorSubject(this.lemanCollection);
  public readonly lemanCollection$: Observable<GameCollection> = this._lemanCollection.asObservable();

  private _hendricksonCollection: BehaviorSubject<GameCollection> = new BehaviorSubject(this.hendricksonCollection);
  public readonly hendricksonCollection$: Observable<GameCollection> = this._hendricksonCollection.asObservable();

  private _listOfCollection: BehaviorSubject<AllBoardGames> = new BehaviorSubject(this.listOfCollection);
  public readonly listOfCollection$: Observable<AllBoardGames> = this._listOfCollection.asObservable();

  private _listOfExpansions: BehaviorSubject<AllBoardGame[]> = new BehaviorSubject(this.listOfExpansion);
  public readonly listOfExpansions$: Observable<AllBoardGame[]> = this._listOfExpansions.asObservable();

  constructor() { }

  ngOnInit(): void {
    this.getCollections();
  }

  getCollections() {
    this._lemanCollection.next(this.getLemanGames());
    this._hendricksonCollection.next(this.getHendricksonGames());
  }
  
  getLemanGames(): any {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const parser = new XMLParser(options);
            this._lemanCollection.next(parser.parse(xhr.response).items);
            return parser.parse(xhr.response);
          } else {
              console.error('error', xhr.response);
              return undefined;
          }
      }
    }
    xhr.open("GET", this.baseUrl1 + this.leman + this.suffix1, true);
    xhr.send();
  }

  getHendricksonGames(): any {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const parser = new XMLParser(options);
            
            this._hendricksonCollection.next(parser.parse(xhr.response).items);
            return parser.parse(xhr.response);
          } else {
              console.error('error', xhr.response);
              return undefined;
          }
      }
    }
    xhr.open("GET", this.baseUrl1 + this.hendrickson + this.suffix1, true);
    xhr.send();
  }

  getlistOfGames(strList: string[]): any {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const parser = new XMLParser(options);
            this._listOfCollection.next(parser.parse(xhr.response).boardgames);
            return parser.parse(xhr.response);
          } else {
              console.error('error', xhr.response);
              return undefined;
          }
      }
    }
    let url = "http://localhost:4200/xmlapi/boardgame/" + strList.join(",")
    xhr.open("GET", url, true);
    xhr.send();
  }

  getlistOfExpansions(strList: string[]): any {
    if (strList && strList.length > 0) {
      
      let boardGameList: AllBoardGame[] = [];
      
      let xhr = new XMLHttpRequest();
      let interval = 500;
      let limit: number = 500;
      let offset: number = 0;
      do {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                const parser = new XMLParser(options);
                boardGameList = [...boardGameList, ...parser.parse(xhr.response).boardgames.boardgame];
                if (limit >= strList.length) {
                  this._listOfExpansions.next(boardGameList);
                }
                return parser.parse(xhr.response);
              } else {
                  console.error('error', xhr.response);
                  return undefined;
              }
          }
        }
        let url = "http://localhost:4200/xmlapi/boardgame/" + strList.slice(offset, limit).join(",")
      
      xhr.open("GET", url, true);
      xhr.send();
        offset += interval;
        limit += interval;
      } while(limit < (strList.length + interval))
    
  }
}
  
}