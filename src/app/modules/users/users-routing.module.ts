import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersGestorComponent } from './users-gestor.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: UsersGestorComponent,
    children: [
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'user/list',
        component: UserComponent
      },
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: '**', redirectTo: 'user', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
