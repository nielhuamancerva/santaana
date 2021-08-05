import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule} from '@angular/router';
import { ListUserComponent } from './components/list-user/list-user.component';
const routes: Routes = [
  {
    path: '',
    component: ListUserComponent,
  },
  {
    path: 'list',
    component: ListUserComponent,
  },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: '**', redirectTo: 'users', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
