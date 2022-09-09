import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NavigationModule } from './navigation/navigation.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { HotToastModule } from '@ngneat/hot-toast';
import { LoginModule } from './login/login.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { CollectionModule } from './collection/collection.module';
import { CommonModule } from '@angular/common';
import { LemanCollectionModule } from './collection/leman-collection/leman-collection.module';
import { BoardGameGeekService } from './services/board-game-geek.service';
import { ConventionShirtsComponent } from './convention-shirts/convention-shirts.component';
import { ConventionShirtsModule } from './convention-shirts/convention-shirts.module';
import { GameStatsModule } from './game-stats/game-stats.module';
import { UtilsService } from './services/utils.service';
import { AddPlayModule } from './add/add-play/add-play.module';
import { MatNativeDateModule } from '@angular/material/core';
import { AddFactionModule } from './add/add-faction/add-faction.module';
import { AddScenarioModule } from './add/add-scenario/add-scenario.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    HeaderModule,
    FormsModule,
    HomeModule,
    CollectionModule,
    ConventionShirtsModule,
    GameStatsModule,
    LemanCollectionModule,
    NavigationModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    LoginModule,
    LemanCollectionModule,
    AddPlayModule,
    AddFactionModule,
    AddScenarioModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    HotToastModule.forRoot(),
    BrowserAnimationsModule,
    MatNativeDateModule
  ],
  providers: [
    AuthenticationService,
    BoardGameGeekService,
    UtilsService,
    AngularFireAuthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }