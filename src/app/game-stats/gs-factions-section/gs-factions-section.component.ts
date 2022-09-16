import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Players } from 'src/app/home/player-selection';
import { BoardGame, GameCollection } from 'src/app/models/collection';
import { DisplayFactions, Faction, FactionCollection, factionDb, factionTypeData } from 'src/app/models/faction';
import { PlayDb } from 'src/app/models/play';
import { BoardGameGeekService } from 'src/app/services/board-game-geek.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gs-factions-section',
  templateUrl: './gs-factions-section.component.html',
  styleUrls: ['./gs-factions-section.component.scss']
})
export class GsFactionsSectionComponent implements OnInit {

  @Input() bothCol: BoardGame[] = [];
  @Input() factions: DisplayFactions[] = [];

  factionTypeData$: Observable<factionTypeData[]>;
  players$: Observable<Players[]>;

  factionTypeData: factionTypeData[];
  players: Players[];

  private playerCol: AngularFirestoreCollection<Players>;
  private factionTypeDataCol: AngularFirestoreCollection<factionTypeData>;

  constructor(public utils: UtilsService,
    private afs: AngularFirestore) {
    this.factionTypeDataCol = this.afs.collection('faction-type-data');
    this.playerCol = afs.collection('tabletop-syndicate').doc('player-data').collection('player-names');
    

    this.factionTypeData$ = this.factionTypeDataCol.valueChanges();
    this.players$ = this.playerCol.valueChanges();

    this.factionTypeData = [];
    this.players = [];
  }

  ngOnInit(): void {
    this.factionTypeData$.subscribe(factionTypeData => {
      this.factionTypeData = factionTypeData;
      this.factionTypeData.sort((a, b) => (a.order > b.order) ? 1 : -1)
    });

    this.players$.subscribe(players => {
      this.players = players;
    });
  }
}
