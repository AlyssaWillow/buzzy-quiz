import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CurrentSelectionsModule } from './current-selections/current-selections.module';
import { GamesPlayedModule } from './games-played/games-played.module';
import { PrepareForGnModule } from './prepare-for-gn/prepare-for-gn.module';
import { CountdownModule } from './countdown/countdown.module';



@NgModule({
    declarations: [
        HomeComponent
    ],
    exports: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        CurrentSelectionsModule,
        GamesPlayedModule,
        PrepareForGnModule,
        CountdownModule
    ]
})
export class HomeModule { }
