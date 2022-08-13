import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CurrentSelectionsModule } from './current-selections/current-selections.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CurrentSelectionsModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
