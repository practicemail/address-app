import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsComponent } from './friends/friends.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
    },
  {
    path: '',
    redirectTo: '/address-book',
    pathMatch: 'full'
  },
  {
    path: 'address-book',
    component: FriendsComponent,
  },
  { path: '404',
    component: NotFoundComponent
  },
  { path: '**',
    redirectTo: '404'
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
