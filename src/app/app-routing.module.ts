import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizControllerComponent } from './quiz-controller/quiz-controller.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full',  
    component: QuizComponent,
    data: {
      title: 'Buzzy Quiz'
    }
  },
  { 
    path: 'home', 
    pathMatch: 'full',  
    component: QuizComponent,
    data: {
      title: 'Buzzy Quiz'
    }
  },
  { 
    path: 'controller', 
    pathMatch: 'full',  
    component: QuizControllerComponent,
    data: {
      title: 'Buzzy Quiz'
    }
  },
  { 
    path: 'login', 
    pathMatch: 'full',  
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  { 
    path: 'create-account', 
    pathMatch: 'full',  
    component: SignupComponent,
    data: {
      title: 'Login'
    }
  },
  { 
    path: '**', 
    pathMatch: 'full', 
    component: QuizComponent,
    data: {
      title: 'Buzzy Quiz'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
