import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CollectionComponent } from './collection/collection.component';
import { ConventionShirtsComponent } from './convention-shirts/convention-shirts.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { AddPlayComponent } from './add/add-play/add-play.component';
import { AddFactionComponent } from './add/add-faction/add-faction.component';
import { AddScenarioComponent } from './add/add-scenario/add-scenario.component';
import { AddCycleComponent } from './add/add-cycle/add-cycle.component';
import { AddAllComponent } from './add/add-all/add-all.component';
import { PickHistoryComponent } from './pick-history/pick-history.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';

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
    path: 'game-stats', 
    pathMatch: 'full',  
    component: GameStatsComponent,
    data: {
      title: 'Game Stats'
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
    path: 'pick-history', 
    pathMatch: 'full',  
    component: PickHistoryComponent,
    data: {
      title: 'Play History'
    }
  },
  { 
    path: 'player-stats', 
    pathMatch: 'full',  
    component: PlayerStatsComponent,
    data: {
      title: 'Player Stats'
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
    path: 'add', 
    pathMatch: 'full',  
    component: AddAllComponent,
    data: {
      title: 'Add'
    }
  },
  { 
    path: 'add-play', 
    pathMatch: 'full',  
    component: AddPlayComponent,
    data: {
      title: 'Add Play'
    }
  },
  { 
    path: 'add-faction', 
    pathMatch: 'full',  
    component: AddFactionComponent,
    data: {
      title: 'Add Faction'
    }
  },
  { 
    path: 'add-scenario', 
    pathMatch: 'full',  
    component: AddScenarioComponent,
    data: {
      title: 'Add Scenario'
    }
  },
  { 
    path: 'add-cycle', 
    pathMatch: 'full',  
    component: AddCycleComponent,
    data: {
      title: 'Add Cycle'
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
