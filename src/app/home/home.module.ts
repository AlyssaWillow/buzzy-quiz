import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CurrentSelectionsModule } from './current-selections/current-selections.module';
import { GamesPlayedModule } from './games-played/games-played.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CurrentSelectionsModule,
    GamesPlayedModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
