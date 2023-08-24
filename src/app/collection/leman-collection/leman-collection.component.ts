import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { XMLParser } from 'fast-xml-parser';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardGame } from 'src/app/models/collection';
import { GameGroups } from 'src/app/models/gameGroups';
import { Players } from 'src/app/models/player-selection';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { GameGroupService } from 'src/app/services/game-group.service';
import { UtilsService } from 'src/app/services/utils.service';

const options = {
  ignoreAttributes : false,
  attributeNamePrefix : "",
  parseTagValue: true,
  alwaysCreateTextNode: false,
  trimValues: true,
  textNodeName: "text"
};

@Component({
  selector: 'app-leman-collection',
  templateUrl: './leman-collection.component.html',
  styleUrls: ['./leman-collection.component.scss']
})
export class LemanCollectionComponent implements OnInit {
  @Input('player-count') players: number | undefined;
  @Input('time') time: number | undefined;
  @Input('collection') collections: string[] | undefined;
  @Input('title') title: string[] | undefined;
  gameGroupIdFromRoute: string | null = '';
  gameGroupPlayers: Players[] = [];
  gameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';

  baseUrl1: string = 'https://boardgamegeek.com/xmlapi/collection/';
  suffix1: string = '?own=1';

  genericCollection: BoardGame[] = [];

  private _genericCollection: BehaviorSubject<BoardGame[]> = new BehaviorSubject(this.genericCollection);
  public readonly genericCollection$: Observable<BoardGame[]> = this._genericCollection.asObservable();

  private _genericCollection2: BehaviorSubject<BoardGame[]> = new BehaviorSubject(this.genericCollection);
  public readonly genericCollection$2: Observable<BoardGame[]> = this._genericCollection2.asObservable();


  constructor(private boardGameGeekService: BoardGameGeekService,
    public utils: UtilsService,
              public defaultGameGroupId: GameGroupService,
              private afs: AngularFirestore) { 
    if (this.collections) {
    this.getSpecificCollections(this.collections);
    }
    
  }

  ngOnInit(): void {
    if (this.collections) {
      this.getSpecificCollections(this.collections);
    }
    this.defaultGameGroupId.selectedGameGroup$.subscribe(id => {
      this.gameGroupIdFromRoute = id;
    })
    this.afs.collection<GameGroups>('game-groups', ref => ref.where('id', '==', (this.gameGroupIdFromRoute ? this.gameGroupIdFromRoute : this.gameGroupId)))
    .valueChanges().subscribe(gameGroup =>{
      this.afs.collection('tabletop-syndicate').doc('player-data')
          .collection<Players>('player-names', ref => ref.where('id', 'in', gameGroup[0].members))
          .valueChanges().subscribe(playerz=>{
            this.gameGroupPlayers = playerz
      })
    })
  }

  getSpecificCollections = (bggIds: string[]) => {
    bggIds.forEach(id => {
      this._genericCollection.next(this.getCollectionGames(id));
    })
  }

  
  getCollectionGames(id: string): any {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const parser = new XMLParser(options);
            if (this._genericCollection?.getValue()) { 
              this._genericCollection.next(this._genericCollection.getValue()
                                                                  .concat(parser.parse(xhr.response).items.item)
                                                                  .sort((a, b) => (a.name.text > b.name.text) ? 1 : -1));
            } else {
              
              this._genericCollection.next(parser.parse(xhr.response).items.item);
            }
            return parser.parse(xhr.response).items.item;
          } else {
              console.error('error', xhr.response);
              return undefined;
          }
      }
    }
    xhr.open("GET", this.baseUrl1 + id + this.suffix1, true);
    xhr.send();
  }
  

  formatListOfNames = (players: string[]): string => {
    let count = players.length - 1;
    let rtnStr = ''
    players.forEach(player => {
      count--
      rtnStr += this.utils.getPlayerName(player, this.gameGroupPlayers)
      if(count === 0) {
        rtnStr += ' & '
      } else if (count > 0) {
        rtnStr += ', '
      } else {
        rtnStr += "'s Collection"
      }
    })
    return rtnStr
  }
}

