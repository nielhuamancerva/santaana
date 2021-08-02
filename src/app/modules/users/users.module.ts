import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUserComponent } from './components/list-user/list-user.component';
import { UsersRoutingModule } from './users-routing.module';


@NgModule({
  declarations: [ListUserComponent],
  imports: [
    CommonModule,UsersRoutingModule
  ]
})
export class UsersModule { }
