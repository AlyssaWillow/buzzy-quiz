import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
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
import { CommonModule } from '@angular/common';
import { UtilsService } from './services/utils.service';
import { MatNativeDateModule } from '@angular/material/core';
import { QuizControllerModule } from './quiz-controller/quiz-controller.module';
import { SlimHeaderModule } from './slim-header/slim-header.module';
import { QuizModule } from './quiz/quiz.module';
import { SignupModule } from './signup/signup.module';

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
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    LoginModule,
    SignupModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    HotToastModule.forRoot(),
    BrowserAnimationsModule,
    MatNativeDateModule,
    QuizControllerModule,
    QuizModule,
    SlimHeaderModule
  ],
  providers: [
    AuthenticationService,
    UtilsService,
    AngularFireAuthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }