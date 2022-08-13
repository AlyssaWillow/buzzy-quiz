import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CollectionComponent } from './collection/collection.component';
import { ConventionShirtsComponent } from './convention-shirts/convention-shirts.component';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full',  
    component: HomeComponent,
    data: {
      title: 'Tabletop Syndicate'
    }
  },
  { 
    path: 'home', 
    pathMatch: 'full',  
    component: HomeComponent,
    data: {
      title: 'Tabletop Syndicate'
    }
  },
  { 
    path: 'collection', 
    pathMatch: 'full',  
    component: CollectionComponent,
    data: {
      title: 'Collection'
    }
  },
  { 
    path: 'shirts', 
    pathMatch: 'full',  
    component: ConventionShirtsComponent,
    data: {
      title: 'Convention Shirt History'
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
    path: '**', 
    pathMatch: 'full', 
    component: HomeComponent,
    data: {
      title: 'Tabletop Syndicate'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
