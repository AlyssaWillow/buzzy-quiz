import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionComponent } from './collection.component';
import { LemanCollectionModule } from './leman-collection/leman-collection.module';
import { BrowserModule } from '@angular/platform-browser';
import { BoardGameGeekService } from '../services/board-game-geek.service';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { HendricksonCollectionModule } from './hendrickson-collection/hendrickson-collection.module';



@NgModule({
  declarations: [
    CollectionComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatSelectModule,
    LemanCollectionModule,
    HendricksonCollectionModule,
    FormsModule
  ],
  exports: [
    CollectionComponent
  ]
})
export class CollectionModule { }
