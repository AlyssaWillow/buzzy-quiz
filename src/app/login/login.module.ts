import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule
    
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    AuthenticationService,
    AngularFireAuthModule
  ],

})
export class LoginModule { }
