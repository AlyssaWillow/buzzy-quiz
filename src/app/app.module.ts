import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
// import { HotToastModule } from '@ngneat/hot-toast';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UtilsService } from './services/utils.service';
import { MatNativeDateModule } from '@angular/material/core';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { QuizControllerComponent } from './quiz-controller/quiz-controller.component';
import { QuizComponent } from './quiz/quiz.component';
import { SignupComponent } from './signup/signup.component';
import { SlimHeaderComponent } from './slim-header/slim-header.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AdminComponent,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    HeaderComponent,
    FormsModule,
    HomeComponent,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    LoginComponent,
    SignupComponent,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    // HotToastModule.forRoot(),
    BrowserAnimationsModule,
    MatNativeDateModule,
    QuizControllerComponent,
    QuizComponent,
    AdminComponent,
    SlimHeaderComponent
  ],
  providers: [
    AuthenticationService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }