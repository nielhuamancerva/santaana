import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { ListUserComponent } from './components/list-user/list-user.component';
import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';


@NgModule({
  declarations: [ListUserComponent],
  imports: [
    CommonModule,HttpClientModule,InlineSVGModule,CRUDTableModule,FormsModule,ReactiveFormsModule,UsersRoutingModule
  ]
})
export class UsersModule { }
