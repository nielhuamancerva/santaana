import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule, Router } from '@angular/router';
import { InternalUsersComponent} from './internal-users.component';
import { InternalUserComponent} from './internal-user/internal-user.component';
import { ListInternalUserComponent } from './list-internal-user/list-internal-user.component';

const routes: Routes = [
  {
    path: '',
    component: InternalUsersComponent,
    children: [
      {
        path: 'internal-user',
        component: InternalUserComponent,
      },
      {
        path: 'list-internal-user',
        component: ListInternalUserComponent,
      },
      { path: '', redirectTo: 'list-internal-user', pathMatch: 'full' },
      { path: '**', redirectTo: 'list-internal-user', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class InternalUsersRoutingModule { }