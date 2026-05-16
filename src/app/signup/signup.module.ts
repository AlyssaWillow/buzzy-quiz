import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule
    
  ],
  exports: [
    SignupComponent
  ],
  providers: [
    AuthenticationService,
    AngularFireAuthModule
  ],

})
export class SignupModule { }
