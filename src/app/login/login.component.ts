import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    AuthenticationService,
    AngularFireAuthModule
  ]
})
export class LoginComponent {
 
  email: string = '';
  password: string = '';
  constructor(public authenticationService: AuthenticationService,
    private router: Router ) {}
  signUp() {
    this.authenticationService.SignUp(this.email, this.password);
    this.email = ''; 
    this.password = '';
  }
  signIn() {
    this.authenticationService.SignIn(this.email, this.password);
    this.email = ''; 
    this.password = '';
    this.router.navigate(['/']);
  }
  signOut() {
    this.authenticationService.SignOut();
  }
}